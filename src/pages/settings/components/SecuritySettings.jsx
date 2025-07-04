import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SecuritySettings = () => {
  const [settings, setSettings] = useState({
    // Password Settings
    requirePasswordChange: false,
    passwordChangeInterval: 90,
    minPasswordLength: 8,
    requireSpecialChars: true,
    requireNumbers: true,
    requireUppercase: true,
    
    // Two-Factor Authentication
    twoFactorEnabled: false,
    twoFactorMethod: 'sms',
    backupCodes: [],
    
    // Session Settings
    sessionTimeout: 30,
    maxConcurrentSessions: 3,
    logoutOnClose: false,
    
    // Login Security
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    enableCaptcha: true,
    
    // Activity Monitoring
    logLoginActivity: true,
    emailOnSuspiciousActivity: true,
    trackDevices: true,
    
    // Data Security
    enableDataEncryption: true,
    secureFileUploads: true,
    enableAuditLog: true
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving security settings:', settings);
    setHasChanges(false);
  };

  const handlePasswordSubmit = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Changing password');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordForm(false);
  };

  const generateBackupCodes = () => {
    const codes = Array.from({ length: 10 }, () => 
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );
    setSettings(prev => ({ ...prev, backupCodes: codes }));
    setHasChanges(true);
  };

  const SecurityToggle = ({ id, label, description, checked, onChange, disabled = false }) => (
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
            Security Settings
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Manage your account security and privacy settings
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
        {/* Password Management */}
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="Lock" size={20} className="mr-2 text-primary" />
            Password Management
          </h3>
          
          <div className="bg-surface-hover rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-primary">Change Password</p>
                <p className="text-xs text-text-muted mt-1">
                  Last changed 45 days ago
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="Key"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
              >
                Change Password
              </Button>
            </div>
            
            {showPasswordForm && (
              <div className="mt-4 pt-4 border-t border-border space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handlePasswordSubmit}
                  >
                    Update Password
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPasswordForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Minimum Password Length
                </label>
                <input
                  type="number"
                  value={settings.minPasswordLength}
                  onChange={(e) => handleSettingChange('minPasswordLength', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  min="6"
                  max="32"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Password Change Interval (days)
                </label>
                <input
                  type="number"
                  value={settings.passwordChangeInterval}
                  onChange={(e) => handleSettingChange('passwordChangeInterval', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  min="30"
                  max="365"
                />
              </div>
            </div>

            <div className="bg-surface-hover rounded-lg p-4 space-y-1">
              <SecurityToggle
                id="requirePasswordChange"
                label="Require Regular Password Changes"
                description="Force users to change passwords periodically"
                checked={settings.requirePasswordChange}
                onChange={(value) => handleSettingChange('requirePasswordChange', value)}
              />
              <SecurityToggle
                id="requireSpecialChars"
                label="Require Special Characters"
                description="Passwords must contain special characters (!@#$%^&*)"
                checked={settings.requireSpecialChars}
                onChange={(value) => handleSettingChange('requireSpecialChars', value)}
              />
              <SecurityToggle
                id="requireNumbers"
                label="Require Numbers"
                description="Passwords must contain at least one number"
                checked={settings.requireNumbers}
                onChange={(value) => handleSettingChange('requireNumbers', value)}
              />
              <SecurityToggle
                id="requireUppercase"
                label="Require Uppercase Letters"
                description="Passwords must contain uppercase letters"
                checked={settings.requireUppercase}
                onChange={(value) => handleSettingChange('requireUppercase', value)}
              />
            </div>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="Shield" size={20} className="mr-2 text-primary" />
            Two-Factor Authentication
          </h3>
          
          <div className="bg-surface-hover rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-text-primary">Enable Two-Factor Authentication</p>
                <p className="text-xs text-text-muted mt-1">
                  Add an extra layer of security to your account
                </p>
              </div>
              <input
                type="checkbox"
                id="twoFactorEnabled"
                checked={settings.twoFactorEnabled}
                onChange={(e) => handleSettingChange('twoFactorEnabled', e.target.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
              />
            </div>
            
            {settings.twoFactorEnabled && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Authentication Method
                  </label>
                  <select
                    value={settings.twoFactorMethod}
                    onChange={(e) => handleSettingChange('twoFactorMethod', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="sms">SMS Text Message</option>
                    <option value="email">Email</option>
                    <option value="app">Authenticator App</option>
                  </select>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-text-primary">Backup Codes</p>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="RefreshCw"
                      onClick={generateBackupCodes}
                    >
                      Generate New Codes
                    </Button>
                  </div>
                  {settings.backupCodes.length > 0 && (
                    <div className="bg-surface rounded-lg p-3">
                      <p className="text-xs text-text-muted mb-2">
                        Save these backup codes in a secure location:
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        {settings.backupCodes.map((code, index) => (
                          <div key={index} className="bg-surface-hover p-2 rounded">
                            {code}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Session Management */}
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="Clock" size={20} className="mr-2 text-primary" />
            Session Management
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                min="5"
                max="480"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Max Concurrent Sessions
              </label>
              <input
                type="number"
                value={settings.maxConcurrentSessions}
                onChange={(e) => handleSettingChange('maxConcurrentSessions', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                min="1"
                max="10"
              />
            </div>
          </div>

          <div className="bg-surface-hover rounded-lg p-4">
            <SecurityToggle
              id="logoutOnClose"
              label="Logout on Browser Close"
              description="Automatically logout when browser is closed"
              checked={settings.logoutOnClose}
              onChange={(value) => handleSettingChange('logoutOnClose', value)}
            />
          </div>
        </div>

        {/* Login Security */}
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="UserCheck" size={20} className="mr-2 text-primary" />
            Login Security
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Max Login Attempts
              </label>
              <input
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                min="3"
                max="10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Lockout Duration (minutes)
              </label>
              <input
                type="number"
                value={settings.lockoutDuration}
                onChange={(e) => handleSettingChange('lockoutDuration', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                min="5"
                max="60"
              />
            </div>
          </div>

          <div className="bg-surface-hover rounded-lg p-4 space-y-1">
            <SecurityToggle
              id="enableCaptcha"
              label="Enable CAPTCHA"
              description="Require CAPTCHA verification after failed login attempts"
              checked={settings.enableCaptcha}
              onChange={(value) => handleSettingChange('enableCaptcha', value)}
            />
            <SecurityToggle
              id="logLoginActivity"
              label="Log Login Activity"
              description="Keep a record of all login attempts and sessions"
              checked={settings.logLoginActivity}
              onChange={(value) => handleSettingChange('logLoginActivity', value)}
            />
            <SecurityToggle
              id="emailOnSuspiciousActivity"
              label="Email on Suspicious Activity"
              description="Send email alerts for unusual login patterns"
              checked={settings.emailOnSuspiciousActivity}
              onChange={(value) => handleSettingChange('emailOnSuspiciousActivity', value)}
            />
            <SecurityToggle
              id="trackDevices"
              label="Track Devices"
              description="Monitor and remember trusted devices"
              checked={settings.trackDevices}
              onChange={(value) => handleSettingChange('trackDevices', value)}
            />
          </div>
        </div>

        {/* Data Security */}
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="Database" size={20} className="mr-2 text-primary" />
            Data Security
          </h3>
          
          <div className="bg-surface-hover rounded-lg p-4 space-y-1">
            <SecurityToggle
              id="enableDataEncryption"
              label="Enable Data Encryption"
              description="Encrypt sensitive data at rest and in transit"
              checked={settings.enableDataEncryption}
              onChange={(value) => handleSettingChange('enableDataEncryption', value)}
            />
            <SecurityToggle
              id="secureFileUploads"
              label="Secure File Uploads"
              description="Scan and validate all uploaded files"
              checked={settings.secureFileUploads}
              onChange={(value) => handleSettingChange('secureFileUploads', value)}
            />
            <SecurityToggle
              id="enableAuditLog"
              label="Enable Audit Log"
              description="Maintain detailed logs of all system activities"
              checked={settings.enableAuditLog}
              onChange={(value) => handleSettingChange('enableAuditLog', value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
