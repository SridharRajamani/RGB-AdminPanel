import React from 'react';

const ViewFocusAreaModal = ({ isOpen, onClose, focusArea }) => {
  if (!isOpen || !focusArea) return null;

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
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Focus Area Details</h2>
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

        {/* Content */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>{focusArea.title}</h3>
          <p style={{ color: '#666', marginBottom: '15px' }}>{focusArea.description}</p>

          {/* Image */}
          <div style={{ marginBottom: '15px' }}>
            <img
              src={focusArea.image}
              alt={focusArea.title}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          </div>

          {/* Details */}
          <div style={{ marginBottom: '15px' }}>
            <p><strong>Location:</strong> {focusArea.location}</p>
            <p><strong>Priority:</strong> {focusArea.priority}</p>
            <p><strong>Status:</strong> {focusArea.status}</p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewFocusAreaModal;
