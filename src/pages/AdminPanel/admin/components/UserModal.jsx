import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import Icon from '../../../../components/AppIcon';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import PermissionManager from './PermissionManager';
import useCoolAlert from '../../../../hooks/useCoolAlert';

const UserModal = ({ isOpen, onClose, mode, userData }) => {
  const { roles, createAdminUser, updateAdminUser, allPermissions } = useAuth();
  const alert = useCoolAlert();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    role: 'member_admin',
    status: 'active',
    permissions: []
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [generatedCredentials, setGeneratedCredentials] = useState(null);

  // Generate random password
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && userData) {
        setFormData({
          username: userData.username || '',
          email: userData.email || '',
          fullName: userData.fullName || '',
          role: userData.role || 'member_admin',
          status: userData.status || 'active',
          permissions: userData.permissions || []
        });
      } else {
        setFormData({
          username: '',
          email: '',
          fullName: '',
          role: 'member_admin',
          status: 'active',
          permissions: roles.member_admin?.permissions || []
        });
      }
      setActiveTab('basic');
      setErrors({});
      setGeneratedCredentials(null);
    }
  }, [mode, userData, isOpen, roles]);

  // Update permissions when role changes (only for new users)
  useEffect(() => {
    if (mode === 'create' && formData.role && roles[formData.role]) {
      setFormData(prev => ({
        ...prev,
        permissions: roles[formData.role].permissions
      }));
    }
  }, [formData.role, roles, mode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setFormData(prev => ({
      ...prev,
      role: newRole
    }));
  };

  const handlePermissionsChange = (newPermissions) => {
    setFormData(prev => ({
      ...prev,
      permissions: newPermissions
    }));

    // Clear permissions error
    if (errors.permissions) {
      setErrors(prev => ({
        ...prev,
        permissions: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert.error(
        '❌ Validation Error',
        'Please fix the errors in the form before submitting.',
        { animation: 'shake' }
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Show loading alert
      const loadingAlert = alert.info(
        '👤 Processing User...',
        `Please wait while we ${mode === 'create' ? 'create' : 'update'} the user account.`,
        {
          autoClose: false,
          animation: 'fade'
        }
      );

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (mode === 'create') {
        // Generate login credentials for new user
        const tempPassword = generatePassword();
        const userWithCredentials = {
          ...formData,
          tempPassword: tempPassword,
          passwordChangeRequired: true
        };

        createAdminUser(userWithCredentials);

        // Store credentials to show to admin
        setGeneratedCredentials({
          username: formData.username,
          password: tempPassword
        });

        // Close loading alert
        loadingAlert();

        // Show credentials alert instead of closing modal
        alert.success(
          '🎉 User Created Successfully!',
          `User "${formData.username}" has been created. Login credentials have been generated.`,
          {
            animation: 'bounce',
            gradient: true,
            sound: true,
            autoClose: true,
            autoCloseDelay: 4000
          }
        );

        // Switch to credentials display instead of closing
        setActiveTab('credentials');

      } else {
        updateAdminUser(userData.id, formData);

        // Close loading alert
        loadingAlert();

        // Show success alert
        alert.celebration(
          '✅ User Updated!',
          `User "${formData.username}" has been updated successfully!`,
          {
            animation: 'bounce',
            gradient: true,
            sound: true,
            autoClose: true,
            autoCloseDelay: 3000
          }
        );

        onClose();
      }
    } catch (error) {
      alert.urgent(
        '🚨 Operation Failed',
        error.message || 'An error occurred while processing the user account. Please try again.',
        {
          animation: 'shake',
          gradient: true,
          sound: true
        }
      );
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[9998]">
      <div className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Icon name="UserPlus" size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-text-primary">
                {mode === 'create' ? 'Create New User' : 'Edit User'}
              </h2>
              <p className="text-sm text-text-secondary">
                {mode === 'create' ? 'Add a new admin user to the system' : 'Update user information and permissions'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-secondary transition-colors"
          >
            <Icon name="X" size={20} className="text-text-muted" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border flex-shrink-0">
          <nav className="flex space-x-8 px-6">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'basic'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text-primary hover:border-border'
              }`}
            >
              <Icon name="User" size={16} className="inline mr-2" />
              Basic Information
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('permissions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'permissions'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text-primary hover:border-border'
              }`}
            >
              <Icon name="Shield" size={16} className="inline mr-2" />
              Permissions & Role
            </button>
            {generatedCredentials && (
              <button
                type="button"
                onClick={() => setActiveTab('credentials')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'credentials'
                    ? 'border-success text-success'
                    : 'border-transparent text-text-muted hover:text-text-primary hover:border-border'
                }`}
              >
                <Icon name="Key" size={16} className="inline mr-2" />
                Login Credentials
              </button>
            )}
          </nav>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-6">
              {/* Basic Information Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  {/* Username */}
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-text-primary mb-2">
                      Username *
                    </label>
                    <Input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Enter username"
                      disabled={isSubmitting}
                      error={errors.username}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      disabled={isSubmitting}
                      error={errors.email}
                    />
                  </div>

                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-text-primary mb-2">
                      Full Name *
                    </label>
                    <Input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      disabled={isSubmitting}
                      error={errors.fullName}
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-text-primary mb-2">
                      Role *
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleRoleChange}
                      disabled={isSubmitting}
                      className={`w-full px-3 py-2 border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        errors.role ? 'border-error' : 'border-border'
                      }`}
                    >
                      {Object.entries(roles).map(([roleKey, role]) => (
                        <option key={roleKey} value={roleKey}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                    {errors.role && (
                      <p className="mt-1 text-sm text-error">{errors.role}</p>
                    )}
                    {formData.role && roles[formData.role] && (
                      <p className="mt-1 text-sm text-text-muted">
                        {roles[formData.role].description}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-text-primary mb-2">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Permissions Tab */}
              {activeTab === 'permissions' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-text-primary mb-2">
                      User Permissions
                    </h3>
                    <p className="text-sm text-text-muted mb-4">
                      Configure what this user can access and manage in the system.
                    </p>

                    <PermissionManager
                      selectedPermissions={formData.permissions}
                      onPermissionsChange={handlePermissionsChange}
                      userRole={formData.role}
                      disabled={isSubmitting}
                    />

                    {errors.permissions && (
                      <p className="mt-2 text-sm text-error">{errors.permissions}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Login Credentials Tab */}
              {activeTab === 'credentials' && generatedCredentials && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-success to-success-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="CheckCircle" size={32} className="text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      User Created Successfully!
                    </h3>
                    <p className="text-text-muted mb-6">
                      Login credentials have been generated for the new user. Please share these credentials securely.
                    </p>
                  </div>

                  <div className="bg-surface-secondary/50 border border-border rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">
                          Username
                        </label>
                        <div className="text-lg font-mono text-text-primary">
                          {generatedCredentials.username}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Copy"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedCredentials.username);
                          alert.success('📋 Copied!', 'Username copied to clipboard', { autoClose: true, autoCloseDelay: 2000 });
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">
                          Temporary Password
                        </label>
                        <div className="text-lg font-mono text-text-primary">
                          {generatedCredentials.password}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Copy"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedCredentials.password);
                          alert.success('📋 Copied!', 'Password copied to clipboard', { autoClose: true, autoCloseDelay: 2000 });
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Icon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-warning mb-1">Important Security Notes</h4>
                        <ul className="text-sm text-text-muted space-y-1">
                          <li>• Share these credentials securely with the user</li>
                          <li>• The user will be required to change the password on first login</li>
                          <li>• These credentials will not be shown again</li>
                          <li>• Consider using a secure communication method to share credentials</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      variant="outline"
                      iconName="Download"
                      onClick={() => {
                        const credentialsText = `Login Credentials for ${formData.fullName}\n\nUsername: ${generatedCredentials.username}\nTemporary Password: ${generatedCredentials.password}\n\nNote: User must change password on first login.`;
                        const blob = new Blob([credentialsText], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${generatedCredentials.username}_credentials.txt`;
                        a.click();
                        URL.revokeObjectURL(url);
                        alert.success('📄 Downloaded!', 'Credentials saved to file', { autoClose: true, autoCloseDelay: 2000 });
                      }}
                    >
                      Download Credentials
                    </Button>
                    <Button
                      variant="primary"
                      iconName="Mail"
                      onClick={() => {
                        const subject = `Login Credentials - Rotary Club Dashboard`;
                        const body = `Dear ${formData.fullName},\n\nYour account has been created for the Rotary Club Dashboard.\n\nLogin Details:\nUsername: ${generatedCredentials.username}\nTemporary Password: ${generatedCredentials.password}\n\nPlease change your password after your first login.\n\nBest regards,\nRotary Club Admin Team`;
                        window.open(`mailto:${formData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                      }}
                    >
                      Email Credentials
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border p-6 bg-surface-secondary/30 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="text-sm text-text-muted">
                {errors.submit && (
                  <span className="text-error">{errors.submit}</span>
                )}
              </div>
              <div className="flex items-center space-x-3">
                {activeTab === 'credentials' ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={onClose}
                    iconName="Check"
                    iconPosition="left"
                  >
                    Done
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={onClose}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting}
                      iconName={isSubmitting ? "Loader2" : mode === 'create' ? "UserPlus" : "Save"}
                      iconPosition="left"
                      className={isSubmitting ? "animate-pulse" : ""}
                    >
                      {isSubmitting
                        ? (mode === 'create' ? 'Creating...' : 'Updating...')
                        : (mode === 'create' ? 'Create User' : 'Update User')
                      }
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
