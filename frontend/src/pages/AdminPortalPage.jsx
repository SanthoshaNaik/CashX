import React, { useState } from 'react';
import { usePortal } from '../context/PortalContext';
import { 
  UserCheck, Shield, Laptop, Phone, MapPin, CheckCircle2, AlertTriangle, X, 
  Plus, Edit, Trash2, Download, Search, Filter, Camera, Send, MessageSquare, 
  ExternalLink, BarChart3, Settings, Lock, Eye, Check, FileText
} from 'lucide-react';

export const AdminPortalPage = () => {
  const { 
    currentUser, login, logout, requests, agents, notifications, 
    assignAgent, updateRequestStatus, submitInspectionReport, deleteRequest, 
    addAgent, deleteAgent, COMPANY_INFO, updateCompanyInfo 
  } = usePortal();

  // Login Modal Form State
  const [loginRole, setLoginRole] = useState('ADMIN'); // ADMIN | FIELD_AGENT
  const [loginEmail, setLoginEmail] = useState('santhoshnaik546@gmail.com');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active Tab View in Portal
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | requests | inspection | agents | reports | branding

  // Request Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Selected Request Drawer State
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Field Agent Inspection Form State
  const [inspectingRequest, setInspectingRequest] = useState(null);
  const [inspectionData, setInspectionData] = useState({
    physical: { screenOk: "Yes", displayIssue: "No", scratches: "No", dents: "No", hingesOk: "Yes", keyboardOk: "Yes", touchpadOk: "Yes", webcamOk: "Yes", speakersOk: "Yes", micOk: "Yes" },
    hardware: { powerOn: "Working", batteryHealth: "90%", chargingPort: "Working", usbPorts: "Working", hdmiPort: "Working", wifi: "Working", bluetooth: "Working", storageDetection: "Working", ramDetection: "Working", fingerprintSensor: "Working", graphicsCheck: "Working" },
    software: { windowsActivated: "Working", driversInstalled: "Working", biosAccessible: "Working", osWorking: "Working" },
    accessories: { charger: true, box: true, bag: false, invoice: true, warranty: false },
    images: [
      { label: "Front View", url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80" },
      { label: "Keyboard View", url: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80" }
    ]
  });
  const [offerPriceInput, setOfferPriceInput] = useState('');
  const [conditionGradeInput, setConditionGradeInput] = useState('Good');
  const [remarksInput, setRemarksInput] = useState('');

  // New Agent Modal & Dispatch State
  const [newAgentModal, setNewAgentModal] = useState(false);
  const [agentForm, setAgentForm] = useState({ name: '', email: '', phone: '', city: 'Bangalore', password: '' });
  const [agentDispatchModal, setAgentDispatchModal] = useState(null);

  // Branding Form State
  const [brandingForm, setBrandingForm] = useState({
    name: COMPANY_INFO.name,
    phone: COMPANY_INFO.phone,
    whatsapp: COMPANY_INFO.whatsapp,
    email: COMPANY_INFO.email,
    address: COMPANY_INFO.address
  });

  // Handle Staff Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    const res = await login(loginRole, loginPass, loginEmail);
    if (!res.success) {
      setLoginError(res.error || 'Invalid email or password.');
    }
  };

  // RESTRICT NORMAL CUSTOMERS: Only ADMIN and FIELD_AGENT allowed
  if (currentUser && currentUser.role === 'CUSTOMER') {
    return (
      <div style={{ padding: '5rem 0', background: 'var(--bg-pitch)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ maxWidth: '480px', textAlign: 'center' }}>
          <div className="card-dark" style={{ border: '1px solid var(--border-glow)', padding: '2.5rem 2rem' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Lock size={32} />
            </div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Access Restricted</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              Logged in as <strong>{currentUser.fullName || currentUser.email}</strong> (<span style={{ color: 'var(--accent-gold)' }}>CUSTOMER</span>). Normal customer accounts cannot access the Staff Admin & Field Agent Portal.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                className="btn btn-gold"
                onClick={() => logout()}
                style={{ width: '100%', padding: '0.75rem' }}
              >
                <Shield size={16} /> Switch to Staff Login
              </button>
              <button
                className="btn btn-outline"
                onClick={() => window.location.hash = '/'}
                style={{ width: '100%', padding: '0.75rem' }}
              >
                Return to Home Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If Not Authenticated, Render Staff Login Gate Screen
  if (!currentUser) {
    return (
      <div style={{ padding: '5rem 0', background: 'var(--bg-pitch)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ maxWidth: '450px' }}>
          <div className="card-dark" style={{ border: '1px solid var(--border-glow)' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'var(--accent-gold-glow)', color: 'var(--accent-gold)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <Lock size={26} />
              </div>
              <h2 style={{ fontSize: '1.6rem' }}>Portal Authentication</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {COMPANY_INFO.name} • Admin & Field Agent Inspection
              </p>
            </div>

            {loginError && (
              <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="form-label">Select User Role</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className={`btn ${loginRole === 'ADMIN' ? 'btn-gold' : 'btn-outline'}`}
                    onClick={() => setLoginRole('ADMIN')}
                    style={{ padding: '0.6rem', fontSize: '0.85rem' }}
                  >
                    👑 Administrator
                  </button>
                  <button
                    type="button"
                    className={`btn ${loginRole === 'FIELD_AGENT' ? 'btn-cyan' : 'btn-outline'}`}
                    onClick={() => setLoginRole('FIELD_AGENT')}
                    style={{ padding: '0.6rem', fontSize: '0.85rem' }}
                  >
                    🛵 Field Agent
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Staff Email Address *</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="e.g. santhoshnaik546@gmail.com"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Admin Password *</label>
                <input
                  type="password"
                  required
                  className="form-input"
                  placeholder="Enter admin password (e.g. Nsanthu@12)"
                  value={loginPass}
                  onChange={e => setLoginPass(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-gold" style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}>
                Access Inspection Portal
              </button>
            </form>

            <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Demo Credentials: Passcode <code>admin123</code> or <code>2001</code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Requests Matrix
  const filteredRequests = requests.filter(r => {
    const matchesSearch = 
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customer.phone.includes(searchTerm) ||
      r.device.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate Dashboard KPI Stats
  const totalRequestsCount = requests.length;
  const newRequestsCount = requests.filter(r => r.status === 'New Request').length;
  const assignedRequestsCount = requests.filter(r => r.status === 'Assigned').length;
  const inspectionInProgressCount = requests.filter(r => r.status === 'Inspection Started' || r.status === 'Agent Accepted').length;
  const completedRequestsCount = requests.filter(r => r.status === 'Completed' || r.status === 'Offer Approved').length;
  const cancelledRequestsCount = requests.filter(r => r.status === 'Cancelled').length;

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = "Request ID,Customer Name,Phone,City,Brand,Model,Specs,Status,Estimated Price,Final Offer Price\n";
    const rows = requests.map(r => 
      `"${r.id}","${r.customer.name}","${r.customer.phone}","${r.customer.city}","${r.device.brand}","${r.device.model}","${r.device.processor} ${r.device.ram}","${r.status}",${r.estimatedPrice},${r.finalOfferPrice || 0}`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laptop_Buyback_Leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Open Field Agent Inspection Form
  const startInspection = (req) => {
    setInspectingRequest(req);
    setOfferPriceInput(req.finalOfferPrice || req.estimatedPrice);
    setConditionGradeInput(req.device.condition || 'Good');
    setRemarksInput(req.remarks || '');
    updateRequestStatus(req.id, 'Inspection Started');
  };

  const handleInspectionSubmit = (e) => {
    e.preventDefault();
    submitInspectionReport(
      inspectingRequest.id,
      inspectionData,
      offerPriceInput,
      conditionGradeInput,
      remarksInput
    );
    setInspectingRequest(null);
  };

  return (
    <div style={{ background: 'var(--bg-pitch)', minHeight: '90vh', padding: '2rem 0' }}>
      <div className="container">
        
        {/* Top Portal Nav & Role Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
          background: 'var(--bg-card)',
          padding: '1.25rem 1.5rem',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className={`badge ${currentUser.role === 'ADMIN' ? 'badge-gold' : 'badge-cyan'}`}>
                {currentUser.role === 'ADMIN' ? '👑 SYSTEM ADMIN' : '🛵 FIELD AGENT'}
              </span>
              <h2 style={{ fontSize: '1.4rem' }}>{currentUser.name}</h2>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {COMPANY_INFO.name} Inspection Portal • Logged in securely
            </div>
          </div>

          {/* Tab Navigation Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button className={`btn ${activeTab === 'dashboard' ? 'btn-gold' : 'btn-outline'}`} onClick={() => setActiveTab('dashboard')} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              📊 Dashboard
            </button>
            <button className={`btn ${activeTab === 'requests' ? 'btn-gold' : 'btn-outline'}`} onClick={() => setActiveTab('requests')} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              📋 Requests ({requests.length})
            </button>
            {currentUser.role === 'ADMIN' && (
              <>
                <button className={`btn ${activeTab === 'agents' ? 'btn-gold' : 'btn-outline'}`} onClick={() => setActiveTab('agents')} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  👥 Field Agents
                </button>
                <button className={`btn ${activeTab === 'branding' ? 'btn-gold' : 'btn-outline'}`} onClick={() => setActiveTab('branding')} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                  ⚙️ Settings
                </button>
              </>
            )}
            <button className="btn btn-outline" onClick={handleExportCSV} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              <Download size={14} /> Export CSV
            </button>
            <button className="btn btn-outline" onClick={logout} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', color: '#f87171' }}>
              Logout
            </button>
          </div>
        </div>

        {/* =========================================================================
            TAB 1: DASHBOARD ANALYTICS & STAT CARDS
           ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div>
            {/* 6 KPI Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <div className="card-dark" style={{ borderLeft: '4px solid var(--accent-gold)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Requests</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-gold)' }}>{totalRequestsCount}</div>
              </div>

              <div className="card-dark" style={{ borderLeft: '4px solid var(--status-new)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>New Requests</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--status-new)' }}>{newRequestsCount}</div>
              </div>

              <div className="card-dark" style={{ borderLeft: '4px solid var(--status-assigned)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Assigned</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--status-assigned)' }}>{assignedRequestsCount}</div>
              </div>

              <div className="card-dark" style={{ borderLeft: '4px solid var(--status-inspection)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>In Progress</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--status-inspection)' }}>{inspectionInProgressCount}</div>
              </div>

              <div className="card-dark" style={{ borderLeft: '4px solid var(--status-completed)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Completed</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--status-completed)' }}>{completedRequestsCount}</div>
              </div>

              <div className="card-dark" style={{ borderLeft: '4px solid var(--status-cancelled)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cancelled</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--status-cancelled)' }}>{cancelledRequestsCount}</div>
              </div>
            </div>

            {/* Visual Performance Charts & Activity */}
            <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
              {/* Requests by City Chart Widget */}
              <div className="card-dark">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', color: 'var(--accent-gold)' }}>Requests by City Hub</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {[
                    { city: 'Bangalore', count: 18, pct: 75 },
                    { city: 'Chennai', count: 8, pct: 40 },
                    { city: 'Hyderabad', count: 6, pct: 30 },
                    { city: 'Mysore', count: 4, pct: 20 }
                  ].map(item => (
                    <div key={item.city}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                        <span>{item.city}</span>
                        <span style={{ fontWeight: 700 }}>{item.count} leads</span>
                      </div>
                      <div style={{ height: '8px', background: '#181a24', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${item.pct}%`, background: 'var(--accent-gold)' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Field Agent Performance */}
              <div className="card-dark">
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', color: 'var(--accent-emerald)' }}>Field Agent Performance</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {agents.map(ag => (
                    <div key={ag.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem', background: '#11131a', borderRadius: '8px' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{ag.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ag.city} • ⭐ {ag.rating}</div>
                      </div>
                      <span className="badge badge-emerald">{ag.completedRequests} Completed</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Notifications & System Alerts */}
            <div className="card-dark">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--accent-cyan)' }}>Real-Time System Log & Notifications</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.6rem 0.85rem', background: '#11131c', borderRadius: '8px', borderLeft: '3px solid var(--accent-gold)' }}>
                    <span>{n.text}</span>
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: REQUESTS MANAGEMENT MATRIX
           ========================================================================= */}
        {(activeTab === 'requests' || activeTab === 'dashboard') && (
          <div style={{ marginTop: activeTab === 'dashboard' ? '2rem' : 0 }}>
            {/* Filter & Search Bar */}
            <div className="card-dark" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', flex: 1, minWidth: '250px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search by ID, customer name, mobile or brand..."
                    style={{ paddingLeft: '2.5rem', fontSize: '0.88rem' }}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['ALL', 'New Request', 'Assigned', 'Inspection Started', 'Offer Submitted', 'Completed', 'Cancelled'].map(st => (
                  <button
                    key={st}
                    className={`btn ${statusFilter === st ? 'btn-gold' : 'btn-outline'}`}
                    onClick={() => setStatusFilter(st)}
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="card-dark" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="table-responsive">
                <table className="table-custom">
                  <thead>
                    <tr>
                      <th>Req ID</th>
                      <th>Customer</th>
                      <th>Device & Specs</th>
                      <th>City</th>
                      <th>Assigned Agent</th>
                      <th>Status</th>
                      <th>Quote Offered</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map(req => (
                      <tr key={req.id}>
                        <td>
                          <strong style={{ color: 'var(--accent-gold)' }}>{req.id}</strong>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{req.date}</div>
                        </td>

                        <td>
                          <div style={{ fontWeight: 700 }}>{req.customer.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{req.customer.phone}</div>
                        </td>

                        <td>
                          <div><strong>{req.device.brand}</strong> {req.device.model}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {req.device.processor} • {req.device.ram} • {req.device.condition}
                          </div>
                        </td>

                        <td>{req.customer.city}</td>

                        <td>
                          {req.assignedAgentName !== 'Unassigned' ? (
                            <span className="badge badge-cyan">{req.assignedAgentName}</span>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Unassigned</span>
                          )}
                        </td>

                        <td>
                          <span className={`badge ${
                            req.status === 'Completed' ? 'badge-emerald' :
                            req.status === 'New Request' ? 'badge-blue' :
                            req.status === 'Assigned' ? 'badge-purple' :
                            req.status === 'Inspection Started' ? 'badge-gold' : 'badge-gold'
                          }`}>
                            {req.status}
                          </span>
                        </td>

                        <td>
                          <strong style={{ color: 'var(--accent-emerald)' }}>
                            ₹{(req.finalOfferPrice || req.estimatedPrice).toLocaleString()}
                          </strong>
                        </td>

                        <td>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button
                              className="btn btn-outline"
                              onClick={() => setSelectedRequest(req)}
                              style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                              title="View Customer Details"
                            >
                              <Eye size={14} /> Details
                            </button>

                            <button
                              className="btn btn-gold"
                              onClick={() => startInspection(req)}
                              style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }}
                              title="Start Inspection"
                            >
                              <FileText size={14} /> Inspect
                            </button>

                            {currentUser.role === 'ADMIN' && (
                              <button
                                className="btn btn-outline"
                                onClick={() => deleteRequest(req.id)}
                                style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', color: '#f87171' }}
                                title="Delete Lead"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: FIELD AGENT USER MANAGEMENT (ADMIN ONLY)
           ========================================================================= */}
        {activeTab === 'agents' && currentUser.role === 'ADMIN' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.4rem' }}>Manage Field Agents</h3>
              <button className="btn btn-gold" onClick={() => setNewAgentModal(true)}>
                <Plus size={18} /> Add New Field Agent
              </button>
            </div>

            <div className="grid-3">
              {agents.map(ag => (
                <div key={ag.id} className="card-dark" style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', alignItems: 'center' }}>
                    <span className="badge badge-gold">{ag.city}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge badge-emerald">{ag.status}</span>
                      <button
                        className="btn btn-outline"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to remove field agent ${ag.name}?`)) {
                            deleteAgent(ag.id);
                          }
                        }}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                        title="Delete Field Agent"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>{ag.name}</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    📞 {ag.phone}
                  </div>
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span>Active: <strong>{ag.activeRequests}</strong></span>
                    <span>Completed: <strong>{ag.completedRequests}</strong></span>
                    <span>Rating: <strong>⭐ {ag.rating}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: COMPANY BRANDING & SETTINGS CONFIGURATOR
           ========================================================================= */}
        {activeTab === 'branding' && currentUser.role === 'ADMIN' && (
          <div className="card-dark" style={{ maxWidth: '650px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.25rem', color: 'var(--accent-gold)' }}>
              ⚙️ Customize Website Branding & Contact Details
            </h3>

            <form onSubmit={(e) => { e.preventDefault(); updateCompanyInfo(brandingForm); alert('Branding updated successfully!'); }}>
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input type="text" required className="form-input" value={brandingForm.name} onChange={e => setBrandingForm({ ...brandingForm, name: e.target.value })} />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Helpline Phone *</label>
                  <input type="text" required className="form-input" value={brandingForm.phone} onChange={e => setBrandingForm({ ...brandingForm, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">WhatsApp Number *</label>
                  <input type="text" required className="form-input" value={brandingForm.whatsapp} onChange={e => setBrandingForm({ ...brandingForm, whatsapp: e.target.value })} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Support Email *</label>
                <input type="email" required className="form-input" value={brandingForm.email} onChange={e => setBrandingForm({ ...brandingForm, email: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Corporate Address *</label>
                <textarea rows={3} className="form-textarea" value={brandingForm.address} onChange={e => setBrandingForm({ ...brandingForm, address: e.target.value })}></textarea>
              </div>

              <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: '0.85rem' }}>
                Save Branding Settings
              </button>
            </form>
          </div>
        )}

      </div>

      {/* =========================================================================
          DRAWER / MODAL: CUSTOMER & REQUEST DETAILS + AGENT ASSIGNMENT
         ========================================================================= */}
      {selectedRequest && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 180, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card-dark" style={{ maxWidth: '650px', width: '100%', maxHeight: '88vh', overflowY: 'auto', position: 'relative', padding: '2rem' }}>
            <button onClick={() => setSelectedRequest(null)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', color: 'var(--text-muted)' }}>
              <X size={22} />
            </button>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <span className="badge badge-gold">{selectedRequest.id}</span>
              <span className="badge badge-emerald">{selectedRequest.status}</span>
            </div>

            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{selectedRequest.customer.name}</h3>

            <div style={{ background: '#11131c', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--accent-gold)', marginBottom: '0.75rem' }}>Customer Profile & Location</h4>
              <div style={{ fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--text-muted)' }}>
                <div>📞 Mobile: <strong style={{ color: '#fff' }}>{selectedRequest.customer.phone}</strong></div>
                <div>📍 Address: {selectedRequest.customer.address}, {selectedRequest.customer.city} - {selectedRequest.customer.pincode}</div>
                
                {/* Google Maps Location Trigger Link */}
                <div style={{ marginTop: '0.5rem' }}>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(selectedRequest.customer.address + ' ' + selectedRequest.customer.city)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-cyan"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem', display: 'inline-flex', gap: '0.3rem' }}
                  >
                    <ExternalLink size={14} /> Open Location on Google Maps
                  </a>
                </div>
              </div>
            </div>

            <div style={{ background: '#11131c', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--accent-cyan)', marginBottom: '0.75rem' }}>Device Specifications</h4>
              <div style={{ fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--text-muted)' }}>
                <div>Laptop: <strong>{selectedRequest.device.brand} {selectedRequest.device.model}</strong></div>
                <div>Specs: {selectedRequest.device.processor} • {selectedRequest.device.ram} RAM • {selectedRequest.device.storage}</div>
                <div>Condition: <strong>{selectedRequest.device.condition}</strong></div>
                <div>Accessories: {selectedRequest.device.accessories.join(', ')}</div>
              </div>
            </div>

            {/* Agent Assignment Selector */}
            <div className="form-group">
              <label className="form-label">Assign Field Agent</label>
              <select
                className="form-select"
                value={selectedRequest.assignedAgentId || ''}
                onChange={e => {
                  assignAgent(selectedRequest.id, e.target.value);
                  setSelectedRequest(prev => ({ ...prev, assignedAgentId: e.target.value, status: 'Assigned' }));
                }}
              >
                <option value="">Select Agent to Dispatch</option>
                {agents.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.city})</option>
                ))}
              </select>
            </div>

            {/* WhatsApp Notification Direct Trigger */}
            <a
              href={`https://wa.me/${selectedRequest.customer.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(selectedRequest.customer.name)},%20our%20field%20agent%20${encodeURIComponent(selectedRequest.assignedAgentName)}%20has%20been%20assigned%20for%20your%20laptop%20pickup%20(Req%20${selectedRequest.id}).`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-emerald"
              style={{ width: '100%', padding: '0.8rem' }}
            >
              <MessageSquare size={18} /> Send WhatsApp Update to Customer
            </a>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: FIELD AGENT HARDWARE/SOFTWARE INSPECTION WIZARD
         ========================================================================= */}
      {inspectingRequest && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 190, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card-dark" style={{ maxWidth: '750px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', padding: '2rem' }}>
            <button onClick={() => setInspectingRequest(null)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', color: 'var(--text-muted)' }}>
              <X size={22} />
            </button>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-gold">FIELD INSPECTION WIZARD</span>
              <span className="badge badge-cyan">{inspectingRequest.id}</span>
            </div>

            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.25rem' }}>
              Inspecting: {inspectingRequest.device.brand} {inspectingRequest.device.model} ({inspectingRequest.customer.name})
            </h3>

            <form onSubmit={handleInspectionSubmit}>
              
              {/* 1. PHYSICAL CONDITION CHECKLIST */}
              <div style={{ marginBottom: '1.5rem', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem', background: '#11131c' }}>
                <h4 style={{ fontSize: '1rem', color: 'var(--accent-gold)', marginBottom: '0.85rem' }}>1. Physical Condition Checklist</h4>
                <div className="grid-2">
                  {[
                    { key: 'screenOk', label: 'Screen Working / No Lines' },
                    { key: 'scratches', label: 'Body Scratches Present' },
                    { key: 'dents', label: 'Body Dents Present' },
                    { key: 'hingesOk', label: 'Hinges Smooth & Intact' },
                    { key: 'keyboardOk', label: 'All Keyboard Keys Working' },
                    { key: 'touchpadOk', label: 'Touchpad Working' },
                    { key: 'webcamOk', label: 'Webcam Working' },
                    { key: 'speakersOk', label: 'Speakers & Mic Working' }
                  ].map(item => (
                    <div key={item.key} style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{item.label}:</span>
                      <select
                        className="form-select"
                        style={{ width: '100px', padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
                        value={inspectionData.physical[item.key]}
                        onChange={e => setInspectionData({
                          ...inspectionData,
                          physical: { ...inspectionData.physical, [item.key]: e.target.value }
                        })}
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        <option value="N/A">N/A</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. HARDWARE DIAGNOSTICS */}
              <div style={{ marginBottom: '1.5rem', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem', background: '#11131c' }}>
                <h4 style={{ fontSize: '1rem', color: 'var(--accent-cyan)', marginBottom: '0.85rem' }}>2. Hardware Diagnostics & Ports</h4>
                <div className="grid-2">
                  {[
                    { key: 'powerOn', label: 'Power On / Boot Test' },
                    { key: 'chargingPort', label: 'Charging Port Functional' },
                    { key: 'usbPorts', label: 'USB / HDMI Ports Working' },
                    { key: 'wifi', label: 'WiFi & Bluetooth Card' },
                    { key: 'storageDetection', label: 'SSD / HDD Smart Test' },
                    { key: 'fingerprintSensor', label: 'Fingerprint / Security' }
                  ].map(item => (
                    <div key={item.key} style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{item.label}:</span>
                      <select
                        className="form-select"
                        style={{ width: '110px', padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
                        value={inspectionData.hardware[item.key]}
                        onChange={e => setInspectionData({
                          ...inspectionData,
                          hardware: { ...inspectionData.hardware, [item.key]: e.target.value }
                        })}
                      >
                        <option value="Working">Working</option>
                        <option value="Not Working">Not Working</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. PHOTO UPLOADS GALLERY */}
              <div style={{ marginBottom: '1.5rem', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem', background: '#11131c' }}>
                <h4 style={{ fontSize: '1rem', color: 'var(--accent-emerald)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Camera size={16} /> 3. Inspection Photos Upload Gallery
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.75rem' }}>
                  {inspectionData.images.map((img, i) => (
                    <div key={i} style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px', overflow: 'hidden', textAlign: 'center' }}>
                      <img src={img.url} alt={img.label} style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                      <div style={{ fontSize: '0.72rem', padding: '0.2rem', color: 'var(--text-muted)' }}>{img.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. FINAL OFFER PRICE & REMARKS */}
              <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Final Offer Price (₹) *</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    value={offerPriceInput}
                    onChange={e => setOfferPriceInput(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Final Condition Grade</label>
                  <select className="form-select" value={conditionGradeInput} onChange={e => setConditionGradeInput(e.target.value)}>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Average">Average</option>
                    <option value="Damaged">Damaged</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Agent Remarks & Notes</label>
                <textarea rows={2} className="form-textarea" placeholder="Enter physical inspection notes" value={remarksInput} onChange={e => setRemarksInput(e.target.value)}></textarea>
              </div>

              <button type="submit" className="btn btn-emerald" style={{ width: '100%', padding: '0.9rem' }}>
                <Check size={18} /> Submit Inspection Report & Offer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* NEW AGENT MODAL */}
      {newAgentModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 190, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card-dark" style={{ maxWidth: '480px', width: '100%', position: 'relative' }}>
            <button onClick={() => setNewAgentModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-muted)' }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', color: 'var(--accent-gold)' }}>Onboard New Field Agent</h3>
            <form onSubmit={async (e) => { 
              e.preventDefault(); 
              const submittedData = { ...agentForm };
              await addAgent(submittedData); 
              setNewAgentModal(false);
              setAgentDispatchModal(submittedData);
              setAgentForm({ name: '', email: '', phone: '', city: 'Bangalore', password: '' });
            }}>
              <div className="form-group">
                <label className="form-label">Agent Full Name *</label>
                <input type="text" required className="form-input" placeholder="e.g. Suresh Gowda" value={agentForm.name} onChange={e => setAgentForm({ ...agentForm, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Agent Login Email *</label>
                <input type="email" required className="form-input" placeholder="e.g. suresh.gowda@laptopbuyback.com" value={agentForm.email} onChange={e => setAgentForm({ ...agentForm, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Agent Phone Number (for SMS & WhatsApp Dispatch) *</label>
                <input type="tel" required className="form-input" placeholder="e.g. +91 89709 00825" value={agentForm.phone} onChange={e => setAgentForm({ ...agentForm, phone: e.target.value })} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Assigned City Hub *</label>
                  <select className="form-select" value={agentForm.city} onChange={e => setAgentForm({ ...agentForm, city: e.target.value })}>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Mysore">Mysore</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Login Password *</label>
                  <input type="password" required className="form-input" placeholder="Set agent password" value={agentForm.password} onChange={e => setAgentForm({ ...agentForm, password: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="btn btn-gold" style={{ width: '100%', padding: '0.85rem' }}>
                Onboard Agent & Dispatch Credentials
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FIELD AGENT TRANSACTIONAL SMS DISPATCH MODAL */}
      {agentDispatchModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card-dark" style={{ maxWidth: '520px', width: '100%', textAlign: 'center', padding: '2rem', border: '1px solid var(--border-glow)' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>Field Agent Onboarded Live!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Agent <strong>{agentDispatchModal.name}</strong> registered in MongoDB Atlas database with <code>FIELD_AGENT</code> role.
            </p>

            <div style={{ background: '#11141d', padding: '1.25rem', borderRadius: '12px', textAlign: 'left', marginBottom: '1.25rem', border: '1px solid var(--border-subtle)', fontSize: '0.9rem', lineHeight: '1.7' }}>
              <div>📧 Login Email: <strong style={{ color: '#fff' }}>{agentDispatchModal.email}</strong></div>
              <div>🔑 Login Password: <strong style={{ color: '#38bdf8' }}>{agentDispatchModal.password}</strong></div>
              <div>📱 Phone Number: <strong style={{ color: '#fff' }}>{agentDispatchModal.phone}</strong></div>
              <div>🌐 Portal Link: <code style={{ color: '#a7f3d0' }}>https://laptop-buy-back.vercel.app/#/admin</code></div>
            </div>

            <div style={{ padding: '0.75rem', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '8px', color: '#7dd3fc', fontSize: '0.82rem', marginBottom: '1.25rem', textAlign: 'center' }}>
              ⚡ Transactional SMS API request dispatched to <strong>{agentDispatchModal.phone}</strong>!
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a
                href={`sms:${agentDispatchModal.phone.replace(/[^0-9]/g, '')}?body=${encodeURIComponent(`Welcome to Laptop Buyback! Field Agent Credentials:\nEmail: ${agentDispatchModal.email}\nPassword: ${agentDispatchModal.password}\nPortal: https://laptop-buy-back.vercel.app/#/admin`)}`}
                className="btn btn-gold"
                style={{ padding: '0.75rem', width: '100%' }}
              >
                <MessageSquare size={18} /> Open Phone SMS App & Send Text to {agentDispatchModal.phone}
              </a>

              <button
                className="btn btn-outline"
                onClick={() => {
                  navigator.clipboard.writeText(`Welcome to Laptop Buyback! Field Agent Login Credentials:\nEmail: ${agentDispatchModal.email}\nPassword: ${agentDispatchModal.password}\nPortal Link: https://laptop-buy-back.vercel.app/#/admin`);
                  alert('Login credentials copied to clipboard!');
                }}
                style={{ padding: '0.75rem' }}
              >
                📋 Copy Login Credentials
              </button>

              <button
                className="btn btn-outline"
                onClick={() => setAgentDispatchModal(null)}
                style={{ padding: '0.6rem', marginTop: '0.25rem' }}
              >
                Done / Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
