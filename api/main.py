import logging
from api.helpers.logging_config import setup_logging_sanitization

# Setup log sanitization before importing other modules
setup_logging_sanitization()

logger = logging.getLogger("fb_page_admin_api.main")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.db.database import engine, get_db, Base
from api.routes.auth import router as auth_router
from api.routes.pages import router as pages_router
import api.models as db_models

app = FastAPI(
    title="IQISS Insight API",
    description="Premium business intelligence backend for social media analytics and automation.",
    version="0.1.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router)
app.include_router(pages_router)

@app.on_event("startup")
def on_startup():
    from sqlalchemy import text
    try:
        with engine.begin() as conn:
            conn.execute(text("ALTER TABLE facebook_pages ADD COLUMN IF NOT EXISTS followers INTEGER DEFAULT 0;"))
            conn.execute(text("ALTER TABLE facebook_pages ADD COLUMN IF NOT EXISTS followers_change DOUBLE PRECISION DEFAULT 0.0;"))
            conn.execute(text("ALTER TABLE facebook_pages ADD COLUMN IF NOT EXISTS reach INTEGER DEFAULT 0;"))
            conn.execute(text("ALTER TABLE facebook_pages ADD COLUMN IF NOT EXISTS reach_change DOUBLE PRECISION DEFAULT 0.0;"))
            conn.execute(text("ALTER TABLE facebook_pages ADD COLUMN IF NOT EXISTS engagement INTEGER DEFAULT 0;"))
            conn.execute(text("ALTER TABLE facebook_pages ADD COLUMN IF NOT EXISTS engagement_change DOUBLE PRECISION DEFAULT 0.0;"))
            conn.execute(text("ALTER TABLE facebook_pages ADD COLUMN IF NOT EXISTS new_posts_count INTEGER DEFAULT 0;"))
            conn.execute(text("ALTER TABLE facebook_pages ADD COLUMN IF NOT EXISTS new_posts_change INTEGER DEFAULT 0;"))
            conn.execute(text("ALTER TABLE facebook_pages ADD COLUMN IF NOT EXISTS last_sync_at TIMESTAMP WITHOUT TIME ZONE;"))
            conn.execute(text("ALTER TABLE facebook_pages ADD COLUMN IF NOT EXISTS category VARCHAR(100);"))
    except Exception as db_err:
        logger.warning(f"[DB MIGRATION WARNING] Failed to alter table facebook_pages: {str(db_err)}")
    
    Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Welcome to IQISS Insight API. Access /docs for endpoint documentation."}

@app.get("/status")
def get_status():
    return {"status": "ok", "service": "api"}


