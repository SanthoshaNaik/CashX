import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { SERVICES } from '../data/portalData';
import { Laptop, ShieldCheck, Calculator, ArrowRight, X } from 'lucide-react';

export const ServicesPage = () => {
  const { setValuationModalOpen, COMPANY_INFO } = usePortal();
  const [selectedService, setSelectedService] = useState(null);

  return (
    <div>
      <section style={{ padding: '4rem 0 3rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <div className="container">
          <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>ENTERPRISE & CONSUMER IT SOLUTIONS</span>
          <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>Our <span className="text-gradient-gold">Services</span></h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto', fontSize: '1.05rem' }}>
            From single used laptops to 1000+ corporate IT asset disposition (ITAD) lots and DoD-grade data sanitization.
          </p>
        </div>
      </section>

      <section style={{ padding: '4rem 0', background: 'var(--bg-pitch)' }}>
        <div className="container">
          <div className="grid-3">
            {SERVICES.map((serv) => (
              <div key={serv.id} className="card-dark" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ color: 'var(--accent-gold)' }}>
                      <Laptop size={32} />
                    </div>
                    <span className="badge badge-gold">{serv.tag}</span>
                  </div>

                  <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>{serv.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {serv.fullDesc}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button 
                    className="btn btn-outline" 
                    onClick={() => setSelectedService(serv)}
                    style={{ flex: 1, padding: '0.6rem 0.8rem', fontSize: '0.85rem' }}
                  >
                    Read Details
                  </button>
                  <button 
                    className="btn btn-gold" 
                    onClick={() => setValuationModalOpen(true)}
                    style={{ flex: 1, padding: '0.6rem 0.8rem', fontSize: '0.85rem' }}
                  >
                    Get Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Details Popup Modal */}
      {selectedService && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 150, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card-dark" style={{ maxWidth: '550px', width: '100%', position: 'relative' }}>
            <button onClick={() => setSelectedService(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-muted)' }}>
              <X size={20} />
            </button>
            <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>{selectedService.tag}</span>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{selectedService.title}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              {selectedService.fullDesc}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {COMPANY_INFO.name} provides official GST invoicing, chain-of-custody handovers, and doorstep pickup.
            </p>
            <button className="btn btn-gold" style={{ width: '100%' }} onClick={() => { setSelectedService(null); setValuationModalOpen(true); }}>
              Request Quote For {selectedService.title} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
