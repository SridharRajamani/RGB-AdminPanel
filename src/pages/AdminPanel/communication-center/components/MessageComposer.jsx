import React, { useState } from 'react';
import Icon from '../../../../components/AppIcon';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import useCoolAlert from '../../../../hooks/useCoolAlert';
import SocialMediaShare from './SocialMediaShare';

const MessageComposer = ({ isOpen, onClose, messageType, selectedRecipients }) => {
  const alert = useCoolAlert();

  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    priority: 'medium',
    scheduleDate: '',
    expiryDate: '',
    attachments: []
  });

  const [activeTab, setActiveTab] = useState('compose');
  const [dragOver, setDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // File handling functions
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });

    const newAttachments = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }));
  };

  const removeAttachment = (attachmentId) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(att => att.id !== attachmentId)
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return 'Image';
    if (fileType.startsWith('video/')) return 'Video';
    if (fileType.startsWith('audio/')) return 'Music';
    if (fileType.includes('pdf')) return 'FileText';
    if (fileType.includes('word') || fileType.includes('document')) return 'FileText';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'FileSpreadsheet';
    return 'File';
  };

  const handleSend = async () => {
    // Basic validation
    if (!formData.subject || !formData.content) {
      alert.error(
        '❌ Validation Error',
        'Please fill in both subject and message content.',
        { animation: 'shake' }
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Show loading alert
      const loadingAlert = alert.info(
        '📧 Sending Message...',
        'Please wait while we send your message.',
        {
          autoClose: false,
          animation: 'fade'
        }
      );

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Sending message:', formData);

      // Close loading alert
      loadingAlert();

      // Show success alert
      alert.celebration(
        '🎉 Message Sent!',
        `Your message "${formData.subject}" has been sent successfully!`,
        {
          animation: 'bounce',
          gradient: true,
          sound: true,
          autoClose: true,
          autoCloseDelay: 3000
        }
      );

      onClose();

    } catch (error) {
      alert.urgent(
        '🚨 Send Failed',
        error.message || 'An error occurred while sending the message. Please try again.',
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

  const handleSchedule = async () => {
    // Basic validation
    if (!formData.subject || !formData.content || !formData.scheduleDate) {
      alert.error(
        '❌ Validation Error',
        'Please fill in subject, content, and schedule date.',
        { animation: 'shake' }
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Show loading alert
      const loadingAlert = alert.info(
        '⏰ Scheduling Message...',
        'Please wait while we schedule your message.',
        {
          autoClose: false,
          animation: 'fade'
        }
      );

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Scheduling message:', formData);

      // Close loading alert
      loadingAlert();

      // Show success alert
      alert.success(
        '📅 Message Scheduled!',
        `Your message has been scheduled for ${new Date(formData.scheduleDate).toLocaleDateString()}.`,
        {
          animation: 'slide',
          sound: true,
          autoClose: true,
          autoCloseDelay: 3000
        }
      );

      onClose();

    } catch (error) {
      alert.urgent(
        '🚨 Schedule Failed',
        error.message || 'An error occurred while scheduling the message. Please try again.',
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

  const handleSaveDraft = async () => {
    setIsSubmitting(true);

    try {
      // Show loading alert
      const loadingAlert = alert.info(
        '💾 Saving Draft...',
        'Please wait while we save your draft.',
        {
          autoClose: false,
          animation: 'fade'
        }
      );

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 800));

      console.log('Saving draft:', formData);

      // Close loading alert
      loadingAlert();

      // Show success alert
      alert.notification(
        '✅ Draft Saved!',
        'Your message has been saved as a draft.',
        {
          animation: 'slide',
          autoClose: true,
          autoCloseDelay: 2000
        }
      );

      onClose();

    } catch (error) {
      alert.error(
        '🚨 Save Failed',
        error.message || 'An error occurred while saving the draft. Please try again.',
        {
          animation: 'shake',
          sound: true
        }
      );
    } finally {
      setIsSubmitting(false);
    }
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
    { id: 'preview', label: 'Preview', icon: 'Eye' },
    { id: 'social', label: 'Social Share', icon: 'Share' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-start sm:items-center justify-center p-1 sm:p-4 pt-16 sm:pt-4">
      <div className="bg-surface rounded-lg sm:rounded-xl shadow-2xl w-full max-w-sm sm:max-w-4xl max-h-[calc(100vh-4rem)] sm:max-h-[90vh] overflow-hidden m-1 sm:m-0">
        {/* Header */}
        <div className="flex items-center justify-between p-2 sm:p-4 border-b border-border">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="Send" size={16} color="white" className="sm:hidden" />
              <Icon name="Send" size={20} color="white" className="hidden sm:block" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm sm:text-xl font-heading font-semibold text-text-primary truncate">
                {getComposerTitle()}
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary hidden sm:block">
                {selectedRecipients.length} recipient groups selected
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            iconSize={16}
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary p-1 sm:p-2 flex-shrink-0"
          />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors duration-150 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary bg-primary-50' :'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
              }`}
            >
              <Icon name={tab.icon} size={14} className="sm:hidden" />
              <Icon name={tab.icon} size={16} className="hidden sm:block" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden text-xs">{tab.label.charAt(0)}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-2 sm:p-4 overflow-y-auto max-h-[60vh] sm:max-h-96">
          {activeTab === 'compose' && (
            <div className="space-y-3 sm:space-y-4">
              {/* Subject */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-text-primary mb-1 sm:mb-2">
                  Subject *
                </label>
                <Input
                  type="text"
                  placeholder="Enter message subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  required
                  className="text-sm"
                />
              </div>

              {/* Priority & Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-primary mb-1 sm:mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full appearance-none bg-surface border border-border rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                {messageType === 'announcement' && (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-text-primary mb-1 sm:mb-2">
                      Expiry Date
                    </label>
                    <Input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-text-primary mb-1 sm:mb-2">
                    Schedule Send
                  </label>
                  <Input
                    type="datetime-local"
                    value={formData.scheduleDate}
                    onChange={(e) => handleInputChange('scheduleDate', e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-text-primary mb-1 sm:mb-2">
                  Message Content *
                </label>
                <div className="border border-border rounded-lg">
                  {/* Formatting Toolbar */}
                  <div className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-2 border-b border-border bg-surface-secondary overflow-x-auto">
                    <Button variant="ghost" size="xs" iconName="Bold" iconSize={14} className="sm:hidden" />
                    <Button variant="ghost" size="xs" iconName="Italic" iconSize={14} className="sm:hidden" />
                    <Button variant="ghost" size="xs" iconName="Underline" iconSize={14} className="sm:hidden" />
                    <Button variant="ghost" size="xs" iconName="Bold" iconSize={16} className="hidden sm:inline-flex" />
                    <Button variant="ghost" size="xs" iconName="Italic" iconSize={16} className="hidden sm:inline-flex" />
                    <Button variant="ghost" size="xs" iconName="Underline" iconSize={16} className="hidden sm:inline-flex" />
                    <div className="w-px h-3 sm:h-4 bg-border"></div>
                    <Button variant="ghost" size="xs" iconName="List" iconSize={14} className="sm:hidden" />
                    <Button variant="ghost" size="xs" iconName="Link" iconSize={14} className="sm:hidden" />
                    <Button variant="ghost" size="xs" iconName="Image" iconSize={14} className="sm:hidden" />
                    <Button variant="ghost" size="xs" iconName="List" iconSize={16} className="hidden sm:inline-flex" />
                    <Button variant="ghost" size="xs" iconName="Link" iconSize={16} className="hidden sm:inline-flex" />
                    <Button variant="ghost" size="xs" iconName="Image" iconSize={16} className="hidden sm:inline-flex" />
                  </div>

                  <textarea
                    placeholder="Write your message here..."
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    rows={6}
                    className="w-full p-2 sm:p-3 border-0 resize-none focus:outline-none text-text-primary text-sm"
                    required
                  />
                </div>
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-text-primary mb-1 sm:mb-2">
                  Attachments
                  <span className="text-xs text-text-muted ml-1 sm:ml-2 hidden sm:inline">(Max 10MB per file)</span>
                </label>

                {/* File Drop Zone */}
                <div
                  className={`border-2 border-dashed rounded-lg p-3 sm:p-6 text-center transition-colors ${
                    dragOver
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-input').click()}
                >
                  <Icon name="Upload" size={24} className={`mx-auto mb-2 sm:mb-3 ${dragOver ? 'text-primary' : 'text-text-muted'} sm:hidden`} />
                  <Icon name="Upload" size={32} className={`mx-auto mb-3 ${dragOver ? 'text-primary' : 'text-text-muted'} hidden sm:block`} />
                  <p className="text-xs sm:text-sm font-medium text-text-primary mb-1">
                    {dragOver ? 'Drop files here' : (
                      <>
                        <span className="sm:hidden">Tap to browse files</span>
                        <span className="hidden sm:inline">Drag and drop files here, or click to browse</span>
                      </>
                    )}
                  </p>
                  <p className="text-xs text-text-muted hidden sm:block">
                    Supports: Images, Videos, Documents, PDFs (Max 10MB each)
                  </p>
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    className="hidden"
                    accept="image/*,video/*,.pdf,.doc,.docx,.txt,.zip,.rar"
                    onChange={handleFileSelect}
                  />
                </div>

                {/* Attached Files List */}
                {formData.attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium text-text-primary">
                      Attached Files ({formData.attachments.length})
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {formData.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center space-x-3 p-3 bg-surface-secondary rounded-lg border border-border"
                        >
                          {/* File Preview/Icon */}
                          <div className="flex-shrink-0">
                            {attachment.preview ? (
                              <img
                                src={attachment.preview}
                                alt={attachment.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                                <Icon
                                  name={getFileIcon(attachment.type)}
                                  size={20}
                                  className="text-primary"
                                />
                              </div>
                            )}
                          </div>

                          {/* File Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary truncate">
                              {attachment.name}
                            </p>
                            <p className="text-xs text-text-muted">
                              {formatFileSize(attachment.size)} • {attachment.type.split('/')[0]}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(attachment.id)}
                            className="text-error hover:text-error hover:bg-error/10"
                            iconName="X"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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

                  {/* Attachments Preview */}
                  {formData.attachments.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <h5 className="text-sm font-medium text-text-primary mb-3">
                        Attachments ({formData.attachments.length})
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {formData.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="bg-surface-secondary rounded-lg p-3 border border-border"
                          >
                            {/* Image/Video Preview */}
                            {attachment.preview ? (
                              <div className="mb-2">
                                {attachment.type.startsWith('image/') ? (
                                  <img
                                    src={attachment.preview}
                                    alt={attachment.name}
                                    className="w-full h-20 object-cover rounded"
                                  />
                                ) : attachment.type.startsWith('video/') ? (
                                  <video
                                    src={attachment.preview}
                                    className="w-full h-20 object-cover rounded"
                                    controls={false}
                                  />
                                ) : null}
                              </div>
                            ) : (
                              <div className="mb-2 h-20 bg-primary/10 rounded flex items-center justify-center">
                                <Icon
                                  name={getFileIcon(attachment.type)}
                                  size={24}
                                  className="text-primary"
                                />
                              </div>
                            )}

                            {/* File Info */}
                            <div className="text-center">
                              <p className="text-xs font-medium text-text-primary truncate">
                                {attachment.name}
                              </p>
                              <p className="text-xs text-text-muted">
                                {formatFileSize(attachment.size)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-3 sm:space-y-4">
              <div className="text-center mb-3 sm:mb-4">
                <h3 className="text-sm sm:text-lg font-semibold text-text-primary mb-1 sm:mb-2">Share to Social Media</h3>
                <p className="text-xs sm:text-sm text-text-secondary">Share your message across social media platforms</p>
              </div>
              <SocialMediaShare
                content={formData.content}
                subject={formData.subject}
                attachments={formData.attachments}
                onShare={(platform, shareContent) => {
                  console.log(`Shared to ${platform}:`, shareContent);
                  // You can add analytics tracking here
                }}
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-2 sm:p-4 border-t border-border bg-surface-secondary space-y-2 sm:space-y-0">
          <div className="flex items-center justify-center sm:justify-start">
            <Button
              variant="ghost"
              size="sm"
              iconName={isSubmitting ? "Loader" : "Save"}
              iconPosition="left"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className={`text-xs sm:text-sm ${isSubmitting ? "animate-pulse" : ""}`}
            >
              <span className="hidden sm:inline">{isSubmitting ? "Saving..." : "Save Draft"}</span>
              <span className="sm:hidden">{isSubmitting ? "Saving..." : "Save"}</span>
            </Button>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              size="sm"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none text-xs sm:text-sm"
            >
              Cancel
            </Button>

            {formData.scheduleDate ? (
              <Button
                variant="secondary"
                iconName={isSubmitting ? "Loader" : "Clock"}
                iconPosition="left"
                onClick={handleSchedule}
                size="sm"
                disabled={isSubmitting}
                className={`flex-1 sm:flex-none text-xs sm:text-sm ${isSubmitting ? "animate-pulse" : ""}`}
              >
                <span className="hidden sm:inline">{isSubmitting ? "Scheduling..." : "Schedule Send"}</span>
                <span className="sm:hidden">{isSubmitting ? "Scheduling..." : "Schedule"}</span>
              </Button>
            ) : (
              <Button
                variant="primary"
                iconName={isSubmitting ? "Loader" : "Send"}
                iconPosition="left"
                onClick={handleSend}
                size="sm"
                disabled={isSubmitting}
                className={`flex-1 sm:flex-none text-xs sm:text-sm ${isSubmitting ? "animate-pulse" : ""}`}
              >
                <span className="hidden sm:inline">{isSubmitting ? "Sending..." : "Send Now"}</span>
                <span className="sm:hidden">{isSubmitting ? "Sending..." : "Send"}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageComposer;