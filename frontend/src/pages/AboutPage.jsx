import React from 'react';
import { usePortal } from '../context/PortalContext';
import { ShieldCheck, Award, Building2, Users, CheckCircle2, Phone, Mail, MapPin, Calculator } from 'lucide-react';

export const AboutPage = () => {
  const { navigate, setValuationModalOpen, COMPANY_INFO } = usePortal();

  return (
    <div>
      {/* Hero Banner */}
      <section style={{ padding: '4rem 0 3rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <div className="container">
          <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>SINCE {COMPANY_INFO.establishedYear} • 24+ YEARS LEADERSHIP</span>
          <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>About <span className="text-gradient-gold">{COMPANY_INFO.name}</span></h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem' }}>
            Pioneering transparent, secure, and instant IT asset buyback services for consumers, startups, and enterprise corporations across India.
          </p>
        </div>
      </section>

      {/* Company Intro & History */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-pitch)' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center' }}>
            <div>
              <span style={{ color: 'var(--accent-gold)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Our Legacy</span>
              <h2 style={{ fontSize: '2.2rem', margin: '0.5rem 0 1.25rem' }}>24+ Years of Industry Trust & Excellence</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
                Founded in 2001, {COMPANY_INFO.name} started with a simple vision: to eliminate the friction, security risks, and price low-balling associated with selling pre-owned computers and electronics.
              </p>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                Over the past two decades, we have scaled into one of India’s most trusted IT Asset Disposition (ITAD) companies, servicing over 50,000+ individual customers and corporate clients with free doorstep pickup, instant payment settlement, and military-grade data sanitization.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button className="btn btn-gold" onClick={() => setValuationModalOpen(true)}>
                  <Calculator size={18} /> Get Instant Quote
                </button>
              </div>
            </div>

            <div className="card-dark" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glow)' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', color: 'var(--accent-gold)' }}>Why {COMPANY_INFO.name}?</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { title: '24+ Years Experience', desc: 'Pioneers in second-hand laptop valuation algorithms.' },
                  { title: 'Trusted Buyers', desc: 'Over 50,000+ satisfied individual & corporate customers.' },
                  { title: 'Best Prices Guaranteed', desc: 'Real-time market valuation engine ensures max payout.' },
                  { title: 'Instant Doorstep Payment', desc: 'Direct UPI, IMPS, or Cash transfer before device pickup.' },
                  { title: '100% Certified Data Erasure', desc: 'Multi-pass DoD 5220.22-M data wiping certificate.' }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <CheckCircle2 size={20} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.title}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="grid-2">
            <div className="card-dark" style={{ borderLeft: '4px solid var(--accent-gold)' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', color: 'var(--accent-gold)' }}>Our Mission</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                To provide every computer owner with a transparent, ultra-fast, and secure platform to monetize their old laptop or desktop at top market value while guaranteeing 100% data destruction and zero environmental e-waste harm.
              </p>
            </div>

            <div className="card-dark" style={{ borderLeft: '4px solid var(--accent-emerald)' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', color: 'var(--accent-emerald)' }}>Our Vision</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
                To remain India’s premier IT buyback ecosystem by leveraging technology-driven hardware diagnostic automation, field dispatch networks, and sustainable electronic recycling standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section style={{ padding: '3.5rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', transition: 'background-color 0.3s ease' }}>
        <div className="container">
          <div className="grid-4" style={{ textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-gold)' }}>24+</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Years Experience</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>50,000+</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Satisfied Customers</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>15+</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Supported Brands</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f43f5e' }}>10+</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Metropolitan Cities</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
