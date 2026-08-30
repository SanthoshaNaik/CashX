import React, { useState, useEffect } from 'react';
import { useAdmin, calculateInspectionQuote } from '../AdminContext';
import { 
  X, CheckCircle2, AlertCircle, Calculator, ShieldCheck, Zap, Laptop, 
  Cpu, HardDrive, Battery, Tv, Check, FileText, ArrowRight, Banknote, RefreshCw
} from 'lucide-react';
import { BRANDS, CITIES } from '../../data/portalData';

export const AgentInspectionModal = ({ order, isOpen, onClose }) => {
  const { updateOrderInspection } = useAdmin();

  if (!isOpen || !order) return null;

  // Initialize state with the customer's submitted specifications and inspection if any
  const dev = order.device || {};
  const insp = order.inspection || {};

  const [specs, setSpecs] = useState({
    deviceType: dev.type || 'Laptop',
    brand: dev.brand || 'Dell',
    model: dev.model || '',
    processor: dev.processor || 'Intel Core i5',
    ram: dev.ram || '8GB',
    storage: dev.storage || '512GB SSD',
    condition: dev.condition || 'Good',
    age: dev.age || '1-2 Years'
  });

  const [diagnostics, setDiagnostics] = useState({
    screenCondition: insp.physical?.screenCondition || 'Flawless',
    batteryHealth: insp.hardware?.batteryHealth || 'Good (80-89%)',
    keyboardStatus: insp.hardware?.keyboardStatus || 'Working',
    portsStatus: insp.hardware?.portsStatus || 'Working',
    soundMicStatus: insp.hardware?.soundMicStatus || 'Working',
    wifiBluetooth: insp.hardware?.wifiBluetooth || 'Working',
    bodyCondition: insp.physical?.bodyCondition || 'Clean / Minor Scratches'
  });

  const [accessories, setAccessories] = useState(
    Array.isArray(dev.accessories) ? dev.accessories : ['Charger', 'Original Box']
  );

  const [remarks, setRemarks] = useState(order.remarks || '');
  const [selectedStatus, setSelectedStatus] = useState('Completed');
  const [customFinalPrice, setCustomFinalPrice] = useState(order.finalOfferPrice || order.estimatedPrice || 0);
  const [isManualPriceOverride, setIsManualPriceOverride] = useState(false);

  // Dynamic Live Quotation calculation
  const liveCalculatedPrice = calculateInspectionQuote({
    deviceType: specs.deviceType,
    brand: specs.brand,
    model: specs.model,
    processor: specs.processor,
    ram: specs.ram,
    storage: specs.storage,
    condition: specs.condition,
    age: specs.age,
    screenCondition: diagnostics.screenCondition,
    batteryHealth: diagnostics.batteryHealth,
    keyboardStatus: diagnostics.keyboardStatus,
    portsStatus: diagnostics.portsStatus,
    accessories: accessories
  });

  // Keep final offer price in sync with live calculation unless field agent explicitly typed a custom amount
  useEffect(() => {
    if (!isManualPriceOverride) {
      setCustomFinalPrice(liveCalculatedPrice);
    }
  }, [liveCalculatedPrice, isManualPriceOverride]);

  const handleSpecChange = (field, val) => {
    setSpecs(prev => ({ ...prev, [field]: val }));
  };

  const handleDiagChange = (field, val) => {
    setDiagnostics(prev => ({ ...prev, [field]: val }));
  };

  const toggleAccessory = (item) => {
    setAccessories(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleSaveInspection = (e) => {
    e.preventDefault();

    const inspectionReport = {
      physical: {
        screenCondition: diagnostics.screenCondition,
        bodyCondition: diagnostics.bodyCondition,
        scratches: diagnostics.screenCondition === 'Minor Scratches' ? 'Minor' : 'None',
        dents: diagnostics.bodyCondition.includes('Dents') ? 'Yes' : 'No'
      },
      hardware: {
        batteryHealth: diagnostics.batteryHealth,
        keyboardStatus: diagnostics.keyboardStatus,
        portsStatus: diagnostics.portsStatus,
        wifiBluetooth: diagnostics.wifiBluetooth,
        soundMicStatus: diagnostics.soundMicStatus
      },
      accessories: {
        charger: accessories.includes('Charger') || accessories.includes('Original Charger'),
        box: accessories.includes('Box') || accessories.includes('Original Box'),
        invoice: accessories.includes('Invoice') || accessories.includes('Original Bill'),
        warranty: accessories.includes('Warranty') || accessories.includes('Valid Warranty')
      }
    };

    updateOrderInspection(
      order.id,
      {
        ...specs,
        accessories: accessories
      },
      inspectionReport,
      Number(customFinalPrice) || liveCalculatedPrice,
      selectedStatus,
      remarks
    );

    onClose();
  };

  const customerExpected = order.device?.expectedPrice || order.estimatedPrice || 0;
  const priceDiff = (Number(customFinalPrice) || liveCalculatedPrice) - customerExpected;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
      overflowY: 'auto'
    }}>
      <div 
        className="card-dark"
        style={{
          width: '100%',
          maxWidth: '920px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '24px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          background: 'var(--bg-card)',
          padding: 0
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'var(--btn-primary-bg)',
              color: 'var(--btn-primary-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Calculator size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  On-Site Inspection & Quote Recalculation
                </h2>
                <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>
                  {order.id}
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Customer: <strong style={{ color: 'var(--text-main)' }}>{order.customer?.name}</strong> ({order.customer?.phone}) • {order.customer?.city}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '1.75rem', overflowY: 'auto', flex: 1 }}>
          <form onSubmit={handleSaveInspection} id="inspection-form">
            
            {/* Live Pricing Top Banner */}
            <div style={{
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-glow)',
              borderRadius: '18px',
              padding: '1.25rem 1.5rem',
              marginBottom: '1.75rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.25rem',
              alignItems: 'center'
            }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>
                  Customer Submitted Quote
                </span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  ₹{customerExpected.toLocaleString('en-IN')}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
                  ⚡ Live Inspection Valuation
                </span>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '0.2rem' }}>
                  ₹{liveCalculatedPrice.toLocaleString('en-IN')}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>
                  Valuation Difference
                </span>
                <div style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 700, 
                  color: priceDiff >= 0 ? '#10b981' : '#f43f5e',
                  marginTop: '0.2rem'
                }}>
                  {priceDiff >= 0 ? `+₹${priceDiff.toLocaleString('en-IN')}` : `-₹${Math.abs(priceDiff).toLocaleString('en-IN')}`}
                </div>
              </div>
            </div>

            {/* SECTION 1: PRODUCT SPECIFICATIONS VERIFICATION */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Cpu size={18} color="var(--accent-gold)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  1. Verify Core Hardware Specifications
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Device Type</label>
                  <select 
                    className="form-select" 
                    value={specs.deviceType} 
                    onChange={e => handleSpecChange('deviceType', e.target.value)}
                  >
                    <option value="Laptop">Laptop</option>
                    <option value="Desktop">Desktop PC / Rig</option>
                    <option value="Monitor">Monitor / Display</option>
                    <option value="Mac Mini">Apple Mac Mini</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Brand</label>
                  <select 
                    className="form-select" 
                    value={specs.brand} 
                    onChange={e => handleSpecChange('brand', e.target.value)}
                  >
                    {BRANDS.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Model / Series</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={specs.model} 
                    onChange={e => handleSpecChange('model', e.target.value)} 
                    placeholder="e.g. XPS 15, MacBook Pro M1"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Processor / Chip</label>
                  <select 
                    className="form-select" 
                    value={specs.processor} 
                    onChange={e => handleSpecChange('processor', e.target.value)}
                  >
                    <option value="Intel Core i3 / Ryzen 3">Intel Core i3 / Ryzen 3</option>
                    <option value="Intel Core i5 / Ryzen 5">Intel Core i5 / Ryzen 5</option>
                    <option value="Intel Core i7 / Ryzen 7">Intel Core i7 / Ryzen 7</option>
                    <option value="Intel Core i9 / Ryzen 9">Intel Core i9 / Ryzen 9</option>
                    <option value="Apple M1 / M2">Apple M1 / M2</option>
                    <option value="Apple M1 Pro / M2 Pro / M3">Apple M1 Pro / M2 Pro / M3</option>
                    <option value="Apple M1 Max / M2 Max / M4">Apple M1 Max / M2 Max / M4</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Installed RAM</label>
                  <select 
                    className="form-select" 
                    value={specs.ram} 
                    onChange={e => handleSpecChange('ram', e.target.value)}
                  >
                    <option value="4GB">4GB</option>
                    <option value="8GB">8GB</option>
                    <option value="16GB">16GB (+₹4,000)</option>
                    <option value="24GB">24GB</option>
                    <option value="32GB">32GB (+₹9,000)</option>
                    <option value="64GB">64GB</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Primary Storage</label>
                  <select 
                    className="form-select" 
                    value={specs.storage} 
                    onChange={e => handleSpecChange('storage', e.target.value)}
                  >
                    <option value="256GB SSD">256GB SSD</option>
                    <option value="512GB SSD">512GB SSD</option>
                    <option value="1TB SSD">1TB NVMe SSD (+₹4,000)</option>
                    <option value="2TB SSD">2TB NVMe SSD</option>
                    <option value="1TB HDD + 256GB SSD">1TB HDD + 256GB SSD</option>
                    <option value="500GB HDD">500GB HDD</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Overall Age</label>
                  <select 
                    className="form-select" 
                    value={specs.age} 
                    onChange={e => handleSpecChange('age', e.target.value)}
                  >
                    <option value="Under 1 Year">Under 1 Year (High Payout +20%)</option>
                    <option value="1-2 Years">1-2 Years (Standard Value)</option>
                    <option value="2-4 Years">2-4 Years (-20%)</option>
                    <option value="Over 4 Years">Over 4 Years (-40%)</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Overall Condition</label>
                  <select 
                    className="form-select" 
                    value={specs.condition} 
                    onChange={e => handleSpecChange('condition', e.target.value)}
                  >
                    <option value="Excellent">Excellent / Like New (+10%)</option>
                    <option value="Good">Good / Normal Signs of Use</option>
                    <option value="Average">Average / Noticeable Wear (-15%)</option>
                    <option value="Damaged">Damaged / Non-Functional (-45%)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 2: PHYSICAL & DIAGNOSTIC INSPECTION CHECKS */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <ShieldCheck size={18} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  2. Field Diagnostic Checklist & Deductions
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                
                {/* Screen Condition */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Screen Condition</label>
                  <select 
                    className="form-select"
                    value={diagnostics.screenCondition}
                    onChange={e => handleDiagChange('screenCondition', e.target.value)}
                  >
                    <option value="Flawless">Flawless (No Scratches / No Lines)</option>
                    <option value="Minor Scratches">Minor Hairline Scratches (-₹1,200)</option>
                    <option value="Spots / Bleeding / Lines">Spots / Bleeding / Lines (-₹4,000)</option>
                    <option value="Cracked / Broken Glass">Cracked / Broken Glass (-₹7,500)</option>
                  </select>
                </div>

                {/* Battery Health */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Battery Health / Cycles</label>
                  <select 
                    className="form-select"
                    value={diagnostics.batteryHealth}
                    onChange={e => handleDiagChange('batteryHealth', e.target.value)}
                  >
                    <option value="Excellent (90-100%)">Excellent (90-100% Health)</option>
                    <option value="Good (80-89%)">Good (80-89% Health)</option>
                    <option value="Fair (70-79%)">Fair 70-79% (-₹1,500)</option>
                    <option value="Degraded / Service Recommended">Degraded / Service Recommended (-₹3,200)</option>
                    <option value="Not Holding Charge / Dead">Dead Battery / Plugged Only (-₹4,500)</option>
                  </select>
                </div>

                {/* Keyboard & Touchpad */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Keyboard & Touchpad</label>
                  <select 
                    className="form-select"
                    value={diagnostics.keyboardStatus}
                    onChange={e => handleDiagChange('keyboardStatus', e.target.value)}
                  >
                    <option value="Working">All Keys & Touchpad 100% Working</option>
                    <option value="Some Faulty Keys">Some Sticky / Non-Working Keys (-₹1,600)</option>
                  </select>
                </div>

                {/* Ports & Connectivity */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Ports & Wireless</label>
                  <select 
                    className="form-select"
                    value={diagnostics.portsStatus}
                    onChange={e => handleDiagChange('portsStatus', e.target.value)}
                  >
                    <option value="Working">All Ports, Wi-Fi & Bluetooth OK</option>
                    <option value="Issues / Not Working">Port / Wi-Fi Issue Detected (-₹1,200)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 3: INCLUDED ACCESSORIES */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Zap size={18} color="var(--accent-emerald)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  3. Verified Physical Accessories
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {[
                  { name: 'Charger', label: 'Original Power Charger (+₹1,000)' },
                  { name: 'Original Box', label: 'Original Brand Box (+₹600)' },
                  { name: 'Invoice', label: 'Original Purchase Invoice (+₹1,200)' },
                  { name: 'Warranty', label: 'Valid Brand Warranty (+₹1,800)' }
                ].map(acc => {
                  const isChecked = accessories.includes(acc.name);
                  return (
                    <button
                      type="button"
                      key={acc.name}
                      onClick={() => toggleAccessory(acc.name)}
                      style={{
                        padding: '0.55rem 1rem',
                        borderRadius: '10px',
                        border: isChecked ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                        background: isChecked ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-secondary)',
                        color: isChecked ? 'var(--accent-emerald)' : 'var(--text-muted)',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {isChecked ? <Check size={16} strokeWidth={3} /> : null}
                      {acc.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 4: FINAL SETTLEMENT & REMARKS */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '18px',
              padding: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem' }}>
                4. Final Payout & Status Confirmation
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                
                {/* Agreed Final Payout Input */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    Final Doorstep Payout Amount (₹) *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="number" 
                      className="form-input" 
                      style={{ 
                        fontSize: '1.2rem', 
                        fontWeight: 800, 
                        color: 'var(--accent-emerald)',
                        paddingLeft: '2rem'
                      }}
                      value={customFinalPrice} 
                      onChange={e => {
                        setIsManualPriceOverride(true);
                        setCustomFinalPrice(e.target.value);
                      }} 
                    />
                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-muted)' }}>
                      ₹
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                    Auto-calculated: ₹{liveCalculatedPrice.toLocaleString('en-IN')}. Type to override if negotiated.
                  </div>
                </div>

                {/* Status Selection */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    Update Order Status *
                  </label>
                  <select 
                    className="form-select"
                    value={selectedStatus}
                    onChange={e => setSelectedStatus(e.target.value)}
                  >
                    <option value="Completed">✓ Completed & Paid (Device Collected & UPI Transferred)</option>
                    <option value="Inspection in Progress">⚡ Inspection in Progress / Offer Made</option>
                    <option value="Pickup Scheduled">🚚 Reschedule / Keep Scheduled</option>
                    <option value="Cancelled">✕ Cancelled by Customer / Inspection Failed</option>
                  </select>
                </div>
              </div>

              {/* Inspection Notes & Remarks */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.82rem' }}>
                  Field Inspection Notes & Diagnostic Remarks
                </label>
                <textarea 
                  className="form-textarea" 
                  rows={2}
                  placeholder="e.g. Screen verified clean. Minor wear on palmrest. Original 65W charger included and tested. Payment transferred via UPI on spot."
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                />
              </div>
            </div>

          </form>
        </div>

        {/* Modal Footer Controls */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-secondary)',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Final Payout: <strong style={{ color: 'var(--accent-emerald)', fontSize: '1.1rem' }}>₹{Number(customFinalPrice).toLocaleString('en-IN')}</strong>
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}
            >
              Cancel
            </button>

            <button
              type="submit"
              form="inspection-form"
              className="btn btn-gold"
              style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem', gap: '0.45rem' }}
            >
              <CheckCircle2 size={18} /> Save & Finalize Order
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
