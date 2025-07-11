import React, { useState } from 'react';
import Icon from '../../../../components/AppIcon';

const DonationCharts = () => {
  const [activeTab, setActiveTab] = useState('monthly');

  // Sample data for donation trends
  const monthlyData = [
    { month: 'Jan', donations: 180000, donors: 45 },
    { month: 'Feb', donations: 220000, donors: 52 },
    { month: 'Mar', donations: 195000, donors: 48 },
    { month: 'Apr', donations: 285000, donors: 67 },
    { month: 'May', donations: 310000, donors: 72 },
    { month: 'Jun', donations: 275000, donors: 65 },
    { month: 'Jul', donations: 285000, donors: 69 }
  ];

  // Campaign performance data
  const campaignData = [
    { name: 'Education Support', raised: 450000, target: 500000, donors: 89, color: 'bg-blue-500' },
    { name: 'Healthcare Initiative', raised: 380000, target: 400000, donors: 67, color: 'bg-green-500' },
    { name: 'Community Development', raised: 290000, target: 350000, donors: 54, color: 'bg-purple-500' },
    { name: 'Emergency Relief', raised: 180000, target: 200000, donors: 43, color: 'bg-orange-500' }
  ];

  // Donor categories
  const donorCategories = [
    { category: 'Individual Donors', count: 89, percentage: 57, amount: 1620000 },
    { category: 'Corporate Sponsors', count: 23, percentage: 15, amount: 850000 },
    { category: 'Foundations', count: 12, percentage: 8, amount: 480000 },
    { category: 'Recurring Donors', count: 32, percentage: 20, amount: 900000 }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getProgressPercentage = (raised, target) => {
    return Math.min((raised / target) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Donation Trends Chart */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-heading font-semibold text-text-primary">
              Donation Trends
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              Monthly donation amounts and donor count
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('monthly')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'monthly'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setActiveTab('quarterly')}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'quarterly'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
              }`}
            >
              Quarterly
            </button>
          </div>
        </div>

        {/* Simple Bar Chart Representation */}
        <div className="space-y-4">
          {monthlyData.map((data, index) => {
            const maxDonation = Math.max(...monthlyData.map(d => d.donations));
            const barWidth = (data.donations / maxDonation) * 100;
            
            return (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-8 text-sm font-medium text-text-secondary">{data.month}</div>
                <div className="flex-1 bg-surface-secondary rounded-full h-8 relative">
                  <div 
                    className="bg-gradient-to-r from-primary to-secondary h-full rounded-full flex items-center justify-end pr-3"
                    style={{ width: `${barWidth}%` }}
                  >
                    <span className="text-xs font-medium text-white">
                      {formatCurrency(data.donations)}
                    </span>
                  </div>
                </div>
                <div className="w-16 text-sm text-text-secondary text-right">
                  {data.donors} donors
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Campaign Performance */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-heading font-semibold text-text-primary">
              Active Campaigns
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              Current fundraising campaign progress
            </p>
          </div>
          <Icon name="Target" size={20} className="text-text-muted" />
        </div>

        <div className="space-y-6">
          {campaignData.map((campaign, index) => {
            const progressPercentage = getProgressPercentage(campaign.raised, campaign.target);
            
            return (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${campaign.color}`}></div>
                    <span className="font-medium text-text-primary">{campaign.name}</span>
                  </div>
                  <div className="text-sm text-text-secondary">
                    {campaign.donors} donors
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">
                      {formatCurrency(campaign.raised)} raised
                    </span>
                    <span className="text-text-secondary">
                      Goal: {formatCurrency(campaign.target)}
                    </span>
                  </div>
                  <div className="w-full bg-surface-secondary rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${campaign.color}`}
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-xs text-text-muted">
                    {progressPercentage.toFixed(1)}% complete
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Donor Categories */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-heading font-semibold text-text-primary">
              Donor Categories
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              Breakdown of donors by category
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {donorCategories.map((category, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{category.percentage}%</span>
                </div>
                <div>
                  <div className="font-medium text-text-primary">{category.category}</div>
                  <div className="text-sm text-text-secondary">{category.count} donors</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-text-primary">{formatCurrency(category.amount)}</div>
                <div className="text-sm text-text-secondary">Total contributed</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonationCharts;
