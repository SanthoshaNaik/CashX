import React, { useState } from 'react';
import { useAdmin } from '../AdminContext';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, KeyRound, ArrowRight, Laptop, Sparkles, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { DEFAULT_ADMIN_CREDENTIALS } from '../data/adminInitialData';

export const AdminLoginPage = () => {
  const { login, forgotPassword } = useAdmin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Forgot Password Modal State
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotStep, setForgotStep] = useState(1); // 1: Enter email, 2: Set new password, 3: Success
  const [forgotError, setForgotError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMsg(res.error || 'Invalid credentials.');
      }
    }, 400);
  };

  const handleFillDemo = () => {
    setEmail(DEFAULT_ADMIN_CREDENTIALS.email);
    setPassword(DEFAULT_ADMIN_CREDENTIALS.password);
    setErrorMsg('');
  };

  const handleFillAgentDemo = () => {
    setEmail('suresh.gowda@thecashx.com');
    setPassword('agent123');
    setErrorMsg('');
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotError('');

    if (forgotStep === 1) {
      if (!forgotEmail.trim()) {
        setForgotError('Please enter your admin email address.');
        return;
      }
      setForgotStep(2);
    } else if (forgotStep === 2) {
      if (newPassword.length < 6) {
        setForgotError('Password must be at least 6 characters.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setForgotError('Passwords do not match.');
        return;
      }

      forgotPassword(forgotEmail, newPassword);
      setForgotStep(3);
    }
  };

  const closeForgotModal = () => {
    setForgotModalOpen(false);
    setForgotStep(1);
    setForgotEmail('');
    setNewPassword('');
    setConfirmPassword('');
    setForgotError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8fafc',
      padding: '1.5rem',
      fontFamily: 'inherit'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '24px',
        padding: '2.5rem 2rem',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 1px 1px rgba(0, 0, 0, 0.04)',
        position: 'relative'
      }}>
        {/* Admin Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: '#0f172a',
            color: '#ffffff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            boxShadow: '0 8px 20px rgba(15, 23, 42, 0.18)'
          }}>
            <Laptop size={28} />
          </div>

          <div>
            <span style={{
              display: 'inline-flex',
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              background: '#f1f5f9',
              color: '#334155',
              border: '1px solid #e2e8f0',
              marginBottom: '0.5rem'
            }}>
              INTERNAL OPERATIONS
            </span>
          </div>

          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
            TheCashX Admin Portal
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Manage buyback orders, field inspection agents & payouts
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#dc2626',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            fontSize: '0.86rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit}>
          {/* Email Field */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' }}>
              Email Address *
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="email"
                required
                className="form-input"
                placeholder="admin@thecashx.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  paddingLeft: '2.75rem',
                  width: '100%',
                  boxSizing: 'border-box',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a'
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                Password *
              </label>
              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Forgot Password?
              </button>
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="form-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  paddingLeft: '2.75rem',
                  paddingRight: '2.75rem',
                  width: '100%',
                  boxSizing: 'border-box',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox (Compact) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.4rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', color: '#475569', fontSize: '0.78rem', userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  width: '13px',
                  height: '13px',
                  margin: 0,
                  cursor: 'pointer',
                  accentColor: '#0f172a'
                }}
              />
              Stay logged in on this device
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.9rem',
              fontSize: '0.95rem',
              fontWeight: 700,
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
              transition: 'background 0.2s ease'
            }}
          >
            {isLoading ? 'Authenticating...' : 'Sign In to Admin Dashboard'} <ArrowRight size={18} />
          </button>
        </form>

        {/* Quick Demo Credentials Fill Buttons */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '0.65rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Quick Demo Logins
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handleFillDemo}
              style={{
                padding: '0.6rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                background: '#f8fafc',
                color: '#0f172a',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem'
              }}
            >
              <KeyRound size={14} /> Super Admin
            </button>

            <button
              type="button"
              onClick={handleFillAgentDemo}
              style={{
                padding: '0.6rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                background: '#f0fdf4',
                color: '#15803d',
                border: '1px solid #bbf7d0',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem'
              }}
            >
              <ShieldCheck size={14} /> Field Agent
            </button>
          </div>

          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.65rem', textAlign: 'center', lineHeight: 1.4 }}>
            Admin: <code>admin@thecashx.com</code> (admin123)<br />
            Agent: <code>suresh.gowda@thecashx.com</code> (agent123)
          </div>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {forgotModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 300,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            padding: '2rem',
            width: '100%',
            maxWidth: '440px',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <button
              onClick={closeForgotModal}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: '#f1f5f9',
                border: 'none',
                color: '#64748b',
                borderRadius: '50%',
                padding: '0.4rem',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: '#f1f5f9',
                color: '#0f172a',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.75rem'
              }}>
                <KeyRound size={24} />
              </div>
              <h3 style={{ fontSize: '1.35rem', color: '#0f172a', marginBottom: '0.35rem' }}>
                Reset Admin Password
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                {forgotStep === 1 && 'Enter your registered administrator email address'}
                {forgotStep === 2 && 'Choose and confirm your new secure password'}
                {forgotStep === 3 && 'Password successfully updated!'}
              </p>
            </div>

            {forgotError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                color: '#dc2626',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                fontSize: '0.84rem',
                marginBottom: '1rem'
              }}>
                {forgotError}
              </div>
            )}

            {forgotStep === 1 && (
              <form onSubmit={handleForgotSubmit}>
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" style={{ fontSize: '0.85rem', color: '#1e293b' }}>Admin Email Address</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder="admin@thecashx.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a' }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  Continue <ArrowRight size={16} />
                </button>
              </form>
            )}

            {forgotStep === 2 && (
              <form onSubmit={handleForgotSubmit}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label" style={{ fontSize: '0.85rem', color: '#1e293b' }}>New Password (min 6 chars)</label>
                  <input
                    type="password"
                    required
                    className="form-input"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" style={{ fontSize: '0.85rem', color: '#1e293b' }}>Confirm New Password</label>
                  <input
                    type="password"
                    required
                    className="form-input"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a' }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  Update Password
                </button>
              </form>
            )}

            {forgotStep === 3 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <CheckCircle2 size={30} />
                </div>
                <p style={{ fontSize: '0.9rem', color: '#0f172a', marginBottom: '1.25rem' }}>
                  Your password has been reset. You can now login with your new credentials.
                </p>
                <button
                  type="button"
                  onClick={closeForgotModal}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Return to Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
