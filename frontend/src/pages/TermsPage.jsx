import React from 'react';
import { usePortal } from '../context/PortalContext';

export const TermsPage = () => {
  const { COMPANY_INFO } = usePortal();

  return (
    <div style={{ padding: '4rem 0', background: 'var(--bg-pitch)' }}>
      <div className="container" style={{ maxWidth: '850px' }}>
        <h1 style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>Terms & Conditions</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Last Updated: July 2026 • {COMPANY_INFO.name}</p>

        <div className="card-dark" style={{ lineHeight: 1.7, color: 'var(--text-muted)' }}>
          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>1. Device Ownership</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            The customer certifies that they are the legal owner of the device being sold to {COMPANY_INFO.name}. Customers must present 1 valid government ID (Aadhaar, Driving License, Passport) upon doorstep pickup.
          </p>

          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>2. Valuation & Final Offer</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            Online quotes generated are estimated values based on user-provided inputs. The final binding offer is provided after a 5-minute physical and hardware diagnostic test by our certified field agent.
          </p>

          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>3. Instant Payment</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            Upon agreement on the final offer price, instant payment settlement is transferred via UPI, IMPS, or Cash before the agent leaves the customer premises.
          </p>

          <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.5rem' }}>4. Data Wiping Disclaimer</h3>
          <p>
            Once a device is collected and paid for, data wiping is executed immediately and permanently. Data cannot be recovered once sanitization commences.
          </p>
        </div>
      </div>
    </div>
  );
};
