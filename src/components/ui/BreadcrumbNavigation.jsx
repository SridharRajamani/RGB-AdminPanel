import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Icon from '../AppIcon';

const BreadcrumbNavigation = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const routeMap = {
    '/dashboard': { label: t('navigation.dashboard', 'Dashboard'), icon: 'LayoutDashboard' },
    '/member-management': { label: t('navigation.members', 'Member Management'), icon: 'Users' },
    '/event-management': { label: t('navigation.events', 'Event Management'), icon: 'Calendar' },
    '/financial-reports': { label: t('navigation.finance', 'Financial Reports'), icon: 'DollarSign' },
    '/project-management': { label: t('navigation.projects', 'Project Management'), icon: 'FolderOpen' },
    '/donations': { label: t('navigation.donations', 'Donations'), icon: 'Heart' },
    '/communication-center': { label: t('navigation.communications', 'Communication Center'), icon: 'MessageSquare' }
  };

  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [{ label: t('navigation.dashboard', 'Dashboard'), path: '/dashboard', icon: 'LayoutDashboard' }];

    if (location.pathname !== '/dashboard') {
      const currentRoute = routeMap[location.pathname];
      if (currentRoute) {
        breadcrumbs.push({
          label: currentRoute.label,
          path: location.pathname,
          icon: currentRoute.icon
        });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm font-caption mb-6" aria-label="Breadcrumb">
      <div className="flex items-center space-x-2">
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isFirst = index === 0;

          return (
            <div key={breadcrumb.path} className="flex items-center space-x-2">
              {isFirst && (
                <Icon 
                  name="Home" 
                  size={16} 
                  className="text-text-muted flex-shrink-0" 
                />
              )}
              
              {isLast ? (
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={breadcrumb.icon} 
                    size={16} 
                    className="text-primary flex-shrink-0" 
                  />
                  <span className="font-medium text-text-primary truncate">
                    {breadcrumb.label}
                  </span>
                </div>
              ) : (
                <Link
                  to={breadcrumb.path}
                  className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors duration-150 group"
                >
                  {!isFirst && (
                    <Icon 
                      name={breadcrumb.icon} 
                      size={16} 
                      className="text-text-muted group-hover:text-primary flex-shrink-0" 
                    />
                  )}
                  <span className="hover:underline truncate">
                    {breadcrumb.label}
                  </span>
                </Link>
              )}

              {!isLast && (
                <Icon 
                  name="ChevronRight" 
                  size={16} 
                  className="text-text-muted flex-shrink-0" 
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions for Current Page */}
      {location.pathname !== '/dashboard' && (
        <div className="ml-auto flex items-center space-x-2">
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-1 px-2 py-1 text-xs text-text-secondary hover:text-primary hover:bg-surface-secondary rounded transition-all duration-150"
            title="Go back"
          >
            <Icon name="ArrowLeft" size={14} />
            <span className="hidden sm:inline">Back</span>
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-1 px-2 py-1 text-xs text-text-secondary hover:text-primary hover:bg-surface-secondary rounded transition-all duration-150"
            title="Refresh page"
          >
            <Icon name="RefreshCw" size={14} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default BreadcrumbNavigation;