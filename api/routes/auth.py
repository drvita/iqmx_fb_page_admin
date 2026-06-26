from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from sqlalchemy.orm import Session as DBSession, selectinload
import logging

from api.db.database import get_db, SessionLocal
import api.models as db_models
from api.helpers.facebook import (
    verify_facebook_token,
    exchange_long_lived_token,
    get_facebook_user_pages
)
from api.helpers.auth import create_jwt_token, decode_jwt_token
from api.helpers.sync import sync_page_data

logger = logging.getLogger("fb_page_admin_api.routes.auth")

security = HTTPBearer()

def sync_page_data_task_wrapper(page_id: int):
    """
    Background task wrapper to run sync_page_data with a fresh DB session.
    """
    db = SessionLocal()
    try:
        sync_page_data(db, page_id)
    except Exception as e:
        logger.error(f"Background sync failed for page ID {page_id}: {str(e)}")
    finally:
        db.close()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: DBSession = Depends(get_db)):
    """
    Validates the JWT token from the Authorization Bearer header.
    Returns the authenticated user object.
    """
    token = credentials.credentials
    payload = decode_jwt_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session token"
        )
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload missing subject"
        )
    user = db.query(db_models.User).options(
        selectinload(db_models.User.roles),
        selectinload(db_models.User.facebook_pages)
    ).filter(db_models.User.id == int(user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authenticated user not found"
        )
    return user
router = APIRouter(
    prefix="/api/auth",
    tags=["authentication"]
)

class FacebookAuthData(BaseModel):
    accessToken: str
    expiresIn: int
    signedRequest: str
    userID: str

@router.post("/facebook-login")
def facebook_login(auth_data: FacebookAuthData, background_tasks: BackgroundTasks, db: DBSession = Depends(get_db)):
    logger.info("==============================================================")
    logger.info("🎯 FACEBOOK LOGIN PROCESS STARTED")
    logger.info(f"👤 Facebook User ID: {auth_data.userID}")
    logger.info("==============================================================")
    
    # 1. Validate the Facebook access token
    fb_user = verify_facebook_token(auth_data.accessToken)
    if not fb_user or fb_user.get("id") != auth_data.userID:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Facebook access token"
        )
    
    # 2. Exchange short-lived token for a long-lived user access token (~60 days)
    long_lived_token = exchange_long_lived_token(auth_data.accessToken)
    
    # 3. Fetch or register user in local database
    user = db.query(db_models.User).filter(
        db_models.User.facebook_user_id == auth_data.userID
    ).first()
    
    if not user:
        # Register new user
        user = db_models.User(
            facebook_user_id=auth_data.userID,
            name=fb_user.get("name", "Facebook User"),
            email=fb_user.get("email")
        )
        db.add(user)
        db.flush()  # Retrieve auto-generated user ID
        
        # Assign standard 'user' role by default
        user_role = db.query(db_models.Role).filter(db_models.Role.name == "user").first()
        if user_role:
            user.roles.append(user_role)
            logger.info(f"New user registered. Assigned 'user' role to local ID: {user.id}")
    else:
        # Update profile info if changed
        user.name = fb_user.get("name", user.name)
        if fb_user.get("email"):
            user.email = fb_user.get("email")
        logger.info(f"Existing user logged in. Local ID: {user.id}")
    
    # 4. Fetch and store/update Facebook pages linked to this user
    fb_pages = get_facebook_user_pages(long_lived_token)
    logger.info(f"Found {len(fb_pages)} Facebook pages linked to the user.")
    
    for page_data in fb_pages:
        page_id = page_data.get("id")
        page_name = page_data.get("name")
        page_token = page_data.get("access_token")
        
        if page_id and page_name and page_token:
            # Check if page already exists in the database
            existing_page = db.query(db_models.FacebookPage).filter(
                db_models.FacebookPage.fb_page_id == page_id
            ).first()
            
            if existing_page:
                # Update credentials and metadata
                existing_page.name = page_name
                existing_page.page_access_token = page_token
                existing_page.user_id = user.id  # Securely tie to active user
            else:
                # Insert new page config
                new_page = db_models.FacebookPage(
                    user_id=user.id,
                    fb_page_id=page_id,
                    name=page_name,
                    page_access_token=page_token
                )
                db.add(new_page)
    
    # 5. Generate custom JWT local token
    roles_list = [role.name for role in user.roles]
    jwt_token, jwt_expire = create_jwt_token(user.id, roles_list)
    
    # 6. Store session details in the database
    new_session = db_models.Session(
        user_id=user.id,
        session_token=jwt_token,
        fb_access_token=long_lived_token,
        expires_at=jwt_expire
    )
    db.add(new_session)
    
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        logger.error(f"Error committing session to the database: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal error writing user session to database"
        )

    # 7. Queue background sync tasks for linked pages (database now contains updated tokens)
    linked_page_ids = [p_data.get("id") for p_data in fb_pages if p_data.get("id")]
    db_pages = db.query(db_models.FacebookPage).filter(
        db_models.FacebookPage.fb_page_id.in_(linked_page_ids)
    ).all()

    for db_page in db_pages:
        background_tasks.add_task(sync_page_data_task_wrapper, db_page.id)
        logger.info(f"Queued background sync task for Page: '{db_page.name}' (ID: {db_page.id})")
        
    return {
        "status": "success",
        "token": jwt_token,
        "user": {
            "id": user.id,
            "facebook_user_id": user.facebook_user_id,
            "name": user.name,
            "email": user.email,
            "roles": roles_list
        }
    }

@router.get("/me")
def get_me(current_user: db_models.User = Depends(get_current_user)):
    """
    Returns the currently authenticated user profile information.
    """
    return {
        "id": current_user.id,
        "facebook_user_id": current_user.facebook_user_id,
        "name": current_user.name,
        "email": current_user.email,
        "roles": [role.name for role in current_user.roles],
        "facebook_pages": [
            {
                "id": page.id,
                "fb_page_id": page.fb_page_id,
                "name": page.name
            }
            for page in current_user.facebook_pages
        ]
    }


