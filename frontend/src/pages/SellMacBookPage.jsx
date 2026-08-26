import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Apple, ShieldCheck, CheckCircle2, Calculator, ArrowRight } from 'lucide-react';
import { CITIES } from '../data/portalData';

export const SellMacBookPage = () => {
  const { createBuybackRequest, currentUser, setAuthModalOpen } = usePortal();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
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

  const [submitted, setSubmitted] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    const req = createBuybackRequest({ ...formData, deviceType: 'MacBook' });
    setSubmitted(req);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

      {/* MacBook Models Bar */}
      <section style={{ padding: '2.5rem 0', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Supported Apple MacBook Models</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
            {['MacBook Air M1', 'MacBook Air M2/M3', 'MacBook Pro 13"', 'MacBook Pro 14"', 'MacBook Pro 16"', 'Intel MacBook Air', 'Intel MacBook Pro'].map(m => (
              <div key={m} className="card-dark" style={{ textAlign: 'center', padding: '0.85rem', fontSize: '0.88rem', fontWeight: 600 }}>
                {m}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-pitch)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          {submitted ? (
            <div className="card-dark" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <CheckCircle2 size={36} />
              </div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>MacBook Pickup Confirmed!</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Request ID: <strong style={{ color: 'var(--accent-gold)' }}>{submitted.id}</strong> • Estimated Value: <strong style={{ color: 'var(--accent-emerald)' }}>₹{submitted.estimatedPrice.toLocaleString()}</strong>
              </p>
              <button className="btn btn-gold" onClick={() => setSubmitted(null)}>
                Submit Another Request
              </button>
            </div>
          ) : (
            <div className="card-dark">
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Apple size={22} /> Apple MacBook Buyback Quote Form
              </h3>

              <form onSubmit={handleSubmit}>
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

                <div className="form-group">
                  <label className="form-label">Pickup Address *</label>
                  <textarea required rows={2} className="form-textarea" placeholder="Full street address for doorstep pickup" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}></textarea>
                </div>

                <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: '1rem' }}>
                  Get Apple MacBook Cash Quote <ArrowRight size={18} />
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
