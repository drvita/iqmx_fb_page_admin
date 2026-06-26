from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from api.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    facebook_user_id = Column(String(100), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=True, index=True)
    password = Column(String(200), nullable=True)  # Secure password hash for credentials
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # N:M Relationship to Role
    roles = relationship("Role", secondary="user_roles", back_populates="users")
    
    # One-to-Many Relationship to active user sessions
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")
    
    # One-to-Many Relationship to integrated/monitored Facebook pages
    facebook_pages = relationship("FacebookPage", back_populates="user", cascade="all, delete-orphan")
