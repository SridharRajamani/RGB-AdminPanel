import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const AlertCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'approval',
      title: 'Budget Approval Required',
      message: 'Annual charity event budget of ₹2,50,000 needs approval',
      timestamp: '2 hours ago',
      priority: 'high',
      category: 'finance',
      actionRequired: true
    },
    {
      id: 2,
      type: 'notification',
      title: 'New Member Application',
      message: 'Rajesh Kumar has submitted membership application',
      timestamp: '4 hours ago',
      priority: 'medium',
      category: 'members',
      actionRequired: true
    },
    {
      id: 3,
      type: 'reminder',
      title: 'Event Reminder',
      message: 'Weekly meeting scheduled for tomorrow at 7:00 PM',
      timestamp: '1 day ago',
      priority: 'low',
      category: 'events',
      actionRequired: false
    },
    {
      id: 4,
      type: 'approval',
      title: 'Project Proposal',
      message: 'Community health camp project proposal awaiting review',
      timestamp: '2 days ago',
      priority: 'high',
      category: 'projects',
      actionRequired: true
    },
    {
      id: 5,
      type: 'notification',
      title: 'Payment Received',
      message: 'Membership fee payment received from 5 members',
      timestamp: '3 days ago',
      priority: 'low',
      category: 'finance',
      actionRequired: false
    }
  ]);

  const [filter, setFilter] = useState('all');

  const toggleAlertCenter = () => {
    setIsOpen(!isOpen);
  };

  const handleApprove = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, actionRequired: false, status: 'approved' }
        : alert
    ));
  };

  const handleReject = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, actionRequired: false, status: 'rejected' }
        : alert
    ));
  };

  const handleMarkAsRead = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, read: true }
        : alert
    ));
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'approval':
        return 'CheckCircle';
      case 'notification':
        return 'Bell';
      case 'reminder':
        return 'Clock';
      default:
        return 'Info';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-text-secondary';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'pending') return alert.actionRequired;
    if (filter === 'approved') return alert.status === 'approved';
    if (filter === 'rejected') return alert.status === 'rejected';
    return alert.category === filter;
  });

  const pendingCount = alerts.filter(alert => alert.actionRequired).length;

  // Close alert center when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.alert-center') && !event.target.closest('[data-alert-trigger]')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Desktop Alert Center */}
      <div className="hidden lg:block fixed right-6 top-20 z-250">
        <div className="relative">
          <Button
            variant="primary"
            size="md"
            iconName="Bell"
            iconSize={20}
            onClick={toggleAlertCenter}
            className="relative shadow-lg"
            data-alert-trigger
          >
            Alerts
            {pendingCount > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-error text-white text-xs font-bold rounded-full flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </Button>

          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-96 bg-surface border border-border rounded-lg shadow-2xl alert-center animate-fade-in">
              {/* Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-heading font-semibold text-text-primary">
                    Alert Center
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="X"
                    iconSize={16}
                    onClick={() => setIsOpen(false)}
                    className="text-text-secondary hover:text-text-primary"
                  />
                </div>
                
                {/* Filter Tabs */}
                <div className="flex space-x-1 mt-3">
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'pending', label: 'Pending' },
                    { key: 'finance', label: 'Finance' },
                    { key: 'members', label: 'Members' }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setFilter(tab.key)}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-150 ${
                        filter === tab.key
                          ? 'bg-primary text-primary-foreground'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                      }`}
                    >
                      {tab.label}
                      {tab.key === 'pending' && pendingCount > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 bg-error text-white text-xs rounded-full">
                          {pendingCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Alert List */}
              <div className="max-h-96 overflow-y-auto scrollbar-hide">
                {filteredAlerts.length === 0 ? (
                  <div className="p-6 text-center">
                    <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-3" />
                    <p className="text-text-secondary">No alerts to display</p>
                  </div>
                ) : (
                  <div className="p-2">
                    {filteredAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-3 mb-2 rounded-lg border transition-all duration-150 ${
                          alert.read 
                            ? 'bg-surface-secondary border-border-muted' :'bg-surface border-border hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`flex-shrink-0 ${getPriorityColor(alert.priority)}`}>
                            <Icon name={getAlertIcon(alert.type)} size={20} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-text-primary truncate">
                                {alert.title}
                              </h4>
                              <span className="text-xs text-text-muted flex-shrink-0 ml-2">
                                {alert.timestamp}
                              </span>
                            </div>
                            
                            <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                              {alert.message}
                            </p>

                            {alert.actionRequired && !alert.status && (
                              <div className="flex space-x-2 mt-3">
                                <Button
                                  variant="success"
                                  size="xs"
                                  iconName="Check"
                                  iconPosition="left"
                                  onClick={() => handleApprove(alert.id)}
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="danger"
                                  size="xs"
                                  iconName="X"
                                  iconPosition="left"
                                  onClick={() => handleReject(alert.id)}
                                >
                                  Reject
                                </Button>
                              </div>
                            )}

                            {alert.status && (
                              <div className="mt-2">
                                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                  alert.status === 'approved' ?'bg-success-100 text-success-700' :'bg-error-100 text-error-700'
                                }`}>
                                  <Icon 
                                    name={alert.status === 'approved' ? 'Check' : 'X'} 
                                    size={12} 
                                    className="mr-1" 
                                  />
                                  {alert.status === 'approved' ? 'Approved' : 'Rejected'}
                                </span>
                              </div>
                            )}

                            {!alert.read && !alert.actionRequired && (
                              <Button
                                variant="ghost"
                                size="xs"
                                onClick={() => handleMarkAsRead(alert.id)}
                                className="mt-2 text-text-muted hover:text-text-primary"
                              >
                                Mark as read
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="ExternalLink"
                  iconPosition="right"
                  className="w-full text-primary hover:text-primary-700"
                >
                  View All Notifications
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Alert Center (Bottom Sheet) */}
      <div className="lg:hidden">
        <Button
          variant="primary"
          size="md"
          iconName="Bell"
          iconSize={20}
          onClick={toggleAlertCenter}
          className="fixed bottom-6 right-6 z-250 shadow-lg rounded-full w-14 h-14"
          data-alert-trigger
        >
          {pendingCount > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-error text-white text-xs font-bold rounded-full flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </Button>

        {isOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-300" />
            <div className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-xl z-400 max-h-[80vh] alert-center animate-slide-in">
              {/* Mobile Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-heading font-semibold text-text-primary">
                    Alert Center
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="X"
                    iconSize={20}
                    onClick={() => setIsOpen(false)}
                    className="text-text-secondary hover:text-text-primary"
                  />
                </div>
                
                {/* Mobile Filter Tabs */}
                <div className="flex space-x-1 mt-3 overflow-x-auto">
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'pending', label: 'Pending' },
                    { key: 'finance', label: 'Finance' },
                    { key: 'members', label: 'Members' }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setFilter(tab.key)}
                      className={`flex-shrink-0 px-3 py-1 text-xs font-medium rounded-full transition-all duration-150 ${
                        filter === tab.key
                          ? 'bg-primary text-primary-foreground'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                      }`}
                    >
                      {tab.label}
                      {tab.key === 'pending' && pendingCount > 0 && (
                        <span className="ml-1 px-1.5 py-0.5 bg-error text-white text-xs rounded-full">
                          {pendingCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Alert List */}
              <div className="overflow-y-auto flex-1 p-4">
                {filteredAlerts.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-3" />
                    <p className="text-text-secondary">No alerts to display</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-lg border transition-all duration-150 ${
                          alert.read 
                            ? 'bg-surface-secondary border-border-muted' :'bg-surface border-border'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`flex-shrink-0 ${getPriorityColor(alert.priority)}`}>
                            <Icon name={getAlertIcon(alert.type)} size={20} />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-text-primary">
                                {alert.title}
                              </h4>
                              <span className="text-xs text-text-muted flex-shrink-0 ml-2">
                                {alert.timestamp}
                              </span>
                            </div>
                            
                            <p className="text-sm text-text-secondary mt-1">
                              {alert.message}
                            </p>

                            {alert.actionRequired && !alert.status && (
                              <div className="flex space-x-2 mt-3">
                                <Button
                                  variant="success"
                                  size="sm"
                                  iconName="Check"
                                  iconPosition="left"
                                  onClick={() => handleApprove(alert.id)}
                                  className="flex-1"
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  iconName="X"
                                  iconPosition="left"
                                  onClick={() => handleReject(alert.id)}
                                  className="flex-1"
                                >
                                  Reject
                                </Button>
                              </div>
                            )}

                            {alert.status && (
                              <div className="mt-2">
                                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                  alert.status === 'approved' ?'bg-success-100 text-success-700' :'bg-error-100 text-error-700'
                                }`}>
                                  <Icon 
                                    name={alert.status === 'approved' ? 'Check' : 'X'} 
                                    size={12} 
                                    className="mr-1" 
                                  />
                                  {alert.status === 'approved' ? 'Approved' : 'Rejected'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AlertCenter;