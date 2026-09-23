import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Menu, X, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './Button';

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const isDashboardView = ['/dashboard', '/profile', '/recommendations', '/report'].includes(location.pathname);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <span><span className="rupee-prefix">₹</span>CREDIT ASSISTANT</span>
          <span className="brand-badge">FinTech</span>
        </Link>

        {!isAuthPage && !isDashboardView && (
          <nav className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#financial-health" className="nav-link">Health Score</a>
            <a href="#ai-advisor" className="nav-link">AI Advisor</a>
          </nav>
        )}

        <div className="nav-actions">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/dashboard">
                <Button variant="primary" size="sm">
                  Open Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-actions-desktop">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setMobileOpen(false)} className="nav-link">Home</Link>
          <a href="#features" onClick={() => setMobileOpen(false)} className="nav-link">Features</a>
          <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="nav-link">How It Works</a>
          {isAuthenticated ? (
            <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
              <Button variant="primary" fullWidth>Go to Dashboard</Button>
            </Link>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" fullWidth>Login</Button>
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}>
                <Button variant="primary" fullWidth>Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
