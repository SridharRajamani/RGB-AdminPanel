import React from 'react';
import Icon from '../../../components/AppIcon';

const FinancialSummary = () => {
  const financialData = {
    totalIncome: 1250000,
    totalExpenses: 875000,
    currentBalance: 375000,
    budgetUtilization: 70,
    monthlyIncome: 125000,
    monthlyExpenses: 87500,
    pendingPayments: 45000,
    upcomingBudget: 200000
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
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
      title: 'Total Income',
      value: financialData.totalIncome,
      icon: 'TrendingUp',
      color: 'success',
      change: getPercentageChange(financialData.totalIncome, 1100000),
      description: 'Year to date income'
    },
    {
      title: 'Total Expenses',
      value: financialData.totalExpenses,
      icon: 'TrendingDown',
      color: 'error',
      change: getPercentageChange(financialData.totalExpenses, 950000),
      description: 'Year to date expenses'
    },
    {
      title: 'Current Balance',
      value: financialData.currentBalance,
      icon: 'Wallet',
      color: 'primary',
      change: getPercentageChange(financialData.currentBalance, 300000),
      description: 'Available funds'
    },
    {
      title: 'Budget Utilization',
      value: `${financialData.budgetUtilization}%`,
      icon: 'PieChart',
      color: 'warning',
      change: { value: '5.2', isPositive: true },
      description: 'Of annual budget used'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      success: {
        bg: 'bg-success/10',
        text: 'text-success',
        border: 'border-success/20'
      },
      error: {
        bg: 'bg-error/10',
        text: 'text-error',
        border: 'border-error/20'
      },
      primary: {
        bg: 'bg-primary/10',
        text: 'text-primary',
        border: 'border-primary/20'
      },
      warning: {
        bg: 'bg-warning/10',
        text: 'text-warning',
        border: 'border-warning/20'
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
              Financial Overview
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Key financial metrics and performance indicators
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card, index) => {
            const colors = getColorClasses(card.color);

            return (
              <div
                key={index}
                className={`bg-surface-secondary border ${colors.border} rounded-lg p-4 hover:shadow-md transition-all duration-200`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                    <Icon name={card.icon} size={20} className={colors.text} />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm ${
                    card.change.isPositive ? 'text-success' : 'text-error'
                  }`}>
                    <Icon
                      name={card.change.isPositive ? 'ArrowUp' : 'ArrowDown'}
                      size={14}
                    />
                    <span className="font-medium">{card.change.value}%</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-text-secondary">
                    {card.title}
                  </h3>
                  <p className="text-xl font-heading font-bold text-text-primary">
                    {typeof card.value === 'number' ? formatCurrency(card.value) : card.value}
                  </p>
                  <p className="text-xs text-text-muted">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-surface-secondary border border-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="Calendar" size={20} className="text-primary" />
              <div>
                <p className="text-sm font-medium text-text-primary">Monthly Income</p>
                <p className="text-lg font-semibold text-success">
                  {formatCurrency(financialData.monthlyIncome)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface-secondary border border-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="CreditCard" size={20} className="text-error" />
              <div>
                <p className="text-sm font-medium text-text-primary">Monthly Expenses</p>
                <p className="text-lg font-semibold text-error">
                  {formatCurrency(financialData.monthlyExpenses)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface-secondary border border-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="Clock" size={20} className="text-warning" />
              <div>
                <p className="text-sm font-medium text-text-primary">Pending Payments</p>
                <p className="text-lg font-semibold text-warning">
                  {formatCurrency(financialData.pendingPayments)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface-secondary border border-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="Target" size={20} className="text-primary" />
              <div>
                <p className="text-sm font-medium text-text-primary">Upcoming Budget</p>
                <p className="text-lg font-semibold text-primary">
                  {formatCurrency(financialData.upcomingBudget)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;
