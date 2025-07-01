import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const QuickActions = () => {
  const quickActions = [
    {
      id: 1,
      title: 'Member Management',
      description: 'Add, edit, and manage club members',
      icon: 'Users',
      route: '/member-management',
      color: 'bg-gradient-to-br from-blue-50 to-blue-100',
      iconColor: 'text-blue-600',
      badge: '3',
      badgeColor: 'bg-blue-500'
    },
    {
      id: 2,
      title: 'Event Planning',
      description: 'Schedule and organize club events',
      icon: 'Calendar',
      route: '/event-management',
      color: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      iconColor: 'text-emerald-600',
      badge: '2',
      badgeColor: 'bg-emerald-500'
    },
    {
      id: 3,
      title: 'Financial Reports',
      description: 'View and generate financial reports',
      icon: 'DollarSign',
      route: '/financial-reports',
      color: 'bg-gradient-to-br from-violet-50 to-violet-100',
      iconColor: 'text-violet-600',
      badge: null,
      badgeColor: ''
    },
    {
      id: 4,
      title: 'Project Management',
      description: 'Track and manage club projects',
      icon: 'FolderOpen',
      route: '/project-management',
      color: 'bg-gradient-to-br from-amber-50 to-amber-100',
      iconColor: 'text-amber-600',
      badge: '5',
      badgeColor: 'bg-amber-500'
    },
    {
      id: 5,
      title: 'Communications',
      description: 'Send announcements and newsletters',
      icon: 'MessageSquare',
      route: '/communication-center',
      color: 'bg-gradient-to-br from-cyan-50 to-cyan-100',
      iconColor: 'text-cyan-600',
      badge: '1',
      badgeColor: 'bg-cyan-500'
    },
    {
      id: 6,
      title: 'Meeting Logs',
      description: 'Track attendance and meeting records',
      icon: 'FileText',
      route: '/dashboard',
      color: 'bg-gradient-to-br from-rose-50 to-rose-100',
      iconColor: 'text-rose-600',
      badge: null,
      badgeColor: ''
    },
    {
      id: 7,
      title: 'Donations',
      description: 'Manage fundraising and donations',
      icon: 'Heart',
      route: '/dashboard',
      color: 'bg-gradient-to-br from-pink-50 to-pink-100',
      iconColor: 'text-pink-600',
      badge: '8',
      badgeColor: 'bg-pink-500'
    },
    {
      id: 8,
      title: 'Settings',
      description: 'Configure system and user settings',
      icon: 'Settings',
      route: '/dashboard',
      color: 'bg-gradient-to-br from-slate-50 to-slate-100',
      iconColor: 'text-slate-600',
      badge: null,
      badgeColor: ''
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-text-primary">
          Quick Actions
        </h2>
        <div className="text-sm text-text-secondary">
          Click any action to get started
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {quickActions.map((action) => (
          <Link
            key={action.id}
            to={action.route}
            className="group block"
          >
            <div className={`${action.color} rounded-xl p-6 border border-border hover:border-primary/20 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 relative overflow-hidden`}>
              {action.badge && (
                <div className={`absolute top-4 right-4 ${action.badgeColor} text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center`}>
                  {action.badge}
                </div>
              )}
              
              <div className="flex items-center space-x-4 mb-4">
                <div className={`p-3 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow duration-200`}>
                  <Icon 
                    name={action.icon} 
                    size={24} 
                    className={`${action.iconColor} group-hover:scale-110 transition-transform duration-200`}
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors duration-200">
                  {action.title}
                </h3>
                <p className="text-sm text-text-secondary group-hover:text-text-primary transition-colors duration-200">
                  {action.description}
                </p>
              </div>
              
              <div className="mt-4 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="text-sm font-medium">Get Started</span>
                <Icon name="ArrowRight" size={16} className="ml-2" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;