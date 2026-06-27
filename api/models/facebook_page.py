from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Float
from sqlalchemy.orm import relationship
from api.db.database import Base

class FacebookPage(Base):
    __tablename__ = "facebook_pages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    fb_page_id = Column(String(100), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(100), nullable=True)
    page_access_token = Column(Text, nullable=False)  # Indefinite Page Access Token
    is_monitored = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Snapshot Metrics (cached from Facebook insights)
    followers = Column(Integer, default=0, nullable=True)
    followers_change = Column(Float, default=0.0, nullable=True)
    reach = Column(Integer, default=0, nullable=True)
    reach_change = Column(Float, default=0.0, nullable=True)
    engagement = Column(Integer, default=0, nullable=True)
    engagement_change = Column(Float, default=0.0, nullable=True)
    new_posts_count = Column(Integer, default=0, nullable=True)
    new_posts_change = Column(Integer, default=0, nullable=True)
    
    last_sync_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="facebook_pages")
    posts = relationship("FacebookPost", back_populates="page", cascade="all, delete-orphan")
