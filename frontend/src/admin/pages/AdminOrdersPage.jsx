import React, { useState } from 'react';
import { useAdmin } from '../AdminContext';
import { 
  Package, Search, Filter, MapPin, Laptop, Monitor, Tv, Apple, UserCheck, 
  Clock, CheckCircle2, AlertCircle, X, ChevronDown, User, Phone, MapPinned, 
  ShieldCheck, ArrowRight, Eye, Calendar, Sparkles
} from 'lucide-react';
import { CITIES, CATEGORIES } from '../../data/portalData';

export const AdminOrdersPage = () => {
  const { 
    orders, 
    agents, 
    assignAgentToOrder, 
    updateOrderStatus,
    selectedLocation, 
    setSelectedLocation, 
    selectedCategory, 
    setSelectedCategory, 
    selectedStatus, 
    setSelectedStatus, 
    searchQuery, 
    setSearchQuery 
  } = useAdmin();

  // Modals state
  const [assignModalOrder, setAssignModalOrder] = useState(null);
  const [detailsModalOrder, setDetailsModalOrder] = useState(null);
  const [selectedAgentId, setSelectedAgentId] = useState('');

  // Filtered Orders Logic
  const filteredOrders = orders.filter(order => {
    // Location Filter
    if (selectedLocation !== 'All') {
      const orderCity = (order.customer?.city || '').toLowerCase();
      if (!orderCity.includes(selectedLocation.toLowerCase())) {
        return false;
      }
    }

    // Category Filter
    if (selectedCategory !== 'All') {
      const devType = (order.device?.type || '').toLowerCase();
      if (!devType.includes(selectedCategory.toLowerCase())) {
        return false;
      }
    }

    // Status Filter
    if (selectedStatus !== 'All') {
      if (order.status !== selectedStatus) {
        return false;
      }
    }

    // Search Query (ID, Name, Phone, Brand, Model)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const idMatch = (order.id || '').toLowerCase().includes(q);
      const nameMatch = (order.customer?.name || '').toLowerCase().includes(q);
      const phoneMatch = (order.customer?.phone || '').toLowerCase().includes(q);
      const brandMatch = (order.device?.brand || '').toLowerCase().includes(q);
      const modelMatch = (order.device?.model || '').toLowerCase().includes(q);
      const cityMatch = (order.customer?.city || '').toLowerCase().includes(q);

      if (!idMatch && !nameMatch && !phoneMatch && !brandMatch && !modelMatch && !cityMatch) {
        return false;
      }
    }

    return true;
  });

  const handleOpenAssignModal = (order) => {
    setAssignModalOrder(order);
    setSelectedAgentId(order.assignedAgentId || '');
  };

  const handleConfirmAssign = (e) => {
    e.preventDefault();
    if (assignModalOrder && selectedAgentId) {
      assignAgentToOrder(assignModalOrder.id, selectedAgentId);
      setAssignModalOrder(null);
    }
  };

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
        return <span className="badge badge-gold">⚡ New Request</span>;
      case 'Agent Assigned':
      case 'Assigned':
        return <span className="badge badge-cyan">👤 Agent Assigned</span>;
      case 'Pickup Scheduled':
        return <span className="badge badge-cyan" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', borderColor: 'rgba(59, 130, 246, 0.3)' }}>🚚 Pickup Scheduled</span>;
      case 'Completed':
        return <span className="badge badge-emerald">✓ Completed & Paid</span>;
      case 'Cancelled':
        return <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}>✕ Cancelled</span>;
      default:
        return <span className="badge badge-gold">{status}</span>;
    }
  };

  return (
    <div style={{ padding: '2rem 0', background: 'var(--bg-pitch)', minHeight: 'calc(100vh - 80px)' }}>
      <div className="container">
        
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>ALL CLIENT BUYBACK REQUESTS</span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Orders & Doorstep Pickups Management
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Showing {filteredOrders.length} of {orders.length} total orders across all categories and locations
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => {
                setSelectedLocation('All');
                setSelectedCategory('All');
                setSelectedStatus('All');
                setSearchQuery('');
              }}
              className="btn btn-outline"
              style={{ padding: '0.65rem 1rem', fontSize: '0.84rem' }}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Multi-Filter Bar Card */}
        <div className="card-dark" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            
            {/* Search Input */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                Search Order / Customer
              </label>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search ID, name, phone, model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '2.5rem', width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Location / City Filter */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                <MapPin size={14} style={{ display: 'inline', marginRight: '0.3rem' }} /> Filter by Location
              </label>
              <select
                className="form-select"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="All">All Locations & Hubs</option>
                {CITIES.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                <Laptop size={14} style={{ display: 'inline', marginRight: '0.3rem' }} /> Filter by Category
              </label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Device Categories</option>
                <option value="Laptop">Laptops (Windows)</option>
                <option value="Desktop">Desktop PCs & Gaming Rigs</option>
                <option value="Monitor">Monitors & Displays</option>
                <option value="MacMini">Apple Mac Mini</option>
                <option value="MacBook">Apple MacBooks</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                <Clock size={14} style={{ display: 'inline', marginRight: '0.3rem' }} /> Filter by Status
              </label>
              <select
                className="form-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="New Request">New Request (Unassigned)</option>
                <option value="Agent Assigned">Agent Assigned</option>
                <option value="Pickup Scheduled">Pickup Scheduled</option>
                <option value="Completed">Completed & Paid</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

          </div>
        </div>

        {/* Orders Table Container */}
        {filteredOrders.length === 0 ? (
          <div className="card-dark" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--text-muted)' }}>
              <Package size={28} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              No Orders Found Matching Filters
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Try resetting the location, category, or search query.
            </p>
            <button
              onClick={() => {
                setSelectedLocation('All');
                setSelectedCategory('All');
                setSelectedStatus('All');
                setSearchQuery('');
              }}
              className="btn btn-gold"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredOrders.map(order => (
              <div 
                key={order.id} 
                className="card-dark"
                style={{
                  padding: '1.5rem 1.75rem',
                  borderLeft: order.status === 'Completed' ? '4px solid var(--accent-emerald)' : order.status === 'New Request' ? '4px solid var(--accent-gold)' : '4px solid var(--accent-cyan)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  
                  {/* Order ID & Date */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      padding: '0.4rem 0.75rem',
                      borderRadius: '8px',
                      background: 'rgba(255,255,255,0.06)',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      color: 'var(--accent-gold)'
                    }}>
                      {order.id}
                    </div>
                    {getStatusBadge(order.status)}
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={13} /> {order.date || 'Recent'}
                    </span>
                  </div>

                  {/* Estimated Payout */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                      Estimated Payout Quote
                    </div>
                    <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                      ₹{(order.estimatedPrice || order.device?.expectedPrice || 0).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Grid Info: Customer, Device, Assigned Agent */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', padding: '1rem 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.88rem' }}>
                  
                  {/* Customer Block */}
                  <div>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                      Customer & Pickup Location
                    </span>
                    <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem', display: 'block' }}>
                      {order.customer?.name || 'Customer'}
                    </strong>
                    <div style={{ color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                      📞 {order.customer?.phone || 'N/A'}
                    </div>
                    <div style={{ color: 'var(--text-muted)', marginTop: '0.2rem', fontSize: '0.82rem' }}>
                      📍 <strong>{order.customer?.city}</strong> • {order.customer?.address || 'Doorstep Pickup'}
                    </div>
                  </div>

                  {/* Device Specs Block */}
                  <div>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                      Device Specifications
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)', fontWeight: 700 }}>
                      {getCategoryIcon(order.device?.type)}
                      <span>{order.device?.brand} {order.device?.model || order.device?.type}</span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.25rem' }}>
                      {order.device?.processor} • {order.device?.ram} • {order.device?.storage}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                      Condition: <span style={{ color: 'var(--accent-gold)' }}>{order.device?.condition || 'Good'}</span>
                      {order.device?.accessories?.length > 0 && ` • (${order.device.accessories.length} accessories)`}
                    </div>
                  </div>

                  {/* Assigned Agent Block */}
                  <div>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '0.3rem' }}>
                      Assigned Field Agent
                    </span>
                    {order.assignedAgentName && order.assignedAgentName !== 'Unassigned' ? (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                          <UserCheck size={16} />
                          <span>{order.assignedAgentName}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          📞 {order.assignedAgentPhone || (agents.find(a => a.id === order.assignedAgentId)?.phone) || 'Contact via Hub'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.15rem' }}>
                          🟢 Assigned to Doorstep Inspection
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.85rem' }}>
                          ⚠️ Unassigned Field Agent
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                          Requires local technician assignment
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* Bottom Actions Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  
                  {/* Status Lifecycle Dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>Update Status:</span>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: '8px',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-main)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.82rem',
                        fontWeight: 600
                      }}
                    >
                      <option value="New Request">New Request</option>
                      <option value="Agent Assigned">Agent Assigned</option>
                      <option value="Pickup Scheduled">Pickup Scheduled</option>
                      <option value="Completed">Completed & Paid</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <button
                      onClick={() => handleOpenAssignModal(order)}
                      className={order.assignedAgentName && order.assignedAgentName !== 'Unassigned' ? 'btn btn-outline' : 'btn btn-gold'}
                      style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
                    >
                      <UserCheck size={15} />
                      {order.assignedAgentName && order.assignedAgentName !== 'Unassigned' ? 'Reassign Agent' : 'Assign Field Agent'}
                    </button>

                    <button
                      onClick={() => setDetailsModalOrder(order)}
                      className="btn btn-outline"
                      style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
                    >
                      <Eye size={15} /> View Full Specs
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* ASSIGN FIELD AGENT MODAL */}
      {assignModalOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 200,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-glow)',
            borderRadius: '20px',
            padding: '2rem',
            width: '100%',
            maxWidth: '540px',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <button
              onClick={() => setAssignModalOrder(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                color: 'var(--text-muted)',
                borderRadius: '50%',
                padding: '0.4rem',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ marginBottom: '1.5rem' }}>
              <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>ORDER {assignModalOrder.id}</span>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                Assign Field Inspection Agent
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                Customer: <strong>{assignModalOrder.customer?.name}</strong> • City: <strong style={{ color: 'var(--accent-gold)' }}>{assignModalOrder.customer?.city}</strong>
              </p>
            </div>

            <form onSubmit={handleConfirmAssign}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  Select Field Agent from Fleet:
                </label>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '280px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                  {agents.map(agent => {
                    const isSameCity = (agent.city || '').toLowerCase() === (assignModalOrder.customer?.city || '').toLowerCase();
                    const isSelected = selectedAgentId === agent.id;

                    return (
                      <div
                        key={agent.id}
                        onClick={() => setSelectedAgentId(agent.id)}
                        style={{
                          padding: '0.85rem 1rem',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid var(--accent-gold)' : '1px solid var(--border-subtle)',
                          background: isSelected ? 'rgba(245, 158, 11, 0.12)' : 'var(--bg-secondary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: isSelected ? 'var(--accent-gold)' : 'rgba(255,255,255,0.08)',
                            color: isSelected ? '#000' : 'var(--text-main)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.88rem'
                          }}>
                            {agent.name[0]}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                              {agent.name}
                            </div>
                            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                              {agent.city} • {agent.hub}
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          {isSameCity && (
                            <span style={{ fontSize: '0.7rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '0.15rem 0.45rem', borderRadius: '6px', fontWeight: 700, display: 'inline-block', marginBottom: '0.2rem' }}>
                              📍 Same City Hub
                            </span>
                          )}
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                            ⭐ {agent.rating} • {agent.completedPickups} pickups
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setAssignModalOrder(null)}
                  className="btn btn-outline"
                  style={{ flex: 1, padding: '0.85rem', justifyContent: 'center' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedAgentId}
                  className="btn btn-gold"
                  style={{ flex: 2, padding: '0.85rem', justifyContent: 'center' }}
                >
                  Confirm Agent Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FULL ORDER DETAILS MODAL */}
      {detailsModalOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 200,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-glow)',
            borderRadius: '20px',
            padding: '2.25rem 2rem',
            width: '100%',
            maxWidth: '620px',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <button
              onClick={() => setDetailsModalOrder(null)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                color: 'var(--text-muted)',
                borderRadius: '50%',
                padding: '0.4rem',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ marginBottom: '1.5rem' }}>
              <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>
                FULL SPECIFICATION DOSSIER
              </span>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                Order #{detailsModalOrder.id} Details
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.4rem' }}>
                {getStatusBadge(detailsModalOrder.status)}
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Logged: {detailsModalOrder.date || 'Recent'}</span>
              </div>
            </div>

            {/* Valuation Offer Box */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid var(--border-glow)',
              borderRadius: '14px',
              padding: '1.25rem',
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Agreed Estimated Buyback Valuation
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '0.2rem' }}>
                ₹{(detailsModalOrder.estimatedPrice || detailsModalOrder.device?.expectedPrice || 0).toLocaleString()}
              </div>
            </div>

            {/* Customer Details */}
            <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '0.75rem' }}>
                Customer & Pickup Information
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.74rem' }}>Full Name</span>
                  <strong style={{ color: 'var(--text-main)' }}>{detailsModalOrder.customer?.name}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.74rem' }}>Phone Number</span>
                  <strong style={{ color: 'var(--text-main)' }}>{detailsModalOrder.customer?.phone}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.74rem' }}>Email Address</span>
                  <span style={{ color: 'var(--text-muted)' }}>{detailsModalOrder.customer?.email || 'Not provided'}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.74rem' }}>Pickup City</span>
                  <strong style={{ color: 'var(--text-main)' }}>{detailsModalOrder.customer?.city}</strong>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.74rem' }}>Full Address</span>
                  <span style={{ color: 'var(--text-main)' }}>{detailsModalOrder.customer?.address || 'Doorstep Pickup'}</span>
                </div>
              </div>
            </div>

            {/* Device Hardware Specs */}
            <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.75rem' }}>
                Hardware Specifications
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.74rem' }}>Category</span>
                  <strong style={{ color: 'var(--text-main)' }}>{detailsModalOrder.device?.type || 'Gadget'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.74rem' }}>Brand & Model</span>
                  <strong style={{ color: 'var(--text-main)' }}>{detailsModalOrder.device?.brand} {detailsModalOrder.device?.model}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.74rem' }}>Processor / Chip</span>
                  <span style={{ color: 'var(--text-main)' }}>{detailsModalOrder.device?.processor || 'Standard'}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.74rem' }}>RAM</span>
                  <span style={{ color: 'var(--text-main)' }}>{detailsModalOrder.device?.ram || 'Standard'}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.74rem' }}>Storage</span>
                  <span style={{ color: 'var(--text-main)' }}>{detailsModalOrder.device?.storage || 'Standard'}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.74rem' }}>Physical Condition</span>
                  <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>{detailsModalOrder.device?.condition || 'Good'}</span>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.74rem' }}>Included Accessories</span>
                  <span style={{ color: 'var(--text-main)' }}>
                    {detailsModalOrder.device?.accessories?.join(', ') || 'Standard Charger only'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setDetailsModalOrder(null)}
              className="btn btn-gold"
              style={{ width: '100%', padding: '0.85rem', justifyContent: 'center' }}
            >
              Close Dossier
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
