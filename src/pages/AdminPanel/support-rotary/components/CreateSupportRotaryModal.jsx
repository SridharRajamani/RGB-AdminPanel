import React, { useState } from 'react';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Icon from '../../../../components/AppIcon';
import useCoolAlert from '../../../../hooks/useCoolAlert';

const CreateSupportRotaryModal = ({ isOpen, onClose, onCreateSupportProject }) => {
  if (!isOpen) return null;

  const alert = useCoolAlert();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    targetAmount: '',
    category: '',
    priority: 'medium'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageInputType, setImageInputType] = useState('url'); // 'url' or 'upload'

  const categories = [
    'Environment',
    'Education', 
    'Healthcare',
    'Community',
    'Wildlife',
    'Disaster Relief',
    'Youth Development',
    'Senior Care',
    'Infrastructure',
    'Other'
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    if (!formData.targetAmount) {
      newErrors.targetAmount = 'Target amount is required';
    } else if (isNaN(formData.targetAmount) || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = 'Target amount must be a positive number';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.image && !isValidImageUrl(formData.image)) {
      newErrors.image = 'Please enter a valid image URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidImageUrl = (url) => {
    try {
      new URL(url);
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
    } catch {
      return false;
    }
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

    // Update image preview for URL input
    if (name === 'image' && value && isValidImageUrl(value)) {
      setImagePreview(value);
    } else if (name === 'image' && !value) {
      setImagePreview('');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert.error(
          '📁 File Too Large',
          'Please select an image smaller than 5MB.',
          { autoClose: true, autoCloseDelay: 3000 }
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        setFormData(prev => ({
          ...prev,
          image: imageUrl
        }));
        setImagePreview(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert.error(
        '❌ Validation Error',
        'Please fix the errors in the form before submitting.',
        { autoClose: true, autoCloseDelay: 3000 }
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Show loading alert
      const loadingAlert = alert.info(
        '💚 Creating Support Project...',
        'Please wait while we save your support project information.',
        {
          autoClose: false,
          animation: 'fade'
        }
      );

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      const projectData = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount)
      };

      await onCreateSupportProject(projectData);

      // Close loading alert
      loadingAlert();

      // Show success alert
      alert.celebration(
        '🎉 Support Project Created!',
        `${formData.title} has been successfully added to your support projects!`,
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
        targetAmount: '',
        category: '',
        priority: 'medium'
      });
      setImagePreview('');
      setErrors({});
      onClose();

    } catch (error) {
      console.error('Error creating support project:', error);
      alert.error(
        '❌ Creation Failed',
        'An error occurred while creating the support project. Please try again.',
        { autoClose: true, autoCloseDelay: 4000 }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        title: '',
        description: '',
        image: '',
        targetAmount: '',
        category: '',
        priority: 'medium'
      });
      setImagePreview('');
      setErrors({});
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Icon name="Heart" size={20} color="white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Create Support Project
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={handleClose}
            disabled={isSubmitting}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Project Title */}
          <div>
            <Input
              label="Project Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter project title..."
              error={errors.title}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Project Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your support project..."
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
                errors.description
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Target Amount */}
          <div>
            <Input
              label="Target Amount (₹)"
              name="targetAmount"
              type="number"
              value={formData.targetAmount}
              onChange={handleInputChange}
              placeholder="Enter target amount..."
              error={errors.targetAmount}
              required
              disabled={isSubmitting}
              min="1"
              step="1"
            />
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.category
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                disabled={isSubmitting}
              >
                <option value="">Select category...</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                disabled={isSubmitting}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Image
            </label>
            
            {/* Image Input Type Toggle */}
            <div className="flex gap-2 mb-3">
              <Button
                type="button"
                variant={imageInputType === 'url' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setImageInputType('url')}
                disabled={isSubmitting}
              >
                URL
              </Button>
              <Button
                type="button"
                variant={imageInputType === 'upload' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setImageInputType('upload')}
                disabled={isSubmitting}
              >
                Upload
              </Button>
            </div>

            {imageInputType === 'url' ? (
              <Input
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="Enter image URL..."
                error={errors.image}
                disabled={isSubmitting}
              />
            ) : (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full"
                  disabled={isSubmitting}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
                </p>
              </div>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                />
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
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
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSupportRotaryModal;
