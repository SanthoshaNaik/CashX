import React, { useState } from 'react';
import { useAdmin } from '../AdminContext';
import { 
  Package, Search, Filter, MapPin, Phone, MessageSquare, Laptop, Monitor, 
  Tv, Apple, CheckCircle2, Clock, AlertCircle, Calculator, ShieldCheck, 
  MapPinned, Calendar, ArrowRight, UserCheck, Sparkles, Check
} from 'lucide-react';
import { AgentInspectionModal } from '../components/AgentInspectionModal';

export const FieldAgentOrdersPage = () => {
  const { adminUser, orders, updateOrderStatus, theme } = useAdmin();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Inspection Modal State
  const [inspectingOrder, setInspectingOrder] = useState(null);

  // Field Agent Scoped Orders: Only orders assigned to this specific agent!
  const myAssignedOrders = orders.filter(o => o.assignedAgentId === adminUser?.agentId);

  // Filtered Orders
  const filteredOrders = myAssignedOrders.filter(order => {
    // Status filter
    if (statusFilter !== 'All') {
      if (order.status !== statusFilter) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const idMatch = (order.id || '').toLowerCase().includes(q);
      const nameMatch = (order.customer?.name || '').toLowerCase().includes(q);
      const phoneMatch = (order.customer?.phone || '').toLowerCase().includes(q);
      const brandMatch = (order.device?.brand || '').toLowerCase().includes(q);
      const modelMatch = (order.device?.model || '').toLowerCase().includes(q);
      const addressMatch = (order.customer?.address || '').toLowerCase().includes(q);

      if (!idMatch && !nameMatch && !phoneMatch && !brandMatch && !modelMatch && !addressMatch) {
        return false;
      }
    }

    return true;
  });

  const getCategoryIcon = (type = '') => {
    const t = type.toLowerCase();
    if (t.includes('macbook') || t.includes('apple')) return <Apple size={18} color="var(--accent-gold)" />;
    if (t.includes('desktop') || t.includes('rig') || t.includes('pc')) return <Monitor size={18} color="var(--accent-cyan)" />;
    if (t.includes('monitor') || t.includes('display')) return <Tv size={18} color="var(--accent-gold)" />;
    if (t.includes('mini')) return <Apple size={18} color="var(--accent-cyan)" />;
    return <Laptop size={18} color="var(--accent-gold)" />;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New Request':
      case 'Agent Assigned':
      case 'Assigned':
        return <span className="badge badge-cyan">👤 Assigned To You</span>;
      case 'Pickup Scheduled':
        return <span className="badge badge-cyan" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', borderColor: 'rgba(59, 130, 246, 0.3)' }}>🚚 Pickup Scheduled</span>;
      case 'Inspection in Progress':
        return <span className="badge badge-gold">⚡ Inspection in Progress</span>;
      case 'Completed':
        return <span className="badge badge-emerald">✓ Completed & Paid</span>;
      case 'Cancelled':
        return <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}>✕ Cancelled</span>;
      default:
        return <span className="badge badge-gold">{status}</span>;
    }
  };

  const activeCount = myAssignedOrders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length;
  const completedCount = myAssignedOrders.filter(o => o.status === 'Completed').length;
  const totalPayout = myAssignedOrders.filter(o => o.status === 'Completed').reduce((sum, o) => sum + (o.finalOfferPrice || o.estimatedPrice || 0), 0);

  return (
    <div style={{ padding: '2rem 0 4rem', background: 'var(--bg-pitch)', minHeight: 'calc(100vh - 80px)' }}>
      <div className="container">
        
        {/* Field Agent Welcome & Hub Banner */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '24px',
          border: '1px solid var(--border-subtle)',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span className="badge badge-gold" style={{ letterSpacing: '0.06em' }}>
                FIELD AGENT CONSOLE
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                ● Active On Duty
              </span>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              Welcome, {adminUser?.fullName || 'Field Agent'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Assigned Hub: <strong style={{ color: 'var(--text-main)' }}>{adminUser?.hub || 'Central Electronics Hub'}</strong> ({adminUser?.city || 'Bangalore'}) • Direct Mobile: {adminUser?.phone || '+91 98450 11223'}
            </p>
          </div>

          {/* Quick Metric Chips */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '0.85rem 1.25rem',
              textAlign: 'center',
              minWidth: '120px'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                {activeCount}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pending Pickups</div>
            </div>

            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '0.85rem 1.25rem',
              textAlign: 'center',
              minWidth: '120px'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                {completedCount}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Completed Deals</div>
            </div>

            <div style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '0.85rem 1.25rem',
              textAlign: 'center',
              minWidth: '130px'
            }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                ₹{totalPayout.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Settled</div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="card-dark" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.6rem', fontSize: '0.88rem' }}
                placeholder="Search your assigned orders (ID, Name, Phone, Device)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter Buttons */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {['All', 'Agent Assigned', 'Pickup Scheduled', 'Inspection in Progress', 'Completed'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className="btn btn-outline"
                  style={{
                    padding: '0.5rem 0.85rem',
                    fontSize: '0.78rem',
                    fontWeight: statusFilter === st ? 700 : 500,
                    background: statusFilter === st ? 'var(--btn-primary-bg)' : 'transparent',
                    color: statusFilter === st ? 'var(--btn-primary-text)' : 'var(--text-muted)',
                    borderColor: statusFilter === st ? 'transparent' : 'var(--border-subtle)'
                  }}
                >
                  {st}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Assigned Orders List */}
        {filteredOrders.length === 0 ? (
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
              No Assigned Pickups Found
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '460px', margin: '0 auto' }}>
              {myAssignedOrders.length === 0 
                ? "You have no orders currently assigned by the Operations Admin. Check back once a new client request is dispatched to your hub."
                : "No orders match your active filter criteria."}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
            {filteredOrders.map(order => {
              const customerPhone = order.customer?.phone ? order.customer.phone.replace(/[^0-9]/g, '') : '';
              const finalPrice = order.finalOfferPrice || order.estimatedPrice || order.device?.expectedPrice || 0;

              return (
                <div 
                  key={order.id}
                  className="card-dark"
                  style={{
                    padding: '1.75rem',
                    borderRadius: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1.25rem',
                    boxShadow: 'var(--shadow-card)',
                    border: '1px solid var(--border-subtle)',
                    transition: 'all 0.25s ease'
                  }}
                >
                  {/* Top Bar: Order ID, Category & Status */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: 'var(--bg-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {getCategoryIcon(order.device?.type)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                            {order.id}
                          </div>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            {order.date || 'Recent Request'}
                          </span>
                        </div>
                      </div>

                      <div>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>

                    {/* Customer Information Cardlet */}
                    <div style={{
                      background: 'var(--bg-secondary)',
                      borderRadius: '14px',
                      padding: '1rem',
                      marginBottom: '1rem',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                        {order.customer?.name}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                        <MapPin size={14} color="var(--accent-gold)" />
                        <span>{order.customer?.address || 'Doorstep Address'}, {order.customer?.city} - {order.customer?.pincode}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.75rem' }}>
                        {customerPhone && (
                          <>
                            <a
                              href={`tel:${customerPhone}`}
                              className="btn btn-outline"
                              style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem', gap: '0.35rem' }}
                            >
                              <Phone size={13} /> Call Customer
                            </a>
                            <a
                              href={`https://wa.me/${customerPhone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline"
                              style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem', gap: '0.35rem', color: 'var(--accent-emerald)' }}
                            >
                              <MessageSquare size={13} /> WhatsApp
                            </a>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Scheduled Slot & Dispatch Notes from Admin */}
                    {(order.timeSlot || order.scheduledDate || order.dispatchNotes) && (
                      <div style={{
                        background: 'rgba(59, 130, 246, 0.08)',
                        borderRadius: '12px',
                        padding: '0.75rem 1rem',
                        marginBottom: '1rem',
                        border: '1px solid rgba(59, 130, 246, 0.25)',
                        fontSize: '0.82rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#60a5fa', fontWeight: 700, marginBottom: '0.2rem' }}>
                          <Calendar size={14} />
                          <span>Scheduled Pickup: {order.scheduledDate || 'Today'} • {order.timeSlot || 'Doorstep Slot'}</span>
                        </div>
                        {order.dispatchNotes && (
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.25rem' }}>
                            <strong>Dispatch Instructions:</strong> {order.dispatchNotes}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Device Specs Summary */}
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                        {order.device?.brand} {order.device?.model || order.device?.type}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        <strong>Specs:</strong> {order.device?.processor} • {order.device?.ram} RAM • {order.device?.storage} • Condition: {order.device?.condition}
                      </div>
                      {order.remarks && (
                        <div style={{ fontSize: '0.76rem', color: 'var(--accent-gold)', marginTop: '0.35rem', fontStyle: 'italic' }}>
                          Note: "{order.remarks}"
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom: Price, Status Selector & Inspect Button */}
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                          {order.status === 'Completed' ? 'Final Settled Payout' : 'Agreed Valuation'}
                        </span>
                        <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                          ₹{finalPrice.toLocaleString('en-IN')}
                        </div>
                      </div>

                      {/* Quick Status Selector */}
                      <select
                        className="form-select"
                        style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.78rem' }}
                        value={order.status}
                        onChange={e => updateOrderStatus(order.id, e.target.value)}
                      >
                        <option value="Agent Assigned">Agent Assigned</option>
                        <option value="Pickup Scheduled">Pickup Scheduled</option>
                        <option value="Inspection in Progress">Inspection in Progress</option>
                        <option value="Completed">Completed & Paid</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    {/* Primary Button: Open On-Site Inspection & Valuation Recalculator */}
                    <button
                      onClick={() => setInspectingOrder(order)}
                      className="btn btn-gold"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        gap: '0.5rem',
                        justifyContent: 'center'
                      }}
                    >
                      <Calculator size={18} /> Inspect Device & Re-evaluate Quote
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Interactive Device Inspection & Live Valuation Modal */}
        <AgentInspectionModal 
          order={inspectingOrder}
          isOpen={!!inspectingOrder}
          onClose={() => setInspectingOrder(null)}
        />

      </div>
    </div>
  );
};
