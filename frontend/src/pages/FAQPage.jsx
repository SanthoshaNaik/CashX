import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { FAQS } from '../data/portalData';
import { HelpCircle, ChevronDown, Search, Calculator } from 'lucide-react';

export const FAQPage = () => {
  const { setValuationModalOpen } = usePortal();
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState(0);

  const filteredFaqs = FAQS.filter(f => 
    f.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <section style={{ padding: '4rem 0 3rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <div className="container">
          <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>HELP & SUPPORT CENTER</span>
          <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>Frequently Asked <span className="text-gradient-gold">Questions</span></h1>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto 1.5rem', fontSize: '1.05rem' }}>
            Find clear answers regarding laptop valuation, free doorstep pickup, data wiping security, and instant payment settlement.
          </p>

          <div style={{ maxWidth: '500px', margin: '0 auto', position: 'relative' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search questions e.g. pickup, payment, data wiping..." 
              style={{ paddingLeft: '2.8rem' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section style={{ padding: '4rem 0', background: 'var(--bg-pitch)' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div key={idx} className="card-dark">
                    <div 
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}
                    >
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{faq.question}</h3>
                      <ChevronDown size={20} color="var(--accent-gold)" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }} />
                    </div>
                    {isOpen && (
                      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
                No matching questions found for "{searchTerm}".
              </div>
            )}
          </div>

          <div className="card-dark" style={{ marginTop: '3rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(8, 8, 10, 1) 100%)' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Still Have Questions?</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Our valuation specialists are available 7 days a week to guide you.</p>
            <button className="btn btn-gold" onClick={() => setValuationModalOpen(true)}>
              <Calculator size={18} /> Get Instant Quote
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
