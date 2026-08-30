import React from 'react';
import { useAdmin } from '../AdminContext';
import { Laptop, Package, Users, BarChart3, LogOut, ExternalLink, ShieldCheck, Sun, Moon, CheckCircle2, AlertCircle } from 'lucide-react';

export const AdminHeader = () => {
  const { adminUser, logout, activeTab, setActiveTab, orders, agents, flashMessage, theme, toggleTheme } = useAdmin();

  const isFieldAgent = adminUser?.role === 'FIELD_AGENT';

  const pendingOrdersCount = orders.filter(o => o.status === 'New Request' || o.status === 'Agent Assigned' || o.status === 'Pickup Scheduled').length;
  const myAssignedOrdersCount = orders.filter(o => o.assignedAgentId === adminUser?.agentId && o.status !== 'Completed' && o.status !== 'Cancelled').length;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      background: 'var(--header-bg)',
      borderBottom: '1px solid var(--border-subtle)',
      transition: 'background-color 0.3s ease'
    }}>
      {/* Top Banner Flash Message */}
      {flashMessage && (
        <div style={{
          background: flashMessage.type === 'error' ? 'rgba(239, 68, 68, 0.92)' : 'rgba(16, 185, 129, 0.92)',
          color: '#ffffff',
          padding: '0.45rem 1rem',
          fontSize: '0.84rem',
          fontWeight: 600,
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          {flashMessage.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{flashMessage.text}</span>
        </div>
      )}

      {/* Main Admin Navbar */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
        
        {/* Brand Logo & Role Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--btn-primary-bg)',
            color: 'var(--btn-primary-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-card)'
          }}>
            <Laptop size={20} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                TheCash<span style={{ color: 'var(--accent-gold)' }}>X</span>
              </span>
              <span className={`badge ${isFieldAgent ? 'badge-cyan' : 'badge-gold'}`} style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem', letterSpacing: '0.06em' }}>
                {isFieldAgent ? 'FIELD AGENT' : 'ADMIN HUB'}
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {isFieldAgent 
                ? `${adminUser?.city || 'Bangalore'} Hub • On-Site Inspections` 
                : 'Operations & Field Fleet Control'}
            </div>
          </div>
        </div>

        {/* Center Tabs Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: theme === 'light' ? '#e2e8f0' : 'var(--bg-secondary)',
          padding: '0.3rem',
          borderRadius: '12px',
          border: theme === 'light' ? '1px solid #cbd5e1' : '1px solid var(--border-subtle)'
        }}>
          {isFieldAgent ? (
            /* Field Agent Tabs */
            <button
              onClick={() => setActiveTab('orders')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 1rem',
                borderRadius: '9px',
                border: 'none',
                fontSize: '0.86rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: theme === 'light' ? '#0f172a' : 'var(--accent-gold)',
                color: theme === 'light' ? '#ffffff' : '#000000',
                transition: 'all 0.2s ease'
              }}
            >
              <Package size={16} />
              <span>My Assigned Pickups</span>
              {myAssignedOrdersCount > 0 && (
                <span style={{
                  background: theme === 'light' ? 'rgba(255,255,255,0.25)' : '#000000',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '0.1rem 0.45rem',
                  borderRadius: '10px'
                }}>
                  {myAssignedOrdersCount}
                </span>
              )}
            </button>
          ) : (
            /* Super Admin Tabs */
            <>
              {/* Orders & Pickups Tab */}
              <button
                onClick={() => setActiveTab('orders')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '9px',
                  border: 'none',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: activeTab === 'orders' 
                    ? (theme === 'light' ? '#0f172a' : 'var(--accent-gold)') 
                    : 'transparent',
                  color: activeTab === 'orders' 
                    ? (theme === 'light' ? '#ffffff' : '#000000') 
                    : (theme === 'light' ? '#1e293b' : 'var(--text-muted)'),
                  transition: 'all 0.2s ease'
                }}
              >
                <Package size={16} color={activeTab === 'orders' ? (theme === 'light' ? '#ffffff' : '#000000') : (theme === 'light' ? '#334155' : 'currentColor')} />
                <span>Orders & Pickups</span>
                {pendingOrdersCount > 0 && (
                  <span style={{
                    background: activeTab === 'orders'
                      ? (theme === 'light' ? 'rgba(255,255,255,0.25)' : '#000000')
                      : (theme === 'light' ? '#cbd5e1' : 'var(--accent-gold)'),
                    color: activeTab === 'orders'
                      ? '#ffffff'
                      : (theme === 'light' ? '#0f172a' : '#000000'),
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '0.1rem 0.45rem',
                    borderRadius: '10px'
                  }}>
                    {pendingOrdersCount}
                  </span>
                )}
              </button>

              {/* Field Agents Tab */}
              <button
                onClick={() => setActiveTab('agents')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '9px',
                  border: 'none',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: activeTab === 'agents' 
                    ? (theme === 'light' ? '#0f172a' : 'var(--accent-gold)') 
                    : 'transparent',
                  color: activeTab === 'agents' 
                    ? (theme === 'light' ? '#ffffff' : '#000000') 
                    : (theme === 'light' ? '#1e293b' : 'var(--text-muted)'),
                  transition: 'all 0.2s ease'
                }}
              >
                <Users size={16} color={activeTab === 'agents' ? (theme === 'light' ? '#ffffff' : '#000000') : (theme === 'light' ? '#334155' : 'currentColor')} />
                <span>Field Agents</span>
                <span style={{
                  background: activeTab === 'agents' 
                    ? (theme === 'light' ? 'rgba(255,255,255,0.25)' : '#000000') 
                    : (theme === 'light' ? '#cbd5e1' : 'rgba(255,255,255,0.1)'),
                  color: activeTab === 'agents' 
                    ? '#ffffff' 
                    : (theme === 'light' ? '#0f172a' : 'var(--text-dim)'),
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '0.1rem 0.45rem',
                  borderRadius: '10px'
                }}>
                  {agents.length}
                </span>
              </button>

              {/* Overview Tab */}
              <button
                onClick={() => setActiveTab('overview')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '9px',
                  border: 'none',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: activeTab === 'overview' 
                    ? (theme === 'light' ? '#0f172a' : 'var(--accent-gold)') 
                    : 'transparent',
                  color: activeTab === 'overview' 
                    ? (theme === 'light' ? '#ffffff' : '#000000') 
                    : (theme === 'light' ? '#1e293b' : 'var(--text-muted)'),
                  transition: 'all 0.2s ease'
                }}
              >
                <BarChart3 size={16} color={activeTab === 'overview' ? (theme === 'light' ? '#ffffff' : '#000000') : (theme === 'light' ? '#334155' : 'currentColor')} />
                <span>Overview</span>
              </button>
            </>
          )}
        </div>

        {/* Right Side: User Profile & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Theme Switcher Button (Dark / White Mode) */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'Light / White' : 'Dark'} Mode`}
            title={`Switch to ${theme === 'dark' ? 'Light / White' : 'Dark'} Mode`}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: theme === 'light' ? '#ffffff' : 'var(--btn-outline-bg)',
              border: theme === 'light' ? '1px solid #cbd5e1' : '1px solid var(--border-subtle)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
          >
            {theme === 'dark' ? <Sun size={17} color="#f59e0b" /> : <Moon size={17} color="#0f172a" />}
          </button>

          {/* Link to Customer Webapp */}
          <a
            href="#/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{
              padding: '0.45rem 0.85rem',
              fontSize: '0.8rem',
              gap: '0.4rem',
              textDecoration: 'none',
              background: theme === 'light' ? '#ffffff' : undefined,
              borderColor: theme === 'light' ? '#cbd5e1' : undefined,
              color: theme === 'light' ? '#0f172a' : undefined
            }}
          >
            <ExternalLink size={14} /> View Site
          </a>

          {/* User Profile Chip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.35rem 0.75rem',
            background: theme === 'light' ? '#ffffff' : 'var(--bg-secondary)',
            borderRadius: '10px',
            border: theme === 'light' ? '1px solid #cbd5e1' : '1px solid var(--border-subtle)',
            boxShadow: theme === 'light' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: isFieldAgent ? 'var(--accent-cyan)' : (theme === 'light' ? '#0f172a' : 'var(--accent-gold)'),
              color: isFieldAgent ? '#ffffff' : (theme === 'light' ? '#ffffff' : '#000000'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.82rem'
            }}>
              {adminUser?.fullName?.charAt(0) || 'U'}
            </div>
            <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: theme === 'light' ? '#0f172a' : 'var(--text-main)' }}>
                {adminUser?.fullName || 'User'}
              </div>
              <div style={{ fontSize: '0.68rem', color: isFieldAgent ? '#0284c7' : (theme === 'light' ? '#047857' : '#10b981'), fontWeight: 600 }}>
                {isFieldAgent ? `● Field Agent (${adminUser?.city || 'Hub'})` : '● Active Super Admin'}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="btn btn-outline"
            style={{
              padding: '0.45rem 0.75rem',
              fontSize: '0.8rem',
              color: '#ef4444',
              borderColor: 'rgba(239, 68, 68, 0.3)',
              gap: '0.35rem'
            }}
            title="Logout"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>

      </div>
    </header>
  );
};
