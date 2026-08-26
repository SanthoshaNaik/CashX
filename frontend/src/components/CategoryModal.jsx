import React from 'react';
import { usePortal } from '../context/PortalContext';
import { X } from 'lucide-react';
import { CategoryCards } from './CategoryCards';

export const CategoryModal = () => {
  const { categoryModalOpen, setCategoryModalOpen, navigate, currentUser } = usePortal();

  if (!categoryModalOpen) return null;

  const handleSelectCategory = (route) => {
    setCategoryModalOpen(false);
    if (!currentUser) {
      localStorage.setItem('cashx_redirect_after_login', route || '/sell-laptop');
      navigate('/login');
      return;
    }
    navigate(route);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 250,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setCategoryModalOpen(false);
      }}
    >
      <div 
        style={{
          background: 'var(--bg-secondary)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow-card-hover)',
          position: 'relative',
          padding: '2.25rem 1.75rem 2rem',
          transition: 'background-color 0.3s ease'
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setCategoryModalOpen(false)}
          aria-label="Close category modal"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            color: 'var(--text-muted)',
            padding: '0.5rem',
            background: 'var(--btn-outline-bg)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-main)';
            e.currentTarget.style.background = 'var(--btn-outline-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.background = 'var(--btn-outline-bg)';
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Title */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ 
            color: 'var(--text-muted)', 
            fontWeight: 600, 
            fontSize: '0.85rem', 
            textTransform: 'uppercase', 
            letterSpacing: '0.08em',
            display: 'block',
            marginBottom: '0.35rem'
          }}>
            Instant Valuation & Doorstep Pickup
          </span>
          <h2 style={{ 
            fontSize: 'clamp(1.75rem, 3.2vw, 2.35rem)', 
            fontWeight: 700, 
            letterSpacing: '-0.03em',
            color: 'var(--text-main)' 
          }}>
            Select Your Device Category
          </h2>
        </div>

        {/* 2 × 2 Category Cards */}
        <CategoryCards onSelect={(cat) => handleSelectCategory(cat.route)} />

      </div>
    </div>
  );
};
