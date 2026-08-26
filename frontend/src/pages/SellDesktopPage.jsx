import React, { useState, useEffect } from 'react';
import { usePortal } from '../context/PortalContext';
import { Monitor, CheckCircle2, ArrowRight, ArrowLeft, Truck, ShieldCheck, Calculator } from 'lucide-react';
import { CITIES } from '../data/portalData';

export const SellDesktopPage = () => {
  const { createBuybackRequest, calculateQuote, currentUser, setAuthModalOpen, navigate } = usePortal();

  const [formData, setFormData] = useState({
    name: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
    email: '',
    city: 'Bangalore',
    brand: 'Custom PC',
    model: 'Gaming Rig',
    processor: 'AMD Ryzen 7',
    ram: '16GB',
    storage: '1TB NVMe SSD',
    condition: 'Excellent',
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
    const quote = calculateQuote({ ...formData, deviceType: 'Desktop' });
    setCalculatedQuote(quote);
    setViewState('quotation');
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleAcceptAndBookPickup = () => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    const req = createBuybackRequest({ ...formData, deviceType: 'Desktop', expectedPrice: calculatedQuote });
    setSubmitted(req);
    setViewState('confirmed');
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  return (
    <div>
      <section style={{ padding: '4rem 0 3rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <div className="container">
          <span className="badge badge-cyan" style={{ marginBottom: '0.75rem' }}>COMPONENT-BASED EVALUATION</span>
          <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>Sell Your <span className="text-gradient-cyan">Desktop PC & Gaming Rig</span></h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto', fontSize: '1.05rem' }}>
            We buy custom gaming PCs, editing workstations, AiO PCs, and office desktop setups with full component valuation (GPU, CPU, Motherboard).
          </p>
        </div>
      </section>

      {/* Main Flow Section */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-primary)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          
          {/* STEP 1: DESKTOP FORM */}
          {viewState === 'form' && (
            <div className="card-dark" style={{ padding: '2.5rem 2rem' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--accent-cyan)' }}>
                <Calculator size={20} style={{ display: 'inline', marginRight: '0.4rem' }} /> Desktop Valuation Form
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
                    <label className="form-label">Category</label>
                    <select className="form-select" value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })}>
                      <option value="Gaming PC">Gaming PC (RTX/GTX GPU)</option>
                      <option value="Office PC">Office Desktop PC</option>
                      <option value="Workstation">Heavy Workstation</option>
                      <option value="Custom Build">Custom Tower</option>
                    </select>
                  </div>
                </div>

                <div className="grid-3">
                  <div className="form-group">
                    <label className="form-label">Processor</label>
                    <input type="text" className="form-input" placeholder="e.g. Ryzen 7 5800X, Core i7" value={formData.processor} onChange={e => setFormData({ ...formData, processor: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">RAM Size</label>
                    <select className="form-select" value={formData.ram} onChange={e => setFormData({ ...formData, ram: e.target.value })}>
                      <option value="8GB">8 GB</option>
                      <option value="16GB">16 GB</option>
                      <option value="32GB">32 GB</option>
                      <option value="64GB+">64 GB+</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Condition</label>
                    <select className="form-select" value={formData.condition} onChange={e => setFormData({ ...formData, condition: e.target.value })}>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Average">Average</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ width: '100%', boxSizing: 'border-box' }}>
                  <label className="form-label">Pickup Address *</label>
                  <textarea 
                    required 
                    rows={2} 
                    className="form-textarea" 
                    placeholder="Full address for desktop pickup" 
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

                <button type="submit" className="btn btn-cyan" style={{ width: '100%', padding: '1rem', justifyContent: 'center' }}>
                  Calculate Instant Quotation <ArrowRight size={18} />
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: QUOTATION OFFER & ACCEPTANCE */}
          {viewState === 'quotation' && (
            <div className="card-dark" style={{ padding: '2.5rem 2rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <span className="badge badge-cyan" style={{ marginBottom: '0.75rem' }}>
                  OFFICIAL ESTIMATED VALUATION
                </span>
                <h2 style={{ fontSize: '1.9rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  Your Estimated Quotation
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Calculated for your {formData.model} ({formData.processor}, {formData.ram})
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
                  color: 'var(--accent-cyan)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  marginBottom: '0.5rem'
                }}>
                  ₹{calculatedQuote.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  ✓ Instant payment via UPI / IMPS upon technician verification
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
                  Desktop & Pickup Summary
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Type</span>
                    <strong style={{ color: 'var(--text-main)' }}>{formData.model}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Processor</span>
                    <strong style={{ color: 'var(--text-main)' }}>{formData.processor}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>RAM</span>
                    <strong style={{ color: 'var(--text-main)' }}>{formData.ram}</strong>
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
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Address</span>
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
                  <Truck size={18} color="var(--accent-cyan)" /> Free Heavy Desktop Pickup
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <CheckCircle2 size={18} color="var(--accent-emerald)" /> Instant Payout
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <ShieldCheck size={18} color="var(--accent-gold)" /> Component Check
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <button
                  onClick={handleAcceptAndBookPickup}
                  className="btn btn-cyan"
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
                  <ArrowLeft size={16} /> Edit Desktop Details
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
              <span className="badge badge-cyan" style={{ marginBottom: '0.75rem' }}>PICKUP BOOKING CONFIRMED</span>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                Desktop Pickup Scheduled!
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
                Buyback Order ID: <strong style={{ color: 'var(--accent-cyan)' }}>{submitted.id}</strong>
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
                  className="btn btn-cyan" 
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
                  Submit Another Desktop Request
                </button>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};
