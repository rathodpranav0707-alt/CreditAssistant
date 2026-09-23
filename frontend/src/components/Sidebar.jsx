import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  Sparkles,
  FileText,
  LogOut,
  ShieldCheck,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Financial Profile', path: '/profile', icon: UserCheck },
    { name: 'AI Recommendations', path: '/recommendations', icon: Sparkles },
    { name: 'Financial Report', path: '/report', icon: FileText },
  ];

  return (
    <aside className={`sidebar${isOpen ? ' sidebar-open' : ''}`}>
      <div className="sidebar-header">
        <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}><span className="rupee-prefix">₹</span>CREDIT ASSIST</span>
            <div style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.05em' }}>AI HEALTH</div>
          </div>
        </NavLink>
        {onClose && (
          <button
            className="mobile-menu-btn"
            onClick={onClose}
            style={{ padding: '0.2rem', display: 'flex' }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="sidebar-nav">
        <span className="sidebar-section-title">Main Menu</span>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="sidebar-footer">
        {user && (
          <div className="user-snippet">
            <div className="user-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="user-info-name">{user.name || 'Consumer User'}</div>
              <div className="user-info-email">{user.email || 'user@creditassistant.in'}</div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="btn btn-outline btn-full btn-sm"
          style={{ color: 'var(--danger)', borderColor: 'var(--border-color)' }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
