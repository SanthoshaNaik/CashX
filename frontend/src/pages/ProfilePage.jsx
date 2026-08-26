import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  User, Package, MapPin, Phone, Calendar, Clock, CheckCircle2, 
  Truck, ArrowRight, ShieldCheck, LogOut, ChevronRight, Calculator, Laptop, AlertCircle
} from 'lucide-react';

export const ProfilePage = () => {
  const { currentUser, logout, navigate, requests, setCategoryModalOpen, COMPANY_INFO } = usePortal();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'tracking'
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);

  // If not logged in, show login prompt
  if (!currentUser) {
    return (
      <div style={{
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
        background: 'var(--bg-primary)'
      }}>
        <div 
          className="card-dark"
          style={{
            maxWidth: '440px',
            width: '100%',
            textAlign: 'center',
            padding: '2.5rem 2rem',
            borderRadius: '24px',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--bg-secondary)',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}>
            <User size={28} />
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
            Please Log In
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.75rem', lineHeight: 1.5 }}>
            Log in with your mobile number to view your buyback requests, track scheduled doorstep pickups, and manage your account.
          </p>
          <button 
            className="btn btn-gold" 
            onClick={() => navigate('/login')}
            style={{ width: '100%', padding: '0.85rem', fontWeight: 700, fontSize: '0.95rem' }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Filter or list orders
  const userOrders = requests && requests.length > 0 ? requests : [
    {
      id: 'CX-9821',
      device: {
        type: 'Laptop',
        brand: 'Apple',
        model: 'MacBook Pro 14 M1',
        processor: 'Apple M1 Pro',
        ram: '16GB',
        storage: '512GB SSD',
        condition: 'Good'
      },
      customer: {
        name: currentUser.fullName || 'Valued Customer',
        phone: currentUser.phone || COMPANY_INFO.phone,
        city: 'Bangalore',
        address: 'Indiranagar, 100ft Road'
      },
      status: 'Agent Assigned',
      date: new Date().toISOString().split('T')[0],
      estimatedPrice: 65000,
      assignedAgentName: 'Suresh Gowda',
      timeSlot: 'Today, 4:00 PM - 6:00 PM'
    }
  ];

  const currentOrder = userOrders[selectedOrderIndex] || userOrders[0];

  return (
    <div style={{
      minHeight: '85vh',
      padding: '3.5rem 0 5rem',
      background: 'var(--bg-pitch)',
      transition: 'background-color 0.3s ease'
    }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        
        {/* User Profile Header Card */}
        <div 
          className="card-dark"
          style={{
            borderRadius: '24px',
            padding: '1.75rem 2rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
            background: 'var(--bg-card)',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--btn-primary-bg)',
              color: 'var(--btn-primary-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              fontWeight: 800,
              boxShadow: 'var(--shadow-card)',
              flexShrink: 0
            }}>
              {currentUser.fullName ? currentUser.fullName[0].toUpperCase() : <User size={26} />}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                <h1 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  lineHeight: 1.2
                }}>
                  {currentUser.fullName || 'Valued Customer'}
                </h1>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.55rem',
                  borderRadius: '9999px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  Verified User
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {currentUser.phone ? `+91 ${currentUser.phone}` : ''} {currentUser.phone ? '• ' : ''}{userOrders.length} Buyback {userOrders.length === 1 ? 'Request' : 'Requests'} placed with TheCashX
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => setCategoryModalOpen(true)}
              className="btn btn-gold"
              style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem', fontWeight: 700 }}
            >
              <Calculator size={16} /> Sell Another Device
            </button>

            <button
              onClick={logout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.65rem 1rem',
                borderRadius: '12px',
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: '#ef4444',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.75rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.5rem'
        }}>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '10px',
              fontSize: '0.92rem',
              fontWeight: activeTab === 'orders' ? 700 : 500,
              background: activeTab === 'orders' ? 'var(--btn-primary-bg)' : 'transparent',
              color: activeTab === 'orders' ? 'var(--btn-primary-text)' : 'var(--text-muted)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Package size={17} /> My Orders ({userOrders.length})
          </button>

          <button
            onClick={() => setActiveTab('tracking')}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '10px',
              fontSize: '0.92rem',
              fontWeight: activeTab === 'tracking' ? 700 : 500,
              background: activeTab === 'tracking' ? 'var(--btn-primary-bg)' : 'transparent',
              color: activeTab === 'tracking' ? 'var(--btn-primary-text)' : 'var(--text-muted)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Truck size={17} /> Live Order Tracking
          </button>
        </div>

        {/* TAB 1: MY ORDERS LIST */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {userOrders.map((order, idx) => (
              <div
                key={order.id || idx}
                className="card-dark"
                style={{
                  borderRadius: '20px',
                  padding: '1.5rem 1.75rem',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-main)',
                    flexShrink: 0
                  }}>
                    <Laptop size={26} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                      <h3 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        color: 'var(--text-main)'
                      }}>
                        {order.device?.brand} {order.device?.model}
                      </h3>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '6px',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-muted)'
                      }}>
                        {order.id}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      {order.device?.processor} • {order.device?.ram} • {order.device?.storage} ({order.device?.condition} Condition)
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                      <span>📅 Date: {order.date}</span>
                      <span>📍 City: {order.customer?.city || 'Bangalore'}</span>
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  justifyContent: 'space-between',
                  width: 'auto'
                }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Valuation Quote
                    </div>
                    <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-heading)' }}>
                      ₹{order.estimatedPrice?.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedOrderIndex(idx);
                      setActiveTab('tracking');
                    }}
                    className="btn btn-outline"
                    style={{
                      padding: '0.65rem 1.15rem',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      borderRadius: '10px'
                    }}
                  >
                    <Truck size={15} /> Track Pickup <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: LIVE ORDER TRACKING STEPPER */}
        {activeTab === 'tracking' && (
          <div 
            className="card-dark"
            style={{
              borderRadius: '24px',
              padding: '2.5rem 2rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            {/* Tracking Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: '2.5rem'
            }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Live Pickup Status
                </span>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  Order {currentOrder.id}: {currentOrder.device?.brand} {currentOrder.device?.model}
                </h2>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated Payout</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                  ₹{currentOrder.estimatedPrice?.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* 4-Step Visual Progress Stepper */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem',
              position: 'relative'
            }}>
              {[
                {
                  stepNum: '01',
                  title: 'Request Submitted',
                  desc: 'Device specifications & valuation confirmed.',
                  status: 'completed',
                  time: 'Completed'
                },
                {
                  stepNum: '02',
                  title: 'Agent Assigned',
                  desc: 'Field verification agent assigned for doorstep pickup.',
                  status: 'completed',
                  time: 'Active'
                },
                {
                  stepNum: '03',
                  title: 'Doorstep Inspection',
                  desc: '5-minute hardware diagnostic check.',
                  status: 'current',
                  time: 'Scheduled'
                },
                {
                  stepNum: '04',
                  title: 'Instant Cash Payout',
                  desc: 'UPI/IMPS bank transfer before device handover.',
                  status: 'upcoming',
                  time: 'Pending'
                }
              ].map((item, idx) => {
                const isDone = item.status === 'completed';
                const isCurrent = item.status === 'current';

                return (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg-secondary)',
                      borderRadius: '16px',
                      padding: '1.35rem 1.25rem',
                      border: isCurrent 
                        ? '2px solid var(--accent-gold)' 
                        : isDone 
                          ? '1px solid rgba(16, 185, 129, 0.4)' 
                          : '1px solid var(--border-subtle)',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: isDone 
                          ? '#10b981' 
                          : isCurrent 
                            ? 'var(--accent-gold)' 
                            : 'var(--border-subtle)',
                        color: isDone || isCurrent ? '#000' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.85rem'
                      }}>
                        {isDone ? <CheckCircle2 size={18} color="#ffffff" /> : item.stepNum}
                      </div>

                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.45rem',
                        borderRadius: '9999px',
                        background: isDone ? 'rgba(16, 185, 129, 0.15)' : isCurrent ? 'var(--accent-gold-glow)' : 'transparent',
                        color: isDone ? '#10b981' : isCurrent ? 'var(--accent-gold)' : 'var(--text-dim)'
                      }}>
                        {item.time}
                      </span>
                    </div>

                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      marginBottom: '0.35rem'
                    }}>
                      {item.title}
                    </h4>

                    <p style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.45
                    }}>
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Field Agent & Pickup Schedule Details */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              background: 'var(--bg-secondary)',
              borderRadius: '18px',
              padding: '1.5rem 1.75rem',
              border: '1px solid var(--border-subtle)'
            }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Truck size={17} color="var(--accent-emerald)" /> Assigned Field Agent
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '0.25rem' }}>
                  {currentOrder.assignedAgentName || 'Suresh Gowda (Bangalore Hub)'}
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  Rating: ⭐ 4.9 (140+ Doorstep Inspections)
                </p>
                <a
                  href={`tel:${COMPANY_INFO.phone}`}
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'var(--accent-emerald)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Phone size={13} /> Call Field Support
                </a>
              </div>

              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={17} color="var(--accent-gold)" /> Pickup Details
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '0.2rem' }}>
                  Customer: {currentUser.fullName || currentOrder.customer?.name || 'Valued Customer'}
                </p>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                  {currentOrder.customer?.address || 'Indiranagar 100ft Road, Bangalore - 560038'}
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Slot: <strong style={{ color: 'var(--text-main)' }}>{currentOrder.timeSlot || 'Today, 4:00 PM - 6:00 PM'}</strong>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
