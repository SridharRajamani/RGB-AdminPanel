import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import Icon from '../AppIcon';
import Button from './Button';

const NavigationSidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout, hasPermission } = useAuth();
  const { isDarkMode, appearanceSettings } = useTheme();
  const { t } = useTranslation();

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarCollapsed(prev => {
      const newState = !prev;
      // Dispatch event to update parent components
      const event = new CustomEvent('sidebarStateChanged', {
        detail: { collapsed: newState }
      });
      window.dispatchEvent(event);
      return newState;
    });
  };

  // Debug render
  console.log('🚀 NavigationSidebar RENDER - sidebarCollapsed:', sidebarCollapsed);

  const navigationItems = [
    {
      label: t('navigation.dashboard', 'Dashboard'),
      path: '/dashboard',
      icon: 'LayoutDashboard',
      description: t('dashboard.overview', 'Overview and metrics'),
      permission: 'dashboard'
    },
    {
      label: t('navigation.members', 'Members'),
      path: '/member-management',
      icon: 'Users',
      description: t('members.title', 'Member management'),
      permission: 'member_management'
    },
    {
      label: t('navigation.events', 'Events'),
      path: '/event-management',
      icon: 'Calendar',
      description: 'Event planning',
      permission: 'event_management'
    },
    {
      label: t('navigation.focus_areas', 'Focus Areas'),
      path: '/focus-areas',
      icon: 'Target',
      description: 'Strategic focus areas',
      permission: 'focus_areas_management'
    },
    {
      label: 'Member Inquisitive',
      path: '/member-inquisitive',
      icon: 'Video',
      description: 'Member inquisitive videos',
      permission: 'member_inquisitive_management'
    },
    {
      label: 'Support Rotary',
      path: '/support-rotary',
      icon: 'Heart',
      description: 'Manage support projects',
      permission: 'support_rotary_management'
    },
    {
      label: t('navigation.projects', 'Projects'),
      path: '/project-management',
      icon: 'FolderOpen',
      description: 'Project tracking',
      permission: 'project_management'
    },
    {
      label: t('navigation.finance', 'Finance'),
      path: '/financial-reports',
      icon: 'DollarSign',
      description: t('finance.title', 'Financial reports'),
      permission: 'financial_reports'
    },
    {
      label: t('navigation.donations', 'Donations'),
      path: '/donations',
      icon: 'Heart',
      description: t('donations.title', 'Donation management'),
      permission: 'donations'
    },
    {
      label: t('navigation.communications', 'Communications'),
      path: '/communication-center',
      icon: 'MessageSquare',
      description: 'Announcements & newsletters',
      permission: 'communication_center'
    },
    {
      label: 'Landing Content',
      path: '/landing-content-form',
      icon: 'Video',
      description: 'Manage landing page video',
      permission: 'content_management'
    },
    {
      label: t('navigation.settings', 'Settings'),
      path: '/settings',
      icon: 'Settings',
      description: t('settings.title', 'System configuration'),
      permission: 'settings'
    },
    {
      label: 'Cool Alerts',
      path: '/cool-alert-demo',
      icon: 'Zap',
      description: 'Amazing alert system demo',
      permission: 'dashboard'
    },
    {
      label: 'Team Management',
      path: '/admin/about',
      icon: 'Users',
      description: 'Manage club team members',
      permission: 'content_management'
    }
  ];

  const adminItems = [
    {
      label: 'User Management',
      path: '/admin/users',
      icon: 'UserCog',
      description: 'Manage admin users',
      permission: 'user_management'
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

  // Handle sidebar collapse toggle from header
  useEffect(() => {
    const handleToggleSidebarCollapse = () => {
      toggleSidebar();
    };

    window.addEventListener('toggleSidebarCollapse', handleToggleSidebarCollapse);
    return () => {
      window.removeEventListener('toggleSidebarCollapse', handleToggleSidebarCollapse);
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
    <div className="flex-1 flex flex-col min-h-0">
      <nav className={`flex-1 ${sidebarCollapsed ? 'px-2' : 'px-4'} py-6 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar`}>
      {/* Main Navigation */}
      {navigationItems.filter(item => hasPermission(item.permission)).map((item) => {
        const isActive = isActiveRoute(item.path);

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`
              group flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'px-3'} py-3 text-sm font-medium rounded-lg transition-all duration-150
              ${isActive
                ? isDarkMode
                  ? 'bg-white shadow-md'
                  : 'shadow-md'
                : isDarkMode
                  ? 'text-white hover:text-gray-200 hover:bg-[rgba(255,255,255,0.1)]'
                  : 'hover:bg-gray-100'
              }
            `}
            style={isActive && !isDarkMode ? {
              backgroundColor: appearanceSettings.primaryColor,
              color: 'white'
            } : isActive && isDarkMode ? {
              color: appearanceSettings.primaryColor
            } : !isDarkMode ? {
              color: 'black'
            } : {}}
            title={sidebarCollapsed ? item.label : undefined}

          >
            <Icon
              name={item.icon}
              size={20}
              className={`${!sidebarCollapsed ? 'mr-3' : ''} flex-shrink-0 ${
                isActive
                  ? ''
                  : isDarkMode
                    ? 'text-white group-hover:text-gray-200'
                    : 'group-hover:text-gray-800'
              }`}
              style={isActive ? { color: isDarkMode ? appearanceSettings.primaryColor : 'white' } : !isDarkMode ? { color: appearanceSettings.primaryColor } : {}}
            />
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className={`text-base font-medium ${
                  isActive
                    ? ''
                    : isDarkMode
                      ? 'text-white group-hover:text-gray-200'
                      : 'group-hover:text-gray-800'
                }`}
                style={isActive ? { color: isDarkMode ? appearanceSettings.primaryColor : 'white' } : !isDarkMode ? { color: 'rgb(30 41 59)' } : {}}>
                  {item.label}
                </p>
                <p className={`text-xs mt-0.5 ${
                  isActive
                    ? ''
                    : isDarkMode
                      ? 'text-white group-hover:text-gray-200'
                      : 'group-hover:text-gray-700'
                }`}
                style={isActive ? { color: isDarkMode ? appearanceSettings.primaryColor : 'white' } : !isDarkMode ? { color: 'rgb(148 163 184)' } : {}}>
                  {item.description}
                </p>
              </div>
            )}
            {isActive && (
              <div
                className="w-2 h-2 rounded-full ml-2 flex-shrink-0"
                style={{ backgroundColor: isDarkMode ? appearanceSettings.primaryColor : 'white' }}
              />
            )}
          </Link>
        );
      })}

      {/* Admin Section */}
      {adminItems.some(item => hasPermission(item.permission)) && (
        <>
          {!sidebarCollapsed && (
            <div className="pt-4 pb-2">
              <p className={`px-3 text-xs font-semibold uppercase tracking-wider ${
                isDarkMode ? 'text-white' : 'text-gray-500'
              }`}>
                Administration
              </p>
            </div>
          )}
          {adminItems.filter(item => hasPermission(item.permission)).map((item) => {
            const isActive = isActiveRoute(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  group flex items-center ${sidebarCollapsed ? 'justify-center px-2 py-3' : 'px-3 py-3'} text-sm font-medium rounded-lg transition-all duration-150
                  ${isActive
                    ? isDarkMode
                      ? 'bg-white shadow-md'
                      : 'shadow-md'
                    : isDarkMode
                      ? 'text-white hover:text-gray-200 hover:bg-[rgba(255,255,255,0.1)]'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }
                `}
                style={isActive && !isDarkMode ? {
                  backgroundColor: appearanceSettings.primaryColor,
                  color: 'white'
                } : isActive && isDarkMode ? {
                  color: appearanceSettings.primaryColor
                } : {}}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon
                  name={item.icon}
                  size={20}
                  className={`${sidebarCollapsed ? '' : 'mr-3'} flex-shrink-0 ${
                    isActive
                      ? ''
                      : isDarkMode
                        ? 'text-white group-hover:text-gray-200'
                        : 'text-gray-500 group-hover:text-gray-800'
                  }`}
                  style={isActive ? { color: isDarkMode ? appearanceSettings.primaryColor : 'white' } : {}}
                />
                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className={`text-base font-medium ${
                      isActive
                        ? ''
                        : isDarkMode
                          ? 'text-white group-hover:text-gray-200'
                          : 'text-gray-700 group-hover:text-gray-800'
                    }`}
                    style={isActive ? { color: isDarkMode ? appearanceSettings.primaryColor : 'white' } : !isDarkMode ? { color: 'rgb(30 41 59)' } : {}}>
                      {item.label}
                    </p>
                    <p className={`text-xs mt-0.5 ${
                      isActive
                        ? ''
                        : isDarkMode
                          ? 'text-white group-hover:text-gray-200'
                          : 'text-gray-500 group-hover:text-gray-700'
                    }`}
                    style={isActive ? { color: isDarkMode ? appearanceSettings.primaryColor : 'white' } : !isDarkMode ? { color: 'rgb(148 163 184)' } : {}}>
                      {item.description}
                    </p>
                  </div>
                )}
                {isActive && !sidebarCollapsed && (
                  <div
                    className="w-2 h-2 rounded-full ml-2 flex-shrink-0"
                    style={{ backgroundColor: isDarkMode ? appearanceSettings.primaryColor : 'white' }}
                  />
                )}
              </Link>
            );
          })}
        </>
      )}
    </nav>
    </div>
  );

  return (
    <>


      {/* Sidebar - always visible on all screen sizes */}
      <aside className={`fixed inset-y-0 left-0 z-40 ${sidebarCollapsed ? 'w-20' : 'w-64'} flex flex-col transition-all duration-300 ${isDarkMode ? 'dark' : ''}`}>
        <div
          className="flex flex-col h-full border-r"
          style={{
            backgroundColor: isDarkMode ? appearanceSettings.primaryColor : '#ffffff',
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0'
          }}
        >
          {/* Sidebar Header */}
          <div
            className={`flex items-center justify-between ${sidebarCollapsed ? 'px-2' : 'px-4'} py-6 border-b`}
            style={{
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0',
              minHeight: '100px',
              overflow: 'visible'
            }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Icon name="Layers" size={16} color="white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h2 className={`text-sm font-heading font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    Navigation
                  </h2>
                  <p className={`text-xs font-caption ${isDarkMode ? 'text-white' : 'text-gray-600'}`}>
                    Quick access
                  </p>
                </div>
              )}
            </div>


          </div>

          <SidebarContent />

          {/* User Profile & Logout */}
          <div
            className={`flex-shrink-0 ${sidebarCollapsed ? 'p-2' : 'p-4'} border-t`}
            style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0' }}
          >
            {user && (
              <div className="space-y-3">
                {/* User Info */}
                <div
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} p-3 rounded-lg`}
                  style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#f8fafc' }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-xs">
                      {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  {!sidebarCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium truncate ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {user.fullName}
                      </p>
                      <p className={`text-xs truncate ${
                        isDarkMode ? 'text-white' : 'text-gray-600'
                      }`}>
                        {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                    </div>
                  )}
                </div>

                {/* Logout Button */}
                {!sidebarCollapsed ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className={`w-full ${
                      isDarkMode
                        ? 'text-white hover:text-gray-200 hover:bg-[rgba(255,255,255,0.1)]'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                    iconName="LogOut"
                    iconPosition="left"
                  >
                    Sign Out
                  </Button>
                ) : (
                  <button
                    onClick={logout}
                    className={`w-full p-2 rounded-lg transition-colors ${
                      isDarkMode
                        ? 'text-white hover:text-gray-200 hover:bg-[rgba(255,255,255,0.1)]'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                    title="Sign Out"
                  >
                    <Icon name="LogOut" size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default NavigationSidebar;
