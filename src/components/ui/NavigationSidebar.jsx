import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Icon from '../AppIcon';
import Button from './Button';

const NavigationSidebar = ({ isSidebarCollapsed = false, isSidebarVisible = true }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout, hasPermission } = useAuth();
  const { isDarkMode } = useTheme();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      description: 'Overview and metrics',
      permission: 'dashboard'
    },
    {
      label: 'Members',
      path: '/member-management',
      icon: 'Users',
      description: 'Member management',
      permission: 'member_management'
    },
    {
      label: 'Events',
      path: '/event-management',
      icon: 'Calendar',
      description: 'Event planning',
      permission: 'event_management'
    },
    {
      label: 'Projects',
      path: '/project-management',
      icon: 'FolderOpen',
      description: 'Project tracking',
      permission: 'project_management'
    },
    {
      label: 'Finance',
      path: '/financial-reports',
      icon: 'DollarSign',
      description: 'Financial reports',
      permission: 'financial_reports'
    },
    {
      label: 'Communications',
      path: '/communication-center',
      icon: 'MessageSquare',
      description: 'Announcements & newsletters',
      permission: 'communication_center'
    }
  ];

  const adminItems = [
    {
      label: 'User Management',
      path: '/admin/users',
      icon: 'UserCog',
      description: 'Manage admin users',
      permission: 'all'
    }
  ];

  // Handle mobile menu toggle
  useEffect(() => {
    const handleToggleMobileMenu = () => {
      setIsMobileMenuOpen(prev => !prev);
    };

    window.addEventListener('toggleMobileMenu', handleToggleMobileMenu);
    return () => {
      window.removeEventListener('toggleMobileMenu', handleToggleMobileMenu);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-sidebar') && !event.target.closest('[data-mobile-menu-trigger]')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const SidebarContent = () => (
    <nav className={`flex-1 ${isSidebarCollapsed ? 'px-2' : 'px-4'} py-6 space-y-2`}>
      {/* Main Navigation */}
      {navigationItems.filter(item => hasPermission(item.permission)).map((item) => {
        const isActive = isActiveRoute(item.path);

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`
              group flex items-center ${isSidebarCollapsed ? 'justify-center' : ''} px-3 py-3 text-sm font-medium rounded-lg transition-all duration-150
              ${isActive
                ? isDarkMode
                  ? 'bg-white text-[#252569] shadow-md'
                  : 'bg-blue-100 text-blue-800 shadow-md'
                : isDarkMode
                  ? 'text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.1)]'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }
            `}
            title={isSidebarCollapsed ? item.label : undefined}
          >
            <Icon
              name={item.icon}
              size={20}
              className={`mr-3 flex-shrink-0 ${
                isActive
                  ? isDarkMode ? 'text-[#252569]' : 'text-blue-800'
                  : isDarkMode
                    ? 'text-gray-400 group-hover:text-white'
                    : 'text-gray-500 group-hover:text-gray-800'
              }`}
            />
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${
                  isActive
                    ? isDarkMode ? 'text-[#252569]' : 'text-blue-800'
                    : isDarkMode
                      ? 'text-gray-300 group-hover:text-white'
                      : 'text-gray-700 group-hover:text-gray-800'
                }`}>
                  {item.label}
                </p>
                <p className={`text-xs mt-0.5 ${
                  isActive
                    ? isDarkMode ? 'text-[#252569]' : 'text-blue-700'
                    : isDarkMode
                      ? 'text-gray-400 group-hover:text-white'
                      : 'text-gray-500 group-hover:text-gray-700'
                }`}>
                  {item.description}
                </p>
              </div>
            )}
            {isActive && (
              <div
                className="w-2 h-2 rounded-full ml-2 flex-shrink-0"
                style={{ backgroundColor: isDarkMode ? '#252569' : '#3b82f6' }}
              />
            )}
          </Link>
        );
      })}

      {/* Admin Section */}
      {adminItems.some(item => hasPermission(item.permission)) && (
        <>
          <div className="pt-4 pb-2">
            {!isSidebarCollapsed && (
              <p className={`px-3 text-xs font-semibold uppercase tracking-wider ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Administration
              </p>
            )}
          </div>
          {adminItems.filter(item => hasPermission(item.permission)).map((item) => {
            const isActive = isActiveRoute(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  group flex items-center ${isSidebarCollapsed ? 'justify-center' : ''} px-3 py-3 text-sm font-medium rounded-lg transition-all duration-150
                  ${isActive
                    ? isDarkMode
                      ? 'bg-white text-[#252569] shadow-md'
                      : 'bg-blue-100 text-blue-800 shadow-md'
                    : isDarkMode
                      ? 'text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.1)]'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }
                `}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <Icon
                  name={item.icon}
                  size={20}
                  className={`mr-3 flex-shrink-0 ${
                    isActive
                      ? isDarkMode ? 'text-[#252569]' : 'text-blue-800'
                      : isDarkMode
                        ? 'text-gray-400 group-hover:text-white'
                        : 'text-gray-500 group-hover:text-gray-800'
                  }`}
                />
                {!isSidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${
                      isActive
                        ? isDarkMode ? 'text-[#252569]' : 'text-blue-800'
                        : isDarkMode
                          ? 'text-gray-300 group-hover:text-white'
                          : 'text-gray-700 group-hover:text-gray-800'
                    }`}>
                      {item.label}
                    </p>
                    <p className={`text-xs mt-0.5 ${
                      isActive
                        ? isDarkMode ? 'text-[#252569]' : 'text-blue-700'
                        : isDarkMode
                          ? 'text-gray-400 group-hover:text-white'
                          : 'text-gray-500 group-hover:text-gray-700'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                )}
                {isActive && (
                  <div
                    className="w-2 h-2 rounded-full ml-2 flex-shrink-0"
                    style={{ backgroundColor: isDarkMode ? '#252569' : '#3b82f6' }}
                  />
                )}
              </Link>
            );
          })}
        </>
      )}
    </nav>
  );

  return (
    <>
      {/* Sidebar - always visible on all screen sizes */}
      <aside className={`fixed inset-y-0 left-0 z-40 ${!isSidebarVisible ? 'w-0' : isSidebarCollapsed ? 'w-20' : 'w-60'} flex flex-col transition-all duration-200`}>
        <div
          className="flex flex-col flex-1 min-h-0 border-r"
          style={{
            backgroundColor: isDarkMode ? '#252569' : '#ffffff',
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0'
          }}
        >
          {/* Sidebar Header */}
          <div
            className="flex items-center px-4 py-6 border-b"
            style={{ borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0' }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Icon name="Layers" size={16} color="white" />
              </div>
              <div>
                <h2 className={`text-sm font-heading font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                  Navigation
                </h2>
                <p className={`text-xs font-caption ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Quick access
                </p>
              </div>
            </div>
          </div>

          <SidebarContent />

          {/* User Profile & Logout */}
          <div
            className="flex-shrink-0 p-4 border-t"
            style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0' }}
          >
            {user && (
              <div className="space-y-3">
                {/* User Info */}
                <div
                  className="flex items-center space-x-3 p-3 rounded-lg"
                  style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#f8fafc' }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-xs">
                      {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  {!isSidebarCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium truncate ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {user.fullName}
                      </p>
                      <p className={`text-xs truncate ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                    </div>
                  )}
                </div>

                {/* Logout Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className={`w-full ${isSidebarCollapsed ? 'px-2' : ''} ${
                    isDarkMode
                      ? 'text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.1)]'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                  iconName="LogOut"
                  iconPosition={isSidebarCollapsed ? 'center' : 'left'}
                  title={isSidebarCollapsed ? 'Sign Out' : undefined}
                >
                  {!isSidebarCollapsed && 'Sign Out'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default NavigationSidebar;
