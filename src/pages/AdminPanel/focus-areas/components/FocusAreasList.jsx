import React, { useState } from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';

const FocusAreasList = ({
  focusAreas,
  onEditFocusArea,
  onDuplicateFocusArea,
  onDeleteFocusArea,
  onViewFocusArea,
  onToggleStatus
}) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sort and filter focus areas
  const sortedAndFilteredAreas = focusAreas
    .filter(area => filterStatus === 'all' || area.status === filterStatus)
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (sortBy === 'createdAt') {
        return sortOrder === 'desc' 
          ? new Date(bValue) - new Date(aValue)
          : new Date(aValue) - new Date(bValue);
      }
      
      if (typeof aValue === 'string') {
        return sortOrder === 'desc' 
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      }
      
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'text-green-600 bg-green-50' 
      : 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border">
      {/* Header with controls */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-text-primary">
              Focus Areas ({sortedAndFilteredAreas.length})
            </h2>
            
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Options */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
              <option value="priority-desc">High Priority First</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-text-secondary hover:bg-gray-50'}`}
              >
                <Icon name="Grid3X3" size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-text-secondary hover:bg-gray-50'}`}
              >
                <Icon name="List" size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Focus Areas Content */}
      <div className="p-6">
        {sortedAndFilteredAreas.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Target" size={48} color="#9CA3AF" className="mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">No Focus Areas Found</h3>
            <p className="text-text-secondary">
              {filterStatus !== 'all' 
                ? `No ${filterStatus} focus areas found. Try changing the filter.`
                : 'Get started by creating your first focus area.'
              }
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {sortedAndFilteredAreas.map((area) => (
              <div
                key={area.id}
                className={`border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow ${
                  viewMode === 'list' ? 'flex items-center' : ''
                }`}
              >
                {/* Image */}
                <div className={viewMode === 'list' ? 'w-32 h-24 flex-shrink-0' : 'h-48'}>
                  <img
                    src={area.image}
                    alt={area.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-text-primary line-clamp-2">
                      {area.title}
                    </h3>
                    <div className="flex items-center gap-1 ml-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(area.status)}`}>
                        {area.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                    {area.description}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(area.priority)}`}>
                      {area.priority} priority
                    </span>
                    <span className="text-xs text-text-secondary">
                      {formatDate(area.createdAt)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() => onViewFocusArea(area.id)}
                      className="text-xs"
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit"
                      onClick={() => onEditFocusArea(area.id)}
                      className="text-xs"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Copy"
                      onClick={() => onDuplicateFocusArea(area.id)}
                      className="text-xs"
                    >
                      Duplicate
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName={area.status === 'active' ? 'Pause' : 'Play'}
                      onClick={() => onToggleStatus(area.id)}
                      className="text-xs"
                    >
                      {area.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2"
                      onClick={() => onDeleteFocusArea(area.id)}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
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

export default FocusAreasList;
