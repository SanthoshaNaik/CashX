import React from 'react';
import { usePortal } from '../context/PortalContext';
import { Laptop, Phone, Mail, MapPin, ShieldCheck, Heart, Lock } from 'lucide-react';
import { CITIES, BRANDS } from '../data/portalData';

export const Footer = () => {
  const { navigate, COMPANY_INFO } = usePortal();

  return (
    <footer style={{ background: '#07080a', borderTop: '1px solid var(--border-subtle)', paddingTop: '4rem', paddingBottom: '2rem' }}>
      <div className="container">
        <div className="grid-4" style={{ marginBottom: '3rem' }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2a3142 0%, #1e2330 100%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Laptop size={22} color="#ffffff" />
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem' }}>
                {COMPANY_INFO.name.split(' ')[0]} <span className="text-gradient-gold">{COMPANY_INFO.name.split(' ').slice(1).join(' ') || 'BUYBACK'}</span>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              {COMPANY_INFO.name} is India's leading corporate and consumer IT asset buyback platform. We offer instant valuation, doorstep pickup, instant payment, and 100% certified data wiping.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-gold)', fontSize: '0.82rem', fontWeight: 600 }}>
              <ShieldCheck size={16} /> 100% Compliant DoD Data Erasure
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '1.2rem', color: '#fff' }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <span onClick={() => navigate('/')} style={{ cursor: 'pointer', transition: 'color 0.2s' }}>Home Page</span>
              <span onClick={() => navigate('/about')} style={{ cursor: 'pointer', transition: 'color 0.2s' }}>About Our Company</span>
              <span onClick={() => navigate('/sell-laptop')} style={{ cursor: 'pointer', transition: 'color 0.2s' }}>Sell Used Laptop</span>
              <span onClick={() => navigate('/sell-macbook')} style={{ cursor: 'pointer', transition: 'color 0.2s' }}>Sell Apple MacBook</span>
              <span onClick={() => navigate('/sell-desktop')} style={{ cursor: 'pointer', transition: 'color 0.2s' }}>Sell Desktop PC</span>
              <span onClick={() => navigate('/services')} style={{ cursor: 'pointer', transition: 'color 0.2s' }}>Our Services</span>
              <span onClick={() => navigate('/faq')} style={{ cursor: 'pointer', transition: 'color 0.2s' }}>Frequently Asked Questions</span>
              <span onClick={() => navigate('/blog')} style={{ cursor: 'pointer', transition: 'color 0.2s' }}>Blog & Value Guide</span>
            </div>
          </div>

          {/* Sell by City */}
          <div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '1.2rem', color: '#fff' }}>City Hubs</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {CITIES.map(c => (
                <span key={c.id} onClick={() => navigate(`/city/${c.id}`)} style={{ cursor: 'pointer' }}>
                  Sell Laptop in {c.name}
                </span>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '1.2rem', color: '#fff' }}>Corporate Office</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <MapPin size={18} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
                <span>{COMPANY_INFO.address}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <Phone size={16} color="var(--accent-gold)" />
                <a href={`tel:${COMPANY_INFO.phone}`}>{COMPANY_INFO.phone}</a>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <Mail size={16} color="var(--accent-gold)" />
                <a href={`mailto:${COMPANY_INFO.email}`}>{COMPANY_INFO.email}</a>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <button 
                onClick={() => navigate('/admin')}
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-dim)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.8rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px'
                }}
              >
                <Lock size={12} /> Staff Portal Login
              </button>
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
            © {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.
          </div>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span onClick={() => navigate('/privacy')} style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span onClick={() => navigate('/terms')} style={{ cursor: 'pointer' }}>Terms & Conditions</span>
            <span onClick={() => navigate('/sitemap')} style={{ cursor: 'pointer' }}>Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
