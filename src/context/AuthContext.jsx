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
      permissions: ['financial_reports', 'dashboard', 'member_management']
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
      permissions: ['event_management', 'dashboard', 'communication_center']
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
    }
  ]);

  // Role definitions
  const roles = {
    super_admin: {
      name: 'Super Administrator',
      description: 'Full system access',
      permissions: ['all']
    },
    finance_admin: {
      name: 'Finance Administrator',
      description: 'Financial management access',
      permissions: ['financial_reports', 'dashboard', 'member_management']
    },
    event_admin: {
      name: 'Event Administrator',
      description: 'Event management access',
      permissions: ['event_management', 'dashboard', 'communication_center']
    },
    project_admin: {
      name: 'Project Administrator',
      description: 'Project management access',
      permissions: ['project_management', 'dashboard']
    },
    member_admin: {
      name: 'Member Administrator',
      description: 'Member management access',
      permissions: ['member_management', 'dashboard']
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
      // For demo purposes, we'll accept any password for existing users
      if (password.length < 3) {
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
  const logout = () => {
    localStorage.removeItem('rotary_auth_user');
    localStorage.removeItem('rotary_auth_token');
    setUser(null);
    setError(null);
  };

  // Check if user has permission
  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.permissions.includes('all')) return true;
    return user.permissions.includes(permission);
  };

  // Create new admin user
  const createAdminUser = (userData) => {
    const newUser = {
      id: Math.max(...adminUsers.map(u => u.id)) + 1,
      ...userData,
      createdAt: new Date().toISOString(),
      lastLogin: null
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
    error,
    adminUsers,
    roles,
    login,
    logout,
    hasPermission,
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
