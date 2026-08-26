import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Send, CheckCircle2, MessageSquare } from 'lucide-react';

export const ContactPage = () => {
  const { COMPANY_INFO } = usePortal();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ padding: '4.5rem 0 5rem', background: 'var(--bg-primary)', minHeight: '80vh', transition: 'background-color 0.3s ease' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 4vw, 2.75rem)', 
            fontWeight: 800, 
            letterSpacing: '-0.03em', 
            color: 'var(--text-main)', 
            marginBottom: '0.75rem',
            lineHeight: 1.15
          }}>
            Contact Us
          </h1>
          <p style={{ 
            color: 'var(--text-muted)', 
            fontSize: '1rem', 
            maxWidth: '520px', 
            margin: '0 auto' 
          }}>
            Have questions about selling your device or doorstep inspection? Send us a message and we'll reply right away.
          </p>
        </div>

        {/* Clean Contact Form */}
        <div className="card-dark" style={{ padding: '2.5rem 2rem', borderRadius: '24px', boxShadow: 'var(--shadow-card)' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <CheckCircle2 size={52} color="#34d399" style={{ margin: '0 auto 1.25rem' }} />
              <h3 style={{ fontSize: '1.45rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Message Received!</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Thank you, {form.name}. Our team will contact you within 1 business hour.</p>
              <button 
                className="btn btn-outline" 
                onClick={() => setSent(false)} 
                style={{ marginTop: '1.5rem', padding: '0.65rem 1.5rem', fontSize: '0.88rem' }}
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>Your Name *</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  placeholder="Enter your name" 
                  value={form.name} 
                  onChange={e => setForm({ ...form, name: e.target.value })} 
                />
              </div>

              <div className="grid-2" style={{ gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>Email Address *</label>
                  <input 
                    type="email" 
                    required 
                    className="form-input" 
                    placeholder="name@domain.com" 
                    value={form.email} 
                    onChange={e => setForm({ ...form, email: e.target.value })} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>Phone Number *</label>
                  <input 
                    type="tel" 
                    required 
                    className="form-input" 
                    placeholder="10-digit mobile" 
                    value={form.phone} 
                    onChange={e => setForm({ ...form, phone: e.target.value })} 
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>Message Details *</label>
                <textarea 
                  required 
                  rows={4} 
                  className="form-textarea" 
                  placeholder="How can we assist you?" 
                  value={form.message} 
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  style={{ resize: 'none', minHeight: '110px', maxHeight: '110px' }}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: '0.95rem', fontSize: '0.95rem', fontWeight: 700 }}>
                <Send size={18} /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
