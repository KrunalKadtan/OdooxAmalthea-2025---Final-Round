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
  getDashboardData: async () => {
    try {
      // Fetch all necessary data in parallel
      const [attendance, leaves, payslips, leaveBalance] = await Promise.all([
        api.getMyAttendance().catch(() => []),
        api.getMyLeaves().catch(() => []),
        api.getMyPayslips().catch(() => []),
        api.getLeaveBalance().catch(() => null),
      ]);

      // Calculate attendance stats for current month
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const thisMonthAttendance = attendance.filter((a: any) => {
        const date = new Date(a.date);
        return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
      });

      const attendanceStats = {
        present: thisMonthAttendance.filter((a: any) => a.status === 'Present').length,
        absent: thisMonthAttendance.filter((a: any) => a.status === 'Absent').length,
        total: thisMonthAttendance.length,
      };

      // Calculate leave stats
      const pendingLeaves = leaves.filter((l: any) => l.status === 'Pending').length;
      const approvedLeaves = leaves.filter((l: any) => l.status === 'Approved').length;

      // Get recent payslips (last 3)
      const recentPayslips = payslips.slice(0, 3);

      return {
        attendance: attendanceStats,
        leaves: {
          pending: pendingLeaves,
          approved: approvedLeaves,
          balance: leaveBalance,
        },
        payslips: recentPayslips,
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
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

  getMyAttendance: async (month?: number, year?: number): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/attendance/my/`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch attendance');
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },

  getAttendanceStatistics: async (month?: number, year?: number): Promise<any> => {
    // Calculate statistics from attendance data
    const response = await fetch(`${API_BASE_URL}/attendance/my/`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch attendance statistics');
    }

    const data = await response.json();
    const records = Array.isArray(data) ? data : [];
    
    // Calculate statistics
    const stats = {
      total_days: records.length,
      present: records.filter((r: any) => r.status === 'Present').length,
      absent: records.filter((r: any) => r.status === 'Absent').length,
      leave: records.filter((r: any) => r.status === 'Leave').length,
      half_day: records.filter((r: any) => r.status === 'Half-Day').length,
      wfh: records.filter((r: any) => r.status === 'Work-from-Home').length,
    };
    
    return stats;
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
      const error = await response.json().catch(() => ({ error: 'Failed to apply leave' }));
      throw new Error(error.error || error.detail || 'Failed to apply leave');
    }

    return response.json();
  },

  getMyLeaves: async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/leaves/my/`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch leaves');
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },

  getLeaveBalance: async (): Promise<any> => {
    // Calculate leave balance from leave records
    const leaves = await api.getMyLeaves();
    
    const currentYear = new Date().getFullYear();
    const thisYearLeaves = leaves.filter((leave: any) => {
      const leaveYear = new Date(leave.start_date).getFullYear();
      return leaveYear === currentYear && leave.status === 'Approved';
    });

    const sickDays = thisYearLeaves
      .filter((l: any) => l.leave_type === 'Sick')
      .reduce((sum: number, l: any) => sum + (l.total_days || 0), 0);
    
    const casualDays = thisYearLeaves
      .filter((l: any) => l.leave_type === 'Casual')
      .reduce((sum: number, l: any) => sum + (l.total_days || 0), 0);
    
    const vacationDays = thisYearLeaves
      .filter((l: any) => l.leave_type === 'Vacation')
      .reduce((sum: number, l: any) => sum + (l.total_days || 0), 0);

    return {
      sick: { total: 10, used: sickDays, remaining: 10 - sickDays },
      casual: { total: 12, used: casualDays, remaining: 12 - casualDays },
      vacation: { total: 15, used: vacationDays, remaining: 15 - vacationDays },
    };
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
