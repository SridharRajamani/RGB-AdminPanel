import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FinancialSidebar = () => {
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Quick financial stats
  const quickStats = {
    cashFlow: {
      thisMonth: 37500,
      lastMonth: 42000,
      trend: 'down'
    },
    pendingApprovals: 3,
    overduePayments: 1,
    upcomingPayments: 5
  };

  // Recent transactions
  const recentTransactions = [
    {
      id: 1,
      description: 'Community Health Camp',
      amount: -25000,
      date: '2024-01-15',
      category: 'Community Projects'
    },
    {
      id: 2,
      description: 'Membership Fees Q1',
      amount: 45000,
      date: '2024-01-12',
      category: 'Membership'
    },
    {
      id: 3,
      description: 'Office Rent January',
      amount: -15000,
      date: '2024-01-05',
      category: 'Administrative'
    },
    {
      id: 4,
      description: 'Corporate Sponsorship',
      amount: 100000,
      date: '2024-01-08',
      category: 'Fundraising'
    }
  ];

  // Financial alerts
  const financialAlerts = [
    {
      id: 1,
      type: 'budget_exceeded',
      title: 'Budget Alert',
      message: 'Events & Meetings category has exceeded 90% of allocated budget',
      priority: 'high',
      amount: 198000,
      budget: 220000,
      category: 'Events & Meetings'
    },
    {
      id: 2,
      type: 'payment_due',
      title: 'Payment Due',
      message: 'Venue booking payment due in 3 days',
      priority: 'medium',
      amount: 75000,
      dueDate: '2024-01-18'
    },
    {
      id: 3,
      type: 'low_balance',
      title: 'Low Balance Warning',
      message: 'Emergency fund balance is below recommended threshold',
      priority: 'medium',
      amount: 15000,
      threshold: 50000
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short'
    });
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'border-l-error bg-error/5',
      medium: 'border-l-warning bg-warning/5',
      low: 'border-l-primary bg-primary/5'
    };
    return colors[priority] || colors.low;
  };

  const getAlertIcon = (type) => {
    const icons = {
      budget_exceeded: 'AlertTriangle',
      payment_due: 'Clock',
      low_balance: 'AlertCircle'
    };
    return icons[type] || 'Info';
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats Card */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          <h3 className="text-lg font-heading font-semibold text-text-primary">
            Quick Stats
          </h3>
        </div>

        <div className="space-y-4">
          {/* Cash Flow */}
          <div className="flex items-center justify-between p-3 bg-background rounded-lg">
            <div>
              <p className="text-sm font-medium text-text-primary">Monthly Cash Flow</p>
              <p className="text-lg font-semibold text-success">
                {formatCurrency(quickStats.cashFlow.thisMonth)}
              </p>
            </div>
            <div className={`flex items-center space-x-1 text-sm ${
              quickStats.cashFlow.trend === 'up' ? 'text-success' : 'text-error'
            }`}>
              <Icon 
                name={quickStats.cashFlow.trend === 'up' ? 'ArrowUp' : 'ArrowDown'} 
                size={16} 
              />
              <span>
                {Math.abs(((quickStats.cashFlow.thisMonth - quickStats.cashFlow.lastMonth) / quickStats.cashFlow.lastMonth) * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Action Items */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-warning/10 rounded-lg border border-warning/20">
              <p className="text-2xl font-bold text-warning">{quickStats.pendingApprovals}</p>
              <p className="text-xs text-text-secondary">Pending Approvals</p>
            </div>
            <div className="text-center p-3 bg-error/10 rounded-lg border border-error/20">
              <p className="text-2xl font-bold text-error">{quickStats.overduePayments}</p>
              <p className="text-xs text-text-secondary">Overdue Payments</p>
            </div>
          </div>

          <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-2xl font-bold text-primary">{quickStats.upcomingPayments}</p>
            <p className="text-xs text-text-secondary">Upcoming Payments</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Activity" size={20} className="text-primary" />
            <h3 className="text-lg font-heading font-semibold text-text-primary">
              Recent Transactions
            </h3>
          </div>
          <Button variant="ghost" size="sm" iconName="ExternalLink">
            View All
          </Button>
        </div>

        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-surface-secondary rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  transaction.amount > 0 ? 'bg-success/10' : 'bg-error/10'
                }`}>
                  <Icon 
                    name={transaction.amount > 0 ? 'ArrowDownLeft' : 'ArrowUpRight'} 
                    size={16} 
                    className={transaction.amount > 0 ? 'text-success' : 'text-error'}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-text-muted">
                    {formatDate(transaction.date)} • {transaction.category}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${
                  transaction.amount > 0 ? 'text-success' : 'text-error'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Alerts */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={20} className="text-warning" />
            <h3 className="text-lg font-heading font-semibold text-text-primary">
              Financial Alerts
            </h3>
          </div>
          <div className="w-6 h-6 bg-error rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">
              {financialAlerts.length}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {financialAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`border-l-4 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${getPriorityColor(alert.priority)}`}
              onClick={() => setSelectedAlert(alert)}
            >
              <div className="flex items-start space-x-3">
                <Icon 
                  name={getAlertIcon(alert.type)} 
                  size={18} 
                  className="text-text-primary mt-0.5" 
                />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-text-primary mb-1">
                    {alert.title}
                  </h4>
                  <p className="text-xs text-text-secondary mb-2">
                    {alert.message}
                  </p>
                  {alert.amount && (
                    <p className="text-xs font-medium text-text-primary">
                      Amount: {formatCurrency(alert.amount)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            iconName="Bell"
            iconPosition="left"
            className="w-full text-primary hover:text-primary-700"
          >
            View All Alerts
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Zap" size={20} className="text-primary" />
          <h3 className="text-lg font-heading font-semibold text-text-primary">
            Quick Actions
          </h3>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            className="w-full justify-start"
          >
            Add Transaction
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="FileText"
            iconPosition="left"
            className="w-full justify-start"
          >
            Generate Report
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Settings"
            iconPosition="left"
            className="w-full justify-start"
          >
            Budget Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinancialSidebar;
