"""
main.py — FastAPI application entry point.

Routes:
  POST   /register                  — create new user account
  POST   /login                     — authenticate user
  POST   /financial-profile/{user_id} — save/update financial data
  GET    /dashboard/{user_id}       — fetch user + computed metrics
  GET    /health                    — server health check
"""

import os
from datetime import datetime
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends, status, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Local imports
import models
import schemas
from database import engine, get_db
from auth import hash_password, verify_password
from ai_service import generate_financial_recommendations
from pdf_service import generate_pdf_report

# Load environment variables from .env
load_dotenv()

# ---------------------------------------------------------------------------
# Create all database tables on startup (safe to call multiple times)
# ---------------------------------------------------------------------------
models.Base.metadata.create_all(bind=engine)

# ---------------------------------------------------------------------------
# FastAPI app instance
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Credit Assistant API",
    description="Financial health assistant backend — Stage 2",
    version="2.0.0"
)

# ---------------------------------------------------------------------------
# CORS — allow the Vite React dev server to reach this API
# ---------------------------------------------------------------------------
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "https://rathodpranav0707-alt.github.io")

allowed_origins = [FRONTEND_ORIGIN]
if "http://localhost:5173" not in allowed_origins:
    allowed_origins.append("http://localhost:5173")
if "http://127.0.0.1:5173" not in allowed_origins:
    allowed_origins.append("http://127.0.0.1:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,   # specific development origins only — not wildcard
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
)


# ---------------------------------------------------------------------------
# Helper: compute financial metrics safely (no division by zero)
# ---------------------------------------------------------------------------
def compute_savings_rate(monthly_savings: float, monthly_salary: float) -> float:
    """Savings Rate = (Monthly Savings / Monthly Salary) × 100"""
    if monthly_salary <= 0:
        return 0.0
    return round((monthly_savings / monthly_salary) * 100, 2)


def compute_debt_to_income(monthly_debt_payments: float, monthly_salary: float) -> float:
    """Debt-to-Income Ratio = (Monthly Debt Payments / Monthly Salary) × 100"""
    if monthly_salary <= 0:
        return 0.0
    return round((monthly_debt_payments / monthly_salary) * 100, 2)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/health")
def health_check():
    """Simple health check to verify the server is running."""
    return {"status": "ok", "server": "Credit Assistant API", "time": str(datetime.utcnow())}


