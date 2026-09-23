import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div>
            <div className="footer-brand">
              <span><span className="rupee-prefix">₹</span>CREDIT ASSISTANT</span>
            </div>
            <p style={{ maxWidth: '340px', fontSize: '0.9rem', lineHeight: '1.6', color: '#94a3b8' }}>
              An AI-powered financial wellness platform dedicated to empowering Indian consumers with clear credit insights, risk analysis, and actionable growth paths.
            </p>
            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span className="badge badge-info" style={{ background: '#1e293b', color: '#38bdf8' }}>
                NASSCOM SkillWallet Initiative
              </span>
            </div>
          </div>

          <div>
            <h4 className="footer-heading">Platform</h4>
            <ul className="footer-links">
              <li><Link to="/dashboard">Financial Dashboard</Link></li>
              <li><Link to="/profile">Credit Profile</Link></li>
              <li><Link to="/recommendations">AI Advisor</Link></li>
              <li><Link to="/report">PDF Health Report</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Resources</h4>
            <ul className="footer-links">
              <li><a href="#financial-health">Understanding CIBIL</a></li>
              <li><a href="#how-it-works">Debt Reduction Strategies</a></li>
              <li><a href="#features">EMI Autopay Guides</a></li>
              <li><a href="#faq">Frequently Asked Questions</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Compliance</h4>
            <ul className="footer-links">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#security">Data Protection & RBI Guidelines</a></li>
              <li><a href="#support">Contact Support</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} CREDIT ASSISTANT.BUILT BY PRANAV RATHOD
          </div>
          <div style={{ color: '#64748b' }}>
            Designed for Indian Consumer Financial Health
          </div>
        </div>
      </div>
    </footer>
  );
};
