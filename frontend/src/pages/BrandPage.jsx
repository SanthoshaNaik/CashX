import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { BRANDS } from '../data/portalData';
import { Laptop, Calculator, ChevronRight, CheckCircle2 } from 'lucide-react';

export const BrandPage = () => {
  const { currentRoute, createBuybackRequest, COMPANY_INFO } = usePortal();

  const brandId = currentRoute.replace('/brand/', '').toLowerCase();
  const matchedBrand = BRANDS.find(b => b.id === brandId) || BRANDS[0];

  const [form, setForm] = useState({
    name: '',
    phone: '',
    model: '',
    processor: 'Intel Core i5',
    ram: '8GB',
    condition: 'Good',
    address: ''
  });

  const [submitted, setSubmitted] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const req = createBuybackRequest({ ...form, brand: matchedBrand.name });
    setSubmitted(req);
  };

  return (
    <div>
      <section style={{ padding: '4rem 0 3rem', background: '#000000', borderBottom: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <div className="container">
          <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>OFFICIAL BRAND BUYBACK RATES</span>
          <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>
            Sell Used <span className="text-gradient-gold">{matchedBrand.name}</span> Laptop
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto', fontSize: '1.05rem' }}>
            Get maximum cash resale value for your used {matchedBrand.name} laptop with instant valuation and free doorstep pickup.
          </p>
        </div>
      </section>

      <section style={{ padding: '4rem 0', background: 'var(--bg-pitch)' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: '3rem' }}>
            <div className="card-dark">
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', color: 'var(--accent-gold)' }}>
                {matchedBrand.name} Valuation Form
              </h3>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <CheckCircle2 size={40} color="#34d399" style={{ marginBottom: '0.5rem' }} />
                  <h4 style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>{matchedBrand.name} Quote Submitted!</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Request ID: {submitted.id}. Estimated Price: ₹{submitted.estimatedPrice.toLocaleString()}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input type="text" required className="form-input" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mobile Number *</label>
                    <input type="tel" required className="form-input" placeholder="10-digit mobile" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">{matchedBrand.name} Model</label>
                      <input type="text" className="form-input" placeholder="Model name/number" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Condition</label>
                      <select className="form-select" value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })}>
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Average">Average</option>
                        <option value="Damaged">Damaged</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Pickup Address *</label>
                    <textarea required rows={2} className="form-textarea" placeholder="Full street address for pickup" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}></textarea>
                  </div>

                  <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: '0.9rem' }}>
                    Get Instant {matchedBrand.name} Cash Quote <ChevronRight size={18} />
                  </button>
                </form>
              )}
            </div>

            <div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1.25rem' }}>Supported {matchedBrand.name} Series</h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                We accept all models of {matchedBrand.name} in working or non-working state. Get transparent valuation based on original specifications and physical condition.
              </p>
              <div className="card-dark">
                <h4 style={{ fontSize: '1.1rem', color: 'var(--accent-gold)', marginBottom: '0.75rem' }}>Why Sell {matchedBrand.name} to {COMPANY_INFO.name}?</h4>
                <ul style={{ color: 'var(--text-muted)', fontSize: '0.9rem', paddingLeft: '1.2rem', lineHeight: 1.8 }}>
                  <li>Highest market benchmark quotes for {matchedBrand.name} series.</li>
                  <li>Free 2-hour doorstep pickup at your preferred location.</li>
                  <li>Instant payment before device collection.</li>
                  <li>100% certified DoD data wiping on SSD/HDD.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
