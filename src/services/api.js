// src/services/api.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  googleAuth: (googleData) => apiClient.post('/auth/google-auth', { googleData }),
  resetPassword: (email, newPassword) => apiClient.post('/auth/reset-password', { email, newPassword }),
};

// Application Service
export const applicationService = {
  submit: (data) => apiClient.post('/applications/submit', data),
  get: (applicationId) => apiClient.get(`/applications/${applicationId}`),
  list: (status, page, limit) =>
    apiClient.get('/applications', { params: { status, page, limit } }),
};

// Screening Service
export const screeningService = {
  evaluateCandidates: (applicationIds, ruleId) =>
    apiClient.post('/screening/evaluate-candidates', { application_ids: applicationIds, rule_id: ruleId }),
  applyRules: (ruleId) => apiClient.post('/screening/apply-rules', { rule_id: ruleId }),
  get: (screeningId) => apiClient.get(`/screening/${screeningId}`),
};

// Rules Service
export const rulesService = {
  create: (data) => apiClient.post('/rules/create', data),
  list: (active) => apiClient.get('/rules', { params: { active } }),
  update: (ruleId, data) => apiClient.put(`/rules/${ruleId}`, data),
  delete: (ruleId) => apiClient.delete(`/rules/${ruleId}`),
};

// Student Service
export const studentService = {
  get: (studentId) => apiClient.get(`/students/${studentId}`),
  updateAcademicProgress: (studentId, data) =>
    apiClient.put(`/students/${studentId}/academic-progress`, data),
  updateEmployment: (studentId, data) =>
    apiClient.put(`/students/${studentId}/employment`, data),
  updateISAPayment: (studentId, data) =>
    apiClient.put(`/students/${studentId}/isa-payment`, data),
  getLifecycle: (studentId) => apiClient.get(`/students/${studentId}/lifecycle`),
};

// Dashboard Service
export const dashboardService = {
  getMetrics: () => apiClient.get('/dashboard/metrics'),
  getAnalytics: () => apiClient.get('/dashboard/analytics'),
};

export default apiClient;
