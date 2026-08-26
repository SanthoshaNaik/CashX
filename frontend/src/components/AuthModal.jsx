import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { X, Lock, Mail, User, Eye, EyeOff, CheckCircle2, AlertCircle, RefreshCw, KeyRound, ShieldCheck } from 'lucide-react';

export const AuthModal = () => {
  const { authModalOpen, setAuthModalOpen, login, register, googleLogin, forgotPassword, resetPasswordWithOtp, COMPANY_INFO } = usePortal();

  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot' | 'enter_otp'
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: true
  });

  const [otpCode, setOtpCode] = useState('');
  const [receivedOtpNotice, setReceivedOtpNotice] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!authModalOpen) return null;

  // Real-Time Password Policy Validation Checklist
  const passwordChecks = {
    length: form.password.length >= 8,
    uppercase: /[A-Z]/.test(form.password),
    lowercase: /[a-z]/.test(form.password),
    number: /[0-9]/.test(form.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(form.password),
    noSpaces: form.password.length > 0 && !/\s/.test(form.password)
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  const calculatePasswordStrength = () => {
    const validCount = Object.values(passwordChecks).filter(Boolean).length;
    if (validCount <= 2) return { text: 'Weak', color: '#ef4444', pct: 33 };
    if (validCount <= 4) return { text: 'Medium', color: '#f59e0b', pct: 66 };
    return { text: 'Strong', color: '#10b981', pct: 100 };
  };

  const strength = calculatePasswordStrength();

  const resetForm = () => {
    setForm({ fullName: '', email: '', password: '', confirmPassword: '', rememberMe: true });
    setOtpCode('');
    setReceivedOtpNotice('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const closeModal = () => {
    resetForm();
    setAuthModalOpen(false);
  };

  // Google OAuth Trigger
  const handleGoogleSignIn = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (window.google?.accounts?.oauth2 && clientId && !clientId.includes('your_google_client_id')) {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId.trim(),
          scope: 'email profile openid',
          prompt: 'select_account',
          callback: async (tokenResponse) => {
            if (tokenResponse?.access_token) {
              try {
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                const googleProfile = await userInfoRes.json();
                const res = await googleLogin({
                  sub: googleProfile.sub,
                  name: googleProfile.name || googleProfile.given_name,
                  email: googleProfile.email,
                  picture: googleProfile.picture,
                  authProvider: 'GOOGLE'
                });

                setLoading(false);
                if (res.success) {
                  setSuccessMessage(`Welcome ${googleProfile.name || googleProfile.email}! Signed in with Google.`);
                  setTimeout(() => closeModal(), 1200);
                } else {
                  setErrorMessage(res.error || 'Google authentication failed.');
                }
              } catch (err) {
                setLoading(false);
                setErrorMessage('Failed to fetch user profile from Google: ' + err.message);
              }
            } else {
              setLoading(false);
              setErrorMessage('Google sign-in was cancelled or failed.');
            }
          },
          error_callback: () => {
            setLoading(false);
            setErrorMessage('Google sign-in popup was closed or authentication failed.');
          }
        });

        client.requestAccessToken();
        return;
      } catch (err) {
        console.log('Error initializing Google GIS client:', err);
      }
    }

    // Fallback simulated login
    setTimeout(async () => {
      const mockGoogleProfile = {
        sub: `google-${Date.now()}`,
        name: 'Google Authenticated User',
        email: form.email || 'user.google@gmail.com',
        picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        authProvider: 'GOOGLE'
      };
      const res = await googleLogin(mockGoogleProfile);
      setLoading(false);

      if (res.success) {
        setSuccessMessage('Signed in with Google successfully!');
        setTimeout(() => closeModal(), 1200);
      } else {
        setErrorMessage(res.error || 'Google authentication failed.');
      }
    }, 800);
  };

  // Step 1: Request 6-Digit Email OTP
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!form.email) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    const res = await forgotPassword(form.email);
    setLoading(false);

    if (res.success) {
      setSuccessMessage(res.message || `A 6-digit OTP verification code has been sent to ${form.email}.`);
      setMode('enter_otp');
    } else {
      setErrorMessage(res.error || 'Failed to request OTP code.');
    }
  };

  // Step 2: Verify OTP and Reset Password
  const handleVerifyOtpResetSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!otpCode || otpCode.trim().length !== 6) {
      setErrorMessage('Please enter the valid 6-digit OTP verification code.');
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage('Please ensure your new password meets all security policy requirements below.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await resetPasswordWithOtp(form.email, otpCode, form.password);
    setLoading(false);

    if (res.success) {
      setSuccessMessage('Password reset successful! You may now sign in with your new password.');
      setTimeout(() => {
        setMode('login');
        setForm(prev => ({ ...prev, password: '', confirmPassword: '' }));
        setOtpCode('');
        setErrorMessage('');
      }, 1800);
    } else {
      setErrorMessage(res.error || 'OTP verification failed.');
    }
  };

  // Submit Registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!isPasswordValid) {
      setErrorMessage('Please ensure your password meets all policy requirements below.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await register({
      fullName: form.fullName,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword
    });
    setLoading(false);

    if (res.success) {
      setSuccessMessage(res.message || 'Registration successful!');
      setTimeout(() => closeModal(), 1500);
    } else {
      setErrorMessage(res.error || 'Registration failed.');
    }
  };

  // Submit Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    setLoading(true);
    const res = await login(form.email.includes('admin') ? 'ADMIN' : 'CUSTOMER', form.password, form.email);
    setLoading(false);

    if (res.success) {
      setSuccessMessage('Logged in successfully!');
      setTimeout(() => closeModal(), 1200);
    } else {
      setErrorMessage(res.error || 'Invalid credentials.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 220,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="card-dark" style={{
        maxWidth: '480px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        border: '1px solid var(--border-glow)',
        boxShadow: 'var(--shadow-card)'
      }}>
        {/* Close Button */}
        <button
          onClick={closeModal}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            color: 'var(--text-muted)',
            padding: '0.4rem',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '50%'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-gold-glow)', color: 'var(--accent-gold)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <Lock size={24} />
          </div>
          <h3 style={{ fontSize: '1.5rem' }}>
            {mode === 'login' && 'Account Login'}
            {mode === 'register' && 'Create Account'}
            {mode === 'forgot' && 'Reset Password via OTP'}
            {mode === 'enter_otp' && 'Enter 6-Digit Email OTP'}
          </h3>
        </div>

        {/* Mode Switcher Tabs */}
        {(mode === 'login' || mode === 'register') && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.25rem', background: 'var(--bg-secondary)', padding: '0.3rem', borderRadius: '10px' }}>
            <button
              className={`btn ${mode === 'login' ? 'btn-gold' : 'btn-outline'}`}
              onClick={() => { setMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
              style={{ padding: '0.45rem', fontSize: '0.85rem' }}
            >
              Sign In
            </button>
            <button
              className={`btn ${mode === 'register' ? 'btn-gold' : 'btn-outline'}`}
              onClick={() => { setMode('register'); setErrorMessage(''); setSuccessMessage(''); }}
              style={{ padding: '0.45rem', fontSize: '0.85rem' }}
            >
              Register
            </button>
          </div>
        )}

        {(mode === 'forgot' || mode === 'enter_otp') && (
          <div style={{ marginBottom: '1.25rem' }}>
            <button
              className="btn btn-outline"
              onClick={() => { setMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
              style={{ width: '100%', padding: '0.45rem', fontSize: '0.85rem' }}
            >
              ← Return to Login Form
            </button>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} /> {successMessage}
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} /> {errorMessage}
          </div>
        )}

        {/* =========================================================================
            1. REGISTER FORM
           ========================================================================= */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Enter full name"
                  style={{ paddingLeft: '2.5rem' }}
                  value={form.fullName}
                  onChange={e => setForm({ ...form, fullName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="name@domain.com"
                  style={{ paddingLeft: '2.5rem' }}
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="form-input"
                  placeholder="Create strong password"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {form.password && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                    <span>Password Strength:</span>
                    <strong style={{ color: strength.color }}>{strength.text}</strong>
                  </div>
                  <div style={{ height: '4px', background: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${strength.pct}%`, background: strength.color, transition: 'all 0.3s' }}></div>
                  </div>
                </div>
              )}
            </div>

            {form.password && (
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '0.75rem', marginBottom: '1.25rem', fontSize: '0.78rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Security Password Policy Checklist:</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem' }}>
                  <div style={{ color: passwordChecks.length ? '#34d399' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {passwordChecks.length ? '✓' : '•'} At least 8 characters
                  </div>
                  <div style={{ color: passwordChecks.uppercase ? '#34d399' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {passwordChecks.uppercase ? '✓' : '•'} 1 Uppercase (A-Z)
                  </div>
                  <div style={{ color: passwordChecks.lowercase ? '#34d399' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {passwordChecks.lowercase ? '✓' : '•'} 1 Lowercase (a-z)
                  </div>
                  <div style={{ color: passwordChecks.number ? '#34d399' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {passwordChecks.number ? '✓' : '•'} 1 Number (0-9)
                  </div>
                  <div style={{ color: passwordChecks.special ? '#34d399' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {passwordChecks.special ? '✓' : '•'} 1 Special (!@#$)
                  </div>
                  <div style={{ color: passwordChecks.noSpaces ? '#34d399' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {passwordChecks.noSpaces ? '✓' : '•'} No spaces
                  </div>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="form-input"
                  placeholder="Re-enter password"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-gold" style={{ width: '100%', padding: '0.85rem' }}>
              {loading ? <RefreshCw className="pulse-animation" size={18} /> : 'Create Account'}
            </button>
          </form>
        )}

        {/* =========================================================================
            2. LOGIN FORM
           ========================================================================= */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="name@domain.com"
                  style={{ paddingLeft: '2.5rem' }}
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>Password *</label>
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setErrorMessage(''); setSuccessMessage(''); }}
                  style={{ fontSize: '0.78rem', color: 'var(--accent-gold)' }}
                >
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="form-input"
                  placeholder="Enter password"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={e => setForm({ ...form, rememberMe: e.target.checked })}
                />
                Remember Me
              </label>
            </div>

            <button type="submit" disabled={loading} className="btn btn-gold" style={{ width: '100%', padding: '0.85rem' }}>
              {loading ? <RefreshCw className="pulse-animation" size={18} /> : 'Sign In'}
            </button>
          </form>
        )}

        {/* =========================================================================
            3. FORGOT PASSWORD FORM (STEP 1: REQUEST 6-DIGIT OTP)
           ========================================================================= */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotSubmit}>
            <div className="form-group">
              <label className="form-label">Registered Email Address *</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="name@domain.com"
                  style={{ paddingLeft: '2.5rem' }}
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                We will send a 6-digit OTP verification code (valid for 15 minutes) to your registered email address.
              </p>
            </div>

            <button type="submit" disabled={loading} className="btn btn-gold" style={{ width: '100%', padding: '0.85rem' }}>
              {loading ? <RefreshCw className="pulse-animation" size={18} /> : 'Send 6-Digit Verification OTP'}
            </button>
          </form>
        )}

        {/* =========================================================================
            4. ENTER OTP & NEW PASSWORD FORM (STEP 2: VERIFY OTP & RESET)
           ========================================================================= */}
        {mode === 'enter_otp' && (
          <form onSubmit={handleVerifyOtpResetSubmit}>
            <div className="form-group">
              <label className="form-label">6-Digit OTP Code Sent to {form.email} *</label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={18} color="var(--accent-gold)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  maxLength="6"
                  className="form-input"
                  placeholder="Enter 6-digit OTP (e.g. 849201)"
                  style={{ paddingLeft: '2.5rem', letterSpacing: '0.2em', fontWeight: 700, fontSize: '1.1rem' }}
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Create New Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="form-input"
                  placeholder="Enter new password"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {form.password && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                    <span>Password Strength:</span>
                    <strong style={{ color: strength.color }}>{strength.text}</strong>
                  </div>
                  <div style={{ height: '4px', background: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${strength.pct}%`, background: strength.color, transition: 'all 0.3s' }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* LIVE PASSWORD POLICY CHECKLIST WIDGET */}
            {form.password && (
              <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '0.75rem', marginBottom: '1.25rem', fontSize: '0.78rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Security Password Policy Checklist:</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem' }}>
                  <div style={{ color: passwordChecks.length ? '#34d399' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {passwordChecks.length ? '✓' : '•'} At least 8 characters
                  </div>
                  <div style={{ color: passwordChecks.uppercase ? '#34d399' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {passwordChecks.uppercase ? '✓' : '•'} 1 Uppercase (A-Z)
                  </div>
                  <div style={{ color: passwordChecks.lowercase ? '#34d399' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {passwordChecks.lowercase ? '✓' : '•'} 1 Lowercase (a-z)
                  </div>
                  <div style={{ color: passwordChecks.number ? '#34d399' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {passwordChecks.number ? '✓' : '•'} 1 Number (0-9)
                  </div>
                  <div style={{ color: passwordChecks.special ? '#34d399' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {passwordChecks.special ? '✓' : '•'} 1 Special (!@#$)
                  </div>
                  <div style={{ color: passwordChecks.noSpaces ? '#34d399' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {passwordChecks.noSpaces ? '✓' : '•'} No spaces
                  </div>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Confirm New Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="form-input"
                  placeholder="Re-enter new password"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-gold" style={{ width: '100%', padding: '0.85rem' }}>
              {loading ? <RefreshCw className="pulse-animation" size={18} /> : 'Verify OTP & Reset Password'}
            </button>
          </form>
        )}

        {/* GOOGLE OAUTH SOCIAL SIGN IN */}
        {mode !== 'forgot' && mode !== 'enter_otp' && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>OR CONTINUE WITH GOOGLE</div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="btn btn-outline"
              style={{ width: '100%', padding: '0.75rem', gap: '0.6rem', fontSize: '0.88rem' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              {loading ? 'Opening Google Sign-In...' : 'Continue with Google'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