@app.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: schemas.UserRegister, db: Session = Depends(get_db)):
    """
    Register a new user.
    - Validates email uniqueness
    - Hashes password with bcrypt before storing
    - Never stores plaintext password
    """
    # Check if email already exists
    existing = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists. Please log in instead."
        )

    # Hash the password — NEVER store plaintext
    hashed = hash_password(user_data.password)

    # Create and persist the new user
    new_user = models.User(
        name=user_data.name,
        email=user_data.email,
        mobile=user_data.mobile,
        password_hash=hashed
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return schemas.UserResponse(
        user_id=new_user.id,
        name=new_user.name,
        email=new_user.email,
        mobile=new_user.mobile,
        message="Registration successful! Please complete your financial profile."
    )


@app.post("/login", response_model=schemas.UserResponse)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate a user.
    - Looks up user by email
    - Verifies bcrypt password hash
    - Returns user info on success
    """
    # Find user by email
    user = db.query(models.User).filter(models.User.email == credentials.email).first()

    # Use a generic error message to avoid leaking which field is wrong
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check your credentials."
        )

    return schemas.UserResponse(
        user_id=user.id,
        name=user.name,
        email=user.email,
        mobile=user.mobile,
        message="Login successful!"
    )


@app.post("/financial-profile/{user_id}", response_model=schemas.FinancialProfileResponse)
def save_financial_profile(
    user_id: int,
    profile_data: schemas.FinancialProfileCreate,
    db: Session = Depends(get_db)
):
    """
    Save or update a user's financial profile.
    - Creates a new profile if one does not exist
    - Updates existing profile if one already exists
    - Computes savings_rate and debt_to_income_ratio
    """
    # Verify the user exists
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found."
        )

    # Check if a profile already exists for this user
    profile = db.query(models.FinancialProfile).filter(
        models.FinancialProfile.user_id == user_id
    ).first()

    if profile:
        # Update existing profile
        profile.credit_score = profile_data.credit_score
        profile.credit_utilization = profile_data.credit_utilization
        profile.missed_payments = profile_data.missed_payments
        profile.active_loans = profile_data.active_loans
        profile.monthly_salary = profile_data.monthly_salary
        profile.monthly_expenses = profile_data.monthly_expenses
        profile.monthly_savings = profile_data.monthly_savings
        profile.monthly_debt_payments = profile_data.monthly_debt_payments
        profile.total_debt = profile_data.total_debt
        profile.updated_at = datetime.utcnow()
    else:
        # Create new profile
        profile = models.FinancialProfile(
            user_id=user_id,
            credit_score=profile_data.credit_score,
            credit_utilization=profile_data.credit_utilization,
            missed_payments=profile_data.missed_payments,
            active_loans=profile_data.active_loans,
            monthly_salary=profile_data.monthly_salary,
            monthly_expenses=profile_data.monthly_expenses,
            monthly_savings=profile_data.monthly_savings,
            monthly_debt_payments=profile_data.monthly_debt_payments,
            total_debt=profile_data.total_debt,
        )
        db.add(profile)

    db.commit()
    db.refresh(profile)

    # Compute derived metrics
    savings_rate = compute_savings_rate(profile.monthly_savings, profile.monthly_salary)
    dti = compute_debt_to_income(profile.monthly_debt_payments, profile.monthly_salary)

    return schemas.FinancialProfileResponse(
        user_id=user_id,
        credit_score=profile.credit_score,
        credit_utilization=profile.credit_utilization,
        missed_payments=profile.missed_payments,
        active_loans=profile.active_loans,
        monthly_salary=profile.monthly_salary,
        monthly_expenses=profile.monthly_expenses,
        monthly_savings=profile.monthly_savings,
        monthly_debt_payments=profile.monthly_debt_payments,
        total_debt=profile.total_debt,
        savings_rate=savings_rate,
        debt_to_income_ratio=dti,
        message="Financial profile saved successfully!"
    )


@app.get("/dashboard/{user_id}", response_model=schemas.DashboardResponse)
def get_dashboard(user_id: int, db: Session = Depends(get_db)):
    """
    Fetch the dashboard data for a user.
    Returns user info + financial profile + computed metrics.
    Returns 404 if user has not yet saved a financial profile.
    """
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found."
        )

    profile = db.query(models.FinancialProfile).filter(
        models.FinancialProfile.user_id == user_id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No financial profile found. Please complete your financial profile first."
        )

    savings_rate = compute_savings_rate(profile.monthly_savings, profile.monthly_salary)
    dti = compute_debt_to_income(profile.monthly_debt_payments, profile.monthly_salary)

    return schemas.DashboardResponse(
        user_id=user.id,
        name=user.name,
        email=user.email,
        credit_score=profile.credit_score,
        credit_utilization=profile.credit_utilization,
        missed_payments=profile.missed_payments,
        active_loans=profile.active_loans,
        monthly_salary=profile.monthly_salary,
        monthly_expenses=profile.monthly_expenses,
        monthly_savings=profile.monthly_savings,
        monthly_debt_payments=profile.monthly_debt_payments,
        total_debt=profile.total_debt,
        savings_rate=savings_rate,
        debt_to_income_ratio=dti
    )


@app.get("/recommendations/{user_id}")
def get_recommendations(user_id: int, db: Session = Depends(get_db)):
    """
    Generate Gemini AI-powered financial recommendations for a user based on
    their financial profile stored in SQLite.

    Pipeline:
      React -> FastAPI -> Database (Profile) -> Gemini AI -> JSON Recommendations -> React
    """
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found."
        )

    profile = db.query(models.FinancialProfile).filter(
        models.FinancialProfile.user_id == user_id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No financial profile found. Please fill in your financial profile first to generate AI recommendations."
        )

    savings_rate = compute_savings_rate(profile.monthly_savings, profile.monthly_salary)
    dti = compute_debt_to_income(profile.monthly_debt_payments, profile.monthly_salary)

    metrics = {
        "user_name": user.name,
        "credit_score": profile.credit_score,
        "credit_utilization": profile.credit_utilization,
        "missed_payments": profile.missed_payments,
        "active_loans": profile.active_loans,
        "monthly_salary": profile.monthly_salary,
        "monthly_expenses": profile.monthly_expenses,
        "monthly_savings": profile.monthly_savings,
        "monthly_debt_payments": profile.monthly_debt_payments,
        "total_debt": profile.total_debt,
        "savings_rate": savings_rate,
        "debt_to_income_ratio": dti,
    }

    try:
        recommendations_data = generate_financial_recommendations(metrics)
        return recommendations_data
    except Exception as exc:
        # Never crash the API or leak raw system details
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to generate financial recommendations at this moment. Please try again."
        )


@app.get("/generate-report/{user_id}")
def generate_report(user_id: int, db: Session = Depends(get_db)):
    """
    Generate a professional Financial Health PDF Report using ReportLab.
    Combines user details, database metrics, computed ratios, and Gemini AI insights.
    Returns the binary PDF file stream for direct browser download/viewing.

    Pipeline:
      React -> FastAPI -> Database (Profile) -> Gemini AI -> ReportLab -> PDF -> React / User Download
    """
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found."
        )

    profile = db.query(models.FinancialProfile).filter(
        models.FinancialProfile.user_id == user_id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No financial profile found. Please complete your financial profile first to generate your official PDF report."
        )

    savings_rate = compute_savings_rate(profile.monthly_savings, profile.monthly_salary)
    dti = compute_debt_to_income(profile.monthly_debt_payments, profile.monthly_salary)

    metrics = {
        "user_name": user.name,
        "credit_score": profile.credit_score,
        "credit_utilization": profile.credit_utilization,
        "missed_payments": profile.missed_payments,
        "active_loans": profile.active_loans,
        "monthly_salary": profile.monthly_salary,
        "monthly_expenses": profile.monthly_expenses,
        "monthly_savings": profile.monthly_savings,
        "monthly_debt_payments": profile.monthly_debt_payments,
        "total_debt": profile.total_debt,
        "savings_rate": savings_rate,
        "debt_to_income_ratio": dti,
    }

    # Fetch AI diagnostics
    try:
        ai_data = generate_financial_recommendations(metrics)
    except Exception:
        ai_data = {
            "summary": "Financial diagnostic synthesized based on current CIBIL parameters and debt ratios.",
            "critical_issues": ["Review revolving debt utilization to elevate your credit profile."],
            "recommendations": [],
            "credit_advice": ["Keep utilization below 30%."],
            "savings_advice": ["Automate 20% savings."],
            "debt_advice": ["Maintain DTI below 35%."],
            "improvement_timeline": []
        }

    user_dict = {
        "user_id": user.id,
        "name": user.name,
        "email": user.email,
        "mobile": user.mobile
    }

    profile_dict = {
        "credit_score": profile.credit_score,
        "credit_utilization": profile.credit_utilization,
        "missed_payments": profile.missed_payments,
        "active_loans": profile.active_loans,
        "monthly_salary": profile.monthly_salary,
        "monthly_expenses": profile.monthly_expenses,
        "monthly_savings": profile.monthly_savings,
        "monthly_debt_payments": profile.monthly_debt_payments,
        "total_debt": profile.total_debt,
    }

    try:
        pdf_bytes = generate_pdf_report(user_dict, profile_dict, ai_data)
    except Exception as pdf_err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate the PDF report. Please try again in a few moments."
        )

    filename = f"Credit_Assistant_Report_{user.name.replace(' ', '_')}_{user_id}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Access-Control-Expose-Headers": "Content-Disposition"
        }
    )


