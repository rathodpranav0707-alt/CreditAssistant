import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Calculate password strength
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, text: '' };
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, text: 'Weak', class: 'active-weak' };
    if (score <= 3) return { score: 2, text: 'Medium', class: 'active-medium' };
    return { score: 3, text: 'Strong', class: 'active-strong' };
  };

  const strength = getPasswordStrength(formData.password);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Enter a valid email address';
    }

    if (!formData.mobile.trim()) {
      errs.mobile = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      errs.mobile = 'Enter a valid 10-digit Indian mobile number';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
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

    const result = await register({
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      password: formData.password,
    });

    setLoading(false);

    if (result.success) {
      navigate('/profile');
    } else {
      setServerError(result.error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1.5rem', backgroundColor: 'var(--bg-main)' }}>
        <div style={{ maxWidth: '480px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Create Your Account
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', marginTop: '0.35rem' }}>
              Start tracking your financial health and credit standing today
            </p>
          </div>

          <Card style={{ padding: '2rem' }}>
            <form onSubmit={handleSubmit}>
              <Input
                label="Full Name"
                placeholder="e.g. Rahul Sharma"
                icon={User}
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={errors.name}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="rahul.sharma@example.in"
                icon={Mail}
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={errors.email}
              />

              <Input
                label="Mobile Number"
                type="tel"
                placeholder="10-digit Indian Mobile (e.g. 9876543210)"
                icon={Phone}
                value={formData.mobile}
                onChange={(e) => handleChange('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                error={errors.mobile}
                hint="For OTP alerts and report delivery"
              />

              <div style={{ marginBottom: '1.25rem' }}>
                <Input
                  label="Password"
                  isPassword
                  placeholder="Create a strong password"
                  icon={Lock}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  error={errors.password}
                />
                {formData.password && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>Password Strength:</span>
                      <strong style={{
                        color: strength.score === 1 ? 'var(--danger)' : strength.score === 2 ? 'var(--warning)' : 'var(--success)'
                      }}>
                        {strength.text}
                      </strong>
                    </div>
                    <div className="strength-bars">
                      <div className={`strength-bar ${strength.score >= 1 ? strength.class : ''}`} />
                      <div className={`strength-bar ${strength.score >= 2 ? strength.class : ''}`} />
                      <div className={`strength-bar ${strength.score >= 3 ? strength.class : ''}`} />
                    </div>
                  </div>
                )}
              </div>

              <Input
                label="Confirm Password"
                isPassword
                placeholder="Re-enter your password"
                icon={Lock}
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                error={errors.confirmPassword}
              />

              {serverError && (
                <div style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fca5a5',
                  borderRadius: 'var(--radius-md)',
                  color: '#dc2626',
                  fontSize: '0.875rem',
                  marginBottom: '1rem'
                }}>
                  {serverError}
                </div>
              )}

              <div style={{ marginTop: '1.5rem' }}>
                <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
                  Complete Registration
                </Button>
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  Log in here
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
