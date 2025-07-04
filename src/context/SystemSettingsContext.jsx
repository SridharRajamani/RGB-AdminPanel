import React, { createContext, useContext, useState, useEffect } from 'react';

const SystemSettingsContext = createContext();
export const useSystemSettings = () => useContext(SystemSettingsContext);

// Default system settings
const defaultSystemSettings = {
  // General Settings
  organizationName: 'Rotary Club Gulmohar Bangalore',
  timezone: 'Asia/Kolkata',
  dateFormat: 'DD/MM/YYYY',
  currency: 'INR',
  language: 'en',
  
  // Member Settings
  defaultMembershipType: 'Regular',
  memberIdPrefix: 'RC-',
  autoGenerateMemberId: true,
  membershipRenewalReminder: 30,
  
  // Event Settings
  defaultEventDuration: 2,
  eventReminderDays: 7,
  maxEventCapacity: 100,
  allowEventRegistration: true,
  
  // Financial Settings
  fiscalYearStart: 'April',
  defaultPaymentMethod: 'bank_transfer',
  enableMultiCurrency: false,
  taxRate: 18,
  
  // Communication Settings
  emailSignature: 'Best regards,\nRotary Club Gulmohar Bangalore',
  defaultEmailTemplate: 'standard',
  enableSMSNotifications: true,
  enableEmailNotifications: true,
  
  // Data Settings
  dataRetentionPeriod: 7,
  autoBackup: true,
  backupFrequency: 'weekly'
};

export const SystemSettingsProvider = ({ children }) => {
  const [systemSettings, setSystemSettings] = useState(defaultSystemSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load system settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('rotary_system_settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSystemSettings(prev => ({ ...prev, ...parsedSettings }));
      }
    } catch (error) {
      console.error('Error loading system settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save system settings to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('rotary_system_settings', JSON.stringify(systemSettings));
      } catch (error) {
        console.error('Error saving system settings:', error);
      }
    }
  }, [systemSettings, isLoading]);

  // Update a single system setting
  const updateSystemSetting = (key, value) => {
    setSystemSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Update multiple system settings
  const updateSystemSettings = (newSettings) => {
    setSystemSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  // Reset system settings to defaults
  const resetSystemSettings = () => {
    setSystemSettings(defaultSystemSettings);
  };

  // Get formatted date based on system date format
  const formatDate = (date) => {
    const dateObj = new Date(date);
    const format = systemSettings.dateFormat;
    
    switch (format) {
      case 'DD/MM/YYYY':
        return dateObj.toLocaleDateString('en-GB');
      case 'MM/DD/YYYY':
        return dateObj.toLocaleDateString('en-US');
      case 'YYYY-MM-DD':
        return dateObj.toISOString().split('T')[0];
      default:
        return dateObj.toLocaleDateString();
    }
  };

  // Get formatted currency based on system currency
  const formatCurrency = (amount) => {
    const currency = systemSettings.currency;
    const locale = systemSettings.language === 'en' ? 'en-IN' : systemSettings.language;
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Generate member ID based on system settings
  const generateMemberId = (sequence) => {
    if (systemSettings.autoGenerateMemberId) {
      return `${systemSettings.memberIdPrefix}${String(sequence).padStart(3, '0')}`;
    }
    return '';
  };

  // Get organization display name
  const getOrganizationName = () => {
    return systemSettings.organizationName;
  };

  // Check if feature is enabled
  const isFeatureEnabled = (feature) => {
    switch (feature) {
      case 'sms_notifications':
        return systemSettings.enableSMSNotifications;
      case 'email_notifications':
        return systemSettings.enableEmailNotifications;
      case 'event_registration':
        return systemSettings.allowEventRegistration;
      case 'multi_currency':
        return systemSettings.enableMultiCurrency;
      case 'auto_backup':
        return systemSettings.autoBackup;
      default:
        return false;
    }
  };

  const value = {
    systemSettings,
    updateSystemSetting,
    updateSystemSettings,
    resetSystemSettings,
    formatDate,
    formatCurrency,
    generateMemberId,
    getOrganizationName,
    isFeatureEnabled,
    isLoading
  };

  return (
    <SystemSettingsContext.Provider value={value}>
      {children}
    </SystemSettingsContext.Provider>
  );
};
