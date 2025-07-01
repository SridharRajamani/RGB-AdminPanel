import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ProjectListView = ({ filters }) => {
  const [projects, setProjects] = useState([]);
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');

  // Mock project data (same as KanbanBoard for consistency)
  const mockProjects = [
    {
      id: 1,
      title: "Community Health Camp",
      description: "Free medical checkup and consultation for underprivileged communities",
      status: "planning",
      priority: "high",
      type: "community-service",
      budget: 50000,
      assigned: ["Dr. Sharma", "Nurse Rita", "Volunteer Team"],
      timeline: {
        startDate: "2024-02-01",
        endDate: "2024-02-15",
        progress: 25
      },
      milestones: [
        { name: "Venue Booking", completed: true },
        { name: "Medical Team", completed: false },
        { name: "Equipment Setup", completed: false }
      ]
    },
    {
      id: 2,
      title: "Youth Leadership Program",
      description: "Training program for developing leadership skills in young club members",
      status: "in-progress",
      priority: "medium",
      type: "youth-programs",
      budget: 30000,
      assigned: ["Mr. Patel", "Ms. Joshi"],
      timeline: {
        startDate: "2024-01-15",
        endDate: "2024-03-30",
        progress: 60
      },
      milestones: [
        { name: "Curriculum Design", completed: true },
        { name: "Participant Selection", completed: true },
        { name: "Training Sessions", completed: false }
      ]
    },
    {
      id: 3,
      title: "Annual Fundraising Gala",
      description: "Premium fundraising event for club's major community projects",
      status: "pending-approval",
      priority: "high",
      type: "fundraising",
      budget: 200000,
      assigned: ["Event Committee", "PR Team"],
      timeline: {
        startDate: "2024-03-01",
        endDate: "2024-04-15",
        progress: 15
      },
      milestones: [
        { name: "Venue Selection", completed: true },
        { name: "Sponsor Outreach", completed: false },
        { name: "Event Planning", completed: false }
      ]
    },
    {
      id: 4,
      title: "School Infrastructure Support",
      description: "Building new classrooms and library for rural primary school",
      status: "completed",
      priority: "high",
      type: "community-service",
      budget: 150000,
      assigned: ["Construction Team", "Education Committee"],
      timeline: {
        startDate: "2023-10-01",
        endDate: "2023-12-30",
        progress: 100
      },
      milestones: [
        { name: "Site Survey", completed: true },
        { name: "Construction", completed: true },
        { name: "Handover", completed: true }
      ]
    }
  ];

  useEffect(() => {
    // Filter projects based on filters
    let filteredProjects = mockProjects;

    if (filters?.type && filters.type !== 'all') {
      filteredProjects = filteredProjects.filter(project => 
        project.type === filters.type
      );
    }

    if (filters?.priority && filters.priority !== 'all') {
      filteredProjects = filteredProjects.filter(project => 
        project.priority === filters.priority
      );
    }

    if (filters?.status && filters.status !== 'all') {
      filteredProjects = filteredProjects.filter(project => 
        project.status === filters.status
      );
    }

    if (filters?.searchTerm) {
      filteredProjects = filteredProjects.filter(project =>
        project.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        project.assigned.some(member => 
          member.toLowerCase().includes(filters.searchTerm.toLowerCase())
        )
      );
    }

    // Sort projects
    filteredProjects.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'priority':
          const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'budget':
          aValue = a.budget;
          bValue = b.budget;
          break;
        case 'progress':
          aValue = a.timeline.progress;
          bValue = b.timeline.progress;
          break;
        case 'endDate':
          aValue = new Date(a.timeline.endDate);
          bValue = new Date(b.timeline.endDate);
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setProjects(filteredProjects);
  }, [filters, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <Icon name="ArrowUpDown" size={14} className="text-text-muted" />;
    }
    return sortDirection === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending-approval':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'community-service':
        return 'bg-blue-50 text-blue-700';
      case 'fundraising':
        return 'bg-purple-50 text-purple-700';
      case 'youth-programs':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-gray-50 text-gray-700';
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

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden">
      {/* Table Header */}
      <div className="bg-surface-secondary border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">
            Project List ({projects.length} projects)
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="Download"
              className="text-text-secondary hover:text-text-primary"
            >
              Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="Printer"
              className="text-text-secondary hover:text-text-primary"
            >
              Print
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-secondary">
            <tr>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-surface hover:text-text-primary transition-colors"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center gap-2">
                  Project Name
                  {getSortIcon('title')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-surface hover:text-text-primary transition-colors"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-2">
                  Status
                  {getSortIcon('status')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-surface hover:text-text-primary transition-colors"
                onClick={() => handleSort('priority')}
              >
                <div className="flex items-center gap-2">
                  Priority
                  {getSortIcon('priority')}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Type
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-surface hover:text-text-primary transition-colors"
                onClick={() => handleSort('budget')}
              >
                <div className="flex items-center gap-2">
                  Budget
                  {getSortIcon('budget')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-surface hover:text-text-primary transition-colors"
                onClick={() => handleSort('progress')}
              >
                <div className="flex items-center gap-2">
                  Progress
                  {getSortIcon('progress')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-surface hover:text-text-primary transition-colors"
                onClick={() => handleSort('endDate')}
              >
                <div className="flex items-center gap-2">
                  End Date
                  {getSortIcon('endDate')}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Team
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-surface divide-y divide-border">
            {projects.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-4 py-8 text-center">
                  <div className="flex flex-col items-center">
                    <Icon name="Search" size={32} className="text-text-muted mb-2" />
                    <p className="text-text-muted">No projects found matching your filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              projects.map((project) => {
                const completedMilestones = project.milestones?.filter(m => m.completed).length || 0;
                const totalMilestones = project.milestones?.length || 0;
                
                return (
                  <tr key={project.id} className="hover:bg-surface-secondary transition-colors">
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-text-primary">
                          {project.title}
                        </div>
                        <div className="text-xs text-text-secondary line-clamp-1">
                          {project.description}
                        </div>
                        <div className="text-xs text-text-muted mt-1">
                          {completedMilestones}/{totalMilestones} milestones completed
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                        {project.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getPriorityColor(project.priority)}`}>
                        {project.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getTypeColor(project.type)}`}>
                        {getTypeLabel(project.type)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-text-primary">
                      {formatCurrency(project.budget)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-surface-secondary rounded-full h-2 mr-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${project.timeline.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-text-primary">
                          {project.timeline.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-text-primary">
                      {formatDate(project.timeline.endDate)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {project.assigned?.slice(0, 2).map((member, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 text-xs bg-surface-secondary text-text-primary rounded"
                          >
                            {member}
                          </span>
                        ))}
                        {project.assigned?.length > 2 && (
                          <span className="inline-flex px-2 py-1 text-xs bg-text-muted text-white rounded">
                            +{project.assigned.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="xs"
                          iconName="Eye"
                          className="text-text-secondary hover:text-text-primary"
                        />
                        <Button
                          variant="ghost"
                          size="xs"
                          iconName="Edit"
                          className="text-text-secondary hover:text-text-primary"
                        />
                        <Button
                          variant="ghost"
                          size="xs"
                          iconName="MoreHorizontal"
                          className="text-text-secondary hover:text-text-primary"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      {projects.length > 0 && (
        <div className="bg-surface-secondary border-t border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              Showing {projects.length} of {projects.length} projects
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                iconName="ChevronLeft"
                disabled
                className="text-text-secondary"
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="ChevronRight"
                disabled
                className="text-text-secondary"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectListView;