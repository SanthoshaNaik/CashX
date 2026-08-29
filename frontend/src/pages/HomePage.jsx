import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  Laptop, ShieldCheck, Zap, Truck, CreditCard, Award, ChevronRight, 
  Phone, MessageSquare, Star, ArrowRight, CheckCircle2, Building2, Recycle, HelpCircle, Calculator, ChevronDown, Sparkles, FileText, Banknote
} from 'lucide-react';
import { BRANDS, REVIEWS, FAQS, CATEGORIES } from '../data/portalData';
import { CategoryCards } from '../components/CategoryCards';
import { CategorySlider } from '../components/CategorySlider';

export const HomePage = () => {
  const { navigate, setValuationModalOpen, setCategoryModalOpen, COMPANY_INFO } = usePortal();
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div>
      {/* HERO SECTION */}
      <section style={{
        position: 'relative',
        padding: '5rem 0 4rem',
        background: 'var(--bg-primary)',
        overflow: 'hidden',
        transition: 'background-color 0.3s ease'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>

            <h1 style={{
              fontSize: 'clamp(2.3rem, 5vw, 3.8rem)',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
              letterSpacing: '-0.03em',
              color: 'var(--text-main)'
            }}>
              Sell Your Used Device For <span className="text-gradient-gold">Instant Cash</span> at Your Doorstep
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'var(--text-muted)',
              marginBottom: '2.5rem',
              maxWidth: '700px',
              margin: '0 auto 2.5rem'
            }}>
              Get the highest market quote for your old Laptop, Desktop PC, Gaming Monitor, or Apple Mac Mini. Enjoy free 2-hour doorstep pickup and instant UPI / IMPS payment before we leave.
            </p>

            {/* Action CTAs */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
              <button 
                className="btn btn-gold" 
                onClick={() => setCategoryModalOpen(true)}
                style={{ padding: '1rem 2.2rem', fontSize: '1.05rem' }}
              >
                <Calculator size={20} /> Sell Your Laptop <ChevronRight size={20} />
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
              borderRadius: '18px',
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

      {/* PROMOTIONAL CATEGORY SLIDER SECTION */}
      <section style={{ 
        padding: '0.5rem 0 3.5rem', 
        background: 'var(--bg-primary)', 
        transition: 'background-color 0.3s ease' 
      }}>
        <CategorySlider />
      </section>

      {/* PRODUCT CATEGORY CARDS SECTION */}
      <section style={{ 
        padding: '3.75rem 0 4rem', 
        background: 'var(--bg-secondary)', 
        borderBottom: '1px solid var(--border-subtle)', 
        transition: 'background-color 0.3s ease' 
      }}>
        <div className="container" style={{ maxWidth: '920px' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ 
              color: 'var(--text-muted)', 
              fontWeight: 600, 
              fontSize: '0.85rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em',
              display: 'block',
              marginBottom: '0.35rem'
            }}>
              Instant Valuation & Doorstep Buyback
            </span>
            <h2 style={{ 
              fontSize: 'clamp(1.75rem, 3.2vw, 2.35rem)', 
              fontWeight: 700, 
              letterSpacing: '-0.03em',
              color: 'var(--text-main)' 
            }}>
              Select Your Category
            </h2>
          </div>

          {/* Category Cards Grid */}
          <CategoryCards />
        </div>
      </section>

      {/* WHY CHOOSE US / SERVICES */}
      <section id="services" style={{ padding: '4rem 0', background: 'var(--bg-primary)', scrollMarginTop: '80px' }}>
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


      {/* HOW IT WORKS (MODERN 4-STEP GRID DESIGN) */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-primary)', transition: 'background-color 0.3s ease' }}>
        <div className="container" style={{ maxWidth: '1240px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ 
              color: 'var(--text-muted)', 
              fontWeight: 600, 
              fontSize: '0.85rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em',
              display: 'block',
              marginBottom: '0.35rem'
            }}>
              Simple & Transparent
            </span>
            <h2 style={{ 
              fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)', 
              fontWeight: 700, 
              letterSpacing: '-0.03em',
              color: 'var(--text-main)' 
            }}>
              How Selling Your Device Works
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              {
                step: '01',
                title: 'Select Device & Specs',
                desc: 'Pick your category (Laptop, Desktop, Monitor, Mac Mini) and select specifications & current physical condition.',
                icon: FileText
              },
              {
                step: '02',
                title: 'Get Instant Valuation',
                desc: 'Receive a guaranteed fair-market price quote in real-time calculated by our live algorithmic valuation engine.',
                icon: Calculator
              },
              {
                step: '03',
                title: 'Free Doorstep Inspection',
                desc: 'Schedule a certified agent doorstep pickup at your home or workplace at your most convenient time slot.',
                icon: Truck
              },
              {
                step: '04',
                title: 'Instant Cash Settlement',
                desc: 'Our agent conducts a 5-minute diagnostic check and transfers UPI, IMPS, or Cash directly to you before taking the device.',
                icon: Banknote
              }
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '24px',
                    border: '1px solid var(--border-subtle)',
                    padding: '2.25rem 1.75rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-card)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
                    e.currentTarget.style.borderColor = 'var(--border-glow)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                >
                  {/* Top Bar: Step Number & Icon */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <span style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '9999px',
                      background: 'var(--btn-outline-bg)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-main)'
                    }}>
                      STEP {item.step}
                    </span>

                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-main)'
                    }}>
                      <IconComp size={20} />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div>
                    <h3 style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                      lineHeight: 1.25,
                      color: 'var(--text-main)',
                      marginBottom: '0.65rem'
                    }}>
                      {item.title}
                    </h3>
                    <p style={{
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                      color: 'var(--text-muted)'
                    }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-pitch)', transition: 'background-color 0.3s ease' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Testimonials</span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '0.3rem' }}>What Our Customers Say</h2>
          </div>

          <div className="grid-3">
            {REVIEWS.map(r => (
              <div key={r.id} className="card-dark">
                <div style={{ display: 'flex', gap: '0.2rem', color: '#f59e0b', marginBottom: '0.75rem' }}>
                  {[...Array(r.rating)].map((_, idx) => (
                    <Star key={idx} size={16} fill="#f59e0b" />
                  ))}
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', fontStyle: 'italic', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                  "{r.comment}"
                </p>
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>{r.name}</div>
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
      <section style={{ padding: '4rem 0', background: 'var(--bg-primary)', transition: 'background-color 0.3s ease' }}>
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
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>{faq.question}</h3>
                    <ChevronDown size={20} color="var(--text-muted)" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
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
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        transition: 'background-color 0.3s ease'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.4rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Ready to Turn Your Old Device into Cash?</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.05rem' }}>
            Get an instant price quote in 2 minutes. Free doorstep pickup and instant bank payment guaranteed.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-gold" onClick={() => setCategoryModalOpen(true)}>
              <Calculator size={18} /> Sell Your Device Now
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
