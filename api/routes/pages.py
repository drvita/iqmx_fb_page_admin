from datetime import datetime, timezone, timedelta
import logging
import os
import requests
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session as DBSession, selectinload
from api.helpers.sync import sync_page_data
from api.db.database import get_db
import api.models as db_models
from api.routes.auth import get_current_user
from api.helpers.alerts import evaluate_page_metrics, calculate_post_performance

logger = logging.getLogger("fb_page_admin_api.routes.pages")

router = APIRouter(
    prefix="/api/pages",
    tags=["pages"]
)

class PostPerformanceSchema(BaseModel):
    label: str
    status: str

class PostSchema(BaseModel):
    id: str
    message: str | None = None
    created_time: str
    is_published: bool
    full_picture: str | None = None
    reactions_count: int = 0
    comments_count: int = 0
    shares_count: int = 0
    performance: PostPerformanceSchema | None = None

class AlertSchema(BaseModel):
    id: str
    type: str  # "warning" | "danger" | "info"
    title: str
    message: str
    metric: str

class InsightsResponse(BaseModel):
    followers: int
    followers_change: float
    reach: int
    reach_change: float
    engagement: int
    engagement_change: float
    new_posts_count: int
    new_posts_change: int
    posts: list[PostSchema]
    alerts: list[AlertSchema] = []

@router.get("/{page_id}/insights", response_model=InsightsResponse)
def get_page_insights(
    page_id: int,
    db: DBSession = Depends(get_db),
    current_user: db_models.User = Depends(get_current_user)
):
    """
    Fetches cached statistics and posts for the specified Facebook Page directly from the database.
    Ensures that the page belongs to the authenticated user.
    If the page has never been synchronized, raises an HTTP 403 Forbidden error.
    """
    # 1. Retrieve the FacebookPage record with related posts and confirm ownership
    page = db.query(db_models.FacebookPage).options(
        selectinload(db_models.FacebookPage.posts)
    ).filter(
        db_models.FacebookPage.id == page_id
    ).first()

    if not page:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Facebook page not found in local database."
        )

    if page.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view insights for this page."
        )

    # 2. Check if the page has already performed its initial sync
    if not page.last_sync_at:
        logger.warning(f"Access attempted for unsynced Page ID {page_id}.")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Por el momento no tenemos acceso a los datos de esta página. Sincronización inicial en proceso."
        )

    # 3. Construct the feed list using naive sorting on creation timestamp (filtering for last 28 days)
    limit_date = datetime.utcnow() - timedelta(days=28)
    recent_posts = [p for p in page.posts if p.created_time and p.created_time >= limit_date]
    recent_posts = sorted(recent_posts, key=lambda p: p.created_time, reverse=True)
    parsed_posts = [
        PostSchema(
            id=post.fb_post_id,
            message=post.message,
            created_time=post.created_time.replace(tzinfo=timezone.utc).isoformat() if post.created_time else "",
            is_published=post.is_published,
            full_picture=post.full_picture,
            reactions_count=post.reactions_count,
            comments_count=post.comments_count,
            shares_count=post.shares_count,
            performance=calculate_post_performance(post, page.followers or 0)
        )
        for post in recent_posts
    ]

    page_alerts = evaluate_page_metrics(page, recent_posts)

    return InsightsResponse(
        followers=page.followers or 0,
        followers_change=page.followers_change or 0.0,
        reach=page.reach or 0,
        reach_change=page.reach_change or 0.0,
        engagement=page.engagement or 0,
        engagement_change=page.engagement_change or 0.0,
        new_posts_count=page.new_posts_count or 0,
        new_posts_change=page.new_posts_change or 0,
        posts=parsed_posts,
        alerts=page_alerts
    )

@router.post("/{page_id}/sync")
def manual_sync_page(
    page_id: int,
    db: DBSession = Depends(get_db),
    current_user: db_models.User = Depends(get_current_user)
):
    """
    Triggers a manual synchronization of Facebook page metrics and posts.
    """
    page = db.query(db_models.FacebookPage).filter(
        db_models.FacebookPage.id == page_id
    ).first()

    if not page:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Facebook page not found in local database."
        )

    if page.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to sync this page."
        )

    try:
        success = sync_page_data(db, page.id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Sincronización fallida. Por favor, verifique su token de acceso."
            )
        return {"status": "success", "message": "Datos de página sincronizados correctamente."}
    except Exception as e:
        logger.error(f"Manual sync failed for page ID {page_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Por el momento no tenemos acceso a los datos de esta página. El token de Facebook ha expirado o es inválido."
        )
