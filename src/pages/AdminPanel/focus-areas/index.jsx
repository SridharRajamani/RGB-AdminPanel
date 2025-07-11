import React, { useState, useEffect } from 'react';
import Header from '../../../components/ui/Header';
import NavigationSidebar from '../../../components/ui/NavigationSidebar';
import BreadcrumbNavigation from '../../../components/ui/BreadcrumbNavigation';
import AlertCenter from '../../../components/ui/AlertCenter';
import Button from '../../../components/ui/Button';
import FocusAreasList from './components/FocusAreasList';
import CreateFocusAreaModal from './components/CreateFocusAreaModal';
import EditFocusAreaModal from './components/EditFocusAreaModal';
import ViewFocusAreaModal from './components/ViewFocusAreaModal';
import Icon from '../../../components/AppIcon';
import useCoolAlert from '../../../hooks/useCoolAlert';

const FocusAreasManagement = ({ isSidebarCollapsed = false, isSidebarVisible = true }) => {
  const alert = useCoolAlert();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFocusArea, setSelectedFocusArea] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Default focus areas data
  const defaultFocusAreas = [
    {
      id: 1,
      title: "Basic Education & Literacy",
      description: "We strive to improve healthcare access, promote awareness, and support medical initiatives to prevent diseases and enhance community well-being.",
      image: "https://img.freepik.com/free-photo/pretty-asian-teacher-smiling-camera-back-classroom-elementary-school-vintage-effect-style-pictures_1253-1133.jpg?uid=R2740650&ga=GA1.1.1997829733.1728553786&semt=ais_hybrid&w=740",
      location: "Grand Bazaar NYC – New York, NY",
      status: "active",
      priority: "high",
      createdAt: "2024-12-15T10:30:00Z"
    },
    {
      id: 2,
      title: "Maternal & Child Health",
      description: "Supporting mothers and children with healthcare services, nutrition programs, and educational resources for healthier communities.",
      image: "https://img.freepik.com/premium-photo/mother-daughter-are-sitting-couch-looking-laptop_1048944-29929.jpg?uid=R2740650&ga=GA1.1.1997829733.1728553786&semt=ais_hybrid&w=740",
      location: "Community Health Centers",
      status: "active",
      priority: "high",
      createdAt: "2024-12-16T14:20:00Z"
    },
    {
      id: 3,
      title: "Peace & Conflict Prevention/Resolution",
      description: "Promoting peace through dialogue, conflict resolution training, and community building initiatives.",
      image: "https://img.freepik.com/premium-photo/group-diverse-people-holding-hands-circle-unity-concept_1048944-29847.jpg?uid=R2740650&ga=GA1.1.1997829733.1728553786&semt=ais_hybrid&w=740",
      location: "Community Centers",
      status: "active",
      priority: "medium",
      createdAt: "2024-12-17T09:15:00Z"
    },
    {
      id: 4,
      title: "Disease Prevention Treatment",
      description: "Ensuring clean water access and proper sanitation to promote healthier communities and a sustainable future.",
      image: "https://img.freepik.com/premium-photo/young-man-wearing-flu-mask-using-hand-sanitizer-standing-against-white-background_1048944-7404746.jpg?uid=R2740650&ga=GA1.1.1997829733.1728553786&semt=ais_hybrid&w=740",
      location: "Healthcare Facilities",
      status: "active",
      priority: "high",
      createdAt: "2024-12-18T11:45:00Z"
    },
    {
      id: 5,
      title: "Water, Sanitation & Hygiene",
      description: "Providing clean water access, sanitation facilities, and hygiene education to improve community health.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQjql2PIms14TmLHYqqlDV7zMViuvuk5kjmQ&s",
      location: "Rural Communities",
      status: "active",
      priority: "high",
      createdAt: "2024-12-19T16:30:00Z"
    },
    {
      id: 6,
      title: "Community & Economic Development",
      description: "Empowering communities through economic opportunities, skill development, and sustainable growth initiatives.",
      image: "https://img.freepik.com/premium-photo/3d-rendered-photos-inclusion-equity-society_1139417-10043.jpg?uid=R2740650&ga=GA1.1.1997829733.1728553786&semt=ais_hybrid&w=740",
      location: "Business Districts",
      status: "active",
      priority: "medium",
      createdAt: "2024-12-20T13:20:00Z"
    },
    {
      id: 7,
      title: "Support the Environment",
      description: "Environmental conservation through tree planting, waste management, and sustainability education programs.",
      image: "https://img.freepik.com/premium-photo/father-daughter-are-planting-seedlings-garden_73944-17584.jpg?uid=R2740650&ga=GA1.1.1997829733.1728553786&semt=ais_hybrid&w=740",
      location: "Parks & Green Spaces",
      status: "active",
      priority: "medium",
      createdAt: "2024-12-21T08:10:00Z"
    }
  ];

  // Function to fix duplicate IDs
  const fixDuplicateIds = (areas) => {
    const seenIds = new Set();
    const fixedAreas = [];
    let maxId = 0;

    // First pass: find max ID and collect non-duplicate items
    areas.forEach(area => {
      if (area.id > maxId) maxId = area.id;
      if (!seenIds.has(area.id)) {
        seenIds.add(area.id);
        fixedAreas.push(area);
      }
    });

    // Second pass: fix duplicates by assigning new IDs
    areas.forEach(area => {
      if (seenIds.has(area.id) && !fixedAreas.find(fixed => fixed.id === area.id && fixed === area)) {
        maxId++;
        fixedAreas.push({ ...area, id: maxId });
      }
    });

    return fixedAreas;
  };

  // Focus areas state with localStorage integration
  const [focusAreas, setFocusAreas] = useState(() => {
    try {
      const savedFocusAreas = localStorage.getItem('rotary_focus_areas');
      if (savedFocusAreas) {
        const parsed = JSON.parse(savedFocusAreas);
        if (parsed.length > 0) {
          // Fix any duplicate IDs that might exist
          return fixDuplicateIds(parsed);
        }
        return defaultFocusAreas;
      }
      return defaultFocusAreas;
    } catch (error) {
      console.error('Error loading focus areas from localStorage:', error);
      return defaultFocusAreas;
    }
  });

  // Save focus areas to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('rotary_focus_areas', JSON.stringify(focusAreas));
      // Dispatch custom event to notify landing page
      window.dispatchEvent(new CustomEvent('focusAreasDataUpdated'));
    } catch (error) {
      console.error('Error saving focus areas to localStorage:', error);
    }
  }, [focusAreas]);

  const handleCreateFocusArea = (focusAreaData) => {
    // Generate unique ID by finding the highest existing ID and adding 1
    const maxId = focusAreas.length > 0 ? Math.max(...focusAreas.map(area => area.id)) : 0;
    const newFocusArea = {
      id: maxId + 1,
      ...focusAreaData,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    setFocusAreas([...focusAreas, newFocusArea]);
  };

  const handleEditFocusArea = (focusAreaId) => {
    const focusAreaToEdit = focusAreas.find(area => area.id === focusAreaId);
    if (focusAreaToEdit) {
      setSelectedFocusArea(focusAreaToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleUpdateFocusArea = (updatedFocusArea) => {
    setFocusAreas(focusAreas.map(area => 
      area.id === updatedFocusArea.id ? updatedFocusArea : area
    ));
    setIsEditModalOpen(false);
    setSelectedFocusArea(null);
  };

  const handleDuplicateFocusArea = (focusAreaId) => {
    const areaToDuplicate = focusAreas.find(area => area.id === focusAreaId);
    if (areaToDuplicate) {
      // Generate unique ID by finding the highest existing ID and adding 1
      const maxId = focusAreas.length > 0 ? Math.max(...focusAreas.map(area => area.id)) : 0;
      const duplicatedArea = {
        ...areaToDuplicate,
        id: maxId + 1,
        title: `${areaToDuplicate.title} (Copy)`,
        createdAt: new Date().toISOString()
      };
      setFocusAreas([...focusAreas, duplicatedArea]);

      // Show success alert
      alert.success(
        '📋 Focus Area Duplicated!',
        `Successfully created a copy of "${areaToDuplicate.title}".`,
        {
          animation: 'bounce',
          autoClose: true,
          autoCloseDelay: 3000
        }
      );
    }
  };

  const handleDeleteFocusArea = async (focusAreaId) => {
    const areaToDelete = focusAreas.find(area => area.id === focusAreaId);
    if (!areaToDelete) return;

    // Show confirmation alert
    const confirmed = await alert.confirm(
      '🗑️ Delete Focus Area',
      `Are you sure you want to delete "${areaToDelete.title}"? This action cannot be undone.`,
      {
        confirmText: 'Delete',
        cancelText: 'Cancel',
        animation: 'zoom'
      }
    );

    if (confirmed) {
      setFocusAreas(focusAreas.filter(area => area.id !== focusAreaId));

      // Show success alert
      alert.success(
        '🗑️ Focus Area Deleted!',
        `"${areaToDelete.title}" has been successfully deleted.`,
        {
          animation: 'fade',
          autoClose: true,
          autoCloseDelay: 3000
        }
      );
    }
  };

  const handleViewFocusArea = (focusAreaId) => {
    const areaToView = focusAreas.find(area => area.id === focusAreaId);
    if (areaToView) {
      setSelectedFocusArea(areaToView);
      setIsViewModalOpen(true);
    }
  };

  const handleToggleStatus = (focusAreaId) => {
    const areaToToggle = focusAreas.find(area => area.id === focusAreaId);
    if (!areaToToggle) return;

    const newStatus = areaToToggle.status === 'active' ? 'inactive' : 'active';

    setFocusAreas(focusAreas.map(area =>
      area.id === focusAreaId
        ? { ...area, status: newStatus }
        : area
    ));

    // Show status change alert
    alert.info(
      newStatus === 'active' ? '✅ Focus Area Activated!' : '⏸️ Focus Area Deactivated!',
      `"${areaToToggle.title}" is now ${newStatus}.`,
      {
        animation: 'slide',
        autoClose: true,
        autoCloseDelay: 2500
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <NavigationSidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        isSidebarCollapsed={isSidebarCollapsed} 
        isSidebarVisible={isSidebarVisible} 
      />
      <AlertCenter />
      
      <main className={`${!isSidebarVisible ? 'ml-0' : isSidebarCollapsed ? 'ml-20' : 'ml-64'} pt-10 transition-all duration-200`}>
        <div className="p-6">
          <BreadcrumbNavigation />

          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Icon name="Target" size={24} color="white" />
                </div>
                <h1 className="text-3xl font-heading font-bold text-text-primary">
                  Focus Areas Management
                </h1>
              </div>
              <p className="text-text-secondary">
                Manage and organize your club's strategic focus areas and priority initiatives
              </p>
            </div>
            
            <Button
              variant="primary"
              size="lg"
              iconName="Plus"
              iconPosition="left"
              onClick={() => setIsCreateModalOpen(true)}
              className="shadow-lg"
            >
              Create Focus Area
            </Button>
          </div>

          {/* Focus Areas List */}
          <FocusAreasList
            focusAreas={focusAreas}
            onEditFocusArea={handleEditFocusArea}
            onDuplicateFocusArea={handleDuplicateFocusArea}
            onDeleteFocusArea={handleDeleteFocusArea}
            onViewFocusArea={handleViewFocusArea}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      </main>

      {/* Create Focus Area Modal */}
      <CreateFocusAreaModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateFocusArea={handleCreateFocusArea}
      />

      {/* View Focus Area Modal */}
      <ViewFocusAreaModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedFocusArea(null);
        }}
        focusArea={selectedFocusArea}
      />

      {/* Edit Focus Area Modal */}
      <EditFocusAreaModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedFocusArea(null);
        }}
        onUpdateFocusArea={handleUpdateFocusArea}
        focusArea={selectedFocusArea}
      />
    </div>
  );
};

export default FocusAreasManagement;
