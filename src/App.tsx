import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { 
  LandingPage, 
  SignInPage, 
  SignUpPage, 
  DashboardPage,
  LinkedListPage,
  StackPage,
  QueuePage
} from './pages';

/**
 * App Routes Component
 * Handles routing logic with authentication checks
 */
const AppRoutes: React.FC = () => {
  const { user, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/" 
        element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} 
      />
      <Route 
        path="/signin" 
        element={user ? <Navigate to="/dashboard" replace /> : <SignInPage />} 
      />
      <Route 
        path="/signup" 
        element={user ? <Navigate to="/dashboard" replace /> : <SignUpPage />} 
      />

      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />

      {/* Data Structure routes */}
      <Route 
        path="/linkedlist" 
        element={
          <ProtectedRoute>
            <LinkedListPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/linkedlist/:sessionId" 
        element={
          <ProtectedRoute>
            <LinkedListPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/stack" 
        element={
          <ProtectedRoute>
            <StackPage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/stack/:sessionId" 
        element={
          <ProtectedRoute>
            <StackPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/queue" 
        element={
          <ProtectedRoute>
            <QueuePage />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/queue/:sessionId" 
        element={
          <ProtectedRoute>
            <QueuePage />
          </ProtectedRoute>
        } 
      />

      {/* Catch all route */}
      <Route 
        path="*" 
        element={<Navigate to="/" replace />} 
      />
    </Routes>
  );
};

/**
 * Main App Component
 * Root component with providers and routing setup
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-dark-950">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;