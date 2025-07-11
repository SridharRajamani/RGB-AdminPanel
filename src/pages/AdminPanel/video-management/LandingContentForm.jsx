import React, { useState, useRef } from 'react';
import Header from '../../../components/ui/Header';
import NavigationSidebar from '../../../components/ui/NavigationSidebar';
import BreadcrumbNavigation from '../../../components/ui/BreadcrumbNavigation';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const LandingContentForm = ({ isSidebarCollapsed, isSidebarVisible }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const fileInputRef = useRef(null);

  // Brand Logo States
  const [logoFiles, setLogoFiles] = useState([]);
  const [logoUploadProgress, setLogoUploadProgress] = useState(0);
  const [isUploadingLogos, setIsUploadingLogos] = useState(false);
  const logoInputRef = useRef(null);
  const [logoDragOver, setLogoDragOver] = useState(false);

  // Tab State (for future use)
  // const [activeTab, setActiveTab] = useState('video'); // 'video' or 'logo'

  // Error handling
  const [hasError, setHasError] = useState(false);

  // Add error boundary
  React.useEffect(() => {
    const handleError = (error) => {
      console.error('LandingContentForm Error:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-4">There was an error loading the landing content form.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Landing Content Management', href: '/landing-content-form' }
  ];

  const showAlert = (message, type = 'info') => {
    const alert = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toISOString()
    };
    setAlerts(prev => [alert, ...prev]);
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      showAlert('Please select a valid video file', 'error');
      return;
    }

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      showAlert('Video file size must be less than 50MB', 'error');
      return;
    }

    setVideoFile(file);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setVideoPreview(previewUrl);
    
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
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const simulateUpload = () => {
    if (!videoFile) {
      showAlert('Please select a video first', 'error');
      return;
    }

    // Check file size before processing to avoid quota exceeded error
    const maxSize = 2 * 1024 * 1024; // 2MB limit for localStorage storage
    if (videoFile.size > maxSize) {
      showAlert('Video file is too large for browser storage. Please use a file smaller than 2MB.', 'error');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // For demo purposes, just store file metadata and use object URL
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);

          try {
            // Store only metadata, not the actual file data to avoid quota issues
            const videoData = {
              name: videoFile.name,
              size: videoFile.size,
              type: videoFile.type,
              url: videoPreview, // Use the object URL (temporary)
              uploadedAt: new Date().toISOString(),
              isTemporary: true // Flag to indicate this is temporary storage
            };

            localStorage.setItem('landingPageVideo', JSON.stringify(videoData));
            showAlert('Video uploaded successfully! Note: This is temporary storage for demo purposes.', 'success');
          } catch (error) {
            console.error('Storage error:', error);
            showAlert('Storage quota exceeded. Video is available for this session only.', 'warning');
          }

          return 100;
        }
        return prev + 10;
      });
    }, 200); // Slower progress for better UX
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
    
    // Clear from localStorage
    localStorage.removeItem('landingPageVideo');
    
    showAlert('Video removed successfully', 'info');
  };

  const getCurrentVideo = () => {
    try {
      const stored = localStorage.getItem('landingPageVideo');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error reading video from storage:', error);
      return null;
    }
  };

  const clearAllStorage = () => {
    if (window.confirm('This will clear all uploaded videos and logos. Are you sure?')) {
      localStorage.removeItem('landingPageVideo');
      localStorage.removeItem('landingPageLogos');
      setVideoFile(null);
      setVideoPreview(null);
      setLogoFiles([]);
      showAlert('All storage cleared successfully', 'success');
    }
  };

  const currentVideo = getCurrentVideo();

  // Brand Logo Functions
  const handleLogoFileSelect = (files) => {
    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        showAlert(`${file.name} is not a valid image file`, 'error');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showAlert(`${file.name} is too large. Max size: 5MB`, 'error');
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setLogoFiles(prev => [...prev, ...validFiles]);
      showAlert(`${validFiles.length} logo(s) selected`, 'success');
    }
  };

  const handleLogoDrop = (e) => {
    e.preventDefault();
    setLogoDragOver(false);
    const files = e.dataTransfer.files;
    handleLogoFileSelect(files);
  };

  const handleLogoDragOver = (e) => {
    e.preventDefault();
    setLogoDragOver(true);
  };

  const handleLogoDragLeave = (e) => {
    e.preventDefault();
    setLogoDragOver(false);
  };

  const handleLogoInputChange = (e) => {
    const files = e.target.files;
    handleLogoFileSelect(files);
  };

  const removeLogo = (index) => {
    setLogoFiles(prev => prev.filter((_, i) => i !== index));
    showAlert('Logo removed', 'info');
  };

  const uploadLogos = () => {
    if (logoFiles.length === 0) {
      showAlert('Please select logo files first', 'error');
      return;
    }

    // Check total file size to avoid quota issues
    const totalSize = logoFiles.reduce((sum, file) => sum + file.size, 0);
    const maxTotalSize = 1 * 1024 * 1024; // 1MB total limit for all logos

    if (totalSize > maxTotalSize) {
      showAlert('Total logo file size is too large. Please reduce the number or size of logos.', 'error');
      return;
    }

    setIsUploadingLogos(true);
    setLogoUploadProgress(0);

    // For demo purposes, create object URLs instead of base64 to avoid quota issues
    const logoData = logoFiles.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file), // Use object URL (temporary)
      uploadedAt: new Date().toISOString(),
      isTemporary: true
    }));

    // Simulate progress
    const interval = setInterval(() => {
      setLogoUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploadingLogos(false);

          try {
            // Get existing logos and add new ones
            const existingLogos = getStoredLogos();
            const allLogos = [...existingLogos, ...logoData];

            // Save to localStorage with error handling
            localStorage.setItem('landingPageLogos', JSON.stringify(allLogos));

            setLogoFiles([]); // Clear selected files
            showAlert(`${logoData.length} logo(s) uploaded successfully! Note: These are temporary for demo purposes.`, 'success');
          } catch (error) {
            console.error('Storage error:', error);
            showAlert('Storage quota exceeded. Logos are available for this session only.', 'warning');
          }

          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getStoredLogos = () => {
    const stored = localStorage.getItem('landingPageLogos');
    return stored ? JSON.parse(stored) : [];
  };

  const removeStoredLogo = (index) => {
    const logos = getStoredLogos();
    const updatedLogos = logos.filter((_, i) => i !== index);
    localStorage.setItem('landingPageLogos', JSON.stringify(updatedLogos));
    showAlert('Logo removed from storage', 'info');
  };

  const storedLogos = getStoredLogos();

  try {
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
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Landing Page Video Management
              </h1>
              <p className="text-gray-600 mb-4">
                Upload and manage the background video for the landing page
              </p>

              {/* Storage Usage Warning */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <Icon name="AlertTriangle" size={16} className="text-yellow-600 mr-2" />
                  <div className="text-sm">
                    <p className="text-yellow-800 font-medium">Storage Limitations</p>
                    <p className="text-yellow-700">
                      Videos larger than 2MB and total logos larger than 1MB may cause storage issues.
                      Use the "Clear All Storage" button if you encounter problems.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          {/* Custom Alert Display */}
          {alerts.length > 0 && (
            <div className="fixed top-20 right-4 space-y-2 z-50">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`px-4 py-3 rounded-lg shadow-lg border max-w-sm ${
                    alert.type === 'success'
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : alert.type === 'error'
                      ? 'bg-red-50 border-red-200 text-red-800'
                      : alert.type === 'warning'
                      ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                      : 'bg-blue-50 border-blue-200 text-blue-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm">{alert.message}</p>
                    <button
                      onClick={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Icon name="Upload" size={20} className="mr-2" />
                Upload New Video
              </h2>

              {/* File Drop Zone */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  dragOver
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Icon name="Upload" size={48} className={`mx-auto mb-4 ${dragOver ? 'text-blue-500' : 'text-gray-400'}`} />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {dragOver ? 'Drop video here' : 'Click to browse or drag video here'}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supports MP4, WebM, AVI formats • Max size: 50MB
                </p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>

              {/* Selected File Info */}
              {videoFile && (
                <div className="mt-4 p-4 bg-surface-hover rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Icon name="Video" size={20} className="text-primary mr-2" />
                      <div>
                        <p className="font-medium text-text-primary">{videoFile.name}</p>
                        <p className="text-sm text-text-muted">
                          {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveVideo}
                      iconName="X"
                    >
                      Remove
                    </Button>
                  </div>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-surface-hover rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Upload Button */}
                  {!isUploading && (
                    <div className="mt-4 space-y-2">
                      <Button
                        onClick={handleUpload}
                        iconName="Upload"
                        className="w-full"
                      >
                        Upload Video
                      </Button>
                      <Button
                        onClick={clearAllStorage}
                        variant="secondary"
                        iconName="Trash"
                        className="w-full text-sm"
                      >
                        Clear All Storage
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Preview Section */}
            <div className="bg-surface border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                <Icon name="Eye" size={20} className="mr-2" />
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
                    className="w-full h-64 object-cover rounded-lg bg-surface-hover"
                    style={{ maxHeight: '300px' }}
                  />
                  <p className="text-sm text-text-muted text-center">
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
                    className="w-full h-64 object-cover rounded-lg bg-surface-hover"
                    style={{ maxHeight: '300px' }}
                  />
                  <div className="text-sm text-text-muted">
                    <p><strong>Current video:</strong> {currentVideo.name}</p>
                    <p><strong>Uploaded:</strong> {new Date(currentVideo.uploadedAt).toLocaleString()}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-text-muted">
                  <Icon name="Video" size={48} className="mb-4" />
                  <p>No video selected</p>
                  <p className="text-sm">Upload a video to see preview</p>
                </div>
              )}
            </div>
          </div>

          {/* Current Status */}
          <div className="mt-6 bg-surface border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
              <Icon name="Info" size={20} className="mr-2" />
              Current Status
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-surface-hover rounded-lg">
                <Icon name="Video" size={24} className="mx-auto mb-2 text-primary" />
                <p className="font-medium text-text-primary">Landing Video</p>
                <p className="text-sm text-text-muted">
                  {currentVideo ? 'Active' : 'No video uploaded'}
                </p>
              </div>

              <div className="text-center p-4 bg-surface-hover rounded-lg">
                <Icon name="Image" size={24} className="mx-auto mb-2 text-purple-500" />
                <p className="font-medium text-text-primary">Brand Logos</p>
                <p className="text-sm text-text-muted">
                  {storedLogos.length} logo(s) uploaded
                </p>
              </div>

              <div className="text-center p-4 bg-surface-hover rounded-lg">
                <Icon name="Globe" size={24} className="mx-auto mb-2 text-green-500" />
                <p className="font-medium text-text-primary">Status</p>
                <p className="text-sm text-text-muted">
                  {currentVideo ? 'Live on website' : 'Default video active'}
                </p>
              </div>

              <div className="text-center p-4 bg-surface-hover rounded-lg">
                <Icon name="Clock" size={24} className="mx-auto mb-2 text-blue-500" />
                <p className="font-medium text-text-primary">Last Updated</p>
                <p className="text-sm text-text-muted">
                  {currentVideo ? new Date(currentVideo.uploadedAt).toLocaleDateString() : 'Never'}
                </p>
              </div>
            </div>
          </div>

          {/* Brand Logo Management Section */}
          <div className="mt-8 bg-surface border border-border rounded-lg p-6">
            <h1 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
              <Icon name="Image" size={24} className="mr-3" />
              Brand Logo Management
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload Section */}
              <div className="bg-surface border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                  <Icon name="Upload" size={20} className="mr-2" />
                  Upload Brand Logos
                </h2>

                {/* Drag & Drop Area */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                    logoDragOver
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-surface-hover'
                  }`}
                  onDrop={handleLogoDrop}
                  onDragOver={handleLogoDragOver}
                  onDragLeave={handleLogoDragLeave}
                  onClick={() => logoInputRef.current?.click()}
                >
                  <Icon name="Image" size={48} className={`mx-auto mb-4 ${logoDragOver ? 'text-primary' : 'text-text-muted'}`} />
                  <p className="text-lg font-medium text-text-primary mb-2">
                    {logoDragOver ? 'Drop logos here' : 'Click to browse or drag logos here'}
                  </p>
                  <p className="text-sm text-text-muted mb-4">
                    Supports PNG, JPG, SVG formats • Max size: 5MB each
                  </p>

                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleLogoInputChange}
                    className="hidden"
                  />
                </div>

                {/* Selected Files */}
                {logoFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h3 className="font-medium text-text-primary">Selected Files ({logoFiles.length})</h3>
                    <div className="max-h-32 overflow-y-auto space-y-2">
                      {logoFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-surface-hover rounded">
                          <div className="flex items-center">
                            <Icon name="Image" size={16} className="text-primary mr-2" />
                            <span className="text-sm text-text-primary">{file.name}</span>
                            <span className="text-xs text-text-muted ml-2">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLogo(index)}
                            iconName="X"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Upload Progress */}
                    {isUploadingLogos && (
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Uploading logos...</span>
                          <span>{logoUploadProgress}%</span>
                        </div>
                        <div className="w-full bg-surface-hover rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${logoUploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Upload Button */}
                    {!isUploadingLogos && (
                      <Button
                        onClick={uploadLogos}
                        iconName="Upload"
                        className="w-full mt-4"
                      >
                        Upload {logoFiles.length} Logo(s)
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Preview Section */}
              <div className="bg-surface border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
                  <Icon name="Eye" size={20} className="mr-2" />
                  Uploaded Logos ({storedLogos.length})
                </h2>

                {storedLogos.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                    {storedLogos.map((logo, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-white rounded-lg p-2 border border-border">
                          <img
                            src={logo.url}
                            alt={logo.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeStoredLogo(index)}
                            iconName="X"
                            className="bg-red-500 text-white hover:bg-red-600"
                          />
                        </div>
                        <p className="text-xs text-text-muted mt-1 truncate" title={logo.name}>
                          {logo.name}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-text-muted">
                    <Icon name="Image" size={48} className="mb-4" />
                    <p>No logos uploaded</p>
                    <p className="text-sm">Upload logos to see them here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('Render error in LandingContentForm:', error);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Render Error</h1>
          <p className="text-gray-600 mb-4">There was an error rendering this page.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
};

export default LandingContentForm;