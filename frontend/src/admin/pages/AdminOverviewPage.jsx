import React from 'react';
import { useAdmin } from '../AdminContext';
import { 
  Package, Users, DollarSign, CheckCircle2, Clock, MapPin, Laptop, 
  ArrowRight, ShieldCheck, TrendingUp, Sparkles, Building2, UserPlus, Eye
} from 'lucide-react';
import { CITIES, CATEGORIES } from '../../data/portalData';

export const AdminOverviewPage = () => {
  const { orders, agents, setActiveTab, setSelectedStatus, setSelectedCategory, setSelectedLocation } = useAdmin();

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'New Request' || o.status === 'Agent Assigned' || o.status === 'Pickup Scheduled').length;
  const completedOrders = orders.filter(o => o.status === 'Completed').length;
  const totalValuation = orders.reduce((sum, o) => sum + (o.estimatedPrice || o.device?.expectedPrice || 0), 0);
  const activeAgents = agents.filter(a => a.status === 'Active' || a.status === 'On Duty').length;

  // Category counts
  const categoryCounts = {
    Laptop: orders.filter(o => (o.device?.type || '').toLowerCase().includes('laptop')).length,
    Desktop: orders.filter(o => (o.device?.type || '').toLowerCase().includes('desktop')).length,
    Monitor: orders.filter(o => (o.device?.type || '').toLowerCase().includes('monitor')).length,
    MacMini: orders.filter(o => (o.device?.type || '').toLowerCase().includes('mini')).length,
    MacBook: orders.filter(o => (o.device?.type || '').toLowerCase().includes('macbook')).length
  };

  return (
    <div style={{ padding: '2rem 0', background: 'var(--bg-pitch)', minHeight: 'calc(100vh - 80px)' }}>
      <div className="container">

        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>EXECUTIVE DASHBOARD</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Operations & Fleet Overview
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Real-time statistics across buyback requests, active field agents, and completed doorstep payouts
          </p>
        </div>

        {/* 4 Main KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          
          {/* Total Orders */}
          <div 
            onClick={() => { setSelectedStatus('All'); setActiveTab('orders'); }}
            className="card-dark" 
            style={{ padding: '1.5rem', cursor: 'pointer', borderTop: '4px solid var(--accent-gold)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Buyback Orders</span>
              <Package size={20} color="var(--accent-gold)" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)' }}>{totalOrders}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', marginTop: '0.25rem', fontWeight: 600 }}>
              {pendingOrders} Pending Pickups →
            </div>
          </div>

          {/* Total Payout Volume */}
          <div className="card-dark" style={{ padding: '1.5rem', borderTop: '4px solid var(--accent-emerald)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Valuation Volume</span>
              <TrendingUp size={20} color="var(--accent-emerald)" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
              ₹{(totalValuation / 100000).toFixed(2)}L
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Avg. ₹{Math.round(totalValuation / (totalOrders || 1)).toLocaleString()} / order
            </div>
          </div>

          {/* Active Agents */}
          <div 
            onClick={() => setActiveTab('agents')}
            className="card-dark" 
            style={{ padding: '1.5rem', cursor: 'pointer', borderTop: '4px solid var(--accent-cyan)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Field Technicians Fleet</span>
              <Users size={20} color="var(--accent-cyan)" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)' }}>{agents.length}</div>
            <div style={{ fontSize: '0.78rem', color: '#10b981', marginTop: '0.25rem', fontWeight: 600 }}>
              {activeAgents} Active on duty →
            </div>
          </div>

          {/* Completed Payouts */}
          <div className="card-dark" style={{ padding: '1.5rem', borderTop: '4px solid #3b82f6' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Completed Inspections</span>
              <CheckCircle2 size={20} color="#3b82f6" />
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)' }}>{completedOrders}</div>
            <div style={{ fontSize: '0.78rem', color: '#3b82f6', marginTop: '0.25rem' }}>
              100% Instant Bank Settlement
            </div>
          </div>

        </div>

        {/* Category Distribution Grid */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Buyback Volume by Category
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'Laptops (Windows)', key: 'Laptop', count: categoryCounts.Laptop, color: 'var(--accent-gold)' },
              { label: 'Desktop PCs & Rigs', key: 'Desktop', count: categoryCounts.Desktop, color: 'var(--accent-cyan)' },
              { label: 'Monitors & Displays', key: 'Monitor', count: categoryCounts.Monitor, color: 'var(--accent-gold)' },
              { label: 'Apple Mac Mini', key: 'MacMini', count: categoryCounts.MacMini, color: 'var(--accent-cyan)' },
              { label: 'Apple MacBooks', key: 'MacBook', count: categoryCounts.MacBook, color: 'var(--accent-gold)' }
            ].map(cat => (
              <div 
                key={cat.key}
                onClick={() => {
                  setSelectedCategory(cat.key);
                  setActiveTab('orders');
                }}
                className="card-dark"
                style={{ padding: '1.25rem', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.15s ease' }}
              >
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>{cat.label}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: cat.color, margin: '0.35rem 0' }}>{cat.count}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>View Orders →</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="card-dark" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Recent Buyback Orders Feed
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Latest customer submissions from across India</p>
            </div>

            <button
              onClick={() => setActiveTab('orders')}
              className="btn btn-gold"
              style={{ padding: '0.5rem 1rem', fontSize: '0.84rem' }}
            >
              Open Full Orders Table <ArrowRight size={15} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {orders.slice(0, 5).map(o => (
              <div
                key={o.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  flexWrap: 'wrap',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ fontWeight: 800, color: 'var(--accent-gold)', fontSize: '0.9rem' }}>
                    {o.id}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                      {o.customer?.name} ({o.customer?.city})
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      {o.device?.brand} {o.device?.model || o.device?.type} • {o.device?.processor}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, color: 'var(--accent-emerald)', fontSize: '0.95rem' }}>
                      ₹{(o.estimatedPrice || o.device?.expectedPrice || 0).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      Agent: {o.assignedAgentName || 'Unassigned'}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className="btn btn-outline"
                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.76rem' }}
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
