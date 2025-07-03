import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/ui/Header';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const UserProfile = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { user, updateProfile, roles } = useAuth();

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    username: user?.username || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    const handleToggleSidebarCollapse = () => {
      setIsSidebarCollapsed((prev) => !prev);
    };
    window.addEventListener('toggleSidebarCollapse', handleToggleSidebarCollapse);
    return () => {
      window.removeEventListener('toggleSidebarCollapse', handleToggleSidebarCollapse);
    };
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateProfile = () => {
    const newErrors = {};

    if (!profileData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;

    setIsSaving(true);
    try {
      await updateProfile(profileData);
      setIsEditing(false);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    setIsSaving(true);
    try {
      // In a real app, you'd call an API to change password
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      alert('Password changed successfully!');
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: 'User' },
    { id: 'security', label: 'Security', icon: 'Shield' },
    { id: 'activity', label: 'Activity Log', icon: 'Activity' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <NavigationSidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        isSidebarCollapsed={isSidebarCollapsed}
        isSidebarVisible={isSidebarVisible}
      />
      
      <main className={`${isSidebarCollapsed ? 'ml-20' : 'ml-60'} pt-16 transition-all duration-200`}>
        <div className="p-6">
          <BreadcrumbNavigation />
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
                User Profile
              </h1>
              <p className="text-text-secondary">
                Manage your account settings and preferences
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-surface border border-border rounded-xl p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">
                    {user?.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  {user?.fullName}
                </h3>
                <p className="text-sm text-text-secondary mb-2">
                  @{user?.username}
                </p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  {roles[user?.role]?.name || user?.role}
                </span>
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="text-xs text-text-muted">
                    <p>Member since</p>
                    <p className="font-medium text-text-secondary">
                      {formatDate(user?.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Tabs */}
              <div className="bg-surface border border-border rounded-xl overflow-hidden">
                <div className="border-b border-border">
                  <nav className="flex space-x-8 px-6">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center space-x-2 py-4 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === tab.id
                            ? 'border-primary text-primary'
                            : 'border-transparent text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        <Icon name={tab.icon} size={16} />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-6">
                  {/* Profile Tab */}
                  {activeTab === 'profile' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-text-primary">
                          Profile Information
                        </h3>
                        {!isEditing ? (
                          <Button
                            variant="outline"
                            size="sm"
                            iconName="Edit"
                            onClick={() => setIsEditing(true)}
                          >
                            Edit Profile
                          </Button>
                        ) : (
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setIsEditing(false);
                                setProfileData({
                                  fullName: user?.fullName || '',
                                  email: user?.email || '',
                                  username: user?.username || ''
                                });
                                setErrors({});
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              iconName="Save"
                              onClick={handleSaveProfile}
                              disabled={isSaving}
                            >
                              {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            Full Name
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="fullName"
                              value={profileData.fullName}
                              onChange={handleProfileChange}
                              className={`w-full px-3 py-2 border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                                errors.fullName ? 'border-error' : 'border-border'
                              }`}
                            />
                          ) : (
                            <p className="text-text-secondary">{user?.fullName}</p>
                          )}
                          {errors.fullName && (
                            <p className="mt-1 text-sm text-error">{errors.fullName}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            Email Address
                          </label>
                          {isEditing ? (
                            <input
                              type="email"
                              name="email"
                              value={profileData.email}
                              onChange={handleProfileChange}
                              className={`w-full px-3 py-2 border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                                errors.email ? 'border-error' : 'border-border'
                              }`}
                            />
                          ) : (
                            <p className="text-text-secondary">{user?.email}</p>
                          )}
                          {errors.email && (
                            <p className="mt-1 text-sm text-error">{errors.email}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            Username
                          </label>
                          <p className="text-text-secondary">@{user?.username}</p>
                          <p className="text-xs text-text-muted mt-1">
                            Username cannot be changed
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            Role
                          </label>
                          <p className="text-text-secondary">
                            {roles[user?.role]?.name || user?.role}
                          </p>
                          <p className="text-xs text-text-muted mt-1">
                            {roles[user?.role]?.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security Tab */}
                  {activeTab === 'security' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-text-primary">
                        Change Password
                      </h3>

                      <div className="max-w-md space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className={`w-full px-3 py-2 border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                              errors.currentPassword ? 'border-error' : 'border-border'
                            }`}
                          />
                          {errors.currentPassword && (
                            <p className="mt-1 text-sm text-error">{errors.currentPassword}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className={`w-full px-3 py-2 border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                              errors.newPassword ? 'border-error' : 'border-border'
                            }`}
                          />
                          {errors.newPassword && (
                            <p className="mt-1 text-sm text-error">{errors.newPassword}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className={`w-full px-3 py-2 border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                              errors.confirmPassword ? 'border-error' : 'border-border'
                            }`}
                          />
                          {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-error">{errors.confirmPassword}</p>
                          )}
                        </div>

                        <Button
                          variant="primary"
                          onClick={handleChangePassword}
                          disabled={isSaving}
                          iconName="Lock"
                        >
                          {isSaving ? 'Changing Password...' : 'Change Password'}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Activity Tab */}
                  {activeTab === 'activity' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-text-primary">
                        Recent Activity
                      </h3>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 bg-background rounded-lg">
                          <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                            <Icon name="LogIn" size={16} className="text-success" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-text-primary">
                              Signed in
                            </p>
                            <p className="text-xs text-text-muted">
                              {user?.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 bg-background rounded-lg">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Icon name="UserPlus" size={16} className="text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-text-primary">
                              Account created
                            </p>
                            <p className="text-xs text-text-muted">
                              {formatDate(user?.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
