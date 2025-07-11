import React, { useState } from 'react';
import Icon from '../../../../components/AppIcon';
import Button from '../../../../components/ui/Button';

const DonationSidebar = ({ onAddDonation }) => {
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Quick donation stats
  const quickStats = {
    thisMonth: {
      donations: 285000,
      lastMonth: 245000,
      trend: 'up'
    },
    pendingDonations: 3,
    newDonors: 12,
    recurringDonations: 8
  };

  // Recent donations
  const recentDonations = [
    {
      id: 1,
      donorName: 'Rajesh Kumar',
      amount: 25000,
      date: '2024-01-15',
      campaign: 'Education Support',
      type: 'recurring'
    },
    {
      id: 2,
      donorName: 'Tech Solutions Ltd',
      amount: 100000,
      date: '2024-01-12',
      campaign: 'Healthcare Initiative',
      type: 'corporate'
    },
    {
      id: 3,
      donorName: 'Priya Sharma',
      amount: 15000,
      date: '2024-01-10',
      campaign: 'Community Development',
      type: 'individual'
    },
    {
      id: 4,
      donorName: 'Helping Hands Foundation',
      amount: 75000,
      date: '2024-01-08',
      campaign: 'Emergency Relief',
      type: 'foundation'
    }
  ];

  // Donation alerts
  const donationAlerts = [
    {
      id: 1,
      type: 'pending_donation',
      title: 'Pending Donation Review',
      message: 'Large donation of ₹1,00,000 from Tech Corp requires approval',
      priority: 'high',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      type: 'campaign_milestone',
      title: 'Campaign Milestone Reached',
      message: 'Education Support campaign reached 90% of target goal',
      priority: 'medium',
      timestamp: '5 hours ago'
    },
    {
      id: 3,
      type: 'recurring_failed',
      title: 'Recurring Donation Failed',
      message: 'Monthly donation from Amit Patel failed due to insufficient funds',
      priority: 'medium',
      timestamp: '1 day ago'
    }
  ];

  // Top donors this month
  const topDonors = [
    { name: 'Tech Solutions Ltd', amount: 150000, donations: 2 },
    { name: 'Helping Hands Foundation', amount: 125000, donations: 3 },
    { name: 'Global Corp Industries', amount: 100000, donations: 1 },
    { name: 'Rajesh Kumar', amount: 75000, donations: 3 }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getAlertIcon = (type) => {
    const icons = {
      pending_donation: 'Clock',
      campaign_milestone: 'Target',
      recurring_failed: 'AlertTriangle'
    };
    return icons[type] || 'Bell';
  };

  const getAlertColor = (priority) => {
    const colors = {
      high: 'text-error-600 bg-error-50',
      medium: 'text-warning-600 bg-warning-50',
      low: 'text-success-600 bg-success-50'
    };
    return colors[priority] || 'text-text-muted bg-surface-secondary';
  };

  const getDonationTypeIcon = (type) => {
    const icons = {
      individual: 'User',
      corporate: 'Building',
      foundation: 'Award',
      recurring: 'RotateCcw'
    };
    return icons[type] || 'Heart';
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
          Quick Stats
        </h3>
        
        <div className="space-y-4">
          {/* This Month Donations */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
            <div>
              <div className="text-2xl font-bold text-text-primary">
                {formatCurrency(quickStats.thisMonth.donations)}
              </div>
              <div className="text-sm text-text-secondary">This Month</div>
              <div className="flex items-center mt-1">
                <Icon 
                  name={quickStats.thisMonth.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                  size={14} 
                  className={quickStats.thisMonth.trend === 'up' ? 'text-success-600' : 'text-error-600'}
                />
                <span className={`text-xs ml-1 ${quickStats.thisMonth.trend === 'up' ? 'text-success-600' : 'text-error-600'}`}>
                  {((quickStats.thisMonth.donations - quickStats.thisMonth.lastMonth) / quickStats.thisMonth.lastMonth * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <Icon name="TrendingUp" size={32} className="text-primary" />
          </div>

          {/* Quick Action Items */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-surface-secondary rounded-lg">
              <div className="text-lg font-bold text-error-600">{quickStats.pendingDonations}</div>
              <div className="text-xs text-text-secondary">Pending</div>
            </div>
            <div className="text-center p-3 bg-surface-secondary rounded-lg">
              <div className="text-lg font-bold text-success-600">{quickStats.newDonors}</div>
              <div className="text-xs text-text-secondary">New Donors</div>
            </div>
            <div className="text-center p-3 bg-surface-secondary rounded-lg">
              <div className="text-lg font-bold text-primary">{quickStats.recurringDonations}</div>
              <div className="text-xs text-text-secondary">Recurring</div>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Alerts */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-text-primary">
            Donation Alerts
          </h3>
          <Icon name="Bell" size={18} className="text-text-muted" />
        </div>
        
        <div className="space-y-3">
          {donationAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-3 border border-border rounded-lg hover:bg-surface-secondary cursor-pointer transition-colors"
              onClick={() => setSelectedAlert(alert.id === selectedAlert ? null : alert.id)}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getAlertColor(alert.priority)}`}>
                  <Icon name={getAlertIcon(alert.type)} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary">{alert.title}</div>
                  <div className="text-xs text-text-secondary mt-1">{alert.timestamp}</div>
                  {selectedAlert === alert.id && (
                    <div className="text-xs text-text-secondary mt-2 p-2 bg-surface-secondary rounded">
                      {alert.message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Donations */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-text-primary">
            Recent Donations
          </h3>
          <Button variant="ghost" size="sm" iconName="ExternalLink" />
        </div>
        
        <div className="space-y-3">
          {recentDonations.map((donation) => (
            <div key={donation.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <Icon name={getDonationTypeIcon(donation.type)} size={16} color="white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-text-primary">{donation.donorName}</div>
                  <div className="text-xs text-text-secondary">{donation.campaign}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-text-primary">{formatCurrency(donation.amount)}</div>
                <div className="text-xs text-text-secondary">{formatDate(donation.date)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Donors */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-text-primary">
            Top Donors This Month
          </h3>
          <Icon name="Award" size={18} className="text-text-muted" />
        </div>
        
        <div className="space-y-3">
          {topDonors.map((donor, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">#{index + 1}</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-text-primary">{donor.name}</div>
                  <div className="text-xs text-text-secondary">{donor.donations} donations</div>
                </div>
              </div>
              <div className="text-sm font-semibold text-text-primary">
                {formatCurrency(donor.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
          Quick Actions
        </h3>
        
        <div className="space-y-3">
          <Button
            variant="primary"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            className="w-full"
            onClick={onAddDonation}
          >
            Add New Donation
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Users"
            iconPosition="left"
            className="w-full"
          >
            Manage Donors
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Target"
            iconPosition="left"
            className="w-full"
          >
            Create Campaign
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            className="w-full"
          >
            Export Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DonationSidebar;
