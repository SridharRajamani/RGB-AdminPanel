import React, { useState, useEffect } from 'react';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Icon from '../../../../components/AppIcon';
import useCoolAlert from '../../../../hooks/useCoolAlert';

const EditMemberInquisitiveModal = ({ isOpen, onClose, onUpdateVideo, video }) => {
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

  // Populate form when video changes
  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title || '',
        description: video.description || '',
        videoUrl: video.videoUrl || '',
        category: video.category || '',
        priority: video.priority || 'medium'
      });
      setErrors({});
    }
  }, [video]);

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
        '🎬 Updating Video...',
        'Please wait while we save your changes.',
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

      await onUpdateVideo(video.id, videoData);

      // Close loading alert
      loadingAlert();

      // Show success alert
      alert.success(
        '✅ Video Updated!',
        `${formData.title} has been successfully updated!`,
        {
          animation: 'bounce',
          autoClose: true,
          autoCloseDelay: 3000
        }
      );

      onClose();

    } catch (error) {
      console.error('Error updating video:', error);
      alert.error(
        '❌ Update Failed',
        'There was an error updating the video. Please try again.',
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
    setErrors({});
    onClose();
  };

  if (!isOpen || !video) return null;

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
              <Icon name="Edit" size={20} color="white" />
            </div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
              Edit Video
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
              iconName="Save"
              iconPosition="left"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Video'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMemberInquisitiveModal;
