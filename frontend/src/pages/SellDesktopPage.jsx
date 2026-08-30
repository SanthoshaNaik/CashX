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
          <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>COMPONENT-BASED EVALUATION</span>
          <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>Sell Your <span className="text-gradient-gold">Desktop PC & Gaming Rig</span></h1>
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
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>
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
                    <label className="form-label">Desktop Type *</label>
                    <select className="form-select" value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })}>
                      <option value="Gaming PC Rig">Custom Gaming PC Rig (Dedicated GPU)</option>
                      <option value="All-in-One PC">All-in-One PC (HP / Dell / Lenovo / Apple iMac)</option>
                      <option value="Workstation Tower">Professional Workstation (Render / Video Editing)</option>
                      <option value="Pre-built Office Tower">Standard Office Desktop Tower</option>
                      <option value="Mini PC / NUC">Mini PC / Intel NUC</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Processor / CPU *</label>
                    <select className="form-select" value={formData.processor} onChange={e => setFormData({ ...formData, processor: e.target.value })}>
                      <option value="AMD Ryzen 9 / Intel Core i9">Intel Core i9 / AMD Ryzen 9</option>
                      <option value="AMD Ryzen 7 / Intel Core i7">Intel Core i7 / AMD Ryzen 7</option>
                      <option value="AMD Ryzen 5 / Intel Core i5">Intel Core i5 / AMD Ryzen 5</option>
                      <option value="AMD Ryzen 3 / Intel Core i3">Intel Core i3 / AMD Ryzen 3</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">System RAM *</label>
                    <select className="form-select" value={formData.ram} onChange={e => setFormData({ ...formData, ram: e.target.value })}>
                      <option value="8GB">8 GB DDR4 / DDR5</option>
                      <option value="16GB">16 GB DDR4 / DDR5</option>
                      <option value="32GB">32 GB DDR4 / DDR5</option>
                      <option value="64GB">64 GB DDR4 / DDR5</option>
                      <option value="128GB+">128 GB+ High Capacity</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Storage Capacity *</label>
                    <select className="form-select" value={formData.storage} onChange={e => setFormData({ ...formData, storage: e.target.value })}>
                      <option value="512GB SSD">512GB NVMe SSD</option>
                      <option value="1TB SSD">1TB NVMe SSD</option>
                      <option value="2TB+ SSD">2TB+ NVMe SSD</option>
                      <option value="1TB HDD + 256GB SSD">1TB HDD + 256GB SSD</option>
                      <option value="1TB HDD only">1TB HDD only</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Overall Condition *</label>
                    <select className="form-select" value={formData.condition} onChange={e => setFormData({ ...formData, condition: e.target.value })}>
                      <option value="Excellent">Excellent - Like new, fully functional</option>
                      <option value="Good">Good - Minor cosmetic wear, 100% working</option>
                      <option value="Average">Average - Scratches on cabinet, functioning</option>
                      <option value="Damaged">Damaged - Component issues or non-booting</option>
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

                {/* Calculate Instant Quotation Button (Styled consistently with other category pages) */}
                <button 
                  type="submit" 
                  className="btn btn-gold" 
                  style={{ width: '100%', marginTop: '1rem', padding: '1rem', justifyContent: 'center' }}
                >
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
                  color: 'var(--accent-emerald)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                  marginBottom: '0.5rem'
                }}>
                  ₹{calculatedQuote.toLocaleString('en-IN')}
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
                  <Truck size={18} color="var(--accent-gold)" /> Free Heavy Desktop Pickup
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
              <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>PICKUP BOOKING CONFIRMED</span>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                Desktop Pickup Scheduled!
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
                Buyback Order ID: <strong style={{ color: 'var(--accent-gold)' }}>{submitted.id}</strong>
                <br />
                A certified desktop technician will review and visit your location in <strong>{formData.city}</strong>.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => navigate('/profile')} className="btn btn-gold" style={{ padding: '0.85rem 1.75rem' }}>
                  Track Order in Profile <ArrowRight size={18} />
                </button>
                <button onClick={() => navigate('/')} className="btn btn-outline" style={{ padding: '0.85rem 1.75rem' }}>
                  Back to Home
                </button>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};
