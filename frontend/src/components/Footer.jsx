import React from 'react';
import { usePortal } from '../context/PortalContext';
import { Laptop, Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  const { navigate, COMPANY_INFO } = usePortal();

  return (
    <footer id="footer" style={{ 
      background: 'var(--bg-pitch)', 
      borderTop: '1px solid var(--border-subtle)', 
      paddingTop: '4rem', 
      paddingBottom: '2.5rem', 
      transition: 'background-color 0.3s ease' 
    }}>
      <div className="container" style={{ maxWidth: '1240px' }}>
        <div className="grid-3" style={{ marginBottom: '3.5rem', gap: '3rem' }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'var(--btn-primary-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-card)'
              }}>
                <Laptop size={22} color="#ffffff" />
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.3rem', color: 'var(--text-main)' }}>
                TheCash<span style={{ color: 'var(--accent-emerald)' }}>X</span>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '1.25rem' }}>
              TheCashX is India's leading consumer & enterprise IT buyback platform. Get an instant valuation, free doorstep pickup, and instant cash settlement before we leave.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-emerald)', fontSize: '0.85rem', fontWeight: 600 }}>
              <ShieldCheck size={16} /> 100% Compliant DoD Data Erasure
            </div>
          </div>

          {/* Quick Links (Grid Layout) */}
          <div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '1.2rem', color: 'var(--text-main)', fontWeight: 700 }}>Quick Links</h4>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '0.75rem 1.25rem', 
              fontSize: '0.88rem', 
              color: 'var(--text-muted)' 
            }}>
              {[
                { label: 'Home', path: '/' },
                { label: 'Sell Laptop', path: '/sell-laptop' },
                { label: 'Sell Desktop', path: '/sell-desktop' },
                { label: 'Sell Monitor', path: '/sell-monitor' },
                { label: 'Sell Mac Mini', path: '/sell-macmini' },
                { label: 'About Us', path: '/about' },
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
                { label: 'FAQs', path: '/faq' },
                { label: 'Contact', path: '/contact' }
              ].map((item, idx) => (
                <span 
                  key={idx}
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick();
                    } else {
                      navigate(item.path);
                    }
                  }} 
                  style={{ 
                    cursor: 'pointer', 
                    transition: 'all 0.2s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text-main)';
                    e.currentTarget.style.transform = 'translateX(2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '1.2rem', color: 'var(--text-main)', fontWeight: 700 }}>Corporate Office</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <MapPin size={18} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                <span>{COMPANY_INFO.address}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <Phone size={16} color="var(--accent-emerald)" />
                <a href={`tel:${COMPANY_INFO.phone}`}>{COMPANY_INFO.phone}</a>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <Mail size={16} color="var(--accent-emerald)" />
                <a href={`mailto:${COMPANY_INFO.email}`}>{COMPANY_INFO.email}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.82rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            © {new Date().getFullYear()} TheCashX. All rights reserved.
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <span onClick={() => navigate('/privacy')} style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span onClick={() => navigate('/terms')} style={{ cursor: 'pointer' }}>Terms & Conditions</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
