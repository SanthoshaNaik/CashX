import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { CITIES, FAQS } from '../data/portalData';
import { MapPin, ShieldCheck, Truck, CreditCard, ChevronRight, Calculator, CheckCircle2 } from 'lucide-react';

export const CityPage = () => {
  const { currentRoute, setValuationModalOpen, createBuybackRequest, COMPANY_INFO } = usePortal();

  const cityId = currentRoute.replace('/city/', '').toLowerCase();
  const matchedCity = CITIES.find(c => c.id === cityId) || CITIES[0];

  const [form, setForm] = useState({
    name: '',
    phone: '',
    brand: 'Dell',
    condition: 'Good',
    address: ''
  });

  const [submitted, setSubmitted] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const req = createBuybackRequest({ ...form, city: matchedCity.name });
    setSubmitted(req);
  };

  return (
    <div>
      {/* Hero Banner */}
      <section style={{ padding: '4rem 0 3rem', background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'center', transition: 'background-color 0.3s ease' }}>
        <div className="container">
          <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
            <MapPin size={14} /> LOCAL DOORSTEP PICKUP HUB
          </span>
          <h1 style={{ fontSize: '2.6rem', marginBottom: '1rem' }}>
            Sell Used Laptop in <span className="text-gradient-gold">{matchedCity.name}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto', fontSize: '1.05rem' }}>
            Get instant cash for your used laptop, MacBook, or desktop in {matchedCity.name}. Enjoy free 2-hour doorstep pickup from our {matchedCity.hubs} local hubs across {matchedCity.name}.
          </p>
        </div>
      </section>

      {/* Local Quote Form & Info */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-pitch)' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: '3rem' }}>
            
            {/* Form */}
            <div className="card-dark">
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', color: 'var(--accent-gold)' }}>
                Get Instant {matchedCity.name} Valuation
              </h3>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <CheckCircle2 size={40} color="#34d399" style={{ marginBottom: '0.5rem' }} />
                  <h4 style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>Pickup Scheduled in {matchedCity.name}!</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Request ID: {submitted.id}. Our local agent in {matchedCity.name} will call you shortly.</p>
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
                      <label className="form-label">Laptop Brand</label>
                      <select className="form-select" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })}>
                        <option value="Apple">Apple MacBook</option>
                        <option value="Dell">Dell</option>
                        <option value="HP">HP</option>
                        <option value="Lenovo">Lenovo</option>
                        <option value="Asus">Asus</option>
                        <option value="Acer">Acer</option>
                      </select>
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
                    <label className="form-label">Pickup Address in {matchedCity.name} *</label>
                    <textarea required rows={2} className="form-textarea" placeholder={`Street address in ${matchedCity.name}`} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}></textarea>
                  </div>

                  <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: '0.9rem' }}>
                    Request Free {matchedCity.name} Doorstep Pickup <ChevronRight size={18} />
                  </button>
                </form>
              )}
            </div>

            {/* Local Hub Benefits */}
            <div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1.25rem' }}>Why Sell in {matchedCity.name}?</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="card-dark" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <Truck size={24} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>{matchedCity.hubs} Local Service Hubs</h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Our localized hubs across {matchedCity.name} ensure rapid 2-hour doorstep pickup.</p>
                  </div>
                </div>

                <div className="card-dark" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <CreditCard size={24} color="var(--accent-emerald)" style={{ flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>Instant Payment in {matchedCity.name}</h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Direct UPI / IMPS bank transfer on doorstep inspection before device collection.</p>
                  </div>
                </div>

                <div className="card-dark" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <ShieldCheck size={24} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>100% Certified Data Security</h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>DoD 5220.22-M military-grade data wiping right at your home or office in {matchedCity.name}.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
