import React, { useState } from 'react';

const SimpleModal = ({ isOpen, onClose, onCreateEvent }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [image, setImage] = useState('');
  const [imageMode, setImageMode] = useState('upload'); // 'upload' or 'url'
  const [isDragging, setIsDragging] = useState(false);
  // Handle file upload
  const handleFileUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };



  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { title, type, service, date, time, image };
    onCreateEvent(formData);

    // Clear form fields
    setTitle('');
    setType('');
    setService('');
    setDate('');
    setTime('');
    setImage('');

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
        width: '500px',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ margin: 0 }}>Create New Event</h2>
          <button 
            onClick={onClose}
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

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Event Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                fontSize: '14px'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Event Type *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { value: 'meeting', label: 'Club Meeting' },
                { value: 'fundraising', label: 'Fundraising' },
                { value: 'community-service', label: 'Community Service' },
                { value: 'social', label: 'Social Event' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setType(option.value)}
                  style={{
                    padding: '10px',
                    border: type === option.value ? '2px solid #007bff' : '1px solid #ccc',
                    borderRadius: '5px',
                    backgroundColor: type === option.value ? '#e7f3ff' : 'white',
                    cursor: 'pointer'
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Event Image
            </label>

            {/* Mode Toggle */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button
                type="button"
                onClick={() => setImageMode('upload')}
                style={{
                  padding: '5px 15px',
                  border: imageMode === 'upload' ? '2px solid #007bff' : '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: imageMode === 'upload' ? '#e7f3ff' : 'white',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                📁 Upload File
              </button>
              <button
                type="button"
                onClick={() => setImageMode('url')}
                style={{
                  padding: '5px 15px',
                  border: imageMode === 'url' ? '2px solid #007bff' : '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: imageMode === 'url' ? '#e7f3ff' : 'white',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                🔗 Image URL
              </button>
            </div>

            {/* Upload Mode */}
            {imageMode === 'upload' && (
              <div>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={{
                    border: isDragging ? '2px dashed #007bff' : '2px dashed #ccc',
                    borderRadius: '8px',
                    padding: '30px',
                    textAlign: 'center',
                    backgroundColor: isDragging ? '#f0f8ff' : '#fafafa',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  <div style={{ fontSize: '24px', marginBottom: '10px' }}>📸</div>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                    Drag & drop an image here, or click to select
                  </div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    Supports: JPG, PNG, GIF (Max 5MB)
                  </div>
                </div>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                  style={{ display: 'none' }}
                />
              </div>
            )}

            {/* URL Mode */}
            {imageMode === 'url' && (
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              />
            )}

            {/* Image Preview */}
            {image && (
              <div style={{ marginTop: '10px' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Preview:</div>
                <img
                  src={image}
                  alt="Preview"
                  style={{
                    width: '120px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setImage('')}
                  style={{
                    marginLeft: '10px',
                    padding: '4px 8px',
                    border: '1px solid #dc3545',
                    borderRadius: '4px',
                    backgroundColor: '#fff',
                    color: '#dc3545',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Service Category *
            </label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                fontSize: '14px'
              }}
              required
            >
              <option value="">Select category</option>
              <option value="Club Service">Club Service</option>
              <option value="Community Service">Community Service</option>
              <option value="International Service">International Service</option>
              <option value="Youth Service">Youth Service</option>
              <option value="Vocational Service">Vocational Service</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px'
                }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Time *
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px'
                }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: '#007bff',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SimpleModal;
