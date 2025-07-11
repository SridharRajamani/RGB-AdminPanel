import React from 'react';
import { X, Calendar, Clock, MapPin, Users, Tag, FileText, User, Phone, Mail } from 'lucide-react';

const ViewEventModal = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) return null;

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'meeting': return Users;
      case 'fundraising': return '$';
      case 'community-service': return '❤️';
      case 'social': return '🎉';
      default: return Calendar;
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'meeting': return '#252569';
      case 'fundraising': return '#059669';
      case 'community-service': return '#dc2626';
      case 'social': return '#7c3aed';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' };
      case 'pending': return { bg: '#fffbeb', text: '#d97706', border: '#fde68a' };
      case 'cancelled': return { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' };
      case 'completed': return { bg: '#f0f9ff', text: '#0891b2', border: '#bae6fd' };
      default: return { bg: '#f9fafb', text: '#6b7280', border: '#e5e7eb' };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const statusColors = getStatusColor(event.status);
  const typeColor = getEventTypeColor(event.type);

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
          borderBottom: '1px solid #f3f4f6',
          background: `linear-gradient(135deg, ${typeColor}08, ${typeColor}04)`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{
                  padding: '8px',
                  borderRadius: '8px',
                  backgroundColor: typeColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Users size={20} color="white" />
                </div>
                <h2 style={{ 
                  margin: 0, 
                  color: '#111827',
                  fontSize: '24px',
                  fontWeight: '600'
                }}>
                  {event.title}
                </h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: statusColors.bg,
                  color: statusColors.text,
                  border: `1px solid ${statusColors.border}`
                }}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: `${typeColor}15`,
                  color: typeColor
                }}>
                  {event.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
            </div>
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

        {/* Content */}
        <div style={{ padding: '32px' }}>
          {/* Event Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
            {/* Date & Time */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Calendar size={16} color="#3b82f6" />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  {formatDate(event.date)}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  {formatTime(event.time)}
                </div>
              </div>
            </div>

            {/* Location */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: '#f0fdf4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MapPin size={16} color="#059669" />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  {event.location || 'TBD'}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  Event Location
                </div>
              </div>
            </div>

            {/* Service Category */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Tag size={16} color="#d97706" />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  {event.service || 'Club Service'}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  Service Category
                </div>
              </div>
            </div>

            {/* Attendees */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: '#fdf2f8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users size={16} color="#ec4899" />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  {event.attendeeCount || 0} / {event.maxAttendees || 50}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  Attendees
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <FileText size={16} color="#6b7280" />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#374151' }}>
                  Description
                </h3>
              </div>
              <div style={{
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                fontSize: '14px',
                color: '#374151',
                lineHeight: '1.5'
              }}>
                {event.description}
              </div>
            </div>
          )}

          {/* Event Image */}
          {event.image && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#374151' }}>
                Event Image
              </h3>
              <img 
                src={event.image} 
                alt={event.title}
                style={{
                  width: '100%',
                  maxHeight: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}
              />
            </div>
          )}

          {/* Additional Info */}
          <div style={{
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '12px' }}>
              <div>
                <span style={{ color: '#6b7280' }}>Registration Required:</span>
                <span style={{ marginLeft: '8px', color: '#374151', fontWeight: '500' }}>
                  {event.registrationRequired ? 'Yes' : 'No'}
                </span>
              </div>
              <div>
                <span style={{ color: '#6b7280' }}>Pending Approvals:</span>
                <span style={{ marginLeft: '8px', color: '#374151', fontWeight: '500' }}>
                  {event.pendingApprovals || 0}
                </span>
              </div>
              {event.registrationDeadline && (
                <div>
                  <span style={{ color: '#6b7280' }}>Registration Deadline:</span>
                  <span style={{ marginLeft: '8px', color: '#374151', fontWeight: '500' }}>
                    {formatDate(event.registrationDeadline)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '24px 32px',
          borderTop: '1px solid #f3f4f6',
          backgroundColor: '#f9fafb',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
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
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEventModal;
