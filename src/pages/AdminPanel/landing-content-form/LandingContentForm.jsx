import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Header from '../../../components/ui/Header';
import NavigationSidebar from '../../../components/ui/NavigationSidebar';
import BreadcrumbNavigation from '../../../components/ui/BreadcrumbNavigation';

const LandingContentForm = ({ isSidebarCollapsed, isSidebarVisible }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const fileInputRef = useRef(null);

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Content Management', href: '/content' },
    { label: 'Landing Page', href: '/landing-content' }
  ];

  const showAlert = (message, type = 'info') => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 5000);
  };

  const handleFileSelect = (file) => {
    console.log('handleFileSelect called with:', file);
    if (!file) {
      console.log('No file provided');
      return;
    }

    console.log('File type:', file.type);
    console.log('File size:', file.size);
    
    if (!file.type.startsWith('video/')) {
      console.log('Invalid file type:', file.type);
      showAlert('Please select a valid video file', 'error');
      return;
    }

    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      showAlert('Video size must be less than 100MB', 'error');
      return;
    }

    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
    showAlert('Video selected successfully', 'success');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    console.log('File input changed:', e.target.files);
    const file = e.target.files[0];
    console.log('Selected file:', file);
    handleFileSelect(file);
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          showAlert('Video uploaded successfully!', 'success');
          
          if (videoFile) {
            const videoData = {
              name: videoFile.name,
              size: videoFile.size,
              type: videoFile.type,
              url: videoPreview,
              uploadedAt: new Date().toISOString()
            };
            localStorage.setItem('landingPageVideo', JSON.stringify(videoData));
          }
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleUpload = () => {
    if (!videoFile) {
      showAlert('Please select a video file first', 'error');
      return;
    }
    
    simulateUpload();
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
    setVideoPreview(null);
    setUploadProgress(0);
    localStorage.removeItem('landingPageVideo');
    showAlert('Video removed successfully', 'info');
  };

  const getCurrentVideo = () => {
    const stored = localStorage.getItem('landingPageVideo');
    return stored ? JSON.parse(stored) : null;
  };

  const currentVideo = getCurrentVideo();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <NavigationSidebar isCollapsed={isSidebarCollapsed} isVisible={isSidebarVisible} />
      
      <main className={`transition-all duration-300 ${
        isSidebarVisible ? (isSidebarCollapsed ? 'ml-16' : 'ml-64') : 'ml-0'
      } pt-16`}>
        <div className="p-6 max-w-7xl mx-auto">
          <BreadcrumbNavigation items={breadcrumbItems} />
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Landing Page Content Management
            </h1>
            <p className="text-text-muted">
              Upload and manage the background video for the landing page
            </p>
          </div>

          {/* Video Upload Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Icon name="upload" size={20} className="mr-2" />
                Upload New Video
              </h2>

              {/* Drop Zone */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragOver
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Icon name="video" size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop video file here or click to browse
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supports: MP4, WebM, AVI (Max 100MB)
                </p>
                <button
                  onClick={() => {
                    console.log('Select Video File button clicked');
                    console.log('fileInputRef.current:', fileInputRef.current);
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Select Video File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>

              {/* Upload Actions */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleUpload}
                  disabled={!videoFile || isUploading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isUploading ? (
                    <>
                      <Icon name="loader" size={16} className="mr-2 animate-spin" />
                      Uploading... {uploadProgress}%
                    </>
                  ) : (
                    <>
                      <Icon name="upload" size={16} className="mr-2" />
                      Upload Video
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleRemoveVideo}
                  disabled={!videoFile || isUploading}
                  className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  <Icon name="trash" size={16} className="mr-2" />
                  Remove
                </button>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Preview Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Icon name="eye" size={20} className="mr-2" />
                Video Preview
              </h2>

              {videoPreview ? (
                <div className="space-y-4">
                  <video
                    src={videoPreview}
                    controls
                    loop
                    muted
                    autoPlay
                    className="w-full h-64 object-cover rounded-lg bg-gray-100"
                    style={{ maxHeight: '300px' }}
                  />
                  <p className="text-sm text-gray-500 text-center">
                    This video will be displayed on the landing page
                  </p>
                </div>
              ) : currentVideo ? (
                <div className="space-y-4">
                  <video
                    src={currentVideo.url}
                    controls
                    loop
                    muted
                    autoPlay
                    className="w-full h-64 object-cover rounded-lg bg-gray-100"
                    style={{ maxHeight: '300px' }}
                  />
                  <div className="text-sm text-gray-500">
                    <p><strong>Current video:</strong> {currentVideo.name}</p>
                    <p><strong>Uploaded:</strong> {new Date(currentVideo.uploadedAt).toLocaleString()}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <Icon name="video" size={48} className="mb-4" />
                  <p>No video selected</p>
                  <p className="text-sm">Upload a video to see preview</p>
                </div>
              )}
            </div>
          </div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="fixed top-20 right-4 space-y-2 z-50">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`px-4 py-3 rounded-lg shadow-lg border ${
                    alert.type === 'success'
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : alert.type === 'error'
                      ? 'bg-red-50 border-red-200 text-red-800'
                      : alert.type === 'warning'
                      ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                      : 'bg-blue-50 border-blue-200 text-blue-800'
                  } max-w-sm`}
                >
                  <div className="flex items-center">
                    <Icon
                      name={
                        alert.type === 'success'
                          ? 'check'
                          : alert.type === 'error'
                          ? 'x'
                          : alert.type === 'warning'
                          ? 'alert-triangle'
                          : 'info'
                      }
                      size={16}
                      className="mr-2"
                    />
                    <p className="text-sm">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LandingContentForm;
