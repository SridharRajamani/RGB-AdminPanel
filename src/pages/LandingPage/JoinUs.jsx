import React, { useState } from 'react';
import './JoinUs.css';

const JoinUs = ({ onProceedToPayment }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    membershipType: '',
    address: ''
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onProceedToPayment) {
      onProceedToPayment(formData);
    }
  };

  return (
    <div className="joinus-container">
      <div className="joinus-header">
        <div className="membership-benefits">
          <div className="benefits-column">
            <h2>Why Join? (Benefits)</h2>
            <div className="benefit-item">
              <span className="checkmark">✓</span>
              <span className="benefit-text">Personal Wealth - Help in education, healthcare, and social service.</span>
            </div>
            <div className="benefit-item">
              <span className="checkmark">✓</span>
              <span className="benefit-text">Leadership Growth - Improve your skills & confidence.</span>
            </div>
            <div className="benefit-item">
              <span className="checkmark">✓</span>
              <span className="benefit-text">Networking - Business leadership & business leaders.</span>
            </div>
            <div className="benefit-item">
              <span className="checkmark">✓</span>
              <span className="benefit-text">Social & Programs - Attend exclusive Rotary workshops & events.</span>
            </div>
          </div>
          <div className="benefits-column">
            <h2>Membership Types & Fees</h2>
            <div className="benefit-item">
              <span className="number">1</span>
              <span className="benefit-text">Regular Member - ₹1,500/year For professionals & business</span>
            </div>
            <div className="benefit-item">
              <span className="number">2</span>
              <span className="benefit-text">Young Member - ₹1,200/year For students & young professionals</span>
            </div>
            <div className="benefit-item">
              <span className="number">3</span>
              <span className="benefit-text">Corporate Member - ₹3,000/year For companies, business & organizations</span>
            </div>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-container">
          <h1 className="form-title">Join Rotary Gulmohar Bangalore</h1>
          
          <form onSubmit={handleSubmit} className="membership-form">
            <div className="form-row">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="form-input"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Id"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-row">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="form-input"
                required
              />
              <select
                name="membershipType"
                value={formData.membershipType}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Membership Type</option>
                <option value="regular">Regular Member - ₹1,500/year</option>
                <option value="young">Young Member - ₹1,200/year</option>
                <option value="corporate">Corporate Member - ₹3,000/year</option>
              </select>
            </div>

            <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
              className="form-textarea"
              rows="4"
              required
            />

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="checkbox-input"
                required
              />
              <label htmlFor="terms" className="checkbox-label">
                Agree to Terms & Conditions
              </label>
            </div>

            <button type="submit" className="submit-btn">
              Join Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinUs;
