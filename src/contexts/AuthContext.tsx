import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginRequest, SignupRequest } from '../types';
import { authService } from '../services/authService';

// Auth Context Actions
type AuthAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SIGNUP_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'SIGNUP_FAILURE'; payload: string }
  | { type: 'INIT_AUTH'; payload: { user: User; token: string } | null };

// Auth Context Interface
interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<{ success: boolean; message: string }>;
  signup: (userData: SignupRequest) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

// Initial Auth State
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case 'LOGIN_SUCCESS':
    case 'SIGNUP_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    
    case 'LOGIN_FAILURE':
    case 'SIGNUP_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    
    case 'INIT_AUTH':
      if (action.payload) {
        return {
          ...state,
          user: action.payload.user,
          token: action.payload.token,
          isAuthenticated: true,
          isLoading: false,
        };
      } else {
        return {
          ...state,
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        };
      }
    
    default:
      return state;
  }
};

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider Component
 * Provides authentication state and methods to the entire app
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize authentication on app load
  useEffect(() => {
    const initializeAuth = () => {
      console.log('🔐 Initializing authentication...');
      
      const token = authService.getToken();
      const user = authService.getCurrentUser();
      
      if (token && user && authService.isAuthenticated()) {
        console.log('✅ User already authenticated:', user);
        dispatch({
          type: 'INIT_AUTH',
          payload: { user, token }
        });
      } else {
        console.log('❌ No valid authentication found');
        // Clean up any invalid tokens
        authService.logout();
        dispatch({ type: 'INIT_AUTH', payload: null });
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login function
   * @param credentials - User login credentials
   * @returns Promise with success status and message
   */
  const login = async (credentials: LoginRequest): Promise<{ success: boolean; message: string }> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      console.log('🔐 Attempting login for user:', credentials.username);
      
      const response = await authService.signin(credentials);
      
      if (response.success) {
        if (response.token && response.user) {
          console.log('✅ Login successful for user:', response.user);
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: response.user,
              token: response.token
            }
          });
          return { success: true, message: response.message || 'Login successful' };
        } else {
          // Success but missing token/user data
          console.log('❌ Login response missing data:', response);
          dispatch({ type: 'LOGIN_FAILURE', payload: 'Login failed - invalid response from server' });
          return { success: false, message: 'Login failed - invalid response from server' };
        }
      } else {
        console.log('❌ Login failed:', response.message);
        dispatch({ type: 'LOGIN_FAILURE', payload: response.message || 'Login failed' });
        return { success: false, message: response.message || 'Login failed' };
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      const message = error.message || 'Login failed. Please try again.';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      return { success: false, message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  /**
   * Signup function
   * @param userData - User signup data
   * @returns Promise with success status and message
   */
  const signup = async (userData: SignupRequest): Promise<{ success: boolean; message: string }> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      console.log('📝 Attempting signup for user:', userData.username);
      
      const response = await authService.signup(userData);
      
      if (response.success) {
        console.log('✅ Signup successful:', response.message);
        // Note: No auto-login after registration - user must sign in separately
        return { success: true, message: response.message };
      } else {
        console.log('❌ Signup failed:', response.message);
        dispatch({ type: 'SIGNUP_FAILURE', payload: response.message });
        return { success: false, message: response.message };
      }
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      const message = error.message || 'Signup failed. Please try again.';
      dispatch({ type: 'SIGNUP_FAILURE', payload: message });
      return { success: false, message };
    }
  };

  /**
   * Logout function
   * Clears authentication state and local storage
   */
  const logout = (): void => {
    console.log('🚪 Logging out user...');
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  // Context value
  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth Hook
 * Custom hook to access authentication context
 * @returns AuthContextType
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};