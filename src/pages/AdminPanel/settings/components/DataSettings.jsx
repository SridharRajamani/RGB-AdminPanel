import React, { useState } from 'react';
import Icon from '../../../../components/AppIcon';
import Button from '../../../../components/ui/Button';

const DataSettings = () => {
  const [settings, setSettings] = useState({
    // Data Export Settings
    exportFormat: 'xlsx',
    includeMetadata: true,
    compressExports: false,
    
    // Data Import Settings
    allowDataImport: true,
    validateOnImport: true,
    backupBeforeImport: true,
    
    // Privacy Settings
    anonymizeExports: false,
    dataRetentionPeriod: 7,
    autoDeleteOldData: false,
    
    // Backup Settings
    autoBackup: true,
    backupFrequency: 'weekly',
    backupLocation: 'cloud',
    keepBackupCopies: 12,
    
    // Data Sharing
    allowDataSharing: false,
    shareAnonymizedData: false,
    dataProcessingConsent: true,
    
    // Storage Settings
    storageLocation: 'local',
    encryptStorage: true,
    compressData: true
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log('Saving data settings:', settings);
    setHasChanges(false);
  };

  const handleExportAllData = () => {
    console.log('Exporting all data...');
    // Handle data export logic
  };

  const handleImportData = () => {
    console.log('Opening import dialog...');
    // Handle data import logic
  };

  const handleBackupNow = () => {
    console.log('Creating backup...');
    // Handle backup logic
  };

  const handleDeleteAllData = () => {
    if (showDeleteConfirm) {
      console.log('Deleting all data...');
      setShowDeleteConfirm(false);
      // Handle data deletion logic
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const DataToggle = ({ id, label, description, checked, onChange, disabled = false }) => (
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
            Data & Privacy Settings
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Manage your data, privacy, and backup preferences
          </p>
        </div>
        <div className="flex items-center space-x-3">
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
        {/* Data Export & Import */}
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="Download" size={20} className="mr-2 text-primary" />
            Data Export & Import
          </h3>
          
          <div className="bg-surface-hover rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-text-primary">Export All Data</p>
                <p className="text-xs text-text-muted">Download a complete copy of your data</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                onClick={handleExportAllData}
              >
                Export Data
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-primary">Import Data</p>
                <p className="text-xs text-text-muted">Import data from a backup file</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="Upload"
                onClick={handleImportData}
              >
                Import Data
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Default Export Format
              </label>
              <select
                value={settings.exportFormat}
                onChange={(e) => handleSettingChange('exportFormat', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="xlsx">Excel (.xlsx)</option>
                <option value="csv">CSV (.csv)</option>
                <option value="json">JSON (.json)</option>
                <option value="pdf">PDF (.pdf)</option>
              </select>
            </div>
          </div>

          <div className="bg-surface-hover rounded-lg p-4 space-y-1">
            <DataToggle
              id="includeMetadata"
              label="Include Metadata in Exports"
              description="Include creation dates, user info, and other metadata"
              checked={settings.includeMetadata}
              onChange={(value) => handleSettingChange('includeMetadata', value)}
            />
            <DataToggle
              id="compressExports"
              label="Compress Export Files"
              description="Create ZIP archives for large exports"
              checked={settings.compressExports}
              onChange={(value) => handleSettingChange('compressExports', value)}
            />
            <DataToggle
              id="allowDataImport"
              label="Allow Data Import"
              description="Enable importing data from external sources"
              checked={settings.allowDataImport}
              onChange={(value) => handleSettingChange('allowDataImport', value)}
            />
            <DataToggle
              id="validateOnImport"
              label="Validate Data on Import"
              description="Check data integrity before importing"
              checked={settings.validateOnImport}
              onChange={(value) => handleSettingChange('validateOnImport', value)}
              disabled={!settings.allowDataImport}
            />
            <DataToggle
              id="backupBeforeImport"
              label="Backup Before Import"
              description="Create automatic backup before importing new data"
              checked={settings.backupBeforeImport}
              onChange={(value) => handleSettingChange('backupBeforeImport', value)}
              disabled={!settings.allowDataImport}
            />
          </div>
        </div>

        {/* Backup Settings */}
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="Shield" size={20} className="mr-2 text-primary" />
            Backup Settings
          </h3>
          
          <div className="bg-surface-hover rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-primary">Create Backup Now</p>
                <p className="text-xs text-text-muted">Last backup: 2 days ago</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="Shield"
                onClick={handleBackupNow}
              >
                Backup Now
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Backup Frequency
              </label>
              <select
                value={settings.backupFrequency}
                onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="manual">Manual Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Backup Location
              </label>
              <select
                value={settings.backupLocation}
                onChange={(e) => handleSettingChange('backupLocation', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="cloud">Cloud Storage</option>
                <option value="local">Local Storage</option>
                <option value="both">Both Cloud & Local</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Keep Backup Copies
              </label>
              <input
                type="number"
                value={settings.keepBackupCopies}
                onChange={(e) => handleSettingChange('keepBackupCopies', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                min="1"
                max="50"
              />
            </div>
          </div>

          <div className="bg-surface-hover rounded-lg p-4">
            <DataToggle
              id="autoBackup"
              label="Enable Automatic Backups"
              description="Automatically create backups based on the schedule above"
              checked={settings.autoBackup}
              onChange={(value) => handleSettingChange('autoBackup', value)}
            />
          </div>
        </div>

        {/* Privacy Settings */}
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="Lock" size={20} className="mr-2 text-primary" />
            Privacy Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Data Retention Period (years)
              </label>
              <input
                type="number"
                value={settings.dataRetentionPeriod}
                onChange={(e) => handleSettingChange('dataRetentionPeriod', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                min="1"
                max="50"
              />
            </div>
          </div>

          <div className="bg-surface-hover rounded-lg p-4 space-y-1">
            <DataToggle
              id="anonymizeExports"
              label="Anonymize Data in Exports"
              description="Remove personally identifiable information from exports"
              checked={settings.anonymizeExports}
              onChange={(value) => handleSettingChange('anonymizeExports', value)}
            />
            <DataToggle
              id="autoDeleteOldData"
              label="Auto-Delete Old Data"
              description="Automatically delete data older than retention period"
              checked={settings.autoDeleteOldData}
              onChange={(value) => handleSettingChange('autoDeleteOldData', value)}
            />
            <DataToggle
              id="allowDataSharing"
              label="Allow Data Sharing"
              description="Enable sharing data with authorized third parties"
              checked={settings.allowDataSharing}
              onChange={(value) => handleSettingChange('allowDataSharing', value)}
            />
            <DataToggle
              id="shareAnonymizedData"
              label="Share Anonymized Data"
              description="Allow sharing of anonymized data for research purposes"
              checked={settings.shareAnonymizedData}
              onChange={(value) => handleSettingChange('shareAnonymizedData', value)}
              disabled={!settings.allowDataSharing}
            />
            <DataToggle
              id="dataProcessingConsent"
              label="Data Processing Consent"
              description="I consent to the processing of my data as described in the privacy policy"
              checked={settings.dataProcessingConsent}
              onChange={(value) => handleSettingChange('dataProcessingConsent', value)}
            />
          </div>
        </div>

        {/* Storage Settings */}
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="HardDrive" size={20} className="mr-2 text-primary" />
            Storage Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Storage Location
              </label>
              <select
                value={settings.storageLocation}
                onChange={(e) => handleSettingChange('storageLocation', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="local">Local Storage</option>
                <option value="cloud">Cloud Storage</option>
                <option value="hybrid">Hybrid (Local + Cloud)</option>
              </select>
            </div>
          </div>

          <div className="bg-surface-hover rounded-lg p-4 space-y-1">
            <DataToggle
              id="encryptStorage"
              label="Encrypt Stored Data"
              description="Encrypt all data stored on disk"
              checked={settings.encryptStorage}
              onChange={(value) => handleSettingChange('encryptStorage', value)}
            />
            <DataToggle
              id="compressData"
              label="Compress Data"
              description="Compress data to save storage space"
              checked={settings.compressData}
              onChange={(value) => handleSettingChange('compressData', value)}
            />
          </div>
        </div>

        {/* Danger Zone */}
        <div>
          <h3 className="text-lg font-medium text-error-600 mb-4 flex items-center">
            <Icon name="AlertTriangle" size={20} className="mr-2 text-error-600" />
            Danger Zone
          </h3>
          
          <div className="bg-error-50 border border-error-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-error-800">Delete All Data</p>
                <p className="text-xs text-error-600 mt-1">
                  Permanently delete all data. This action cannot be undone.
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                iconName="Trash2"
                onClick={handleDeleteAllData}
              >
                {showDeleteConfirm ? 'Confirm Delete' : 'Delete All Data'}
              </Button>
            </div>
            {showDeleteConfirm && (
              <div className="mt-4 pt-4 border-t border-error-200">
                <p className="text-sm text-error-700 mb-3">
                  Are you sure you want to delete all data? This will permanently remove:
                </p>
                <ul className="text-xs text-error-600 space-y-1 mb-4">
                  <li>• All member records and profiles</li>
                  <li>• Event history and registrations</li>
                  <li>• Financial records and donations</li>
                  <li>• Communication history</li>
                  <li>• All settings and preferences</li>
                </ul>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleDeleteAllData}
                  >
                    Yes, Delete Everything
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSettings;
