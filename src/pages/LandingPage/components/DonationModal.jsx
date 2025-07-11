import React, { useState } from 'react';
import { BsHeartFill, BsX, BsCreditCard, BsBank, BsPhone } from 'react-icons/bs';
import './DonationModal.scss';

const DonationModal = ({ isOpen, onClose, project, onDonationComplete }) => {
  const [donationAmount, setDonationAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Amount, 2: Details, 3: Payment

  if (!isOpen || !project) return null;

  const predefinedAmounts = [500, 1000, 2500, 5000, 10000];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAmountSelect = (amount) => {
    setDonationAmount(amount.toString());
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    setDonationAmount(value);
  };

  const handleDonorInfoChange = (e) => {
    const { name, value } = e.target;
    setDonorInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDonation = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Create donation record
      const donation = {
        projectId: project.id,
        projectTitle: project.title,
        amount: parseFloat(donationAmount),
        donorInfo,
        paymentMethod,
        timestamp: new Date().toISOString(),
        transactionId: `TXN${Date.now()}`
      };

      // Call completion handler
      onDonationComplete(donation);
      
      // Reset form
      setDonationAmount('');
      setCustomAmount('');
      setDonorInfo({ name: '', email: '', phone: '', message: '' });
      setCurrentStep(1);
      
      onClose();
    } catch (error) {
      console.error('Donation failed:', error);
      alert('Donation failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const isValidAmount = donationAmount && parseFloat(donationAmount) >= 100;
  const isValidDonorInfo = donorInfo.name && donorInfo.email && donorInfo.phone;

  return (
    <div className="donation-modal-overlay" onClick={onClose}>
      <div className="donation-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <div className="project-info">
              <h3>Donate to {project.title}</h3>
              <p>{project.category}</p>
            </div>
            <button className="close-btn" onClick={onClose}>
              <BsX size={24} />
            </button>
          </div>
          
          {/* Progress Steps */}
          <div className="progress-steps">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
              <span>1</span>
              <label>Amount</label>
            </div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
              <span>2</span>
              <label>Details</label>
            </div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
              <span>3</span>
              <label>Payment</label>
            </div>
          </div>
        </div>

        {/* Step 1: Amount Selection */}
        {currentStep === 1 && (
          <div className="modal-content">
            <h4>Choose Donation Amount</h4>
            
            <div className="amount-options">
              {predefinedAmounts.map(amount => (
                <button
                  key={amount}
                  className={`amount-btn ${donationAmount === amount.toString() ? 'selected' : ''}`}
                  onClick={() => handleAmountSelect(amount)}
                >
                  {formatCurrency(amount)}
                </button>
              ))}
            </div>

            <div className="custom-amount">
              <label>Or enter custom amount:</label>
              <div className="amount-input">
                <span className="currency">₹</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="Enter amount"
                  min="100"
                />
              </div>
              {donationAmount && parseFloat(donationAmount) < 100 && (
                <p className="error">Minimum donation amount is ₹100</p>
              )}
            </div>

            <div className="step-actions">
              <button 
                className="next-btn"
                onClick={handleNextStep}
                disabled={!isValidAmount}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Donor Information */}
        {currentStep === 2 && (
          <div className="modal-content">
            <h4>Your Information</h4>
            
            <div className="donor-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={donorInfo.name}
                  onChange={handleDonorInfoChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={donorInfo.email}
                  onChange={handleDonorInfoChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={donorInfo.phone}
                  onChange={handleDonorInfoChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label>Message (Optional)</label>
                <textarea
                  name="message"
                  value={donorInfo.message}
                  onChange={handleDonorInfoChange}
                  placeholder="Leave a message of support..."
                  rows={3}
                />
              </div>
            </div>

            <div className="step-actions">
              <button className="back-btn" onClick={handlePrevStep}>
                Back
              </button>
              <button 
                className="next-btn"
                onClick={handleNextStep}
                disabled={!isValidDonorInfo}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {currentStep === 3 && (
          <div className="modal-content">
            <h4>Payment Method</h4>
            
            <div className="payment-methods">
              <div 
                className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                <BsCreditCard size={20} />
                <span>Credit/Debit Card</span>
              </div>
              
              <div 
                className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('upi')}
              >
                <BsPhone size={20} />
                <span>UPI</span>
              </div>
              
              <div 
                className={`payment-option ${paymentMethod === 'netbanking' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('netbanking')}
              >
                <BsBank size={20} />
                <span>Net Banking</span>
              </div>
            </div>

            <div className="donation-summary">
              <h5>Donation Summary</h5>
              <div className="summary-row">
                <span>Project:</span>
                <span>{project.title}</span>
              </div>
              <div className="summary-row">
                <span>Amount:</span>
                <span className="amount">{formatCurrency(parseFloat(donationAmount))}</span>
              </div>
              <div className="summary-row">
                <span>Payment Method:</span>
                <span className="capitalize">{paymentMethod}</span>
              </div>
            </div>

            <div className="step-actions">
              <button className="back-btn" onClick={handlePrevStep}>
                Back
              </button>
              <button 
                className="donate-btn"
                onClick={handleDonation}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="spinner"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <BsHeartFill />
                    Donate {formatCurrency(parseFloat(donationAmount))}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationModal;
