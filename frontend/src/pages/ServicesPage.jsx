import React from 'react';
import { CategoryCards } from '../components/CategoryCards';
import { usePortal } from '../context/PortalContext';

export const ServicesPage = () => {
  const { COMPANY_INFO } = usePortal();

  return (
    <div style={{ padding: '4.5rem 0 5rem', background: 'var(--bg-primary)', minHeight: '80vh', transition: 'background-color 0.3s ease' }}>
      <div className="container" style={{ maxWidth: '920px', textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: 'clamp(2rem, 4.5vw, 3rem)', 
          fontWeight: 800, 
          letterSpacing: '-0.03em', 
          color: 'var(--text-main)', 
          marginBottom: '0.85rem',
          lineHeight: 1.15
        }}>
          Select a Product Category
        </h1>
        <p style={{ 
          color: 'var(--text-muted)', 
          fontSize: 'clamp(1rem, 2vw, 1.15rem)', 
          marginBottom: '3rem', 
          maxWidth: '650px', 
          margin: '0 auto 3rem' 
        }}>
          Choose your device category below to get an instant real-time market valuation and book free doorstep pickup.
        </p>

        <CategoryCards />
      </div>
    </div>
  );
};
