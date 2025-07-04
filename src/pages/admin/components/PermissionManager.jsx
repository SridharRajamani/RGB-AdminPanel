import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PermissionManager = ({ 
  selectedPermissions = [], 
  onPermissionsChange, 
  userRole = 'member_admin',
  disabled = false 
}) => {
  const { allPermissions, roles } = useAuth();
  const [expandedCategories, setExpandedCategories] = useState({
    core: true,
    member: false,
    event: false,
    project: false,
    financial: false,
    communication: false,
    admin: false
  });

  // Group permissions by category
  const permissionCategories = {
    core: {
      name: 'Core System',
      icon: 'Settings',
      color: 'text-blue-600',
      permissions: ['dashboard', 'settings']
    },
    member: {
      name: 'Member Management',
      icon: 'Users',
      color: 'text-green-600',
      permissions: ['member_management', 'member_create', 'member_edit', 'member_delete', 'member_export']
    },
    event: {
      name: 'Event Management',
      icon: 'Calendar',
      color: 'text-purple-600',
      permissions: ['event_management', 'event_create', 'event_edit', 'event_delete', 'event_publish']
    },
    project: {
      name: 'Project Management',
      icon: 'FolderOpen',
      color: 'text-orange-600',
      permissions: ['project_management', 'project_create', 'project_edit', 'project_delete', 'project_budget']
    },
    financial: {
      name: 'Financial Management',
      icon: 'DollarSign',
      color: 'text-emerald-600',
      permissions: ['financial_reports', 'donations_view', 'donations_manage', 'budget_view', 'budget_manage', 'financial_export']
    },
    communication: {
      name: 'Communication',
      icon: 'MessageSquare',
      color: 'text-indigo-600',
      permissions: ['communication_center', 'newsletter_create', 'newsletter_send', 'social_media']
    },
    admin: {
      name: 'Administration',
      icon: 'Shield',
      color: 'text-red-600',
      permissions: ['user_management', 'all']
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handlePermissionToggle = (permission) => {
    if (disabled) return;

    const newPermissions = selectedPermissions.includes(permission)
      ? selectedPermissions.filter(p => p !== permission)
      : [...selectedPermissions, permission];

    onPermissionsChange(newPermissions);
  };

  const handleCategoryToggle = (category) => {
    if (disabled) return;

    const categoryPermissions = permissionCategories[category].permissions;
    const allSelected = categoryPermissions.every(p => selectedPermissions.includes(p));

    let newPermissions;
    if (allSelected) {
      // Remove all category permissions
      newPermissions = selectedPermissions.filter(p => !categoryPermissions.includes(p));
    } else {
      // Add all category permissions
      const toAdd = categoryPermissions.filter(p => !selectedPermissions.includes(p));
      newPermissions = [...selectedPermissions, ...toAdd];
    }

    onPermissionsChange(newPermissions);
  };

  const applyRoleTemplate = (roleKey) => {
    if (disabled) return;
    const role = roles[roleKey];
    if (role) {
      onPermissionsChange([...role.permissions]);
    }
  };

  const clearAllPermissions = () => {
    if (disabled) return;
    onPermissionsChange([]);
  };

  return (
    <div className="space-y-6">
      {/* Role Templates */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-3">Quick Role Templates</h4>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {Object.entries(roles).map(([roleKey, role]) => (
            <Button
              key={roleKey}
              variant="ghost"
              size="sm"
              onClick={() => applyRoleTemplate(roleKey)}
              disabled={disabled}
              className="justify-start text-xs"
            >
              <Icon name={role.icon} size={14} className="mr-2" style={{ color: role.color }} />
              {role.name}
            </Button>
          ))}
        </div>
        <div className="flex justify-end mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllPermissions}
            disabled={disabled}
            className="text-error hover:text-error-700 text-xs"
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Permission Categories */}
      <div>
        <h4 className="text-sm font-medium text-text-primary mb-3">Detailed Permissions</h4>
        <div className="space-y-3">
          {Object.entries(permissionCategories).map(([categoryKey, category]) => {
            const categoryPermissions = category.permissions;
            const selectedCount = categoryPermissions.filter(p => selectedPermissions.includes(p)).length;
            const totalCount = categoryPermissions.length;
            const allSelected = selectedCount === totalCount;
            const someSelected = selectedCount > 0 && selectedCount < totalCount;

            return (
              <div key={categoryKey} className="border border-border rounded-lg">
                {/* Category Header */}
                <div className="p-3 border-b border-border bg-surface-secondary/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleCategory(categoryKey)}
                        className="flex items-center space-x-2 hover:bg-surface-secondary rounded-md p-1 -m-1"
                      >
                        <Icon 
                          name={expandedCategories[categoryKey] ? 'ChevronDown' : 'ChevronRight'} 
                          size={16} 
                          className="text-text-muted" 
                        />
                        <Icon name={category.icon} size={16} className={category.color} />
                        <span className="font-medium text-text-primary">{category.name}</span>
                      </button>
                      <span className="text-xs text-text-muted">
                        {selectedCount}/{totalCount} selected
                      </span>
                    </div>
                    <button
                      onClick={() => handleCategoryToggle(categoryKey)}
                      disabled={disabled}
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        allSelected 
                          ? 'bg-primary border-primary' 
                          : someSelected 
                            ? 'bg-primary/50 border-primary' 
                            : 'border-border hover:border-primary'
                      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {allSelected && <Icon name="Check" size={10} className="text-white" />}
                      {someSelected && !allSelected && <Icon name="Minus" size={10} className="text-white" />}
                    </button>
                  </div>
                </div>

                {/* Category Permissions */}
                {expandedCategories[categoryKey] && (
                  <div className="p-3 space-y-2">
                    {categoryPermissions.map(permission => (
                      <div key={permission} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-text-primary">
                            {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                          <div className="text-xs text-text-muted">
                            {allPermissions[permission]}
                          </div>
                        </div>
                        <button
                          onClick={() => handlePermissionToggle(permission)}
                          disabled={disabled || permission === 'all'}
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            selectedPermissions.includes(permission)
                              ? 'bg-primary border-primary' 
                              : 'border-border hover:border-primary'
                          } ${disabled || permission === 'all' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          {selectedPermissions.includes(permission) && (
                            <Icon name="Check" size={10} className="text-white" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Permissions Summary */}
      {selectedPermissions.length > 0 && (
        <div className="bg-surface-secondary/30 rounded-lg p-3">
          <h5 className="text-sm font-medium text-text-primary mb-2">
            Selected Permissions ({selectedPermissions.length})
          </h5>
          <div className="flex flex-wrap gap-1">
            {selectedPermissions.map(permission => (
              <span
                key={permission}
                className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs"
              >
                {permission.replace(/_/g, ' ')}
                {!disabled && permission !== 'all' && (
                  <button
                    onClick={() => handlePermissionToggle(permission)}
                    className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                  >
                    <Icon name="X" size={10} />
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionManager;
