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
    const initAuth = () => {
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

    initAuth();
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
      
      const data = await authService.signin(credentials);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
      return { success: true, message: 'Login successful' };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      throw error; // Re-throw the error so the component can catch it
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
    // No dispatch here, signup does not log the user in.
    try {
      console.log('📝 Attempting signup for user:', userData.username);
      
      const data = await authService.signup(userData);
      // On success, just return the success status and message.
      // Do not dispatch any state changes.
      return { success: true, message: data.message };
    } catch (error: any) {
      // On failure, just return the failure status and message.
      throw error; // Re-throw for the component to handle.
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