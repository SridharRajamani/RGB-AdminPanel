import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const NavigationSidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'LayoutDashboard',
      description: 'Overview and metrics'
    },
    {
      label: 'Members',
      path: '/member-management',
      icon: 'Users',
      description: 'Member management'
    },
    {
      label: 'Events',
      path: '/event-management',
      icon: 'Calendar',
      description: 'Event planning'
    },
    {
      label: 'Projects',
      path: '/project-management',
      icon: 'FolderOpen',
      description: 'Project tracking'
    },
    {
      label: 'Finance',
      path: '/financial-reports',
      icon: 'DollarSign',
      description: 'Financial reports'
    },
    {
      label: 'Communications',
      path: '/communication-center',
      icon: 'MessageSquare',
      description: 'Announcements & newsletters'
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
    <nav className="flex-1 px-4 py-6 space-y-2">
      {navigationItems.map((item) => {
        const isActive = isActiveRoute(item.path);
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`
              group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-150
              ${isActive 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
              }
            `}
          >
            <Icon 
              name={item.icon} 
              size={20} 
              className={`mr-3 flex-shrink-0 ${isActive ? 'text-primary-foreground' : 'text-text-muted group-hover:text-text-primary'}`}
            />
            <div className="flex-1 min-w-0">
              <p className={`font-medium ${isActive ? 'text-primary-foreground' : ''}`}>
                {item.label}
              </p>
              <p className={`text-xs mt-0.5 ${isActive ? 'text-primary-100' : 'text-text-muted group-hover:text-text-secondary'}`}>
                {item.description}
              </p>
            </div>
            {isActive && (
              <div className="w-2 h-2 bg-primary-foreground rounded-full ml-2 flex-shrink-0" />
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Hamburger Trigger Button - place this in your header/topbar in real usage */}
      <button
        data-mobile-menu-trigger
        className="lg:hidden fixed top-4 left-4 z-[201] p-2 bg-white rounded shadow"
        onClick={() => setIsMobileMenuOpen(true)}
        aria-label="Open sidebar menu"
      >
        <Icon name="Menu" size={24} />
      </button>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-100 lg:w-60 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-surface border-r border-border">
          {/* Sidebar Header */}
          <div className="flex items-center px-4 py-6 border-b border-border">
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

          {/* Sidebar Footer */}
          <div className="flex-shrink-0 p-4 border-t border-border">
            <div className="flex items-center space-x-3 p-3 bg-surface-secondary rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-success to-accent rounded-full flex items-center justify-center">
                <Icon name="Zap" size={14} color="white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-text-primary">
                  System Status
                </p>
                <p className="text-xs text-success">
                  All systems operational
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-100 bg-black bg-opacity-50 transition-opacity duration-200" />
      )}

      {/* Mobile Sidebar */}
      <aside className={`
        lg:hidden fixed inset-y-0 left-0 z-200 w-64 bg-surface border-r border-border transform transition-transform duration-200 ease-in-out mobile-sidebar
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col flex-1 min-h-0">
          {/* Mobile Sidebar Header */}
          <div className="flex items-center justify-between px-4 py-6 border-b border-border">
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
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              iconSize={20}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-text-secondary hover:text-text-primary"
            />
          </div>

          <SidebarContent />

          {/* Mobile Sidebar Footer */}
          <div className="flex-shrink-0 p-4 border-t border-border">
            <div className="flex items-center space-x-3 p-3 bg-surface-secondary rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-success to-accent rounded-full flex items-center justify-center">
                <Icon name="Zap" size={14} color="white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-text-primary">
                  System Status
                </p>
                <p className="text-xs text-success">
                  All systems operational
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default NavigationSidebar;
