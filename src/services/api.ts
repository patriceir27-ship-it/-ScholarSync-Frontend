import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Auth Service
export const authService = {
  registerStudent: (data: any) => api.post('/auth/register/student', data),
  registerSponsor: (data: any) => api.post('/auth/register/sponsor', data),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken })
}

// Student Service
export const studentService = {
  getProfile: () => api.get('/student/profile'),
  updateProfile: (data: any) => api.put('/student/profile', data),
  getRecommendations: () => api.get('/student/recommendations'),
  uploadDocument: (data: any) => api.post('/student/documents', data)
}

// Scholarship Service
export const scholarshipService = {
  search: (query: any) => api.get('/scholarship/search', { params: query }),
  getById: (id: string) => api.get(`/scholarship/${id}`)
}

// Application Service
export const applicationService = {
  apply: (data: any) => api.post('/application/apply', data),
  getMyApplications: () => api.get('/application/my-applications')
}

// Sponsor Service
export const sponsorService = {
  getDashboard: () => api.get('/sponsor/dashboard/analytics'),
  getApplicants: () => api.get('/sponsor/applicants')
}

// Chatbot Service
export const chatbotService = {
  sendMessage: (message: string) => api.post('/chatbot/message', { message }),
  generateEssay: (topic: string) => api.post('/chatbot/generate-essay', { topic })
}

export default api
