import React, { useState, useEffect } from 'react';
import Header from '../../../components/ui/Header';
import NavigationSidebar from '../../../components/ui/NavigationSidebar';
import BreadcrumbNavigation from '../../../components/ui/BreadcrumbNavigation';
import AlertCenter from '../../../components/ui/AlertCenter';
import Button from '../../../components/ui/Button';
import MemberInquisitiveList from './components/MemberInquisitiveList';
import CreateMemberInquisitiveModal from './components/CreateMemberInquisitiveModal';
import EditMemberInquisitiveModal from './components/EditMemberInquisitiveModal';
import ViewMemberInquisitiveModal from './components/ViewMemberInquisitiveModal';
import Icon from '../../../components/AppIcon';
import useCoolAlert from '../../../hooks/useCoolAlert';

const MemberInquisitiveManagement = ({ isSidebarCollapsed = false, isSidebarVisible = true }) => {
  const alert = useCoolAlert();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Default member inquisitive videos data
  const defaultVideos = [
    {
      id: 1,
      title: "INSPIRE",
      description: "Inspiring community members through leadership and service excellence",
      videoUrl: "https://www.youtube.com/embed/IUN664s7N-c",
      category: "Leadership",
      status: "active",
      priority: "high",
      createdAt: "2024-12-15T10:30:00Z"
    },
    {
      id: 2,
      title: "PROMOTE PEACE",
      description: "Building bridges and promoting peace in our communities",
      videoUrl: "https://www.youtube.com/embed/dJtbRTEq2OY",
      category: "Peace Building",
      status: "active",
      priority: "high",
      createdAt: "2024-12-16T14:20:00Z"
    },
    {
      id: 3,
      title: "EDUCATION SUPPORT",
      description: "Supporting educational initiatives and literacy programs",
      videoUrl: "https://www.youtube.com/embed/sWHkM0a3dB8",
      category: "Education",
      status: "active",
      priority: "medium",
      createdAt: "2024-12-17T09:15:00Z"
    },
    {
      id: 4,
      title: "ENVIRONMENTAL ACTION",
      description: "Taking action for environmental sustainability and conservation",
      videoUrl: "https://www.youtube.com/embed/L2zqTYgcpfg",
      category: "Environment",
      status: "active",
      priority: "high",
      createdAt: "2024-12-18T11:45:00Z"
    },
    {
      id: 5,
      title: "COMMUNITY HEALTH",
      description: "Promoting health and wellness in our communities",
      videoUrl: "https://www.youtube.com/embed/e3W6yf6c-FA",
      category: "Health",
      status: "active",
      priority: "high",
      createdAt: "2024-12-19T16:30:00Z"
    },
    {
      id: 6,
      title: "YOUTH EMPOWERMENT",
      description: "Empowering young leaders for tomorrow's challenges",
      videoUrl: "https://www.youtube.com/embed/n_MkC9P3aMo",
      category: "Youth",
      status: "active",
      priority: "medium",
      createdAt: "2024-12-20T13:20:00Z"
    }
  ];

  // Helper function to fix duplicate IDs
  const fixDuplicateIds = (videos) => {
    const seenIds = new Set();
    return videos.map((video, index) => {
      if (seenIds.has(video.id)) {
        const newId = Math.max(...videos.map(v => v.id || 0)) + index + 1;
        return { ...video, id: newId };
      }
      seenIds.add(video.id);
      return video;
    });
  };

  // Member inquisitive videos state with localStorage integration
  const [videos, setVideos] = useState(() => {
    try {
      const savedVideos = localStorage.getItem('rotary_member_inquisitive');
      if (savedVideos) {
        const parsed = JSON.parse(savedVideos);
        if (parsed.length > 0) {
          // Fix any duplicate IDs that might exist
          return fixDuplicateIds(parsed);
        }
        return defaultVideos;
      }
      return defaultVideos;
    } catch (error) {
      console.error('Error loading member inquisitive videos from localStorage:', error);
      return defaultVideos;
    }
  });

  // Save videos to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('rotary_member_inquisitive', JSON.stringify(videos));
      // Dispatch custom event to notify landing page
      window.dispatchEvent(new CustomEvent('memberInquisitiveDataUpdated'));
    } catch (error) {
      console.error('Error saving member inquisitive videos to localStorage:', error);
    }
  }, [videos]);

  const handleCreateVideo = (videoData) => {
    // Generate unique ID by finding the highest existing ID and adding 1
    const maxId = videos.length > 0 ? Math.max(...videos.map(video => video.id)) : 0;
    const newVideo = {
      id: maxId + 1,
      ...videoData,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    setVideos([...videos, newVideo]);
  };

  const handleUpdateVideo = (videoId, updatedData) => {
    setVideos(videos.map(video =>
      video.id === videoId
        ? { ...video, ...updatedData, updatedAt: new Date().toISOString() }
        : video
    ));
  };

  const handleDuplicateVideo = (videoId) => {
    const videoToDuplicate = videos.find(video => video.id === videoId);
    if (videoToDuplicate) {
      const maxId = Math.max(...videos.map(video => video.id));
      const duplicatedVideo = {
        ...videoToDuplicate,
        id: maxId + 1,
        title: `${videoToDuplicate.title} (Copy)`,
        createdAt: new Date().toISOString()
      };
      setVideos([...videos, duplicatedVideo]);

      // Show success alert
      alert.success(
        '📋 Video Duplicated!',
        `"${videoToDuplicate.title}" has been successfully duplicated.`,
        {
          animation: 'bounce',
          autoClose: true,
          autoCloseDelay: 3000
        }
      );
    }
  };

  const handleDeleteVideo = async (videoId) => {
    const videoToDelete = videos.find(video => video.id === videoId);
    if (!videoToDelete) return;

    // Show confirmation alert
    const confirmed = await alert.confirm(
      '🗑️ Delete Video',
      `Are you sure you want to delete "${videoToDelete.title}"? This action cannot be undone.`,
      {
        confirmText: 'Delete',
        cancelText: 'Cancel',
        animation: 'zoom'
      }
    );

    if (confirmed) {
      setVideos(videos.filter(video => video.id !== videoId));

      // Show success alert
      alert.success(
        '🗑️ Video Deleted!',
        `"${videoToDelete.title}" has been successfully deleted.`,
        {
          animation: 'fade',
          autoClose: true,
          autoCloseDelay: 3000
        }
      );
    }
  };

  const handleViewVideo = (videoId) => {
    const videoToView = videos.find(video => video.id === videoId);
    if (videoToView) {
      setSelectedVideo(videoToView);
      setIsViewModalOpen(true);
    }
  };

  const handleEditVideo = (videoId) => {
    const videoToEdit = videos.find(video => video.id === videoId);
    if (videoToEdit) {
      setSelectedVideo(videoToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleToggleStatus = (videoId) => {
    const videoToToggle = videos.find(video => video.id === videoId);
    if (!videoToToggle) return;

    const newStatus = videoToToggle.status === 'active' ? 'inactive' : 'active';

    setVideos(videos.map(video =>
      video.id === videoId
        ? { ...video, status: newStatus }
        : video
    ));

    // Show status change alert
    alert.info(
      newStatus === 'active' ? '✅ Video Activated!' : '⏸️ Video Deactivated!',
      `"${videoToToggle.title}" is now ${newStatus}.`,
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
        isCollapsed={isSidebarCollapsed}
        isVisible={isSidebarVisible}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
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
                  <Icon name="Video" size={24} color="white" />
                </div>
                <h1 className="text-3xl font-heading font-bold text-text-primary">
                  Member Inquisitive Management
                </h1>
              </div>
              <p className="text-text-secondary">
                Manage and organize member inquisitive videos and content for the landing page
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                iconName="Upload"
                iconPosition="left"
                onClick={() => setIsCreateModalOpen(true)}
                className="shadow-sm"
              >
                Upload Video
              </Button>
              <Button
                variant="primary"
                size="lg"
                iconName="Plus"
                iconPosition="left"
                onClick={() => setIsCreateModalOpen(true)}
                className="shadow-lg"
              >
                Add Video
              </Button>
            </div>
          </div>

          {/* Videos List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <MemberInquisitiveList
              videos={videos}
              onEditVideo={handleEditVideo}
              onDuplicateVideo={handleDuplicateVideo}
              onDeleteVideo={handleDeleteVideo}
              onViewVideo={handleViewVideo}
              onToggleStatus={handleToggleStatus}
            />
          </div>
        </div>
      </main>

      {/* Create Video Modal */}
      <CreateMemberInquisitiveModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateVideo={handleCreateVideo}
      />

      {/* View Video Modal */}
      <ViewMemberInquisitiveModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedVideo(null);
        }}
        video={selectedVideo}
      />

      {/* Edit Video Modal */}
      <EditMemberInquisitiveModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedVideo(null);
        }}
        onUpdateVideo={handleUpdateVideo}
        video={selectedVideo}
      />
    </div>
  );
};

export default MemberInquisitiveManagement;
