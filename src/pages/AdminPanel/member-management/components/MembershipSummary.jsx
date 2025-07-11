import React from 'react';
import Icon from '../../../../components/AppIcon';

const MembershipSummary = ({ summaryData }) => {
  const summaryCards = [
    {
      id: 'total',
      title: 'Total Members',
      value: summaryData.totalMembers,
      change: '+12',
      changeType: 'increase',
      icon: 'Users',
      color: 'primary',
      description: 'Active club members'
    },
    {
      id: 'newJoiners',
      title: 'New This Month',
      value: summaryData.newJoiners,
      change: '+3',
      changeType: 'increase',
      icon: 'UserPlus',
      color: 'success',
      description: 'Recent additions'
    },
    {
      id: 'renewals',
      title: 'Renewal Reminders',
      value: summaryData.renewalReminders,
      change: '5 due',
      changeType: 'warning',
      icon: 'Clock',
      color: 'warning',
      description: 'Memberships expiring'
    },
    {
      id: 'committees',
      title: 'Active Committees',
      value: summaryData.activeCommittees,
      change: 'All active',
      changeType: 'neutral',
      icon: 'Users2',
      color: 'secondary',
      description: 'Committee assignments'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      primary: {
        bg: 'bg-primary-50',
        icon: 'text-primary',
        border: 'border-primary-200'
      },
      success: {
        bg: 'bg-success-50',
        icon: 'text-success',
        border: 'border-success-200'
      },
      warning: {
        bg: 'bg-warning-50',
        icon: 'text-warning',
        border: 'border-warning-200'
      },
      secondary: {
        bg: 'bg-secondary-50',
        icon: 'text-secondary',
        border: 'border-secondary-200'
      }
    };
    return colorMap[color] || colorMap.primary;
  };

  const getChangeClasses = (changeType) => {
    const changeMap = {
      increase: 'text-success',
      decrease: 'text-error',
      warning: 'text-warning',
      neutral: 'text-text-secondary'
    };
    return changeMap[changeType] || changeMap.neutral;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-heading font-semibold text-text-primary">
          Membership Overview
        </h3>
        <button className="text-sm text-primary hover:text-primary-700 font-medium">
          View Details
        </button>
      </div>

      <div className="space-y-4">
        {summaryCards.map((card) => {
          const colors = getColorClasses(card.color);
          
          return (
            <div
              key={card.id}
              className={`bg-surface border ${colors.border} rounded-lg p-4 hover:shadow-md transition-all duration-150 cursor-pointer`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
                  <Icon name={card.icon} size={24} className={colors.icon} />
                </div>
                
                <div className="text-right flex-1 ml-3">
                  <div className="flex items-center justify-end space-x-2">
                    <span className="text-2xl font-bold text-text-primary">
                      {card.value}
                    </span>
                    {card.change && (
                      <span className={`text-xs font-medium ${getChangeClasses(card.changeType)}`}>
                        {card.change}
                      </span>
                    )}
                  </div>
                  
                  <h4 className="text-sm font-medium text-text-primary mt-1">
                    {card.title}
                  </h4>
                  
                  <p className="text-xs text-text-muted mt-1">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="bg-surface border border-border rounded-lg p-4 mt-6">
        <h4 className="text-sm font-medium text-text-primary mb-3">
          Quick Statistics
        </h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Active Rate</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-2 bg-surface-secondary rounded-full overflow-hidden">
                <div className="w-4/5 h-full bg-success rounded-full"></div>
              </div>
              <span className="text-sm font-medium text-text-primary">92%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Attendance Rate</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-2 bg-surface-secondary rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-primary rounded-full"></div>
              </div>
              <span className="text-sm font-medium text-text-primary">78%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Committee Participation</span>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-2 bg-surface-secondary rounded-full overflow-hidden">
                <div className="w-5/6 h-full bg-secondary rounded-full"></div>
              </div>
              <span className="text-sm font-medium text-text-primary">85%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <h4 className="text-sm font-medium text-text-primary mb-3">
          Recent Activity
        </h4>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
              <Icon name="UserPlus" size={16} className="text-success" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-text-primary">New member joined</p>
              <p className="text-xs text-text-muted">Priya Sharma - 2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <Icon name="Edit" size={16} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-text-primary">Profile updated</p>
              <p className="text-xs text-text-muted">Rajesh Kumar - 1 day ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-warning-100 rounded-full flex items-center justify-center">
              <Icon name="Clock" size={16} className="text-warning" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-text-primary">Renewal reminder sent</p>
              <p className="text-xs text-text-muted">5 members - 2 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipSummary;