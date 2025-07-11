import React, { useState, useEffect } from 'react';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import Icon from '../../../../components/AppIcon';
import useCoolAlert from '../../../../hooks/useCoolAlert';

const EditSupportRotaryModal = ({ isOpen, onClose, onUpdateSupportProject, supportProject }) => {
  const alert = useCoolAlert();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    targetAmount: '',
    amountRaised: '',
    donorCount: '',
    category: '',
    priority: 'medium',
    status: 'active'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageInputType, setImageInputType] = useState('url');

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

  // Populate form when supportProject changes
  useEffect(() => {
    if (supportProject && isOpen) {
      const newFormData = {
        title: supportProject.title || '',
        description: supportProject.description || '',
        image: supportProject.image || '',
        targetAmount: supportProject.targetAmount?.toString() || '',
        amountRaised: supportProject.amountRaised?.toString() || '0',
        donorCount: supportProject.donorCount?.toString() || '0',
        category: supportProject.category || '',
        priority: supportProject.priority || 'medium',
        status: supportProject.status || 'active'
      };
      setFormData(newFormData);
      setImagePreview(supportProject.image || '');
      setErrors({}); // Clear any existing errors
    }
  }, [supportProject, isOpen]);

  if (!isOpen || !supportProject) return null;

  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title || !formData.title.trim()) {
      newErrors.title = 'Project title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }

    // Description validation
    if (!formData.description || !formData.description.trim()) {
      newErrors.description = 'Project description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    // Target amount validation
    if (!formData.targetAmount || formData.targetAmount.toString().trim() === '') {
      newErrors.targetAmount = 'Target amount is required';
    } else {
      const targetAmount = parseFloat(formData.targetAmount);
      if (isNaN(targetAmount) || targetAmount <= 0) {
        newErrors.targetAmount = 'Target amount must be a positive number';
      }
    }

    // Category validation
    if (!formData.category || formData.category.trim() === '') {
      newErrors.category = 'Category is required';
    }

    // Amount raised validation (optional)
    if (formData.amountRaised && formData.amountRaised.toString().trim() !== '') {
      const amountRaised = parseFloat(formData.amountRaised);
      if (isNaN(amountRaised) || amountRaised < 0) {
        newErrors.amountRaised = 'Amount raised must be a non-negative number';
      }
    }

    // Donor count validation (optional)
    if (formData.donorCount && formData.donorCount.toString().trim() !== '') {
      const donorCount = parseInt(formData.donorCount);
      if (isNaN(donorCount) || donorCount < 0) {
        newErrors.donorCount = 'Donor count must be a non-negative number';
      }
    }

    // Image validation (optional)
    if (formData.image && formData.image.trim() && !isValidImageUrl(formData.image)) {
      newErrors.image = 'Please enter a valid image URL (jpg, png, gif, webp, svg)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidImageUrl = (url) => {
    if (!url || url.trim() === '') return true; // Allow empty URLs

    try {
      new URL(url);
      // More flexible image validation - allow more formats and data URLs
      return /\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)$/i.test(url) || url.startsWith('data:image/');
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
        '💚 Updating Support Project...',
        'Please wait while we save your changes.',
        {
          autoClose: false,
          animation: 'fade'
        }
      );

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Prepare the updated project data with proper type conversion
      const updatedProject = {
        ...supportProject,
        title: formData.title.trim(),
        description: formData.description.trim(),
        image: formData.image.trim(),
        category: formData.category,
        priority: formData.priority,
        status: formData.status,
        targetAmount: parseFloat(formData.targetAmount) || 0,
        amountRaised: formData.amountRaised ? parseFloat(formData.amountRaised) : 0,
        donorCount: formData.donorCount ? parseInt(formData.donorCount) : 0
      };

      await onUpdateSupportProject(updatedProject);

      // Close loading alert
      loadingAlert();

      // Show success alert
      alert.celebration(
        '🎉 Project Updated!',
        `${formData.title} has been successfully updated!`,
        {
          animation: 'bounce',
          gradient: true,
          sound: true,
          autoClose: true,
          autoCloseDelay: 4000
        }
      );

      onClose();

    } catch (error) {
      console.error('Error updating support project:', error);
      alert.error(
        '❌ Update Failed',
        'An error occurred while updating the support project. Please try again.',
        { autoClose: true, autoCloseDelay: 4000 }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
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
              <Icon name="Edit" size={20} color="white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Edit Support Project
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

          {/* Target Amount and Amount Raised */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <Input
                label="Amount Raised (₹)"
                name="amountRaised"
                type="number"
                value={formData.amountRaised}
                onChange={handleInputChange}
                placeholder="Enter amount raised..."
                error={errors.amountRaised}
                disabled={isSubmitting}
                min="0"
                step="1"
              />
            </div>
          </div>

          {/* Donor Count */}
          <div>
            <Input
              label="Donor Count"
              name="donorCount"
              type="number"
              value={formData.donorCount}
              onChange={handleInputChange}
              placeholder="Enter number of donors..."
              error={errors.donorCount}
              disabled={isSubmitting}
              min="0"
              step="1"
            />
          </div>

          {/* Category, Priority, and Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                disabled={isSubmitting}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
              iconName="Save"
              iconPosition="left"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSupportRotaryModal;
