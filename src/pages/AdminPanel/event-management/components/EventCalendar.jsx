import React, { useState } from 'react';

import Button from '../../../../components/ui/Button';

const EventCalendar = ({ events, onDateSelect, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toDateString();
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === dateStr;
    });
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'meeting':
        return 'bg-primary';
      case 'fundraising':
        return 'bg-success';
      case 'community-service':
        return 'bg-warning';
      case 'social':
        return 'bg-secondary';
      default:
        return 'bg-accent';
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-20 border border-border-muted"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={day}
          onClick={() => onDateSelect(date)}
          className={`h-20 border border-border-muted p-1 cursor-pointer transition-all duration-150 hover:bg-surface-secondary ${
            isSelected ? 'bg-primary-50 border-primary' : ''
          } ${isToday ? 'bg-accent-50' : ''}`}
        >
          <div className={`text-sm font-medium mb-1 ${
            isToday ? 'text-accent font-bold' : 'text-text-primary'
          }`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((event, index) => (
              <div
                key={index}
                className={`text-xs px-1 py-0.5 rounded text-white truncate ${getEventTypeColor(event.type)}`}
                title={event.title}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-text-muted">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-heading font-semibold text-text-primary">
          Event Calendar
        </h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="ChevronLeft"
            iconSize={16}
            onClick={() => navigateMonth(-1)}
            className="text-text-secondary hover:text-text-primary"
          />
          <span className="text-sm font-medium text-text-primary min-w-32 text-center">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <Button
            variant="ghost"
            size="sm"
            iconName="ChevronRight"
            iconSize={16}
            onClick={() => navigateMonth(1)}
            className="text-text-secondary hover:text-text-primary"
          />
        </div>
      </div>

      {/* Calendar Legend */}
      <div className="flex flex-wrap gap-2 mb-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-primary rounded"></div>
          <span className="text-text-secondary">Meetings</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-success rounded"></div>
          <span className="text-text-secondary">Fundraising</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-warning rounded"></div>
          <span className="text-text-secondary">Community Service</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-secondary rounded"></div>
          <span className="text-text-secondary">Social</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0 border border-border-muted rounded-lg overflow-hidden">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-surface-secondary p-2 text-center text-sm font-medium text-text-secondary border-b border-border-muted">
            {day}
          </div>
        ))}
        
        {/* Calendar Days */}
        {renderCalendarDays()}
      </div>

      {/* Today Button */}
      <div className="mt-4 flex justify-center">
        <Button
          variant="outline"
          size="sm"
          iconName="Calendar"
          iconPosition="left"
          onClick={() => {
            const today = new Date();
            setCurrentMonth(today);
            onDateSelect(today);
          }}
          className="text-primary border-primary hover:bg-primary-50"
        >
          Go to Today
        </Button>
      </div>
    </div>
  );
};

export default EventCalendar;