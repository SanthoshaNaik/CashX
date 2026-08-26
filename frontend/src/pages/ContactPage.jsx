import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { Phone, Mail, MapPin, MessageSquare, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage = () => {
  const { COMPANY_INFO } = usePortal();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div>
      <section style={{ padding: '4rem 0 3rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <div className="container">
          <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>GET IN TOUCH</span>
          <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>Contact <span className="text-gradient-gold">{COMPANY_INFO.name}</span></h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto', fontSize: '1.05rem' }}>
            Have questions about doorstep pickup, corporate bulk valuation, or payment settlement? We are here to help!
          </p>
        </div>
      </section>

      <section style={{ padding: '4rem 0', background: 'var(--bg-pitch)' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: '3rem' }}>
            {/* Contact Info Cards */}
            <div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Corporate Office & Hubs</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                <div className="card-dark" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <MapPin size={24} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>Main Headquarters</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{COMPANY_INFO.address}</p>
                  </div>
                </div>

                <div className="card-dark" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Phone size={22} color="var(--accent-emerald)" style={{ flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>Phone Helpline</h4>
                    <a href={`tel:${COMPANY_INFO.phone}`} style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>{COMPANY_INFO.phone}</a>
                  </div>
                </div>

                <div className="card-dark" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <MessageSquare size={22} color="#25D366" style={{ flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>WhatsApp Support</h4>
                    <a href={`https://wa.me/${COMPANY_INFO.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" style={{ color: '#25D366', fontWeight: 600 }}>{COMPANY_INFO.whatsapp}</a>
                  </div>
                </div>

                <div className="card-dark" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Mail size={22} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>Email Inquiries</h4>
                    <a href={`mailto:${COMPANY_INFO.email}`} style={{ color: 'var(--accent-cyan)' }}>{COMPANY_INFO.email}</a>
                  </div>
                </div>

                <div className="card-dark" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <Clock size={22} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>Business Operating Hours</h4>
                    <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{COMPANY_INFO.workingHours}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="card-dark">
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: 'var(--accent-gold)' }}>Send Us a Message</h3>

              {sent ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <CheckCircle2 size={48} color="#34d399" style={{ marginBottom: '1rem' }} />
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Message Sent!</h3>
                  <p style={{ color: 'var(--text-muted)' }}>Thank you {form.name}. Our support team will get back to you within 1 business hour.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Your Name *</label>
                    <input type="text" required className="form-input" placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>

                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input type="email" required className="form-input" placeholder="name@domain.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input type="tel" required className="form-input" placeholder="10-digit mobile" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message / Inquiry Details *</label>
                    <textarea required rows={4} className="form-textarea" placeholder="How can we help you?" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}></textarea>
                  </div>

                  <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: '0.9rem' }}>
                    <Send size={18} /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Google Maps Frame */}
          <div style={{ marginTop: '4rem' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.25rem', textAlign: 'center' }}>Locate Our Store & Hub</h3>
            <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-subtle)', height: '350px' }}>
              <iframe
                title="Office Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.994273871953!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzE3LjciTiA3N8KwMzUnNDAuNiJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
