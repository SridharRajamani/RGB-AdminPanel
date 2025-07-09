import React, { useState } from 'react';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Icon from '../../../../components/AppIcon';
import useCoolAlert from '../../../../hooks/useCoolAlert';

const CreateMemberInquisitiveModal = ({ isOpen, onClose, onCreateVideo }) => {
  if (!isOpen) return null;

  const alert = useCoolAlert();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    category: '',
    priority: 'medium'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const categories = [
    'Leadership',
    'Peace Building',
    'Education',
    'Environment',
    'Health',
    'Youth',
    'Community Service',
    'International Service',
    'Vocational Service',
    'Club Service'
  ];

  const getYouTubeVideoId = (url) => {
    if (!url) return null;

    const patterns = [
      /(?:youtube\.com\/embed\/|youtu\.be\/)([^?&\n]+)/,
      /youtube\.com\/watch\?v=([^&\n]+)/,
      /youtube\.com\/watch\?.*&v=([^&\n]+)/,
      /youtu\.be\/([^?&\n]+)/,
      /youtube\.com\/v\/([^?&\n]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  };

  const getYouTubeThumbnail = (url) => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.videoUrl.trim()) {
      newErrors.videoUrl = 'Video URL is required';
    } else {
      // Validate YouTube URL format
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/;
      if (!youtubeRegex.test(formData.videoUrl)) {
        newErrors.videoUrl = 'Please enter a valid YouTube URL';
      }
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Generate thumbnail preview for video URL
    if (name === 'videoUrl') {
      const thumbnail = getYouTubeThumbnail(value);
      setThumbnailPreview(thumbnail);
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const convertToEmbedUrl = (url) => {
    // Convert various YouTube URL formats to embed format
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtube.com/embed/')) {
      return url; // Already in embed format
    }
    return url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert.error(
        '❌ Validation Error',
        'Please fix the errors in the form before submitting.',
        {
          animation: 'shake',
          autoClose: true,
          autoCloseDelay: 3000
        }
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Show loading alert
      const loadingAlert = alert.info(
        '🎬 Creating Video...',
        'Please wait while we save your video information.',
        {
          autoClose: false,
          animation: 'fade'
        }
      );

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Convert video URL to embed format
      const videoData = {
        ...formData,
        videoUrl: convertToEmbedUrl(formData.videoUrl)
      };

      await onCreateVideo(videoData);

      // Close loading alert
      loadingAlert();

      // Show success alert
      alert.celebration(
        '🎉 Video Created!',
        `${formData.title} has been successfully added to member inquisitive videos!`,
        {
          animation: 'bounce',
          gradient: true,
          sound: true,
          autoClose: true,
          autoCloseDelay: 4000
        }
      );

      // Reset form
      setFormData({
        title: '',
        description: '',
        videoUrl: '',
        category: '',
        priority: 'medium'
      });
      setErrors({});
      setThumbnailPreview(null);
      onClose();

    } catch (error) {
      console.error('Error creating video:', error);
      alert.error(
        '❌ Creation Failed',
        'There was an error creating the video. Please try again.',
        {
          animation: 'shake',
          autoClose: true,
          autoCloseDelay: 4000
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      videoUrl: '',
      category: '',
      priority: 'medium'
    });
    setErrors({});
    setThumbnailPreview(null);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 999999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        width: '600px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Icon name="Video" size={20} color="white" />
            </div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
              Add New Video
            </h2>
          </div>
          <button
            onClick={handleCancel}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <Input
              label="Video Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter video title"
              error={errors.title}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <Input
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter video description"
              type="textarea"
              rows={3}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <Input
              label="YouTube Video URL"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleInputChange}
              placeholder="https://www.youtube.com/watch?v=..."
              error={errors.videoUrl}
              required
            />
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
              Supports YouTube watch, share, and embed URLs
            </div>

            {/* Thumbnail Preview */}
            {thumbnailPreview && (
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Video Preview:
                </div>
                <div style={{
                  width: '200px',
                  height: '112px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '2px solid #e5e7eb',
                  position: 'relative'
                }}>
                  <img
                    src={thumbnailPreview}
                    alt="Video thumbnail"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div style={{
                    display: 'none',
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#f3f4f6',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6b7280',
                    fontSize: '12px'
                  }}>
                    Thumbnail not available
                  </div>
                  {/* Play button overlay */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '32px',
                    height: '32px',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon name="Play" size={16} color="white" style={{ marginLeft: '2px' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${errors.category ? '#ef4444' : '#d1d5db'}`,
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && (
                <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
                  {errors.category}
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              iconName="Plus"
              iconPosition="left"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Video'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMemberInquisitiveModal;
