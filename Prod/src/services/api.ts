// src/services/api.ts

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  phone?: string;
  department?: string;
  designation?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: 'Admin' | 'HR' | 'Employee' | 'Payroll';
  department: string | null;
  designation: string | null;
  salary: number | null;
  phone: string | null;
  join_date: string;
  status: string;
}

export interface Attendance {
  id: number;
  user: number;
  user_name: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  hours_worked: number | null;
  status: 'Present' | 'Absent' | 'Leave' | 'Half-Day';
  notes: string | null;
}

export interface Leave {
  id: number;
  user: number;
  user_name: string;
  leave_type: 'Sick' | 'Casual' | 'Vacation';
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  applied_at: string;
}

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// API Service
export const api = {
  // ============ AUTHENTICATION ============
  
  // Register new user
  register: async (data: RegisterData): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      // Handle validation errors
      const errorMessage = error.username?.[0] || 
                          error.email?.[0] || 
                          error.password?.[0] || 
                          error.detail || 
                          'Registration failed';
      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    
    // Store tokens just like login
    localStorage.setItem('access_token', responseData.access);
    localStorage.setItem('refresh_token', responseData.refresh);
    localStorage.setItem('user', JSON.stringify(responseData.user));
    
    return responseData;
  }, // <- Fixed: Added closing brace and comma

  // Login existing user
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Login failed' }));
      throw new Error(error.error || 'Invalid credentials');
    }

    const data = await response.json();
    
    // Store tokens in localStorage
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  // Get current logged in user
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  },

  // ============ PROFILE ============
  getProfile: async (): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  },

  // ============ DASHBOARD ============
  getDashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/dashboard/`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard');
    }

    return response.json();
  },

  // ============ ATTENDANCE ============
  markAttendance: async (data: { check_in?: string; check_out?: string }) => {
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

  getMyAttendance: async (): Promise<Attendance[]> => {
    const response = await fetch(`${API_BASE_URL}/attendance/my/`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch attendance');
    }

    return response.json();
  },

  // ============ LEAVES ============
  applyLeave: async (leaveData: {
    leave_type: string;
    start_date: string;
    end_date: string;
    reason: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/leaves/apply/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(leaveData),
    });

    if (!response.ok) {
      throw new Error('Failed to apply leave');
    }

    return response.json();
  },

  getMyLeaves: async (): Promise<Leave[]> => {
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
