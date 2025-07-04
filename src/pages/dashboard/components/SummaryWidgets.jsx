import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../../../components/AppIcon';

const SummaryWidgets = () => {
  const { t } = useTranslation();

  const summaryData = [
    {
      id: 1,
      title: t('dashboard.members', 'Members'),
      value: '155',
      icon: 'Users',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      textColor: 'text-white',
      change: '+12',
      changeType: 'increase'
    },
    {
      id: 2,
      title: t('dashboard.donors', 'Donors'),
      value: '26',
      icon: 'Heart',
      color: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      textColor: 'text-white',
      change: '+3',
      changeType: 'increase'
    },
    {
      id: 3,
      title: t('dashboard.fundsAvailable', 'Funds Available'),
      value: '₹15,632',
      icon: 'DollarSign',
      color: 'bg-gradient-to-br from-violet-500 to-violet-600',
      textColor: 'text-white',
      change: '+₹2,450',
      changeType: 'increase'
    },
    {
      id: 4,
      title: t('dashboard.activeProjects', 'Active Projects'),
      value: '13',
      icon: 'FolderOpen',
      color: 'bg-gradient-to-br from-amber-500 to-amber-600',
      textColor: 'text-white',
      change: '+2',
      changeType: 'increase'
    },
    {
      id: 5,
      title: t('dashboard.upcomingEvents', 'Upcoming Events'),
      value: '7',
      icon: 'Calendar',
      color: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
      textColor: 'text-white',
      change: '+1',
      changeType: 'increase'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
      {summaryData.map((item) => (
        <div
          key={item.id}
          className={`${item.color} rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 cursor-pointer`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 bg-white bg-opacity-20 rounded-lg`}>
              <Icon 
                name={item.icon} 
                size={24} 
                className={item.textColor}
              />
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${item.textColor}`}>
                {item.value}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <h3 className={`text-sm font-medium ${item.textColor} opacity-90`}>
              {item.title}
            </h3>
            <div className="flex items-center space-x-1">
              <Icon 
                name={item.changeType === 'increase' ? 'TrendingUp' : 'TrendingDown'} 
                size={14} 
                className={`${item.textColor} opacity-80`}
              />
              <span className={`text-xs font-medium ${item.textColor} opacity-80`}>
                {item.change}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryWidgets;