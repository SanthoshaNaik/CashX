import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_REQUESTS, BRANDS, DEFAULT_COMPANY_INFO, CATEGORIES, MACMINI_MODELS } from '../data/portalData';
import { apiService } from '../services/apiService';

const PortalContext = createContext();

export const PortalProvider = ({ children }) => {
  // Company Info / Branding State
  const [companyInfo, setCompanyInfo] = useState(() => {
    const saved = localStorage.getItem('laptop_company_info');
    if (saved) {
      const parsed = JSON.parse(saved);
      parsed.name = "TheCashX";
      parsed.email = "thecashx26@gmail.com";
      parsed.websiteUrl = "https://www.thecashx.com";
      parsed.phone = "+91 821 746 4709";
      parsed.whatsapp = "+91 821 746 4709";
      parsed.address = "NGR complex Arekere Bannerghatta Road Bengaluru pin code 560076";
      localStorage.setItem('laptop_company_info', JSON.stringify(parsed));
      return parsed;
    }
    return DEFAULT_COMPANY_INFO;
  });

  // Navigation State
  const [currentRoute, setCurrentRoute] = useState(window.location.hash.replace('#', '') || '/');

  // Theme State ('light' | 'dark')
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('cashx_theme');
    return saved ? saved : 'light';
  });

  // Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('laptop_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Modal Control States
  const [valuationModalOpen, setValuationModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Portal Requests Pipeline State
  const [requests, setRequests] = useState(() => {
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

  // Real-time synchronization: listen to storage and in-app custom events
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'laptop_requests' && e.newValue) {
        setRequests(JSON.parse(e.newValue));
      }
    };

    const handleCustomEvent = (e) => {
      if (e.detail) {
        setRequests(e.detail);
      } else {
        const saved = localStorage.getItem('laptop_requests');
        if (saved) setRequests(JSON.parse(saved));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cashx_orders_updated', handleCustomEvent);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cashx_orders_updated', handleCustomEvent);
    };
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('laptop_company_info', JSON.stringify(companyInfo));
  }, [companyInfo]);

  useEffect(() => {
    localStorage.setItem('laptop_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cashx_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

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
    setCategoryModalOpen(false);
    setValuationModalOpen(false);
    setAuthModalOpen(false);
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

  const loginWithPhone = (phone, name) => {
    const cleanName = name && name.trim() ? name.trim() : `User (+91 ${phone.slice(0, 5)} ${phone.slice(5)})`;
    const userObj = {
      phone,
      fullName: cleanName,
      email: '',
      role: 'CUSTOMER',
      id: `usr-${phone}`,
      joinedDate: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    };
    setCurrentUser(userObj);
    localStorage.setItem('laptop_user', JSON.stringify(userObj));
    return userObj;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('laptop_user');
    navigate('/');
  };

  // Instant Quote Calculator Engine
  const calculateQuote = ({ deviceType = 'Laptop', brand = '', model = '', processor = '', ram = '', storage = '', condition = 'Good', age = '1-2 Years' }) => {
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
      // Laptop
      const matchedBrand = BRANDS.find(b => b.name.toLowerCase().includes((brand || '').toLowerCase()));
      if (matchedBrand) base = matchedBrand.basePrice;

      let cpuMult = 1.0;
      if (processor.includes('i7') || processor.includes('Ryzen 7') || processor.includes('M1 Pro') || processor.includes('M2')) cpuMult = 1.35;
      else if (processor.includes('i9') || processor.includes('Ryzen 9') || processor.includes('M1 Max') || processor.includes('M3') || processor.includes('M4')) cpuMult = 1.6;
      else if (processor.includes('i3') || processor.includes('Ryzen 3') || processor.includes('Celeron')) cpuMult = 0.75;
      base = Math.round(base * cpuMult);
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

    const estimated = Math.round(base * condMult * ageMult);
    return Math.max(3000, estimated);
  };

  // Add new Buyback Request
  const createBuybackRequest = (formData) => {
    const estimatedPrice = calculateQuote({
      deviceType: formData.deviceType || 'Laptop',
      brand: formData.brand,
      model: formData.model,
      processor: formData.processor,
      ram: formData.ram,
      storage: formData.storage,
      condition: formData.condition,
      age: formData.age || '1-2 Years'
    });

    const newReq = {
      id: `LB-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: {
        name: formData.name || currentUser?.fullName || 'Valued Customer',
        phone: formData.phone || currentUser?.phone || '',
        altPhone: formData.altPhone || '',
        email: formData.email || currentUser?.email || '',
        address: formData.address || '',
        city: formData.city || 'Bangalore',
        pincode: formData.pincode || '560076'
      },
      device: {
        type: formData.deviceType || 'Laptop',
        brand: formData.brand || 'Generic',
        model: formData.model || 'Standard Edition',
        processor: formData.processor || 'Standard Spec',
        ram: formData.ram || '8GB',
        storage: formData.storage || '512GB SSD',
        age: formData.age || '1-2 Years',
        condition: formData.condition || 'Good',
        accessories: formData.accessories || ['Power Cable'],
        expectedPrice: parseInt(formData.expectedPrice) || estimatedPrice
      },
      status: 'New Request',
      assignedAgentId: null,
      assignedAgentName: 'Unassigned',
      assignedAgentPhone: null,
      scheduledDate: null,
      timeSlot: null,
      dispatchNotes: '',
      date: new Date().toISOString().split('T')[0],
      estimatedPrice,
      finalOfferPrice: 0,
      remarks: ''
    };

    setRequests(prev => {
      const updated = [newReq, ...prev];
      localStorage.setItem('laptop_requests', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('cashx_orders_updated', { detail: updated }));
      return updated;
    });

    apiService.submitRequest(newReq);
    return newReq;
  };

  // Cancel a buyback request by the user
  const cancelBuybackRequest = (requestId, reason = 'Cancelled by Customer') => {
    setRequests(prev => {
      const updated = prev.map(req => {
        if (req.id === requestId) {
          return {
            ...req,
            status: 'Cancelled',
            remarks: reason ? `Customer Cancellation Reason: ${reason}` : req.remarks
          };
        }
        return req;
      });
      localStorage.setItem('laptop_requests', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('cashx_orders_updated', { detail: updated }));
      return updated;
    });
  };

  return (
    <PortalContext.Provider value={{
      currentRoute,
      navigate,
      theme,
      toggleTheme,
      setTheme,
      currentUser,
      setCurrentUser,
      loginWithPhone,
      register,
      login,
      googleLogin,
      forgotPassword,
      resetPasswordWithOtp,
      logout,
      requests,
      valuationModalOpen,
      setValuationModalOpen,
      categoryModalOpen,
      setCategoryModalOpen,
      authModalOpen,
      setAuthModalOpen,
      calculateQuote,
      createBuybackRequest,
      cancelBuybackRequest,
      COMPANY_INFO: companyInfo,
      updateCompanyInfo
    }}>
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => useContext(PortalContext);
