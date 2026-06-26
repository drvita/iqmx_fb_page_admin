from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from api.db.database import Base

class FacebookPost(Base):
    __tablename__ = "facebook_posts"

    id = Column(Integer, primary_key=True, index=True)
    page_id = Column(Integer, ForeignKey("facebook_pages.id", ondelete="CASCADE"), nullable=False, index=True)
    fb_post_id = Column(String(100), unique=True, nullable=False, index=True)
    message = Column(Text, nullable=True)
    created_time = Column(DateTime, nullable=False)
    is_published = Column(Boolean, default=True, nullable=False)
    full_picture = Column(Text, nullable=True)
    
    # Interaction counts cached from Graph API
    reactions_count = Column(Integer, default=0, nullable=False)
    comments_count = Column(Integer, default=0, nullable=False)
    shares_count = Column(Integer, default=0, nullable=False)

    # AI observations/notes field for future use
    ai_observations = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationship back to the owner FacebookPage
    page = relationship("FacebookPage", back_populates="posts")
