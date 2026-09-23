import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  TrendingUp, 
  AlertTriangle, 
  Layers, 
  Wallet, 
  Percent, 
  PieChart as PieIcon, 
  Sparkles, 
  FileText, 
  Menu, 
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { MetricCard } from '../components/MetricCard';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { CreditScoreChart } from '../charts/CreditScoreChart';
import { IncomeExpenseChart } from '../charts/IncomeExpenseChart';
import { SavingsProgressChart } from '../charts/SavingsProgressChart';
import { DebtIncomeChart } from '../charts/DebtIncomeChart';
import { useFinancial } from '../context/FinancialContext';
import { useAuth } from '../context/AuthContext';
import { getHealthCategory, formatINR } from '../services/calculations';
import { getRecommendations } from '../services/api';

export const DashboardPage = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const {
    financialData,
    savingsRate,
    debtToIncome,
    healthScore,
    loadDashboardData,
    dashboardLoading,
    dashboardError,
  } = useFinancial();
  const { user } = useAuth();

  // Load real data from backend whenever the dashboard mounts
  useEffect(() => {
    if (user?.user_id) {
      loadDashboardData(user.user_id);

      // Also fetch AI recommendation preview
      setAiLoading(true);
      getRecommendations(user.user_id).then((res) => {
        if (res.ok) {
          setAiSummary(res.data);
        }
        setAiLoading(false);
      });
    }
  }, [user?.user_id]);

  const healthTier = getHealthCategory(healthScore);

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      <main className="main-content">
        {/* Top bar */}
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
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Financial Health Dashboard</h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Welcome back, {user?.name || 'Consumer'}. Here is your live financial diagnostic.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/profile">
              <Button variant="outline" size="sm">
                Edit Parameters
              </Button>
            </Link>
            <Link to="/recommendations">
              <Button variant="primary" size="sm" icon={Sparkles}>
                AI Recommendations
              </Button>
            </Link>
          </div>
        </div>

        <div className="dashboard-container">
          {/* Backend sync status */}
          {dashboardLoading && (
            <div style={{ padding: '0.75rem 1rem', backgroundColor: '#f0f0f0', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem', color: '#1a1a1a' }}>
              🔄 Syncing latest financial data from database...
            </div>
          )}
          {dashboardError && !dashboardLoading && (
            <div style={{ padding: '0.75rem 1rem', backgroundColor: '#fef9c3', border: '1px solid #fde047', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem', color: '#854d0e' }}>
              ⚠ Showing saved local parameters. Backend note: {dashboardError}
            </div>
          )}
          {!dashboardLoading && !dashboardError && user?.user_id && (
            <div style={{ padding: '0.75rem 1rem', backgroundColor: '#dcfce7', border: '1px solid #86efac', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem', color: '#15803d' }}>
              ✓ Live records synchronized from database for {user.name} ({user.email})
            </div>
          )}

          {/* Main Health Score Banner */}
          <div style={{
            background: '#0f172a',
            color: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <ShieldCheck size={18} />
                <span>Computed Financial Health Status</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {healthScore}
                </span>
                <span style={{ fontSize: '1.25rem', color: '#94a3b8' }}>/ 100</span>
                <span className="badge" style={{ backgroundColor: healthTier.bg, color: healthTier.color, fontSize: '0.9rem', padding: '0.35rem 0.85rem' }}>
                  {healthTier.label} Status
                </span>
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.925rem', marginTop: '0.75rem', maxWidth: '540px' }}>
                Your financial parameters are in <strong>{healthTier.label}</strong> shape. 
                {debtToIncome > 35 
                  ? ' Focus on reducing revolving card balances and high-interest EMIs to strengthen debt capacity.' 
                  : ' Keep credit utilization under 30% and sustain your monthly savings velocity to enter prime borrowing tiers.'}
              </p>
            </div>

            <div style={{ minWidth: '260px', background: '#1e293b', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid #334155' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem' }}>
                Real-Time Metric Breakdown
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Credit Score ({financialData.creditScore})</span>
                  <span style={{ color: financialData.creditScore >= 750 ? '#34d399' : '#38bdf8' }}>
                    {financialData.creditScore >= 750 ? 'Excellent' : financialData.creditScore >= 700 ? 'Good' : 'Fair'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>DTI Ratio ({debtToIncome}%)</span>
                  <span style={{ color: debtToIncome <= 35 ? '#34d399' : '#f87171' }}>
                    {debtToIncome <= 35 ? 'Healthy' : 'Elevated'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Savings Velocity ({savingsRate}%)</span>
                  <span style={{ color: savingsRate >= 20 ? '#34d399' : '#facc15' }}>
                    {savingsRate >= 20 ? 'Strong' : 'Moderate'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Missed EMIs ({financialData.missedEmis})</span>
                  <span style={{ color: financialData.missedEmis === 0 ? '#34d399' : '#f87171' }}>
                    {financialData.missedEmis === 0 ? 'Clean Record' : `${financialData.missedEmis} Overdue`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Metric Cards Grid — All 9 Required Metrics */}
          <div className="grid-4" style={{ marginBottom: '2rem' }}>
            <MetricCard
              title="Credit Score"
              value={financialData.creditScore}
              trend={financialData.creditScore >= 750 ? 'Prime Tier' : 'Growth Potential'}
              trendType={financialData.creditScore >= 750 ? 'positive' : 'neutral'}
              badgeText="CIBIL / Experian"
              badgeType={financialData.creditScore >= 750 ? 'success' : 'info'}
              icon={CreditCard}
              iconBg="var(--primary-light)"
              iconColor="var(--primary)"
            />

            <MetricCard
              title="Credit Utilization"
              value={`${financialData.creditUtilization}%`}
              trend={financialData.creditUtilization <= 30 ? 'Within Safe Zone (<30%)' : 'Exceeds Benchmark'}
              trendType={financialData.creditUtilization <= 30 ? 'positive' : 'negative'}
              badgeText="Revolving Balance"
              badgeType={financialData.creditUtilization <= 30 ? 'success' : 'warning'}
              icon={Percent}
              iconBg="#fef3c7"
              iconColor="#d97706"
            />

            <MetricCard
              title="Savings Rate"
              value={`${savingsRate}%`}
              trend={savingsRate >= 20 ? 'Meets 20% Target' : 'Below 20% Benchmark'}
              trendType={savingsRate >= 20 ? 'positive' : 'negative'}
              badgeText="Target >20%"
              badgeType={savingsRate >= 20 ? 'success' : 'warning'}
              icon={TrendingUp}
              iconBg="var(--success-light)"
              iconColor="var(--success)"
            />

            <MetricCard
              title="Debt-to-Income (DTI)"
              value={`${debtToIncome}%`}
              trend={debtToIncome <= 35 ? 'Healthy Buffer (<35%)' : 'High Debt Burden'}
              trendType={debtToIncome <= 35 ? 'positive' : 'negative'}
              badgeText="Target <35%"
              badgeType={debtToIncome <= 35 ? 'info' : 'danger'}
              icon={PieIcon}
              iconBg="var(--primary-light)"
              iconColor="var(--primary)"
            />

            <MetricCard
              title="Monthly Income"
              value={formatINR(financialData.monthlySalary)}
              subtitle="Net Take-Home Salary"
              icon={Wallet}
              iconBg="var(--bg-main)"
              iconColor="var(--text-main)"
            />

            <MetricCard
              title="Monthly Expenses"
              value={formatINR(financialData.monthlyExpenses)}
              subtitle="Living Essentials & Rent"
              icon={Wallet}
              iconBg="#fee2e2"
              iconColor="#dc2626"
            />

            <MetricCard
              title="Monthly Savings"
              value={formatINR(financialData.monthlySavings)}
              subtitle="Investments & SIPs"
              icon={Wallet}
              iconBg="var(--success-light)"
              iconColor="var(--success)"
            />

            <MetricCard
              title="Missed EMI Payments"
              value={financialData.missedEmis}
              trend={financialData.missedEmis === 0 ? 'Flawless History' : 'Immediate Resolution Needed'}
              trendType={financialData.missedEmis === 0 ? 'positive' : 'negative'}
              badgeText="Past 12 Months"
              badgeType={financialData.missedEmis === 0 ? 'success' : 'danger'}
              icon={AlertTriangle}
              iconBg={financialData.missedEmis === 0 ? 'var(--success-light)' : '#fee2e2'}
              iconColor={financialData.missedEmis === 0 ? 'var(--success)' : '#dc2626'}
            />
          </div>

          {/* Active Loans, Total Debt & AI Panel Row */}
          <div className="grid-2" style={{ marginBottom: '2rem' }}>
            {/* Active Loans & Debt Summary */}
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    ACTIVE LOANS & EMIs
                  </span>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                    {financialData.activeLoans} Active Account{financialData.activeLoans === 1 ? '' : 's'}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Monthly Outflow: <strong>{formatINR(financialData.monthlyDebtPayments)}</strong>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    TOTAL OUTSTANDING PRINCIPAL
                  </span>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#dc2626', marginTop: '0.2rem' }}>
                    {formatINR(financialData.totalDebt)}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Cumulative Balance
                  </div>
                </div>
              </div>
            </Card>

            {/* AI Advisor Panel Preview */}
            <Card style={{ background: '#f4f4f4', borderColor: '#d0d0d0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
                    <Sparkles size={22} color="#111111" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>AI Financial Advisor</h3>
                    <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                      {aiLoading ? 'Analyzing...' : 'Gemini AI Diagnostics'}
                    </span>
                  </div>
                </div>
                <Link to="/recommendations">
                  <Button variant="primary" size="sm" icon={ArrowUpRight}>
                    Full Advice ({aiSummary?.recommendations?.length || 5})
                  </Button>
                </Link>
              </div>

              <p style={{ fontSize: '0.875rem', color: '#334155', marginTop: '1rem', lineHeight: '1.5' }}>
                {aiSummary?.summary 
                  ? `"${aiSummary.summary.length > 180 ? aiSummary.summary.substring(0, 180) + '...' : aiSummary.summary}"`
                  : `"Evaluating your ${financialData.creditUtilization}% utilization and ${savingsRate}% savings rate. Structured debt prepayments and auto-pay rules can elevate your profile."`}
              </p>

              {aiSummary?.critical_issues?.[0] && (
                <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#b91c1c' }}>
                  <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                  <span><strong>Top Focus:</strong> {aiSummary.critical_issues[0]}</span>
                </div>
              )}
            </Card>
          </div>

          {/* 4 Professional Recharts Visualizations */}
          <div className="grid-2" style={{ marginBottom: '2rem' }}>
            <Card 
              title="1. Credit Score Trajectory" 
              subtitle={`Current Score: ${financialData.creditScore} • 6-Month Projected Milestone Toward Prime Tier (750+)`}
            >
              <CreditScoreChart currentScore={financialData.creditScore} />
            </Card>

            <Card 
              title="2. Cash Inflow vs Outflow Allocation" 
              subtitle="Your Current Monthly Outflows Compared Against 50-30-20 Standard Benchmark"
            >
              <IncomeExpenseChart 
                salary={financialData.monthlySalary}
                expenses={financialData.monthlyExpenses}
                debt={financialData.monthlyDebtPayments}
                savings={financialData.monthlySavings}
              />
            </Card>

            <Card 
              title="3. Savings & Wealth Accumulation" 
              subtitle={`Projected 6-Month Corpus at Current Rate of ${formatINR(financialData.monthlySavings)}/month`}
            >
              <SavingsProgressChart monthlySavings={financialData.monthlySavings} />
            </Card>

            <Card 
              title="4. Monthly Income Allocation Breakdown" 
              subtitle={`Distribution of ${formatINR(financialData.monthlySalary)} Net Monthly Salary`}
            >
              <DebtIncomeChart 
                salary={financialData.monthlySalary}
                expenses={financialData.monthlyExpenses}
                debt={financialData.monthlyDebtPayments}
                savings={financialData.monthlySavings}
              />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
