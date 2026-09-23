import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calculator, 
  CheckCircle, 
  IndianRupee, 
  CreditCard, 
  Percent, 
  AlertCircle, 
  Layers, 
  Wallet, 
  ArrowRight,
  Sparkles,
  RefreshCw,
  Menu
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { MetricCard } from '../components/MetricCard';
import { ProgressBar } from '../components/ProgressBar';
import { useFinancial } from '../context/FinancialContext';
import { useAuth } from '../context/AuthContext';
import {
  calculateSavingsRate,
  calculateDebtToIncome,
  calculateFinancialHealthScore,
  getHealthCategory,
  formatINR
} from '../services/calculations';
import { saveFinancialProfile } from '../services/api';

export const FinancialProfilePage = () => {
  const navigate = useNavigate();
  const { financialData, updateFinancialData } = useFinancial();
  const { user } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [serverError, setServerError] = useState('');

  const [form, setForm] = useState({
    creditScore: financialData.creditScore || 740,
    creditUtilization: financialData.creditUtilization || 28,
    missedEmis: financialData.missedEmis || 0,
    activeLoans: financialData.activeLoans || 2,
    monthlySalary: financialData.monthlySalary || 75000,
    monthlyExpenses: financialData.monthlyExpenses || 38000,
    monthlySavings: financialData.monthlySavings || 20000,
    monthlyDebtPayments: financialData.monthlyDebtPayments || 17000,
    totalDebt: financialData.totalDebt || 450000,
  });

  const handleChange = (field, val) => {
    const num = Number(val) || 0;
    setForm(prev => ({ ...prev, [field]: num }));
    setIsSaved(false);
  };

  // Real-time frontend metrics calculation
  const liveSavingsRate = calculateSavingsRate(form.monthlySavings, form.monthlySalary);
  const liveDTI = calculateDebtToIncome(form.monthlyDebtPayments, form.monthlySalary);
  const liveHealthScore = calculateFinancialHealthScore({
    creditScore: form.creditScore,
    debtToIncome: liveDTI,
    savingsRate: liveSavingsRate,
    missedEmis: form.missedEmis
  });
  const healthTier = getHealthCategory(liveHealthScore);

  const handleCalculate = async (e) => {
    e.preventDefault();
    setCalculating(true);
    setServerError('');

    // Try to save to the backend if the user is logged in
    if (user?.user_id) {
      const result = await saveFinancialProfile(user.user_id, form);
      if (!result.ok) {
        setServerError(result.error);
      }
    }

    // Always update local state so dashboard stays current
    updateFinancialData(form);
    setCalculating(false);
    setIsSaved(true);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      <main className="main-content">
        <div className="dashboard-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileSidebarOpen(true)}
              style={{ display: 'block', padding: '0.25rem' }}
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Financial Profile & Parameters</h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Keep your income, debts, and credit metrics updated for precise health score computation.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              View Dashboard
            </Button>
          </div>
        </div>

        <div className="dashboard-container">
          {isSaved && (
            <div className="alert-banner info" style={{ backgroundColor: 'var(--success-light)', borderColor: '#a7f3d0', color: 'var(--success-dark)' }}>
              <CheckCircle size={20} />
              <div>
                <strong>Financial parameters updated successfully!</strong> Metrics and health scores have synced with your dashboard.
              </div>
            </div>
          )}

          {/* Quick Real-Time Metrics Cards */}
          <div className="grid-3" style={{ marginBottom: '2rem' }}>
            <Card style={{ borderLeft: `5px solid ${healthTier.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Computed Health Score
                  </span>
                  <div style={{ fontSize: '2.25rem', fontWeight: 800, color: healthTier.color, marginTop: '0.25rem' }}>
                    {liveHealthScore} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 100</span>
                  </div>
                </div>
                <span className="badge" style={{ backgroundColor: healthTier.bg, color: healthTier.color }}>
                  {healthTier.label}
                </span>
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <ProgressBar value={liveHealthScore} color={healthTier.color} height="6px" />
              </div>
            </Card>

            <Card style={{ borderLeft: '5px solid var(--primary)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Savings Rate
              </span>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
                {liveSavingsRate}%
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                Formula: (Monthly Savings / Salary) × 100
              </p>
              <div style={{ marginTop: '0.5rem' }}>
                <ProgressBar value={liveSavingsRate} max={40} color="var(--primary)" height="6px" />
              </div>
            </Card>

            <Card style={{ borderLeft: `5px solid ${liveDTI > 40 ? 'var(--danger)' : liveDTI > 30 ? 'var(--warning)' : 'var(--success)'}` }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Debt-to-Income (DTI)
              </span>
              <div style={{ 
                fontSize: '2.25rem', 
                fontWeight: 800, 
                color: liveDTI > 40 ? 'var(--danger)' : liveDTI > 30 ? 'var(--warning)' : 'var(--success)', 
                marginTop: '0.25rem' 
              }}>
                {liveDTI}%
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                Formula: (Monthly Debt EMIs / Salary) × 100
              </p>
              <div style={{ marginTop: '0.5rem' }}>
                <ProgressBar 
                  value={liveDTI} 
                  max={60} 
                  color={liveDTI > 40 ? 'var(--danger)' : liveDTI > 30 ? 'var(--warning)' : 'var(--success)'} 
                  height="6px" 
                />
              </div>
            </Card>
          </div>

          <Card title="Financial Inputs & Consumer Metrics" subtitle="Configure realistic values representing your current Indian banking status">
            <form onSubmit={handleCalculate}>
              <div className="grid-2">
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--primary)' }}>
                    1. Credit & Debt Obligations
                  </h4>

                  <Input
                    label="Credit Score (CIBIL / Experian)"
                    type="number"
                    min="300"
                    max="900"
                    value={form.creditScore}
                    onChange={(e) => handleChange('creditScore', e.target.value)}
                    hint="Standard Indian score range: 300 to 900"
                  />

                  <Input
                    label="Credit Utilization (%)"
                    type="number"
                    min="0"
                    max="100"
                    value={form.creditUtilization}
                    onChange={(e) => handleChange('creditUtilization', e.target.value)}
                    hint="Ideal benchmark: below 30%"
                  />

                  <Input
                    label="Missed EMI Payments (Past 12 Months)"
                    type="number"
                    min="0"
                    max="12"
                    value={form.missedEmis}
                    onChange={(e) => handleChange('missedEmis', e.target.value)}
                    hint="Overdue loan or credit card installments"
                  />

                  <Input
                    label="Active Loans Count"
                    type="number"
                    min="0"
                    max="20"
                    value={form.activeLoans}
                    onChange={(e) => handleChange('activeLoans', e.target.value)}
                    hint="Home, Car, Personal, Two-wheeler, or Consumer loans"
                  />

                  <Input
                    label="Total Outstanding Debt (₹)"
                    type="number"
                    min="0"
                    step="1000"
                    value={form.totalDebt}
                    onChange={(e) => handleChange('totalDebt', e.target.value)}
                    hint="Cumulative principal owed across all institutions"
                  />
                </div>

                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--primary)' }}>
                    2. Cash Flow & Monthly Income
                  </h4>

                  <Input
                    label="Monthly Take-Home Salary (₹)"
                    type="number"
                    min="0"
                    step="1000"
                    value={form.monthlySalary}
                    onChange={(e) => handleChange('monthlySalary', e.target.value)}
                    hint="Net monthly bank credit after PF, PT & TDS"
                  />

                  <Input
                    label="Monthly Living Expenses (₹)"
                    type="number"
                    min="0"
                    step="500"
                    value={form.monthlyExpenses}
                    onChange={(e) => handleChange('monthlyExpenses', e.target.value)}
                    hint="Rent, utilities, groceries, lifestyle, school fees"
                  />

                  <Input
                    label="Monthly Debt Payments / EMIs (₹)"
                    type="number"
                    min="0"
                    step="500"
                    value={form.monthlyDebtPayments}
                    onChange={(e) => handleChange('monthlyDebtPayments', e.target.value)}
                    hint="Mandatory monthly loan & card EMI deductions"
                  />

                  <Input
                    label="Monthly Savings & Investments (₹)"
                    type="number"
                    min="0"
                    step="500"
                    value={form.monthlySavings}
                    onChange={(e) => handleChange('monthlySavings', e.target.value)}
                    hint="SIPs, PPF, recurring deposits, liquid savings"
                  />

                  <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', marginTop: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                      <span>Net Cash Left (Surplus/Deficit):</span>
                      <strong>
                        {formatINR(form.monthlySalary - form.monthlyExpenses - form.monthlyDebtPayments - form.monthlySavings)}
                      </strong>
                    </div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                      Keeping unallocated surplus positive helps protect you against month-end cash crunches.
                    </div>
                  </div>
                </div>
              </div>

              {serverError && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fca5a5',
                  borderRadius: 'var(--radius-md)',
                  color: '#dc2626',
                  fontSize: '0.875rem',
                }}>
                  ⚠ Backend: {serverError}. Your data has been saved locally.
                </div>
              )}

              <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  icon={Calculator}
                  loading={calculating}
                >
                  Calculate Financial Health
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  icon={ArrowRight}
                  onClick={async () => {
                    if (user?.user_id) {
                      await saveFinancialProfile(user.user_id, form);
                    }
                    updateFinancialData(form);
                    navigate('/dashboard');
                  }}
                >
                  Save & Go to Dashboard
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};
