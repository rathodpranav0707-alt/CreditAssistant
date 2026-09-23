"""
schemas.py — Pydantic request/response models.

These are the data shapes that FastAPI uses to:
  - validate incoming JSON request bodies
  - serialize outgoing JSON responses
  - auto-generate OpenAPI (Swagger) documentation
"""

import re
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict


# ---------------------------------------------------------------------------
# User Schemas
# ---------------------------------------------------------------------------

class UserRegister(BaseModel):
    """Data required to register a new user."""
    name: str = Field(..., min_length=2, max_length=100, description="Full name")
    email: EmailStr = Field(..., description="Valid email address")
    mobile: str = Field(..., description="10-digit Indian mobile number")
    password: str = Field(..., min_length=6, description="Password (min 6 characters)")

    @field_validator('mobile')
    @classmethod
    def validate_mobile(cls, v: str) -> str:
        if not re.match(r'^[6-9]\d{9}$', v):
            raise ValueError('Enter a valid 10-digit Indian mobile number (starts with 6-9)')
        return v


class UserLogin(BaseModel):
    """Data required to log in."""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """Data returned after a successful register or login."""
    user_id: int
    name: str
    email: str
    mobile: str
    message: str

    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Financial Profile Schemas
# ---------------------------------------------------------------------------

class FinancialProfileCreate(BaseModel):
    """Data submitted when saving a financial profile."""
    credit_score: int = Field(..., ge=300, le=900, description="CIBIL score (300-900)")
    credit_utilization: float = Field(..., ge=0, le=100, description="Credit utilization %")
    missed_payments: int = Field(..., ge=0, description="Missed EMI count in last 12 months")
    active_loans: int = Field(..., ge=0, description="Number of active loans")
    monthly_salary: float = Field(..., ge=0, description="Monthly take-home salary in INR")
    monthly_expenses: float = Field(..., ge=0, description="Monthly living expenses in INR")
    monthly_savings: float = Field(..., ge=0, description="Monthly savings & investments in INR")
    monthly_debt_payments: float = Field(..., ge=0, description="Monthly EMI payments in INR")
    total_debt: float = Field(..., ge=0, description="Total outstanding debt in INR")


class FinancialProfileResponse(BaseModel):
    """Data returned after saving a financial profile (includes computed metrics)."""
    user_id: int
    credit_score: int
    credit_utilization: float
    missed_payments: int
    active_loans: int
    monthly_salary: float
    monthly_expenses: float
    monthly_savings: float
    monthly_debt_payments: float
    total_debt: float
    savings_rate: float
    debt_to_income_ratio: float
    message: str

    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Dashboard Schema
# ---------------------------------------------------------------------------

class DashboardResponse(BaseModel):
    """Full dashboard payload returned for a user."""
    user_id: int
    name: str
    email: str
    credit_score: int
    credit_utilization: float
    missed_payments: int
    active_loans: int
    monthly_salary: float
    monthly_expenses: float
    monthly_savings: float
    monthly_debt_payments: float
    total_debt: float
    savings_rate: float
    debt_to_income_ratio: float

    model_config = ConfigDict(from_attributes=True)
