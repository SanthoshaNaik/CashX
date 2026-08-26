import React, { useState, useEffect, useRef } from 'react';
import { usePortal } from '../context/PortalContext';
import { Laptop, Menu, X, Sun, Moon, LogIn, User, LogOut, Package, Truck, ChevronDown } from 'lucide-react';

export const Header = () => {
  const { currentRoute, navigate, theme, toggleTheme, setCategoryModalOpen, currentUser, logout, COMPANY_INFO } = usePortal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { 
      label: 'Sell', 
      path: '#sell', 
      onClick: () => {
        setCategoryModalOpen(true);
      }
    },
    { label: 'About', path: '/about' },
    { 
      label: 'Services', 
      path: '#services',
      onClick: () => {
        const sec = document.getElementById('services');
        if (sec) {
          sec.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate('/');
          setTimeout(() => {
            document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      }
    },
    { label: 'FAQ', path: '/faq' },
    { 
      label: 'Contact', 
      path: '#footer',
      onClick: () => {
        const footer = document.getElementById('footer');
        if (footer) {
          footer.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate('/');
          setTimeout(() => {
            document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    }
  ];

  const handleNavClick = (link) => {
    if (link.onClick) {
      link.onClick();
    } else {
      navigate(link.path);
    }
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <header style={{ 
      position: 'sticky', 
      top: 0, 
      zIndex: 100, 
      backdropFilter: 'blur(20px)', 
      WebkitBackdropFilter: 'blur(20px)', 
      background: 'var(--header-bg)', 
      borderBottom: '1px solid var(--border-subtle)', 
      transition: 'background-color 0.3s ease' 
    }}>
      {/* Main Navbar */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.25rem' }}>
        
        {/* Brand Logo */}
        <div 
          onClick={() => { navigate('/'); setMobileMenuOpen(false); }} 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.65rem' }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--btn-primary-bg)',
            color: 'var(--btn-primary-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-card)'
          }}>
            <Laptop size={20} />
          </div>
          <div>
            <div style={{ 
              fontFamily: 'var(--font-heading)', 
              fontWeight: 800, 
              fontSize: '1.35rem', 
              letterSpacing: '-0.03em', 
              lineHeight: 1,
              color: 'var(--text-main)'
            }}>
              TheCash<span style={{ color: 'var(--accent-emerald)' }}>X</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }} className="desktop-nav">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.path;
            return (
              <button
                key={link.label}
                onClick={() => handleNavClick(link)}
                style={{
                  fontSize: '0.92rem',
                  fontWeight: isActive ? 700 : 500,
                  color: link.isSell ? 'var(--text-main)' : isActive ? 'var(--text-main)' : 'var(--text-muted)',
                  transition: 'color 0.2s ease',
                  borderBottom: isActive ? '2px solid var(--text-main)' : '2px solid transparent',
                  paddingBottom: '0.2rem',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text-main)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive && !link.isSell) e.currentTarget.style.color = 'var(--text-muted)';
                }}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Header Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--btn-outline-bg)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#3b82f6" />}
          </button>

          {/* User Logged In State: Profile Icon & Popover Dropdown */}
          {currentUser ? (
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                aria-label="User profile and orders"
                title="Account, Orders & Live Tracking"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.75rem 0.35rem 0.4rem',
                  borderRadius: '9999px',
                  background: profileDropdownOpen ? 'var(--btn-primary-bg)' : 'var(--btn-outline-bg)',
                  color: profileDropdownOpen ? 'var(--btn-primary-text)' : 'var(--text-main)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--accent-gold)',
                  color: '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem'
                }}>
                  {currentUser.fullName ? currentUser.fullName[0].toUpperCase() : <User size={15} />}
                </div>
                <span style={{ fontSize: '0.86rem', fontWeight: 700, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="hide-on-mobile-xs">
                  {currentUser.fullName ? currentUser.fullName.split(' ')[0] : 'Profile'}
                </span>
                <ChevronDown size={14} style={{ transform: profileDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
              </button>

              {/* Profile Dropdown Popover */}
              {profileDropdownOpen && (
                <div 
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 0.6rem)',
                    right: 0,
                    width: '270px',
                    background: 'var(--bg-card)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-card-hover)',
                    padding: '0.85rem',
                    zIndex: 200,
                    animation: 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  {/* User Info Header */}
                  <div style={{
                    padding: '0.4rem 0.5rem 0.75rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.25 }}>
                      {currentUser.fullName || 'Valued Customer'}
                    </div>
                    {currentUser.phone && (
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        +91 {currentUser.phone}
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.35rem' }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }}></span>
                      <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 600 }}>Verified Customer</span>
                    </div>
                  </div>

                  {/* Options */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate('/orders');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '10px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-main)',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Package size={16} color="var(--accent-gold)" />
                      <span>My Orders</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        navigate('/orders');
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '10px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-main)',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Truck size={16} color="var(--accent-emerald)" />
                      <span>Live Order Tracking</span>
                    </button>

                    <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0.35rem 0' }}></div>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '10px',
                        background: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                localStorage.setItem('cashx_redirect_after_login', '/');
                handleNavClick({ path: '/login' });
              }}
              className="btn btn-gold"
              style={{
                padding: '0.5rem 1.15rem',
                fontSize: '0.86rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                borderRadius: '10px'
              }}
            >
              <LogIn size={15} /> Login
            </button>
          )}

          {/* Mobile Hamburger Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: 'var(--text-main)', padding: '0.5rem' }}
            className="mobile-hamburger"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
          gap: '0.75rem'
        }}>
          {/* Mobile Theme Toggle Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.6rem 0.85rem',
            background: 'var(--bg-secondary)',
            borderRadius: '10px',
            marginBottom: '0.5rem'
          }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
              Appearance: {theme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}
            </span>
            <button
              onClick={toggleTheme}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                background: 'var(--btn-primary-bg)',
                color: 'var(--btn-primary-text)',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              {theme === 'dark' ? 'Switch Light' : 'Switch Dark'}
            </button>
          </div>

          {/* Mobile User Profile Section */}
          {currentUser && (
            <div style={{
              background: 'var(--bg-secondary)',
              borderRadius: '12px',
              padding: '0.85rem 1rem',
              border: '1px solid var(--border-subtle)',
              marginBottom: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'var(--accent-gold)',
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.95rem'
                }}>
                  {currentUser.fullName ? currentUser.fullName[0].toUpperCase() : <User size={16} />}
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>
                    {currentUser.fullName || 'Customer'}
                  </div>
                  {currentUser.phone && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>+91 {currentUser.phone}</div>
                  )}
                  <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>🟢 Verified User</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleNavClick({ path: '/orders' })}
                  className="btn btn-outline"
                  style={{ flex: 1, padding: '0.45rem', fontSize: '0.8rem', justifyContent: 'center' }}
                >
                  <Package size={14} /> My Orders
                </button>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: '1px solid #ef4444',
                    color: '#ef4444',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link)}
              style={{
                textAlign: 'left',
                fontSize: '1rem',
                fontWeight: currentRoute === link.path ? 700 : 500,
                color: currentRoute === link.path ? 'var(--text-main)' : 'var(--text-main)',
                padding: '0.5rem 0',
                borderBottom: '1px solid var(--border-divider)'
              }}
            >
              {link.label}
            </button>
          ))}

          {/* If Not Logged In, Show Login Button on Mobile Drawer */}
          {!currentUser && (
            <button
              onClick={() => {
                localStorage.setItem('cashx_redirect_after_login', '/');
                handleNavClick({ path: '/login' });
              }}
              className="btn btn-gold"
              style={{ width: '100%', padding: '0.75rem', justifyContent: 'center', marginTop: '0.5rem', borderRadius: '10px' }}
            >
              <LogIn size={16} /> Login
            </button>
          )}
        </div>
      )}
    </header>
  );
};
