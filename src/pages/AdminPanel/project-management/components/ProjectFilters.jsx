import React from 'react';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

const ProjectFilters = ({ filters, onFilterChange }) => {
  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const handleSearchChange = (e) => {
    handleFilterChange('searchTerm', e.target.value);
  };

  const clearFilters = () => {
    onFilterChange({
      type: 'all',
      priority: 'all',
      status: 'all',
      searchTerm: ''
    });
  };

  const hasActiveFilters = filters?.type !== 'all' || 
                          filters?.priority !== 'all' || 
                          filters?.status !== 'all' || 
                          filters?.searchTerm;

  return (
    <div className="bg-surface rounded-lg border border-border p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 lg:max-w-sm">
          <Input
            type="text"
            placeholder="Search projects, team members..."
            value={filters?.searchTerm || ''}
            onChange={handleSearchChange}
            className="w-full"
            icon="Search"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Project Type Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary whitespace-nowrap">Type:</span>
            <select
              value={filters?.type || 'all'}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="text-sm border border-border rounded px-3 py-1.5 bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Types</option>
              <option value="community-service">Community Service</option>
              <option value="fundraising">Fundraising</option>
              <option value="youth-programs">Youth Programs</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary whitespace-nowrap">Priority:</span>
            <select
              value={filters?.priority || 'all'}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="text-sm border border-border rounded px-3 py-1.5 bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary whitespace-nowrap">Status:</span>
            <select
              value={filters?.status || 'all'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="text-sm border border-border rounded px-3 py-1.5 bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="pending-approval">Pending Approval</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-secondary whitespace-nowrap">Sort:</span>
            <select
              className="text-sm border border-border rounded px-3 py-1.5 bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="priority">Priority</option>
              <option value="deadline">Deadline</option>
              <option value="budget">Budget</option>
              <option value="progress">Progress</option>
              <option value="name">Name</option>
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={clearFilters}
              className="text-text-secondary hover:text-text-primary"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
          {filters?.type !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
              Type: {filters.type.replace('-', ' ')}
              <button
                onClick={() => handleFilterChange('type', 'all')}
                className="hover:bg-primary/20 rounded p-0.5"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          
          {filters?.priority !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
              Priority: {filters.priority}
              <button
                onClick={() => handleFilterChange('priority', 'all')}
                className="hover:bg-primary/20 rounded p-0.5"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
          
          {filters?.status !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
              Status: {filters.status.replace('-', ' ')}
              <button
                onClick={() => handleFilterChange('status', 'all')}
                className="hover:bg-primary/20 rounded p-0.5"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}

          {filters?.searchTerm && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded">
              Search: "{filters.searchTerm}"
              <button
                onClick={() => handleFilterChange('searchTerm', '')}
                className="hover:bg-primary/20 rounded p-0.5"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectFilters;