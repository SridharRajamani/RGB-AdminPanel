import React, { useState } from 'react';
import Icon from '../../../../components/AppIcon';
import Button from '../../../../components/ui/Button';

const AlertSidebar = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'member_approval',
      title: 'New Member Application',
      description: 'Rajesh Kumar has submitted membership application with all required documents.',
      timestamp: '2 hours ago',
      priority: 'high',
      actionRequired: true,
      details: {
        name: 'Rajesh Kumar',
        profession: 'Software Engineer',
        sponsor: 'Amit Sharma'
      }
    },
    {
      id: 2,
      type: 'project_approval',
      title: 'Project Proposal Review',
      description: 'Community health camp project proposal needs approval for ₹50,000 budget.',
      timestamp: '4 hours ago',
      priority: 'high',
      actionRequired: true,
      details: {
        project: 'Community Health Camp',
        budget: '₹50,000',
        duration: '3 months'
      }
    },
    {
      id: 3,
      type: 'budget_approval',
      title: 'Budget Approval Required',
      description: 'Annual charity event budget of ₹2,50,000 requires immediate approval.',
      timestamp: '1 day ago',
      priority: 'medium',
      actionRequired: true,
      details: {
        event: 'Annual Charity Gala',
        amount: '₹2,50,000',
        category: 'Fundraising'
      }
    },
    {
      id: 4,
      type: 'member_approval',
      title: 'Membership Renewal',
      description: 'Priya Patel has submitted renewal application with updated documents.',
      timestamp: '2 days ago',
      priority: 'medium',
      actionRequired: true,
      details: {
        name: 'Priya Patel',
        type: 'Renewal',
        expiry: '31/12/2024'
      }
    }
  ]);

  const [selectedAlert, setSelectedAlert] = useState(null);

  const handleApprove = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, actionRequired: false, status: 'approved' }
        : alert
    ));
    setSelectedAlert(null);
  };

  const handleReject = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, actionRequired: false, status: 'rejected' }
        : alert
    ));
    setSelectedAlert(null);
  };

  const handleRequestChanges = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId 
        ? { ...alert, actionRequired: false, status: 'changes_requested' }
        : alert
    ));
    setSelectedAlert(null);
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'member_approval':
        return 'UserPlus';
      case 'project_approval':
        return 'FolderOpen';
      case 'budget_approval':
        return 'DollarSign';
      default:
        return 'Bell';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-error bg-error-50';
      case 'medium':
        return 'border-l-warning bg-warning-50';
      case 'low':
        return 'border-l-success bg-success-50';
      default:
        return 'border-l-primary bg-primary-50';
    }
  };

  const pendingAlerts = alerts.filter(alert => alert.actionRequired);

  return (
    <div className="bg-surface rounded-xl border border-border shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-heading font-semibold text-text-primary">
            Alert Center
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-error rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">
                {pendingAlerts.length}
              </span>
            </div>
            <Icon name="Bell" size={20} className="text-primary" />
          </div>
        </div>
        <p className="text-sm text-text-secondary mt-1">
          {pendingAlerts.length} pending approvals
        </p>
      </div>

      {/* Alert List */}
      <div className="max-h-96 overflow-y-auto scrollbar-hide">
        {pendingAlerts.length === 0 ? (
          <div className="p-6 text-center">
            <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-3" />
            <p className="text-text-secondary">All caught up!</p>
            <p className="text-sm text-text-muted">No pending approvals</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {pendingAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`border-l-4 rounded-lg p-4 transition-all duration-200 hover:shadow-md cursor-pointer ${getPriorityColor(alert.priority)}`}
                onClick={() => setSelectedAlert(alert)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Icon 
                      name={getAlertIcon(alert.type)} 
                      size={20} 
                      className="text-text-primary" 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-text-primary mb-1">
                      {alert.title}
                    </h3>
                    <p className="text-xs text-text-secondary line-clamp-2 mb-2">
                      {alert.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-muted">
                        {alert.timestamp}
                      </span>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${
                          alert.priority === 'high' ? 'bg-error' :
                          alert.priority === 'medium' ? 'bg-warning' : 'bg-success'
                        }`} />
                        <span className="text-xs font-medium text-text-secondary capitalize">
                          {alert.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998] flex items-center justify-center p-4">
          <div className="bg-surface rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-heading font-semibold text-text-primary">
                  {selectedAlert.title}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="X"
                  onClick={() => setSelectedAlert(null)}
                  className="text-text-secondary hover:text-text-primary"
                />
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Icon 
                  name={getAlertIcon(selectedAlert.type)} 
                  size={24} 
                  className="text-primary" 
                />
                <div>
                  <p className="text-sm text-text-secondary">
                    {selectedAlert.description}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    {selectedAlert.timestamp}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="bg-surface-secondary rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium text-text-primary mb-3">
                  Details
                </h4>
                <div className="space-y-2">
                  {Object.entries(selectedAlert.details).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-sm text-text-secondary capitalize">
                        {key.replace('_', ' ')}:
                      </span>
                      <span className="text-sm font-medium text-text-primary">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3">
                <Button
                  variant="success"
                  size="md"
                  iconName="Check"
                  iconPosition="left"
                  onClick={() => handleApprove(selectedAlert.id)}
                  className="w-full"
                >
                  Approve
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="warning"
                    size="sm"
                    iconName="Edit"
                    iconPosition="left"
                    onClick={() => handleRequestChanges(selectedAlert.id)}
                  >
                    Request Changes
                  </Button>
                  
                  <Button
                    variant="danger"
                    size="sm"
                    iconName="X"
                    iconPosition="left"
                    onClick={() => handleReject(selectedAlert.id)}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-border">
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
  );
};

export default AlertSidebar;