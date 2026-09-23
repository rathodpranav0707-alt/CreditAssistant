"""
ai_service.py — Gemini AI Financial Advisor service for Indian personal finance.

Features:
- Securely reads GEMINI_API_KEY from environment variables (.env).
- Crafts a structured prompt acting as an educational personal finance assistant.
- Requests strict JSON response with summary, critical issues, recommendations,
  credit/savings/debt advice, and an improvement timeline.
- Gracefully handles malformed JSON, rate limits, network failures, or missing API keys
  by providing a high-quality, tailored fallback analysis so the API never crashes.
"""

import os
import json
import re
import logging
from typing import Dict, Any, List
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("credit_assistant.ai_service")


def format_currency_inr(amount: float) -> str:
    """Format a number into Indian Rupee representation."""
    try:
        amount_int = int(round(amount))
        s = str(amount_int)
        if len(s) <= 3:
            return f"₹{s}"
        last3 = s[-3:]
        remaining = s[:-3]
        out = ""
        while len(remaining) > 2:
            out = "," + remaining[-2:] + out
            remaining = remaining[:-2]
        if remaining:
            out = remaining + out
        return f"₹{out},{last3}"
    except Exception:
        return f"₹{amount}"


def _get_tailored_fallback_recommendations(metrics: Dict[str, Any]) -> Dict[str, Any]:
    """
    Generates an intelligent, rules-based financial assessment when Gemini API
    is unreachable, rate-limited, or API key is not configured.
    """
    credit_score = metrics.get("credit_score", 700)
    credit_utilization = metrics.get("credit_utilization", 30.0)
    missed_payments = metrics.get("missed_payments", 0)
    active_loans = metrics.get("active_loans", 1)
    salary = metrics.get("monthly_salary", 50000.0)
    expenses = metrics.get("monthly_expenses", 25000.0)
    savings = metrics.get("monthly_savings", 10000.0)
    debt_payments = metrics.get("monthly_debt_payments", 15000.0)
    dti = metrics.get("debt_to_income_ratio", 30.0)
    savings_rate = metrics.get("savings_rate", 20.0)
    total_debt = metrics.get("total_debt", 300000.0)

    # 1. Critical issues identification
    critical_issues = []
    if missed_payments > 0:
        critical_issues.append(f"Recorded {missed_payments} missed/overdue payment(s) in the past 12 months, which severely penalizes your CIBIL/Experian credit score.")
    if credit_utilization > 35.0:
        critical_issues.append(f"Credit utilization is elevated at {credit_utilization}%, well above the recommended Indian banking threshold of 30%.")
    if dti > 40.0:
        critical_issues.append(f"Debt-to-Income (DTI) ratio is {dti}%, indicating over 40% of monthly income is committed to EMIs, creating cash flow vulnerabilities.")
    elif dti > 30.0:
        critical_issues.append(f"Debt-to-Income ratio of {dti}% is moderately high; RBI guidelines suggest keeping consumer debt under 35%.")
    if savings_rate < 15.0:
        critical_issues.append(f"Monthly savings velocity is {savings_rate}%, below the ideal 20% benchmark needed for emergency buffers and inflation-beating wealth creation.")
    if len(critical_issues) < 3:
        if active_loans >= 3:
            critical_issues.append(f"Managing {active_loans} active loans increases administrative friction and total interest outlay across multiple lenders.")
        else:
            critical_issues.append("Lack of a structured emergency fund covering at least 6 months of mandatory living expenses and debt EMIs.")

    critical_issues = critical_issues[:3]

    # 2. Overall summary
    health_status = "Good" if credit_score >= 750 and dti <= 35 and missed_payments == 0 else \
                    "Fair" if credit_score >= 680 and dti <= 45 else "Needs Immediate Attention"
    
    summary = (
        f"Your financial profile reflects a '{health_status}' status in the Indian personal finance ecosystem. "
        f"With a credit score of {credit_score}, monthly earnings of {format_currency_inr(salary)}, and debt obligations of "
        f"{format_currency_inr(debt_payments)} ({dti}% DTI), your current savings rate is {savings_rate}%. "
        f"{'Focusing on debt reduction and lowering credit utilization will swiftly elevate your credit profile into prime tier.' if credit_score < 760 else 'Maintaining disciplined repayment and directing surpluses into diversified investments will safeguard your financial trajectory.'}"
    )

    # 3. 5 Actionable recommendations
    recommendations = [
        {
            "id": "rec-1",
            "title": "Tame Credit Utilization Below 30%",
            "category": "Credit Health",
            "priority": "Critical" if credit_utilization > 35 else "Medium",
            "impact": "+20 to +45 CIBIL points within 60 days",
            "description": f"Your current credit utilization is {credit_utilization}%. Indian credit bureaus (CIBIL, Experian) reward consumers who maintain revolving balances under 30% of total sanctioned limits.",
            "action_plan": [
                "Request a credit limit enhancement from existing card issuers without taking new cards.",
                "Adopt the 'mid-cycle payment' technique: clear card balances 3-5 days before statement generation.",
                "Split recurring expenditures across multiple cards or switch essential utility spends to UPI."
            ]
        },
        {
            "id": "rec-2",
            "title": "Optimize Debt-to-Income (DTI) & Accelerated EMI Prepayments",
            "category": "Debt Management",
            "priority": "High" if dti > 35 else "Medium",
            "impact": f"Save up to {format_currency_inr(total_debt * 0.08)} in cumulative interest",
            "description": f"Monthly debt payments stand at {format_currency_inr(debt_payments)} ({dti}% of income). Lowering this below 30% significantly improves future loan eligibility at concessionary interest rates.",
            "action_plan": [
                "Use the 'Debt Avalanche' method: channel extra cash toward the loan with the highest APR (credit cards or personal loans).",
                "Consider paying 1 extra EMI annually or rounding up payments by 5% each quarter to shorten loan tenure.",
                "Explore debt consolidation through a lower-interest secured loan if unsecured balances carry >15% interest."
            ]
        },
        {
            "id": "rec-3",
            "title": "Build a 6-Month Liquid Emergency Reserve",
            "category": "Emergency Fund",
            "priority": "High",
            "impact": f"Safety net of {format_currency_inr((expenses + debt_payments) * 6)} to avert distress borrowing",
            "description": f"Ensure your household has an untouchable contingency reserve equal to 6 months of mandatory living costs ({format_currency_inr(expenses)}) plus EMIs ({format_currency_inr(debt_payments)}).",
            "action_plan": [
                f"Target a minimum corpus of {format_currency_inr((expenses + debt_payments) * 6)} stored in high-yield savings accounts or sweep-in fixed deposits.",
                "Automate a monthly standing instruction on salary day to allocate surplus before discretionary spending.",
                "Never invest emergency reserves in volatile instruments like equity mutual funds or crypto."
            ]
        },
        {
            "id": "rec-4",
            "title": "Automate Disciplined Wealth Accumulation (50-30-20 Rule)",
            "category": "Savings & Investment",
            "priority": "Medium",
            "impact": f"Boost monthly wealth corpus by {format_currency_inr(max(salary * 0.20 - savings, 5000))} monthly",
            "description": f"You currently save {format_currency_inr(savings)} ({savings_rate}% of salary). Aligning with the 50-30-20 budgeting model ensures long-term inflation-beating capital growth.",
            "action_plan": [
                "Direct disciplined monthly investments into low-cost Nifty 50 Index funds or Flexi-cap mutual funds via automated SIPs.",
                "Maximize tax-advantaged Indian investment vehicles (PPF, ELSS, NPS) for dual benefits under section 80C and 80CCD.",
                "Conduct a quarterly audit of recurring OTT, club, and dining subscriptions to plug cash leaks."
            ]
        },
        {
            "id": "rec-5",
            "title": "Establish Zero-Tolerance Automated Bill Repayments",
            "category": "Credit Standing",
            "priority": "Critical" if missed_payments > 0 else "Low",
            "impact": "Eliminates 35% CIBIL score penalty caused by late payment records",
            "description": "Payment history accounts for approximately 35% of your credit score computation in India. Even a single 30-day delinquency remains on credit bureau files for up to 36 months.",
            "action_plan": [
                "Enable NACH / e-Mandate auto-debit on your primary salary account for all EMIs.",
                "Set calendar alerts 3 business days ahead of each due date to ensure adequate account balance.",
                "If overdue payments occurred, contact the bank to request an update or 'Account Closed / Settled' status correction."
            ]
        }
    ]

    # 4. Domain-specific guidance
    credit_advice = [
        f"Keep your credit utilization below 30% (currently {credit_utilization}%). If possible, aim for under 20% on all revolving lines.",
        "Avoid closing your oldest credit card account, as credit age (vintage) represents 15% of your overall credit profile.",
        "Refrain from submitting multiple loan or credit card applications within a short span to avoid multiple 'hard inquiries' on your bureau file."
    ]

    savings_advice = [
        f"Automate monthly savings of at least 20% ({format_currency_inr(salary * 0.20)}) right on salary credit day ('pay yourself first').",
        "Maintain a tiered emergency fund: 2 months in liquid savings bank accounts, 4 months in instant-redemption liquid mutual funds or sweep-in FDs.",
        "Review insurance coverage: ensure adequate Pure Term Life Insurance (10-15x annual income) and comprehensive Family Floater Health Insurance."
    ]

    debt_advice = [
        f"Your Debt-to-Income ratio is {dti}%. Safe financial planning recommends capping total EMIs under 35% of take-home income.",
        "Prioritize high-cost unsecured debt first before aggressively prepaying low-interest tax-deductible home loans.",
        "Whenever annual bonuses, incentives, or tax refunds arrive, direct at least 50% toward principal loan curtailment."
    ]

    # 5. Expected Improvement Timeline
    improvement_timeline = [
        {
            "period": "30 Days",
            "milestone": "Utilization Optimization & Auto-Pay Setup",
            "expected_outcome": f"Pay down revolving balances to lower utilization to under 30%. Enable auto-debit on all {active_loans} loan account(s)."
        },
        {
            "period": "60 Days",
            "milestone": "Bureau Reporting & Score Recalibration",
            "expected_outcome": f"CIBIL and Experian reflect updated lower balances; potential score bump of +15 to +30 points. First ₹{int(savings * 2)} accumulated in reserve."
        },
        {
            "period": "90 Days",
            "milestone": "Emergency Buffer & Debt Repayment Routine",
            "expected_outcome": "Completed 3 consecutive months of on-time payments. Emergency fund reaches 2 months of mandatory expenses."
        },
        {
            "period": "180 Days",
            "milestone": "Prime Credit Tier & Financial Stability",
            "expected_outcome": f"Eligible for prime banking rates (sub-8.5% interest on secured borrowing). DTI reduced and full 6-month buffer established."
        }
    ]

    return {
        "summary": summary,
        "critical_issues": critical_issues,
        "recommendations": recommendations,
        "credit_advice": credit_advice,
        "savings_advice": savings_advice,
        "debt_advice": debt_advice,
        "improvement_timeline": improvement_timeline,
        "disclaimer": "This analysis is for educational and illustrative purposes only and does not constitute formal licensed financial advisory services under SEBI / RBI guidelines. Financial outcomes depend on ongoing personal financial management and institutional credit policies."
    }


