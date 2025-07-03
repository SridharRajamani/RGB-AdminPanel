import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../AppIcon';

const ProtectedRoute = ({ children, requiredPermission = null, fallback = null }) => {
  const { user, loading, hasPermission } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Icon name="Loader2" size={32} className="text-white animate-spin" />
          </div>
          <h2 className="text-lg font-heading font-semibold text-text-primary mb-2">
            Loading...
          </h2>
          <p className="text-text-secondary">
            Checking authentication status
          </p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user account is active
  if (user.status !== 'active') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-error/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon name="UserX" size={32} className="text-error" />
          </div>
          <h2 className="text-xl font-heading font-semibold text-text-primary mb-2">
            Account Inactive
          </h2>
          <p className="text-text-secondary mb-6">
            Your account has been deactivated. Please contact the system administrator for assistance.
          </p>
          <button
            onClick={() => {
              const { logout } = useAuth();
              logout();
            }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Icon name="LogOut" size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    );
  }

  // Check specific permission if required
  if (requiredPermission && !hasPermission(requiredPermission)) {
    // Show fallback component if provided
    if (fallback) {
      return fallback;
    }

    // Default unauthorized access page
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-warning/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon name="Shield" size={32} className="text-warning" />
          </div>
          <h2 className="text-xl font-heading font-semibold text-text-primary mb-2">
            Access Denied
          </h2>
          <p className="text-text-secondary mb-6">
            You don't have permission to access this page. Contact your administrator if you believe this is an error.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 bg-surface border border-border text-text-primary rounded-lg hover:bg-surface-secondary transition-colors"
            >
              <Icon name="ArrowLeft" size={16} />
              <span>Go Back</span>
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Icon name="Home" size={16} />
              <span>Go to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated and has required permissions
  return children;
};

// Higher-order component for easier usage
export const withAuth = (Component, requiredPermission = null) => {
  return function AuthenticatedComponent(props) {
    return (
      <ProtectedRoute requiredPermission={requiredPermission}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

// Component to check multiple permissions (user needs ALL of them)
export const ProtectedRouteMultiple = ({ children, requiredPermissions = [], requireAll = true }) => {
  const { hasPermission } = useAuth();

  const hasAccess = requireAll
    ? requiredPermissions.every(permission => hasPermission(permission))
    : requiredPermissions.some(permission => hasPermission(permission));

  if (!hasAccess) {
    return (
      <ProtectedRoute requiredPermission="non_existent_permission">
        {children}
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
};

// Component to show different content based on permissions
export const ConditionalRender = ({ 
  children, 
  requiredPermission = null, 
  fallback = null, 
  showFallback = true 
}) => {
  const { user, hasPermission } = useAuth();

  if (!user) {
    return showFallback ? fallback : null;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return showFallback ? fallback : null;
  }

  return children;
};

export default ProtectedRoute;
