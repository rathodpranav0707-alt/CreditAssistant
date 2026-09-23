"""
database.py — SQLAlchemy database engine and session factory.

SQLite is used for development. To switch to PostgreSQL later,
just change DATABASE_URL in .env to a postgres:// connection string.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./credit_assistant.db")

# connect_args is required only for SQLite (to allow multi-thread usage with FastAPI)
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

# Each request gets its own database session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# All models inherit from this base class
Base = declarative_base()


def get_db():
    """
    Dependency injected into route handlers.
    Yields a database session and ensures it is always closed after the request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
