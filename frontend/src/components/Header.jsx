import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Laptop, Phone, MessageSquare, Menu, X, ShieldCheck, UserCheck, Calculator, LogIn, User } from 'lucide-react';

export const Header = () => {
  const { currentRoute, navigate, setValuationModalOpen, setAuthModalOpen, currentUser, logout, COMPANY_INFO } = usePortal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Sell Laptop', path: '/sell-laptop' },
    { label: 'Sell MacBook', path: '/sell-macbook' },
    { label: 'Sell Desktop', path: '/sell-desktop' },
    { label: 'Services', path: '/services' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact', path: '/contact' },
    { label: 'Blog', path: '/blog' }
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(20px)', background: 'rgba(8, 8, 10, 0.85)', borderBottom: '1px solid var(--border-subtle)' }}>
      {/* Top Notification Contact Bar */}
      <div style={{ background: '#0e1017', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.8rem', padding: '0.4rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <ShieldCheck size={14} color="var(--accent-gold)" /> {COMPANY_INFO.yearsExperience} Trusted IT Buyback
            </span>
            <span style={{ display: 'none', mdDisplay: 'inline' }}>
              • Free Doorstep Pickup & Instant Payment
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a href={`tel:${COMPANY_INFO.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
              <Phone size={13} /> {COMPANY_INFO.phone}
            </a>
            <a href={`https://wa.me/${COMPANY_INFO.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#25D366', fontWeight: 600 }}>
              <MessageSquare size={13} /> WhatsApp
            </a>
            
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                {(currentUser.role === 'ADMIN' || currentUser.role === 'FIELD_AGENT') ? (
                  <button 
                    onClick={() => handleNavClick('/admin')} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#34d399',
                      padding: '0.2rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      border: '1px solid rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    <UserCheck size={12} /> Staff Portal ({currentUser.role})
                  </button>
                ) : (
                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#ffffff',
                      padding: '0.2rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      border: '1px solid rgba(255, 255, 255, 0.15)'
                    }}
                  >
                    <User size={12} /> {currentUser.fullName || currentUser.email}
                  </div>
                )}
                <button
                  onClick={logout}
                  style={{ fontSize: '0.75rem', color: '#f87171', textDecoration: 'underline' }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setAuthModalOpen(true)} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: 'var(--accent-gold-glow)',
                  color: 'var(--accent-gold)',
                  padding: '0.2rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  border: '1px solid var(--border-glow)'
                }}
              >
                <LogIn size={13} /> Login / Register
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.5rem' }}>
        {/* Brand Logo */}
        <div onClick={() => handleNavClick('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2a3142 0%, #1e2330 100%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow-gold)'
          }}>
            <Laptop size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {COMPANY_INFO.name.split(' ')[0]} <span className="text-gradient-gold">{COMPANY_INFO.name.split(' ').slice(1).join(' ') || 'BUYBACK'}</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                style={{
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--accent-gold)' : 'var(--text-main)',
                  transition: 'color 0.2s ease',
                  borderBottom: isActive ? '2px solid var(--accent-gold)' : '2px solid transparent',
                  paddingBottom: '0.2rem'
                }}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* CTA Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            className="btn btn-gold"
            onClick={() => setValuationModalOpen(true)}
            style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
          >
            <Calculator size={16} /> Get Instant Quote
          </button>

          {/* Mobile Hamburger Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: 'var(--text-main)', padding: '0.5rem' }}
            className="mobile-hamburger"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          background: 'var(--bg-primary)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavClick(link.path)}
              style={{
                textAlign: 'left',
                fontSize: '1rem',
                fontWeight: currentRoute === link.path ? 700 : 500,
                color: currentRoute === link.path ? 'var(--accent-gold)' : 'var(--text-main)',
                padding: '0.5rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              {link.label}
            </button>
          ))}
          
          {currentUser ? (
            <button
              onClick={() => handleNavClick('/admin')}
              style={{
                textAlign: 'left',
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--accent-emerald)',
                padding: '0.5rem 0'
              }}
            >
              🔑 Portal Dashboard ({currentUser.fullName || currentUser.role})
            </button>
          ) : (
            <button
              onClick={() => { setAuthModalOpen(true); setMobileMenuOpen(false); }}
              style={{
                textAlign: 'left',
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--accent-gold)',
                padding: '0.5rem 0'
              }}
            >
              🔐 Login / Create Account
            </button>
          )}
        </div>
      )}
    </header>
  );
};
