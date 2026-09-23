/**
 * FinancialContext.jsx — Financial data state management.
 *
 * - `financialData` holds the current profile values (from API or defaults)
 * - `updateFinancialData` merges new values in (called after API save)
 * - `loadDashboardData` fetches real data from the backend
 * - Chart arrays stay in context (mock history — will be real in Stage 3)
 * - Computed metrics (savingsRate, debtToIncome, healthScore) derived here
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { defaultFinancialData, creditScoreHistory, incomeVsExpensesData, savingsProgressData } from '../data/mockData';
import { calculateSavingsRate, calculateDebtToIncome, calculateFinancialHealthScore } from '../services/calculations';
import { getDashboard } from '../services/api';

const FinancialContext = createContext();

const STORAGE_KEY = 'credit_assistant_financial_data';

export const FinancialProvider = ({ children }) => {
  const [financialData, setFinancialData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultFinancialData;
    } catch {
      return defaultFinancialData;
    }
  });

  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState(null);

  // Merge new data into current state and persist to localStorage
  const updateFinancialData = (newData) => {
    setFinancialData(prev => {
      const updated = { ...prev, ...newData };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  /**
   * Fetch real dashboard data from the backend for a given userId.
   * Maps snake_case API response fields back to camelCase for the frontend.
   */
  const loadDashboardData = useCallback(async (userId) => {
    if (!userId) return;
    setDashboardLoading(true);
    setDashboardError(null);

    const result = await getDashboard(userId);

    if (result.ok) {
      const d = result.data;
      const mapped = {
        creditScore: d.credit_score,
        creditUtilization: d.credit_utilization,
        missedEmis: d.missed_payments,
        activeLoans: d.active_loans,
        monthlySalary: d.monthly_salary,
        monthlyExpenses: d.monthly_expenses,
        monthlySavings: d.monthly_savings,
        monthlyDebtPayments: d.monthly_debt_payments,
        totalDebt: d.total_debt,
      };
      updateFinancialData(mapped);
      setDashboardError(null);
    } else {
      // Non-fatal — dashboard still works with localStorage fallback
      setDashboardError(result.error);
    }

    setDashboardLoading(false);
  }, []);

  // Computed metrics — always derived from latest financialData
  const savingsRate = calculateSavingsRate(financialData.monthlySavings, financialData.monthlySalary);
  const debtToIncome = calculateDebtToIncome(financialData.monthlyDebtPayments, financialData.monthlySalary);
  const healthScore = calculateFinancialHealthScore({
    creditScore: financialData.creditScore,
    debtToIncome: debtToIncome,
    savingsRate: savingsRate,
    missedEmis: financialData.missedEmis
  });

  return (
    <FinancialContext.Provider value={{
      financialData,
      updateFinancialData,
      loadDashboardData,
      dashboardLoading,
      dashboardError,
      savingsRate,
      debtToIncome,
      healthScore,
      creditScoreHistory,
      incomeVsExpensesData,
      savingsProgressData,
    }}>
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => useContext(FinancialContext);
