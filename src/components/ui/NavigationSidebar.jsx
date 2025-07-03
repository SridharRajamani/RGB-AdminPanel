import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';

const NavigationSidebar = ({ isSidebarCollapsed = false, isSidebarVisible = true }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout, hasPermission } = useAuth();

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
                ? 'bg-white text-[#252569] shadow-md'
                : 'text-text-secondary hover:text-white hover:bg-[rgba(255,255,255,0.5)]'
              }
            `}
            title={isSidebarCollapsed ? item.label : undefined}
          >
            <Icon
              name={item.icon}
              size={20}
              className={`mr-3 flex-shrink-0 ${isActive ? 'text-[#252569]' : 'text-text-muted group-hover:text-white'}`}
            />
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${isActive ? 'text-[#252569]' : 'group-hover:text-white'}`}>
                  {item.label}
                </p>
                <p className={`text-xs mt-0.5 ${isActive ? 'text-[#252569]' : 'text-text-muted group-hover:text-white'}`}>
                  {item.description}
                </p>
              </div>
            )}
            {isActive && (
              <div className="w-2 h-2 rounded-full ml-2 flex-shrink-0" style={{ backgroundColor: '#252569' }} />
            )}
          </Link>
        );
      })}

      {/* Admin Section */}
      {adminItems.some(item => hasPermission(item.permission)) && (
        <>
          <div className="pt-4 pb-2">
            {!isSidebarCollapsed && (
              <p className="px-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
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
                    ? 'bg-white text-[#252569] shadow-md'
                    : 'text-text-secondary hover:text-white hover:bg-[rgba(255,255,255,0.5)]'
                  }
                `}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <Icon
                  name={item.icon}
                  size={20}
                  className={`mr-3 flex-shrink-0 ${isActive ? 'text-[#252569]' : 'text-text-muted group-hover:text-white'}`}
                />
                {!isSidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${isActive ? 'text-[#252569]' : 'group-hover:text-white'}`}>
                      {item.label}
                    </p>
                    <p className={`text-xs mt-0.5 ${isActive ? 'text-[#252569]' : 'text-text-muted group-hover:text-white'}`}>
                      {item.description}
                    </p>
                  </div>
                )}
                {isActive && (
                  <div className="w-2 h-2 rounded-full ml-2 flex-shrink-0" style={{ backgroundColor: '#252569' }} />
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
        <div className="flex flex-col flex-1 min-h-0" style={{ backgroundColor: '#252569' }}>
          {/* Sidebar Header */}
          <div className="flex items-center px-4 py-6 border-b" style={{ borderColor: '#252569' }}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Icon name="Layers" size={16} color="white" />
              </div>
              <div>
                <h2 className="text-sm font-heading font-semibold text-text-primary">
                  Navigation
                </h2>
                <p className="text-xs font-caption text-text-muted">
                  Quick access
                </p>
              </div>
            </div>
          </div>

          <SidebarContent />

          {/* User Profile & Logout */}
          <div className="flex-shrink-0 p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            {user && (
              <div className="space-y-3">
                {/* User Info */}
                <div className="flex items-center space-x-3 p-3 bg-[rgba(255,255,255,0.1)] rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-xs">
                      {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  {!isSidebarCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-text-muted truncate">
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
                  className={`w-full text-text-muted hover:text-white hover:bg-[rgba(255,255,255,0.1)] ${isSidebarCollapsed ? 'px-2' : ''}`}
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
