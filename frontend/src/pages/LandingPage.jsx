import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  PieChart as PieIcon, 
  FileCheck, 
  CreditCard, 
  Bell, 
  AlertTriangle,
  Lock
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">
            Take Control of Your Financial Future
          </h1>

          <p className="hero-subtitle">
            Understand your financial health, identify risks, and receive personalized AI-powered guidance tailored to Indian lending standards and CIBIL realities.
          </p>

          <div className="hero-actions">
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <Button variant="primary" size="lg" icon={ArrowRight}>
                {isAuthenticated ? "Go to My Dashboard" : "Get Started - Free Analysis"}
              </Button>
            </Link>
            <Link to={isAuthenticated ? "/profile" : "/login"}>
              <Button variant="outline" size="lg">
                {isAuthenticated ? "Update Financial Profile" : "Existing User Login"}
              </Button>
            </Link>
          </div>

          {/* Quick Metrics preview banner */}
          <div style={{ 
            marginTop: '3.5rem', 
            maxWidth: '950px', 
            marginInline: 'auto',
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '1.75rem',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-xl)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '1.5rem',
            textAlign: 'left'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Average User Score</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)' }}>740 +45pts</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>Typical score boost in 6 mos</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Healthy DTI Benchmark</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>&lt; 35%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>Protects your loan eligibility</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Smart Diagnostics</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>10+ Metrics</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>Credit card, EMI & debt analysis</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Report Generation</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669' }}>Instant PDF</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>Ready for bank audits & review</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '5rem 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="scroll-reveal" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge badge-info" style={{ marginBottom: '0.75rem' }}>Modern Fintech Engine</span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              Engineered for Complete Financial Clarity
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0.5rem auto 0', fontSize: '1.05rem' }}>
              Everything Indian salaried and self-employed professionals need to eliminate credit blind spots and accelerate savings.
            </p>
          </div>

          <div className="grid-3">
            <div className="scroll-reveal stagger-1">
              <Card title="Credit Utilization Tracking" className="card-hover-motion">
                <div style={{ margin: '1rem 0' }}>
                  <CreditCard size={36} color="var(--primary)" />
                </div>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  High credit card spending can silently damage your credit score even if paid in full. We monitor your revolving utilization threshold below 30%.
                </p>
              </Card>
            </div>

            <div className="scroll-reveal stagger-2">
              <Card title="Debt-to-Income Diagnostics" className="card-hover-motion">
                <div style={{ margin: '1rem 0' }}>
                  <PieIcon size={36} color="#059669" />
                </div>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  Evaluate your monthly EMI burden against net take-home salary. Keep your borrowing safe for prospective home and personal loan applications.
                </p>
              </Card>
            </div>

            <div className="scroll-reveal stagger-3">
              <Card title="Missed EMI Guard" className="card-hover-motion">
                <div style={{ margin: '1rem 0' }}>
                  <AlertTriangle size={36} color="#d97706" />
                </div>
                <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  A single delayed installment can crash your CIBIL score by up to 80 points. Receive automated alerts and buffer account recommendations.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{ padding: '5rem 0', backgroundColor: 'var(--bg-main)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="scroll-reveal" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge badge-success" style={{ marginBottom: '0.75rem' }}>Simple 3-Step Process</span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              How Credit Assistant Operates
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '580px', margin: '0.5rem auto 0' }}>
              Transform numbers and statements into an actionable financial roadmap in under 3 minutes.
            </p>
          </div>

          <div className="grid-3">
            <div className="scroll-reveal stagger-1" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '50%', 
                background: 'var(--primary-light)', 
                color: 'var(--primary)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontWeight: 800,
                fontSize: '1.25rem'
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Provide Financial Profile</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Enter key metrics including salary, monthly expenses, active loans, and credit score without sharing sensitive bank credentials.
              </p>
            </div>

            <div className="scroll-reveal stagger-2" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '50%', 
                background: 'var(--success-light)', 
                color: 'var(--success)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontWeight: 800,
                fontSize: '1.25rem'
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Automated Health Diagnosis</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Our algorithms compute your Savings Rate, Debt-to-Income ratio, and composite Financial Health Score in real time.
              </p>
            </div>

            <div className="scroll-reveal stagger-3" style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                borderRadius: '50%', 
                background: '#fef3c7', 
                color: '#d97706', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontWeight: 800,
                fontSize: '1.25rem'
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Actionable AI Guidance</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Receive tailored step-by-step advice on reducing debt, improving CIBIL, and exporting official PDF health reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Health Explanation Section */}
      <section id="financial-health" style={{ padding: '5rem 0', backgroundColor: '#ffffff', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div className="scroll-reveal-left">
              <span className="badge badge-info" style={{ marginBottom: '0.75rem' }}>Comprehensive Assessment</span>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1.25rem' }}>
                What Makes Up Your Financial Health Score?
              </h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                Unlike basic credit bureaus that only look at repayment history, CREDIT ASSISTANT evaluates holistic financial robustness:
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', marginTop: '8px' }} />
                  <div>
                    <strong>Credit Score (35% weight):</strong> Gauges credit bureau trust (CIBIL/Experian) and loan approval likelihood.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', marginTop: '8px' }} />
                  <div>
                    <strong>Debt-to-Income Ratio (25% weight):</strong> Ensures that monthly loan commitments do not consume over 35-40% of salary.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', marginTop: '8px' }} />
                  <div>
                    <strong>Savings Rate (20% weight):</strong> Rewards maintaining a healthy 20%+ buffer towards wealth creation and emergency reserves.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--danger)', marginTop: '8px' }} />
                  <div>
                    <strong>Repayment Discipline (20% weight):</strong> Rigorously penalizes recent missed EMIs or credit card minimum dues.
                  </div>
                </div>
              </div>
            </div>

            <div className="scroll-reveal-right">
              <Card className="card-hover-motion" style={{ padding: '2rem', border: '2px solid var(--primary-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>DEMO SCORING ENGINE</span>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Financial Score: 82/100</h3>
                  </div>
                  <span className="badge badge-success" style={{ fontSize: '0.85rem' }}>Excellent Tier</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                      <span>Credit Bureau Standing (740 CIBIL)</span>
                      <strong>88 / 100</strong>
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill" style={{ width: '88%', backgroundColor: 'var(--primary)' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                      <span>Debt Burden (DTI 22.6%)</span>
                      <strong>90 / 100</strong>
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill" style={{ width: '90%', backgroundColor: 'var(--success)' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                      <span>Savings Velocity (26.7%)</span>
                      <strong>85 / 100</strong>
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill" style={{ width: '85%', backgroundColor: '#111111' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                      <span>Zero Overdue EMIs</span>
                      <strong>100 / 100</strong>
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill" style={{ width: '100%', backgroundColor: '#10b981' }} />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* AI Advisor Section */}
      <section id="ai-advisor" style={{ padding: '5rem 0', backgroundColor: 'var(--bg-main)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="scroll-reveal" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge badge-info" style={{ marginBottom: '0.75rem' }}>Intelligent Copilot</span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Your Personalized AI Financial Advisor
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '620px', margin: '0.5rem auto 0' }}>
              Get custom recommendations calibrated specifically for Indian banking, tax, and EMI regulations.
            </p>
          </div>

          <div className="grid-3">
            <div className="scroll-reveal stagger-1">
              <Card className="card-hover-motion">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Sparkles size={20} color="var(--primary)" />
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary)' }}>CREDIT CARD OPTIMIZER</span>
                </div>
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Pre-statement Payment Strategy</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  Learn how paying partial balances 3 days before your bill generation keeps reported credit utilization low and boosts your CIBIL score.
                </p>
              </Card>
            </div>

            <div className="scroll-reveal stagger-2">
              <Card className="card-hover-motion">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Sparkles size={20} color="#059669" />
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#059669' }}>LOAN ACCELERATOR</span>
                </div>
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Avalanche Prepayment Model</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  Pinpoints high APR unsecured loans first, demonstrating how one extra annual installment slashes interest costs significantly.
                </p>
              </Card>
            </div>

            <div className="scroll-reveal stagger-3">
              <Card className="card-hover-motion">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Sparkles size={20} color="#d97706" />
                  <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#d97706' }}>CASH FLOW SHIELD</span>
                </div>
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Emergency Buffer Planner</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  Computes the exact 6-month safety net needed to safeguard against unexpected hospital bills, vehicle repairs, or career transitions.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#0f172a', color: '#ffffff', textAlign: 'center' }}>
        <div className="container scroll-reveal-zoom">
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
            Ready to Elevate Your Financial Wellness?
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.1rem' }}>
            Join thousands of Indian consumers mastering their credit profile with our free AI advisor.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/register">
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                style={{ backgroundColor: '#38bdf8', color: '#0c1a2e', boxShadow: '0 4px 14px rgba(56,189,248,0.35)', border: 'none' }}
              >
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
