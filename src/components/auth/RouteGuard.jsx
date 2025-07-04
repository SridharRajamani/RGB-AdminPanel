import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation, Navigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const RouteGuard = ({ 
  children, 
  requiredPermissions = [], 
  requireAll = false,
  fallbackPath = '/dashboard',
  showAccessDenied = true 
}) => {
  const { user, loading, hasPermission, hasAnyPermission, hasAllPermissions, canAccessRoute } = useAuth();
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
          <Button
            variant="primary"
            onClick={() => {
              const { logout } = useAuth();
              logout();
            }}
          >
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  // Check route-based permissions
  if (!canAccessRoute(location.pathname)) {
    if (!showAccessDenied) {
      return <Navigate to={fallbackPath} replace />;
    }

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
            <Button
              variant="primary"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
            <Button
              variant="ghost"
              onClick={() => window.location.href = fallbackPath}
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Check specific permissions if provided
  if (requiredPermissions.length > 0) {
    const hasAccess = requireAll 
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);

    if (!hasAccess) {
      if (!showAccessDenied) {
        return <Navigate to={fallbackPath} replace />;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-warning/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="Lock" size={32} className="text-warning" />
            </div>
            <h2 className="text-xl font-heading font-semibold text-text-primary mb-2">
              Insufficient Permissions
            </h2>
            <p className="text-text-secondary mb-6">
              You need additional permissions to access this feature. Contact your administrator for access.
            </p>
            <div className="space-y-3">
              <Button
                variant="primary"
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
              <Button
                variant="ghost"
                onClick={() => window.location.href = fallbackPath}
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      );
    }
  }

  // User has access, render the protected content
  return children;
};

// Higher-order component for easier usage
export const withRouteGuard = (Component, options = {}) => {
  return function GuardedComponent(props) {
    return (
      <RouteGuard {...options}>
        <Component {...props} />
      </RouteGuard>
    );
  };
};

// Component to conditionally render content based on permissions
export const PermissionGate = ({ 
  children, 
  requiredPermissions = [], 
  requireAll = false,
  fallback = null,
  showFallback = true 
}) => {
  const { user, hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();

  if (!user || user.status !== 'active') {
    return showFallback ? fallback : null;
  }

  if (requiredPermissions.length === 0) {
    return children;
  }

  const hasAccess = requireAll 
    ? hasAllPermissions(requiredPermissions)
    : hasAnyPermission(requiredPermissions);

  if (!hasAccess) {
    return showFallback ? fallback : null;
  }

  return children;
};

// Component to show different content based on user role
export const RoleGate = ({ 
  children, 
  allowedRoles = [], 
  fallback = null,
  showFallback = true 
}) => {
  const { user } = useAuth();

  if (!user || user.status !== 'active') {
    return showFallback ? fallback : null;
  }

  if (allowedRoles.length === 0) {
    return children;
  }

  if (!allowedRoles.includes(user.role)) {
    return showFallback ? fallback : null;
  }

  return children;
};

export default RouteGuard;
