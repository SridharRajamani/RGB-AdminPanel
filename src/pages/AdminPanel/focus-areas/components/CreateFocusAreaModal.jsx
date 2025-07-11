import React, { useState } from 'react';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Icon from '../../../../components/AppIcon';
import useCoolAlert from '../../../../hooks/useCoolAlert';

const CreateFocusAreaModal = ({ isOpen, onClose, onCreateFocusArea }) => {
  if (!isOpen) return null;

  const alert = useCoolAlert();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    location: '',
    priority: 'medium'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageInputType, setImageInputType] = useState('url'); // 'url' or 'upload'
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

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

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({
      ...prev,
      image: url
    }));
    setImagePreview(url);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target.result;
        setImagePreview(result);
        setFormData(prev => ({
          ...prev,
          image: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleImageFileChange({ target: { files: [file] } });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Image is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert.warning(
        '⚠️ Validation Error',
        'Please fill in all required fields correctly.',
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
        '🎯 Creating Focus Area...',
        'Please wait while we save your focus area information.',
        {
          autoClose: false,
          animation: 'fade'
        }
      );

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      await onCreateFocusArea(formData);

      // Close loading alert
      loadingAlert();

      // Show success alert
      alert.celebration(
        '🎉 Focus Area Created!',
        `${formData.title} has been successfully added to your focus areas!`,
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
        image: '',
        location: '',
        priority: 'medium'
      });
      setImagePreview('');
      setImageFile(null);
      setErrors({});

      onClose();
    } catch (error) {
      console.error('Error creating focus area:', error);

      // Show error alert
      alert.error(
        '❌ Creation Failed',
        'Something went wrong while creating the focus area. Please try again.',
        {
          animation: 'shake',
          sound: true,
          autoClose: true,
          autoCloseDelay: 5000
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      location: '',
      priority: 'medium'
    });
    setImagePreview('');
    setImageFile(null);
    setErrors({});
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
        borderRadius: '10px',
        width: '600px',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Create New Focus Area</h2>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Title *
          </label>
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter focus area title"
            error={errors.title}
            className="w-full"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter focus area description"
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none ${
              errors.description ? 'border-red-500' : 'border-border'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Image *
          </label>
          
          {/* Image Input Type Toggle */}
          <div className="flex gap-2 mb-3">
            <Button
              type="button"
              variant={imageInputType === 'url' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setImageInputType('url')}
            >
              URL
            </Button>
            <Button
              type="button"
              variant={imageInputType === 'upload' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setImageInputType('upload')}
            >
              Upload
            </Button>
          </div>

          {imageInputType === 'url' ? (
            <Input
              type="url"
              value={formData.image}
              onChange={handleImageUrlChange}
              placeholder="Enter image URL"
              error={errors.image}
              className="w-full"
            />
          ) : (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors ${
                errors.image ? 'border-red-500' : 'border-border'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Icon name="Upload" size={32} color="#9CA3AF" className="mx-auto mb-2" />
                <p className="text-text-secondary">
                  Drag and drop an image here, or click to select
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  Supports: JPG, PNG, GIF (Max 5MB)
                </p>
              </label>
            </div>
          )}

          {errors.image && (
            <p className="mt-1 text-sm text-red-600">{errors.image}</p>
          )}

          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-3">
              <p className="text-sm font-medium text-text-primary mb-2">Preview:</p>
              <div className="w-full h-48 border border-border rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Location *
          </label>
          <Input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Enter location or area of focus"
            error={errors.location}
            className="w-full"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            iconName="Plus"
            iconPosition="left"
          >
            Create Focus Area
          </Button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default CreateFocusAreaModal;
