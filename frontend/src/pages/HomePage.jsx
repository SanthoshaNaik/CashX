import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  Laptop, ShieldCheck, Zap, Truck, CreditCard, Award, ChevronRight, 
  Phone, MessageSquare, Star, ArrowRight, CheckCircle2, Building2, Recycle, HelpCircle, Calculator, ChevronDown
} from 'lucide-react';
import { BRANDS, SERVICES, REVIEWS, FAQS } from '../data/portalData';

export const HomePage = () => {
  const { navigate, setValuationModalOpen, COMPANY_INFO } = usePortal();
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div>
      {/* HERO SECTION */}
      <section style={{
        position: 'relative',
        padding: '5rem 0 4rem',
        background: '#000000',
        backgroundColor: '#000000',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
            
            {/* Trust Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 700,
              marginBottom: '1.5rem'
            }}>
              <ShieldCheck size={16} /> INDIA'S #1 MOST TRUSTED LAPTOP BUYBACK PLATFORM SINCE {COMPANY_INFO.establishedYear}
            </div>

            <h1 style={{
              fontSize: 'clamp(2.3rem, 5vw, 3.8rem)',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
              letterSpacing: '-0.03em'
            }}>
              Sell Your Used Laptop For <span className="text-gradient-gold">Instant Cash</span> at Your Doorstep
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'var(--text-muted)',
              marginBottom: '2.5rem',
              maxWidth: '700px',
              margin: '0 auto 2.5rem'
            }}>
              Get the highest market quote for your old laptop, Apple MacBook, or Gaming PC. Enjoy free 2-hour doorstep pickup and instant UPI / IMPS payment before we leave.
            </p>

            {/* Action CTAs */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
              <button 
                className="btn btn-gold" 
                onClick={() => setValuationModalOpen(true)}
                style={{ padding: '1rem 2.2rem', fontSize: '1.05rem' }}
              >
                <Calculator size={20} /> Sell Your Laptop Now <ChevronRight size={20} />
              </button>

              <a 
                href={`tel:${COMPANY_INFO.phone.replace(/[^0-9]/g, '')}`} 
                className="btn btn-outline"
                style={{ padding: '1rem 2rem', fontSize: '1.05rem' }}
              >
                <Phone size={18} /> Call Now: {COMPANY_INFO.phone}
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1.5rem',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-card)'
            }}>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>24+ Years</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Industry Experience</div>
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>50,000+</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Happy Customers</div>
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>100% Instant</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Payment Guarantee</div>
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f43f5e' }}>Zero Fee</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Doorstep Pickup</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ color: 'var(--accent-gold)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Why Choose {COMPANY_INFO.name}</span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '0.3rem' }}>Built on Trust, Speed & Best Resale Value</h2>
          </div>

          <div className="grid-3">
            {[
              { title: 'Best Price Guarantee', desc: 'Our automated valuation algorithms calculate top market prices based on exact specs and condition.', icon: Award, color: 'var(--accent-gold)' },
              { title: 'Instant Doorstep Payment', desc: 'No waiting or consignment hassle. Our field agent transfers funds via UPI or Cash directly on physical inspection.', icon: CreditCard, color: 'var(--accent-emerald)' },
              { title: 'Free Doorstep Pickup', desc: 'Schedule a pickup at your home or office at your preferred time slot across Bangalore, Chennai, Hyderabad & major cities.', icon: Truck, color: 'var(--accent-cyan)' },
              { title: '100% Certified Data Security', desc: 'We execute multi-pass DoD 5220.22-M military grade data destruction right in front of you for total privacy.', icon: ShieldCheck, color: 'var(--accent-gold)' },
              { title: 'Doorstep Device Inspection', desc: '5-minute transparent inspection by our trained local field agent using automated hardware diagnostic apps.', icon: Zap, color: 'var(--accent-emerald)' },
              { title: '24+ Years Corporate Trust', desc: 'Over 24 years serving individual customers, IT parks, startups, and enterprise corporate IT disposal.', icon: Building2, color: 'var(--accent-cyan)' }
            ].map((item, idx) => (
              <div key={idx} className="card-dark">
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: item.color,
                  marginBottom: '1.25rem'
                }}>
                  <item.icon size={26} />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR SERVICES */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-pitch)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>What We Buy</span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '0.3rem' }}>Comprehensive Electronics Buyback Services</h2>
          </div>

          <div className="grid-3">
            {SERVICES.map((serv) => (
              <div key={serv.id} className="card-dark" style={{ position: 'relative', overflow: 'hidden' }}>
                <span className="badge badge-gold" style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}>
                  {serv.tag}
                </span>

                <div style={{ color: 'var(--accent-gold)', marginBottom: '1rem' }}>
                  <Laptop size={32} />
                </div>

                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>{serv.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  {serv.fullDesc}
                </p>

                <button 
                  onClick={() => navigate('/services')}
                  style={{ color: 'var(--accent-gold)', fontWeight: 600, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  Read Service Details <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND MARQUEE */}
      <section style={{ padding: '3.5rem 0', background: '#0c0d12', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.4rem', color: 'var(--text-muted)' }}>We Buy All Major Laptop & PC Brands</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
            {BRANDS.map((b) => (
              <div 
                key={b.id} 
                onClick={() => navigate(`/brand/${b.id}`)}
                className="card-dark"
                style={{ textAlign: 'center', padding: '1rem', cursor: 'pointer' }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>{b.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', marginTop: '0.2rem' }}>Sell Quote →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: 'var(--accent-gold)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Easy 4-Step Process</span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '0.3rem' }}>How Selling Your Laptop Works</h2>
          </div>

          <div className="grid-4">
            {[
              { num: '01', title: 'Fill Details', desc: 'Select your brand, model, processor, RAM, and physical condition in our 2-minute form.' },
              { num: '02', title: 'Receive Quote', desc: 'Get an instant transparent price valuation calculated by our live market pricing engine.' },
              { num: '03', title: 'Free Pickup', desc: 'Schedule free doorstep pickup at your home or office in your preferred time slot.' },
              { num: '04', title: 'Instant Cash', desc: 'Agent inspects device in 5 minutes and transfers cash or UPI directly before taking the laptop.' }
            ].map((step, i) => (
              <div key={i} className="card-dark" style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: 'var(--accent-gold)',
                  opacity: 0.25,
                  marginBottom: '0.5rem'
                }}>{step.num}</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{step.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-pitch)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Testimonials</span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '0.3rem' }}>What Our Customers Say</h2>
          </div>

          <div className="grid-3">
            {REVIEWS.map(r => (
              <div key={r.id} className="card-dark">
                <div style={{ display: 'flex', gap: '0.2rem', color: 'var(--accent-gold)', marginBottom: '0.75rem' }}>
                  {[...Array(r.rating)].map((_, idx) => (
                    <Star key={idx} size={16} fill="var(--accent-gold)" />
                  ))}
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', fontStyle: 'italic', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                  "{r.comment}"
                </p>
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{r.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.city} • Sold {r.device}</div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ PREVIEW */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-primary)' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ color: 'var(--accent-gold)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Got Questions?</span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '0.3rem' }}>Frequently Asked Questions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="card-dark" style={{ padding: '1.25rem' }}>
                  <div 
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}
                  >
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{faq.question}</h3>
                    <ChevronDown size={20} color="var(--accent-gold)" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                  </div>
                  {isOpen && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{
        padding: '4rem 0',
        background: '#06070a',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>Ready to Turn Your Old Laptop into Cash?</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.05rem' }}>
            Get an instant price quote in 2 minutes. Free doorstep pickup and instant bank payment guaranteed.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-gold" onClick={() => setValuationModalOpen(true)}>
              <Calculator size={18} /> Get Instant Quote
            </button>
            <a href={`https://wa.me/${COMPANY_INFO.whatsapp.replace(/[^0-9]/g, '')}`} className="btn btn-emerald" target="_blank" rel="noreferrer">
              <MessageSquare size={18} /> WhatsApp Inquiry
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
