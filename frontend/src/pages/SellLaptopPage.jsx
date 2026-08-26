import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Laptop, ShieldCheck, CheckCircle2, Calculator, ArrowRight, HelpCircle } from 'lucide-react';
import { BRANDS, CITIES } from '../data/portalData';

export const SellLaptopPage = () => {
  const { createBuybackRequest, currentUser, setAuthModalOpen, COMPANY_INFO } = usePortal();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'Bangalore',
    brand: 'Dell',
    model: '',
    processor: 'Intel Core i5',
    ram: '8GB',
    storage: '512GB SSD',
    condition: 'Good',
    age: '1-2 Years',
    accessories: ['Charger'],
    address: '',
    expectedPrice: ''
  });

  const [submitted, setSubmitted] = useState(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    const req = createBuybackRequest({ ...formData, deviceType: 'Laptop' });
    setSubmitted(req);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero Banner */}
      <section style={{ padding: '4rem 0 3rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <div className="container">
          <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>INSTANT ONLINE VALUATION & FREE PICKUP</span>
          <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>Sell Your Used <span className="text-gradient-gold">Laptop</span></h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto', fontSize: '1.05rem' }}>
            Get an instant price quote for your Dell, HP, Lenovo, Asus, Acer, or Samsung laptop with free doorstep pickup across India.
          </p>
        </div>
      </section>

      {/* Main Content Form & Guide */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-pitch)' }}>
        <div className="container">
          {submitted ? (
            <div className="card-dark" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '3rem 2rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <CheckCircle2 size={36} />
              </div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Request Submitted Successfully!</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Your Buyback Request ID is <strong style={{ color: 'var(--accent-gold)' }}>{submitted.id}</strong>. Estimated Quote: <strong style={{ color: 'var(--accent-emerald)' }}>₹{submitted.estimatedPrice.toLocaleString()}</strong>
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
                Our field agent will call you shortly on <strong>{submitted.customer.phone}</strong> to confirm doorstep pickup timing in {submitted.customer.city}.
              </p>
              <button className="btn btn-gold" onClick={() => setSubmitted(null)}>
                Submit Another Laptop Request
              </button>
            </div>
          ) : (
            <div className="grid-2" style={{ gap: '2.5rem' }}>
              
              {/* Laptop Selling Form */}
              <div className="card-dark">
                <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>
                  <Calculator size={20} style={{ display: 'inline', marginRight: '0.4rem' }} /> Laptop Valuation Form
                </h3>

                <form onSubmit={handleSubmit}>
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
                      <label className="form-label">Email (Optional)</label>
                      <input type="email" className="form-input" placeholder="Email address" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <select className="form-select" value={formData.city} onChange={e => handleInputChange('city', e.target.value)}>
                        {CITIES.map(c => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Brand *</label>
                      <select className="form-select" value={formData.brand} onChange={e => handleInputChange('brand', e.target.value)}>
                        {BRANDS.map(b => (
                          <option key={b.id} value={b.name}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Model Name</label>
                      <input type="text" className="form-input" placeholder="e.g. Inspiron 15, Pavilion 14" value={formData.model} onChange={e => handleInputChange('model', e.target.value)} />
                    </div>
                  </div>

                  <div className="grid-3">
                    <div className="form-group">
                      <label className="form-label">Processor</label>
                      <select className="form-select" value={formData.processor} onChange={e => handleInputChange('processor', e.target.value)}>
                        <option value="Intel Core i3">Intel Core i3</option>
                        <option value="Intel Core i5">Intel Core i5</option>
                        <option value="Intel Core i7">Intel Core i7</option>
                        <option value="Intel Core i9">Intel Core i9</option>
                        <option value="AMD Ryzen 5">AMD Ryzen 5</option>
                        <option value="AMD Ryzen 7">AMD Ryzen 7</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">RAM</label>
                      <select className="form-select" value={formData.ram} onChange={e => handleInputChange('ram', e.target.value)}>
                        <option value="4GB">4GB</option>
                        <option value="8GB">8GB</option>
                        <option value="16GB">16GB</option>
                        <option value="32GB+">32GB+</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Storage</label>
                      <select className="form-select" value={formData.storage} onChange={e => handleInputChange('storage', e.target.value)}>
                        <option value="256GB SSD">256GB SSD</option>
                        <option value="512GB SSD">512GB SSD</option>
                        <option value="1TB SSD">1TB SSD</option>
                        <option value="1TB HDD">1TB HDD</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Physical Condition *</label>
                    <select className="form-select" value={formData.condition} onChange={e => handleInputChange('condition', e.target.value)}>
                      <option value="Excellent">Excellent - Flawless, zero scratches, works 100%</option>
                      <option value="Good">Good - Minor scratches, fully functional</option>
                      <option value="Average">Average - Scratches/dents, battery low</option>
                      <option value="Damaged">Damaged - Cracked screen, keyboard issue or dead</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Accessories Included</label>
                    <div className="custom-check-grid">
                      {['Charger', 'Original Box', 'Bill / Invoice', 'Laptop Bag'].map(acc => (
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

                  <div className="form-group">
                    <label className="form-label">Pickup Address *</label>
                    <textarea required rows={2} className="form-textarea" placeholder="Full street address for doorstep pickup" value={formData.address} onChange={e => handleInputChange('address', e.target.value)}></textarea>
                  </div>

                  <button type="submit" className="btn btn-gold" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>
                    Submit For Instant Valuation & Pickup <ArrowRight size={18} />
                  </button>
                </form>
              </div>

              {/* Condition Guide & Pricing Factors */}
              <div>
                <div className="card-dark" style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--accent-gold)' }}>Laptop Condition Guide</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[
                      { grade: 'Excellent', color: '#10b981', desc: 'No body scratches, screen crystal clear, battery backup > 2 hours, original charger available.' },
                      { grade: 'Good', color: '#3b82f6', desc: 'Light body wear/scratches, fully functional keyboard, trackpad and screen without dead pixels.' },
                      { grade: 'Average', color: '#f59e0b', desc: 'Noticeable dents/scratches, battery needs charger plugged in, minor body scuffs.' },
                      { grade: 'Damaged', color: '#ef4444', desc: 'Cracked screen, display vertical lines, missing keys, or dead motherboard.' }
                    ].map(g => (
                      <div key={g.grade} style={{ borderLeft: `3px solid ${g.color}`, paddingLeft: '0.85rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: g.color }}>{g.grade} Condition</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{g.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-dark">
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--accent-cyan)' }}>Key Price Factors</h3>
                  <ul style={{ color: 'var(--text-muted)', fontSize: '0.9rem', paddingLeft: '1.2rem', lineHeight: 1.8 }}>
                    <li><strong>Brand & Model:</strong> Premium series (XPS, ThinkPad, ROG) command higher resale rates.</li>
                    <li><strong>Processor & Generation:</strong> Newer Intel/Ryzen generations yield 25-40% higher valuation.</li>
                    <li><strong>Storage Type:</strong> High-speed NVMe SSDs add extra value over traditional HDDs.</li>
                    <li><strong>Original Invoice & Charger:</strong> Having original charger and bill increases payout quote.</li>
                  </ul>
                </div>
              </div>

            </div>
          )}
        </div>
      </section>
    </div>
  );
};
