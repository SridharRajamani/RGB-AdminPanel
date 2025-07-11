import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sample admin users data (in a real app, this would come from an API)
  const [adminUsers, setAdminUsers] = useState([
    {
      id: 1,
      username: 'admin',
      email: 'admin@rotarygulmohar.org',
      fullName: 'System Administrator',
      role: 'super_admin',
      status: 'active',
      lastLogin: '2024-01-15T10:30:00Z',
      createdAt: '2023-01-01T00:00:00Z',
      permissions: ['all']
    },
    {
      id: 2,
      username: 'finance_admin',
      email: 'finance@rotarygulmohar.org',
      fullName: 'Finance Administrator',
      role: 'finance_admin',
      status: 'active',
      lastLogin: '2024-01-14T15:45:00Z',
      createdAt: '2023-06-15T00:00:00Z',
      permissions: ['financial_reports', 'dashboard', 'member_management', 'settings', 'content_management']
    },
    {
      id: 3,
      username: 'event_manager',
      email: 'events@rotarygulmohar.org',
      fullName: 'Event Manager',
      role: 'event_admin',
      status: 'active',
      lastLogin: '2024-01-13T09:20:00Z',
      createdAt: '2023-08-20T00:00:00Z',
      permissions: ['event_management', 'dashboard', 'communication_center', 'settings', 'content_management']
    },
    {
      id: 4,
      username: 'project_lead',
      email: 'projects@rotarygulmohar.org',
      fullName: 'Project Lead',
      role: 'project_admin',
      status: 'inactive',
      lastLogin: '2023-12-20T14:10:00Z',
      createdAt: '2023-03-10T00:00:00Z',
      permissions: ['project_management', 'dashboard']
    },
    {
      id: 5,
      username: 'test_user',
      email: 'test@rotarygulmohar.org',
      fullName: 'Test User',
      role: 'member_admin',
      status: 'active',
      lastLogin: null,
      createdAt: '2024-01-16T00:00:00Z',
      permissions: ['member_management', 'dashboard', 'settings'],
      tempPassword: 'Test123@Pass',
      passwordChangeRequired: true
    }
  ]);

  // All available permissions in the system
  const allPermissions = {
    // Core System
    'dashboard': 'Access to main dashboard',
    'settings': 'Access to system settings',
    'user_management': 'Manage admin users and permissions',

    // Member Management
    'member_management': 'View and manage members',
    'member_create': 'Create new members',
    'member_edit': 'Edit member information',
    'member_delete': 'Delete members',
    'member_export': 'Export member data',

    // Event Management
    'event_management': 'View and manage events',
    'event_create': 'Create new events',
    'event_edit': 'Edit event information',
    'event_delete': 'Delete events',
    'event_publish': 'Publish/unpublish events',

    // Project Management
    'project_management': 'View and manage projects',
    'project_create': 'Create new projects',
    'project_edit': 'Edit project information',
    'project_delete': 'Delete projects',
    'project_budget': 'Manage project budgets',

    // Financial Management
    'financial_reports': 'View financial reports',
    'donations_view': 'View donations',
    'donations_manage': 'Manage donations',
    'budget_view': 'View budgets',
    'budget_manage': 'Manage budgets',
    'financial_export': 'Export financial data',

    // Communication
    'communication_center': 'Access communication center',
    'newsletter_create': 'Create newsletters',
    'newsletter_send': 'Send newsletters',
    'social_media': 'Manage social media posts',

    // Content Management
    'content_management': 'Manage website content and media',

    // Admin Functions
    'all': 'Full system access (Super Admin only)'
  };

  // Role definitions with enhanced permissions
  const roles = {
    super_admin: {
      name: 'Super Administrator',
      description: 'Full system access with all permissions',
      permissions: ['all'],
      color: '#dc2626', // Red
      icon: 'Crown'
    },
    finance_admin: {
      name: 'Finance Administrator',
      description: 'Complete financial management access',
      permissions: [
        'dashboard', 'settings', 'financial_reports', 'donations_view',
        'donations_manage', 'budget_view', 'budget_manage', 'financial_export',
        'member_management', 'member_export'
      ],
      color: '#059669', // Green
      icon: 'DollarSign'
    },
    event_admin: {
      name: 'Event Administrator',
      description: 'Complete event and communication management',
      permissions: [
        'dashboard', 'settings', 'event_management', 'event_create',
        'event_edit', 'event_delete', 'event_publish', 'communication_center',
        'newsletter_create', 'newsletter_send', 'social_media'
      ],
      color: '#7c3aed', // Purple
      icon: 'Calendar'
    },
    project_admin: {
      name: 'Project Administrator',
      description: 'Complete project management access',
      permissions: [
        'dashboard', 'project_management', 'project_create', 'project_edit',
        'project_delete', 'project_budget', 'budget_view'
      ],
      color: '#ea580c', // Orange
      icon: 'FolderOpen'
    },
    member_admin: {
      name: 'Member Administrator',
      description: 'Complete member management access',
      permissions: [
        'dashboard', 'member_management', 'member_create', 'member_edit',
        'member_delete', 'member_export', 'communication_center'
      ],
      color: '#0284c7', // Blue
      icon: 'Users'
    },
    viewer: {
      name: 'Viewer',
      description: 'Read-only access to basic information',
      permissions: [
        'dashboard', 'member_management', 'event_management',
        'project_management', 'financial_reports'
      ],
      color: '#6b7280', // Gray
      icon: 'Eye'
    }
  };

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('rotary_auth_user');
        const storedToken = localStorage.getItem('rotary_auth_token');
        
        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          // In a real app, you'd validate the token with your backend
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('rotary_auth_user');
        localStorage.removeItem('rotary_auth_token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user by username
      const foundUser = adminUsers.find(u => 
        u.username === username && u.status === 'active'
      );

      if (!foundUser) {
        throw new Error('Invalid username or password');
      }

      // In a real app, you'd verify the password hash
      // For demo purposes, we'll check temporary password or accept any password for existing users
      if (foundUser.tempPassword) {
        // Check if using temporary password
        if (password !== foundUser.tempPassword && password.length < 3) {
          throw new Error('Invalid username or password');
        }
      } else if (password.length < 3) {
        throw new Error('Invalid username or password');
      }

      // Update last login
      const updatedUser = {
        ...foundUser,
        lastLogin: new Date().toISOString()
      };

      // Update the user in the adminUsers array
      setAdminUsers(prev => prev.map(u => 
        u.id === foundUser.id ? updatedUser : u
      ));

      // Generate a mock token (in real app, this comes from backend)
      const token = `mock_token_${foundUser.id}_${Date.now()}`;

      // Store in localStorage
      localStorage.setItem('rotary_auth_user', JSON.stringify(updatedUser));
      localStorage.setItem('rotary_auth_token', token);

      setUser(updatedUser);
      return { success: true, user: updatedUser };

    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLogoutLoading(true);

    try {
      // Simulate logout API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      localStorage.removeItem('rotary_auth_user');
      localStorage.removeItem('rotary_auth_token');
      setUser(null);
      setError(null);
    } finally {
      setLogoutLoading(false);
    }
  };

  // Check if user has permission
  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.status !== 'active') return false;
    if (user.permissions.includes('all')) return true;
    return user.permissions.includes(permission);
  };

  // Check if user has any of the provided permissions
  const hasAnyPermission = (permissions) => {
    if (!user) return false;
    if (user.status !== 'active') return false;
    if (user.permissions.includes('all')) return true;
    return permissions.some(permission => user.permissions.includes(permission));
  };

  // Check if user has all of the provided permissions
  const hasAllPermissions = (permissions) => {
    if (!user) return false;
    if (user.status !== 'active') return false;
    if (user.permissions.includes('all')) return true;
    return permissions.every(permission => user.permissions.includes(permission));
  };

  // Check if user can access a specific page/route
  const canAccessRoute = (routePath) => {
    if (!user) return false;
    if (user.status !== 'active') return false;
    if (user.permissions.includes('all')) return true;

    // Route to permission mapping
    const routePermissions = {
      '/dashboard': ['dashboard'],
      '/member-management': ['member_management'],
      '/event-management': ['event_management'],
      '/project-management': ['project_management'],
      '/donations': ['donations_view', 'financial_reports'],
      '/financial-reports': ['financial_reports'],
      '/communication-center': ['communication_center'],
      '/landing-content-form': ['content_management'],
      '/admin/user-management': ['user_management', 'all'],
      '/settings': ['settings']
    };

    const requiredPermissions = routePermissions[routePath];
    if (!requiredPermissions) return true; // Allow access to routes without specific permissions

    return hasAnyPermission(requiredPermissions);
  };

  // Get user's role information
  const getUserRole = () => {
    if (!user) return null;
    return roles[user.role] || null;
  };

  // Check if user can perform specific actions
  const canPerformAction = (action, context = {}) => {
    if (!user) return false;
    if (user.status !== 'active') return false;
    if (user.permissions.includes('all')) return true;

    // Action-based permission checks
    const actionPermissions = {
      'create_member': ['member_create'],
      'edit_member': ['member_edit'],
      'delete_member': ['member_delete'],
      'export_members': ['member_export'],
      'create_event': ['event_create'],
      'edit_event': ['event_edit'],
      'delete_event': ['event_delete'],
      'publish_event': ['event_publish'],
      'create_project': ['project_create'],
      'edit_project': ['project_edit'],
      'delete_project': ['project_delete'],
      'manage_budget': ['project_budget', 'budget_manage'],
      'send_newsletter': ['newsletter_send'],
      'manage_users': ['user_management', 'all'],
      'view_financial_reports': ['financial_reports'],
      'manage_donations': ['donations_manage']
    };

    const requiredPermissions = actionPermissions[action];
    if (!requiredPermissions) return false;

    return hasAnyPermission(requiredPermissions);
  };

  // Create new admin user
  const createAdminUser = (userData) => {
    const newUser = {
      id: Math.max(...adminUsers.map(u => u.id)) + 1,
      ...userData,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      // Store temporary password and require password change
      tempPassword: userData.tempPassword,
      passwordChangeRequired: userData.passwordChangeRequired || false
    };

    setAdminUsers(prev => [...prev, newUser]);
    return newUser;
  };

  // Update admin user
  const updateAdminUser = (userId, userData) => {
    setAdminUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, ...userData } : u
    ));
  };

  // Delete admin user
  const deleteAdminUser = (userId) => {
    if (user && user.id === userId) {
      throw new Error('Cannot delete your own account');
    }
    setAdminUsers(prev => prev.filter(u => u.id !== userId));
  };

  // Update current user profile
  const updateProfile = (profileData) => {
    const updatedUser = { ...user, ...profileData };
    setUser(updatedUser);
    localStorage.setItem('rotary_auth_user', JSON.stringify(updatedUser));
    
    // Update in adminUsers array
    setAdminUsers(prev => prev.map(u => 
      u.id === user.id ? updatedUser : u
    ));
  };

  const value = {
    user,
    loading,
    logoutLoading,
    error,
    adminUsers,
    roles,
    allPermissions,
    login,
    logout,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessRoute,
    canPerformAction,
    getUserRole,
    createAdminUser,
    updateAdminUser,
    deleteAdminUser,
    updateProfile,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
