import axios from 'axios'

/**
 * Axios instance pre-configured for the Doctor Appointment API.
 *
 * - Base URL points to Spring Boot backend
 * - Request interceptor: attaches JWT token from localStorage
 * - Response interceptor: handles 401 Unauthorized (auto-logout)
 */
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request Interceptor — attach JWT token to every outgoing request.
 * Token is stored in localStorage by AuthContext on login.
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('medbook_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

/**
 * Response Interceptor — handle common API errors globally.
 * 401 Unauthorized: clear storage and redirect to login.
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — force logout
      localStorage.removeItem('medbook_user')
      localStorage.removeItem('medbook_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
