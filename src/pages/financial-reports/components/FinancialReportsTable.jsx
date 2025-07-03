import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FinancialReportsTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sample transaction data
  const transactions = [
    {
      id: 'TXN001',
      date: '2024-01-15',
      description: 'Community Health Camp - Medical Supplies',
      category: 'Community Projects',
      type: 'expense',
      amount: 25000,
      status: 'completed',
      reference: 'INV-2024-001'
    },
    {
      id: 'TXN002',
      date: '2024-01-12',
      description: 'Membership Fees - Q1 2024',
      category: 'Membership',
      type: 'income',
      amount: 45000,
      status: 'completed',
      reference: 'REC-2024-001'
    },
    {
      id: 'TXN003',
      date: '2024-01-10',
      description: 'Annual Fundraising Gala - Venue Booking',
      category: 'Events & Meetings',
      type: 'expense',
      amount: 75000,
      status: 'pending',
      reference: 'INV-2024-002'
    },
    {
      id: 'TXN004',
      date: '2024-01-08',
      description: 'Corporate Sponsorship - ABC Company',
      category: 'Fundraising',
      type: 'income',
      amount: 100000,
      status: 'completed',
      reference: 'REC-2024-002'
    },
    {
      id: 'TXN005',
      date: '2024-01-05',
      description: 'Office Rent - January 2024',
      category: 'Administrative',
      type: 'expense',
      amount: 15000,
      status: 'completed',
      reference: 'INV-2024-003'
    },
    {
      id: 'TXN006',
      date: '2024-01-03',
      description: 'International Project - Water Well Construction',
      category: 'International Projects',
      type: 'expense',
      amount: 150000,
      status: 'approved',
      reference: 'INV-2024-004'
    },
    {
      id: 'TXN007',
      date: '2024-01-01',
      description: 'New Year Celebration - Catering',
      category: 'Events & Meetings',
      type: 'expense',
      amount: 12000,
      status: 'completed',
      reference: 'INV-2024-005'
    },
    {
      id: 'TXN008',
      date: '2023-12-28',
      description: 'Year-end Donation - Local Charity',
      category: 'Community Projects',
      type: 'expense',
      amount: 50000,
      status: 'completed',
      reference: 'INV-2023-099'
    }
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
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      completed: 'bg-success/10 text-success border-success/20',
      pending: 'bg-warning/10 text-warning border-warning/20',
      approved: 'bg-primary/10 text-primary border-primary/20',
      rejected: 'bg-error/10 text-error border-error/20'
    };
    return statusColors[status] || statusColors.pending;
  };

  const getTypeColor = (type) => {
    return type === 'income' 
      ? 'text-success' 
      : 'text-error';
  };

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || transaction.type === filterType;
      const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
      
      return matchesSearch && matchesType && matchesCategory;
    });

    // Sort transactions
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortConfig.key === 'amount') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [transactions, searchTerm, filterType, filterCategory, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredAndSortedTransactions.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const categories = [...new Set(transactions.map(t => t.category))];

  return (
    <div className="mb-8">
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-semibold text-text-primary">
              Transaction History
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Detailed financial transaction records with filtering and search
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            iconName="Download"
            iconPosition="left"
          >
            Export Report
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Icon 
                name="Search" 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" 
              />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-text-secondary">
                  <button
                    onClick={() => handleSort('date')}
                    className="flex items-center space-x-1 hover:text-text-primary"
                  >
                    <span>Date</span>
                    <Icon name="ArrowUpDown" size={14} />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Description</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Category</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">
                  <button
                    onClick={() => handleSort('amount')}
                    className="flex items-center space-x-1 hover:text-text-primary"
                  >
                    <span>Amount</span>
                    <Icon name="ArrowUpDown" size={14} />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Status</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Reference</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-border hover:bg-surface-secondary">
                  <td className="py-3 px-4 text-sm text-text-primary">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Icon 
                        name={transaction.type === 'income' ? 'ArrowDownLeft' : 'ArrowUpRight'} 
                        size={16} 
                        className={getTypeColor(transaction.type)}
                      />
                      <span className="text-sm text-text-primary">{transaction.description}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-text-secondary">
                    {transaction.category}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-sm font-medium ${getTypeColor(transaction.type)}`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-text-muted">
                    {transaction.reference}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-text-secondary">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAndSortedTransactions.length)} of {filteredAndSortedTransactions.length} transactions
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                iconName="ChevronLeft"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              />
              <span className="text-sm text-text-primary">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                iconName="ChevronRight"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialReportsTable;
