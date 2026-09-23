/**
 * Calculate financial metrics for Indian consumer profile
 */

export const calculateSavingsRate = (monthlySavings, monthlySalary) => {
  const salary = Number(monthlySalary) || 0;
  const savings = Number(monthlySavings) || 0;
  if (salary <= 0) return 0;
  return Number(((savings / salary) * 100).toFixed(1));
};

export const calculateDebtToIncome = (monthlyDebtPayments, monthlySalary) => {
  const salary = Number(monthlySalary) || 0;
  const debt = Number(monthlyDebtPayments) || 0;
  if (salary <= 0) return 0;
  return Number(((debt / salary) * 100).toFixed(1));
};

/**
 * Calculates a composite Financial Health Score (0 - 100)
 * Weighted factors:
 * - Credit Score (300-900 scaled to 0-100) -> 35%
 * - Debt to income ratio (ideal < 36%) -> 25%
 * - Savings rate (ideal > 20%) -> 20%
 * - Missed EMIs penalty -> 20%
 */
export const calculateFinancialHealthScore = ({
  creditScore = 700,
  debtToIncome = 25,
  savingsRate = 20,
  missedEmis = 0
}) => {
  // 1. Credit Score Component (300 to 900 -> 0 to 100)
  const normCredit = Math.max(0, Math.min(100, ((creditScore - 300) / 600) * 100));
  const creditScorePart = normCredit * 0.35;

  // 2. DTI Component (0-20% => 100, 20-35% => 85, 35-50% => 60, >50% => 30)
  let dtiScore = 100;
  if (debtToIncome > 50) dtiScore = 20;
  else if (debtToIncome > 40) dtiScore = 50;
  else if (debtToIncome > 30) dtiScore = 75;
  else if (debtToIncome > 20) dtiScore = 90;
  const dtiPart = dtiScore * 0.25;

  // 3. Savings Rate Component (>= 30% => 100, 20-30% => 85, 10-20% => 65, <10% => 40)
  let savingsScore = 100;
  if (savingsRate >= 30) savingsScore = 100;
  else if (savingsRate >= 20) savingsScore = 85;
  else if (savingsRate >= 10) savingsScore = 65;
  else if (savingsRate > 0) savingsScore = 40;
  else savingsScore = 10;
  const savingsPart = savingsScore * 0.20;

  // 4. Missed EMIs Component (0 missed = 100, 1 = 60, 2 = 30, 3+ = 0)
  let emiScore = 100;
  if (missedEmis === 1) emiScore = 60;
  else if (missedEmis === 2) emiScore = 30;
  else if (missedEmis >= 3) emiScore = 0;
  const emiPart = emiScore * 0.20;

  const totalScore = Math.round(creditScorePart + dtiPart + savingsPart + emiPart);
  return Math.min(100, Math.max(10, totalScore));
};

export const getHealthCategory = (score) => {
  if (score >= 80) return { label: 'Excellent', color: 'var(--success)', bg: 'var(--success-light)' };
  if (score >= 65) return { label: 'Good', color: 'var(--primary)', bg: 'var(--primary-light)' };
  if (score >= 50) return { label: 'Fair / Moderate', color: 'var(--warning)', bg: 'var(--warning-light)' };
  return { label: 'At Risk', color: 'var(--danger)', bg: 'var(--danger-light)' };
};

export const formatINR = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
};
