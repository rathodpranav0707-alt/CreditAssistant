"""
models.py — SQLAlchemy ORM table definitions.

Defines two tables:
  - users            : stores registered user accounts
  - financial_profiles: stores a user's financial data (one per user)
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    """Represents a registered user account."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    mobile = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)  # bcrypt hash — never plaintext
    created_at = Column(DateTime, default=datetime.utcnow)

    # One-to-one relationship with FinancialProfile
    financial_profile = relationship(
        "FinancialProfile",
        back_populates="user",
        uselist=False,  # One user → one profile
        cascade="all, delete-orphan"
    )


class FinancialProfile(Base):
    """Stores all financial metrics for a specific user."""

    __tablename__ = "financial_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    # Credit & debt metrics
    credit_score = Column(Integer, default=0)
    credit_utilization = Column(Float, default=0.0)   # in percent
    missed_payments = Column(Integer, default=0)
    active_loans = Column(Integer, default=0)

    # Cash flow metrics
    monthly_salary = Column(Float, default=0.0)
    monthly_expenses = Column(Float, default=0.0)
    monthly_savings = Column(Float, default=0.0)
    monthly_debt_payments = Column(Float, default=0.0)
    total_debt = Column(Float, default=0.0)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship back to the user
    user = relationship("User", back_populates="financial_profile")
