import React from 'react';
import { BsHeartFill, BsX, BsPeople, BsCalendar, BsTag } from 'react-icons/bs';
import './SupportProjectViewModal.scss';

const SupportProjectViewModal = ({ isOpen, onClose, project, onDonate }) => {
  if (!isOpen || !project) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = (raised, target) => {
    return Math.min((raised / target) * 100, 100);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const progressPercentage = getProgressPercentage(project.amountRaised, project.targetAmount);

  return (
    <div className="support-project-modal-overlay" onClick={onClose}>
      <div className="support-project-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <BsX size={24} />
        </button>

        {/* Project Image */}
        <div className="project-image-container">
          <img 
            src={project.image || 'https://via.placeholder.com/400x250?text=No+Image'} 
            alt={project.title}
            className="project-image"
          />
          <div className="image-overlay">
            <div className="project-category">
              <BsTag size={12} />
              {project.category}
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="progress-section">
          <div className="progress-percentage">
            {progressPercentage.toFixed(1)}% funded
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Project Details */}
        <div className="project-details">
          <h2 className="project-title">{project.title}</h2>
          <p className="project-description">{project.description}</p>

          {/* Funding Information */}
          <div className="funding-info">
            <div className="amount-raised">
              <span className="amount">{formatCurrency(project.amountRaised)}</span>
              <span className="label">raised</span>
            </div>
            <div className="target-amount">
              <span className="label">of</span>
              <span className="amount">{formatCurrency(project.targetAmount)}</span>
            </div>
          </div>

          {/* Project Stats */}
          <div className="project-stats">
            <div className="stat-item">
              <BsPeople size={16} />
              <span>{project.donorCount || 0} donors</span>
            </div>
            {project.createdAt && (
              <div className="stat-item">
                <BsCalendar size={16} />
                <span>Started {formatDate(project.createdAt)}</span>
              </div>
            )}
          </div>

          {/* Additional Details */}
          {project.priority && (
            <div className="priority-badge">
              <span className={`priority priority-${project.priority}`}>
                {project.priority} priority
              </span>
            </div>
          )}

          {/* Remaining Amount */}
          <div className="remaining-info">
            <div className="remaining-amount">
              <span className="label">Remaining to reach goal:</span>
              <span className="amount">
                {formatCurrency(Math.max(0, project.targetAmount - project.amountRaised))}
              </span>
            </div>
          </div>
        </div>

        {/* Impact Statement */}
        <div className="impact-statement">
          <p>Your contribution will help us make a meaningful impact in the community and bring positive change to those who need it most.</p>
        </div>

        {/* Action Buttons */}
        <div className="modal-action-buttons">
          <button className="view-details-btn" onClick={onClose}>
            View Details
          </button>
          <button
            className="donate-button"
            onClick={() => onDonate(project)}
          >
            <BsHeartFill size={16} />
            Donate
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportProjectViewModal;
