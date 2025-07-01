import React, { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';

const ProjectKanbanBoard = ({ filters }) => {
  const [projects, setProjects] = useState([]);
  const [draggedProject, setDraggedProject] = useState(null);

  // Mock project data
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

    setProjects(filteredProjects);
  }, [filters]);

  const columns = [
    {
      id: 'planning',
      title: 'Planning',
      color: 'bg-yellow-50 border-yellow-200',
      headerColor: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: 'bg-blue-50 border-blue-200',
      headerColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'pending-approval',
      title: 'Pending Approval',
      color: 'bg-orange-50 border-orange-200',
      headerColor: 'bg-orange-100 text-orange-800'
    },
    {
      id: 'completed',
      title: 'Completed',
      color: 'bg-green-50 border-green-200',
      headerColor: 'bg-green-100 text-green-800'
    }
  ];

  const getProjectsByStatus = (status) => {
    return projects.filter(project => project.status === status);
  };

  const handleDragStart = (e, project) => {
    setDraggedProject(project);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    
    if (draggedProject && draggedProject.status !== newStatus) {
      setProjects(prev => prev.map(project => 
        project.id === draggedProject.id 
          ? { ...project, status: newStatus }
          : project
      ));
    }
    
    setDraggedProject(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 overflow-x-auto pb-4">
      {columns.map((column) => {
        const columnProjects = getProjectsByStatus(column.id);
        
        return (
          <div
            key={column.id}
            className={`flex-1 min-w-80 rounded-lg border-2 ${column.color} transition-all duration-200`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className={`px-4 py-3 rounded-t-lg ${column.headerColor} border-b border-current/20`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">
                  {column.title}
                </h3>
                <span className="bg-white/50 text-xs px-2 py-1 rounded-full font-medium">
                  {columnProjects.length}
                </span>
              </div>
            </div>

            {/* Column Content */}
            <div className="p-4 space-y-4 min-h-96">
              {columnProjects.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-text-muted/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-text-muted">No projects in this stage</p>
                </div>
              ) : (
                columnProjects.map((project) => (
                  <div
                    key={project.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, project)}
                    className="cursor-move"
                  >
                    <ProjectCard project={project} />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectKanbanBoard;