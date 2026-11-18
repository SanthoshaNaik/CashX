const API_BASE = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? 'https://cashx-backend.onrender.com/api' : '/api')
).replace(/\/+$/, '');

const getAuthHeaders = (isAdmin = false) => {
  const token = isAdmin
    ? localStorage.getItem('cashx_admin_token')
    : localStorage.getItem('laptop_token') || localStorage.getItem('cashx_admin_token');
  
  const headers = { 'Content-Type': 'application/json' };
  if (token && token.startsWith('eyJ')) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const apiService = {
  // 1. Send OTP to Mobile Number
  async sendOtp(phone) {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const res = await fetch(`${API_BASE}/auth/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanPhone })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to send OTP.');
    }
    return data;
  },

  // 2. Verify OTP & Authenticate Customer
  async verifyOtp(phone, otp, fullName) {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const res = await fetch(`${API_BASE}/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanPhone, otp, fullName })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Invalid OTP entered.');
    }
    if (data.data?.token) {
      localStorage.setItem('laptop_token', data.data.token);
    }
    return data.data;
  },

  // 3. Register Customer with Email & Password
  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Registration failed.');
    }
    if (data.data?.token) {
      localStorage.setItem('laptop_token', data.data.token);
    }
    return data.data || data;
  },

  // 4. Customer Login with Email & Password
  async login(role, password, email) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Invalid email or password.');
    }
    if (data.data?.token) {
      localStorage.setItem('laptop_token', data.data.token);
    }
    return data.data || data;
  },

  // 5. Admin & Field Agent Login
  async adminLogin(email, password) {
    const res = await fetch(`${API_BASE}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Invalid admin credentials.');
    }
    if (data.data?.token) {
      localStorage.setItem('cashx_admin_token', data.data.token);
    }
    return data.data || data;
  },

  // 6. Google OAuth Login (Dev Fallback Mode)
  async googleLogin(googleProfile) {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        credential: googleProfile.email || googleProfile.idToken || 'google-user@thecashx.com',
        email: googleProfile.email,
        name: googleProfile.name,
        picture: googleProfile.picture
      })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Google sign-in failed.');
    }
    if (data.data?.token) {
      localStorage.setItem('laptop_token', data.data.token);
    }
    return data.data || data;
  },

  // 7. Forgot Password (Send OTP)
  async forgotPassword(email) {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to request password reset.');
    }
    return data;
  },

  // 8. Reset Password with OTP
  async resetPasswordWithOtp(email, otp, newPassword) {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to reset password.');
    }
    return data;
  },

  // 9. Calculate Instant Price Quote via Synthetic Pricing Engine
  async calculateQuote(specs) {
    const res = await fetch(`${API_BASE}/pricing/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(specs)
    });
    const data = await res.json();
    if (res.ok && data.success) {
      return data.data;
    }
    return null;
  },

  // 10. Submit Buyback Quote Request
  async submitRequest(requestData) {
    try {
      const payload = {
        customer: {
          name: requestData.customer?.name || 'Valued Customer',
          phone: (requestData.customer?.phone || '').replace(/\D/g, '').slice(-10) || '9876543210',
          altPhone: requestData.customer?.altPhone || null,
          email: requestData.customer?.email || 'customer@thecashx.com',
          address: requestData.customer?.address || 'Doorstep Pickup Address',
          city: requestData.customer?.city || 'Bangalore',
          pincode: requestData.customer?.pincode || '560076'
        },
        device: {
          type: requestData.device?.type || 'Laptop',
          brand: requestData.device?.brand || 'Dell',
          model: requestData.device?.model || 'Inspiron',
          processor: requestData.device?.processor || 'Intel Core i5',
          ram: requestData.device?.ram || '8GB',
          storage: requestData.device?.storage || '512GB SSD',
          condition: requestData.device?.condition || 'Good',
          age: requestData.device?.age || '1-2 Years',
          accessories: Array.isArray(requestData.device?.accessories)
            ? requestData.device.accessories.join(', ')
            : (requestData.device?.accessories || 'Original Charger'),
          expectedPrice: requestData.device?.expectedPrice || requestData.estimatedPrice || 0
        }
      };

      const res = await fetch(`${API_BASE}/requests`, {
        method: 'POST',
        headers: getAuthHeaders(false),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        return data.data || data;
      }
    } catch (e) {
      console.warn('Error submitting request to backend:', e);
    }
    return { success: true, data: requestData };
  },

  // 11. Fetch Logged-in Customer's Requests
  async getMyRequests() {
    try {
      const res = await fetch(`${API_BASE}/requests/my`, {
        headers: getAuthHeaders(false)
      });
      if (res.ok) {
        const data = await res.json();
        return data.data || [];
      }
    } catch (e) {
      console.warn('Error fetching customer requests:', e);
    }
    return [];
  },

  // 12. Cancel Customer Buyback Request
  async cancelRequest(requestId, reason = 'Cancelled by Customer') {
    const res = await fetch(`${API_BASE}/requests/${requestId}/cancel`, {
      method: 'PATCH',
      headers: getAuthHeaders(false),
      body: JSON.stringify({ reason })
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to cancel request.');
    }
    return data.data || data;
  },

  // 13. Admin: Fetch All Orders
  async getAdminOrders(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);

      const url = `${API_BASE}/admin/orders${params.toString() ? '?' + params.toString() : ''}`;
      const res = await fetch(url, {
        headers: getAuthHeaders(true)
      });
      if (res.ok) {
        const data = await res.json();
        return data.data || [];
      }
    } catch (e) {
      console.warn('Error fetching admin orders:', e);
    }
    return [];
  },

  // 14. Admin: Schedule Field Agent
  async scheduleOrder(orderId, scheduleData) {
    const res = await fetch(`${API_BASE}/admin/orders/${orderId}/schedule`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: JSON.stringify(scheduleData)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to schedule agent.');
    }
    return data.data || data;
  },

  // 15. Admin: Update Order Status
  async updateOrderStatus(orderId, statusData) {
    const res = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(true),
      body: JSON.stringify(statusData)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to update status.');
    }
    return data.data || data;
  },

  // 16. Admin: Overview Statistics
  async getAdminOverview() {
    try {
      const res = await fetch(`${API_BASE}/admin/overview`, {
        headers: getAuthHeaders(true)
      });
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch (e) {
      console.warn('Error fetching admin overview:', e);
    }
    return null;
  },

  // 17. Admin: Get Field Agents Fleet
  async getAgents(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);

      const url = `${API_BASE}/admin/agents${params.toString() ? '?' + params.toString() : ''}`;
      const res = await fetch(url, {
        headers: getAuthHeaders(true)
      });
      if (res.ok) {
        const data = await res.json();
        return data.data || [];
      }
    } catch (e) {
      console.warn('Error fetching agents:', e);
    }
    return [];
  },

  // 18. Admin: Create New Field Agent
  async createAgent(agentData) {
    const res = await fetch(`${API_BASE}/admin/agents`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: JSON.stringify(agentData)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to create field agent.');
    }
    return data.data || data;
  },

  // 19. Admin: Update Field Agent
  async updateAgent(agentId, agentData) {
    const res = await fetch(`${API_BASE}/admin/agents/${agentId}`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: JSON.stringify(agentData)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to update agent.');
    }
    return data.data || data;
  },

  // 20. Admin: Delete Field Agent
  async deleteAgent(agentId) {
    const res = await fetch(`${API_BASE}/admin/agents/${agentId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(true)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to delete agent.');
    }
    return data;
  },

  // 21. Field Agent: Get Assigned Orders Queue
  async getAgentOrders() {
    try {
      const res = await fetch(`${API_BASE}/agent/orders`, {
        headers: getAuthHeaders(true)
      });
      if (res.ok) {
        const data = await res.json();
        return data.data || [];
      }
    } catch (e) {
      console.warn('Error fetching agent orders:', e);
    }
    return [];
  },

  // 22. Field Agent: Save On-Site Inspection & Final Payout
  async saveInspection(orderId, inspectionData) {
    const res = await fetch(`${API_BASE}/agent/orders/${orderId}/inspection`, {
      method: 'PUT',
      headers: getAuthHeaders(true),
      body: JSON.stringify(inspectionData)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to submit inspection.');
    }
    return data.data || data;
  },

  // 23. Field Agent: Get Profile & Stats
  async getAgentProfile() {
    try {
      const res = await fetch(`${API_BASE}/agent/profile`, {
        headers: getAuthHeaders(true)
      });
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch (e) {
      console.warn('Error fetching agent profile:', e);
    }
    return null;
  },

  // 24. Public: Submit Contact Inquiry
  async submitContact(contactData) {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to send message.');
    }
    return data;
  },

  // 25. Public: Fetch Dynamic Company Info
  async getCompanyInfo() {
    try {
      const res = await fetch(`${API_BASE}/company/info`);
      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch (e) {
      console.warn('Error fetching company info:', e);
    }
    return null;
  }
};
