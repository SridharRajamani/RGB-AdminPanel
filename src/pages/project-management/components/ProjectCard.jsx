import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ProjectCard = ({ project }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-error text-white';
      case 'medium':
        return 'bg-warning text-white';
      case 'low':
        return 'bg-success text-white';
      default:
        return 'bg-text-muted text-white';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'community-service':
        return 'bg-blue-100 text-blue-800';
      case 'fundraising':
        return 'bg-purple-100 text-purple-800';
      case 'youth-programs':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'community-service':
        return 'Community Service';
      case 'fundraising':
        return 'Fundraising';
      case 'youth-programs':
        return 'Youth Programs';
      default:
        return 'Other';
    }
  };

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
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const completedMilestones = project?.milestones?.filter(m => m.completed).length || 0;
  const totalMilestones = project?.milestones?.length || 0;

  return (
    <div className="bg-white rounded-lg border border-border shadow-sm hover:shadow-md transition-all duration-200">
      {/* Card Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h4 className="font-semibold text-text-primary text-sm leading-tight flex-1">
            {project?.title}
          </h4>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(project?.priority)}`}>
              {project?.priority?.toUpperCase()}
            </span>
          </div>
        </div>

        <p className="text-xs text-text-secondary line-clamp-2 mb-3">
          {project?.description}
        </p>

        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(project?.type)}`}>
            {getTypeLabel(project?.type)}
          </span>
          <Button
            variant="ghost"
            size="xs"
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-text-muted hover:text-text-primary"
          />
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-4">
        {/* Budget */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary">Budget</span>
          <span className="text-sm font-semibold text-text-primary">
            {formatCurrency(project?.budget)}
          </span>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-secondary">Progress</span>
            <span className="text-xs font-medium text-text-primary">
              {project?.timeline?.progress || 0}%
            </span>
          </div>
          <div className="w-full bg-surface-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${project?.timeline?.progress || 0}%` }}
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="text-text-secondary">Start: </span>
            <span className="text-text-primary font-medium">
              {formatDate(project?.timeline?.startDate)}
            </span>
          </div>
          <div>
            <span className="text-text-secondary">End: </span>
            <span className="text-text-primary font-medium">
              {formatDate(project?.timeline?.endDate)}
            </span>
          </div>
        </div>

        {/* Assigned Team - Condensed */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-secondary">Team</span>
            <span className="text-xs text-text-muted">
              {project?.assigned?.length || 0} members
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {project?.assigned?.slice(0, 2).map((member, index) => (
              <span
                key={index}
                className="text-xs bg-surface-secondary text-text-primary px-2 py-1 rounded"
              >
                {member}
              </span>
            ))}
            {project?.assigned?.length > 2 && (
              <span className="text-xs bg-text-muted text-white px-2 py-1 rounded">
                +{project.assigned.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-4 border-t border-border pt-4">
            {/* All Team Members */}
            <div>
              <span className="text-xs font-medium text-text-secondary mb-2 block">
                All Team Members
              </span>
              <div className="flex flex-wrap gap-1">
                {project?.assigned?.map((member, index) => (
                  <span
                    key={index}
                    className="text-xs bg-surface-secondary text-text-primary px-2 py-1 rounded"
                  >
                    {member}
                  </span>
                ))}
              </div>
            </div>

            {/* Milestones */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-text-secondary">
                  Milestones
                </span>
                <span className="text-xs text-text-muted">
                  {completedMilestones}/{totalMilestones} completed
                </span>
              </div>
              <div className="space-y-2">
                {project?.milestones?.map((milestone, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      milestone.completed 
                        ? 'bg-success' :'bg-surface-secondary border border-border'
                    }`}>
                      {milestone.completed && (
                        <Icon name="Check" size={8} className="text-white m-auto" />
                      )}
                    </div>
                    <span className={`text-xs ${
                      milestone.completed 
                        ? 'text-text-secondary line-through' :'text-text-primary'
                    }`}>
                      {milestone.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="xs"
                iconName="Edit"
                className="flex-1"
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="xs"
                iconName="Eye"
                className="flex-1"
              >
                View
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;