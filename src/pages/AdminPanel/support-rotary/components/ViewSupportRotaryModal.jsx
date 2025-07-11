import React from 'react';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/AppIcon';
import { useTheme } from '../../../../context/ThemeContext';

const ViewSupportRotaryModal = ({ isOpen, onClose, supportProject }) => {
  const { isDarkMode } = useTheme();

  if (!isOpen || !supportProject) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressPercentage = (raised, target) => {
    return Math.min((raised / target) * 100, 100);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300' 
      : 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
  };

  const progressPercentage = getProgressPercentage(supportProject.amountRaised, supportProject.targetAmount);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Icon name="Eye" size={20} color="white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Support Project Details
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Project Image */}
          {supportProject.image && (
            <div className="relative">
              <img
                src={supportProject.image}
                alt={supportProject.title}
                className="w-full h-64 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
              />
              
              {/* Status and Priority Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(supportProject.status)}`}>
                  {supportProject.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(supportProject.priority)}`}>
                  {supportProject.priority} priority
                </span>
              </div>
            </div>
          )}

          {/* Project Title and Category */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {supportProject.title}
              </h3>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-sm font-medium">
                {supportProject.category}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {supportProject.description}
            </p>
          </div>

          {/* Progress Section */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Funding Progress
            </h4>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-300">Progress</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {progressPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Funding Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(supportProject.amountRaised)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Amount Raised</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(supportProject.targetAmount)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Target Amount</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {supportProject.donorCount}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Donors</p>
              </div>
            </div>

            {/* Remaining Amount */}
            <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Remaining to reach goal:</span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(Math.max(0, supportProject.targetAmount - supportProject.amountRaised))}
                </span>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Project Information
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Icon name="Tag" size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
                    <p className="text-gray-900 dark:text-white font-medium">{supportProject.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Icon name="AlertCircle" size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Priority</p>
                    <p className="text-gray-900 dark:text-white font-medium capitalize">{supportProject.priority}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Icon name="Activity" size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                    <p className="text-gray-900 dark:text-white font-medium capitalize">{supportProject.status}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Timeline
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Icon name="Calendar" size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {formatDate(supportProject.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Icon name="Hash" size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Project ID</p>
                    <p className="text-gray-900 dark:text-white font-medium">#{supportProject.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Performance Metrics
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Icon name="TrendingUp" size={24} className="text-green-600 dark:text-green-400" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Funding Rate</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {progressPercentage.toFixed(1)}%
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Icon name="Users" size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Avg. per Donor</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {supportProject.donorCount > 0 
                    ? formatCurrency(supportProject.amountRaised / supportProject.donorCount)
                    : formatCurrency(0)
                  }
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Icon name="Target" size={24} className="text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Goal Status</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {progressPercentage >= 100 ? 'Achieved' : 'In Progress'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewSupportRotaryModal;
