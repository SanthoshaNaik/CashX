import React, { useState, useEffect } from 'react';
import { usePortal } from '../context/PortalContext';
import { Apple, ShieldCheck, CheckCircle2, Calculator, ArrowRight, ArrowLeft, Truck } from 'lucide-react';
import { CITIES } from '../data/portalData';

export const SellMacBookPage = () => {
  const { createBuybackRequest, calculateQuote, currentUser, setAuthModalOpen, navigate } = usePortal();

  const [formData, setFormData] = useState({
    name: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
    email: '',
    city: 'Bangalore',
    brand: 'Apple MacBook',
    model: 'MacBook Air M1',
    processor: 'Apple M1',
    ram: '8GB',
    storage: '256GB SSD',
    condition: 'Excellent',
    age: '1-2 Years',
    accessories: ['Charger', 'Original Box'],
    address: '',
    expectedPrice: ''
  });

  // Flow State: 'form' | 'quotation' | 'confirmed'
  const [viewState, setViewState] = useState('form');
  const [calculatedQuote, setCalculatedQuote] = useState(0);
  const [submitted, setSubmitted] = useState(null);

  // Automatically fetch & fill logged in user's name and mobile number
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.fullName || prev.name,
        phone: currentUser.phone || prev.phone
      }));
    }
  }, [currentUser]);

  const handleCalculateQuotation = (e) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    const quote = calculateQuote({ ...formData, deviceType: 'MacBook' });
    setCalculatedQuote(quote);
    setViewState('quotation');
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleAcceptAndBookPickup = () => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    const req = createBuybackRequest({ ...formData, deviceType: 'MacBook', expectedPrice: calculatedQuote });
    setSubmitted(req);
    setViewState('confirmed');
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero Banner */}
      <section style={{ padding: '4rem 0 3rem', background: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.08) 0%, rgba(8,8,10,1) 80%)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <div className="container">
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#fff' }}>
            <Apple size={30} />
          </div>
          <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>Sell Your Apple <span className="text-gradient-gold">MacBook</span></h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto', fontSize: '1.05rem' }}>
            Get premium market buyback value for your MacBook Air, MacBook Pro, M1, M2, M3, or Intel Mac with instant bank settlement.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-pitch)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          
          {/* STEP 1: FORM */}
          {viewState === 'form' && (
            <div className="card-dark" style={{ padding: '2.5rem 2rem' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Apple size={22} /> Apple MacBook Valuation Form
              </h3>

              <form onSubmit={handleCalculateQuotation}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input type="text" required className="form-input" placeholder="Your name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mobile Number *</label>
                    <input type="tel" required className="form-input" placeholder="10-digit mobile" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <select className="form-select" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })}>
                      {CITIES.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">MacBook Series</label>
                    <select className="form-select" value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })}>
                      <option value="MacBook Air M1">MacBook Air M1 (2020)</option>
                      <option value="MacBook Air M2">MacBook Air M2 (2022)</option>
                      <option value="MacBook Air M3">MacBook Air M3 (2024)</option>
                      <option value="MacBook Pro 14 M1/M2/M3">MacBook Pro 14" (M1/M2/M3 Pro)</option>
                      <option value="MacBook Pro 16 M1/M2/M3">MacBook Pro 16" (M1/M2/M3 Max)</option>
                      <option value="Intel MacBook Air">Intel MacBook Air (2017-2020)</option>
                      <option value="Intel MacBook Pro">Intel MacBook Pro (2016-2020)</option>
                    </select>
                  </div>
                </div>

                <div className="grid-3">
                  <div className="form-group">
                    <label className="form-label">RAM</label>
                    <select className="form-select" value={formData.ram} onChange={e => setFormData({ ...formData, ram: e.target.value })}>
                      <option value="8GB Unified">8 GB Unified</option>
                      <option value="16GB Unified">16 GB Unified</option>
                      <option value="32GB+ Unified">32 GB+ Unified</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Storage</label>
                    <select className="form-select" value={formData.storage} onChange={e => setFormData({ ...formData, storage: e.target.value })}>
                      <option value="256GB SSD">256 GB SSD</option>
                      <option value="512GB SSD">512 GB SSD</option>
                      <option value="1TB SSD">1 TB SSD</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Physical Condition</label>
                    <select className="form-select" value={formData.condition} onChange={e => setFormData({ ...formData, condition: e.target.value })}>
                      <option value="Excellent">Excellent (No dents/scratches)</option>
                      <option value="Good">Good (Minor scuffs)</option>
                      <option value="Average">Average (Noticeable wear)</option>
                      <option value="Damaged">Damaged (Display issue/dead)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ width: '100%', boxSizing: 'border-box' }}>
                  <label className="form-label">Pickup Address *</label>
                  <textarea 
                    required 
                    rows={2} 
                    className="form-textarea" 
                    placeholder="Full street address for doorstep pickup" 
                    value={formData.address} 
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    style={{ 
                      width: '100%', 
                      maxWidth: '100%', 
                      boxSizing: 'border-box', 
                      display: 'block', 
                      resize: 'none', 
                      minHeight: '80px', 
                      maxHeight: '80px' 
                    }}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: '1rem', justifyContent: 'center' }}>
                  Calculate Instant Quotation <ArrowRight size={18} />
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: QUOTATION OFFER & ACCEPTANCE */}
          {viewState === 'quotation' && (
            <div className="card-dark" style={{ padding: '2.5rem 2rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
                  OFFICIAL ESTIMATED VALUATION
                </span>
                <h2 style={{ fontSize: '1.9rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  Your Estimated Quotation
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Calculated for your {formData.model} ({formData.ram}, {formData.storage})
                </p>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid var(--border-glow)',
                borderRadius: '16px',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                marginBottom: '2rem'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                  Instant Cash Offer
                </div>
                <div style={{
                  fontSize: 'clamp(2.4rem, 4.5vw, 3.2rem)',
                  fontWeight: 800,
                  color: 'var(--accent-emerald)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  marginBottom: '0.5rem'
                }}>
                  ₹{calculatedQuote.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  ✓ Instant payment via UPI / IMPS upon doorstep inspection
                </div>
              </div>

              <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: '14px',
                padding: '1.5rem',
                marginBottom: '1.75rem',
                border: '1px solid var(--border-subtle)'
              }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                  MacBook & Pickup Summary
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Model</span>
                    <strong style={{ color: 'var(--text-main)' }}>{formData.model}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Specs</span>
                    <strong style={{ color: 'var(--text-main)' }}>{formData.ram}, {formData.storage}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Condition</span>
                    <strong style={{ color: 'var(--text-main)' }}>{formData.condition}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>City</span>
                    <strong style={{ color: 'var(--text-main)' }}>{formData.city}</strong>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Pickup Address</span>
                    <strong style={{ color: 'var(--text-main)' }}>{formData.address}</strong>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Contact</span>
                    <strong style={{ color: 'var(--text-main)' }}>{formData.name} ({formData.phone})</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <Truck size={18} color="var(--accent-cyan)" /> Free Doorstep Pickup
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={18} color="var(--accent-emerald)" /> Instant Payment
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <ShieldCheck size={18} color="var(--accent-gold)" /> Certified Data Wipe
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <button
                  onClick={handleAcceptAndBookPickup}
                  className="btn btn-gold"
                  style={{ width: '100%', padding: '1.05rem', fontSize: '1rem', fontWeight: 700, justifyContent: 'center' }}
                >
                  <CheckCircle2 size={20} /> Accept Quotation & Book Doorstep Pickup
                </button>

                <button
                  onClick={() => {
                    setViewState('form');
                    window.scrollTo({ top: 100, behavior: 'smooth' });
                  }}
                  className="btn btn-outline"
                  style={{ width: '100%', padding: '0.85rem', fontSize: '0.9rem', justifyContent: 'center' }}
                >
                  <ArrowLeft size={16} /> Edit MacBook Details
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: BOOKING CONFIRMATION */}
          {viewState === 'confirmed' && submitted && (
            <div className="card-dark" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
              <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <CheckCircle2 size={40} />
              </div>
              <span className="badge badge-emerald" style={{ marginBottom: '0.75rem' }}>PICKUP BOOKING CONFIRMED</span>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                MacBook Pickup Scheduled!
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
                Buyback Order ID: <strong style={{ color: 'var(--accent-gold)' }}>{submitted.id}</strong>
                <br />
                Agreed Quotation Amount: <strong style={{ color: 'var(--accent-emerald)', fontSize: '1.2rem' }}>₹{submitted.estimatedPrice.toLocaleString()}</strong>
              </p>

              <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '1.25rem', textAlign: 'left', marginBottom: '2rem', fontSize: '0.9rem', border: '1px solid var(--border-subtle)' }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  📍 <strong>Pickup Address:</strong> {submitted.customer.address}, {submitted.customer.city}
                </div>
                <div>
                  📞 <strong>Field Agent Assignment:</strong> Our technician will contact <strong>{submitted.customer.phone}</strong> to confirm doorstep inspection timing.
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <button 
                  className="btn btn-gold" 
                  onClick={() => navigate('/profile')}
                  style={{ width: '100%', padding: '0.95rem', justifyContent: 'center' }}
                >
                  Track My Order Status
                </button>
                <button 
                  className="btn btn-outline" 
                  onClick={() => {
                    setSubmitted(null);
                    setViewState('form');
                  }}
                  style={{ width: '100%', padding: '0.85rem', justifyContent: 'center' }}
                >
                  Submit Another MacBook Request
                </button>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};
