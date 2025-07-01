import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const MessageComposer = ({ isOpen, onClose, messageType, selectedRecipients }) => {
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    priority: 'medium',
    scheduleDate: '',
    expiryDate: '',
    attachments: []
  });

  const [activeTab, setActiveTab] = useState('compose');

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSend = () => {
    console.log('Sending message:', formData);
    onClose();
  };

  const handleSchedule = () => {
    console.log('Scheduling message:', formData);
    onClose();
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', formData);
    onClose();
  };

  const getComposerTitle = () => {
    switch (messageType) {
      case 'newsletter':
        return 'Create Newsletter';
      case 'announcement':
        return 'Send Announcement';
      case 'meeting-minutes':
        return 'Meeting Minutes';
      default:
        return 'Compose Message';
    }
  };

  const tabs = [
    { id: 'compose', label: 'Compose', icon: 'Edit3' },
    { id: 'template', label: 'Templates', icon: 'FileText' },
    { id: 'preview', label: 'Preview', icon: 'Eye' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-500 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Icon name="Send" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-text-primary">
                {getComposerTitle()}
              </h2>
              <p className="text-sm text-text-secondary">
                {selectedRecipients.length} recipient groups selected
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            iconSize={20}
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors duration-150 ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary bg-primary-50' :'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-96">
          {activeTab === 'compose' && (
            <div className="space-y-4">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Subject *
                </label>
                <Input
                  type="text"
                  placeholder="Enter message subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  required
                />
              </div>

              {/* Priority & Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full appearance-none bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                {messageType === 'announcement' && (
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Expiry Date
                    </label>
                    <Input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Schedule Send
                  </label>
                  <Input
                    type="datetime-local"
                    value={formData.scheduleDate}
                    onChange={(e) => handleInputChange('scheduleDate', e.target.value)}
                  />
                </div>
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Message Content *
                </label>
                <div className="border border-border rounded-lg">
                  {/* Formatting Toolbar */}
                  <div className="flex items-center space-x-2 p-2 border-b border-border bg-surface-secondary">
                    <Button variant="ghost" size="xs" iconName="Bold" iconSize={16} />
                    <Button variant="ghost" size="xs" iconName="Italic" iconSize={16} />
                    <Button variant="ghost" size="xs" iconName="Underline" iconSize={16} />
                    <div className="w-px h-4 bg-border"></div>
                    <Button variant="ghost" size="xs" iconName="List" iconSize={16} />
                    <Button variant="ghost" size="xs" iconName="Link" iconSize={16} />
                    <Button variant="ghost" size="xs" iconName="Image" iconSize={16} />
                  </div>
                  
                  <textarea
                    placeholder="Write your message here..."
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    rows={8}
                    className="w-full p-3 border-0 resize-none focus:outline-none text-text-primary"
                    required
                  />
                </div>
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Attachments
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                  <Icon name="Upload" size={24} className="text-text-muted mx-auto mb-2" />
                  <p className="text-sm text-text-secondary">
                    Drag and drop files here, or click to browse
                  </p>
                  <Input
                    type="file"
                    multiple
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'template' && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <Icon name="FileText" size={48} className="text-text-muted mx-auto mb-3" />
                <h3 className="text-lg font-medium text-text-primary mb-2">Message Templates</h3>
                <p className="text-text-secondary">Choose from pre-designed templates</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Meeting Reminder', description: 'Standard meeting notification' },
                  { name: 'Event Announcement', description: 'Club event promotion' },
                  { name: 'Newsletter Template', description: 'Monthly newsletter format' },
                  { name: 'Welcome Message', description: 'New member welcome' }
                ].map((template, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 hover:shadow-md cursor-pointer transition-all duration-150">
                    <h4 className="font-medium text-text-primary">{template.name}</h4>
                    <p className="text-sm text-text-secondary mt-1">{template.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="bg-surface-secondary rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-text-primary">Message Preview</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    formData.priority === 'high' ? 'bg-error-100 text-error-700' :
                    formData.priority === 'medium'? 'bg-warning-100 text-warning-700' : 'bg-success-100 text-success-700'
                  }`}>
                    {formData.priority.toUpperCase()} PRIORITY
                  </span>
                </div>
                
                <div className="bg-surface border border-border rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-text-primary mb-2">
                    {formData.subject || 'Subject will appear here'}
                  </h4>
                  <div className="prose prose-sm max-w-none text-text-secondary">
                    {formData.content ? (
                      <div dangerouslySetInnerHTML={{ __html: formData.content.replace(/\n/g, '<br>') }} />
                    ) : (
                      <p className="text-text-muted italic">Message content will appear here</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-surface-secondary">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="Save"
              iconPosition="left"
              onClick={handleSaveDraft}
            >
              Save Draft
            </Button>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            
            {formData.scheduleDate ? (
              <Button
                variant="secondary"
                iconName="Clock"
                iconPosition="left"
                onClick={handleSchedule}
              >
                Schedule Send
              </Button>
            ) : (
              <Button
                variant="primary"
                iconName="Send"
                iconPosition="left"
                onClick={handleSend}
              >
                Send Now
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageComposer;