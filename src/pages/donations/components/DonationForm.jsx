import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import useCoolAlert from '../../../hooks/useCoolAlert';

const DonationForm = ({ isOpen, onClose, onSubmit }) => {
  const alert = useCoolAlert();

  const [formData, setFormData] = useState({
    donorType: 'individual',
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    amount: '',
    campaign: '',
    paymentMethod: 'online',
    reference: '',
    notes: '',
    isRecurring: false,
    recurringFrequency: 'monthly'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const campaigns = [
    'Education Support',
    'Healthcare Initiative',
    'Community Development',
    'Emergency Relief',
    'Environmental Projects',
    'Youth Programs'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.donorName.trim()) {
      newErrors.donorName = 'Donor name is required';
    }

    if (!formData.donorEmail.trim()) {
      newErrors.donorEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.donorEmail)) {
      newErrors.donorEmail = 'Email is invalid';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid donation amount is required';
    }

    if (!formData.campaign) {
      newErrors.campaign = 'Campaign selection is required';
    }

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
        '💰 Processing Donation...',
        'Please wait while we process your donation.',
        {
          autoClose: false,
          animation: 'fade'
        }
      );

      const donationData = {
        ...formData,
        amount: parseFloat(formData.amount),
        id: `DON-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
      };

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      onSubmit(donationData);

      // Close loading alert
      loadingAlert();

      // Show success alert
      alert.celebration(
        '🎉 Donation Submitted!',
        `Thank you for your generous donation of ₹${formData.amount}!`,
        {
          animation: 'bounce',
          gradient: true,
          sound: true,
          autoClose: true,
          autoCloseDelay: 4000
        }
      );

      // Reset form
      setFormData({
        donorType: 'individual',
        donorName: '',
        donorEmail: '',
        donorPhone: '',
        amount: '',
        campaign: '',
        paymentMethod: 'online',
        reference: '',
        notes: '',
        isRecurring: false,
        recurringFrequency: 'monthly'
      });

      onClose();

    } catch (error) {
      alert.urgent(
        '🚨 Donation Failed',
        error.message || 'An error occurred while processing your donation. Please try again.',
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9998] p-4">
      <div className="bg-surface border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Icon name="Heart" size={20} color="white" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-semibold text-text-primary">
                  Add New Donation
                </h2>
                <p className="text-sm text-text-secondary">
                  Record a new donation to the system
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={onClose}
              className="text-text-muted hover:text-text-primary"
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Donor Type */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Donor Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['individual', 'corporate', 'foundation'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, donorType: type }))}
                    className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                      formData.donorType === type
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-text-secondary hover:border-primary/50'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Donor Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Donor Name *
                </label>
                <input
                  type="text"
                  name="donorName"
                  value={formData.donorName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-surface text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.donorName ? 'border-error-500' : 'border-border'
                  }`}
                  placeholder="Enter donor name"
                />
                {errors.donorName && (
                  <p className="text-error-600 text-xs mt-1">{errors.donorName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="donorEmail"
                  value={formData.donorEmail}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-surface text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.donorEmail ? 'border-error-500' : 'border-border'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.donorEmail && (
                  <p className="text-error-600 text-xs mt-1">{errors.donorEmail}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="donorPhone"
                  value={formData.donorPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Donation Amount (₹) *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  min="1"
                  step="1"
                  className={`w-full px-3 py-2 border rounded-lg bg-surface text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.amount ? 'border-error-500' : 'border-border'
                  }`}
                  placeholder="Enter amount"
                />
                {errors.amount && (
                  <p className="text-error-600 text-xs mt-1">{errors.amount}</p>
                )}
              </div>
            </div>

            {/* Campaign and Payment Method */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Campaign *
                </label>
                <select
                  name="campaign"
                  value={formData.campaign}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.campaign ? 'border-error-500' : 'border-border'
                  }`}
                >
                  <option value="">Select campaign</option>
                  {campaigns.map((campaign) => (
                    <option key={campaign} value={campaign}>
                      {campaign}
                    </option>
                  ))}
                </select>
                {errors.campaign && (
                  <p className="text-error-600 text-xs mt-1">{errors.campaign}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="online">Online Payment</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cheque">Cheque</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
            </div>

            {/* Reference and Notes */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Reference Number
              </label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Transaction/Reference number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Additional notes about this donation"
              />
            </div>

            {/* Recurring Donation */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isRecurring"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
              />
              <label htmlFor="isRecurring" className="text-sm font-medium text-text-primary">
                This is a recurring donation
              </label>
            </div>

            {formData.isRecurring && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Recurring Frequency
                </label>
                <select
                  name="recurringFrequency"
                  value={formData.recurringFrequency}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                iconName={isSubmitting ? "Loader" : "Heart"}
                iconPosition="left"
                disabled={isSubmitting}
                className={isSubmitting ? "animate-pulse" : ""}
              >
                {isSubmitting ? "Processing..." : "Add Donation"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonationForm;
