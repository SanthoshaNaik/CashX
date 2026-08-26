import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_ADMIN_CREDENTIALS, INITIAL_FIELD_AGENTS } from './data/adminInitialData';
import { INITIAL_REQUESTS } from '../data/portalData';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  // Admin Authentication State
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('cashx_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Admin Current Tab State ('orders' | 'agents' | 'overview')
  const [activeTab, setActiveTab] = useState('orders');

  // Orders State (synced with main customer requests)
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('laptop_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  // Field Agents State
  const [agents, setAgents] = useState(() => {
    const saved = localStorage.getItem('cashx_admin_agents');
    return saved ? JSON.parse(saved) : INITIAL_FIELD_AGENTS;
  });

  // Filters State
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Notifications / Flash Message State
  const [flashMessage, setFlashMessage] = useState(null);

  const showNotification = (text, type = 'success') => {
    setFlashMessage({ text, type });
    setTimeout(() => {
      setFlashMessage(null);
    }, 4000);
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

  // Listen to cross-tab / window storage events to update orders in real-time
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'laptop_requests' && e.newValue) {
        setOrders(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Login handler
  const login = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // Check default or demo admin
    if (cleanEmail === DEFAULT_ADMIN_CREDENTIALS.email.toLowerCase() && cleanPass === DEFAULT_ADMIN_CREDENTIALS.password) {
      const user = {
        email: DEFAULT_ADMIN_CREDENTIALS.email,
        fullName: DEFAULT_ADMIN_CREDENTIALS.fullName,
        role: DEFAULT_ADMIN_CREDENTIALS.role,
        avatar: DEFAULT_ADMIN_CREDENTIALS.avatar
      };
      setAdminUser(user);
      showNotification(`Welcome back, ${user.fullName}!`);
      return { success: true };
    }

    // Allow custom admin user credentials if updated
    const savedCustom = localStorage.getItem('cashx_custom_admin_creds');
    if (savedCustom) {
      const customCreds = JSON.parse(savedCustom);
      if (cleanEmail === customCreds.email.toLowerCase() && cleanPass === customCreds.password) {
        const user = {
          email: customCreds.email,
          fullName: customCreds.fullName || 'Admin User',
          role: 'Operations Admin',
          avatar: DEFAULT_ADMIN_CREDENTIALS.avatar
        };
        setAdminUser(user);
        showNotification(`Welcome back, ${user.fullName}!`);
        return { success: true };
      }
    }

    return { success: false, error: 'Invalid admin email address or password. (Demo: admin@thecashx.com / admin123)' };
  };

  // Logout handler
  const logout = () => {
    setAdminUser(null);
    showNotification('Logged out from Admin Portal.');
  };

  // Forgot password reset handler
  const forgotPassword = (email, newPassword) => {
    const cleanEmail = email.trim().toLowerCase();
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

  // Assign agent to order
  const assignAgentToOrder = (orderId, agentId) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return false;

    setOrders(prev => prev.map(order => {
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
    }));

    showNotification(`Order ${orderId} assigned to field agent ${agent.name} (${agent.city}).`);
    return true;
  };

  // Update order lifecycle status
  const updateOrderStatus = (orderId, newStatus, remarks = '') => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: newStatus,
          remarks: remarks ? remarks : order.remarks
        };
      }
      return order;
    }));
    showNotification(`Order ${orderId} status updated to "${newStatus}".`);
  };

  // Add a new field agent
  const addAgent = (agentData) => {
    const newAgent = {
      id: `agent-${Date.now().toString().slice(-4)}`,
      name: agentData.name,
      phone: agentData.phone,
      email: agentData.email,
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
      updateOrderStatus,
      addAgent,
      updateAgent,
      deleteAgent,
      getAgentActiveOrders,
      flashMessage,
      showNotification
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
