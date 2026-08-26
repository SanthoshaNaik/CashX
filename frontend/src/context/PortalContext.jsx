import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_REQUESTS, FIELD_AGENTS, BRANDS, DEFAULT_COMPANY_INFO } from '../data/portalData';
import { apiService } from '../services/apiService';

const PortalContext = createContext();

export const PortalProvider = ({ children }) => {
  // Company Info / Branding State
  const [companyInfo, setCompanyInfo] = useState(() => {
    const saved = localStorage.getItem('laptop_company_info');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.phone && (parsed.phone.includes('98450') || parsed.phone.includes('12345'))) {
        parsed.phone = "+91 89709 00825";
        parsed.whatsapp = "+91 89709 00825";
        localStorage.setItem('laptop_company_info', JSON.stringify(parsed));
      }
      return parsed;
    }
    return DEFAULT_COMPANY_INFO;
  });

  // Navigation State
  const [currentRoute, setCurrentRoute] = useState(window.location.hash.replace('#', '') || '/');

  // Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('laptop_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Modal Control States
  const [valuationModalOpen, setValuationModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedRequestForInspection, setSelectedRequestForInspection] = useState(null);

  // Portal Requests Pipeline State
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem('laptop_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  // Field Agents List State
  const [agents, setAgents] = useState(() => {
    const saved = localStorage.getItem('laptop_agents');
    return saved ? JSON.parse(saved) : FIELD_AGENTS;
  });

  // Notification Log State
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New laptop buyback request received from Harish Murthy (Bangalore)", time: "10 mins ago", type: "new" },
    { id: 2, text: "Suresh Gowda completed inspection for LB-9823", time: "1 hour ago", type: "success" }
  ]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('laptop_company_info', JSON.stringify(companyInfo));
  }, [companyInfo]);

  useEffect(() => {
    localStorage.setItem('laptop_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('laptop_agents', JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('laptop_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('laptop_user');
    }
  }, [currentUser]);

  // Update company branding details
  const updateCompanyInfo = (newDetails) => {
    setCompanyInfo(prev => ({ ...prev, ...newDetails }));
  };

  // Router helper
  const navigate = (path) => {
    window.location.hash = path;
    setCurrentRoute(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const path = window.location.hash.replace('#', '') || '/';
      setCurrentRoute(path);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Auth Methods
  const register = async (userData) => {
    try {
      const data = await apiService.register(userData);
      if (data.user) {
        setCurrentUser(data.user);
      }
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const login = async (role, password, email) => {
    try {
      const data = await apiService.login(role, password, email);
      setCurrentUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const googleLogin = async (googleProfile) => {
    try {
      const data = await apiService.googleLogin(googleProfile);
      setCurrentUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const data = await apiService.forgotPassword(email);
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const resetPasswordWithOtp = async (email, otp, newPassword) => {
    try {
      const data = await apiService.resetPasswordWithOtp(email, otp, newPassword);
      if (data.success === false) throw new Error(data.message || 'Failed to reset password.');
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  // Instant Quote Calculator Engine
  const calculateQuote = ({ brand, processor, ram, storage, condition, age }) => {
    let base = 25000;
    const matchedBrand = BRANDS.find(b => b.name.toLowerCase().includes((brand || '').toLowerCase()));
    if (matchedBrand) base = matchedBrand.basePrice;

    let cpuMult = 1.0;
    if (processor.includes('i7') || processor.includes('Ryzen 7') || processor.includes('M1 Pro') || processor.includes('M2')) cpuMult = 1.35;
    else if (processor.includes('i9') || processor.includes('Ryzen 9') || processor.includes('M1 Max') || processor.includes('M3')) cpuMult = 1.6;
    else if (processor.includes('i3') || processor.includes('Ryzen 3') || processor.includes('Celeron')) cpuMult = 0.75;

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

    const estimated = Math.round(base * cpuMult * condMult * ageMult);
    return Math.max(3000, estimated);
  };

  // Add new Buyback Request
  const createBuybackRequest = (formData) => {
    const estimatedPrice = calculateQuote({
      brand: formData.brand,
      processor: formData.processor,
      ram: formData.ram,
      storage: formData.storage,
      condition: formData.condition,
      age: formData.age || '1-2 Years'
    });

    const newReq = {
      id: `LB-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: {
        name: formData.name,
        phone: formData.phone,
        altPhone: formData.altPhone || '',
        email: formData.email || '',
        address: formData.address || '',
        city: formData.city || 'Bangalore',
        pincode: formData.pincode || '560001'
      },
      device: {
        type: formData.deviceType || 'Laptop',
        brand: formData.brand,
        model: formData.model || 'Standard Edition',
        processor: formData.processor || 'Intel Core i5',
        ram: formData.ram || '8GB',
        storage: formData.storage || '512GB SSD',
        age: formData.age || '1-2 Years',
        condition: formData.condition || 'Good',
        accessories: formData.accessories || ['Charger'],
        expectedPrice: parseInt(formData.expectedPrice) || estimatedPrice
      },
      status: 'New Request',
      assignedAgentId: null,
      assignedAgentName: 'Unassigned',
      date: new Date().toISOString().split('T')[0],
      estimatedPrice,
      finalOfferPrice: 0,
      remarks: '',
      inspection: null
    };

    setRequests(prev => [newReq, ...prev]);
    setNotifications(prev => [
      { id: Date.now(), text: `New ${newReq.device.brand} request from ${newReq.customer.name} (${newReq.customer.city})`, time: 'Just now', type: 'new' },
      ...prev
    ]);

    apiService.submitRequest(newReq);
    return newReq;
  };

  const assignAgent = (requestId, agentId) => {
    const agent = agents.find(a => a.id === agentId);
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          assignedAgentId: agentId,
          assignedAgentName: agent ? agent.name : 'Assigned Agent',
          status: 'Assigned'
        };
      }
      return req;
    }));
  };

  const updateRequestStatus = (requestId, newStatus) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return { ...req, status: newStatus };
      }
      return req;
    }));
  };

  const submitInspectionReport = (requestId, inspectionData, finalOffer, grade, remarks) => {
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'Offer Submitted',
          finalOfferPrice: parseInt(finalOffer) || req.estimatedPrice,
          remarks: remarks || 'Inspection completed by agent.',
          inspection: inspectionData,
          device: { ...req.device, condition: grade }
        };
      }
      return req;
    }));
  };

  const deleteRequest = (requestId) => {
    setRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const addAgent = async (agentData) => {
    const newAgent = {
      id: `agent-${Date.now()}`,
      name: agentData.name,
      phone: agentData.phone,
      city: agentData.city || 'Bangalore',
      activeRequests: 0,
      completedRequests: 0,
      rating: 5.0,
      status: 'Active'
    };
    setAgents(prev => [...prev, newAgent]);
    await apiService.createAgent(agentData);
  };

  const deleteAgent = async (agentId) => {
    setAgents(prev => prev.filter(a => a.id !== agentId));
    await apiService.deleteAgent(agentId);
  };

  return (
    <PortalContext.Provider value={{
      currentRoute,
      navigate,
      currentUser,
      register,
      login,
      googleLogin,
      forgotPassword,
      resetPasswordWithOtp,
      logout,
      requests,
      agents,
      notifications,
      valuationModalOpen,
      setValuationModalOpen,
      authModalOpen,
      setAuthModalOpen,
      selectedRequestForInspection,
      setSelectedRequestForInspection,
      calculateQuote,
      createBuybackRequest,
      assignAgent,
      updateRequestStatus,
      submitInspectionReport,
      deleteRequest,
      addAgent,
      deleteAgent,
      COMPANY_INFO: companyInfo,
      updateCompanyInfo
    }}>
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => useContext(PortalContext);
