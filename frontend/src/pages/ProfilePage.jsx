import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  User, Package, MapPin, Phone, Calendar, Clock, CheckCircle2, 
  Truck, ArrowRight, ShieldCheck, LogOut, ChevronRight, Calculator, Laptop, 
  AlertCircle, Sparkles, Cpu, HardDrive, Battery, Tv, Check, FileText, XCircle, X
} from 'lucide-react';

export const ProfilePage = () => {
  const { currentUser, logout, navigate, requests, cancelBuybackRequest, setCategoryModalOpen, COMPANY_INFO } = usePortal();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'tracking'
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);

  // Cancellation Modal State
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('Changed my mind');
  const [customReasonText, setCustomReasonText] = useState('');

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
            Log in with your mobile number to view your buyback requests, track scheduled doorstep pickups in real time, and manage your account.
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

  // Filter user orders: matching phone/email if possible, or all active requests
  const matchingOrders = requests.filter(r => {
    if (!currentUser.phone && !currentUser.email) return true;
    const phoneMatch = currentUser.phone && r.customer?.phone && r.customer.phone.replace(/[^0-9]/g, '').includes(currentUser.phone.replace(/[^0-9]/g, ''));
    const emailMatch = currentUser.email && r.customer?.email && r.customer.email.toLowerCase() === currentUser.email.toLowerCase();
    return phoneMatch || emailMatch;
  });

  const userOrders = matchingOrders.length > 0 ? matchingOrders : requests;
  const currentOrder = userOrders[selectedOrderIndex] || userOrders[0] || null;

  // Dynamic Stepper generator based on live order status
  const getStepperSteps = (order) => {
    if (!order) return [];
    const status = order.status || 'New Request';
    const isCancelled = status === 'Cancelled';
    const isCompleted = status === 'Completed';
    const isInspecting = status === 'Inspection in Progress';
    const isScheduled = status === 'Pickup Scheduled';
    const isAssigned = Boolean(
      order.assignedAgentId && 
      order.assignedAgentName && 
      order.assignedAgentName !== 'Unassigned' && 
      (status === 'Agent Assigned' || isScheduled || isInspecting || isCompleted)
    );

    return [
      {
        stepNum: '01',
        title: 'Request Logged',
        desc: `Device: ${order.device?.brand || 'Gadget'} ${order.device?.model || ''}`,
        status: isCancelled ? 'completed' : 'completed',
        time: 'Logged'
      },
      {
        stepNum: '02',
        title: isCancelled ? 'Request Cancelled' : (isAssigned ? 'Agent Assigned' : 'Agent Assignment Pending'),
        desc: isCancelled 
          ? (order.remarks || 'Order cancelled by customer.')
          : (isAssigned ? `Technician: ${order.assignedAgentName}` : 'Operations team will review and assign a certified hub technician.'),
        status: isCancelled ? 'cancelled' : (isAssigned ? 'completed' : (status === 'New Request' ? 'current' : 'upcoming')),
        time: isCancelled ? 'Cancelled' : (isAssigned ? 'Assigned' : 'Pending')
      },
      {
        stepNum: '03',
        title: isCancelled ? 'Inspection Halted' : (isInspecting ? 'Diagnostic Running' : (isCompleted ? 'Inspection Completed' : 'Doorstep Inspection')),
        desc: isCancelled 
          ? 'Pickup has been cancelled.'
          : (isCompleted ? 'Physical & diagnostic verification completed.' : (isInspecting ? 'Agent conducting 10-point live diagnostic check.' : 'Doorstep hardware & screen diagnostic check.')),
        status: isCancelled ? 'cancelled' : (isCompleted ? 'completed' : (isInspecting || isScheduled ? 'current' : 'upcoming')),
        time: isCancelled ? 'Cancelled' : (isCompleted ? 'Verified' : (isInspecting ? 'In Progress' : (isScheduled ? 'Scheduled' : 'Upcoming')))
      },
      {
        stepNum: '04',
        title: isCancelled ? 'No Payout Due' : (isCompleted ? 'Payout Transferred' : 'Instant Cash Payout'),
        desc: isCancelled 
          ? 'Request is closed.'
          : (isCompleted ? `Settled Payout: ₹${(order.finalOfferPrice || order.estimatedPrice || 0).toLocaleString('en-IN')} via UPI/Bank.` : 'Instant UPI/IMPS bank transfer before device handover.'),
        status: isCancelled ? 'cancelled' : (isCompleted ? 'completed' : 'upcoming'),
        time: isCancelled ? '✕ Closed' : (isCompleted ? '✓ Paid' : 'Pending')
      }
    ];
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New Request':
        return <span className="badge badge-gold">⚡ Request Logged</span>;
      case 'Agent Assigned':
      case 'Assigned':
        return <span className="badge badge-cyan">👤 Agent Assigned</span>;
      case 'Pickup Scheduled':
        return <span className="badge badge-cyan" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', borderColor: 'rgba(59, 130, 246, 0.3)' }}>🚚 Pickup Scheduled</span>;
      case 'Inspection in Progress':
        return <span className="badge badge-gold">🔍 Inspection in Progress</span>;
      case 'Completed':
        return <span className="badge badge-emerald">✓ Completed & Paid</span>;
      case 'Cancelled':
        return <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}>✕ Cancelled</span>;
      default:
        return <span className="badge badge-gold">{status || 'Active'}</span>;
    }
  };

  const handleOpenCancelModal = (order) => {
    setCancelModalOrder(order);
    setCancelReason('Changed my mind');
    setCustomReasonText('');
  };

  const handleConfirmCancellation = (e) => {
    e.preventDefault();
    if (!cancelModalOrder) return;
    const finalReason = cancelReason === 'Other' ? (customReasonText.trim() || 'Cancelled by Customer') : cancelReason;
    cancelBuybackRequest(cancelModalOrder.id, finalReason);
    setCancelModalOrder(null);
  };

  const displayPrice = currentOrder
    ? (currentOrder.finalOfferPrice && currentOrder.finalOfferPrice > 0
        ? currentOrder.finalOfferPrice 
        : (currentOrder.estimatedPrice || currentOrder.device?.expectedPrice || 0))
    : 0;

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
          userOrders.length === 0 ? (
            <div className="card-dark" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                background: 'var(--bg-secondary)',
                color: 'var(--text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}>
                <Package size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                No Buyback Requests Yet
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
                You have not placed any device buyback requests yet. Sell your used laptop, desktop, monitor, or Mac Mini for instant doorstep valuation and payout.
              </p>
              <button
                onClick={() => setCategoryModalOpen(true)}
                className="btn btn-gold"
                style={{ padding: '0.75rem 1.5rem', fontWeight: 700 }}
              >
                <Calculator size={16} /> Get an Instant Valuation Quote
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {userOrders.map((order, idx) => {
                const itemPrice = order.finalOfferPrice && order.finalOfferPrice > 0
                  ? order.finalOfferPrice 
                  : (order.estimatedPrice || order.device?.expectedPrice || 0);

                const canCancel = order.status !== 'Completed' && order.status !== 'Cancelled';

                return (
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                          <h3 style={{
                            fontFamily: 'var(--font-heading)',
                            fontSize: '1.15rem',
                            fontWeight: 700,
                            color: 'var(--text-main)'
                          }}>
                            {order.device?.brand} {order.device?.model || order.device?.type}
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
                          {getStatusBadge(order.status)}
                        </div>

                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                          {order.device?.processor} • {order.device?.ram} RAM • {order.device?.storage} ({order.device?.condition} Condition)
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-dim)', flexWrap: 'wrap' }}>
                          <span>📅 Date: {order.date}</span>
                          <span>📍 City: {order.customer?.city || 'Bangalore'}</span>
                          {order.assignedAgentName && order.assignedAgentName !== 'Unassigned' && (
                            <span style={{ color: 'var(--accent-cyan)' }}>👤 Assigned: {order.assignedAgentName}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.25rem',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap'
                    }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {order.status === 'Completed' ? 'Settled Payout' : 'Live Valuation'}
                        </div>
                        <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-heading)' }}>
                          ₹{itemPrice.toLocaleString('en-IN')}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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

                        {/* Cancel Button */}
                        {canCancel && (
                          <button
                            onClick={() => handleOpenCancelModal(order)}
                            className="btn btn-outline"
                            style={{
                              padding: '0.65rem 0.95rem',
                              fontSize: '0.85rem',
                              color: '#ef4444',
                              borderColor: 'rgba(239, 68, 68, 0.3)',
                              borderRadius: '10px'
                            }}
                            title="Cancel this buyback request"
                          >
                            <XCircle size={15} /> Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* TAB 2: LIVE ORDER TRACKING STEPPER */}
        {activeTab === 'tracking' && (
          !currentOrder ? (
            <div className="card-dark" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                No Active Order to Track
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                You have not selected or submitted any buyback request yet.
              </p>
              <button
                onClick={() => setCategoryModalOpen(true)}
                className="btn btn-gold"
                style={{ padding: '0.75rem 1.5rem', fontWeight: 700 }}
              >
                <Calculator size={16} /> Sell a Device Now
              </button>
            </div>
          ) : (
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Live Pickup Status
                    </span>
                    {getStatusBadge(currentOrder.status)}
                  </div>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                    Order #{currentOrder.id}: {currentOrder.device?.brand} {currentOrder.device?.model || currentOrder.device?.type}
                  </h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {currentOrder.status === 'Completed' ? 'Final Settled Payout' : 'Live Valuation'}
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                      ₹{displayPrice.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Cancel Request button on Tracking view */}
                  {currentOrder.status !== 'Completed' && currentOrder.status !== 'Cancelled' && (
                    <button
                      onClick={() => handleOpenCancelModal(currentOrder)}
                      className="btn btn-outline"
                      style={{
                        padding: '0.55rem 0.95rem',
                        fontSize: '0.82rem',
                        color: '#ef4444',
                        borderColor: 'rgba(239, 68, 68, 0.3)',
                        borderRadius: '10px'
                      }}
                    >
                      <XCircle size={15} /> Cancel Request
                    </button>
                  )}
                </div>
              </div>

              {/* 4-Step Visual Progress Stepper */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2.5rem',
                position: 'relative'
              }}>
                {getStepperSteps(currentOrder).map((item, idx) => {
                  const isDone = item.status === 'completed';
                  const isCurrent = item.status === 'current';
                  const isCancelled = item.status === 'cancelled';

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
                            : isCancelled 
                              ? '1px solid rgba(239, 68, 68, 0.4)' 
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
                              : isCancelled 
                                ? '#ef4444' 
                                : 'var(--border-subtle)',
                          color: isDone || isCurrent || isCancelled ? '#ffffff' : 'var(--text-muted)',
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
                          background: isDone 
                            ? 'rgba(16, 185, 129, 0.15)' 
                            : isCurrent 
                              ? 'var(--accent-gold-glow)' 
                              : isCancelled 
                                ? 'rgba(239, 68, 68, 0.15)' 
                                : 'transparent',
                          color: isDone 
                            ? '#10b981' 
                            : isCurrent 
                              ? 'var(--accent-gold)' 
                              : isCancelled 
                                ? '#ef4444' 
                                : 'var(--text-dim)'
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

              {/* Field Agent Verified Specs & Diagnostic Report (If Inspected) */}
              {currentOrder.inspection && (
                <div style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--accent-emerald)',
                  borderRadius: '18px',
                  padding: '1.5rem 1.75rem',
                  marginBottom: '1.75rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ShieldCheck size={20} color="var(--accent-emerald)" />
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-emerald)', margin: 0 }}>
                        On-Site Field Diagnostic Report
                      </h4>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Inspected by: <strong style={{ color: 'var(--text-main)' }}>{currentOrder.inspectedByAgentName || currentOrder.assignedAgentName}</strong>
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
                    <div style={{ background: 'var(--bg-card)', padding: '0.75rem 1rem', borderRadius: '12px' }}>
                      <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.72rem' }}>Screen Condition</span>
                      <strong style={{ color: 'var(--text-main)' }}>{currentOrder.inspection.physical?.screenCondition || 'Checked'}</strong>
                    </div>
                    <div style={{ background: 'var(--bg-card)', padding: '0.75rem 1rem', borderRadius: '12px' }}>
                      <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.72rem' }}>Battery Health</span>
                      <strong style={{ color: 'var(--text-main)' }}>{currentOrder.inspection.hardware?.batteryHealth || 'Checked'}</strong>
                    </div>
                    <div style={{ background: 'var(--bg-card)', padding: '0.75rem 1rem', borderRadius: '12px' }}>
                      <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.72rem' }}>Keyboard / Touchpad</span>
                      <strong style={{ color: 'var(--text-main)' }}>{currentOrder.inspection.hardware?.keyboardStatus || 'Working'}</strong>
                    </div>
                    <div style={{ background: 'var(--bg-card)', padding: '0.75rem 1rem', borderRadius: '12px' }}>
                      <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.72rem' }}>Final Agreed Payout</span>
                      <strong style={{ color: 'var(--accent-emerald)', fontSize: '1.1rem' }}>
                        ₹{displayPrice.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>

                  {currentOrder.remarks && (
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-subtle)' }}>
                      Technician Notes: <em>"{currentOrder.remarks}"</em>
                    </div>
                  )}
                </div>
              )}

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
                  {currentOrder.assignedAgentName && currentOrder.assignedAgentName !== 'Unassigned' ? (
                    <>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '0.25rem' }}>
                        {currentOrder.assignedAgentName}
                      </p>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                        Rating: ⭐ 4.9 (Certified TheCashX Field Technician)
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
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: '0.88rem', color: 'var(--accent-gold)', fontWeight: 600, marginBottom: '0.25rem' }}>
                        Assignment in Progress
                      </p>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                        Admin operations will review your request and schedule a certified local technician shortly.
                      </p>
                    </>
                  )}
                </div>

                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={17} color="var(--accent-gold)" /> Pickup Details
                  </h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '0.2rem' }}>
                    Customer: {currentUser.fullName || currentOrder.customer?.name || 'Valued Customer'}
                  </p>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                    {currentOrder.customer?.address || 'Indiranagar 100ft Road, Bangalore - 560038'}, {currentOrder.customer?.city || 'Bangalore'}
                  </p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Slot: <strong style={{ color: currentOrder.timeSlot ? '#60a5fa' : 'var(--text-muted)' }}>{currentOrder.timeSlot || 'Pending Admin Scheduling'}</strong>
                  </p>
                </div>
              </div>
            </div>
          )
        )}

      </div>

      {/* USER CANCEL REQUEST MODAL */}
      {cancelModalOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div 
            className="card-dark"
            style={{
              width: '100%',
              maxWidth: '480px',
              borderRadius: '24px',
              padding: '2rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setCancelModalOrder(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <XCircle size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Cancel Buyback Request
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Order #{cancelModalOrder.id} ({cancelModalOrder.device?.brand} {cancelModalOrder.device?.model || cancelModalOrder.device?.type})
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Are you sure you want to cancel this buyback request? You can always create a new request or reschedule at any time.
            </p>

            <form onSubmit={handleConfirmCancellation}>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                  Reason for Cancellation
                </label>
                <select
                  className="form-select"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  style={{ fontSize: '0.88rem' }}
                >
                  <option value="Changed my mind">Changed my mind</option>
                  <option value="Found a better price offline">Found a better price offline</option>
                  <option value="Device is no longer available">Device is no longer available</option>
                  <option value="Want to reschedule at a later date">Want to reschedule at a later date</option>
                  <option value="Other">Other reason</option>
                </select>
              </div>

              {cancelReason === 'Other' && (
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Please specify reason</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Type your reason..."
                    value={customReasonText}
                    onChange={(e) => setCustomReasonText(e.target.value)}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setCancelModalOrder(null)}
                  className="btn btn-outline"
                  style={{ flex: 1, padding: '0.75rem', justifyContent: 'center' }}
                >
                  Keep Request
                </button>
                <button
                  type="submit"
                  className="btn"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    justifyContent: 'center',
                    background: '#ef4444',
                    color: '#ffffff',
                    fontWeight: 700
                  }}
                >
                  Yes, Cancel Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
