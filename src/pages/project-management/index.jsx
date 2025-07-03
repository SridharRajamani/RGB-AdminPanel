import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import AlertCenter from '../../components/ui/AlertCenter';
import Button from '../../components/ui/Button';
import ProjectKanbanBoard from './components/ProjectKanbanBoard';
import ProjectFilters from './components/ProjectFilters';
import CreateProjectModal from './components/CreateProjectModal';
import ProjectStatsSidebar from './components/ProjectStatsSidebar';
import ProjectListView from './components/ProjectListView';
import Icon from '../../components/AppIcon';

const ProjectManagement = ({ isSidebarCollapsed = false, isSidebarVisible = true }) => {
  const [currentView, setCurrentView] = useState('board'); // board, list, calendar
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    priority: 'all',
    status: 'all',
    searchTerm: ''
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleCreateProject = () => {
    setShowCreateModal(true);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <NavigationSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} isSidebarCollapsed={isSidebarCollapsed} isSidebarVisible={isSidebarVisible} />
      <AlertCenter />
      
      {/* Main Content */}
      <main className={`${!isSidebarVisible ? 'ml-0' : isSidebarCollapsed ? 'ml-20' : 'ml-60'} pt-16 transition-all duration-200`}>
        <div className="flex flex-col xl:flex-row gap-8 p-6">
          {/* Left Content Area */}
          <div className="flex-1">
            <BreadcrumbNavigation />
            
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <Icon name="FolderOpen" size={24} color="white" />
                  </div>
                  <h1 className="text-3xl font-heading font-bold text-text-primary">
                    Projects & Initiatives
                  </h1>
                </div>
                <p className="text-text-secondary mt-1">
                  Track and oversee club projects from conception to completion
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="flex rounded-lg border border-border bg-surface">
                  <Button
                    variant={currentView === 'board' ? 'primary' : 'ghost'}
                    size="sm"
                    iconName="Layout"
                    onClick={() => handleViewChange('board')}
                    className="rounded-l-lg rounded-r-none border-r border-border"
                  >
                    Board
                  </Button>
                  <Button
                    variant={currentView === 'list' ? 'primary' : 'ghost'}
                    size="sm"
                    iconName="List"
                    onClick={() => handleViewChange('list')}
                    className="rounded-none border-r border-border"
                  >
                    List
                  </Button>
                  <Button
                    variant={currentView === 'calendar' ? 'primary' : 'ghost'}
                    size="sm"
                    iconName="Calendar"
                    onClick={() => handleViewChange('calendar')}
                    className="rounded-r-lg rounded-l-none"
                  >
                    Calendar
                  </Button>
                </div>
                
                <Button
                  variant="primary"
                  size="md"
                  iconName="Plus"
                  onClick={handleCreateProject}
                >
                  New Project
                </Button>
              </div>
            </div>

            {/* Filters */}
            <ProjectFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />

            {/* Content based on current view */}
            <div className="mt-6">
              {currentView === 'board' && (
                <ProjectKanbanBoard
                  filters={filters}
                />
              )}
              
              {currentView === 'list' && (
                <ProjectListView
                  filters={filters}
                />
              )}
              
              {currentView === 'calendar' && (
                <div className="bg-surface rounded-lg border border-border p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-text-primary mb-2">Calendar View</h3>
                  <p className="text-text-secondary">
                    Calendar view implementation coming soon. Track project timelines and deadlines visually.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Project Statistics */}
          <div className="xl:w-80 xl:flex-shrink-0">
            <div className="sticky top-24">
              <ProjectStatsSidebar />
            </div>
          </div>
        </div>
      </main>

      {/* Create Project Modal */}
      {showCreateModal && (
        <CreateProjectModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {/* Footer */}
      <footer className={`${isSidebarOpen ? 'ml-60' : ''} bg-surface border-t border-border mt-12`}>
        <div className="px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Rotary Gulmohar Project Management
                </p>
                <p className="text-xs text-text-secondary">
                  Club Project Tracking System
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <div className="flex items-center space-x-4 text-sm text-text-secondary">
                <a href="#" className="hover:text-primary transition-colors duration-150">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-primary transition-colors duration-150">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-primary transition-colors duration-150">
                  Support
                </a>
              </div>
              <div className="text-xs text-text-muted">
                © {new Date().getFullYear()} Rotary Gulmohar. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProjectManagement;