import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Heart, PartyPopper, Upload, Link, X, Save } from 'lucide-react';

const EditEventModal = ({ isOpen, onClose, onUpdateEvent, event }) => {
  // Form data
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [imageMode, setImageMode] = useState('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [maxAttendees, setMaxAttendees] = useState('');
  const [registrationRequired, setRegistrationRequired] = useState(true);

  // Populate form when event changes
  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setType(event.type || '');
      setService(event.service || '');
      setDate(event.date || '');
      setTime(event.time || '');
      setLocation(event.location || '');
      setDescription(event.description || '');
      setImage(event.image || '');
      setMaxAttendees(event.maxAttendees?.toString() || '50');
      setRegistrationRequired(event.registrationRequired !== false);
    }
  }, [event]);

  // Validate file
  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      return 'Please select a valid image file (JPG, PNG, GIF, WebP)';
    }
    
    if (file.size > maxSize) {
      return 'File size must be less than 5MB';
    }
    
    return null;
  };

  // Handle file upload with validation
  const handleFileUpload = (file) => {
    setImageError('');
    
    const error = validateFile(file);
    if (error) {
      setImageError(error);
      return;
    }
    
    setIsUploading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      setImage(e.target.result);
      setIsUploading(false);
    };
    
    reader.onerror = () => {
      setImageError('Failed to read file');
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  // Handle URL validation
  const handleUrlChange = (url) => {
    setImage(url);
    setImageError('');
    
    if (url && !isValidUrl(url)) {
      setImageError('Please enter a valid image URL');
    }
  };

  // Validate URL
  const isValidUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  // Clear image
  const clearImage = () => {
    setImage('');
    setImageError('');
    setIsUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { 
      ...event,
      title, 
      type, 
      service, 
      date, 
      time, 
      location, 
      description, 
      image,
      maxAttendees: parseInt(maxAttendees) || 50,
      registrationRequired
    };
    onUpdateEvent(formData);
    onClose();
  };

  if (!isOpen || !event) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        width: '700px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #e5e7eb'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid #f3f4f6'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ 
              margin: 0, 
              color: '#111827',
              fontSize: '24px',
              fontWeight: '600'
            }}>
              Edit Event
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#9ca3af',
                padding: '8px',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
                e.target.style.color = '#374151';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#9ca3af';
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '32px' }}>
            
            {/* Event Title */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600',
                color: '#374151',
                fontSize: '14px'
              }}>
                Event Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter event title"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#252569'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                required
              />
            </div>

            {/* Event Type */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '12px', 
                fontWeight: '600',
                color: '#374151',
                fontSize: '14px'
              }}>
                Event Type *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[
                  { value: 'meeting', label: 'Club Meeting', icon: Users, color: '#252569' },
                  { value: 'fundraising', label: 'Fundraising Event', icon: DollarSign, color: '#059669' },
                  { value: 'community-service', label: 'Community Service', icon: Heart, color: '#dc2626' },
                  { value: 'social', label: 'Social Event', icon: PartyPopper, color: '#7c3aed' }
                ].map((option) => {
                  const IconComponent = option.icon;
                  const isSelected = type === option.value;
                  
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setType(option.value)}
                      style={{
                        padding: '16px',
                        border: isSelected ? `2px solid ${option.color}` : '2px solid #e5e7eb',
                        borderRadius: '12px',
                        backgroundColor: isSelected ? `${option.color}08` : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: isSelected ? option.color : '#374151',
                        boxShadow: isSelected ? `0 0 0 3px ${option.color}20` : 'none'
                      }}
                    >
                      <div style={{
                        padding: '8px',
                        borderRadius: '8px',
                        backgroundColor: isSelected ? option.color : '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <IconComponent 
                          size={20} 
                          color={isSelected ? 'white' : option.color}
                        />
                      </div>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date & Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Date *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#252569'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  required
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Time *
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#252569'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600',
                color: '#374151',
                fontSize: '14px'
              }}>
                Location *
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter event location"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#252569'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                required
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600',
                color: '#374151',
                fontSize: '14px'
              }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter event description (optional)"
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => e.target.style.borderColor = '#252569'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Service Category */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600',
                color: '#374151',
                fontSize: '14px'
              }}>
                Service Category *
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box',
                  backgroundColor: 'white'
                }}
                onFocus={(e) => e.target.style.borderColor = '#252569'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                required
              >
                <option value="">Select a service category</option>
                <option value="Club Service">Club Service</option>
                <option value="Community Service">Community Service</option>
                <option value="Vocational Service">Vocational Service</option>
                <option value="International Service">International Service</option>
                <option value="Youth Service">Youth Service</option>
              </select>
            </div>

            {/* Max Attendees & Registration */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Max Attendees
                </label>
                <input
                  type="number"
                  value={maxAttendees}
                  onChange={(e) => setMaxAttendees(e.target.value)}
                  placeholder="50"
                  min="1"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#252569'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px'
                }}>
                  Registration Required
                </label>
                <div style={{ paddingTop: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={registrationRequired}
                      onChange={(e) => setRegistrationRequired(e.target.checked)}
                      style={{ width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>
                      Require registration for this event
                    </span>
                  </label>
                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div style={{
            padding: '24px 32px',
            borderTop: '1px solid #f3f4f6',
            backgroundColor: '#f9fafb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 20px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: 'white',
                color: '#374151',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#252569',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(37, 37, 105, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Save size={16} />
              Update Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;
