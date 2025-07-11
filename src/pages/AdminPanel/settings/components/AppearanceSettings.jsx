import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../context/ThemeContext';
import Icon from '../../../../components/AppIcon';
import Button from '../../../../components/ui/Button';
import useCoolAlert from '../../../../hooks/useCoolAlert';

const AppearanceSettings = () => {
  const {
    isDarkMode,
    toggleTheme,
    appearanceSettings,
    updateAppearanceSettings,
    resetAppearanceSettings
  } = useTheme();

  const alert = useCoolAlert();

  const [settings, setSettings] = useState(appearanceSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [customColors, setCustomColors] = useState({
    primary: appearanceSettings.primaryColor,
    accent: appearanceSettings.accentColor
  });

  // Sync with theme context when it changes
  useEffect(() => {
    setSettings(appearanceSettings);
    setCustomColors({
      primary: appearanceSettings.primaryColor,
      accent: appearanceSettings.accentColor
    });
  }, [appearanceSettings]);

  const handleSettingChange = (key, value) => {
    const newSettings = {
      ...settings,
      [key]: value
    };

    setSettings(newSettings);
    setHasChanges(true);

    // Apply changes immediately for preview
    if (previewMode) {
      updateAppearanceSettings({ [key]: value });
    }

    // Handle theme change immediately
    if (key === 'theme') {
      if ((value === 'dark' && !isDarkMode) || (value === 'light' && isDarkMode)) {
        toggleTheme();
      }
    }
  };

  const handleColorChange = (colorType, color) => {
    const colorKey = colorType === 'primary' ? 'primaryColor' : 'accentColor';
    setCustomColors(prev => ({
      ...prev,
      [colorType]: color
    }));
    handleSettingChange(colorKey, color);

    // Apply color immediately to CSS custom properties for instant preview
    const root = document.documentElement;
    if (colorType === 'primary') {
      root.style.setProperty('--color-primary', color);
    } else {
      root.style.setProperty('--color-accent', color);
    }
  };

  const handlePresetClick = (preset) => {
    // Update both colors from preset
    setCustomColors({
      primary: preset.primary,
      accent: preset.accent
    });

    // Update settings
    const newSettings = {
      ...settings,
      primaryColor: preset.primary,
      accentColor: preset.accent
    };
    setSettings(newSettings);
    setHasChanges(true);

    // Apply immediately to CSS for instant preview
    const root = document.documentElement;
    root.style.setProperty('--color-primary', preset.primary);
    root.style.setProperty('--color-accent', preset.accent);

    // If in preview mode, also update the theme context
    if (previewMode) {
      updateAppearanceSettings({
        primaryColor: preset.primary,
        accentColor: preset.accent
      });
    }
  };

  const handleSave = () => {
    updateAppearanceSettings(settings);
    setHasChanges(false);
    setPreviewMode(false);

    // Show success alert
    alert.celebration(
      '🎨 Theme Saved!',
      'Your appearance settings have been saved successfully!',
      {
        animation: 'bounce',
        gradient: true,
        sound: true,
        autoClose: true,
        autoCloseDelay: 3000
      }
    );
  };

  const handleReset = async () => {
    const confirmed = await alert.confirm(
      '🔄 Reset Theme Settings',
      'Are you sure you want to reset all appearance settings to default? This action cannot be undone.',
      {
        animation: 'zoom',
        confirmText: 'Yes, Reset',
        cancelText: 'Cancel'
      }
    );

    if (confirmed) {
      resetAppearanceSettings();
      setHasChanges(false);
      setPreviewMode(false);

      // Show success alert
      alert.notification(
        '✅ Settings Reset',
        'All appearance settings have been reset to default values.',
        {
          animation: 'slide',
          autoClose: true,
          autoCloseDelay: 3000
        }
      );
    }
  };

  const handlePreviewToggle = () => {
    if (previewMode) {
      // Exit preview mode - revert to saved settings
      updateAppearanceSettings(appearanceSettings);
      setSettings(appearanceSettings);
      setPreviewMode(false);
    } else {
      // Enter preview mode - apply current settings
      updateAppearanceSettings(settings);
      setPreviewMode(true);
    }
  };

  const previewTheme = (theme) => {
    handleSettingChange('theme', theme);
  };

  // Color Presets
  const colorPresets = [
    {
      name: 'Rotary Blue',
      primary: '#252569',
      accent: '#3b82f6'
    },
    {
      name: 'Forest Green',
      primary: '#059669',
      accent: '#10b981'
    },
    {
      name: 'Royal Purple',
      primary: '#7c3aed',
      accent: '#8b5cf6'
    },
    {
      name: 'Sunset Orange',
      primary: '#ea580c',
      accent: '#f97316'
    },
    {
      name: 'Ocean Blue',
      primary: '#0891b2',
      accent: '#06b6d4'
    },
    {
      name: 'Rose Pink',
      primary: '#e11d48',
      accent: '#f43f5e'
    }
  ];

  const fontSizes = [
    { value: 'small', label: 'Small', description: 'Compact text size' },
    { value: 'medium', label: 'Medium', description: 'Default text size' },
    { value: 'large', label: 'Large', description: 'Larger text for better readability' }
  ];

  const fontFamilies = [
    { value: 'system', label: 'System Default', description: 'Use system font' },
    { value: 'inter', label: 'Inter', description: 'Modern sans-serif font' },
    { value: 'roboto', label: 'Roboto', description: 'Google\'s material design font' },
    { value: 'opensans', label: 'Open Sans', description: 'Friendly and readable' }
  ];

  const densityOptions = [
    { value: 'compact', label: 'Compact', description: 'More content, less spacing' },
    { value: 'comfortable', label: 'Comfortable', description: 'Balanced spacing' },
    { value: 'spacious', label: 'Spacious', description: 'More spacing, easier to read' }
  ];



  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-text-primary">
            Appearance Settings
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Customize the look and feel of your dashboard
          </p>
          {previewMode && (
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
              <span className="text-xs text-warning font-medium">Preview Mode Active</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            iconName={previewMode ? "EyeOff" : "Eye"}
            iconPosition="left"
            onClick={handlePreviewToggle}
            className="hover:bg-primary hover:text-white active:bg-primary active:text-white focus:bg-primary focus:text-white [&>span]:hover:text-white [&>span]:active:text-white [&>span]:focus:text-white"
          >
            {previewMode ? "Exit Preview" : "Preview Changes"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="RotateCcw"
            iconPosition="left"
            onClick={handleReset}
            className="hover:bg-primary hover:text-white active:bg-primary active:text-white focus:bg-primary focus:text-white [&>span]:hover:text-white [&>span]:active:text-white [&>span]:focus:text-white"
          >
            Reset to Default
          </Button>
          <Button
            variant="primary"
            size="sm"
            iconName="Save"
            iconPosition="left"
            onClick={handleSave}
            disabled={!hasChanges}
            className="[&>span]:text-white hover:[&>span]:text-white active:[&>span]:text-white focus:[&>span]:text-white"
          >
            Save Changes
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Theme Settings */}
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="Palette" size={20} className="mr-2 text-primary" />
            Theme Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Light Theme */}
            <div 
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                settings.theme === 'light' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => previewTheme('light')}
            >
              <div className="bg-white rounded-lg p-3 mb-3 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-gray-300 rounded"></div>
                  <div className="w-16 h-2 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-1">
                  <div className="w-full h-2 bg-gray-100 rounded"></div>
                  <div className="w-3/4 h-2 bg-gray-100 rounded"></div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Sun" size={16} className="text-yellow-500" />
                <span className="font-medium text-text-primary">Light Theme</span>
                {settings.theme === 'light' && (
                  <Icon name="Check" size={16} className="text-primary ml-auto" />
                )}
              </div>
            </div>

            {/* Dark Theme */}
            <div 
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                settings.theme === 'dark' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => previewTheme('dark')}
            >
              <div className="bg-gray-800 rounded-lg p-3 mb-3 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-gray-600 rounded"></div>
                  <div className="w-16 h-2 bg-gray-700 rounded"></div>
                </div>
                <div className="space-y-1">
                  <div className="w-full h-2 bg-gray-700 rounded"></div>
                  <div className="w-3/4 h-2 bg-gray-700 rounded"></div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Moon" size={16} className="text-blue-400" />
                <span className="font-medium text-text-primary">Dark Theme</span>
                {settings.theme === 'dark' && (
                  <Icon name="Check" size={16} className="text-primary ml-auto" />
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="autoTheme"
              checked={settings.autoTheme}
              onChange={(e) => handleSettingChange('autoTheme', e.target.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary/20"
            />
            <label htmlFor="autoTheme" className="text-sm font-medium text-text-primary">
              Auto-switch theme based on system preference
            </label>
          </div>
        </div>

        {/* Color Customization */}
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="Droplet" size={20} className="mr-2 text-primary" />
            Color Scheme
          </h3>

          {/* Color Presets */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-text-primary mb-3">Color Presets</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {colorPresets.map((preset, index) => (
                <div
                  key={index}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    settings.primaryColor === preset.primary
                      ? 'border-primary bg-primary text-white'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handlePresetClick(preset)}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: preset.primary }}
                    ></div>
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: preset.accent }}
                    ></div>
                  </div>
                  <p className={`font-medium ${
                    settings.primaryColor === preset.primary
                      ? 'text-white'
                      : 'text-text-primary'
                  }`}>{preset.name}</p>
                  {settings.primaryColor === preset.primary && (
                    <Icon name="Check" size={16} className="text-white mt-2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="bg-surface-hover rounded-lg p-4">
            <h4 className="text-sm font-medium text-text-primary mb-4">Custom Colors</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Primary Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={customColors.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="w-12 h-10 rounded-lg border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customColors.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="#252569"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Accent Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={customColors.accent}
                    onChange={(e) => handleColorChange('accent', e.target.value)}
                    className="w-12 h-10 rounded-lg border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={customColors.accent}
                    onChange={(e) => handleColorChange('accent', e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="#3b82f6"
                  />
                </div>
              </div>
            </div>

            {/* Color Preview */}
            <div className="mt-4 p-4 rounded-lg border border-border">
              <p className="text-xs text-text-muted mb-2">Color Preview</p>
              <div className="flex items-center space-x-4 flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-8 h-8 rounded-lg shadow-sm border-2 border-white"
                    style={{ backgroundColor: customColors.primary }}
                  ></div>
                  <span className="text-sm text-text-secondary">Primary</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-8 h-8 rounded-lg shadow-sm border-2 border-white"
                    style={{ backgroundColor: customColors.accent }}
                  ></div>
                  <span className="text-sm text-text-secondary">Accent</span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  Primary Button
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary border-primary hover:bg-primary hover:text-white"
                >
                  Ghost Button
                </Button>
              </div>

              {/* Live Color Values Display */}
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-text-muted mb-1">Current CSS Variables:</p>
                <div className="text-xs font-mono text-text-secondary space-y-1">
                  <div>--color-primary: {customColors.primary}</div>
                  <div>--color-accent: {customColors.accent}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="Type" size={20} className="mr-2 text-primary" />
            Typography
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                Font Size
              </label>
              <div className="space-y-2">
                {fontSizes.map((size) => (
                  <label key={size.value} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="fontSize"
                      value={size.value}
                      checked={settings.fontSize === size.value}
                      onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                      className="w-4 h-4 text-primary border-border focus:ring-primary/20"
                    />
                    <div>
                      <p className="font-medium text-text-primary">{size.label}</p>
                      <p className="text-xs text-text-muted">{size.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                Font Family
              </label>
              <div className="space-y-2">
                {fontFamilies.map((font) => (
                  <label key={font.value} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="fontFamily"
                      value={font.value}
                      checked={settings.fontFamily === font.value}
                      onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
                      className="w-4 h-4 text-primary border-border focus:ring-primary/20"
                    />
                    <div>
                      <p className="font-medium text-text-primary">{font.label}</p>
                      <p className="text-xs text-text-muted">{font.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Layout Settings */}
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="Layout" size={20} className="mr-2 text-primary" />
            Layout Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                Content Density
              </label>
              <div className="space-y-2">
                {densityOptions.map((density) => (
                  <label key={density.value} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="density"
                      value={density.value}
                      checked={settings.density === density.value}
                      onChange={(e) => handleSettingChange('density', e.target.value)}
                      className="w-4 h-4 text-primary border-border focus:ring-primary/20"
                    />
                    <div>
                      <p className="font-medium text-text-primary">{density.label}</p>
                      <p className="text-xs text-text-muted">{density.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                Dashboard Layout
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="dashboardLayout"
                    value="grid"
                    checked={settings.dashboardLayout === 'grid'}
                    onChange={(e) => handleSettingChange('dashboardLayout', e.target.value)}
                    className="w-4 h-4 text-primary border-border focus:ring-primary/20"
                  />
                  <div>
                    <p className="font-medium text-text-primary">Grid Layout</p>
                    <p className="text-xs text-text-muted">Cards arranged in a grid</p>
                  </div>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="dashboardLayout"
                    value="list"
                    checked={settings.dashboardLayout === 'list'}
                    onChange={(e) => handleSettingChange('dashboardLayout', e.target.value)}
                    className="w-4 h-4 text-primary border-border focus:ring-primary/20"
                  />
                  <div>
                    <p className="font-medium text-text-primary">List Layout</p>
                    <p className="text-xs text-text-muted">Vertical list arrangement</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-surface-hover rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">Sidebar Collapsed by Default</p>
                  <p className="text-xs text-text-muted">Start with a collapsed sidebar</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.sidebarCollapsed}
                    onChange={(e) => handleSettingChange('sidebarCollapsed', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">Compact Mode</p>
                  <p className="text-xs text-text-muted">Reduce spacing and padding</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.compactMode}
                    onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">Show Breadcrumbs</p>
                  <p className="text-xs text-text-muted">Display navigation breadcrumbs</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showBreadcrumbs}
                    onChange={(e) => handleSettingChange('showBreadcrumbs', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">Show Page Descriptions</p>
                  <p className="text-xs text-text-muted">Display descriptive text under page titles</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showPageDescriptions}
                    onChange={(e) => handleSettingChange('showPageDescriptions', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">Enable Animations</p>
                  <p className="text-xs text-text-muted">Smooth transitions and animations</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.animations}
                    onChange={(e) => handleSettingChange('animations', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">Reduced Motion</p>
                  <p className="text-xs text-text-muted">Minimize animations for accessibility</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.reducedMotion || false}
                    onChange={(e) => handleSettingChange('reducedMotion', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Customization */}
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="LayoutDashboard" size={20} className="mr-2 text-primary" />
            Dashboard Customization
          </h3>

          <div className="bg-surface-hover rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">Show Welcome Message</p>
                  <p className="text-xs text-text-muted">Display personalized welcome message</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showWelcomeMessage}
                    onChange={(e) => handleSettingChange('showWelcomeMessage', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">Show Quick Stats</p>
                  <p className="text-xs text-text-muted">Display key metrics on dashboard</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showQuickStats}
                    onChange={(e) => handleSettingChange('showQuickStats', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">Show Recent Activity</p>
                  <p className="text-xs text-text-muted">Display recent activities and updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showRecentActivity}
                    onChange={(e) => handleSettingChange('showRecentActivity', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">Show Charts & Graphs</p>
                  <p className="text-xs text-text-muted">Display visual data representations</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showCharts || true}
                    onChange={(e) => handleSettingChange('showCharts', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Color Theme Test Section */}
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="TestTube" size={20} className="mr-2 text-primary" />
            Color Theme Test
          </h3>

          <div className="bg-surface-hover rounded-lg p-4">
            <p className="text-sm text-text-secondary mb-4">
              Test how your selected colors appear across different UI elements:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Button Tests */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-text-primary">Buttons</h4>
                <div className="space-y-2">
                  <Button variant="primary" size="sm" className="w-full">
                    Primary Button
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full border border-primary text-primary hover:bg-primary hover:text-white">
                    Ghost Button
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Outline Button
                  </Button>
                </div>
              </div>

              {/* Icon Tests */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-text-primary">Icons</h4>
                <div className="flex space-x-2">
                  <Icon name="Heart" size={24} className="text-primary" />
                  <Icon name="Star" size={24} className="text-primary" />
                  <Icon name="Check" size={24} className="text-primary" />
                  <Icon name="Settings" size={24} className="text-primary" />
                </div>
              </div>

              {/* Form Elements */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-text-primary">Form Elements</h4>
                <input
                  type="text"
                  placeholder="Test input"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="text-primary" />
                  <span className="text-sm">Checkbox</span>
                </div>
              </div>
            </div>

            {/* Current Color Display */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-primary">Active Colors:</span>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded border-2 border-white shadow-sm"
                    style={{ backgroundColor: settings.primaryColor }}
                    title={`Primary: ${settings.primaryColor}`}
                  ></div>
                  <div
                    className="w-6 h-6 rounded border-2 border-white shadow-sm"
                    style={{ backgroundColor: settings.accentColor }}
                    title={`Accent: ${settings.accentColor}`}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="Settings2" size={20} className="mr-2 text-primary" />
            Advanced Settings
          </h3>

          <div className="bg-surface-hover rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">High Contrast Mode</p>
                  <p className="text-xs text-text-muted">Increase contrast for better visibility</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.highContrast || false}
                    onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">Focus Indicators</p>
                  <p className="text-xs text-text-muted">Enhanced keyboard navigation</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.focusIndicators || true}
                    onChange={(e) => handleSettingChange('focusIndicators', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">Auto-save Settings</p>
                  <p className="text-xs text-text-muted">Automatically save appearance changes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoSave || false}
                    onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-primary">Developer Mode</p>
                  <p className="text-xs text-text-muted">Show additional debug information</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.developerMode || false}
                    onChange={(e) => handleSettingChange('developerMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;
