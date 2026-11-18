import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_ADMIN_CREDENTIALS, INITIAL_FIELD_AGENTS } from './data/adminInitialData';
import { INITIAL_REQUESTS, BRANDS, MACMINI_MODELS } from '../data/portalData';
import { apiService } from '../services/apiService';

const AdminContext = createContext();

// Quotation calculation engine for on-site inspection
export const calculateInspectionQuote = ({
  deviceType = 'Laptop',
  brand = '',
  model = '',
  processor = '',
  ram = '',
  storage = '',
  condition = 'Good',
  age = '1-2 Years',
  screenCondition = 'Flawless',
  batteryHealth = 'Good (80-89%)',
  keyboardStatus = 'Working',
  portsStatus = 'Working',
  accessories = []
}) => {
  let base = 25000;
  const devType = (deviceType || '').toLowerCase();

  if (devType === 'monitor') {
    base = 12000;
    if (processor.includes('4K') || processor.includes('OLED') || processor.includes('UltraWide') || (model && model.includes('4K'))) {
      base = 22000;
    } else if (processor.includes('2K') || processor.includes('1440p')) {
      base = 16000;
    }
    if (ram && (ram.includes('165Hz') || ram.includes('240Hz'))) base += 4000;
  } else if (devType === 'macmini' || devType === 'mac mini') {
    const matchedMini = MACMINI_MODELS.find(m => m.name.toLowerCase().includes((model || processor || '').toLowerCase()));
    base = matchedMini ? matchedMini.basePrice : 42000;
    if (ram && (ram.includes('16GB') || ram.includes('24GB'))) base += 6000;
    else if (ram && (ram.includes('32GB') || ram.includes('64GB'))) base += 14000;
    if (storage && (storage.includes('1TB') || storage.includes('2TB'))) base += 8000;
  } else if (devType === 'desktop') {
    base = 32000;
    if (processor.includes('Ryzen 7') || processor.includes('i7')) base = 42000;
    else if (processor.includes('Ryzen 9') || processor.includes('i9')) base = 58000;
    if (ram && (ram.includes('32GB') || ram.includes('64GB'))) base += 6000;
  } else {
    // Laptop / MacBook
    const matchedBrand = BRANDS.find(b => b.name.toLowerCase().includes((brand || '').toLowerCase()));
    if (matchedBrand) base = matchedBrand.basePrice;

    let cpuMult = 1.0;
    if (processor.includes('i7') || processor.includes('Ryzen 7') || processor.includes('M1 Pro') || processor.includes('M2')) cpuMult = 1.35;
    else if (processor.includes('i9') || processor.includes('Ryzen 9') || processor.includes('M1 Max') || processor.includes('M3') || processor.includes('M4')) cpuMult = 1.6;
    else if (processor.includes('i3') || processor.includes('Ryzen 3') || processor.includes('Celeron')) cpuMult = 0.75;
    base = Math.round(base * cpuMult);

    if (ram && (ram.includes('16GB') || ram.includes('24GB'))) base += 4000;
    else if (ram && (ram.includes('32GB') || ram.includes('64GB'))) base += 9000;
    if (storage && (storage.includes('1TB') || storage.includes('2TB'))) base += 4000;
  }

  let condMult = 1.0;
  if (condition === 'Excellent') condMult = 1.1;
  else if (condition === 'Good') condMult = 1.0;
  else if (condition === 'Average') condMult = 0.85;
  else if (condition === 'Damaged') condMult = 0.55;

  let ageMult = 1.0;
  if (age && age.includes('Under 1 Year')) ageMult = 1.2;
  else if (age && age.includes('1-2 Years')) ageMult = 1.0;
  else if (age && age.includes('2-4 Years')) ageMult = 0.8;
  else if (age && age.includes('Over 4 Years')) ageMult = 0.6;

  let calculated = Math.round(base * condMult * ageMult);

  if (screenCondition === 'Minor Scratches') calculated -= 1200;
  else if (screenCondition === 'Spots / Bleeding / Lines') calculated -= 4000;
  else if (screenCondition === 'Cracked / Broken Glass') calculated -= 7500;

  if (batteryHealth && (batteryHealth.includes('Fair') || batteryHealth.includes('70-79%'))) calculated -= 1500;
  else if (batteryHealth && (batteryHealth.includes('Degraded') || batteryHealth.includes('Service') || batteryHealth.includes('Below 70%'))) calculated -= 3200;
  else if (batteryHealth && batteryHealth.includes('Not Holding Charge')) calculated -= 4500;

  if (keyboardStatus === 'Some Faulty Keys') calculated -= 1600;
  if (portsStatus === 'Issues / Not Working') calculated -= 1200;

  const accessList = Array.isArray(accessories) ? accessories : [];
  if (accessList.some(a => a.toLowerCase().includes('charger'))) calculated += 1000;
  if (accessList.some(a => a.toLowerCase().includes('box'))) calculated += 600;
  if (accessList.some(a => a.toLowerCase().includes('bill') || a.toLowerCase().includes('invoice'))) calculated += 1200;
  if (accessList.some(a => a.toLowerCase().includes('warranty'))) calculated += 1800;

  return Math.max(3000, calculated);
};

export const AdminProvider = ({ children }) => {
  // Authentication State (Super Admin or Field Agent) - Requires valid JWT token
  const [adminUser, setAdminUser] = useState(() => {
    const token = localStorage.getItem('cashx_admin_token');
    const saved = localStorage.getItem('cashx_admin_user');
    if (!token || !token.startsWith('eyJ')) {
      localStorage.removeItem('cashx_admin_user');
      localStorage.removeItem('cashx_admin_token');
      return null;
    }
    return saved ? JSON.parse(saved) : null;
  });

  // Current Tab State ('orders' | 'agents' | 'overview')
  const [activeTab, setActiveTab] = useState('orders');

  // Loading state for server synchronization
  const [isLoadingBackend, setIsLoadingBackend] = useState(false);

  // Orders State (synced with PostgreSQL backend)
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('laptop_requests');
    return saved ? JSON.parse(saved) : [];
  });

  // Field Agents State
  const [agents, setAgents] = useState(() => {
    const saved = localStorage.getItem('cashx_admin_agents');
    return saved ? JSON.parse(saved) : [];
  });

  // Filters State
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Theme State ('light' | 'dark')
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('cashx_theme');
    return saved ? saved : 'light';
  });

  // Notifications / Flash Message State
  const [flashMessage, setFlashMessage] = useState(null);

  const showNotification = (text, type = 'success') => {
    setFlashMessage({ text, type });
    setTimeout(() => {
      setFlashMessage(null);
    }, 4000);
  };

  // Sync theme to document and localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cashx_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sync admin user to localStorage
  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('cashx_admin_user', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('cashx_admin_user');
    }
  }, [adminUser]);

  // Sync field agents to localStorage
  useEffect(() => {
    localStorage.setItem('cashx_admin_agents', JSON.stringify(agents));
  }, [agents]);

  // Sync orders to localStorage
  useEffect(() => {
    localStorage.setItem('laptop_requests', JSON.stringify(orders));
  }, [orders]);

  // Load orders & agents from Spring Boot backend on mount or when adminUser changes
  const loadBackendData = async () => {
    const token = localStorage.getItem('cashx_admin_token');
    if (!adminUser || !token || !token.startsWith('eyJ')) {
      return;
    }

    setIsLoadingBackend(true);
    try {
      if (adminUser.role === 'FIELD_AGENT') {
        const agentOrders = await apiService.getAgentOrders();
        if (Array.isArray(agentOrders)) {
          const mapped = agentOrders.map(normalizeBackendOrder);
          setOrders(mapped);
          localStorage.setItem('laptop_requests', JSON.stringify(mapped));
        }
      } else {
        // Super Admin: Fetch all orders and agents fleet in parallel
        const [ordersData, agentsData] = await Promise.all([
          apiService.getAdminOrders(),
          apiService.getAgents()
        ]);
        if (Array.isArray(ordersData)) {
          const mapped = ordersData.map(normalizeBackendOrder);
          setOrders(mapped);
          localStorage.setItem('laptop_requests', JSON.stringify(mapped));
        }
        if (Array.isArray(agentsData) && agentsData.length > 0) {
          setAgents(agentsData);
          localStorage.setItem('cashx_admin_agents', JSON.stringify(agentsData));
        }
      }
    } catch (e) {
      console.warn('Backend sync notice:', e.message);
    } finally {
      setIsLoadingBackend(false);
    }
  };

  useEffect(() => {
    if (adminUser) {
      loadBackendData();
    }
  }, [adminUser]);

  // Helper to normalize backend order structure
  const normalizeBackendOrder = (o) => ({
    id: o.id,
    customer: {
      name: o.customer?.name || 'Customer',
      phone: o.customer?.phone || '',
      altPhone: o.customer?.altPhone || '',
      email: o.customer?.email || '',
      address: o.customer?.address || '',
      city: o.customer?.city || 'Bangalore',
      pincode: o.customer?.pincode || ''
    },
    device: {
      type: o.device?.deviceType || 'Laptop',
      brand: o.device?.brand || 'Generic',
      model: o.device?.model || '',
      processor: o.device?.processor || '',
      ram: o.device?.ram || '',
      storage: o.device?.storage || '',
      condition: o.device?.condition || 'Good',
      age: o.device?.age || '1-2 Years',
      accessories: o.device?.accessories ? o.device.accessories.split(', ') : ['Power Cable'],
      expectedPrice: o.device?.expectedPrice || o.estimatedPrice
    },
    status: o.status || 'New Request',
    assignedAgentId: o.assignedAgent?.id || null,
    assignedAgentName: o.assignedAgent?.name || 'Unassigned',
    assignedAgentPhone: o.assignedAgent?.phone || null,
    scheduledDate: o.scheduledDate || null,
    timeSlot: o.timeSlot || null,
    dispatchNotes: o.dispatchNotes || '',
    date: o.requestDate ? o.requestDate.split('T')[0] : new Date().toISOString().split('T')[0],
    estimatedPrice: o.estimatedPrice || 0,
    finalOfferPrice: o.finalOfferPrice || 0,
    remarks: o.remarks || '',
    inspection: o.inspection || null,
    statusHistory: o.statusHistory || []
  });

  // Listen to cross-tab / window storage events
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'laptop_requests' && e.newValue) {
        setOrders(JSON.parse(e.newValue));
      }
      if (e.key === 'cashx_admin_agents' && e.newValue) {
        setAgents(JSON.parse(e.newValue));
      }
      if (e.key === 'cashx_admin_user' && e.newValue) {
        setAdminUser(JSON.parse(e.newValue));
      }
    };

    const handleOrdersCustomEvent = (e) => {
      if (e.detail) {
        setOrders(e.detail);
      } else {
        const saved = localStorage.getItem('laptop_requests');
        if (saved) setOrders(JSON.parse(saved));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cashx_orders_updated', handleOrdersCustomEvent);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cashx_orders_updated', handleOrdersCustomEvent);
    };
  }, []);

  // Login handler: Calls Spring Boot backend /api/auth/admin/login with live token
  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    try {
      const data = await apiService.adminLogin(cleanEmail, cleanPass);
      const user = {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.fullName,
        role: data.user.role,
        agentId: data.user.agentId,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.fullName)}&background=0f172a&color=ffffff`
      };
      setAdminUser(user);
      setActiveTab('orders');
      showNotification(`Welcome back, ${user.fullName} (${user.role === 'ADMIN' ? 'Super Admin' : 'Field Agent'})!`);
      return { success: true, role: user.role };
    } catch (err) {
      // Local fallback for offline mode
      if (cleanEmail === DEFAULT_ADMIN_CREDENTIALS.email.toLowerCase() && cleanPass === DEFAULT_ADMIN_CREDENTIALS.password) {
        const user = {
          email: DEFAULT_ADMIN_CREDENTIALS.email,
          fullName: DEFAULT_ADMIN_CREDENTIALS.fullName,
          role: 'ADMIN',
          title: DEFAULT_ADMIN_CREDENTIALS.role,
          avatar: DEFAULT_ADMIN_CREDENTIALS.avatar
        };
        setAdminUser(user);
        setActiveTab('orders');
        showNotification(`Welcome back, ${user.fullName} (Super Admin)!`);
        return { success: true, role: 'ADMIN' };
      }

      const matchedAgent = agents.find(
        a => a.email.toLowerCase() === cleanEmail && (a.password || 'agent123') === cleanPass
      );
      if (matchedAgent) {
        const user = {
          email: matchedAgent.email,
          fullName: matchedAgent.name,
          role: 'FIELD_AGENT',
          agentId: matchedAgent.id,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(matchedAgent.name)}&background=0f172a&color=ffffff`
        };
        setAdminUser(user);
        setActiveTab('orders');
        showNotification(`Welcome back, Field Agent ${user.fullName}!`);
        return { success: true, role: 'FIELD_AGENT' };
      }

      return {
        success: false,
        error: err.message || 'Invalid credentials.'
      };
    }
  };

  // Logout handler
  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem('cashx_admin_token');
    showNotification('Logged out successfully.');
  };

  // Forgot password reset handler
  const forgotPassword = async (email, newPassword) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      await apiService.forgotPassword(cleanEmail);
      showNotification(`Password reset request sent for ${cleanEmail}.`);
      return { success: true };
    } catch (e) {
      showNotification(`Password reset request processed.`);
      return { success: true };
    }
  };

  // Re-calculate agent active orders count dynamically
  const getAgentActiveOrders = (agentId) => {
    return orders.filter(o => o.assignedAgentId === agentId && o.status !== 'Completed' && o.status !== 'Cancelled').length;
  };

  // Schedule a field agent for a specific product order
  const scheduleAgentForOrder = async (orderId, { agentId, scheduledDate, timeSlot, dispatchNotes }) => {
    const agent = agents.find(a => a.id === agentId);

    try {
      await apiService.scheduleOrder(orderId, {
        agentId,
        scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
        timeSlot: timeSlot || 'Today, 4:00 PM - 6:00 PM',
        dispatchNotes: dispatchNotes || ''
      });
    } catch (e) {
      console.warn('Backend schedule notice:', e.message);
    }

    setOrders(prev => {
      const updated = prev.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            assignedAgentId: agent ? agent.id : agentId,
            assignedAgentName: agent ? agent.name : 'Assigned Agent',
            assignedAgentPhone: agent ? agent.phone : '',
            scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
            timeSlot: timeSlot || 'Today, 4:00 PM - 6:00 PM',
            dispatchNotes: dispatchNotes || order.dispatchNotes || '',
            status: 'Pickup Scheduled'
          };
        }
        return order;
      });
      localStorage.setItem('laptop_requests', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('cashx_orders_updated', { detail: updated }));
      return updated;
    });

    showNotification(`Field agent ${agent?.name || agentId} scheduled for order ${orderId}.`);
    return true;
  };

  // Assign agent to order
  const assignAgentToOrder = (orderId, agentId) => {
    return scheduleAgentForOrder(orderId, { agentId });
  };

  // Update order lifecycle status
  const updateOrderStatus = async (orderId, newStatus, remarks = '') => {
    try {
      await apiService.updateOrderStatus(orderId, { status: newStatus, remarks });
    } catch (e) {
      console.warn('Backend status notice:', e.message);
    }

    setOrders(prev => {
      const updated = prev.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: newStatus,
            remarks: remarks ? remarks : order.remarks
          };
        }
        return order;
      });
      localStorage.setItem('laptop_requests', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('cashx_orders_updated', { detail: updated }));
      return updated;
    });
    showNotification(`Order ${orderId} status updated to "${newStatus}".`);
  };

  // Comprehensive update from Field Agent On-Site Inspection
  const updateOrderInspection = async (orderId, updatedDeviceSpecs, inspectionChecklist, finalQuotation, newStatus = 'Completed', remarks = '') => {
    try {
      await apiService.saveInspection(orderId, {
        ...updatedDeviceSpecs,
        ...inspectionChecklist,
        verifiedAccessories: Array.isArray(inspectionChecklist.verifiedAccessories)
          ? inspectionChecklist.verifiedAccessories.join(', ')
          : (inspectionChecklist.verifiedAccessories || ''),
        finalQuotation,
        remarks
      });
    } catch (e) {
      console.warn('Backend inspection notice:', e.message);
    }

    setOrders(prev => {
      const updated = prev.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            device: {
              ...order.device,
              ...updatedDeviceSpecs
            },
            inspection: inspectionChecklist,
            finalOfferPrice: finalQuotation,
            estimatedPrice: finalQuotation,
            status: newStatus,
            remarks: remarks ? remarks : order.remarks,
            inspectedByAgentId: adminUser?.agentId || order.assignedAgentId,
            inspectedByAgentName: adminUser?.fullName || order.assignedAgentName,
            inspectedAt: new Date().toISOString()
          };
        }
        return order;
      });
      localStorage.setItem('laptop_requests', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('cashx_orders_updated', { detail: updated }));
      return updated;
    });

    showNotification(`Inspection for Order ${orderId} finalized! Payout set to ₹${finalQuotation.toLocaleString('en-IN')}.`);
  };

  // Add a new field agent
  const addAgent = async (agentData) => {
    let createdId = `agent-${Date.now().toString().slice(-4)}`;
    try {
      const res = await apiService.createAgent(agentData);
      if (res?.id) createdId = res.id;
    } catch (e) {
      console.warn('Backend create agent notice:', e.message);
    }

    const newAgent = {
      id: createdId,
      name: agentData.name,
      phone: agentData.phone,
      email: agentData.email,
      password: agentData.password || 'agent123',
      city: agentData.city || 'Bangalore',
      hub: agentData.hub || `${agentData.city || 'Bangalore'} Central Hub`,
      specialization: agentData.specialization || 'Laptops & MacBooks',
      rating: 5.0,
      completedPickups: 0,
      activeOrdersCount: 0,
      status: agentData.status || 'Active',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setAgents(prev => [newAgent, ...prev]);
    showNotification(`Field agent ${newAgent.name} added successfully to ${newAgent.city} hub!`);
    return newAgent;
  };

  // Update existing field agent
  const updateAgent = async (agentId, updatedData) => {
    try {
      await apiService.updateAgent(agentId, updatedData);
    } catch (e) {
      console.warn('Backend update agent notice:', e.message);
    }

    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        return { ...a, ...updatedData };
      }
      return a;
    }));
    showNotification(`Field agent details updated successfully.`);
  };

  // Delete/Remove field agent
  const deleteAgent = async (agentId) => {
    try {
      await apiService.deleteAgent(agentId);
    } catch (e) {
      console.warn('Backend delete agent notice:', e.message);
    }

    const agentToDelete = agents.find(a => a.id === agentId);
    setAgents(prev => prev.filter(a => a.id !== agentId));

    setOrders(prev => prev.map(o => {
      if (o.assignedAgentId === agentId) {
        return {
          ...o,
          assignedAgentId: null,
          assignedAgentName: 'Unassigned',
          status: o.status === 'Agent Assigned' ? 'New Request' : o.status
        };
      }
      return o;
    }));

    showNotification(`Field agent ${agentToDelete?.name || ''} has been removed.`);
  };

  return (
    <AdminContext.Provider value={{
      adminUser,
      login,
      logout,
      forgotPassword,
      orders,
      agents,
      activeTab,
      setActiveTab,
      selectedLocation,
      setSelectedLocation,
      selectedCategory,
      setSelectedCategory,
      selectedStatus,
      setSelectedStatus,
      searchQuery,
      setSearchQuery,
      assignAgentToOrder,
      scheduleAgentForOrder,
      updateOrderStatus,
      updateOrderInspection,
      addAgent,
      updateAgent,
      deleteAgent,
      getAgentActiveOrders,
      flashMessage,
      showNotification,
      theme,
      toggleTheme,
      loadBackendData,
      isLoadingBackend
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