def generate_financial_recommendations(profile_dict: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyzes consumer financial metrics and generates structured financial guidance
    via Google Gemini AI. If the API key is missing or an error occurs, seamlessly
    returns a high-quality personalized educational assessment.
    """
    api_key = os.getenv("GEMINI_API_KEY", "").strip()

    # If no key or placeholder, return tailored fallback
    if not api_key or api_key == "your_api_key_here" or api_key == "YOUR_GEMINI_API_KEY":
        logger.info("GEMINI_API_KEY is not configured or using placeholder. Returning high-quality educational fallback.")
        return _get_tailored_fallback_recommendations(profile_dict)

    # Prepare input metrics
    credit_score = profile_dict.get("credit_score", 700)
    credit_utilization = profile_dict.get("credit_utilization", 30.0)
    missed_payments = profile_dict.get("missed_payments", 0)
    active_loans = profile_dict.get("active_loans", 1)
    monthly_salary = profile_dict.get("monthly_salary", 50000.0)
    monthly_expenses = profile_dict.get("monthly_expenses", 25000.0)
    monthly_savings = profile_dict.get("monthly_savings", 10000.0)
    monthly_debt_payments = profile_dict.get("monthly_debt_payments", 15000.0)
    total_debt = profile_dict.get("total_debt", 300000.0)
    savings_rate = profile_dict.get("savings_rate", 20.0)
    debt_to_income = profile_dict.get("debt_to_income_ratio", 30.0)

    prompt = f"""You are an AI financial education assistant specializing in Indian personal finance and banking standards (RBI guidelines, CIBIL/Experian credit bureaus, Indian investment instruments like PPF, SIPs, ELSS, NPS).

Analyze the following consumer financial profile:
- Credit Score (CIBIL/Experian): {credit_score} (Indian range 300-900)
- Credit Utilization: {credit_utilization}% (Recommended benchmark: <30%)
- Missed EMI Payments (past 12 months): {missed_payments}
- Active Loans Count: {active_loans}
- Monthly Net Salary (Take-home): ₹{monthly_salary:,.0f}
- Monthly Living Expenses: ₹{monthly_expenses:,.0f}
- Monthly Savings & Investments: ₹{monthly_savings:,.0f}
- Monthly Debt Payments (EMIs): ₹{monthly_debt_payments:,.0f}
- Total Outstanding Debt Principal: ₹{total_debt:,.0f}
- Computed Savings Rate: {savings_rate}%
- Computed Debt-to-Income (DTI) Ratio: {debt_to_income}%

IMPORTANT GUIDELINES:
1. Provide educational guidance and avoid presenting yourself as a licensed financial advisor.
2. Do not guarantee specific financial outcomes.
3. Be specific to the Indian personal finance context (mention Indian Rupee amounts, CIBIL impact, emergency funds, tax efficiency where relevant).
4. Output STRICT JSON ONLY matching the schema below. Do not wrap in markdown or backticks if possible, or use standard json.

Schema required:
{{
  "summary": "Detailed 2-3 sentence financial health summary specific to this user's numbers.",
  "critical_issues": [
    "Issue 1 based on their numbers",
    "Issue 2 based on their numbers",
    "Issue 3 based on their numbers"
  ],
  "recommendations": [
    {{
      "id": "rec-1",
      "title": "Short punchy title",
      "category": "Credit Health / Debt Management / Emergency Fund / Savings & Investment / Budgeting",
      "priority": "Critical / High / Medium / Low",
      "impact": "Expected impact in points or INR",
      "description": "Clear explanation",
      "action_plan": ["Action step 1", "Action step 2", "Action step 3"]
    }}
  ],
  "credit_advice": [
    "Advice 1", "Advice 2", "Advice 3"
  ],
  "savings_advice": [
    "Advice 1", "Advice 2", "Advice 3"
  ],
  "debt_advice": [
    "Advice 1", "Advice 2", "Advice 3"
  ],
  "improvement_timeline": [
    {{
      "period": "30 Days",
      "milestone": "Key milestone",
      "expected_outcome": "Specific outcome"
    }},
    {{
      "period": "60 Days",
      "milestone": "Key milestone",
      "expected_outcome": "Specific outcome"
    }},
    {{
      "period": "90 Days",
      "milestone": "Key milestone",
      "expected_outcome": "Specific outcome"
    }},
    {{
      "period": "180 Days",
      "milestone": "Key milestone",
      "expected_outcome": "Specific outcome"
    }}
  ],
  "disclaimer": "This analysis is for educational purposes only and does not constitute formal licensed financial advisory services under SEBI / RBI guidelines."
}}
Ensure exactly 5 recommendations in the "recommendations" array."""

    try:
        import urllib.request

        model_candidates = ["gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-3.6-flash"]
        parsed_json = None

        for m_name in model_candidates:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{m_name}:generateContent?key={api_key}"
            payload = json.dumps({
                "contents": [{
                    "parts": [{"text": prompt}]
                }],
                "generationConfig": {
                    "temperature": 0.2,
                    "responseMimeType": "application/json"
                }
            }).encode("utf-8")

            req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
            try:
                with urllib.request.urlopen(req, timeout=14) as r:
                    resp_data = json.loads(r.read().decode("utf-8"))
                    candidates = resp_data.get("candidates", [])
                    if candidates:
                        text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "").strip()
                        if text.startswith("```json"):
                            text = text[7:]
                        elif text.startswith("```"):
                            text = text[3:]
                        if text.endswith("```"):
                            text = text[:-3]
                        text = text.strip()

                        candidate_json = json.loads(text)
                        if isinstance(candidate_json, dict) and "summary" in candidate_json:
                            parsed_json = candidate_json
                            logger.info(f"Successfully generated financial recommendations using {m_name}")
                            break
            except Exception as candidate_err:
                logger.warning(f"Candidate {m_name} call error: {candidate_err}. Attempting next model.")
                continue

        if not parsed_json:
            raise Exception("No candidate model produced valid JSON response.")

        # Validate minimum keys present
        required_keys = ["summary", "critical_issues", "recommendations", "credit_advice", "savings_advice", "debt_advice", "improvement_timeline"]
        if all(k in parsed_json for k in required_keys):
            if "disclaimer" not in parsed_json:
                parsed_json["disclaimer"] = "Educational guidance only; not formal licensed advisory."
            return parsed_json
        else:
            logger.warning("Gemini response missing some required keys. Merging with fallback.")
            fallback = _get_tailored_fallback_recommendations(profile_dict)
            fallback.update({k: v for k, v in parsed_json.items() if v})
            return fallback

    except Exception as e:
        logger.error(f"Error invoking Gemini API: {str(e)}. Returning tailored fallback.")
        return _get_tailored_fallback_recommendations(profile_dict)
