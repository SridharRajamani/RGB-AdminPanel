import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import Button from '../ui/Button';
import Icon from '../AppIcon';
import useCoolAlert from '../../hooks/useCoolAlert';

const SubmissionForm = ({ 
  title = "Submit Your Request",
  fields = [],
  onSubmit,
  submitText = "Submit",
  resetText = "Reset",
  showReset = true,
  className = ""
}) => {
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();
  const alert = useCoolAlert();
  
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    fields.forEach(field => {
      if (field.required && (!formData[field.name] || formData[field.name].toString().trim() === '')) {
        newErrors[field.name] = `${field.label} is required`;
      }
      
      if (field.type === 'email' && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.name])) {
          newErrors[field.name] = 'Please enter a valid email address';
        }
      }
      
      if (field.minLength && formData[field.name] && formData[field.name].length < field.minLength) {
        newErrors[field.name] = `${field.label} must be at least ${field.minLength} characters`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert.error(
        '❌ Validation Error',
        'Please fix the errors in the form before submitting.',
        { animation: 'shake' }
      );
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Show loading alert
      const loadingAlert = alert.info(
        '⏳ Processing...',
        'Please wait while we process your submission.',
        { 
          autoClose: false,
          animation: 'fade'
        }
      );
      
      // Simulate API call or call provided onSubmit
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      // Close loading alert
      loadingAlert();
      
      // Show success alert
      alert.celebration(
        '🎉 Success!',
        'Your submission has been processed successfully!',
        {
          animation: 'bounce',
          gradient: true,
          sound: true
        }
      );
      
      // Reset form
      setFormData({});
      
    } catch (error) {
      alert.urgent(
        '🚨 Submission Failed',
        error.message || 'An error occurred while processing your submission. Please try again.',
        {
          animation: 'shake',
          gradient: true,
          sound: true
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async () => {
    const confirmed = await alert.confirm(
      '🔄 Reset Form',
      'Are you sure you want to reset all fields? This action cannot be undone.',
      {
        animation: 'zoom',
        confirmText: 'Yes, Reset',
        cancelText: 'Cancel'
      }
    );
    
    if (confirmed) {
      setFormData({});
      setErrors({});
      alert.notification(
        '✅ Form Reset',
        'All fields have been cleared.',
        { animation: 'slide' }
      );
    }
  };

  const renderField = (field) => {
    const value = formData[field.name] || '';
    const error = errors[field.name];
    
    const baseInputClass = `
      w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-blue-500/20
      ${error 
        ? 'border-red-500 focus:border-red-500' 
        : isDarkMode 
          ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500' 
          : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
      }
    `;
    
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            key={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows || 4}
            className={baseInputClass}
            disabled={isSubmitting}
          />
        );
        
      case 'select':
        return (
          <select
            key={field.name}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={baseInputClass}
            disabled={isSubmitting}
          >
            <option value="">{field.placeholder || `Select ${field.label}`}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      default:
        return (
          <input
            key={field.name}
            type={field.type || 'text'}
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClass}
            disabled={isSubmitting}
          />
        );
    }
  };

  return (
    <div className={`${className}`}>
      <div className={`p-6 rounded-2xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-600' : 'bg-blue-100'}`}>
            <Icon 
              name="FileText" 
              size={24} 
              className={isDarkMode ? 'text-white' : 'text-blue-600'} 
            />
          </div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {fields.map((field) => (
            <div key={field.name}>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {renderField(field)}
              
              {errors[field.name] && (
                <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                  <Icon name="AlertCircle" size={16} />
                  <span>{errors[field.name]}</span>
                </p>
              )}
            </div>
          ))}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            {showReset && (
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSubmitting}
                className="flex items-center space-x-2"
              >
                <Icon name="RotateCcw" size={16} />
                <span>{resetText}</span>
              </Button>
            )}
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            >
              {isSubmitting ? (
                <>
                  <Icon name="Loader" size={16} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Icon name="Send" size={16} />
                  <span>{submitText}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmissionForm;
