import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API Base Configuration
const API_BASE_URL = 'http://localhost:8080';

// Create axios instance with default configuration
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add JWT token to all requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  (error: AxiosError) => {
    console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data);
    
    // Handle common error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/signin';
    } else if (error.response?.status === 403) {
      console.error('Access forbidden');
    } else if (error.response && error.response.status >= 500) {
      console.error('Server error occurred');
    }
    
    return Promise.reject(error);
  }
);

// Utility functions for API calls
export const apiClient = {
  // Generic GET request
  get: <T = any>(url: string, params?: any): Promise<AxiosResponse<T>> => {
    return api.get(url, { params });
  },

  // Generic POST request
  post: <T = any>(url: string, data?: any): Promise<AxiosResponse<T>> => {
    return api.post(url, data);
  },

  // Generic PUT request
  put: <T = any>(url: string, data?: any): Promise<AxiosResponse<T>> => {
    return api.put(url, data);
  },

  // Generic DELETE request
  delete: <T = any>(url: string): Promise<AxiosResponse<T>> => {
    return api.delete(url);
  },
};

// Token management utilities
export const tokenUtils = {
  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },
  
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
  
  removeToken: () => {
    localStorage.removeItem('token');
  },
  
  isTokenValid: (): boolean => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      // Simple JWT token validation (check if it's not expired)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }
};

// User management utilities
export const userUtils = {
  setUser: (user: any) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  removeUser: () => {
    localStorage.removeItem('user');
  }
};

export default api;