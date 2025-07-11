import React from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';

const ProjectStatsSidebar = () => {
  const stats = {
    totalProjects: 12,
    activeProjects: 8,
    completedProjects: 4,
    totalBudget: 1250000,
    spentBudget: 875000,
    pendingApprovals: 2
  };

  const upcomingDeadlines = [
    {
      id: 1,
      title: "Community Health Camp",
      deadline: "2024-02-15",
      status: "planning",
      daysLeft: 18
    },
    {
      id: 2,
      title: "Youth Leadership Program",
      deadline: "2024-03-30",
      status: "in-progress",
      daysLeft: 62
    },
    {
      id: 3,
      title: "Annual Fundraising Gala",
      deadline: "2024-04-15",
      status: "pending-approval",
      daysLeft: 78
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: "Project created",
      project: "Community Health Camp",
      user: "Dr. Sharma",
      time: "2 hours ago"
    },
    {
      id: 2,
      action: "Milestone completed",
      project: "Youth Leadership Program",
      user: "Mr. Patel",
      time: "5 hours ago"
    },
    {
      id: 3,
      action: "Budget approved",
      project: "School Infrastructure",
      user: "Finance Committee",
      time: "1 day ago"
    },
    {
      id: 4,
      action: "Status updated",
      project: "Annual Fundraising Gala",
      user: "Event Committee",
      time: "2 days ago"
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning':
        return 'text-yellow-600';
      case 'in-progress':
        return 'text-blue-600';
      case 'pending-approval':
        return 'text-orange-600';
      case 'completed':
        return 'text-green-600';
      default:
        return 'text-text-muted';
    }
  };

  const budgetUsedPercentage = (stats.spentBudget / stats.totalBudget) * 100;

  return (
    <div className="space-y-6">
      {/* Project Statistics */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">
            Project Overview
          </h3>
          <Button
            variant="ghost"
            size="sm"
            iconName="BarChart3"
            className="text-text-secondary hover:text-text-primary"
          />
        </div>

        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-primary/5 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-primary">
                {stats.totalProjects}
              </div>
              <div className="text-xs text-text-secondary">
                Total Projects
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-blue-600">
                {stats.activeProjects}
              </div>
              <div className="text-xs text-text-secondary">
                Active Projects
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-green-600">
                {stats.completedProjects}
              </div>
              <div className="text-xs text-text-secondary">
                Completed
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-orange-600">
                {stats.pendingApprovals}
              </div>
              <div className="text-xs text-text-secondary">
                Pending Approval
              </div>
            </div>
          </div>

          {/* Budget Summary */}
          <div className="bg-surface-secondary rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-primary">
                Budget Overview
              </span>
              <Icon name="DollarSign" size={16} className="text-text-muted" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Total Budget:</span>
                <span className="font-semibold text-text-primary">
                  {formatCurrency(stats.totalBudget)}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Spent:</span>
                <span className="font-semibold text-text-primary">
                  {formatCurrency(stats.spentBudget)}
                </span>
              </div>
              
              <div className="w-full bg-background rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${budgetUsedPercentage}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">
                  {budgetUsedPercentage.toFixed(1)}% used
                </span>
                <span className="text-text-primary font-medium">
                  {formatCurrency(stats.totalBudget - stats.spentBudget)} remaining
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">
            Upcoming Deadlines
          </h3>
          <Button
            variant="ghost"
            size="sm"
            iconName="Clock"
            className="text-text-secondary hover:text-text-primary"
          />
        </div>

        <div className="space-y-3">
          {upcomingDeadlines.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg hover:bg-surface-secondary/80 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status.replace('-', ' ')}
                  </span>
                  <span className="text-xs text-text-muted">
                    • {item.daysLeft} days left
                  </span>
                </div>
              </div>
              
              <div className={`w-2 h-2 rounded-full ${
                item.daysLeft <= 7 ? 'bg-error' : 
                item.daysLeft <= 30 ? 'bg-warning' : 'bg-success'
              }`} />
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-3 text-text-secondary hover:text-text-primary"
        >
          View All Deadlines
        </Button>
      </div>

      {/* Recent Activities */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">
            Recent Activities
          </h3>
          <Button
            variant="ghost"
            size="sm"
            iconName="Activity"
            className="text-text-secondary hover:text-text-primary"
          />
        </div>

        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary">
                  <span className="font-medium">{activity.action}</span>
                  {' '}on{' '}
                  <span className="font-medium">{activity.project}</span>
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-text-secondary">
                    by {activity.user}
                  </span>
                  <span className="text-xs text-text-muted">
                    • {activity.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-3 text-text-secondary hover:text-text-primary"
        >
          View All Activities
        </Button>
      </div>
    </div>
  );
};

export default ProjectStatsSidebar;