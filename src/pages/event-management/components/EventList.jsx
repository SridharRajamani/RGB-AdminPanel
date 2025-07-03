import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const EventList = ({ events, onEditEvent, onDuplicateEvent, onCancelEvent, onViewAttendees }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs = [
    { key: 'all', label: 'All Events', count: events.length },
    { key: 'meeting', label: 'Meetings', count: events.filter(e => e.type === 'meeting').length },
    { key: 'fundraising', label: 'Fundraising', count: events.filter(e => e.type === 'fundraising').length },
    { key: 'community-service', label: 'Community Service', count: events.filter(e => e.type === 'community-service').length },
    { key: 'social', label: 'Social', count: events.filter(e => e.type === 'social').length }
  ];

  const filteredEvents = events.filter(event => {
    const matchesFilter = activeFilter === 'all' || event.type === activeFilter;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'meeting':
        return 'Users';
      case 'fundraising':
        return 'DollarSign';
      case 'community-service':
        return 'Heart';
      case 'social':
        return 'Coffee';
      default:
        return 'Calendar';
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'meeting':
        return 'text-primary bg-primary-50';
      case 'fundraising':
        return 'text-success bg-success-50';
      case 'community-service':
        return 'text-warning bg-warning-50';
      case 'social':
        return 'text-secondary bg-secondary-50';
      default:
        return 'text-accent bg-accent-50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-success bg-success-100';
      case 'pending':
        return 'text-warning bg-warning-100';
      case 'cancelled':
        return 'text-error bg-error-100';
      case 'completed':
        return 'text-text-muted bg-surface-secondary';
      default:
        return 'text-text-secondary bg-surface-secondary';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const isUpcoming = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  };

  // Add a helper to highlight the search term
  function highlightText(text, searchTerm) {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'ig');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <mark key={i} style={{ background: '#ffe066', padding: 0 }}>{part}</mark> : part
    );
  }

  return (
    <div className="bg-surface rounded-lg border border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-lg font-heading font-semibold text-text-primary">
              Events List
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              Manage and track all club events
            </p>
          </div>
          
          {/* Search */}
          <div className="relative lg:w-80">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" 
            />
            <Input
              type="search"
              placeholder="Search events by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mt-4">
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 ${
                activeFilter === tab.key
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                activeFilter === tab.key
                  ? 'bg-primary-200 text-primary-800' :'bg-surface-secondary text-text-muted'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="divide-y divide-border">
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center">
            <Icon name="Calendar" size={48} className="text-text-muted mx-auto mb-4" />
            <h4 className="text-lg font-medium text-text-primary mb-2">
              No events found
            </h4>
            <p className="text-text-secondary">
              {searchQuery ? 'Try adjusting your search criteria' : 'Create your first event to get started'}
            </p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div key={event.id} className="p-6 hover:bg-surface-secondary transition-colors duration-150">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Event Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getEventTypeColor(event.type)}`}>
                      <Icon name={getEventTypeIcon(event.type)} size={20} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-medium text-text-primary truncate">
                          {highlightText(event.title, searchQuery)}
                        </h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                        {isUpcoming(event.date) && (
                          <span className="px-2 py-1 text-xs font-medium bg-accent-100 text-accent-700 rounded-full">
                            Upcoming
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary mb-2">
                        <div className="flex items-center gap-1">
                          <Icon name="Calendar" size={14} />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="Clock" size={14} />
                          <span>{formatTime(event.time)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="MapPin" size={14} />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>

                      {/* RSVP Progress */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Icon name="Users" size={14} className="text-text-muted" />
                          <span className="text-sm text-text-secondary">
                            {event.attendeeCount} / {event.maxAttendees} attendees
                          </span>
                        </div>
                        <div className="flex-1 max-w-32">
                          <div className="w-full bg-surface-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min((event.attendeeCount / event.maxAttendees) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-xs text-text-muted">
                          {Math.round((event.attendeeCount / event.maxAttendees) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                  {event.pendingApprovals > 0 && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-warning-100 text-warning-700 rounded-full text-xs font-medium mb-2">
                      <Icon name="AlertCircle" size={12} />
                      <span>{event.pendingApprovals} pending</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      iconSize={16}
                      onClick={() => onViewAttendees(event.id)}
                      className="text-text-secondary hover:text-primary"
                      title="View attendees"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit"
                      iconSize={16}
                      onClick={() => onEditEvent(event.id)}
                      className="text-text-secondary hover:text-primary"
                      title="Edit event"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Copy"
                      iconSize={16}
                      onClick={() => onDuplicateEvent(event.id)}
                      className="text-text-secondary hover:text-success"
                      title="Duplicate event"
                    />
                    {event.status !== 'cancelled' && event.status !== 'completed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="X"
                        iconSize={16}
                        onClick={() => onCancelEvent(event.id)}
                        className="text-text-secondary hover:text-error"
                        title="Cancel event"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventList;