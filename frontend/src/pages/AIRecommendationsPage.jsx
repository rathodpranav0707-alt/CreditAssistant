import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Info, 
  Menu, 
  Filter, 
  TrendingUp, 
  CheckCircle,
  AlertTriangle,
  CreditCard,
  PiggyBank,
  ShieldCheck,
  Calendar,
  RefreshCw,
  ArrowRight,
  Zap,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { RecommendationCard } from '../components/RecommendationCard';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useFinancial } from '../context/FinancialContext';
import { getRecommendations } from '../services/api';
import { mockRecommendationsList } from '../data/mockRecommendations';

export const AIRecommendationsPage = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiData, setAiData] = useState(null);

  const { user } = useAuth();
  const { financialData, healthScore } = useFinancial();

  const fetchAIRecommendations = async () => {
    setLoading(true);
    setError(null);

    const userId = user?.user_id || 1;
    const result = await getRecommendations(userId);

    if (result.ok) {
      setAiData(result.data);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAIRecommendations();
  }, [user?.user_id]);

  // Categories for filter
  const categories = ['All', 'Credit Health', 'Debt Management', 'Emergency Fund', 'Savings & Investment', 'Budgeting'];

  const recommendationsList = aiData?.recommendations || mockRecommendationsList;

  const filtered = selectedCategory === 'All'
    ? recommendationsList
    : recommendationsList.filter(item => 
        item.category?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        selectedCategory.toLowerCase().includes(item.category?.toLowerCase() || '')
      );

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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ 
                  background: '#111111', 
                  borderRadius: '8px', 
                  padding: '6px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.25)'
                }}>
                  <Sparkles size={18} />
                </div>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 800 }}>AI Financial Advisor</h1>
                <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>Gemini Powered</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Educational diagnostics synthesized from your Indian credit profile, debt ratios, and banking parameters.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              loading={loading}
              onClick={fetchAIRecommendations}
            >
              Re-Analyze
            </Button>
          </div>
        </div>

        <div className="dashboard-container">
          {/* Animated Loading State */}
          {loading && (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-color)',
              marginBottom: '2rem'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 1.5rem',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #e8e8e8 0%, #d0d0d0 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              }}>
                <Sparkles size={32} color="var(--primary)" style={{ animation: 'spin 4s linear infinite' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Analyzing your financial profile...
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '420px', margin: '0.5rem auto 0' }}>
                Evaluating CIBIL benchmarks, debt-to-income velocity, credit utilization, and emergency reserves.
              </p>
            </div>
          )}

          {/* Error Banner with Friendly Recovery */}
          {error && !loading && (
            <div style={{
              padding: '1.25rem 1.5rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem'
            }}>
              <AlertTriangle size={24} color="var(--danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#991b1b', marginBottom: '0.25rem' }}>
                  Unable to complete live AI analysis
                </h4>
                <p style={{ fontSize: '0.875rem', color: '#b91c1c', marginBottom: '0.75rem' }}>
                  {error.includes('No financial profile found') 
                    ? 'Your account does not have a saved financial profile yet. Please complete your profile to generate custom AI recommendations.' 
                    : 'We could not reach the AI advisor right now. Displaying pre-computed educational guidance below.'}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Link to="/profile">
                    <Button variant="primary" size="sm">
                      Complete Financial Profile
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={fetchAIRecommendations}>
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* AI Content (when loaded) */}
          {!loading && (
            <>
              {/* 1. Overall Financial Health Summary */}
              {aiData?.summary && (
                <div style={{
                  background: '#0f172a',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-xl)',
                  padding: '2rem',
                  marginBottom: '2rem',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid #1e293b'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <Zap size={16} />
                      <span>Executive Financial Health Summary</span>
                    </div>
                    <span className="badge" style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                      CIBIL Score: {financialData.creditScore || 740} • DTI: {financialData.monthlyDebtPayments && financialData.monthlySalary ? Math.round((financialData.monthlyDebtPayments / financialData.monthlySalary) * 100) : 23}%
                    </span>
                  </div>
                  <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: '#f1f5f9', fontWeight: 500 }}>
                    "{aiData.summary}"
                  </p>
                </div>
              )}

              {/* 2. Top 3 Critical Issues */}
              {aiData?.critical_issues && aiData.critical_issues.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <AlertTriangle size={20} color="var(--danger)" />
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      Top Critical Issues Requiring Attention
                    </h3>
                  </div>
                  <div className="grid-3">
                    {aiData.critical_issues.map((issue, idx) => (
                      <Card key={idx} style={{ borderLeft: '4px solid var(--danger)', backgroundColor: '#fffbfb' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>
                            Priority #{idx + 1}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: '1.6', fontWeight: 500 }}>
                          {issue}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. 5 Actionable Recommendations */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Lightbulb size={22} color="var(--primary)" />
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        Actionable Recommendations ({recommendationsList.length})
                      </h3>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                        Concrete step-by-step measures prioritized by financial impact
                      </p>
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'} btn-sm`}
                        style={{ borderRadius: 'var(--radius-full)', fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid-2">
                  {filtered.map((rec, idx) => (
                    <RecommendationCard key={rec.id || idx} recommendation={rec} />
                  ))}
                </div>
              </div>

              {/* 4. Domain-Specific Guidance (Credit, Savings, Debt) */}
              <div className="grid-3" style={{ marginBottom: '2rem' }}>
                {/* Credit Advice */}
                <Card style={{ borderTop: '4px solid var(--primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <CreditCard size={20} color="var(--primary)" />
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      Credit Improvement Advice
                    </h4>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {(aiData?.credit_advice || [
                      "Keep credit utilization under 30% on each individual credit card.",
                      "Never close your oldest active credit card line to maintain credit history depth.",
                      "Avoid multiple hard inquiries in short intervals by spacing out loan applications."
                    ]).map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <CheckCircle size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Savings Advice */}
                <Card style={{ borderTop: '4px solid var(--success)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <PiggyBank size={20} color="var(--success)" />
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      Savings & Wealth Advice
                    </h4>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {(aiData?.savings_advice || [
                      "Automate 20% of salary deduction on credit day to high-yield recurring instruments.",
                      "Establish a 6-month living expenses buffer in liquid accounts before risky equity trading.",
                      "Utilize tax-saving Section 80C instruments (PPF, ELSS) to maximize compound growth."
                    ]).map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <CheckCircle size={16} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Debt Advice */}
                <Card style={{ borderTop: '4px solid #f59e0b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <TrendingUp size={20} color="#f59e0b" />
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      Debt Management Advice
                    </h4>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {(aiData?.debt_advice || [
                      "Maintain debt-to-income ratio strictly below 35% of net monthly take-home salary.",
                      "Target the highest APR loans first using the Debt Avalanche strategy.",
                      "Dedicate at least 50% of annual employer bonuses toward principal loan curtailment."
                    ]).map((item, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <CheckCircle size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              {/* 5. Expected Improvement Timeline */}
              {aiData?.improvement_timeline && aiData.improvement_timeline.length > 0 && (
                <Card title="Expected Improvement Timeline" subtitle="Target roadmap if recommendations are implemented consistently" style={{ marginBottom: '2rem' }}>
                  <div className="grid-4">
                    {aiData.improvement_timeline.map((step, idx) => (
                      <div
                        key={idx}
                        style={{
                          backgroundColor: 'var(--bg-main)',
                          padding: '1.25rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-color)',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <Calendar size={16} color="var(--primary)" />
                          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--primary)' }}>
                            {step.period}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                          {step.milestone}
                        </h4>
                        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                          {step.expected_outcome}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Educational Disclaimer */}
              <div style={{
                padding: '1rem 1.25rem',
                backgroundColor: 'var(--bg-main)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.8rem',
                color: 'var(--text-muted)'
              }}>
                <HelpCircle size={20} color="var(--text-light)" style={{ flexShrink: 0 }} />
                <div>
                  <strong>Educational Guidance Disclaimer:</strong> {aiData?.disclaimer || "This AI financial analysis is provided solely for educational and informational purposes under Indian personal finance principles. It does not constitute formal licensed financial advisory services under SEBI / RBI regulations. Users should evaluate their individual risk tolerance before making capital decisions."}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};
