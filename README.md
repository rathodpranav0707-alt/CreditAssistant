# Credit Assistant — AI-Powered Financial Health Platform

> **NASSCOM SkillWallet Project** — An AI-driven financial diagnostic and credit readiness platform built for Indian consumers.

![Tech Stack](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=flat-square&logo=react)
![Backend](https://img.shields.io/badge/Backend-FastAPI%20%2B%20Python-009688?style=flat-square&logo=fastapi)
![AI](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?style=flat-square&logo=google)
![DB](https://img.shields.io/badge/Database-SQLite-003B57?style=flat-square&logo=sqlite)

---

## Overview

**Credit Assistant** is a full-stack financial health platform that gives Indian consumers clear, actionable diagnostics on their credit standing, debt capacity, cash flow, and loan readiness. It combines a FastAPI backend, a Gemini AI advisor, real-time Recharts dashboards, and a one-click ReportLab PDF audit report.

---

## Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | **User Authentication** | Secure registration & login with bcrypt password hashing |
| 2 | **Financial Profile** | Self-reported CIBIL score, credit utilization, EMIs, income, SIP, debt |
| 3 | **Real-Time Health Metrics** | Composite Health Score (0–100), Savings Rate %, DTI %, Delinquency flags |
| 4 | **Interactive Dashboard** | 4 Recharts visualisations — Credit Trajectory, Cash Allocation, Savings Corpus, DTI Distribution |
| 5 | **Gemini AI Advisor** | Executive summary, top 3 critical issues, 5 actionable recommendations, 30/60/90/180-day roadmap |
| 6 | **PDF Health Report** | One-click vector PDF generated with ReportLab — tables, charts, numbered pages, audit reference |
| 7 | **Fallback AI Mode** | 100% uptime — high-quality educational recommendations even without a Gemini API key |

---

## Tech Stack

### Frontend
- **React 19** + **Vite 8**
- **React Router DOM v7** — client-side routing
- **Recharts** — interactive financial charts
- **Lucide React** — icon library
- Vanilla CSS with custom design system

### Backend
- **Python 3.10+** + **FastAPI**
- **SQLAlchemy ORM** + **SQLite** (dev) — easily switchable to PostgreSQL
- **Pydantic v2** — request/response validation
- **Bcrypt** — password hashing
- **Python-dotenv** — environment variable management

### AI / ML
- **Google Gemini API** (`gemini-2.5-flash-lite`, `gemini-2.5-flash`) — personalized financial advisory

### PDF Generation
- **ReportLab 4+** + **Pillow** — server-side vector PDF rendering

---

## Project Structure

```
Credit-Assistant/
├── .gitignore                  # Git ignore rules
├── README.md                   # This file
│
├── backend/
│   ├── main.py                 # FastAPI app & all API routes
│   ├── models.py               # SQLAlchemy ORM models
│   ├── schemas.py              # Pydantic request/response schemas
│   ├── database.py             # DB engine, session, base setup
│   ├── auth.py                 # bcrypt password hashing utilities
│   ├── ai_service.py           # Google Gemini AI integration
│   ├── pdf_service.py          # ReportLab PDF report generator
│   ├── requirements.txt        # Python dependencies
│   └── .env.example            # Environment variable template
│
└── frontend/
    ├── index.html              # HTML entry point
    ├── package.json            # npm dependencies & scripts
    ├── vite.config.js          # Vite build configuration
    └── src/
        ├── main.jsx            # React app entry point
        ├── App.jsx             # Root component & router setup
        ├── index.css           # Global design system styles
        ├── assets/             # Static images & icons
        ├── charts/             # Recharts visualisation components
        ├── components/         # Reusable UI components
        ├── context/            # React Context (Auth, Financial)
        ├── data/               # Fallback mock data
        ├── pages/              # Page-level components
        └── services/           # API client & calculation utilities
```

---

## Installation

### Prerequisites

- **Python 3.10+** — [python.org](https://www.python.org/downloads/)
- **Node.js 18+** and **npm** — [nodejs.org](https://nodejs.org/)
- **Google Gemini API key** — [aistudio.google.com](https://aistudio.google.com/) *(optional — app works without it)*

---

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/Credit-Assistant.git
cd Credit-Assistant
```

---

### 2. Backend Setup

```bash
cd backend
```

**Create and activate a virtual environment:**

```bash
# Windows (PowerShell)
python -m venv venv
.\venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

**Install dependencies:**

```bash
pip install -r requirements.txt
```

**Configure environment variables:**

```bash
# Windows
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

Open `.env` and fill in your values:

```env
SECRET_KEY=replace_with_a_secure_random_key
DATABASE_URL=sqlite:///./credit_assistant.db
FRONTEND_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here
```

> The SQLite database file (`credit_assistant.db`) is created **automatically** on first startup. You do not need to run any migrations.

---

### 3. Frontend Setup

Open a **new terminal** in the project root:

```bash
cd frontend
npm install
```

---

## Running the Project

### Start the Backend

```bash
cd backend

# Activate virtual environment first (if not already active)
.\venv\Scripts\activate        # Windows
source venv/bin/activate       # macOS / Linux

# Start the FastAPI server
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Backend available at: **http://127.0.0.1:8000**  
Interactive API docs (Swagger UI): **http://127.0.0.1:8000/docs**

### Start the Frontend

```bash
cd frontend
npm run dev
```

Frontend available at: **http://localhost:5173**

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and set your values.

| Variable | Description | Required |
|----------|-------------|----------|
| `SECRET_KEY` | JWT / app secret key — use a long random string | ✅ Yes |
| `DATABASE_URL` | SQLAlchemy DB URL — default `sqlite:///./credit_assistant.db` | ✅ Yes |
| `FRONTEND_ORIGIN` | CORS allowed origin — default `http://localhost:5173` | ✅ Yes |
| `GEMINI_API_KEY` | Google Gemini API key — get from [aistudio.google.com](https://aistudio.google.com/) | ⚙️ Optional |

> **Never commit your real `.env` file to Git.** It is listed in `.gitignore`.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health check |
| `POST` | `/register` | Register a new user (bcrypt hashed) |
| `POST` | `/login` | Authenticate user |
| `POST` | `/financial-profile/{user_id}` | Create or update financial profile |
| `GET` | `/dashboard/{user_id}` | Retrieve profile + computed metrics |
| `GET` | `/recommendations/{user_id}` | Gemini AI analysis & recommendations |
| `GET` | `/generate-report/{user_id}` | Download PDF financial audit report |

---

## User Workflow

1. **Landing Page** → `http://localhost:5173/`
2. **Register** → `/register` — create an account
3. **Login** → `/login` — sign in
4. **Financial Profile** → `/profile` — enter your financial parameters
5. **Dashboard** → `/dashboard` — view live metrics and Recharts visuals
6. **AI Advisor** → `/recommendations` — get Gemini-powered advice
7. **PDF Report** → `/report` — download your financial health audit

---

## GitHub Notes

The following are **excluded from this repository** via `.gitignore`:

| Excluded | Reason |
|----------|--------|
| `frontend/node_modules/` | Reinstall with `npm install` |
| `frontend/dist/` | Generated by `npm run build` |
| `backend/__pycache__/` | Python bytecode cache |
| `backend/venv/` | Virtual environment |
| `backend/.env` | Contains real secrets |
| `backend/credit_assistant.db` | Local user data — auto-created on startup |
| `*.log` | Runtime logs |
| `.DS_Store`, `Thumbs.db` | OS metadata |

To recreate everything after cloning, just follow the [Installation](#installation) steps above.

---

## License & Attribution

Developed for **NASSCOM SkillWallet Evaluation**.  
Educational guidance only — not formal licensed financial advisory under SEBI / RBI guidelines.
