import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (email, password) => 
    api.post('/users/login/', { email, password }),
  
  register: (userData) => 
    api.post('/users/register/', userData),
  
  getCurrentUser: () => 
    api.get('/users/me/'),
  
  logout: () => {
    localStorage.clear();
  },
};

// User APIs
export const userAPI = {
  getAll: () => api.get('/users/'),
  getById: (id) => api.get(`/users/${id}/`),
  create: (data) => api.post('/users/', data),
  update: (id, data) => api.put(`/users/${id}/`, data),
  delete: (id) => api.delete(`/users/${id}/`),
};

// Attendance APIs
export const attendanceAPI = {
  getAll: (params) => api.get('/attendance/attendance/', { params }),
  getMyAttendance: (month, year) => 
    api.get('/attendance/attendance/my_attendance/', { params: { month, year } }),
  getStatistics: (month, year, employeeId) => 
    api.get('/attendance/attendance/statistics/', { params: { month, year, employee_id: employeeId } }),
  mark: (data) => api.post('/attendance/attendance/', data),
  update: (id, data) => api.put(`/attendance/attendance/${id}/`, data),
};

// Leave APIs
export const leaveAPI = {
  getAll: (params) => api.get('/leaves/requests/', { params }),
  getMyBalance: (year) => 
    api.get('/leaves/balances/my_balance/', { params: { year } }),
  create: (data) => api.post('/leaves/requests/', data),
  approve: (id, comments) => 
    api.post(`/leaves/requests/${id}/approve/`, { comments }),
  reject: (id, comments) => 
    api.post(`/leaves/requests/${id}/reject/`, { comments }),
};

// Payroll APIs
export const payrollAPI = {
  getPayslips: () => api.get('/payroll/payslips/'),
  getMyPayslips: () => api.get('/payroll/payslips/my_payslips/'),
  getPayruns: () => api.get('/payroll/payruns/'),
};

// Analytics APIs
export const analyticsAPI = {
  getSentiment: () => api.get('/analytics/sentiment/'),
  getAttrition: () => api.get('/analytics/attrition/'),
  getAwards: () => api.get('/analytics/awards/'),
};

export default api;
