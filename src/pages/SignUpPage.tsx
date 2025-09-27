import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Lock, Mail } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name] || errors.submit) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        delete newErrors.submit;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
   setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const result = await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        console.log('✅ Signup successful, navigating to signin.');
        // Navigate immediately on success. The component will unmount, so no further state updates are needed.
        navigate('/signin', { 
          replace: true, 
          state: { successMessage: 'Account created successfully! Please sign in.' }
        });
      } else {
        // If the API returns a failure message without throwing an error
        setErrors({ submit: result.message || 'An unknown error occurred.' });
        setIsSubmitting(false); // Stop loading on failure
      }
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      // Handle errors thrown by the API call (e.g., network error, 409 Conflict)
      const message = error?.response?.data?.message || 'Could not connect to the server. Please try again.';
      setErrors({ submit: message });
      setIsSubmitting(false); // Stop loading on exception
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-teal-600 rounded-lg flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-100">
            Join AlgoPulse
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Create your account to start visualizing data structures
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
              placeholder="Choose a username"
            />
            
            <Input
              label="Email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              icon={<Mail className="h-5 w-5" />}
              placeholder="Enter your email"
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
              placeholder="Create a password"
            />
            
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
              icon={<Lock className="h-5 w-5" />}
              placeholder="Confirm your password"
            />
          </div>

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
            loading={isSubmitting}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link
                to="/signin"
                className="font-medium text-teal-400 hover:text-teal-300 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};