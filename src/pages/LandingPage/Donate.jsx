import React, { useState, useEffect } from 'react';
import './SupportRotaryGulmhar.scss';
import { BsHeartFill, BsEye } from 'react-icons/bs';
import SupportProjectViewModal from './components/SupportProjectViewModal';
import DonationModal from './components/DonationModal';

// Default fallback data
const defaultDonationData = [
  {
    id: 1,
    title: 'Bleed Green',
    description: 'Planting 1,000 trees this year.',
    amountRaised: 75000,
    targetAmount: 100000,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk_zpHLOkMn1pXoEAl5lQCfx8QastZrCuFpw&s',
    status: 'active'
  },
  {
    id: 2,
    title: 'Scholarship',
    description: 'Supporting underprivileged students.',
    amountRaised: 120000,
    targetAmount: 150000,
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
    status: 'active'
  },
  {
    id: 3,
    title: 'Save Wildlife',
    description: 'Protecting endangered species in local forests.',
    amountRaised: 95000,
    targetAmount: 120000,
    image: 'https://cdn.shopify.com/s/files/1/0071/5004/3187/files/Unknown-1_680d19fb-9f5c-4f93-be45-5c05206789e7.jpg?v=1669352164',
    status: 'active'
  },
  {
    id: 4,
    title: 'General Projects',
    description: 'Community development and disaster relief.',
    amountRaised: 200000,
    targetAmount: 250000,
    image: 'https://media.istockphoto.com/id/1429906347/photo/group-of-volunteers-working-in-community-charity-donation-center.jpg?s=612x612&w=0&k=20&c=asSnIqAjUYirikmaOmy75BceSaRUTHmqDUmWI2MCT1E=',
    status: 'active'
  },
  {
    id: 5,
    title: 'Scholarship',
    description: 'Merit-based rewards for top students.',
    amountRaised: 80000,
    targetAmount: 100000,
    image: 'https://mitwpu.edu.in/assets/frontend/images/scholarship-img1.jpg',
    status: 'active'
  }
];

const SupportRotaryGulmhar = () => {
  const [donationData, setDonationData] = useState(defaultDonationData);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Load support projects from localStorage
  const loadSupportProjects = () => {
    try {
      const savedProjects = localStorage.getItem('rotary_support_projects');

      if (savedProjects) {
        const parsedProjects = JSON.parse(savedProjects);

        if (Array.isArray(parsedProjects) && parsedProjects.length > 0) {
          // Filter only active projects for display
          const activeProjects = parsedProjects.filter(project => project.status === 'active');

          // Show active projects, or all projects if no active ones
          setDonationData(activeProjects.length > 0 ? activeProjects : parsedProjects);
        } else {
          setDonationData(defaultDonationData);
        }
      } else {
        setDonationData(defaultDonationData);
      }
    } catch (error) {
      console.error('Error loading support projects from localStorage:', error);
      setDonationData(defaultDonationData);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadSupportProjects();
  }, []);

  // Listen for updates from admin panel
  useEffect(() => {
    const handleDataUpdate = () => {
      loadSupportProjects();
    };

    // Listen for custom event from admin panel
    window.addEventListener('supportProjectsDataUpdated', handleDataUpdate);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('supportProjectsDataUpdated', handleDataUpdate);
    };
  }, []);

  // Get progress percentage
  const getProgressPercentage = (raised, target) => {
    return Math.min((raised / target) * 100, 100);
  };

  // Handle view project
  const handleViewProject = (project) => {
    setSelectedProject(project);
    setIsViewModalOpen(true);
  };

  // Handle donate
  const handleDonate = (project) => {
    setSelectedProject(project);
    setIsDonationModalOpen(true);
    setIsViewModalOpen(false); // Close view modal if open
  };

  // Close modals
  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedProject(null);
  };

  const closeDonationModal = () => {
    setIsDonationModalOpen(false);
    setSelectedProject(null);
  };

  // Handle donation completion
  const handleDonationComplete = (donation) => {
    console.log('Donation completed:', donation);

    // Update project data with new donation
    setDonationData(prevData =>
      prevData.map(project =>
        project.id === donation.projectId
          ? {
              ...project,
              amountRaised: project.amountRaised + donation.amount,
              donorCount: (project.donorCount || 0) + 1
            }
          : project
      )
    );

    // Show success message
    alert(`Thank you for your donation of ₹${donation.amount.toLocaleString()} to ${donation.projectTitle}!`);
  };
  return (
    <div className="support-rotary-container">
      <h1>Support Rotary Gulmohar</h1>
      <p className="description">
        Join us in making a difference. Your support helps us drive meaningful community projects,
        uplift lives, and create a better future together.
      </p>

      <div className="divider"></div>

      <div className="donation-options">
        {donationData.map((donation) => (
          <div className="donation-option" key={donation.id}>

            <div>
                <img
                  src={donation.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={donation.title}
                  className="donation-image"
                />
                {/* Progress indicator */}
                {donation.targetAmount && (
                  <div className="progress-overlay">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${getProgressPercentage(donation.amountRaised, donation.targetAmount)}%` }}
                      ></div>
                    </div>
                    <div className="progress-text">
                      {getProgressPercentage(donation.amountRaised, donation.targetAmount).toFixed(1)}% funded
                    </div>
                  </div>
                )}
            </div>

            <div>
                <h3>{donation.title}</h3>
                <div className="donation-description">{donation.description}</div>
                <div className="donation-amount">
                  {formatCurrency(donation.amountRaised)} raised
                  {donation.targetAmount && (
                    <span className="target-amount"> of {formatCurrency(donation.targetAmount)}</span>
                  )}
                </div>
                {donation.category && (
                  <div className="donation-category">{donation.category}</div>
                )}
            </div>

            <div className="action-buttons">
              <div className="view-btn" onClick={() => handleViewProject(donation)}>
                <BsEye /> View Details
              </div>
              <div className="donate-btn" onClick={() => handleDonate(donation)}>
                Donate <BsHeartFill />
              </div>
            </div>
          </div>
        ))}
      </div>

      {donationData.length === 0 && (
        <div className="no-projects">
          <p>No active support projects available at the moment.</p>
          <p>Check back soon for new opportunities to make a difference!</p>
        </div>
      )}

      {/* Support Project View Modal */}
      <SupportProjectViewModal
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        project={selectedProject}
        onDonate={handleDonate}
      />

      {/* Donation Modal */}
      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={closeDonationModal}
        project={selectedProject}
        onDonationComplete={handleDonationComplete}
      />
    </div>
  );
};

export default SupportRotaryGulmhar;
