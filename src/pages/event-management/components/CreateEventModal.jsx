import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import useCoolAlert from '../../../hooks/useCoolAlert';

const CreateEventModal = ({ isOpen, onClose, onCreateEvent }) => {
  const alert = useCoolAlert();

  const [formData, setFormData] = useState({
    title: '',
    type: 'meeting',
    date: '',
    time: '',
    location: '',
    description: '',
    maxAttendees: '',
    registrationRequired: true,
    registrationDeadline: '',
    sendNotifications: true,
    allowGuestRegistration: false
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const eventTypes = [
    { value: 'meeting', label: 'Club Meeting', icon: 'Users' },
    { value: 'fundraising', label: 'Fundraising Event', icon: 'DollarSign' },
    { value: 'community-service', label: 'Community Service', icon: 'Heart' },
    { value: 'social', label: 'Social Event', icon: 'Coffee' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title || !formData.date || !formData.time || !formData.location) {
      alert.error(
        '❌ Validation Error',
        'Please fill in all required fields (Title, Date, Time, Location).',
        { animation: 'shake' }
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Show loading alert
      const loadingAlert = alert.info(
        '📅 Creating Event...',
        'Please wait while we create your event.',
        {
          autoClose: false,
          animation: 'fade'
        }
      );

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      onCreateEvent(formData);

      // Close loading alert
      loadingAlert();

      // Show success alert
      alert.celebration(
        '🎉 Event Created!',
        `"${formData.title}" has been successfully created and scheduled!`,
        {
          animation: 'bounce',
          gradient: true,
          sound: true,
          autoClose: true,
          autoCloseDelay: 4000
        }
      );

      handleClose();

    } catch (error) {
      alert.urgent(
        '🚨 Event Creation Failed',
        error.message || 'An error occurred while creating the event. Please try again.',
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

  const handleClose = () => {
    setFormData({
      title: '',
      type: 'meeting',
      date: '',
      time: '',
      location: '',
      description: '',
      maxAttendees: '',
      registrationRequired: true,
      registrationDeadline: '',
      sendNotifications: true,
      allowGuestRegistration: false
    });
    setCurrentStep(1);
    onClose();
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.type && formData.date && formData.time;
      case 2:
        return formData.location;
      case 3:
        return true;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998] flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-heading font-semibold text-text-primary">
                Create New Event
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              iconSize={20}
              onClick={handleClose}
              className="text-text-secondary hover:text-text-primary"
            />
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-surface-secondary text-text-muted'
                  }`}>
                    {step < currentStep ? (
                      <Icon name="Check" size={16} />
                    ) : (
                      step
                    )}
                  </div>
                  {step < totalSteps && (
                    <div className={`w-12 h-1 mx-2 rounded ${
                      step < currentStep ? 'bg-primary' : 'bg-surface-secondary'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-text-secondary">
              <span>Basic Details</span>
              <span>Location & Details</span>
              <span>Settings</span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6">
            {/* Step 1: Basic Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Event Title *
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter event title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Event Type *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {eventTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleInputChange('type', type.value)}
                        className={`p-4 border rounded-lg text-left transition-all duration-150 ${
                          formData.type === type.value
                            ? 'border-primary bg-primary-50 text-primary' :'border-border hover:border-primary-300 hover:bg-surface-secondary'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon name={type.icon} size={20} />
                          <span className="font-medium">{type.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Date *
                    </label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Time *
                    </label>
                    <Input
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location & Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Location *
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter event location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    rows="4"
                    placeholder="Enter event description..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Maximum Attendees
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter maximum number of attendees"
                    value={formData.maxAttendees}
                    onChange={(e) => handleInputChange('maxAttendees', e.target.value)}
                    min="1"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Settings */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium text-text-primary">Registration Required</h4>
                      <p className="text-sm text-text-secondary">Require attendees to register for this event</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInputChange('registrationRequired', !formData.registrationRequired)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.registrationRequired ? 'bg-primary' : 'bg-surface-secondary'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.registrationRequired ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  {formData.registrationRequired && (
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Registration Deadline
                      </label>
                      <Input
                        type="date"
                        value={formData.registrationDeadline}
                        onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium text-text-primary">Send Notifications</h4>
                      <p className="text-sm text-text-secondary">Notify members about this event</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInputChange('sendNotifications', !formData.sendNotifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.sendNotifications ? 'bg-primary' : 'bg-surface-secondary'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.sendNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h4 className="font-medium text-text-primary">Allow Guest Registration</h4>
                      <p className="text-sm text-text-secondary">Allow non-members to register</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInputChange('allowGuestRegistration', !formData.allowGuestRegistration)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.allowGuestRegistration ? 'bg-primary' : 'bg-surface-secondary'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.allowGuestRegistration ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 1}
                iconName="ChevronLeft"
                iconPosition="left"
              >
                Previous
              </Button>

              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                
                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    iconName="ChevronRight"
                    iconPosition="right"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={!isStepValid() || isSubmitting}
                    iconName={isSubmitting ? "Loader" : "Plus"}
                    iconPosition="left"
                    className={isSubmitting ? "animate-pulse" : ""}
                  >
                    {isSubmitting ? "Creating..." : "Create Event"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;