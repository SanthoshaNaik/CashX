import React from 'react';
import { usePortal } from '../context/PortalContext';
import { CITIES, BRANDS, SERVICES } from '../data/portalData';
import { Globe, MapPin, Laptop, ShieldCheck } from 'lucide-react';

export const SitemapPage = () => {
  const { navigate, COMPANY_INFO } = usePortal();

  return (
    <div style={{ padding: '4rem 0', background: 'var(--bg-pitch)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>SEO SITEMAP DIRECTORY</span>
          <h1 style={{ fontSize: '2.5rem' }}>HTML <span className="text-gradient-gold">Sitemap</span></h1>
          <p style={{ color: 'var(--text-muted)' }}>Complete index of all website pages for {COMPANY_INFO.name}.</p>
        </div>

        <div className="grid-3">
          {/* Main Pages */}
          <div className="card-dark">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent-gold)' }}>Main Pages</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {[
                { label: 'Home Page', path: '/' },
                { label: 'About Company', path: '/about' },
                { label: 'Sell Laptop', path: '/sell-laptop' },
                { label: 'Sell Desktop', path: '/sell-desktop' },
                { label: 'Sell Monitor', path: '/sell-monitor' },
                { label: 'Sell MacMini', path: '/sell-macmini' },
                { label: 'Services Overview', path: '/services' },
                { label: 'Frequently Asked Questions', path: '/faq' },
                { label: 'Contact Us', path: '/contact' },
                { label: 'Blog & Value Guide', path: '/blog' }
              ].map(p => (
                <span key={p.path} onClick={() => navigate(p.path)} style={{ cursor: 'pointer', color: 'var(--text-main)' }}>
                  → {p.label} (`{p.path}`)
                </span>
              ))}
            </div>
          </div>

          {/* City Landing Pages */}
          <div className="card-dark">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent-cyan)' }}>City Landing Pages</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {CITIES.map(c => (
                <span key={c.id} onClick={() => navigate(`/city/${c.id}`)} style={{ cursor: 'pointer', color: 'var(--text-main)' }}>
                  → Sell Laptop in {c.name} (`/city/{c.id}`)
                </span>
              ))}
            </div>
          </div>

          {/* Brand Landing Pages */}
          <div className="card-dark">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent-emerald)' }}>Brand Pages</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {BRANDS.map(b => (
                <span key={b.id} onClick={() => navigate(`/brand/${b.id}`)} style={{ cursor: 'pointer', color: 'var(--text-main)' }}>
                  → Sell {b.name} (`/brand/{b.id}`)
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
