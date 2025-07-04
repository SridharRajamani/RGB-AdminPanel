import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../../../components/AppIcon';

const DashboardHeader = () => {
  const { t } = useTranslation();
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentTime = currentDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 mb-8 text-white shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        {/* Welcome Section */}
        <div className="mb-4 lg:mb-0">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Icon name="User" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold">
                {t('dashboard.welcomeBack', 'Welcome back, Admin User')}
              </h1>
              <p className="text-primary-100 text-sm">
                {t('dashboard.userRole', 'Club President • Rotary Gulmohar')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-primary-100">
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" size={16} />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={16} />
              <span>{currentTime}</span>
            </div>
          </div>
        </div>

        {/* Balance Section */}
        <div className="lg:text-right">
          <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between lg:justify-end lg:space-x-3">
              <div className="lg:text-right">
                <p className="text-primary-100 text-sm font-medium mb-1">
                  Available Balance
                </p>
                <div className="flex items-center space-x-2">
                  <Icon name="DollarSign" size={20} className="text-white" />
                  <span className="text-2xl font-bold">₹15,632</span>
                </div>
              </div>
              <div className="lg:hidden">
                <div className="w-10 h-10 bg-success bg-opacity-20 rounded-full flex items-center justify-center">
                  <Icon name="TrendingUp" size={20} className="text-success-200" />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between lg:justify-end mt-2">
              <div className="flex items-center space-x-1 text-xs text-primary-100">
                <Icon name="TrendingUp" size={12} />
                <span>+₹2,450 this month</span>
              </div>
              <div className="lg:hidden text-xs text-primary-100">
                Last updated: {currentTime}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="mt-6 pt-6 border-t border-primary-200 border-opacity-30">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center lg:text-left">
            <div className="text-lg font-bold">155</div>
            <div className="text-xs text-primary-100">Total Members</div>
          </div>
          <div className="text-center lg:text-left">
            <div className="text-lg font-bold">13</div>
            <div className="text-xs text-primary-100">Active Projects</div>
          </div>
          <div className="text-center lg:text-left">
            <div className="text-lg font-bold">7</div>
            <div className="text-xs text-primary-100">Upcoming Events</div>
          </div>
          <div className="text-center lg:text-left">
            <div className="text-lg font-bold">26</div>
            <div className="text-xs text-primary-100">Active Donors</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;