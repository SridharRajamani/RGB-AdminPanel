import React from 'react';
import Icon from '../../../../components/AppIcon';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';

const SearchAndFilters = ({ 
  searchTerm, 
  onSearchChange, 
  dateFilter, 
  onDateFilterChange, 
  readFilter, 
  onReadFilterChange,
  onClearFilters 
}) => {
  const dateFilters = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const readFilters = [
    { value: 'all', label: 'All Messages' },
    { value: 'unread', label: 'Unread Only' },
    { value: 'read', label: 'Read Only' }
  ];

  const hasActiveFilters = searchTerm || dateFilter !== 'all' || readFilter !== 'all';

  return (
    <div className="bg-surface border border-border rounded-lg p-4 mb-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="Search" size={16} className="text-text-muted" />
          </div>
          <Input
            type="search"
            placeholder="Search messages, senders, or subjects..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          {/* Date Filter */}
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => onDateFilterChange(e.target.value)}
              className="appearance-none bg-surface border border-border rounded-lg px-3 py-2 pr-8 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {dateFilters.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <Icon name="ChevronDown" size={16} className="text-text-muted" />
            </div>
          </div>

          {/* Read Status Filter */}
          <div className="relative">
            <select
              value={readFilter}
              onChange={(e) => onReadFilterChange(e.target.value)}
              className="appearance-none bg-surface border border-border rounded-lg px-3 py-2 pr-8 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {readFilters.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <Icon name="ChevronDown" size={16} className="text-text-muted" />
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              iconPosition="left"
              onClick={onClearFilters}
              className="text-text-secondary hover:text-text-primary"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border">
          <span className="text-xs text-text-muted">Active filters:</span>
          
          {searchTerm && (
            <span className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
              Search: "{searchTerm}"
              <button
                onClick={() => onSearchChange('')}
                className="ml-1 hover:text-primary-900"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
          
          {dateFilter !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-full">
              Date: {dateFilters.find(f => f.value === dateFilter)?.label}
              <button
                onClick={() => onDateFilterChange('all')}
                className="ml-1 hover:text-secondary-900"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
          
          {readFilter !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 bg-accent-100 text-accent-700 text-xs rounded-full">
              Status: {readFilters.find(f => f.value === readFilter)?.label}
              <button
                onClick={() => onReadFilterChange('all')}
                className="ml-1 hover:text-accent-900"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;