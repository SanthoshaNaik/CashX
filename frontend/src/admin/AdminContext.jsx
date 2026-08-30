import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_ADMIN_CREDENTIALS, INITIAL_FIELD_AGENTS } from './data/adminInitialData';
import { INITIAL_REQUESTS, BRANDS, MACMINI_MODELS } from '../data/portalData';

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

  // Base Condition Multiplier
  let condMult = 1.0;
  if (condition === 'Excellent') condMult = 1.1;
  else if (condition === 'Good') condMult = 1.0;
  else if (condition === 'Average') condMult = 0.85;
  else if (condition === 'Damaged') condMult = 0.55;

  // Age Multiplier
  let ageMult = 1.0;
  if (age && age.includes('Under 1 Year')) ageMult = 1.2;
  else if (age && age.includes('1-2 Years')) ageMult = 1.0;
  else if (age && age.includes('2-4 Years')) ageMult = 0.8;
  else if (age && age.includes('Over 4 Years')) ageMult = 0.6;

  let calculated = Math.round(base * condMult * ageMult);

  // Screen Condition adjustment
  if (screenCondition === 'Minor Scratches') calculated -= 1200;
  else if (screenCondition === 'Spots / Bleeding / Lines') calculated -= 4000;
  else if (screenCondition === 'Cracked / Broken Glass') calculated -= 7500;

  // Battery Health adjustment
  if (batteryHealth.includes('Fair') || batteryHealth.includes('70-79%')) calculated -= 1500;
  else if (batteryHealth.includes('Degraded') || batteryHealth.includes('Service') || batteryHealth.includes('Below 70%')) calculated -= 3200;
  else if (batteryHealth.includes('Not Holding Charge')) calculated -= 4500;

  // Keyboard / Touchpad
  if (keyboardStatus === 'Some Faulty Keys') calculated -= 1600;

  // Ports / Wi-Fi
  if (portsStatus === 'Issues / Not Working') calculated -= 1200;

  // Accessories Bonuses
  if (accessories.includes('Charger') || accessories.includes('Original Charger')) calculated += 1000;
  if (accessories.includes('Box') || accessories.includes('Original Box')) calculated += 600;
  if (accessories.includes('Invoice') || accessories.includes('Original Bill') || accessories.includes('Bill')) calculated += 1200;
  if (accessories.includes('Warranty') || accessories.includes('Valid Warranty')) calculated += 1800;

  return Math.max(3000, calculated);
};

