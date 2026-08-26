import React from 'react';
import { usePortal } from '../context/PortalContext';
import { Phone, MessageSquare, Calculator } from 'lucide-react';

export const FloatingActions = () => {
  const { setCategoryModalOpen, COMPANY_INFO } = usePortal();

  const cleanPhone = COMPANY_INFO.phone.replace(/[^0-9]/g, '');
  const cleanWhatsapp = COMPANY_INFO.whatsapp.replace(/[^0-9]/g, '');

  return (
    <div className="floating-actions-container">
      {/* Instant Quote Floating Button */}
      <button
        onClick={() => setCategoryModalOpen(true)}
        className="btn btn-gold shadow-glow-gold"
        style={{
          borderRadius: '9999px',
          padding: '0.75rem 1.25rem',
          fontSize: '0.85rem',
          fontWeight: 700
        }}
      >
        <Calculator size={18} /> Sell Device Now
      </button>

      {/* WhatsApp Action Button */}
      <a
        href={`https://wa.me/${cleanWhatsapp}?text=Hi%20${encodeURIComponent(COMPANY_INFO.name)},%20I%20want%20to%20sell%20my%20laptop`}
        target="_blank"
        rel="noreferrer"
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: '#25D366',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
          transition: 'transform 0.25s ease'
        }}
        title="Chat on WhatsApp"
      >
        <MessageSquare size={26} />
      </a>

      {/* Call Action Button */}
      <a
        href={`tel:${cleanPhone}`}
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: 'var(--bg-card)',
          border: '1px solid var(--accent-gold)',
          color: 'var(--accent-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-card)'
        }}
        title="Call Now"
      >
        <Phone size={20} />
      </a>
    </div>
  );
};
