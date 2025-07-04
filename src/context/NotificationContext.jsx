import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSystemSettings } from './SystemSettingsContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Default notification settings
const defaultNotificationSettings = {
  // Email Notifications
  emailEnabled: true,
  emailNewMember: true,
  emailEventReminder: true,
  emailEventUpdate: true,
  emailDonationReceived: true,
  emailMembershipRenewal: true,
  emailSystemUpdates: false,
  emailWeeklyDigest: true,
  emailMonthlyReport: true,
  
  // SMS Notifications
  smsEnabled: true,
  smsEventReminder: true,
  smsUrgentUpdates: true,
  smsMembershipRenewal: false,
  
  // Push Notifications
  pushEnabled: true,
  pushNewMessage: true,
  pushEventReminder: true,
  pushSystemAlert: true,
  
  // Notification Timing
  eventReminderDays: 3,
  membershipReminderDays: 30,
  digestDay: 'monday',
  digestTime: '09:00',
  
  // Communication Preferences
  preferredChannel: 'email',
  quietHoursEnabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  
  // Advanced Settings
  batchNotifications: true,
  notificationSound: true,
  desktopNotifications: true,
  mobileNotifications: true
};

export const NotificationProvider = ({ children }) => {
  const [notificationSettings, setNotificationSettings] = useState(defaultNotificationSettings);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { systemSettings, isFeatureEnabled } = useSystemSettings();

  // Load notification settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('notification_settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setNotificationSettings(prev => ({ ...prev, ...parsedSettings }));
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    }
  }, []);

  // Save notification settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notification_settings', JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  // Update notification setting
  const updateNotificationSetting = (key, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Update multiple notification settings
  const updateNotificationSettings = (newSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  // Reset notification settings to defaults
  const resetNotificationSettings = () => {
    setNotificationSettings(defaultNotificationSettings);
    localStorage.removeItem('notification_settings');
  };

  // Check if notification type is enabled
  const isNotificationEnabled = (type) => {
    switch (type) {
      case 'email':
        return notificationSettings.emailEnabled && isFeatureEnabled('email_notifications');
      case 'sms':
        return notificationSettings.smsEnabled && isFeatureEnabled('sms_notifications');
      case 'push':
        return notificationSettings.pushEnabled;
      default:
        return false;
    }
  };

  // Check if specific notification is enabled
  const isSpecificNotificationEnabled = (notificationType) => {
    return notificationSettings[notificationType] || false;
  };

  // Check if we're in quiet hours
  const isInQuietHours = () => {
    if (!notificationSettings.quietHoursEnabled) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = notificationSettings.quietHoursStart.split(':').map(Number);
    const [endHour, endMin] = notificationSettings.quietHoursEnd.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    
    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Quiet hours span midnight
      return currentTime >= startTime || currentTime <= endTime;
    }
  };

  // Add notification to the list
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    return newNotification.id;
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Remove notification
  const removeNotification = (notificationId) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Get unread notifications count
  const getUnreadCount = () => {
    return notifications.filter(notification => !notification.read).length;
  };

  // Get notifications by type
  const getNotificationsByType = (type) => {
    return notifications.filter(notification => notification.type === type);
  };

  // Get recent notifications (last 24 hours)
  const getRecentNotifications = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    return notifications.filter(notification => 
      new Date(notification.timestamp) > yesterday
    );
  };

  const value = {
    // Settings
    notificationSettings,
    updateNotificationSetting,
    updateNotificationSettings,
    resetNotificationSettings,
    
    // Notifications
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    
    // Utilities
    isNotificationEnabled,
    isSpecificNotificationEnabled,
    isInQuietHours,
    getUnreadCount,
    getNotificationsByType,
    getRecentNotifications,
    
    // State
    isLoading
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
