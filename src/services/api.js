// API Service for WorkZen HRMS
const API_BASE_URL = 'http://localhost:8000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// API Service
export const api = {
  // ============ AUTHENTICATION ============
  
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      
      // Handle different error formats
      if (error.error) {
        // If error is an object with field-specific errors
        if (typeof error.error === 'object') {
          const errorMessages = Object.entries(error.error)
            .map(([field, messages]) => {
              const msgArray = Array.isArray(messages) ? messages : [messages];
              return `${field}: ${msgArray.join(', ')}`;
            })
            .join('\n');
          throw new Error(errorMessages);
        }
        throw new Error(error.error);
      }
      
      throw new Error(error.detail || 'Registration failed');
    }

    const result = await response.json();
    
    // Backend returns: { success: true, data: { user_id, username, role, _id }, message }
    // Registration doesn't return tokens, user needs to login
    return result;
  },

  login: async (emailOrUsername, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: emailOrUsername,  // Send as email (backend accepts both)
        username: emailOrUsername,  // Also send as username for compatibility
        password 
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Login failed' }));
      throw new Error(error.error || error.detail || 'Invalid credentials');
    }

    const result = await response.json();
    
    // Backend returns: { success: true, data: { access, refresh, user }, message }
    if (result.success && result.data) {
      // Store tokens
      localStorage.setItem('access_token', result.data.access);
      localStorage.setItem('refresh_token', result.data.refresh);
      localStorage.setItem('user', JSON.stringify(result.data.user));
      
      return result.data; // Return { access, refresh, user }
    }
    
    throw new Error('Invalid response format');
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  },

  // ============ USERS/EMPLOYEES ============
  
  getUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/list/`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const result = await response.json();
    
    // Backend returns: { success: true, data: [...users], count: N }
    if (result.success && result.data) {
      return result.data;
    }
    
    return [];
  },

  createUser: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create user');
    }

    return response.json();
  },

  updateUser: async (userId, userData) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    return response.json();
  },

  deleteUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }

    return true;
  },

  // ============ ATTENDANCE ============
  
  markAttendance: async (data) => {
    const response = await fetch(`${API_BASE_URL}/attendance/mark/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to mark attendance');
    }

    return response.json();
  },

  getMyAttendance: async () => {
    const response = await fetch(`${API_BASE_URL}/attendance/my/`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch attendance');
    }

    return response.json();
  },

  // ============ LEAVES ============
  
  applyLeave: async (leaveData) => {
    const response = await fetch(`${API_BASE_URL}/leaves/apply/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(leaveData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to apply leave');
    }

    return response.json();
  },

  getMyLeaves: async () => {
    const response = await fetch(`${API_BASE_URL}/leaves/my/`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch leaves');
    }

    return response.json();
  },

  // ============ PAYROLL ============
  
  getMyPayslips: async () => {
    const response = await fetch(`${API_BASE_URL}/payroll/my/`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payslips');
    }

    return response.json();
  },
};

export default api;
