import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UserModal = ({ isOpen, onClose, mode, userData }) => {
  const { roles, createAdminUser, updateAdminUser } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    role: 'member_admin',
    status: 'active',
    permissions: []
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when modal opens
  useEffect(() => {
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
        permissions: []
      });
    }
    setErrors({});
  }, [mode, userData, isOpen]);

  // Update permissions when role changes
  useEffect(() => {
    if (formData.role && roles[formData.role]) {
      setFormData(prev => ({
        ...prev,
        permissions: roles[formData.role].permissions
      }));
    }
  }, [formData.role, roles]);

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
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        createAdminUser(formData);
      } else {
        updateAdminUser(userData.id, formData);
      }
      
      onClose();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-heading font-semibold text-text-primary">
            {mode === 'create' ? 'Create New User' : 'Edit User'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-secondary transition-colors"
          >
            <Icon name="X" size={20} className="text-text-muted" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-text-primary mb-2">
              Username *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg bg-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.username ? 'border-error' : 'border-border'
              }`}
              placeholder="Enter username"
              disabled={isSubmitting}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-error">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg bg-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.email ? 'border-error' : 'border-border'
              }`}
              placeholder="Enter email address"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error">{errors.email}</p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-text-primary mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg bg-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.fullName ? 'border-error' : 'border-border'
              }`}
              placeholder="Enter full name"
              disabled={isSubmitting}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-error">{errors.fullName}</p>
            )}
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
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.role ? 'border-error' : 'border-border'
              }`}
              disabled={isSubmitting}
            >
              {Object.entries(roles).map(([key, role]) => (
                <option key={key} value={key}>
                  {role.name}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-error">{errors.role}</p>
            )}
            {formData.role && roles[formData.role] && (
              <p className="mt-1 text-xs text-text-muted">
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
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              disabled={isSubmitting}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Permissions Preview */}
          {formData.permissions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Permissions
              </label>
              <div className="bg-background border border-border rounded-lg p-3">
                {formData.permissions.includes('all') ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                    All Permissions
                  </span>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {formData.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                      >
                        {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-3 flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error flex-shrink-0" />
              <p className="text-sm text-error">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={isSubmitting}
              iconName={isSubmitting ? 'Loader2' : mode === 'create' ? 'UserPlus' : 'Save'}
              iconPosition="left"
            >
              {isSubmitting 
                ? 'Saving...' 
                : mode === 'create' 
                  ? 'Create User' 
                  : 'Update User'
              }
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
