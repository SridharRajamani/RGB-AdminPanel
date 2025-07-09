import React from 'react';
import Icon from '../../../../components/AppIcon';

const ViewMemberInquisitiveModal = ({ isOpen, onClose, video }) => {
  if (!isOpen || !video) return null;

  const getYouTubeVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([^?&]+)/);
    return match ? match[1] : null;
  };

  const getYouTubeThumbnail = (url) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openVideoInNewTab = () => {
    const videoId = getYouTubeVideoId(video.videoUrl);
    if (videoId) {
      window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    }
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
        width: '700px',
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
              <Icon name="Eye" size={20} color="white" />
            </div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
              Video Details
            </h2>
          </div>
          <button
            onClick={onClose}
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

        {/* Content */}
        <div>
          {/* Video Preview */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ 
              position: 'relative',
              width: '100%',
              height: '300px',
              backgroundColor: '#f3f4f6',
              borderRadius: '12px',
              overflow: 'hidden',
              cursor: 'pointer'
            }} onClick={openVideoInNewTab}>
              <img
                src={getYouTubeThumbnail(video.videoUrl)}
                alt={video.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/640x360/f3f4f6/9ca3af?text=Video+Thumbnail';
                }}
              />
              {/* Play Button Overlay */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80px',
                height: '80px',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}>
                <Icon name="Play" size={32} color="white" />
              </div>
              {/* Click to watch text */}
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                Click to watch on YouTube
              </div>
            </div>
          </div>

          {/* Video Information */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px', color: '#1f2937' }}>
              {video.title}
            </h3>
            
            {video.description && (
              <p style={{ color: '#6b7280', marginBottom: '16px', lineHeight: '1.6' }}>
                {video.description}
              </p>
            )}

            {/* Status and Priority Badges */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <span style={{
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: video.status === 'active' ? '#dcfce7' : '#f3f4f6',
                color: video.status === 'active' ? '#166534' : '#6b7280'
              }}>
                {video.status === 'active' ? '✅ Active' : '⏸️ Inactive'}
              </span>
              
              <span style={{
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: '#dbeafe',
                color: '#1e40af'
              }}>
                📂 {video.category}
              </span>
              
              <span style={{
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: video.priority === 'high' ? '#fef2f2' : 
                                video.priority === 'medium' ? '#fffbeb' : '#f9fafb',
                color: video.priority === 'high' ? '#dc2626' : 
                       video.priority === 'medium' ? '#d97706' : '#6b7280'
              }}>
                {video.priority === 'high' ? '🔴 High Priority' : 
                 video.priority === 'medium' ? '🟡 Medium Priority' : '⚪ Low Priority'}
              </span>
            </div>
          </div>

          {/* Metadata */}
          <div style={{ 
            backgroundColor: '#f9fafb', 
            padding: '20px', 
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
              Video Information
            </h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                  Video URL
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: '#1f2937',
                  wordBreak: 'break-all',
                  backgroundColor: 'white',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #e5e7eb'
                }}>
                  {video.videoUrl}
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                  Created Date
                </div>
                <div style={{ fontSize: '14px', color: '#1f2937' }}>
                  {formatDate(video.createdAt)}
                </div>
              </div>
            </div>

            {video.updatedAt && (
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                  Last Updated
                </div>
                <div style={{ fontSize: '14px', color: '#1f2937' }}>
                  {formatDate(video.updatedAt)}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={openVideoInNewTab}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <Icon name="ExternalLink" size={16} />
              Watch on YouTube
            </button>
            
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMemberInquisitiveModal;
