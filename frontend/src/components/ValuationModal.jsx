import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { X, Calculator, CheckCircle2, ChevronRight, ArrowLeft, Laptop, ShieldCheck, Truck, Lock, LogIn } from 'lucide-react';
import { BRANDS, CITIES } from '../data/portalData';

export const ValuationModal = () => {
  const { valuationModalOpen, setValuationModalOpen, calculateQuote, createBuybackRequest, currentUser, setAuthModalOpen, COMPANY_INFO } = usePortal();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    deviceType: 'Laptop',
    brand: 'Apple',
    model: '',
    processor: 'Intel Core i5',
    ram: '8GB',
    storage: '512GB SSD',
    condition: 'Good',
    age: '1-2 Years',
    accessories: ['Charger'],
    name: currentUser?.fullName || '',
    phone: '',
    email: currentUser?.email || '',
    city: 'Bangalore',
    address: '',
    pincode: '',
    expectedPrice: ''
  });

  const [calculatedEstimate, setCalculatedEstimate] = useState(0);
  const [submittedResult, setSubmittedResult] = useState(null);

  if (!valuationModalOpen) return null;

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleCheckboxToggle = (item) => {
    setFormData(prev => {
      const exists = prev.accessories.includes(item);
      return {
        ...prev,
        accessories: exists ? prev.accessories.filter(i => i !== item) : [...prev.accessories, item]
      };
    });
  };

  const handleNextStep1 = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleNextStep2 = (e) => {
    e.preventDefault();
    const est = calculateQuote(formData);
    setCalculatedEstimate(est);
    setStep(3);
  };

  const handleSubmitFinal = (e) => {
    e.preventDefault();

    // STRICT AUTHENTICATION GUARD: User must be logged in to sell device
    if (!currentUser) {
      setValuationModalOpen(false);
      setAuthModalOpen(true);
      return;
    }

    const req = createBuybackRequest({
      ...formData,
      name: formData.name || currentUser.fullName || 'Valued Customer',
      email: formData.email || currentUser.email,
      expectedPrice: formData.expectedPrice || calculatedEstimate
    });
    setSubmittedResult(req);
    setStep(4);
  };

  const resetAndClose = () => {
    setStep(1);
    setSubmittedResult(null);
    setValuationModalOpen(false);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 200,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '650px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-card)',
        position: 'relative',
        padding: '2rem'
      }}>
        {/* Close Button */}
        <button
          onClick={resetAndClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            color: 'var(--text-muted)',
            padding: '0.4rem',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '50%'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'var(--accent-gold-glow)',
            color: 'var(--accent-gold)',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '0.5rem'
          }}>
            <Calculator size={14} /> INSTANT ONLINE BUYBACK VALUATION
          </div>
          <h3 style={{ fontSize: '1.6rem', marginBottom: '0.25rem' }}>Sell Your Device in 60 Seconds</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Free doorstep inspection • Instant cash payment • 100% Data Wiping
          </p>
        </div>

        {/* LOGIN GATEWAY BANNER (If not logged in) */}
        {!currentUser && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid var(--border-glow)',
            borderRadius: '12px',
            padding: '0.85rem 1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.84rem' }}>
              <Lock size={18} color="var(--accent-gold)" />
              <div>
                <strong style={{ color: '#fff', display: 'block' }}>Account Required to Complete Sale</strong>
                <span style={{ color: 'var(--text-muted)' }}>Log in or create an account to get instant pickup.</span>
              </div>
            </div>
            <button
              onClick={() => { setValuationModalOpen(false); setAuthModalOpen(true); }}
              className="btn btn-gold"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            >
              <LogIn size={14} /> Login / Register
            </button>
          </div>
        )}

        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: step >= i ? 'var(--accent-gold)' : 'rgba(255,255,255,0.05)',
                color: step >= i ? '#000' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {i}
              </div>
              {i < 3 && <div style={{ width: '40px', height: '2px', background: step > i ? 'var(--accent-gold)' : 'var(--border-subtle)' }}></div>}
            </div>
          ))}
        </div>

        {/* STEP 1: Device Specs */}
        {step === 1 && (
          <form onSubmit={handleNextStep1}>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                {['Laptop', 'MacBook', 'Desktop'].map(type => (
                  <button
                    key={type}
                    type="button"
                    className={`btn ${formData.deviceType === type ? 'btn-gold' : 'btn-outline'}`}
                    onClick={() => handleInputChange('deviceType', type)}
                    style={{ padding: '0.6rem', fontSize: '0.85rem' }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Brand *</label>
              <select
                className="form-input"
                value={formData.brand}
                onChange={e => handleInputChange('brand', e.target.value)}
              >
                {BRANDS.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
              </select>
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Processor (CPU) *</label>
                <select
                  className="form-input"
                  value={formData.processor}
                  onChange={e => handleInputChange('processor', e.target.value)}
                >
                  <option value="Intel Core i3">Intel Core i3</option>
                  <option value="Intel Core i5">Intel Core i5</option>
                  <option value="Intel Core i7">Intel Core i7</option>
                  <option value="Intel Core i9">Intel Core i9</option>
                  <option value="AMD Ryzen 5">AMD Ryzen 5</option>
                  <option value="AMD Ryzen 7">AMD Ryzen 7</option>
                  <option value="Apple M1 / M2 / M3">Apple M1 / M2 / M3</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">RAM Size *</label>
                <select
                  className="form-input"
                  value={formData.ram}
                  onChange={e => handleInputChange('ram', e.target.value)}
                >
                  <option value="4GB">4GB</option>
                  <option value="8GB">8GB</option>
                  <option value="16GB">16GB</option>
                  <option value="32GB+">32GB+</option>
                </select>
              </div>
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Storage Capacity *</label>
                <select
                  className="form-input"
                  value={formData.storage}
                  onChange={e => handleInputChange('storage', e.target.value)}
                >
                  <option value="256GB SSD">256GB SSD</option>
                  <option value="512GB SSD">512GB SSD</option>
                  <option value="1TB SSD">1TB SSD</option>
                  <option value="1TB HDD">1TB HDD</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Physical Condition *</label>
                <select
                  className="form-input"
                  value={formData.condition}
                  onChange={e => handleInputChange('condition', e.target.value)}
                >
                  <option value="Excellent">Flawless (No Scratches)</option>
                  <option value="Good">Minor Usage Scratches</option>
                  <option value="Average">Dents / Heavy Wear</option>
                  <option value="Damaged">Broken / Not Working</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-gold" style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }}>
              Next: Select Accessories & Age <ChevronRight size={18} />
            </button>
          </form>
        )}

        {/* STEP 2: Accessories */}
        {step === 2 && (
          <form onSubmit={handleNextStep2}>
            <div className="form-group">
              <label className="form-label">Device Age *</label>
              <select
                className="form-input"
                value={formData.age}
                onChange={e => handleInputChange('age', e.target.value)}
              >
                <option value="Under 1 Year">Under 1 Year (In Warranty)</option>
                <option value="1-2 Years">1 - 2 Years</option>
                <option value="2-4 Years">2 - 4 Years</option>
                <option value="Over 4 Years">Over 4 Years</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Select Available Accessories (Increases Cash Quote):</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {['Original Charger', 'Box / Packaging', 'Original Tax Invoice / Bill', 'Laptop Bag'].map(item => (
                  <label
                    key={item}
                    style={{
                      padding: '0.75rem',
                      background: formData.accessories.includes(item) ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.03)',
                      border: formData.accessories.includes(item) ? '1px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.accessories.includes(item)}
                      onChange={() => handleCheckboxToggle(item)}
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setStep(1)} className="btn btn-outline" style={{ flex: 1 }}>
                <ArrowLeft size={16} /> Back
              </button>
              <button type="submit" className="btn btn-gold" style={{ flex: 2 }}>
                Calculate Instant Valuation Quote <ChevronRight size={18} />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Contact & Doorstep Pickup Address */}
        {step === 3 && (
          <form onSubmit={handleSubmitFinal}>
            <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '1.25rem', textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 600 }}>ESTIMATED CASH PAYOUT QUOTE</div>
              <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#34d399' }}>₹{calculatedEstimate.toLocaleString('en-IN')}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Includes Free 2-Hour Doorstep Inspection & Instant UPI / Cash Payment</div>
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  className="form-input"
                  placeholder="10-digit mobile"
                  value={formData.phone}
                  onChange={e => handleInputChange('phone', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">City Hub *</label>
                <select
                  className="form-input"
                  value={formData.city}
                  onChange={e => handleInputChange('city', e.target.value)}
                >
                  {CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Area Pincode *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="6-digit pincode"
                  value={formData.pincode}
                  onChange={e => handleInputChange('pincode', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Doorstep Pickup Address *</label>
              <textarea
                required
                className="form-input"
                rows="2"
                placeholder="House / Flat No., Building Name, Street Address"
                value={formData.address}
                onChange={e => handleInputChange('address', e.target.value)}
              ></textarea>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setStep(2)} className="btn btn-outline" style={{ flex: 1 }}>
                <ArrowLeft size={16} /> Back
              </button>
              <button type="submit" className="btn btn-gold" style={{ flex: 2, padding: '0.85rem' }}>
                {currentUser ? 'Confirm Free Doorstep Pickup Request' : '🔒 Log In to Confirm Buyback Request'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Success Confirmation */}
        {step === 4 && submittedResult && (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Buyback Request Confirmed!</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Request ID: <strong style={{ color: 'var(--accent-gold)' }}>{submittedResult.id}</strong> • Assigned Field Agent will contact you at <strong>{submittedResult.customer.phone}</strong> within 15 minutes to confirm your doorstep pickup time.
            </p>

            <div style={{ background: '#11131a', borderRadius: '12px', padding: '1.25rem', textAlign: 'left', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--accent-gold)' }}>SUMMARY DETAILS:</div>
              <div>• <strong>Device:</strong> {submittedResult.device.brand} {submittedResult.device.model} ({submittedResult.device.processor}, {submittedResult.device.ram}, {submittedResult.device.storage})</div>
              <div>• <strong>Estimated Payout:</strong> ₹{submittedResult.estimatedPrice.toLocaleString('en-IN')}</div>
              <div>• <strong>Pickup City:</strong> {submittedResult.customer.city} ({submittedResult.customer.pincode})</div>
            </div>

            <button onClick={resetAndClose} className="btn btn-gold" style={{ padding: '0.75rem 2rem' }}>
              Done / Return to Website
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
