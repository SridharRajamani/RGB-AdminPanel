import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PermissionGate } from '../../components/auth/RouteGuard';
import Header from '../../components/ui/Header';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import UserModal from './components/UserModal';

const UserManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'

  const { user, adminUsers, roles, deleteAdminUser, hasPermission } = useAuth();

  React.useEffect(() => {
    const handleToggleSidebarCollapse = () => {
      setIsSidebarCollapsed((prev) => !prev);
    };
    window.addEventListener('toggleSidebarCollapse', handleToggleSidebarCollapse);
    return () => {
      window.removeEventListener('toggleSidebarCollapse', handleToggleSidebarCollapse);
    };
  }, []);

  // Filter users based on search and filters
  const filteredUsers = adminUsers.filter(u => {
    const matchesSearch = u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    const matchesStatus = filterStatus === 'all' || u.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-success/10 text-success border-success/20'
      : 'bg-error/10 text-error border-error/20';
  };

  const getRoleColor = (role) => {
    const colors = {
      super_admin: 'bg-purple-100 text-purple-800 border-purple-200',
      finance_admin: 'bg-green-100 text-green-800 border-green-200',
      event_admin: 'bg-blue-100 text-blue-800 border-blue-200',
      project_admin: 'bg-orange-100 text-orange-800 border-orange-200',
      member_admin: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditUser = (userData) => {
    setSelectedUser(userData);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        deleteAdminUser(userId);
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const stats = {
    total: adminUsers.length,
    active: adminUsers.filter(u => u.status === 'active').length,
    inactive: adminUsers.filter(u => u.status === 'inactive').length,
    superAdmins: adminUsers.filter(u => u.role === 'super_admin').length
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <NavigationSidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        isSidebarCollapsed={isSidebarCollapsed}
        isSidebarVisible={isSidebarVisible}
      />
      
      {/* Main Content */}
      <main className={`${isSidebarCollapsed ? 'ml-20' : 'ml-60'} pt-16 transition-all duration-200`}>
        <div className="p-6">
          <BreadcrumbNavigation />
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
                User Management
              </h1>
              <p className="text-text-secondary">
                Manage admin users, roles, and permissions
              </p>
            </div>
            <PermissionGate requiredPermissions={['user_management']}>
              <Button
                variant="primary"
                iconName="UserPlus"
                iconPosition="left"
                onClick={handleCreateUser}
              >
                Add New User
              </Button>
            </PermissionGate>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={24} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-secondary">Total Users</p>
                  <p className="text-2xl font-bold text-text-primary">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Icon name="UserCheck" size={24} className="text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-secondary">Active Users</p>
                  <p className="text-2xl font-bold text-text-primary">{stats.active}</p>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
                  <Icon name="UserX" size={24} className="text-error" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-secondary">Inactive Users</p>
                  <p className="text-2xl font-bold text-text-primary">{stats.inactive}</p>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Icon name="Shield" size={24} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-secondary">Super Admins</p>
                  <p className="text-2xl font-bold text-text-primary">{stats.superAdmins}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-surface border border-border rounded-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Icon 
                    name="Search" 
                    size={20} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" 
                  />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Roles</option>
                {Object.entries(roles).map(([key, role]) => (
                  <option key={key} value={key}>{role.name}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-secondary border-b border-border">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-text-secondary">User</th>
                    <th className="text-left py-4 px-6 font-medium text-text-secondary">Role</th>
                    <th className="text-left py-4 px-6 font-medium text-text-secondary">Status</th>
                    <th className="text-left py-4 px-6 font-medium text-text-secondary">Last Login</th>
                    <th className="text-left py-4 px-6 font-medium text-text-secondary">Created</th>
                    <PermissionGate requiredPermissions={['user_management']}>
                      <th className="text-right py-4 px-6 font-medium text-text-secondary">Actions</th>
                    </PermissionGate>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((userData) => (
                    <tr key={userData.id} className="border-b border-border hover:bg-surface-secondary">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {userData.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-text-primary">{userData.fullName}</p>
                            <p className="text-sm text-text-secondary">{userData.email}</p>
                            <p className="text-xs text-text-muted">@{userData.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(userData.role)}`}>
                          {roles[userData.role]?.name || userData.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(userData.status)}`}>
                          {userData.status.charAt(0).toUpperCase() + userData.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-text-secondary">
                        {formatDate(userData.lastLogin)}
                      </td>
                      <td className="py-4 px-6 text-sm text-text-secondary">
                        {formatDate(userData.createdAt)}
                      </td>
                      <PermissionGate requiredPermissions={['user_management']}>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              iconName="Edit"
                              onClick={() => handleEditUser(userData)}
                            />
                            {userData.id !== user.id && (
                              <Button
                                variant="ghost"
                                size="sm"
                                iconName="Trash2"
                                onClick={() => handleDeleteUser(userData.id)}
                                className="text-error hover:text-error-700"
                              />
                            )}
                          </div>
                        </td>
                      </PermissionGate>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Icon name="Users" size={48} className="text-text-muted mx-auto mb-4" />
                <p className="text-text-secondary">No users found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* User Modal */}
      {isModalOpen && (
        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          mode={modalMode}
          userData={selectedUser}
        />
      )}
    </div>
  );
};

export default UserManagement;
