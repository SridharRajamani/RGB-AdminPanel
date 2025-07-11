import React from 'react';
import Icon from '../../../../components/AppIcon';
import { useSystemSettings } from '../../../../context/SystemSettingsContext';

const DonationSummary = () => {
  const { formatCurrency } = useSystemSettings();

  const donationData = {
    totalDonations: 2850000,
    totalDonors: 156,
    averageDonation: 18269,
    monthlyDonations: 285000,
    activeCampaigns: 4,
    completedCampaigns: 12,
    pendingDonations: 45000,
    recurringDonors: 89
  };

  const getPercentageChange = (current, previous) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change >= 0
    };
  };

  const summaryCards = [
    {
      title: 'Total Donations',
      value: donationData.totalDonations,
      icon: 'Heart',
      color: 'success',
      change: getPercentageChange(donationData.totalDonations, 2400000),
      description: 'Year to date donations'
    },
    {
      title: 'Total Donors',
      value: donationData.totalDonors,
      icon: 'Users',
      color: 'primary',
      change: getPercentageChange(donationData.totalDonors, 142),
      description: 'Active donor base',
      isCount: true
    },
    {
      title: 'Average Donation',
      value: donationData.averageDonation,
      icon: 'TrendingUp',
      color: 'accent',
      change: getPercentageChange(donationData.averageDonation, 16500),
      description: 'Per donation amount'
    },
    {
      title: 'Monthly Donations',
      value: donationData.monthlyDonations,
      icon: 'Calendar',
      color: 'secondary',
      change: getPercentageChange(donationData.monthlyDonations, 245000),
      description: 'This month total'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      success: {
        bg: 'bg-success-50',
        icon: 'text-success-600',
        text: 'text-success-600'
      },
      primary: {
        bg: 'bg-primary-50',
        icon: 'text-primary-600',
        text: 'text-primary-600'
      },
      accent: {
        bg: 'bg-accent-50',
        icon: 'text-accent-600',
        text: 'text-accent-600'
      },
      secondary: {
        bg: 'bg-secondary-50',
        icon: 'text-secondary-600',
        text: 'text-secondary-600'
      }
    };
    return colorMap[color] || colorMap.primary;
  };

  return (
    <div className="mb-6">
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-semibold text-text-primary">
              Donation Overview
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Key donation metrics and fundraising performance
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <select className="px-3 py-2 text-sm border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option value="ytd">Year to Date</option>
              <option value="monthly">This Month</option>
              <option value="quarterly">This Quarter</option>
              <option value="annual">Annual</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {summaryCards.map((card, index) => {
            const colors = getColorClasses(card.color);
            return (
              <div key={index} className="bg-surface border border-border rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
                    <Icon name={card.icon} size={24} className={colors.icon} />
                  </div>
                  <div className={`flex items-center text-sm font-medium ${
                    card.change.isPositive ? 'text-success-600' : 'text-error-600'
                  }`}>
                    <Icon 
                      name={card.change.isPositive ? 'TrendingUp' : 'TrendingDown'} 
                      size={16} 
                      className="mr-1"
                    />
                    {card.change.value}%
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-heading font-bold text-text-primary">
                    {card.isCount ? card.value.toLocaleString() : formatCurrency(card.value)}
                  </h3>
                  <p className="text-sm font-medium text-text-primary">{card.title}</p>
                  <p className="text-xs text-text-secondary">{card.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-text-primary">{donationData.activeCampaigns}</div>
            <div className="text-sm text-text-secondary">Active Campaigns</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-text-primary">{donationData.completedCampaigns}</div>
            <div className="text-sm text-text-secondary">Completed Campaigns</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-text-primary">{formatCurrency(donationData.pendingDonations)}</div>
            <div className="text-sm text-text-secondary">Pending Donations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-text-primary">{donationData.recurringDonors}</div>
            <div className="text-sm text-text-secondary">Recurring Donors</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationSummary;
