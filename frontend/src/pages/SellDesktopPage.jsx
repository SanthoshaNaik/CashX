import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Monitor, CheckCircle2, ArrowRight } from 'lucide-react';
import { CITIES } from '../data/portalData';

export const SellDesktopPage = () => {
  const { createBuybackRequest, currentUser, setAuthModalOpen } = usePortal();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
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

  const [submitted, setSubmitted] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    const req = createBuybackRequest({ ...formData, deviceType: 'Desktop' });
    setSubmitted(req);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

      {/* Categories */}
      <section style={{ padding: '2.5rem 0', background: 'var(--bg-pitch)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div className="grid-4">
            {[
              { title: 'Gaming PC', desc: 'Nvidia RTX / AMD Radeon Rigs' },
              { title: 'Office PC', desc: 'Bulk Brand PCs (Dell OptiPlex, HP)' },
              { title: 'Workstation', desc: 'Xeon / Threadripper Renders' },
              { title: 'Custom Build', desc: 'Individual PC Parts & Towers' }
            ].map(cat => (
              <div key={cat.title} className="card-dark" style={{ textAlign: 'center', padding: '1.25rem' }}>
                <Monitor size={28} color="var(--accent-cyan)" style={{ marginBottom: '0.5rem' }} />
                <h4 style={{ fontSize: '1.1rem' }}>{cat.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-primary)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          {submitted ? (
            <div className="card-dark" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <CheckCircle2 size={36} />
              </div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Desktop Pickup Scheduled!</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Request ID: <strong style={{ color: 'var(--accent-gold)' }}>{submitted.id}</strong> • Estimated Value: <strong style={{ color: 'var(--accent-emerald)' }}>₹{submitted.estimatedPrice.toLocaleString()}</strong>
              </p>
            </div>
          ) : (
            <div className="card-dark">
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--accent-cyan)' }}>
                Desktop & Component Buyback Form
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
                    <input type="text" className="form-input" placeholder="e.g. Ryzen 7 5800X, Core i7 12700K" value={formData.processor} onChange={e => setFormData({ ...formData, processor: e.target.value })} />
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

                <div className="form-group">
                  <label className="form-label">Pickup Address *</label>
                  <textarea required rows={2} className="form-textarea" placeholder="Full address for desktop pickup" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}></textarea>
                </div>

                <button type="submit" className="btn btn-cyan" style={{ width: '100%', padding: '1rem' }}>
                  Get Desktop Cash Quote <ArrowRight size={18} />
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
