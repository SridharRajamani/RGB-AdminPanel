import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useSystemSettings } from '../../../context/SystemSettingsContext';
import { useTranslation } from 'react-i18next';
import { AVAILABLE_LANGUAGES } from '../../../context/LanguageContext';

const SystemSettings = () => {
  const { systemSettings, updateSystemSetting, updateSystemSettings, resetSystemSettings } = useSystemSettings();
  const { t } = useTranslation();
  const [hasChanges, setHasChanges] = useState(false);
  const [localSettings, setLocalSettings] = useState(systemSettings);

  // Update local settings when system settings change
  React.useEffect(() => {
    setLocalSettings(systemSettings);
  }, [systemSettings]);

  const handleSettingChange = (key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateSystemSettings(localSettings);
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalSettings(systemSettings);
    setHasChanges(false);
  };

  const timezones = [
    { value: 'Asia/Kolkata', label: 'India Standard Time (IST)' },
    { value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' }
  ];

  const dateFormats = [
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
    { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY' }
  ];

  const currencies = [
    { value: 'INR', label: 'Indian Rupee (₹)' },
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' }
  ];

  const languages = AVAILABLE_LANGUAGES.map(lang => ({
    value: lang.code,
    label: `${lang.name} (${lang.nativeName})`
  }));

  const membershipTypes = [
    { value: 'Regular', label: 'Regular Member' },
    { value: 'Honorary', label: 'Honorary Member' },
    { value: 'Corporate', label: 'Corporate Member' },
    { value: 'Associate', label: 'Associate Member' }
  ];

  const fiscalYearOptions = [
    { value: 'January', label: 'January' },
    { value: 'April', label: 'April' },
    { value: 'July', label: 'July' },
    { value: 'October', label: 'October' }
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-text-primary">
            System Settings
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Configure application defaults and system-wide preferences
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={!hasChanges}
          >
            Reset
          </Button>
          <Button
            variant="primary"
            size="sm"
            iconName="Save"
            iconPosition="left"
            onClick={handleSave}
            disabled={!hasChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* General Settings */}
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="Settings" size={20} className="mr-2 text-primary" />
            General Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Organization Name
              </label>
              <input
                type="text"
                value={localSettings.organizationName}
                onChange={(e) => handleSettingChange('organizationName', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Timezone
              </label>
              <select
                value={localSettings.timezone}
                onChange={(e) => handleSettingChange('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {timezones.map(tz => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Date Format
              </label>
              <select
                value={localSettings.dateFormat}
                onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {dateFormats.map(format => (
                  <option key={format.value} value={format.value}>{format.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Currency
              </label>
              <select
                value={localSettings.currency}
                onChange={(e) => handleSettingChange('currency', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {currencies.map(currency => (
                  <option key={currency.value} value={currency.value}>{currency.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Language
              </label>
              <select
                value={localSettings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Member Settings */}
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="Users" size={20} className="mr-2 text-primary" />
            Member Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Default Membership Type
              </label>
              <select
                value={localSettings.defaultMembershipType}
                onChange={(e) => handleSettingChange('defaultMembershipType', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {membershipTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Member ID Prefix
              </label>
              <input
                type="text"
                value={localSettings.memberIdPrefix}
                onChange={(e) => handleSettingChange('memberIdPrefix', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="RC-"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Membership Renewal Reminder (days)
              </label>
              <input
                type="number"
                value={localSettings.membershipRenewalReminder}
                onChange={(e) => handleSettingChange('membershipRenewalReminder', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                min="1"
                max="365"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="autoGenerateMemberId"
                checked={localSettings.autoGenerateMemberId}
                onChange={(e) => handleSettingChange('autoGenerateMemberId', e.target.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
              />
              <label htmlFor="autoGenerateMemberId" className="text-sm font-medium text-text-primary">
                Auto-generate Member IDs
              </label>
            </div>
          </div>
        </div>

        {/* Financial Settings */}
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="DollarSign" size={20} className="mr-2 text-primary" />
            Financial Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Fiscal Year Start
              </label>
              <select
                value={localSettings.fiscalYearStart}
                onChange={(e) => handleSettingChange('fiscalYearStart', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {fiscalYearOptions.map(month => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Tax Rate (%)
              </label>
              <input
                type="number"
                value={localSettings.taxRate}
                onChange={(e) => handleSettingChange('taxRate', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                min="0"
                max="100"
                step="0.1"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="enableMultiCurrency"
                checked={localSettings.enableMultiCurrency}
                onChange={(e) => handleSettingChange('enableMultiCurrency', e.target.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
              />
              <label htmlFor="enableMultiCurrency" className="text-sm font-medium text-text-primary">
                Enable Multi-Currency Support
              </label>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="Database" size={20} className="mr-2 text-primary" />
            Data Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Data Retention Period (years)
              </label>
              <input
                type="number"
                value={localSettings.dataRetentionPeriod}
                onChange={(e) => handleSettingChange('dataRetentionPeriod', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                min="1"
                max="50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Backup Frequency
              </label>
              <select
                value={localSettings.backupFrequency}
                onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="autoBackup"
                checked={localSettings.autoBackup}
                onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
              />
              <label htmlFor="autoBackup" className="text-sm font-medium text-text-primary">
                Enable Automatic Backups
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
