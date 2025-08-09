import axios from "axios"
import toast from "react-hot-toast"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      delete api.defaults.headers.common["Authorization"]
      window.location.href = "/login"
      toast.error("Session expired. Please login again.")
    } else if (error.response?.status === 403) {
      toast.error("Access denied. Insufficient permissions.")
    } else if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.")
    }

    return Promise.reject(error)
  },
)

export default api
