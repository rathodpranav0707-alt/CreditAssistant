import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Menu, 
  ShieldCheck, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { useFinancial } from '../context/FinancialContext';
import { useAuth } from '../context/AuthContext';
import { getHealthCategory, formatINR } from '../services/calculations';
import { mockRecommendationsList } from '../data/mockRecommendations';
import { generateReport } from '../services/api';

export const FinancialReportPage = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportUrl, setReportUrl] = useState(null);
  const [reportFilename, setReportFilename] = useState(null);
  const [reportError, setReportError] = useState(null);
  const { financialData, savingsRate, debtToIncome, healthScore } = useFinancial();
  const { user } = useAuth();

  const healthTier = getHealthCategory(healthScore);
  const reportDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handleGeneratePdf = async () => {
    if (!user?.user_id) {
      setReportError("You must be logged in to generate a report.");
      return;
    }
    setReportLoading(true);
    setReportUrl(null);
    setReportFilename(null);
    setReportError(null);

    const result = await generateReport(user.user_id);

    setReportLoading(false);
    if (result.ok) {
      setReportUrl(result.url);
      setReportFilename(result.filename);
    } else {
      setReportError(result.error);
    }
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
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Financial Health Report Preview</h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Comprehensive financial diagnostic summary and loan-readiness audit.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="primary"
              size="sm"
              icon={reportLoading ? Loader2 : Download}
              onClick={handleGeneratePdf}
              disabled={reportLoading}
            >
              {reportLoading ? 'Generating…' : 'Generate PDF Report'}
            </Button>
          </div>
        </div>

        <div className="dashboard-container">
          {/* Loading Banner */}
          {reportLoading && (
            <div className="alert-banner info" style={{ animation: 'fadeIn 0.3s ease', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
              <div>
                <strong>Generating your report…</strong>&nbsp; Please wait while the AI assembles your financial health PDF.
              </div>
            </div>
          )}

          {/* Success Banner */}
          {reportUrl && (
            <div className="alert-banner success" style={{ animation: 'fadeIn 0.3s ease', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle2 size={20} />
                <div>
                  <strong>Report generated successfully!</strong> Your PDF is ready to download.
                </div>
              </div>
              <a
                href={reportUrl}
                download={reportFilename}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: 'var(--success)',
                  color: '#fff',
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                <Download size={15} />
                Download PDF
              </a>
            </div>
          )}

          {/* Error Banner */}
          {reportError && (
            <div className="alert-banner danger" style={{ animation: 'fadeIn 0.3s ease' }}>
              <AlertCircle size={20} />
              <div>
                <strong>Report generation failed:</strong> {reportError}
              </div>
            </div>
          )}

          {/* Printable Report Document Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)',
            padding: '2.5rem',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {/* Report Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}><span className="rupee-prefix">₹</span>CREDIT ASSISTANT</h2>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>FINANCIAL HEALTH AUDIT & DIAGNOSTIC REPORT</div>
                </div>
              </div>

              <div style={{ textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <div><strong>Report Date:</strong> {reportDate}</div>
                <div><strong>Audit Ref:</strong> CA-IN-{Math.floor(100000 + Math.random() * 900000)}</div>
                <div style={{ color: 'var(--success)', fontWeight: 600, marginTop: '0.2rem' }}>Verified Audit Format</div>
              </div>
            </div>

            {/* 1. User Information */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.04em', marginBottom: '1rem' }}>
                1. Consumer Information
              </h3>
              <div style={{ 
                background: 'var(--bg-main)', 
                borderRadius: 'var(--radius-md)', 
                padding: '1.25rem', 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '1rem' 
              }}>
                <div>
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Full Name</span>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user?.name || 'Rahul Sharma'}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Email Address</span>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{user?.email || 'rahul.sharma@example.in'}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Mobile Number</span>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>+91 {user?.mobile || '9876543210'}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Jurisdiction</span>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>India (INR / RBI Rules)</div>
                </div>
              </div>
            </div>

            {/* 2. Executive Health Summary */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.04em', marginBottom: '1rem' }}>
                2. Executive Financial Assessment
              </h3>
              <div style={{ 
                border: '1px solid var(--border-color)', 
                borderRadius: 'var(--radius-md)', 
                padding: '1.5rem', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                gap: '1.5rem',
                backgroundColor: '#ffffff'
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>COMPOSITE HEALTH SCORE</div>
                  <div style={{ fontSize: '2.75rem', fontWeight: 800, color: healthTier.color, lineHeight: 1.1, marginTop: '0.25rem' }}>
                    {healthScore} <span style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>/ 100</span>
                  </div>
                  <span className="badge" style={{ backgroundColor: healthTier.bg, color: healthTier.color, marginTop: '0.5rem' }}>
                    {healthTier.label} Status
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: '260px' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    This consumer shows strong financial stability with a savings rate of <strong>{savingsRate}%</strong> and a Debt-to-Income ratio of <strong>{debtToIncome}%</strong>. The zero missed EMI history provides high credibility for prime unsecured or home loan financing.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Core Metric Breakdown Table */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.04em', marginBottom: '1rem' }}>
                3. Financial Indicators & Indicators Audit
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Metric Name</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Recorded Value</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Standard Benchmark</th>
                      <th style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--text-muted)' }}>Status / Assessment</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Credit Score (CIBIL)</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{financialData.creditScore}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>750+ for Prime rates</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span className="badge badge-success">Good</span>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Credit Card Utilization</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{financialData.creditUtilization}%</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Below 30%</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span className={`badge ${financialData.creditUtilization <= 30 ? 'badge-success' : 'badge-warning'}`}>
                          {financialData.creditUtilization <= 30 ? 'Healthy' : 'High Usage'}
                        </span>
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Monthly Income</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{formatINR(financialData.monthlySalary)}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>Net take-home</td>
                      <td style={{ padding: '0.75rem 1rem' }}><span className="badge badge-info">Stable</span></td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Monthly Living Expenses</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{formatINR(financialData.monthlyExpenses)}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>&lt; 50% of income</td>
                      <td style={{ padding: '0.75rem 1rem' }}><span className="badge badge-success">Controlled</span></td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Monthly Savings & SIP</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{formatINR(financialData.monthlySavings)}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>&gt; 20% savings velocity</td>
                      <td style={{ padding: '0.75rem 1rem' }}><span className="badge badge-success">Optimal</span></td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Savings Rate</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{savingsRate}%</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>20% - 30%</td>
                      <td style={{ padding: '0.75rem 1rem' }}><span className="badge badge-success">Strong</span></td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Debt-to-Income (DTI) Ratio</td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>{debtToIncome}%</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>&lt; 36% maximum</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span className={`badge ${debtToIncome <= 36 ? 'badge-success' : 'badge-danger'}`}>
                          {debtToIncome <= 36 ? 'Safe' : 'Elevated'}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. AI Strategic Recommendations Summary */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.04em', marginBottom: '1rem' }}>
                4. AI Strategic Action Items (Mock Preview)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {mockRecommendationsList.slice(0, 3).map((rec) => (
                  <div key={rec.id} style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <strong style={{ fontSize: '0.95rem' }}>{rec.title}</strong>
                      <span className="badge badge-info">{rec.priority} Priority</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                      {rec.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', fontSize: '0.75rem', color: 'var(--text-light)', textAlign: 'center' }}>
              Generated by CREDIT ASSISTANT | NASSCOM SkillWallet Project. This report is an analytical estimation based on self-reported inputs and standard banking underwriting norms. Not an official credit bureau file.
            </div>
          </div>

          {/* Bottom Action bar */}
          <div style={{ maxWidth: '900px', margin: '1.5rem auto 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/dashboard">
              <Button variant="outline" icon={ArrowLeft}>
                Back to Dashboard
              </Button>
            </Link>

            <Button variant="primary" size="lg" icon={reportLoading ? Loader2 : Download} onClick={handleGeneratePdf} disabled={reportLoading}>
              {reportLoading ? 'Generating…' : 'Generate PDF Report'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
