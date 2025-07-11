import React from 'react';
import Icon from '../../../../components/AppIcon';
import Button from '../../../../components/ui/Button';

const MessageList = ({ messages, selectedCategory, onMessageSelect, searchTerm, dateFilter }) => {
  const getCategoryTitle = (categoryId) => {
    const titles = {
      'announcements': 'Announcements',
      'newsletters': 'Newsletters',
      'meeting-minutes': 'Meeting Minutes',
      'general': 'General Messages'
    };
    return titles[categoryId] || 'Messages';
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (dateFilter === 'today') {
      const today = new Date().toDateString();
      return new Date(message.date).toDateString() === today;
    }
    if (dateFilter === 'week') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return new Date(message.date) >= weekAgo;
    }
    if (dateFilter === 'month') {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return new Date(message.date) >= monthAgo;
    }
    
    return true;
  });

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-surface border border-border rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-heading font-semibold text-text-primary">
            {getCategoryTitle(selectedCategory)}
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">
              {filteredMessages.length} messages
            </span>
            <Button
              variant="ghost"
              size="sm"
              iconName="RefreshCw"
              iconSize={16}
              className="text-text-secondary hover:text-text-primary"
            />
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="max-h-96 overflow-y-auto scrollbar-hide">
        {filteredMessages.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Inbox" size={48} className="text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary">No messages found</p>
            <p className="text-sm text-text-muted mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                onClick={() => onMessageSelect(message)}
                className={`p-4 hover:bg-surface-secondary cursor-pointer transition-colors duration-150 ${
                  !message.read ? 'bg-primary-50 border-l-4 border-l-primary' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      <Icon name="User" size={16} color="white" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h4 className={`text-sm font-medium truncate ${
                          !message.read ? 'text-text-primary font-semibold' : 'text-text-primary'
                        }`}>
                          {message.sender}
                        </h4>
                        {message.priority && (
                          <Icon 
                            name="AlertCircle" 
                            size={14} 
                            className={getPriorityColor(message.priority)}
                          />
                        )}
                        {message.hasAttachment && (
                          <Icon name="Paperclip" size={14} className="text-text-muted" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-text-muted">
                          {formatDate(message.date)}
                        </span>
                        {!message.read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <p className={`text-sm mt-1 truncate ${
                      !message.read ? 'text-text-primary font-medium' : 'text-text-secondary'
                    }`}>
                      {message.subject}
                    </p>
                    
                    <p className="text-sm text-text-muted mt-1 line-clamp-2">
                      {message.preview}
                    </p>

                    {message.category === 'announcements' && message.expiryDate && (
                      <div className="flex items-center space-x-1 mt-2">
                        <Icon name="Clock" size={12} className="text-warning" />
                        <span className="text-xs text-warning">
                          Expires: {formatDate(message.expiryDate)}
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
  );
};

export default MessageList;