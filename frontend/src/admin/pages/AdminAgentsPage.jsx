import React, { useState } from 'react';
import { useAdmin } from '../AdminContext';
import { 
  Users, UserPlus, Search, MapPin, Phone, Mail, Star, CheckCircle2, 
  AlertCircle, Edit3, Trash2, X, ShieldCheck, Laptop, Building2, Eye
} from 'lucide-react';
import { CITIES } from '../../data/portalData';

export const AdminAgentsPage = () => {
  const { agents, addAgent, updateAgent, deleteAgent, getAgentActiveOrders, orders, setActiveTab } = useAdmin();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('All');

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalAgent, setEditModalAgent] = useState(null);
  const [deleteModalAgent, setDeleteModalAgent] = useState(null);

  // Form State for Add / Edit
  const [agentForm, setAgentForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: 'agent123',
    city: 'Bangalore',
    hub: '',
    specialization: 'Laptops, MacBooks & Apple Silicon',
    status: 'Active'
  });

  const handleOpenAddModal = () => {
    setAgentForm({
      name: '',
      phone: '',
      email: '',
      password: 'agent123',
      city: 'Bangalore',
      hub: 'Bangalore - Central Electronics Hub',
      specialization: 'Laptops, MacBooks & Apple Silicon',
      status: 'Active'
    });
    setAddModalOpen(true);
  };

  const handleOpenEditModal = (agent) => {
    setEditModalAgent(agent);
    setAgentForm({
      name: agent.name,
      phone: agent.phone,
      email: agent.email,
      password: agent.password || 'agent123',
      city: agent.city,
      hub: agent.hub,
      specialization: agent.specialization,
      status: agent.status
    });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!agentForm.name.trim() || !agentForm.phone.trim()) return;
    addAgent(agentForm);
    setAddModalOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editModalAgent) return;
    updateAgent(editModalAgent.id, agentForm);
    setEditModalAgent(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteModalAgent) return;
    deleteAgent(deleteModalAgent.id);
    setDeleteModalAgent(null);
  };

  // Filtered Agents
  const filteredAgents = agents.filter(agent => {
    if (cityFilter !== 'All') {
      if (agent.city.toLowerCase() !== cityFilter.toLowerCase()) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = agent.name.toLowerCase().includes(q);
      const matchPhone = agent.phone.toLowerCase().includes(q);
      const matchEmail = agent.email.toLowerCase().includes(q);
      const matchCity = agent.city.toLowerCase().includes(q);
      const matchSpec = agent.specialization.toLowerCase().includes(q);

      if (!matchName && !matchPhone && !matchEmail && !matchCity && !matchSpec) {
        return false;
      }
    }

    return true;
  });

  // Calculate Metrics
  const totalCompleted = agents.reduce((acc, curr) => acc + (curr.completedPickups || 0), 0);
  const activeCount = agents.filter(a => a.status === 'Active' || a.status === 'On Duty').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <span className="badge badge-emerald">Active</span>;
      case 'On Duty':
        return <span className="badge badge-gold">On Duty</span>;
      case 'Inactive':
        return <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>Inactive</span>;
      default:
        return <span className="badge badge-gold">{status || 'Active'}</span>;
    }
  };

  return (
    <div style={{ padding: '2rem 0', background: 'var(--bg-pitch)', minHeight: 'calc(100vh - 80px)' }}>
      <div className="container">

        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>FIELD FLEET OPERATIONS</span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Field Inspection Agents Directory
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Add, update, monitor, and dispatch certified field technicians for on-site device evaluation
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="btn btn-gold"
            style={{ padding: '0.75rem 1.25rem', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <UserPlus size={18} /> Add New Field Agent
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="card-dark" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Fleet Agents</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>{agents.length}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)' }}>Across 7 Major Metros</div>
          </div>

          <div className="card-dark" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active / On Duty</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginTop: '0.25rem' }}>{activeCount}</div>
            <div style={{ fontSize: '0.75rem', color: '#10b981' }}>🟢 Ready for dispatch</div>
          </div>

          <div className="card-dark" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Completed Inspections</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '0.25rem' }}>{totalCompleted}+</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>Total Doorstep Payouts</div>
          </div>

          <div className="card-dark" style={{ padding: '1.25rem' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Fleet Average Rating</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-gold)', marginTop: '0.25rem' }}>4.86 ⭐</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Customer Feedback</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="card-dark" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            
            {/* Search */}
            <div className="form-group" style={{ margin: 0 }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search agent name, phone, hub..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '2.5rem', width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* City Hub Filter */}
            <div className="form-group" style={{ margin: 0 }}>
              <select
                className="form-select"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              >
                <option value="All">All City Hubs ({agents.length} Agents)</option>
                {CITIES.map(c => (
                  <option key={c.id} value={c.name}>{c.name} Hub</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Agents Grid */}
        {filteredAgents.length === 0 ? (
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
              <Users size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              No Field Agents In Fleet
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 1.5rem' }}>
              No field technicians currently added. Onboard technicians to manage doorstep diagnostic inspections and payouts.
            </p>
            <button
              onClick={handleOpenAddModal}
              className="btn btn-gold"
              style={{ padding: '0.75rem 1.5rem', fontWeight: 700 }}
            >
              <UserPlus size={16} /> Onboard New Field Agent
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filteredAgents.map(agent => {
              const activeOrders = getAgentActiveOrders(agent.id);

              return (
                <div
                  key={agent.id}
                  className="card-dark"
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    borderTop: agent.status === 'Active' ? '3px solid #10b981' : agent.status === 'On Duty' ? '3px solid var(--accent-gold)' : '3px solid #ef4444'
                  }}
                >
                  <div>
                    {/* Card Header: Avatar, Name & Status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '50%',
                          background: 'rgba(245, 158, 11, 0.15)',
                          color: 'var(--accent-gold)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '1.1rem',
                          border: '1px solid var(--border-glow)'
                        }}>
                          {agent.name ? agent.name[0] : 'A'}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.1rem' }}>
                            {agent.name}
                          </h3>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                            ID: {agent.id} • Joined {agent.joinedDate || '2024'}
                          </div>
                        </div>
                      </div>

                      {getStatusBadge(agent.status)}
                    </div>

                    {/* Hub & Specialization */}
                    <div style={{ background: 'var(--bg-secondary)', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1rem', border: '1px solid var(--border-subtle)', fontSize: '0.84rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '0.35rem' }}>
                        <MapPin size={14} color="var(--accent-gold)" />
                        <span>{agent.city} ({agent.hub || `${agent.city} Central Hub`})</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Expertise: <strong style={{ color: 'var(--text-main)' }}>{agent.specialization}</strong>
                      </div>
                    </div>

                    {/* Contact & Login Info */}
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem' }}>
                      <div>📞 <strong style={{ color: 'var(--text-main)' }}>{agent.phone}</strong></div>
                      <div>✉️ {agent.email}</div>
                      <div style={{ fontSize: '0.74rem', background: 'var(--bg-secondary)', padding: '0.25rem 0.5rem', borderRadius: '6px', border: '1px solid var(--border-subtle)', marginTop: '0.2rem' }}>
                        🔑 Password: <code style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>{agent.password || 'agent123'}</code>
                      </div>
                    </div>
                  </div>

                  <div>
                    {/* Metrics Bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderTop: '1px solid var(--border-subtle)', fontSize: '0.82rem', marginBottom: '1rem' }}>
                      <div>
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.74rem' }}>Rating</span>
                        <div style={{ fontWeight: 800, color: 'var(--accent-gold)' }}>⭐ {agent.rating || '4.9'}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.74rem' }}>Completed</span>
                        <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{agent.completedPickups || 0} pickups</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.74rem' }}>Active Tasks</span>
                        <div style={{ fontWeight: 800, color: activeOrders.length > 0 ? '#10b981' : 'var(--text-muted)' }}>
                          {activeOrders.length} active
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleOpenEditModal(agent)}
                        className="btn btn-outline"
                        style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', justifyContent: 'center' }}
                      >
                        <Edit3 size={14} /> Edit Details
                      </button>
                      <button
                        onClick={() => setDeleteModalAgent(agent)}
                        className="btn btn-outline"
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                        title="Remove Field Agent"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ADD FIELD AGENT MODAL */}
      {addModalOpen && (
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
            maxWidth: '520px',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <button
              onClick={() => setAddModalOpen(false)}
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
              <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>NEW FLEET ONBOARDING</span>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                Add New Field Agent
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                Register a certified technician with credentials for doorstep inspection & pickup dispatching.
              </p>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontSize: '0.85rem' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Ramesh Kumar"
                  value={agentForm.name}
                  onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })}
                />
              </div>

              <div className="grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem' }}>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    className="form-input"
                    placeholder="+91 98450 12345"
                    value={agentForm.phone}
                    onChange={(e) => setAgentForm({ ...agentForm, phone: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem' }}>Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="agent@thecashx.com"
                    value={agentForm.email}
                    onChange={(e) => setAgentForm({ ...agentForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem' }}>Assigned Metro Hub *</label>
                  <select
                    className="form-select"
                    value={agentForm.city}
                    onChange={(e) => setAgentForm({ ...agentForm, city: e.target.value, hub: `${e.target.value} Hub` })}
                  >
                    {CITIES.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem' }}>Hub Area / Zone</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Indiranagar & Koramangala"
                    value={agentForm.hub}
                    onChange={(e) => setAgentForm({ ...agentForm, hub: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-2" style={{ gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem' }}>Category Specialization</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Laptops & MacBooks"
                    value={agentForm.specialization}
                    onChange={(e) => setAgentForm({ ...agentForm, specialization: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem' }}>Login Password *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. agent123"
                    value={agentForm.password}
                    onChange={(e) => setAgentForm({ ...agentForm, password: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="btn btn-outline"
                  style={{ flex: 1, padding: '0.85rem', justifyContent: 'center' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-gold"
                  style={{ flex: 2, padding: '0.85rem', justifyContent: 'center' }}
                >
                  Save & Onboard Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT FIELD AGENT MODAL */}
      {editModalAgent && (
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
            maxWidth: '520px',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <button
              onClick={() => setEditModalAgent(null)}
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
              <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>UPDATE FLEET RECORD</span>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                Edit Agent: {editModalAgent.name}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                Update contact, metro hub, password or duty status for this agent.
              </p>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" style={{ fontSize: '0.85rem' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={agentForm.name}
                  onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })}
                />
              </div>

              <div className="grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem' }}>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    className="form-input"
                    value={agentForm.phone}
                    onChange={(e) => setAgentForm({ ...agentForm, phone: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem' }}>Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={agentForm.email}
                    onChange={(e) => setAgentForm({ ...agentForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem' }}>Assigned Metro Hub *</label>
                  <select
                    className="form-select"
                    value={agentForm.city}
                    onChange={(e) => setAgentForm({ ...agentForm, city: e.target.value, hub: `${e.target.value} Hub` })}
                  >
                    {CITIES.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem' }}>Availability Status</label>
                  <select
                    className="form-select"
                    value={agentForm.status}
                    onChange={(e) => setAgentForm({ ...agentForm, status: e.target.value })}
                  >
                    <option value="Active">Active (Available)</option>
                    <option value="On Duty">On Duty</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid-2" style={{ gap: '1rem', marginBottom: '1.25rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem' }}>Category Specialization</label>
                  <input
                    type="text"
                    className="form-input"
                    value={agentForm.specialization}
                    onChange={(e) => setAgentForm({ ...agentForm, specialization: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.85rem' }}>Login Password *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={agentForm.password}
                    onChange={(e) => setAgentForm({ ...agentForm, password: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setEditModalAgent(null)}
                  className="btn btn-outline"
                  style={{ flex: 1, padding: '0.85rem', justifyContent: 'center' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-gold"
                  style={{ flex: 2, padding: '0.85rem', justifyContent: 'center' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE AGENT CONFIRMATION MODAL */}
      {deleteModalAgent && (
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
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '20px',
            padding: '2rem',
            width: '100%',
            maxWidth: '440px',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}>
              <Trash2 size={26} />
            </div>

            <h3 style={{ fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Remove Field Agent?
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Are you sure you want to remove <strong>{deleteModalAgent.name}</strong> ({deleteModalAgent.city}) from the active field technician fleet?
            </p>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setDeleteModalAgent(null)}
                className="btn btn-outline"
                style={{ flex: 1, padding: '0.85rem', justifyContent: 'center' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="btn"
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  justifyContent: 'center',
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700
                }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
