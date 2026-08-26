import React, { useState, useEffect, useRef } from 'react';
import { usePortal } from '../context/PortalContext';
import { Smartphone, ArrowRight, ShieldCheck, CheckCircle2, Edit2, RotateCw, Lock, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const { navigate, currentUser, loginWithPhone, setCurrentUser, login, setCategoryModalOpen, setValuationModalOpen } = usePortal();

  const [step, setStep] = useState(1); // 1: Enter Mobile, 2: Enter OTP, 3: Success
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [redirectDestination, setRedirectDestination] = useState(() => {
    return localStorage.getItem('cashx_redirect_after_login') || '/';
  });

  const otpInputsRef = useRef([]);

  // Close any lingering modal & scroll to top on mount
  useEffect(() => {
    if (setCategoryModalOpen) setCategoryModalOpen(false);
    if (setValuationModalOpen) setValuationModalOpen(false);
    const dest = localStorage.getItem('cashx_redirect_after_login') || '/';
    setRedirectDestination(dest);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [setCategoryModalOpen, setValuationModalOpen]);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (currentUser && step === 1) {
      const target = localStorage.getItem('cashx_redirect_after_login') || '/';
      localStorage.removeItem('cashx_redirect_after_login');
      navigate(target);
    }
  }, [currentUser, step, navigate]);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let interval = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timer]);

  // Handle phone number input
  const handlePhoneChange = (e) => {
    const clean = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(clean);
    if (error) setError('');
  };

  // Step 1: Send OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate OTP dispatch
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      setTimer(30);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      // Focus first OTP field after render
      setTimeout(() => {
        if (otpInputsRef.current[0]) {
          otpInputsRef.current[0].focus();
        }
      }, 100);
    }, 700);
  };

  // Handle OTP digit changes
  const handleOtpChange = (index, value) => {
    const cleanVal = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = cleanVal;
    setOtp(newOtp);
    if (error) setError('');

    // Auto-focus next input
    if (cleanVal && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  // Handle keydown in OTP inputs (Backspace support)
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Handle paste in OTP input
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasteData.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasteData[i] || '';
      }
      setOtp(newOtp);
      const focusIndex = Math.min(pasteData.length, 5);
      otpInputsRef.current[focusIndex]?.focus();
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');

    if (enteredOtp.length < 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate OTP verification (Demo mode: any 6-digit or 123456)
    setTimeout(() => {
      setLoading(false);
      setStep(3);

      // Trigger user session login
      if (loginWithPhone) {
        loginWithPhone(phoneNumber, fullName);
      }

      const targetRoute = localStorage.getItem('cashx_redirect_after_login') || redirectDestination || '/';
      localStorage.removeItem('cashx_redirect_after_login');

      // Directly redirect to destination
      setTimeout(() => {
        navigate(targetRoute);
      }, 1400);
    }, 700);
  };

  // Resend OTP handler
  const handleResendOtp = () => {
    if (!canResend) return;
    setCanResend(false);
    setTimer(30);
    setOtp(['', '', '', '', '', '']);
    setError('');
    // Focus first input
    if (otpInputsRef.current[0]) otpInputsRef.current[0].focus();
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3.5rem 1rem',
      background: 'var(--bg-primary)',
      transition: 'background-color 0.3s ease'
    }}>
      <div style={{
        maxWidth: '460px',
        width: '100%',
        margin: '0 auto'
      }}>
        <div 
          className="card-dark"
          style={{
            background: 'var(--bg-card)',
            borderRadius: '24px',
            border: '1px solid var(--border-subtle)',
            padding: '2.5rem 2rem',
            boxShadow: 'var(--shadow-card)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Header Brand */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'var(--btn-primary-bg)',
              color: 'var(--btn-primary-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: 'var(--shadow-card)'
            }}>
              <Smartphone size={24} />
            </div>

            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.65rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--text-main)',
              marginBottom: '0.35rem'
            }}>
              {step === 1 && 'Login'}
              {step === 2 && 'Verify Mobile Number'}
              {step === 3 && 'Verification Complete'}
            </h1>

            <p style={{
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
              lineHeight: 1.5,
              maxWidth: '340px',
              margin: '0 auto'
            }}>
              {step === 1 && 'Enter your full name and 10-digit mobile number to log in.'}
              {step === 2 && (
                <span>
                  Enter the 6-digit OTP sent to <strong style={{ color: 'var(--text-main)' }}>+91 {phoneNumber}</strong>
                </span>
              )}
              {step === 3 && 'You have successfully signed in to TheCashX.'}
            </p>
          </div>

          {/* STEP 1: NAME & MOBILE NUMBER INPUT */}
          {step === 1 && (
            <form onSubmit={handleSendOtp}>
              {/* Full Name Field */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label 
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--text-main)',
                    marginBottom: '0.5rem'
                  }}
                >
                  Your Full Name *
                </label>

                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Enter your full name (e.g. Rahul Sharma)"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (error) setError('');
                  }}
                  style={{
                    width: '100%',
                    background: 'var(--bg-input)',
                    border: error && !fullName ? '1.5px solid #ef4444' : '1px solid var(--border-input)',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: 'var(--text-main)',
                    outline: 'none',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)'
                  }}
                />
              </div>

              {/* Mobile Number Field */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label 
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--text-main)',
                    marginBottom: '0.5rem'
                  }}
                >
                  Mobile Number *
                </label>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--bg-input)',
                  border: error && phoneNumber.length !== 10 ? '1.5px solid #ef4444' : '1px solid var(--border-input)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s ease',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)'
                }}>
                  {/* Country Flag & Code */}
                  <div style={{
                    padding: '0.85rem 0.9rem',
                    background: 'var(--bg-secondary)',
                    borderRight: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    userSelect: 'none'
                  }}>
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>

                  {/* Phone Input */}
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoFocus
                    required
                    placeholder="Enter 10-digit mobile number"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    style={{
                      flex: 1,
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      padding: '0.85rem 1rem',
                      fontSize: '1rem',
                      fontWeight: 600,
                      letterSpacing: '0.02em',
                      color: 'var(--text-main)'
                    }}
                  />
                </div>

                {error && (
                  <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.4rem', fontWeight: 500 }}>
                    {error}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || phoneNumber.length !== 10}
                className="btn btn-gold"
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  opacity: phoneNumber.length === 10 ? 1 : 0.6,
                  cursor: phoneNumber.length === 10 ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {loading ? (
                  <>
                    <RotateCw size={18} className="animate-spin" /> Sending OTP...
                  </>
                ) : (
                  <>
                    Send OTP <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                marginTop: '1.75rem',
                fontSize: '0.78rem',
                color: 'var(--text-muted)'
              }}>
                <ShieldCheck size={15} color="var(--accent-emerald)" />
                <span>100% Secure & Fast verification</span>
              </div>
            </form>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp}>
              {/* Phone Edit Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.85rem',
                background: 'var(--bg-secondary)',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '1.5rem'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {fullName} (+91 {phoneNumber})
                </div>
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(''); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--accent-emerald)',
                    cursor: 'pointer',
                    background: 'transparent',
                    border: 'none'
                  }}
                >
                  <Edit2 size={12} /> Edit
                </button>
              </div>

              {/* 6-Digit OTP Boxes */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label 
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--text-main)',
                    marginBottom: '0.65rem',
                    textAlign: 'center'
                  }}
                >
                  Enter 6-Digit Verification Code
                </label>

                <div 
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    justifyContent: 'center'
                  }}
                  onPaste={handleOtpPaste}
                >
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputsRef.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      style={{
                        width: '46px',
                        height: '52px',
                        textAlign: 'center',
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        fontFamily: 'monospace',
                        color: 'var(--text-main)',
                        background: 'var(--bg-input)',
                        border: error 
                          ? '1.5px solid #ef4444' 
                          : digit 
                            ? '1.5px solid var(--text-main)' 
                            : '1px solid var(--border-input)',
                        borderRadius: '10px',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)'
                      }}
                    />
                  ))}
                </div>

                {error && (
                  <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.6rem', textAlign: 'center', fontWeight: 500 }}>
                    {error}
                  </div>
                )}
              </div>

              {/* Verify OTP Button */}
              <button
                type="submit"
                disabled={loading || otp.join('').length < 6}
                className="btn btn-gold"
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  opacity: otp.join('').length === 6 ? 1 : 0.6,
                  cursor: otp.join('').length === 6 ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {loading ? (
                  <>
                    <RotateCw size={18} className="animate-spin" /> Verifying Code...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} /> Verify & Log In
                  </>
                )}
              </button>

              {/* Resend Timer & Button */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '1.5rem',
                fontSize: '0.82rem',
                color: 'var(--text-muted)'
              }}>
                <span>Didn't get the code?</span>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--accent-emerald)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Resend OTP
                  </button>
                ) : (
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                    Resend in {timer}s
                  </span>
                )}
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS STATE */}
          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                animation: 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}>
                <CheckCircle2 size={36} />
              </div>

              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.35rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: '0.5rem'
              }}>
                Welcome to TheCashX!
              </h3>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                {redirectDestination === '/' ? 'Redirecting to homepage...' : 'Redirecting to device valuation page...'}
              </p>

              <button
                onClick={() => {
                  const target = localStorage.getItem('cashx_redirect_after_login') || redirectDestination || '/';
                  localStorage.removeItem('cashx_redirect_after_login');
                  navigate(target);
                }}
                className="btn btn-gold"
                style={{ width: '100%', padding: '0.8rem', fontSize: '0.9rem', justifyContent: 'center' }}
              >
                {redirectDestination === '/' ? 'Go to Homepage' : 'Proceed to Valuation'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
