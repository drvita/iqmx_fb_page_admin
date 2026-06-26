from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from api.db.database import Base

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False, index=True)

    # N:M Relationship to User
    users = relationship("User", secondary="user_roles", back_populates="roles")
