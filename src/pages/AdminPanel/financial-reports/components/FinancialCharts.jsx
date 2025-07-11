import React, { useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import Icon from '../../../../components/AppIcon';

const FinancialCharts = () => {
  const [activeChart, setActiveChart] = useState('income-expense');

  // Sample data for charts
  const monthlyData = [
    { month: 'Jan', income: 120000, expenses: 85000, balance: 35000 },
    { month: 'Feb', income: 135000, expenses: 92000, balance: 43000 },
    { month: 'Mar', income: 125000, expenses: 88000, balance: 37000 },
    { month: 'Apr', income: 140000, expenses: 95000, balance: 45000 },
    { month: 'May', income: 130000, expenses: 87000, balance: 43000 },
    { month: 'Jun', income: 145000, expenses: 98000, balance: 47000 },
    { month: 'Jul', income: 138000, expenses: 91000, balance: 47000 },
    { month: 'Aug', income: 142000, expenses: 89000, balance: 53000 },
    { month: 'Sep', income: 135000, expenses: 93000, balance: 42000 },
    { month: 'Oct', income: 148000, expenses: 96000, balance: 52000 },
    { month: 'Nov', income: 152000, expenses: 99000, balance: 53000 },
    { month: 'Dec', income: 155000, expenses: 102000, balance: 53000 }
  ];

  const budgetAllocation = [
    { name: 'Community Projects', value: 450000, color: '#3B82F6' },
    { name: 'Administrative', value: 180000, color: '#10B981' },
    { name: 'Events & Meetings', value: 220000, color: '#F59E0B' },
    { name: 'Fundraising', value: 150000, color: '#EF4444' },
    { name: 'International Projects', value: 200000, color: '#8B5CF6' },
    { name: 'Emergency Fund', value: 100000, color: '#6B7280' }
  ];

  const expenseCategories = [
    { category: 'Community Projects', amount: 320000, budget: 450000 },
    { category: 'Administrative', amount: 165000, budget: 180000 },
    { category: 'Events & Meetings', amount: 195000, budget: 220000 },
    { category: 'Fundraising', amount: 125000, budget: 150000 },
    { category: 'International Projects', amount: 180000, budget: 200000 },
    { category: 'Emergency Fund', amount: 15000, budget: 100000 }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-text-primary mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartTabs = [
    { id: 'income-expense', label: 'Income vs Expenses', icon: 'TrendingUp' },
    { id: 'budget-allocation', label: 'Budget Allocation', icon: 'PieChart' },
    { id: 'category-spending', label: 'Category Spending', icon: 'BarChart3' }
  ];

  const renderChart = () => {
    switch (activeChart) {
      case 'income-expense':
        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" tickFormatter={formatCurrency} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#incomeGradient)"
                  name="Income"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#EF4444"
                  fillOpacity={1}
                  fill="url(#expenseGradient)"
                  name="Expenses"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );

      case 'budget-allocation':
        return (
          <div className="h-80 flex items-center">
            <div className="w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgetAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {budgetAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 pl-6">
              <div className="space-y-3">
                {budgetAllocation.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-text-primary">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-text-primary">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'category-spending':
        return (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseCategories} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="category" 
                  stroke="#6B7280" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#6B7280" tickFormatter={formatCurrency} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="budget" fill="#E5E7EB" name="Budget" />
                <Bar dataKey="amount" fill="#3B82F6" name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mb-8">
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-semibold text-text-primary">
              Financial Analytics
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Visual representation of financial data and trends
            </p>
          </div>
        </div>

        {/* Chart Tabs */}
        <div className="flex space-x-1 mb-6 bg-background rounded-lg p-1">
          {chartTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveChart(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                activeChart === tab.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Chart Content */}
        {renderChart()}
      </div>
    </div>
  );
};

export default FinancialCharts;
