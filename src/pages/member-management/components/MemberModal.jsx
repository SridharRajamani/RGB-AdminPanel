import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const MemberModal = ({ 
  member, 
  isOpen, 
  onClose, 
  mode, // 'view', 'edit', 'add'
  onSave 
}) => {
  const [formData, setFormData] = useState(member || {
    name: '',
    email: '',
    phone: '',
    membershipId: '',
    membershipType: 'Regular',
    status: 'active',
    designation: '',
    committee: '',
    joinDate: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    profession: '',
    company: '',
    skills: '',
    interests: ''
  });

  const [activeTab, setActiveTab] = useState('basic');

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isAddMode = mode === 'add';

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: 'User' },
    { id: 'contact', label: 'Contact', icon: 'Phone' },
    { id: 'membership', label: 'Membership', icon: 'Badge' },
    { id: 'additional', label: 'Additional', icon: 'FileText' }
  ];

  const membershipTypes = [
    'Regular', 'Honorary', 'Corporate', 'Associate'
  ];

  const statusOptions = [
    'active', 'inactive', 'pending', 'suspended'
  ];

  const committees = [
    'Community Service', 'Youth Service', 'International Service', 
    'Vocational Service', 'Club Service', 'Fundraising', 'Public Relations'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-500 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            {!isAddMode && (
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-white">
                  {formData.name ? formData.name.split(' ').map(n => n[0]).join('').substring(0, 2) : 'NA'}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-xl font-heading font-semibold text-text-primary">
                {isAddMode ? 'Add New Member' : isEditMode ? 'Edit Member' : 'Member Profile'}
              </h2>
              {!isAddMode && (
                <p className="text-sm text-text-secondary">
                  {formData.membershipId} • {formData.membershipType}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isViewMode && (
              <Button
                variant="outline"
                size="sm"
                iconName="Edit"
                iconPosition="left"
                onClick={() => {/* Switch to edit mode */}}
                className="text-text-secondary hover:text-primary border-border hover:border-primary"
              >
                Edit
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              iconSize={20}
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary"
            />
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex flex-col lg:flex-row h-full max-h-[calc(90vh-80px)]">
          {/* Tabs Navigation */}
          <div className="lg:w-64 border-b lg:border-b-0 lg:border-r border-border bg-surface-secondary">
            <div className="p-4">
              <nav className="space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                    }`}
                  >
                    <Icon 
                      name={tab.icon} 
                      size={18} 
                      className={activeTab === tab.id ? 'text-primary-foreground' : 'text-text-muted'}
                    />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter full name"
                        disabled={isViewMode}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Designation
                      </label>
                      <Input
                        type="text"
                        value={formData.designation}
                        onChange={(e) => handleInputChange('designation', e.target.value)}
                        placeholder="e.g., President, Secretary"
                        disabled={isViewMode}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Profession
                      </label>
                      <Input
                        type="text"
                        value={formData.profession}
                        onChange={(e) => handleInputChange('profession', e.target.value)}
                        placeholder="Enter profession"
                        disabled={isViewMode}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Company/Organization
                      </label>
                      <Input
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="Enter company name"
                        disabled={isViewMode}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Skills & Expertise
                    </label>
                    <textarea
                      value={formData.skills}
                      onChange={(e) => handleInputChange('skills', e.target.value)}
                      placeholder="List skills and areas of expertise"
                      disabled={isViewMode}
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              )}

              {/* Contact Tab */}
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter email address"
                        disabled={isViewMode}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Phone Number *
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter phone number"
                        disabled={isViewMode}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Emergency Contact Name
                      </label>
                      <Input
                        type="text"
                        value={formData.emergencyContact}
                        onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                        placeholder="Enter emergency contact name"
                        disabled={isViewMode}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Emergency Contact Phone
                      </label>
                      <Input
                        type="tel"
                        value={formData.emergencyPhone}
                        onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                        placeholder="Enter emergency contact phone"
                        disabled={isViewMode}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Address
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter complete address"
                      disabled={isViewMode}
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              )}

              {/* Membership Tab */}
              {activeTab === 'membership' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Membership ID *
                      </label>
                      <Input
                        type="text"
                        value={formData.membershipId}
                        onChange={(e) => handleInputChange('membershipId', e.target.value)}
                        placeholder="Enter membership ID"
                        disabled={isViewMode}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Membership Type *
                      </label>
                      <select
                        value={formData.membershipType}
                        onChange={(e) => handleInputChange('membershipType', e.target.value)}
                        disabled={isViewMode}
                        className="w-full px-3 py-2 border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {membershipTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Status *
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        disabled={isViewMode}
                        className="w-full px-3 py-2 border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Join Date *
                      </label>
                      <Input
                        type="date"
                        value={formData.joinDate}
                        onChange={(e) => handleInputChange('joinDate', e.target.value)}
                        disabled={isViewMode}
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Committee Assignment
                      </label>
                      <select
                        value={formData.committee}
                        onChange={(e) => handleInputChange('committee', e.target.value)}
                        disabled={isViewMode}
                        className="w-full px-3 py-2 border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">Select Committee</option>
                        {committees.map(committee => (
                          <option key={committee} value={committee}>{committee}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Tab */}
              {activeTab === 'additional' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Interests & Hobbies
                    </label>
                    <textarea
                      value={formData.interests}
                      onChange={(e) => handleInputChange('interests', e.target.value)}
                      placeholder="List interests and hobbies"
                      disabled={isViewMode}
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-md bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  
                  {!isAddMode && (
                    <div className="bg-surface-secondary rounded-lg p-4">
                      <h4 className="text-sm font-medium text-text-primary mb-3">
                        Activity Summary
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-text-secondary">Meetings Attended:</span>
                          <span className="ml-2 font-medium text-text-primary">24/28</span>
                        </div>
                        <div>
                          <span className="text-text-secondary">Projects Participated:</span>
                          <span className="ml-2 font-medium text-text-primary">8</span>
                        </div>
                        <div>
                          <span className="text-text-secondary">Last Activity:</span>
                          <span className="ml-2 font-medium text-text-primary">2 days ago</span>
                        </div>
                        <div>
                          <span className="text-text-secondary">Member Since:</span>
                          <span className="ml-2 font-medium text-text-primary">2 years</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        {!isViewMode && (
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-surface-secondary">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary"
            >
              Cancel
            </Button>
            
            <Button
              variant="primary"
              onClick={handleSave}
              iconName="Save"
              iconPosition="left"
            >
              {isAddMode ? 'Add Member' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberModal;