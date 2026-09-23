import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldCheck } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError('');

    const result = await login(formData.email, formData.password);

    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setServerError(result.error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1.5rem', backgroundColor: 'var(--bg-main)' }}>
        <div style={{ maxWidth: '440px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Welcome Back
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginTop: '0.35rem' }}>
              Access your financial health diagnostics and AI advice
            </p>
          </div>

          <Card style={{ padding: '2rem' }}>
            <form onSubmit={handleSubmit}>
              <Input
                label="Email Address"
                type="email"
                placeholder="e.g. rahul.sharma@example.in"
                icon={Mail}
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={errors.email}
              />

              <Input
                label="Password"
                isPassword
                placeholder="Enter your password"
                icon={Lock}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                error={errors.password}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <input type="checkbox" defaultChecked />
                  <span>Remember me</span>
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Demo environment: Please enter any email and password with 6+ chars to login.'); }} style={{ color: 'var(--primary)', fontWeight: 500 }}>
                  Forgot password?
                </a>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {serverError && (
                  <div style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#fee2e2',
                    border: '1px solid #fca5a5',
                    borderRadius: 'var(--radius-md)',
                    color: '#dc2626',
                    fontSize: '0.875rem',
                  }}>
                    {serverError}
                  </div>
                )}
                <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
                  Sign In to Dashboard
                </Button>
                
                <Link to="/register" style={{ width: '100%' }}>
                  <Button type="button" variant="outline" fullWidth size="lg">
                    Create New Account
                  </Button>
                </Link>
              </div>

              <div style={{ marginTop: '1.5rem', padding: '0.75rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                Use the email and password you registered with. New user? <strong>Create an account first.</strong>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
