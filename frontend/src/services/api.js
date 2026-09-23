/**
 * api.js — Centralised service layer for all backend API calls.
 *
 * All fetch calls live here so pages stay clean.
 * Every function returns:
 *   { ok: true,  data: {...} }   on success
 *   { ok: false, error: "..." }  on failure
 */

const BASE_URL = "http://localhost:8000";

// ---------------------------------------------------------------------------
// Helper — make a fetch call and normalise the response
// ---------------------------------------------------------------------------
async function apiFetch(method, path, body = null) {
  try {
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    };
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${path}`, options);

    let data;
    try {
      data = await response.json();
    } catch {
      data = { detail: "Server returned an unexpected response." };
    }

    if (!response.ok) {
      // FastAPI returns { detail: "..." } for errors
      const errorMsg =
        typeof data.detail === "string"
          ? data.detail
          : Array.isArray(data.detail)
          ? data.detail.map((e) => e.msg).join(", ")
          : "An unexpected error occurred.";
      return { ok: false, error: errorMsg };
    }

    return { ok: true, data };
  } catch (networkError) {
    // Server is unreachable (not running, CORS blocked before response, etc.)
    return {
      ok: false,
      error:
        "Cannot connect to the server. Make sure the backend is running on http://localhost:8000",
    };
  }
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

/**
 * Register a new user account.
 * @param {{ name, email, mobile, password }} userData
 */
export async function registerUser(userData) {
  return apiFetch("POST", "/register", {
    name: userData.name,
    email: userData.email,
    mobile: userData.mobile,
    password: userData.password,
  });
}

/**
 * Log in with email and password.
 * @param {{ email, password }} credentials
 */
export async function loginUser(credentials) {
  return apiFetch("POST", "/login", {
    email: credentials.email,
    password: credentials.password,
  });
}

// ---------------------------------------------------------------------------
// Financial Profile
// ---------------------------------------------------------------------------

/**
 * Save or update a user's financial profile.
 * Field names use camelCase (converted to snake_case for the API).
 * @param {number} userId
 * @param {object} profileData
 */
export async function saveFinancialProfile(userId, profileData) {
  return apiFetch("POST", `/financial-profile/${userId}`, {
    credit_score: profileData.creditScore,
    credit_utilization: profileData.creditUtilization,
    missed_payments: profileData.missedEmis,
    active_loans: profileData.activeLoans,
    monthly_salary: profileData.monthlySalary,
    monthly_expenses: profileData.monthlyExpenses,
    monthly_savings: profileData.monthlySavings,
    monthly_debt_payments: profileData.monthlyDebtPayments,
    total_debt: profileData.totalDebt,
  });
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

/**
 * Fetch the full dashboard data for a user from the database.
 * @param {number} userId
 */
export async function getDashboard(userId) {
  return apiFetch("GET", `/dashboard/${userId}`);
}

// ---------------------------------------------------------------------------
// AI Recommendations
// ---------------------------------------------------------------------------

/**
 * Fetch Gemini AI-powered financial recommendations for a user.
 * @param {number} userId
 */
export async function getRecommendations(userId) {
  return apiFetch("GET", `/recommendations/${userId}`);
}

// ---------------------------------------------------------------------------
// PDF Report
// ---------------------------------------------------------------------------

/**
 * Generate and download the Financial Health PDF report for a user.
 * Returns a blob URL (for <a download>) rather than parsed JSON.
 * @param {number} userId
 */
export async function generateReport(userId) {
  try {
    const response = await fetch(`${BASE_URL}/generate-report/${userId}`);

    if (!response.ok) {
      // Try to parse a JSON error message from FastAPI
      const data = await response.json().catch(() => ({
        detail: "Report generation failed.",
      }));
      const msg =
        typeof data.detail === "string"
          ? data.detail
          : "Failed to generate report.";
      return { ok: false, error: msg };
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    // Extract filename from Content-Disposition header if present
    const disposition = response.headers.get("Content-Disposition") || "";
    let filename = "Credit_Assistant_Report.pdf";
    if (disposition.includes('filename="')) {
      filename = disposition.split('filename="')[1].replace('"', "");
    }

    return { ok: true, url, filename };
  } catch {
    return {
      ok: false,
      error:
        "Cannot connect to the server. Make sure the backend is running on http://localhost:8000",
    };
  }
}

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

/**
 * Ping the backend to see if it's running.
 */
export async function checkHealth() {
  return apiFetch("GET", "/health");
}

