import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useNotifications } from '../../../context/NotificationContext';
import { useSystemSettings } from '../../../context/SystemSettingsContext';
import notificationService from '../../../services/NotificationService';

const NotificationSettings = () => {
  const {
    notificationSettings,
    updateNotificationSetting,
    updateNotificationSettings,
    resetNotificationSettings,
    isNotificationEnabled,
    addNotification
  } = useNotifications();

  const { isFeatureEnabled } = useSystemSettings();
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testingNotification, setTestingNotification] = useState(null);

  // Track changes
  useEffect(() => {
    setHasChanges(false);
  }, [notificationSettings]);

  const handleSettingChange = (key, value) => {
    updateNotificationSetting(key, value);
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Settings are automatically saved via context
      // You could add API call here to sync with backend
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      setHasChanges(false);

      // Show success notification
      notificationService.showBrowserNotification(
        'Settings Saved',
        'Notification settings have been updated successfully'
      );
    } catch (error) {
      console.error('Error saving settings:', error);
      notificationService.showBrowserNotification(
        'Save Failed',
        'Failed to save notification settings. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestNotification = async (type) => {
    setTestingNotification(type);
    try {
      let result;
      switch (type) {
        case 'email':
          result = await notificationService.sendTestEmail();
          break;
        case 'sms':
          result = await notificationService.sendTestSMS();
          break;
        case 'push':
          result = await notificationService.sendTestPush();
          break;
        default:
          throw new Error('Unknown notification type');
      }

      if (result.success) {
        // Add a test notification to the notification center
        addNotification({
          type: 'notification',
          title: `${type.toUpperCase()} Test Successful`,
          message: `Test ${type} notification was sent successfully at ${new Date().toLocaleTimeString()}`,
          priority: 'low',
          category: 'system',
          actionRequired: false
        });

        notificationService.showBrowserNotification(
          'Test Successful',
          `Test ${type} notification sent successfully!`
        );
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error(`Test ${type} notification failed:`, error);
      notificationService.showBrowserNotification(
        'Test Failed',
        `Failed to send test ${type} notification: ${error.message}`
      );
    } finally {
      setTestingNotification(null);
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all notification settings to defaults?')) {
      resetNotificationSettings();
      setHasChanges(false);
      notificationService.showBrowserNotification(
        'Settings Reset',
        'Notification settings have been reset to defaults'
      );
    }
  };

  const weekDays = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  const NotificationToggle = ({ id, label, description, checked, onChange, disabled = false }) => (
    <div className="flex items-start justify-between py-3">
      <div className="flex-1">
        <label htmlFor={id} className="text-sm font-medium text-text-primary cursor-pointer">
          {label}
        </label>
        {description && (
          <p className="text-xs text-text-muted mt-1">{description}</p>
        )}
      </div>
      <div className="ml-4">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20 disabled:opacity-50"
        />
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-text-primary">
            Notification Settings
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Manage how and when you receive notifications
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            iconName="RotateCcw"
            onClick={handleResetSettings}
          >
            Reset to Defaults
          </Button>
          <Button
            variant="primary"
            size="sm"
            iconName="Save"
            iconPosition="left"
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            loading={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Email Notifications */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-text-primary flex items-center">
              <Icon name="Mail" size={20} className="mr-2 text-primary" />
              Email Notifications
            </h3>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                iconName="Send"
                onClick={() => handleTestNotification('email')}
                disabled={testingNotification === 'email' || !isFeatureEnabled('email_notifications')}
                loading={testingNotification === 'email'}
              >
                {testingNotification === 'email' ? 'Testing...' : 'Test Email'}
              </Button>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="emailEnabled"
                  checked={notificationSettings.emailEnabled}
                  onChange={(e) => handleSettingChange('emailEnabled', e.target.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
                  disabled={!isFeatureEnabled('email_notifications')}
                />
                <label htmlFor="emailEnabled" className="text-sm font-medium text-text-primary">
                  Enable Email Notifications
                </label>
              </div>
            </div>
          </div>
          
          <div className="bg-surface-hover rounded-lg p-4 space-y-1">
            <NotificationToggle
              id="emailNewMember"
              label="New Member Registration"
              description="Get notified when a new member joins the club"
              checked={notificationSettings.emailNewMember}
              onChange={(value) => handleSettingChange('emailNewMember', value)}
              disabled={!notificationSettings.emailEnabled}
            />
            <NotificationToggle
              id="emailEventReminder"
              label="Event Reminders"
              description="Receive reminders about upcoming events"
              checked={notificationSettings.emailEventReminder}
              onChange={(value) => handleSettingChange('emailEventReminder', value)}
              disabled={!notificationSettings.emailEnabled}
            />
            <NotificationToggle
              id="emailEventUpdate"
              label="Event Updates"
              description="Get notified about changes to event details"
              checked={notificationSettings.emailEventUpdate}
              onChange={(value) => handleSettingChange('emailEventUpdate', value)}
              disabled={!notificationSettings.emailEnabled}
            />
            <NotificationToggle
              id="emailDonationReceived"
              label="Donation Received"
              description="Notifications when donations are received"
              checked={notificationSettings.emailDonationReceived}
              onChange={(value) => handleSettingChange('emailDonationReceived', value)}
              disabled={!notificationSettings.emailEnabled}
            />
            <NotificationToggle
              id="emailMembershipRenewal"
              label="Membership Renewal"
              description="Reminders about membership renewals"
              checked={notificationSettings.emailMembershipRenewal}
              onChange={(value) => handleSettingChange('emailMembershipRenewal', value)}
              disabled={!notificationSettings.emailEnabled}
            />
            <NotificationToggle
              id="emailWeeklyDigest"
              label="Weekly Digest"
              description="Summary of weekly activities and updates"
              checked={notificationSettings.emailWeeklyDigest}
              onChange={(value) => handleSettingChange('emailWeeklyDigest', value)}
              disabled={!notificationSettings.emailEnabled}
            />
            <NotificationToggle
              id="emailMonthlyReport"
              label="Monthly Report"
              description="Comprehensive monthly activity report"
              checked={notificationSettings.emailMonthlyReport}
              onChange={(value) => handleSettingChange('emailMonthlyReport', value)}
              disabled={!notificationSettings.emailEnabled}
            />
            <NotificationToggle
              id="emailSystemUpdates"
              label="System Updates"
              description="Technical updates and maintenance notifications"
              checked={notificationSettings.emailSystemUpdates}
              onChange={(value) => handleSettingChange('emailSystemUpdates', value)}
              disabled={!notificationSettings.emailEnabled}
            />
          </div>
        </div>

        {/* SMS Notifications */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-text-primary flex items-center">
              <Icon name="MessageSquare" size={20} className="mr-2 text-primary" />
              SMS Notifications
            </h3>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                iconName="Send"
                onClick={() => handleTestNotification('sms')}
                disabled={testingNotification === 'sms' || !isFeatureEnabled('sms_notifications')}
                loading={testingNotification === 'sms'}
              >
                {testingNotification === 'sms' ? 'Testing...' : 'Test SMS'}
              </Button>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="smsEnabled"
                  checked={notificationSettings.smsEnabled}
                  onChange={(e) => handleSettingChange('smsEnabled', e.target.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
                  disabled={!isFeatureEnabled('sms_notifications')}
                />
                <label htmlFor="smsEnabled" className="text-sm font-medium text-text-primary">
                  Enable SMS Notifications
                </label>
              </div>
            </div>
          </div>
          
          <div className="bg-surface-hover rounded-lg p-4 space-y-1">
            <NotificationToggle
              id="smsEventReminder"
              label="Event Reminders"
              description="SMS reminders for upcoming events"
              checked={notificationSettings.smsEventReminder}
              onChange={(value) => handleSettingChange('smsEventReminder', value)}
              disabled={!notificationSettings.smsEnabled}
            />
            <NotificationToggle
              id="smsUrgentUpdates"
              label="Urgent Updates"
              description="Critical announcements and emergency notifications"
              checked={notificationSettings.smsUrgentUpdates}
              onChange={(value) => handleSettingChange('smsUrgentUpdates', value)}
              disabled={!notificationSettings.smsEnabled}
            />
            <NotificationToggle
              id="smsMembershipRenewal"
              label="Membership Renewal"
              description="SMS reminders for membership renewals"
              checked={notificationSettings.smsMembershipRenewal}
              onChange={(value) => handleSettingChange('smsMembershipRenewal', value)}
              disabled={!notificationSettings.smsEnabled}
            />
          </div>
        </div>

        {/* Push Notifications */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-text-primary flex items-center">
              <Icon name="Bell" size={20} className="mr-2 text-primary" />
              Push Notifications
            </h3>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                iconName="Send"
                onClick={() => handleTestNotification('push')}
                disabled={testingNotification === 'push'}
                loading={testingNotification === 'push'}
              >
                {testingNotification === 'push' ? 'Testing...' : 'Test Push'}
              </Button>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="pushEnabled"
                  checked={notificationSettings.pushEnabled}
                  onChange={(e) => handleSettingChange('pushEnabled', e.target.checked)}
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
                />
                <label htmlFor="pushEnabled" className="text-sm font-medium text-text-primary">
                  Enable Push Notifications
                </label>
              </div>
            </div>
          </div>
          
          <div className="bg-surface-hover rounded-lg p-4 space-y-1">
            <NotificationToggle
              id="pushNewMessage"
              label="New Messages"
              description="Instant notifications for new messages"
              checked={notificationSettings.pushNewMessage}
              onChange={(value) => handleSettingChange('pushNewMessage', value)}
              disabled={!notificationSettings.pushEnabled}
            />
            <NotificationToggle
              id="pushEventReminder"
              label="Event Reminders"
              description="Push notifications for upcoming events"
              checked={notificationSettings.pushEventReminder}
              onChange={(value) => handleSettingChange('pushEventReminder', value)}
              disabled={!notificationSettings.pushEnabled}
            />
            <NotificationToggle
              id="pushSystemAlert"
              label="System Alerts"
              description="Important system notifications and alerts"
              checked={notificationSettings.pushSystemAlert}
              onChange={(value) => handleSettingChange('pushSystemAlert', value)}
              disabled={!notificationSettings.pushEnabled}
            />
          </div>
        </div>

        {/* Notification Timing */}
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="Clock" size={20} className="mr-2 text-primary" />
            Notification Timing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Event Reminder (days before)
              </label>
              <input
                type="number"
                value={notificationSettings.eventReminderDays}
                onChange={(e) => handleSettingChange('eventReminderDays', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                min="1"
                max="30"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Membership Renewal Reminder (days before)
              </label>
              <input
                type="number"
                value={notificationSettings.membershipReminderDays}
                onChange={(e) => handleSettingChange('membershipReminderDays', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                min="1"
                max="365"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Weekly Digest Day
              </label>
              <select
                value={notificationSettings.digestDay}
                onChange={(e) => handleSettingChange('digestDay', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {weekDays.map(day => (
                  <option key={day.value} value={day.value}>{day.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Digest Time
              </label>
              <input
                type="time"
                value={notificationSettings.digestTime}
                onChange={(e) => handleSettingChange('digestTime', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Quiet Hours */}
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="Moon" size={20} className="mr-2 text-primary" />
            Quiet Hours
          </h3>
          <div className="bg-surface-hover rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-text-primary">Enable Quiet Hours</p>
                <p className="text-xs text-text-muted mt-1">
                  Suppress non-urgent notifications during specified hours
                </p>
              </div>
              <input
                type="checkbox"
                id="quietHoursEnabled"
                checked={notificationSettings.quietHoursEnabled}
                onChange={(e) => handleSettingChange('quietHoursEnabled', e.target.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
              />
            </div>

            {notificationSettings.quietHoursEnabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={notificationSettings.quietHoursStart}
                    onChange={(e) => handleSettingChange('quietHoursStart', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={notificationSettings.quietHoursEnd}
                    onChange={(e) => handleSettingChange('quietHoursEnd', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
