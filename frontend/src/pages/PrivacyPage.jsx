import React from 'react';
import { usePortal } from '../context/PortalContext';

export const PrivacyPage = () => {
  const { COMPANY_INFO } = usePortal();

  return (
    <div style={{ padding: '4rem 0', background: 'var(--bg-pitch)' }}>
      <div className="container" style={{ maxWidth: '850px' }}>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Last Updated: July 2026 • {COMPANY_INFO.name}</p>

        <div className="card-dark" style={{ lineHeight: 1.7, color: 'var(--text-muted)' }}>
          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>1. Information Collection</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            We collect personal information such as your name, mobile number, email address, city, and physical pickup address solely for evaluating your laptop quote and executing free doorstep pickup.
          </p>

          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>2. Data Sanitization & Protection</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            Data privacy is our highest priority. All hard drives and SSDs collected undergo mandatory DoD 5220.22-M multi-pass data destruction to permanently erase all personal files, operating systems, and accounts.
          </p>

          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>3. Third-Party Sharing</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            {COMPANY_INFO.name} does not sell, rent, or lease your personal information to third parties. Contact info is strictly used by our assigned field agents for pickup logistics.
          </p>

          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>4. User Rights</h3>
          <p>
            You have the right to request deletion of your inquiry details from our system at any time by contacting support at {COMPANY_INFO.email}.
          </p>
        </div>
      </div>
    </div>
  );
};
