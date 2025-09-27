import { apiClient, tokenUtils, userUtils } from './api';
import { LoginRequest, SignupRequest, AuthResponse, User } from '../types';

/**
 * Authentication Service
 * Handles all authentication-related API calls including signin, signup, and logout
 */
export class AuthService {
  
  /**
   * User signin with username and password
   * @param credentials - Login credentials
   * @returns Promise with authentication response
   */
  async signin(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
      
      if (response.data.success && response.data.token) {
        // Store token and user data
        tokenUtils.setToken(response.data.token);
        if (response.data.user) {
          userUtils.setUser(response.data.user);
        }
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Signin error:', error);
      
      // Handle different types of errors
      let errorMessage = 'Signin failed. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  /**
   * User signup with username and password
   * @param userData - Signup data
   * @returns Promise with authentication response
   */
  async signup(userData: SignupRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/api/auth/register', userData);
      
      // Note: Registration no longer returns token - user must login separately
      return response.data;
    } catch (error: any) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed. Please try again.',
      };
    }
  }

  /**
   * User logout - clears local storage and token
   */
  logout(): void {
    tokenUtils.removeToken();
    userUtils.removeUser();
    console.log('User logged out successfully');
  }

  /**
   * Check if user is currently authenticated
   * @returns boolean indicating authentication status
   */
  isAuthenticated(): boolean {
    return tokenUtils.isTokenValid();
  }

  /**
   * Get current user from local storage
   * @returns User object or null
   */
  getCurrentUser(): User | null {
    return userUtils.getUser();
  }

  /**
   * Get current auth token
   * @returns JWT token string or null
   */
  getToken(): string | null {
    return tokenUtils.getToken();
  }
}

// Export singleton instance
export const authService = new AuthService();