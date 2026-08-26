import React, { useState, useEffect } from 'react';
import { usePortal } from '../context/PortalContext';
import { Apple, ShieldCheck, CheckCircle2, Calculator, ArrowRight, ArrowLeft, Truck } from 'lucide-react';
import { MACMINI_MODELS, CITIES } from '../data/portalData';

export const SellMacMiniPage = () => {
  const { createBuybackRequest, calculateQuote, currentUser, setAuthModalOpen, navigate } = usePortal();

  const [formData, setFormData] = useState({
    name: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
    email: '',
    city: 'Bangalore',
    brand: 'Apple',
    model: 'Mac Mini M2 (2023)',
    processor: 'Apple M2 Chip',
    ram: '16GB Unified Memory',
    storage: '512GB SSD',
    condition: 'Excellent',
    accessories: ['Original Power Cord', 'Original Box'],
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

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleAccessoryToggle = (item) => {
    setFormData(prev => {
      const exists = prev.accessories.includes(item);
      return {
        ...prev,
        accessories: exists ? prev.accessories.filter(i => i !== item) : [...prev.accessories, item]
      };
    });
  };

  const handleCalculateQuotation = (e) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    const quote = calculateQuote({
      ...formData,
      deviceType: 'MacMini'
    });
    setCalculatedQuote(quote);
    setViewState('quotation');
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleAcceptAndBookPickup = () => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    const req = createBuybackRequest({
      ...formData,
      deviceType: 'MacMini',
      expectedPrice: calculatedQuote
    });
    setSubmitted(req);
    setViewState('confirmed');
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero Banner */}
      <section style={{
        padding: '4rem 0 3rem',
        background: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,0.09) 0%, rgba(5,6,8,1) 80%)',
        borderBottom: '1px solid var(--border-subtle)',
        textAlign: 'center'
      }}>
        <div className="container">
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            color: '#ffffff',
            border: '1px solid var(--border-subtle)'
          }}>
            <Apple size={28} />
          </div>
          <span className="badge badge-gold" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>
            PREMIUM APPLE SILICON & INTEL BUYBACK
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '1rem' }}>
            Sell Your Apple <span className="text-gradient-gold">Mac Mini</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', fontSize: '1.05rem' }}>
            Get the maximum resale price for your Mac Mini M1, M2, M2 Pro, M4, M4 Pro or Intel Mac Mini. Enjoy free doorstep pickup and instant bank payment.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-pitch)' }}>
        <div className="container">
          
          {/* STEP 1: FORM */}
          {viewState === 'form' && (
            <div style={{ maxWidth: '760px', margin: '0 auto' }}>
              <div className="card-dark" style={{ padding: '2.5rem 2rem' }}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Apple size={22} /> Mac Mini Valuation Form
                </h3>

                <form onSubmit={handleCalculateQuotation}>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input type="text" required className="form-input" placeholder="Your name" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Mobile Number *</label>
                      <input type="tel" required className="form-input" placeholder="10-digit mobile" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} />
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <select className="form-input" value={formData.city} onChange={e => handleInputChange('city', e.target.value)}>
                        {CITIES.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Mac Mini Model / Chip *</label>
                      <select className="form-input" value={formData.model} onChange={e => {
                        handleInputChange('model', e.target.value);
                        handleInputChange('processor', e.target.value);
                      }}>
                        {MACMINI_MODELS.map(m => (
                          <option key={m.id} value={m.name}>{m.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Unified RAM *</label>
                      <select className="form-input" value={formData.ram} onChange={e => handleInputChange('ram', e.target.value)}>
                        <option value="8GB Unified Memory">8 GB Unified Memory</option>
                        <option value="16GB Unified Memory">16 GB Unified Memory</option>
                        <option value="24GB Unified Memory">24 GB Unified Memory</option>
                        <option value="32GB Unified Memory">32 GB Unified Memory</option>
                        <option value="64GB+ Unified Memory">64 GB+ Unified Memory</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">SSD Storage *</label>
                      <select className="form-input" value={formData.storage} onChange={e => handleInputChange('storage', e.target.value)}>
                        <option value="256GB SSD">256 GB PCIe SSD</option>
                        <option value="512GB SSD">512 GB PCIe SSD</option>
                        <option value="1TB SSD">1 TB PCIe SSD</option>
                        <option value="2TB SSD">2 TB PCIe SSD</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Cosmetic & Working Condition *</label>
                    <select className="form-input" value={formData.condition} onChange={e => handleInputChange('condition', e.target.value)}>
                      <option value="Excellent">Flawless - Pristine aluminum chassis, zero scratches</option>
                      <option value="Good">Good - Minor hairline scuffs on bottom plate or ports</option>
                      <option value="Average">Average - Visible casing dents / heavy port wear</option>
                      <option value="Damaged">Defective - Power/boot issue or logic board fault</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Accessories Included</label>
                    <div className="custom-check-grid">
                      {['Original Power Cord', 'Original Apple Box', 'Tax Invoice / Bill', 'Apple Magic Mouse/Keys'].map(acc => (
                        <div
                          key={acc}
                          className={`custom-check-card ${formData.accessories.includes(acc) ? 'active' : ''}`}
                          onClick={() => handleAccessoryToggle(acc)}
                        >
                          <CheckCircle2 size={16} /> {acc}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-group" style={{ width: '100%', boxSizing: 'border-box' }}>
                    <label className="form-label">Pickup Address *</label>
                    <textarea 
                      required 
                      rows={2} 
                      className="form-input" 
                      placeholder="Full address for doorstep inspection & instant payment" 
                      value={formData.address} 
                      onChange={e => handleInputChange('address', e.target.value)}
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

                  <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: '1rem', marginTop: '0.5rem', justifyContent: 'center' }}>
                    Calculate Instant Quotation <ArrowRight size={18} />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* STEP 2: QUOTATION OFFER & ACCEPTANCE */}
          {viewState === 'quotation' && (
            <div style={{ maxWidth: '760px', margin: '0 auto' }}>
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
                    ✓ Instant payment via UPI / IMPS upon Apple hardware diagnostic check
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
                    Mac Mini & Pickup Summary
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Model</span>
                      <strong style={{ color: 'var(--text-main)' }}>{formData.model}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Unified RAM & SSD</span>
                      <strong style={{ color: 'var(--text-main)' }}>{formData.ram}, {formData.storage}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Condition</span>
                      <strong style={{ color: 'var(--text-main)' }}>{formData.condition}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Accessories</span>
                      <strong style={{ color: 'var(--text-main)' }}>{formData.accessories.join(', ') || 'None'}</strong>
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
                    <ShieldCheck size={18} color="var(--accent-gold)" /> iCloud Deregistration
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
                    <ArrowLeft size={16} /> Edit Mac Mini Details
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: BOOKING CONFIRMATION */}
          {viewState === 'confirmed' && submitted && (
            <div style={{ maxWidth: '640px', margin: '0 auto' }}>
              <div className="card-dark" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
                <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <CheckCircle2 size={40} />
                </div>
                <span className="badge badge-emerald" style={{ marginBottom: '0.75rem' }}>PICKUP BOOKING CONFIRMED</span>
                <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
                  Mac Mini Pickup Scheduled!
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
                    📞 <strong>Field Agent Assignment:</strong> Our technician will contact <strong>{submitted.customer.phone}</strong> to confirm your doorstep pickup time.
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
                    Submit Another Mac Mini Request
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};
