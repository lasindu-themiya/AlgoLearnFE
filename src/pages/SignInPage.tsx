import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, User, Lock } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';

/**
 * SignIn Page Component
 * User authentication page with login form
 */
export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Check for success message from navigation state (e.g., after successful signup)
  useEffect(() => {
    const state = location.state as { successMessage?: string };
    if (state?.successMessage) {
      setSuccessMessage(state.successMessage);
      // Clear the state to prevent showing the message on refresh
      navigate(location.pathname, { replace: true });
      
      // Auto-clear success message after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location.state, navigate, location.pathname]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error and success messages when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setErrors({}); // Clear any previous errors
    setSuccessMessage(''); // Clear any success messages
    
    try {
      const result = await login({
        username: formData.username,
        password: formData.password
      });
      
      if (result.success) {
        console.log('✅ Login successful, redirecting to dashboard');
        navigate('/dashboard', { replace: true });
      } else {
        console.log('❌ Login failed in SignInPage:', result.message);
        setErrors({ submit: result.message || 'Login failed. Please try again.' });
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-teal-600 rounded-lg flex items-center justify-center">
            <LogIn className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-100">
            Sign in to AlgoLearn
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Welcome back! Please sign in to continue
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleInputChange}
              error={errors.username}
              icon={<User className="h-5 w-5" />}
              placeholder="Enter your username"
            />
            
            <Input
              label="Password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              icon={<Lock className="h-5 w-5" />}
              placeholder="Enter your password"
            />
          </div>

          {successMessage && (
            <div className="bg-green-900/20 border border-green-500 rounded-md p-3">
              <p className="text-sm text-green-400">
                {successMessage}
              </p>
            </div>
          )}

          {errors.submit && (
            <div className="bg-red-900/20 border border-red-500 rounded-md p-3">
              <p className="text-sm text-red-400">
                {errors.submit}
              </p>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            loading={isSubmitting || isLoading}
            disabled={isSubmitting || isLoading}
            className="w-full"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-medium text-teal-400 hover:text-teal-300 transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};