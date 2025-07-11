import React, { useState, useEffect, useRef } from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';

const MemberFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  onExportMembers,
  selectedCount
}) => {
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowExportDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const membershipTypes = [
    { value: '', label: 'All Types' },
    { value: 'Regular', label: 'Regular Member' },
    { value: 'Honorary', label: 'Honorary Member' },
    { value: 'Corporate', label: 'Corporate Member' },
    { value: 'Associate', label: 'Associate Member' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'suspended', label: 'Suspended' }
  ];

  const committees = [
    { value: '', label: 'All Committees' },
    { value: 'Community Service', label: 'Community Service' },
    { value: 'Youth Service', label: 'Youth Service' },
    { value: 'International Service', label: 'International Service' },
    { value: 'Vocational Service', label: 'Vocational Service' },
    { value: 'Club Service', label: 'Club Service' },
    { value: 'Fundraising', label: 'Fundraising' },
    { value: 'Public Relations', label: 'Public Relations' }
  ];

  const dateRanges = [
    { value: '', label: 'All Time' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last3months', label: 'Last 3 Months' },
    { value: 'last6months', label: 'Last 6 Months' },
    { value: 'lastyear', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-surface rounded-lg border border-border p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
          {/* Membership Type Filter */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Membership Type
            </label>
            <select
              value={filters.membershipType}
              onChange={(e) => onFilterChange('membershipType', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {membershipTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Committee Filter */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Committee
            </label>
            <select
              value={filters.committee}
              onChange={(e) => onFilterChange('committee', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {committees.map(committee => (
                <option key={committee.value} value={committee.value}>
                  {committee.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Join Date
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => onFilterChange('dateRange', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {dateRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 lg:ml-6">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              iconPosition="left"
              onClick={onClearFilters}
              className="text-text-secondary hover:text-text-primary"
            >
              Clear Filters
            </Button>
          )}
          
          <div className="relative" ref={dropdownRef}>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              className="text-text-secondary hover:text-primary border-border hover:border-primary"
            >
              Export
              <Icon name="ChevronDown" size={16} className="ml-1" />
            </Button>

            {showExportDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg z-50">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onExportMembers('pdf');
                      setShowExportDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-text-primary hover:bg-surface-secondary"
                  >
                    <Icon name="FileText" size={16} className="mr-3" />
                    Export as PDF
                  </button>
                  <button
                    onClick={() => {
                      onExportMembers('excel');
                      setShowExportDropdown(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-text-primary hover:bg-surface-secondary"
                  >
                    <Icon name="Sheet" size={16} className="mr-3" />
                    Export as Excel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-text-secondary">Active Filters:</span>
            
            {filters.membershipType && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                Type: {membershipTypes.find(t => t.value === filters.membershipType)?.label}
                <button
                  onClick={() => onFilterChange('membershipType', '')}
                  className="ml-1 hover:text-primary-900"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {filters.status && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-secondary-100 text-secondary-700 rounded-full">
                Status: {statusOptions.find(s => s.value === filters.status)?.label}
                <button
                  onClick={() => onFilterChange('status', '')}
                  className="ml-1 hover:text-secondary-900"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {filters.committee && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-accent-100 text-accent-700 rounded-full">
                Committee: {committees.find(c => c.value === filters.committee)?.label}
                <button
                  onClick={() => onFilterChange('committee', '')}
                  className="ml-1 hover:text-accent-900"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            
            {filters.dateRange && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-success-100 text-success-700 rounded-full">
                Date: {dateRanges.find(d => d.value === filters.dateRange)?.label}
                <button
                  onClick={() => onFilterChange('dateRange', '')}
                  className="ml-1 hover:text-success-900"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedCount > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">
              {selectedCount} member{selectedCount > 1 ? 's' : ''} selected
            </span>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Mail"
                iconPosition="left"
                className="text-text-secondary hover:text-primary border-border hover:border-primary"
              >
                Send Email
              </Button>
              
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                  iconPosition="left"
                  onClick={() => setShowExportDropdown(!showExportDropdown)}
                  className="text-text-secondary hover:text-primary border-border hover:border-primary"
                >
                  Export Selected
                  <Icon name="ChevronDown" size={16} className="ml-1" />
                </Button>

                {showExportDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          onExportMembers('pdf');
                          setShowExportDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-text-primary hover:bg-surface-secondary"
                      >
                        <Icon name="FileText" size={16} className="mr-3" />
                        Export Selected as PDF
                      </button>
                      <button
                        onClick={() => {
                          onExportMembers('excel');
                          setShowExportDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-text-primary hover:bg-surface-secondary"
                      >
                        <Icon name="Sheet" size={16} className="mr-3" />
                        Export Selected as Excel
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                iconName="Edit"
                iconPosition="left"
                className="text-text-secondary hover:text-primary border-border hover:border-primary"
              >
                Bulk Update
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberFilters;