import React, { useState } from 'react';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';

const CreateProjectModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'community-service',
    priority: 'medium',
    budget: '',
    startDate: '',
    endDate: '',
    objectives: '',
    team: '',
    milestones: ['']
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMilestoneChange = (index, value) => {
    const updatedMilestones = [...formData.milestones];
    updatedMilestones[index] = value;
    setFormData(prev => ({
      ...prev,
      milestones: updatedMilestones
    }));
  };

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, '']
    }));
  };

  const removeMilestone = (index) => {
    if (formData.milestones.length > 1) {
      const updatedMilestones = formData.milestones.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        milestones: updatedMilestones
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send the data to your backend
      console.log('Creating project:', formData);
      
      // Reset form and close modal
      setFormData({
        title: '',
        description: '',
        type: 'community-service',
        priority: 'medium',
        budget: '',
        startDate: '',
        endDate: '',
        objectives: '',
        team: '',
        milestones: ['']
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9998] overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-surface rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <h2 className="text-xl font-semibold text-text-primary">
                Create New Project
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                Add a new project or initiative to track progress and manage resources
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary"
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Project Title *
                  </label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter project title"
                    required
                    className="w-full"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the project objectives and scope"
                    required
                    rows={3}
                    className="w-full border border-border rounded-lg px-3 py-2 text-text-primary bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Project Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    required
                    className="w-full border border-border rounded-lg px-3 py-2 text-text-primary bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="community-service">Community Service</option>
                    <option value="fundraising">Fundraising</option>
                    <option value="youth-programs">Youth Programs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Priority *
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    required
                    className="w-full border border-border rounded-lg px-3 py-2 text-text-primary bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              {/* Budget and Timeline */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Budget (INR) *
                  </label>
                  <Input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    placeholder="0"
                    required
                    min="0"
                    step="1000"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Start Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    End Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    required
                    min={formData.startDate}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Objectives */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Project Objectives
                </label>
                <textarea
                  value={formData.objectives}
                  onChange={(e) => handleInputChange('objectives', e.target.value)}
                  placeholder="List the key objectives and expected outcomes"
                  rows={3}
                  className="w-full border border-border rounded-lg px-3 py-2 text-text-primary bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* Team Assignment */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Team Members
                </label>
                <Input
                  type="text"
                  value={formData.team}
                  onChange={(e) => handleInputChange('team', e.target.value)}
                  placeholder="Enter team member names separated by commas"
                  className="w-full"
                />
                <p className="text-xs text-text-secondary mt-1">
                  Separate multiple team members with commas
                </p>
              </div>

              {/* Milestones */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-text-primary">
                    Project Milestones
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    iconName="Plus"
                    onClick={addMilestone}
                    className="text-primary hover:text-primary"
                  >
                    Add Milestone
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {formData.milestones.map((milestone, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="text"
                        value={milestone}
                        onChange={(e) => handleMilestoneChange(index, e.target.value)}
                        placeholder={`Milestone ${index + 1}`}
                        className="flex-1"
                      />
                      {formData.milestones.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          iconName="Trash2"
                          onClick={() => removeMilestone(index)}
                          className="text-error hover:text-error"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-surface-secondary">
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
                loading={isSubmitting}
                iconName="Plus"
              >
                {isSubmitting ? 'Creating Project...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;