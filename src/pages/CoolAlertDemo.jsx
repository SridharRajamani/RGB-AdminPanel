import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/ui/Button';
import CoolAlert from '../components/ui/CoolAlert';
import useCoolAlert from '../hooks/useCoolAlert';
import SubmissionForm from '../components/forms/SubmissionForm';
import Icon from '../components/AppIcon';

const CoolAlertDemo = () => {
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();
  const alert = useCoolAlert();
  
  const [demoAlert, setDemoAlert] = useState({
    isOpen: false,
    type: 'success',
    title: 'Demo Alert',
    message: 'This is a demo alert message',
    animation: 'bounce',
    gradient: false,
    sound: false,
    autoClose: false,
    size: 'medium'
  });

  const showDemoAlert = (config) => {
    setDemoAlert({
      ...demoAlert,
      ...config,
      isOpen: true
    });
  };

  const closeDemoAlert = () => {
    setDemoAlert(prev => ({ ...prev, isOpen: false }));
  };

  const alertTypes = [
    { type: 'success', label: 'Success', icon: 'CheckCircle', color: 'text-green-600' },
    { type: 'error', label: 'Error', icon: 'XCircle', color: 'text-red-600' },
    { type: 'warning', label: 'Warning', icon: 'AlertTriangle', color: 'text-yellow-600' },
    { type: 'info', label: 'Info', icon: 'Info', color: 'text-blue-600' }
  ];

  const animations = [
    { value: 'bounce', label: 'Bounce' },
    { value: 'slide', label: 'Slide' },
    { value: 'fade', label: 'Fade' },
    { value: 'zoom', label: 'Zoom' },
    { value: 'flip', label: 'Flip' },
    { value: 'shake', label: 'Shake' }
  ];

  const sizes = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'xl', label: 'Extra Large' }
  ];

  return (
    <div className={`min-h-screen p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            🎉 Cool Alert System
          </h1>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            The coolest alert system with amazing animations and effects!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Demo Buttons */}
          <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              🚀 Quick Demos
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {alertTypes.map((type) => (
                <Button
                  key={type.type}
                  onClick={() => alert[type.type](`${type.label} Alert`, `This is a ${type.type} alert with cool animations!`)}
                  className={`flex items-center justify-center space-x-2 ${type.color}`}
                  variant="outline"
                >
                  <Icon name={type.icon} size={20} />
                  <span>{type.label}</span>
                </Button>
              ))}
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => alert.celebration('🎉 Celebration!', 'You did something amazing!')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                🎉 Celebration Alert
              </Button>
              
              <Button
                onClick={() => alert.urgent('🚨 Urgent!', 'This requires immediate attention!')}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white"
              >
                🚨 Urgent Alert
              </Button>
              
              <Button
                onClick={() => alert.notification('📢 Notification', 'You have a new message!')}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
              >
                📢 Notification
              </Button>
              
              <Button
                onClick={async () => {
                  const result = await alert.confirm('🤔 Confirm Action', 'Are you sure you want to proceed?');
                  alert.info('Result', result ? 'You confirmed!' : 'You cancelled!');
                }}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
              >
                🤔 Confirmation Dialog
              </Button>
            </div>
          </div>

          {/* Custom Alert Builder */}
          <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              🎨 Custom Alert Builder
            </h2>
            
            <div className="space-y-4">
              {/* Alert Type */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Alert Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {alertTypes.map((type) => (
                    <button
                      key={type.type}
                      onClick={() => setDemoAlert(prev => ({ ...prev, type: type.type }))}
                      className={`p-2 rounded-lg border-2 transition-all ${
                        demoAlert.type === type.type
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon name={type.icon} size={16} className={type.color} />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {type.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Animation */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Animation
                </label>
                <select
                  value={demoAlert.animation}
                  onChange={(e) => setDemoAlert(prev => ({ ...prev, animation: e.target.value }))}
                  className={`w-full p-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {animations.map((anim) => (
                    <option key={anim.value} value={anim.value}>
                      {anim.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Size */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Size
                </label>
                <select
                  value={demoAlert.size}
                  onChange={(e) => setDemoAlert(prev => ({ ...prev, size: e.target.value }))}
                  className={`w-full p-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {sizes.map((size) => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <input
                    type="checkbox"
                    checked={demoAlert.gradient}
                    onChange={(e) => setDemoAlert(prev => ({ ...prev, gradient: e.target.checked }))}
                    className="rounded"
                  />
                  <span>Gradient Background</span>
                </label>
                
                <label className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <input
                    type="checkbox"
                    checked={demoAlert.sound}
                    onChange={(e) => setDemoAlert(prev => ({ ...prev, sound: e.target.checked }))}
                    className="rounded"
                  />
                  <span>Sound Effects</span>
                </label>
                
                <label className={`flex items-center space-x-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <input
                    type="checkbox"
                    checked={demoAlert.autoClose}
                    onChange={(e) => setDemoAlert(prev => ({ ...prev, autoClose: e.target.checked }))}
                    className="rounded"
                  />
                  <span>Auto Close (3s)</span>
                </label>
              </div>

              {/* Show Demo Button */}
              <Button
                onClick={() => showDemoAlert({})}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white"
              >
                🎭 Show Custom Alert
              </Button>
            </div>
          </div>
        </div>

        {/* Submission Form Demo */}
        <div className={`mt-8 p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            📝 Submission Form with Cool Alerts
          </h2>

          <SubmissionForm
            title="Contact Form Demo"
            fields={[
              {
                name: 'name',
                label: 'Full Name',
                type: 'text',
                placeholder: 'Enter your full name',
                required: true,
                minLength: 2
              },
              {
                name: 'email',
                label: 'Email Address',
                type: 'email',
                placeholder: 'Enter your email address',
                required: true
              },
              {
                name: 'subject',
                label: 'Subject',
                type: 'select',
                placeholder: 'Select a subject',
                required: true,
                options: [
                  { value: 'general', label: 'General Inquiry' },
                  { value: 'support', label: 'Technical Support' },
                  { value: 'feedback', label: 'Feedback' },
                  { value: 'bug', label: 'Bug Report' }
                ]
              },
              {
                name: 'message',
                label: 'Message',
                type: 'textarea',
                placeholder: 'Enter your message here...',
                required: true,
                minLength: 10,
                rows: 4
              }
            ]}
            onSubmit={async (data) => {
              // Simulate API call
              console.log('Form submitted:', data);
              await new Promise(resolve => setTimeout(resolve, 1500));

              // Simulate random success/failure for demo
              if (Math.random() > 0.2) {
                return Promise.resolve();
              } else {
                throw new Error('Network error occurred. Please try again.');
              }
            }}
            submitText="Send Message"
            resetText="Clear Form"
          />
        </div>

        {/* Features List */}
        <div className={`mt-12 p-6 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            ✨ Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              '🎨 6 Different Animations',
              '🎵 Sound Effects',
              '🌈 Gradient Backgrounds',
              '📱 Responsive Design',
              '🌙 Dark/Light Theme',
              '⚡ Auto Close Timer',
              '🎯 Multiple Sizes',
              '🔔 Floating Particles',
              '💫 Glow Effects',
              '🎭 Custom Icons',
              '📊 Progress Indicators',
              '🎪 Backdrop Blur'
            ].map((feature, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Alert */}
      <CoolAlert
        {...demoAlert}
        onClose={closeDemoAlert}
        autoCloseDelay={3000}
      />
    </div>
  );
};

export default CoolAlertDemo;
