import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../../components/ui/Header';
import NavigationSidebar from '../../../components/ui/NavigationSidebar';
import BreadcrumbNavigation from '../../../components/ui/BreadcrumbNavigation';
import AlertCenter from '../../../components/ui/AlertCenter';
import Icon from '../../../components/AppIcon';

// Import setting components
import ProfileSettings from './components/ProfileSettings';
import SystemSettings from './components/SystemSettings';
import NotificationSettings from './components/NotificationSettings';
import SecuritySettings from './components/SecuritySettings';
import AppearanceSettings from './components/AppearanceSettings';
import DataSettings from './components/DataSettings';

const Settings = ({ isSidebarCollapsed: propSidebarCollapsed = false, isSidebarVisible = true }) => {
  const { t } = useTranslation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(propSidebarCollapsed);
  const [activeSection, setActiveSection] = useState('profile');

  // Listen for sidebar state changes
  React.useEffect(() => {
    const handleSidebarStateChange = (event) => {
      setIsSidebarCollapsed(event.detail.collapsed);
    };

    window.addEventListener('sidebarStateChanged', handleSidebarStateChange);
    return () => {
      window.removeEventListener('sidebarStateChanged', handleSidebarStateChange);
    };
  }, []);

  const settingSections = [
    {
      id: 'profile',
      label: t('settings.profileSettings', 'Profile Settings'),
      icon: 'User',
      description: t('settings.profileDescription', 'Personal information and preferences'),
      component: ProfileSettings
    },
    {
      id: 'system',
      label: t('settings.systemSettings', 'System Settings'),
      icon: 'Settings',
      description: t('settings.systemDescription', 'Application configuration and defaults'),
      component: SystemSettings
    },
    {
      id: 'notifications',
      label: t('settings.notifications', 'Notifications'),
      icon: 'Bell',
      description: t('settings.notificationDescription', 'Email and push notification preferences'),
      component: NotificationSettings
    },
    {
      id: 'security',
      label: t('settings.security', 'Security'),
      icon: 'Shield',
      description: t('settings.securityDescription', 'Password and security settings'),
      component: SecuritySettings
    },
    {
      id: 'appearance',
      label: t('settings.appearance', 'Appearance'),
      icon: 'Palette',
      description: t('settings.appearanceDescription', 'Theme and display preferences'),
      component: AppearanceSettings
    },
    {
      id: 'data',
      label: 'Data & Privacy',
      icon: 'Database',
      description: 'Data management and privacy controls',
      component: DataSettings
    }
  ];

  const ActiveComponent = settingSections.find(section => section.id === activeSection)?.component;

  return (
    <div className="min-h-screen bg-background mt-12">
      <Header />
      <NavigationSidebar isSidebarCollapsed={isSidebarCollapsed} isSidebarVisible={isSidebarVisible} />
      <AlertCenter />
      
      <main className={`${isSidebarCollapsed ? 'ml-20' : 'ml-64'} pt-1 sm:pt-18 md:pt-2 transition-all duration-200`}>
        <div className="p-6">
          <BreadcrumbNavigation />
          
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Icon name="Settings" size={24} color="white" />
                </div>
                <h1 className="text-3xl font-heading font-bold text-text-primary">
                  Settings
                </h1>
              </div>
              <p className="text-text-secondary">
                Configure system and user settings
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left Section - Settings Navigation */}
            <div className="xl:col-span-3">
              <div className="bg-surface border border-border rounded-xl p-6">
                <h2 className="text-lg font-heading font-semibold text-text-primary mb-4">
                  Settings Categories
                </h2>
                <nav className="space-y-2">
                  {settingSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? 'bg-primary text-white border border-primary'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                      }`}
                    >
                      <Icon
                        name={section.icon}
                        size={20}
                        className={activeSection === section.id ? 'text-white' : 'text-text-muted'}
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium ${
                          activeSection === section.id ? 'text-white' : 'text-text-primary'
                        }`}>
                          {section.label}
                        </p>
                        <p className={`text-xs mt-0.5 ${
                          activeSection === section.id ? 'text-white/80' : 'text-text-muted'
                        }`}>
                          {section.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Right Section - Settings Content */}
            <div className="xl:col-span-9">
              <div className="bg-surface border border-border rounded-xl">
                {ActiveComponent && <ActiveComponent />}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
