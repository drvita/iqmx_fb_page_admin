import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Database configuration loaded from environment variables with sensible defaults
DB_USER = os.getenv("DB_USER", "iqiss_user")
DB_PASSWORD = os.getenv("DB_PASSWORD", "iqiss_password")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "iqiss_insight")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# SQLAlchemy engine initialization with connection pool pre-ping
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)

# Session factory configuration
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative base model for SQLAlchemy models
Base = declarative_base()

def get_db():
    """
    Dependency injection helper to yield a database session.
    Ensures the connection is properly closed after usage.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
