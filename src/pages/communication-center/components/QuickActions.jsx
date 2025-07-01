import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onActionSelect, recipientGroups, selectedRecipients, onRecipientChange }) => {
  const [showRecipients, setShowRecipients] = useState(false);

  const quickActions = [
    {
      id: 'compose',
      title: 'Compose Message',
      description: 'Send a message to members',
      icon: 'Edit3',
      color: 'bg-primary',
      textColor: 'text-primary-foreground'
    },
    {
      id: 'newsletter',
      title: 'Create Newsletter',
      description: 'Design and send newsletter',
      icon: 'FileText',
      color: 'bg-secondary',
      textColor: 'text-secondary-foreground'
    },
    {
      id: 'announcement',
      title: 'Send Announcement',
      description: 'Broadcast important news',
      icon: 'Megaphone',
      color: 'bg-accent',
      textColor: 'text-accent-foreground'
    },
    {
      id: 'meeting-minutes',
      title: 'Meeting Minutes',
      description: 'Record meeting notes',
      icon: 'FileEdit',
      color: 'bg-success',
      textColor: 'text-success-foreground'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Zap" size={20} className="text-primary" />
          <h3 className="text-lg font-heading font-semibold text-text-primary">
            Quick Actions
          </h3>
        </div>
        
        <div className="space-y-3">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => onActionSelect(action.id)}
              className="w-full p-3 rounded-lg border border-border hover:shadow-md transition-all duration-150 group"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-150`}>
                  <Icon name={action.icon} size={18} className={action.textColor} />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-sm font-medium text-text-primary group-hover:text-primary">
                    {action.title}
                  </h4>
                  <p className="text-xs text-text-muted">
                    {action.description}
                  </p>
                </div>
                <Icon name="ChevronRight" size={16} className="text-text-muted group-hover:text-primary" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recipient Groups */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Users" size={20} className="text-primary" />
            <h3 className="text-lg font-heading font-semibold text-text-primary">
              Recipients
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName={showRecipients ? "ChevronUp" : "ChevronDown"}
            iconSize={16}
            onClick={() => setShowRecipients(!showRecipients)}
            className="text-text-secondary hover:text-text-primary"
          />
        </div>
        
        {showRecipients && (
          <div className="space-y-2">
            {recipientGroups.map((group) => (
              <label
                key={group.id}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-surface-secondary cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedRecipients.includes(group.id)}
                  onChange={(e) => onRecipientChange(group.id, e.target.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Icon name={group.icon} size={16} className="text-text-muted" />
                    <span className="text-sm font-medium text-text-primary">
                      {group.name}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted ml-6">
                    {group.count} members
                  </p>
                </div>
              </label>
            ))}
          </div>
        )}
        
        {!showRecipients && (
          <div className="text-center py-2">
            <p className="text-sm text-text-muted">
              {selectedRecipients.length} groups selected
            </p>
          </div>
        )}
      </div>

      {/* Communication Stats */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="BarChart3" size={20} className="text-primary" />
          <h3 className="text-lg font-heading font-semibold text-text-primary">
            This Month
          </h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-sm text-text-secondary">Messages Sent</span>
            </div>
            <span className="text-sm font-medium text-text-primary">47</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-secondary rounded-full"></div>
              <span className="text-sm text-text-secondary">Newsletters</span>
            </div>
            <span className="text-sm font-medium text-text-primary">3</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span className="text-sm text-text-secondary">Announcements</span>
            </div>
            <span className="text-sm font-medium text-text-primary">12</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-sm text-text-secondary">Open Rate</span>
            </div>
            <span className="text-sm font-medium text-success">87%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;