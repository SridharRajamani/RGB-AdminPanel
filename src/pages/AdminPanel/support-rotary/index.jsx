import React, { useState, useEffect } from 'react';
import Header from '../../../components/ui/Header';
import NavigationSidebar from '../../../components/ui/NavigationSidebar';
import BreadcrumbNavigation from '../../../components/ui/BreadcrumbNavigation';

import Button from '../../../components/ui/Button';
import SupportRotaryList from './components/SupportRotaryList';
import CreateSupportRotaryModal from './components/CreateSupportRotaryModal';
import EditSupportRotaryModal from './components/EditSupportRotaryModal';
import ViewSupportRotaryModal from './components/ViewSupportRotaryModal';
import Icon from '../../../components/AppIcon';
import useCoolAlert from '../../../hooks/useCoolAlert';

const SupportRotaryManagement = ({ isSidebarVisible = true }) => {
  const alert = useCoolAlert();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSupportProject, setSelectedSupportProject] = useState(null);

  // Support Rotary projects state
  const [supportProjects, setSupportProjects] = useState([
    {
      id: 1,
      title: 'Bleed Green',
      description: 'Planting 1000 trees this year.',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop',
      amountRaised: 75000,
      targetAmount: 100000,
      donorCount: 150,
      status: 'active',
      priority: 'high',
      category: 'Environment',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      title: 'Scholarship',
      description: 'Supporting underprivileged students.',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop',
      amountRaised: 120000,
      targetAmount: 150000,
      donorCount: 200,
      status: 'active',
      priority: 'high',
      category: 'Education',
      createdAt: '2024-01-10T14:20:00Z'
    },
    {
      id: 3,
      title: 'Save Wildlife',
      description: 'Protecting endangered species in local forests.',
      image: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?q=80&w=2072&auto=format&fit=crop',
      amountRaised: 95000,
      targetAmount: 120000,
      donorCount: 180,
      status: 'active',
      priority: 'medium',
      category: 'Wildlife',
      createdAt: '2024-01-05T09:15:00Z'
    },
    {
      id: 4,
      title: 'General Projects',
      description: 'Community development and disaster relief.',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2073&auto=format&fit=crop',
      amountRaised: 200000,
      targetAmount: 250000,
      donorCount: 300,
      status: 'active',
      priority: 'high',
      category: 'Community',
      createdAt: '2024-01-01T16:45:00Z'
    },
    {
      id: 5,
      title: 'Scholarship',
      description: 'Merit-based rewards for top students.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop',
      amountRaised: 80000,
      targetAmount: 100000,
      donorCount: 120,
      status: 'active',
      priority: 'medium',
      category: 'Education',
      createdAt: '2023-12-28T11:30:00Z'
    }
  ]);

  // Load support projects from localStorage on component mount
  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem('rotary_support_projects');
      if (savedProjects) {
        const parsedProjects = JSON.parse(savedProjects);
        if (Array.isArray(parsedProjects) && parsedProjects.length > 0) {
          setSupportProjects(parsedProjects);
        }
      }
    } catch (error) {
      console.error('Error loading support projects from localStorage:', error);
      // Don't use alert in useEffect to avoid infinite loops
      console.warn('Failed to load saved support projects. Using default data.');
    }
  }, []); // Empty dependency array - only run once on mount

  // Save support projects to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('rotary_support_projects', JSON.stringify(supportProjects));
      // Dispatch custom event to notify landing page
      window.dispatchEvent(new CustomEvent('supportProjectsDataUpdated'));
    } catch (error) {
      console.error('Error saving support projects to localStorage:', error);
    }
  }, [supportProjects]);

  const handleCreateSupportProject = (projectData) => {
    // Generate unique ID by finding the highest existing ID and adding 1
    const maxId = supportProjects.length > 0 ? Math.max(...supportProjects.map(project => project.id)) : 0;
    const newProject = {
      id: maxId + 1,
      ...projectData,
      status: 'active',
      amountRaised: 0,
      donorCount: 0,
      createdAt: new Date().toISOString()
    };
    setSupportProjects([...supportProjects, newProject]);
  };

  const handleUpdateSupportProject = (updatedProject) => {
    setSupportProjects(supportProjects.map(project => 
      project.id === updatedProject.id ? updatedProject : project
    ));
  };

  const handleDeleteSupportProject = async (projectId) => {
    const projectToDelete = supportProjects.find(project => project.id === projectId);
    
    if (!projectToDelete) {
      alert.error(
        '❌ Project Not Found',
        'The support project you are trying to delete could not be found.',
        { autoClose: true, autoCloseDelay: 3000 }
      );
      return;
    }

    try {
      // Show loading alert
      const loadingAlert = alert.info(
        '🗑️ Deleting Support Project...',
        `Removing "${projectToDelete.title}" from your support projects.`,
        {
          autoClose: false,
          animation: 'fade'
        }
      );

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSupportProjects(supportProjects.filter(project => project.id !== projectId));

      // Close loading alert
      loadingAlert();

      // Show success alert
      alert.success(
        '🗑️ Project Deleted!',
        `"${projectToDelete.title}" has been successfully removed from your support projects.`,
        {
          animation: 'bounce',
          autoClose: true,
          autoCloseDelay: 4000
        }
      );
    } catch (error) {
      console.error('Error deleting support project:', error);
      alert.error(
        '❌ Deletion Failed',
        'An error occurred while deleting the support project. Please try again.',
        { autoClose: true, autoCloseDelay: 4000 }
      );
    }
  };

  const handleDuplicateSupportProject = async (projectId) => {
    const projectToDuplicate = supportProjects.find(project => project.id === projectId);
    
    if (!projectToDuplicate) {
      alert.error(
        '❌ Project Not Found',
        'The support project you are trying to duplicate could not be found.',
        { autoClose: true, autoCloseDelay: 3000 }
      );
      return;
    }

    try {
      // Show loading alert
      const loadingAlert = alert.info(
        '📋 Duplicating Support Project...',
        `Creating a copy of "${projectToDuplicate.title}".`,
        {
          autoClose: false,
          animation: 'fade'
        }
      );

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      const maxId = Math.max(...supportProjects.map(project => project.id));
      const duplicatedProject = {
        ...projectToDuplicate,
        id: maxId + 1,
        title: `${projectToDuplicate.title} (Copy)`,
        amountRaised: 0,
        donorCount: 0,
        createdAt: new Date().toISOString()
      };

      setSupportProjects([...supportProjects, duplicatedProject]);

      // Close loading alert
      loadingAlert();

      // Show success alert
      alert.celebration(
        '🎉 Project Duplicated!',
        `"${duplicatedProject.title}" has been successfully created!`,
        {
          animation: 'bounce',
          gradient: true,
          sound: true,
          autoClose: true,
          autoCloseDelay: 4000
        }
      );
    } catch (error) {
      console.error('Error duplicating support project:', error);
      alert.error(
        '❌ Duplication Failed',
        'An error occurred while duplicating the support project. Please try again.',
        { autoClose: true, autoCloseDelay: 4000 }
      );
    }
  };

  const handleToggleStatus = async (projectId) => {
    const project = supportProjects.find(p => p.id === projectId);
    if (!project) return;

    const newStatus = project.status === 'active' ? 'inactive' : 'active';

    try {
      // Show loading alert
      const loadingAlert = alert.info(
        '🔄 Updating Status...',
        `Changing "${project.title}" status to ${newStatus}.`,
        {
          autoClose: false,
          animation: 'fade'
        }
      );

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSupportProjects(supportProjects.map(p =>
        p.id === projectId ? { ...p, status: newStatus } : p
      ));

      // Close loading alert
      loadingAlert();

      // Show success alert
      alert.success(
        '✅ Status Updated!',
        `"${project.title}" is now ${newStatus}.`,
        {
          animation: 'bounce',
          autoClose: true,
          autoCloseDelay: 3000
        }
      );
    } catch (error) {
      console.error('Error updating project status:', error);
      alert.error(
        '❌ Update Failed',
        'An error occurred while updating the project status. Please try again.',
        { autoClose: true, autoCloseDelay: 4000 }
      );
    }
  };

  const handleEditSupportProject = (project) => {
    setSelectedSupportProject(project);
    setIsEditModalOpen(true);
  };

  const handleViewSupportProject = (project) => {
    setSelectedSupportProject(project);
    setIsViewModalOpen(true);
  };



  return (
    <div className="min-h-screen bg-background">
      <Header />
      <NavigationSidebar isVisible={isSidebarVisible} />

      <main className={`${isSidebarVisible ? 'ml-64' : 'ml-0'} pt-10 transition-all duration-200`}>
        <div className="p-6">
          <BreadcrumbNavigation />

          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Icon name="Heart" size={24} color="white" />
                </div>
                <h1 className="text-3xl font-heading font-bold text-text-primary">
                  Support Rotary Management
                </h1>
              </div>
              <p className="text-text-secondary">
                Manage and organize your club's support projects and donation campaigns
              </p>
            </div>

            {/* Create Button on Right */}
            <div className="flex items-center">
              <Button
                variant="primary"
                size="lg"
                iconName="Plus"
                iconPosition="left"
                onClick={() => setIsCreateModalOpen(true)}
                className="shadow-lg"
              >
                Create Support Project
              </Button>
            </div>
          </div>

          {/* Support Projects List */}
          <SupportRotaryList
            supportProjects={supportProjects}
            onEditSupportProject={handleEditSupportProject}
            onDuplicateSupportProject={handleDuplicateSupportProject}
            onDeleteSupportProject={handleDeleteSupportProject}
            onViewSupportProject={handleViewSupportProject}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      </main>

      {/* Create Support Project Modal */}
      <CreateSupportRotaryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateSupportProject={handleCreateSupportProject}
      />

      {/* View Support Project Modal */}
      <ViewSupportRotaryModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedSupportProject(null);
        }}
        supportProject={selectedSupportProject}
      />

      {/* Edit Support Project Modal */}
      <EditSupportRotaryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSupportProject(null);
        }}
        onUpdateSupportProject={handleUpdateSupportProject}
        supportProject={selectedSupportProject}
      />
    </div>
  );
};

export default SupportRotaryManagement;