export const AdminProvider = ({ children }) => {
  // Authentication State (Super Admin or Field Agent)
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('cashx_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Current Tab State ('orders' | 'agents' | 'overview')
  const [activeTab, setActiveTab] = useState('orders');

  // Orders State (synced with main customer requests)
  const [orders, setOrders] = useState(() => {
    const cleaned = localStorage.getItem('cashx_clean_state_v3');
    if (!cleaned) {
      localStorage.setItem('laptop_requests', JSON.stringify([]));
      localStorage.setItem('cashx_admin_agents', JSON.stringify([]));
      localStorage.setItem('cashx_clean_state_v3', 'true');
      return [];
    }
    const saved = localStorage.getItem('laptop_requests');
    return saved ? JSON.parse(saved) : [];
  });

  // Field Agents State
  const [agents, setAgents] = useState(() => {
    const saved = localStorage.getItem('cashx_admin_agents');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure all agents have passwords
      return parsed.map(a => ({ ...a, password: a.password || 'agent123' }));
    }
    return [];
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

  // Sync orders to localStorage and keep in sync with external customer actions
  useEffect(() => {
    localStorage.setItem('laptop_requests', JSON.stringify(orders));
  }, [orders]);

  // Listen to cross-tab / window storage events and in-tab custom events to update orders in real-time
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'laptop_requests' && e.newValue) {
        setOrders(JSON.parse(e.newValue));
      }
    };

    const handleCustomEvent = (e) => {
      if (e.detail) {
        setOrders(e.detail);
      } else {
        const saved = localStorage.getItem('laptop_requests');
        if (saved) setOrders(JSON.parse(saved));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cashx_orders_updated', handleCustomEvent);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cashx_orders_updated', handleCustomEvent);
    };
  }, []);

  // Login handler: Automatically identifies whether the user is Super Admin or Field Agent
  const login = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Check Super Admin credentials
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

    // 2. Check Custom Admin credentials if updated
    const savedCustom = localStorage.getItem('cashx_custom_admin_creds');
    if (savedCustom) {
      const customCreds = JSON.parse(savedCustom);
      if (cleanEmail === customCreds.email.toLowerCase() && cleanPass === customCreds.password) {
        const user = {
          email: customCreds.email,
          fullName: customCreds.fullName || 'Admin User',
          role: 'ADMIN',
          title: 'Operations Admin',
          avatar: DEFAULT_ADMIN_CREDENTIALS.avatar
        };
        setAdminUser(user);
        setActiveTab('orders');
        showNotification(`Welcome back, ${user.fullName} (Admin)!`);
        return { success: true, role: 'ADMIN' };
      }
    }

    // 3. Check Field Agent credentials
    const matchedAgent = agents.find(
      a => a.email.toLowerCase() === cleanEmail && (a.password || 'agent123') === cleanPass
    );

    if (matchedAgent) {
      const user = {
        email: matchedAgent.email,
        fullName: matchedAgent.name,
        role: 'FIELD_AGENT',
        agentId: matchedAgent.id,
        phone: matchedAgent.phone,
        city: matchedAgent.city,
        hub: matchedAgent.hub,
        specialization: matchedAgent.specialization,
        rating: matchedAgent.rating,
        completedPickups: matchedAgent.completedPickups,
        avatar: matchedAgent.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(matchedAgent.name)}&background=0f172a&color=ffffff`
      };
      setAdminUser(user);
      setActiveTab('orders');
      showNotification(`Welcome back, Field Agent ${user.fullName} (${user.city})!`);
      return { success: true, role: 'FIELD_AGENT' };
    }

    return { 
      success: false, 
      error: 'Invalid credentials. Please verify your email and password. (Demo Admin: admin@thecashx.com / admin123 | Demo Agent: suresh.gowda@thecashx.com / agent123)' 
    };
  };

  // Logout handler
  const logout = () => {
    setAdminUser(null);
    showNotification('Logged out successfully.');
  };

  // Forgot password reset handler
  const forgotPassword = (email, newPassword) => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check if agent email
    const agentIndex = agents.findIndex(a => a.email.toLowerCase() === cleanEmail);
    if (agentIndex !== -1) {
      setAgents(prev => prev.map((a, idx) => idx === agentIndex ? { ...a, password: newPassword || 'agent123' } : a));
      showNotification(`Password for Field Agent ${cleanEmail} reset successfully.`);
      return { success: true };
    }

    // Otherwise reset Super Admin
    const updated = {
      email: cleanEmail,
      password: newPassword || 'admin123',
      fullName: 'Super Admin'
    };
    localStorage.setItem('cashx_custom_admin_creds', JSON.stringify(updated));
    showNotification(`Password for ${cleanEmail} reset successfully. You can now login with your new password.`);
    return { success: true };
  };

  // Re-calculate agent active orders count dynamically
  const getAgentActiveOrders = (agentId) => {
    return orders.filter(o => o.assignedAgentId === agentId && o.status !== 'Completed' && o.status !== 'Cancelled').length;
  };

  // Schedule a field agent for a specific product order with date, time slot & dispatch notes
  const scheduleAgentForOrder = (orderId, { agentId, scheduledDate, timeSlot, dispatchNotes }) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return false;

    setOrders(prev => {
      const updated = prev.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            assignedAgentId: agent.id,
            assignedAgentName: agent.name,
            assignedAgentPhone: agent.phone,
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

    showNotification(`Field agent ${agent.name} scheduled for order ${orderId} on ${scheduledDate || 'Today'} (${timeSlot || 'Doorstep Slot'}).`);
    return true;
  };

  // Assign agent to order
  const assignAgentToOrder = (orderId, agentId) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return false;

    setOrders(prev => {
      const updated = prev.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            assignedAgentId: agent.id,
            assignedAgentName: agent.name,
            assignedAgentPhone: agent.phone,
            status: order.status === 'New Request' ? 'Agent Assigned' : order.status
          };
        }
        return order;
      });
      localStorage.setItem('laptop_requests', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('cashx_orders_updated', { detail: updated }));
      return updated;
    });

    showNotification(`Order ${orderId} assigned to field agent ${agent.name} (${agent.city}).`);
    return true;
  };

  // Update order lifecycle status
  const updateOrderStatus = (orderId, newStatus, remarks = '') => {
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
  const updateOrderInspection = (orderId, updatedDeviceSpecs, inspectionChecklist, finalQuotation, newStatus = 'Completed', remarks = '') => {
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
  const addAgent = (agentData) => {
    const newAgent = {
      id: `agent-${Date.now().toString().slice(-4)}`,
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
  const updateAgent = (agentId, updatedData) => {
    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        return { ...a, ...updatedData };
      }
      return a;
    }));
    showNotification(`Field agent details updated successfully.`);
  };

  // Delete/Remove field agent
  const deleteAgent = (agentId) => {
    const agentToDelete = agents.find(a => a.id === agentId);
    setAgents(prev => prev.filter(a => a.id !== agentId));

    // Clear assignment from orders that had this agent
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
      toggleTheme
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
