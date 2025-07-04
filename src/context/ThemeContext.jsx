import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Default appearance settings
const defaultAppearanceSettings = {
  // Theme Settings
  theme: 'dark',
  autoTheme: false,

  // Layout Settings
  sidebarCollapsed: false,
  compactMode: false,
  showBreadcrumbs: true,
  showPageDescriptions: true,

  // Display Settings
  fontSize: 'medium',
  fontFamily: 'system',
  density: 'comfortable',
  animations: true,

  // Color Settings
  primaryColor: '#252569',
  accentColor: '#3b82f6',

  // Dashboard Settings
  showWelcomeMessage: true,
  showQuickStats: true,
  showRecentActivity: true,
  dashboardLayout: 'grid'
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [appearanceSettings, setAppearanceSettings] = useState(defaultAppearanceSettings);

  useEffect(() => {
    // Load theme and appearance settings from localStorage on mount
    const savedTheme = localStorage.getItem('rotary_theme');
    const savedAppearance = localStorage.getItem('rotary_appearance_settings');

    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }

    if (savedAppearance) {
      try {
        const parsedSettings = JSON.parse(savedAppearance);
        setAppearanceSettings(prev => ({ ...prev, ...parsedSettings }));
      } catch (error) {
        console.error('Error parsing appearance settings:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Apply theme to document root
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Save theme to localStorage
    localStorage.setItem('rotary_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    // Apply appearance settings to document root
    const root = document.documentElement;

    // Apply font size
    root.classList.remove('text-sm', 'text-base', 'text-lg');
    switch (appearanceSettings.fontSize) {
      case 'small':
        root.classList.add('text-sm');
        break;
      case 'large':
        root.classList.add('text-lg');
        break;
      default:
        root.classList.add('text-base');
    }

    // Apply font family
    root.classList.remove('font-system', 'font-inter', 'font-roboto', 'font-opensans');
    root.classList.add(`font-${appearanceSettings.fontFamily}`);

    // Apply density
    root.classList.remove('density-compact', 'density-comfortable', 'density-spacious');
    root.classList.add(`density-${appearanceSettings.density}`);

    // Apply animations
    if (!appearanceSettings.animations) {
      root.classList.add('no-animations');
    } else {
      root.classList.remove('no-animations');
    }

    // Apply accessibility settings
    if (appearanceSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (appearanceSettings.reducedMotion) {
      root.classList.add('respect-motion-preference');
    } else {
      root.classList.remove('respect-motion-preference');
    }

    if (appearanceSettings.focusIndicators) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }

    // Apply custom colors to CSS custom properties
    root.style.setProperty('--color-primary', appearanceSettings.primaryColor);
    root.style.setProperty('--color-accent', appearanceSettings.accentColor);

    // Apply colors to Tailwind CSS classes by updating the primary color
    const primaryRgb = hexToRgb(appearanceSettings.primaryColor);
    const accentRgb = hexToRgb(appearanceSettings.accentColor);

    if (primaryRgb) {
      root.style.setProperty('--color-primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
    }

    if (accentRgb) {
      root.style.setProperty('--color-accent-rgb', `${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}`);
    }

    // Save appearance settings to localStorage
    localStorage.setItem('rotary_appearance_settings', JSON.stringify(appearanceSettings));
  }, [appearanceSettings]);

  // Helper function to convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
    setAppearanceSettings(prev => ({
      ...prev,
      theme: !isDarkMode ? 'dark' : 'light'
    }));
  };

  const updateAppearanceSettings = (newSettings) => {
    setAppearanceSettings(prev => ({
      ...prev,
      ...newSettings
    }));

    // Handle theme change
    if (newSettings.theme && newSettings.theme !== (isDarkMode ? 'dark' : 'light')) {
      setIsDarkMode(newSettings.theme === 'dark');
    }
  };

  const resetAppearanceSettings = () => {
    setAppearanceSettings(defaultAppearanceSettings);
    setIsDarkMode(defaultAppearanceSettings.theme === 'dark');
  };

  const value = {
    isDarkMode,
    toggleTheme,
    theme: isDarkMode ? 'dark' : 'light',
    appearanceSettings,
    updateAppearanceSettings,
    resetAppearanceSettings
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
