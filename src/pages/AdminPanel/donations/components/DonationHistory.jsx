import React, { useState } from 'react';
import Icon from '../../../../components/AppIcon';
import Button from '../../../../components/ui/Button';
import { exportDonationHistoryToPDF, exportDonationHistoryToExcel } from '../../../../utils/exportUtils';
import useCoolAlert from '../../../../hooks/useCoolAlert';

const DonationHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const itemsPerPage = 10;
  const { showAlert } = useCoolAlert();

  // Sample donation data
  const donations = [
    {
      id: 'DON-2024-001',
      donorName: 'Rajesh Kumar',
      donorEmail: 'rajesh.kumar@email.com',
      amount: 25000,
      campaign: 'Education Support',
      type: 'individual',
      method: 'online',
      status: 'completed',
      date: '2024-01-15',
      reference: 'TXN123456789',
      notes: 'Monthly recurring donation'
    },
    {
      id: 'DON-2024-002',
      donorName: 'Tech Solutions Pvt Ltd',
      donorEmail: 'csr@techsolutions.com',
      amount: 100000,
      campaign: 'Healthcare Initiative',
      type: 'corporate',
      method: 'bank_transfer',
      status: 'completed',
      date: '2024-01-12',
      reference: 'CSR2024001',
      notes: 'Corporate CSR contribution'
    },
    {
      id: 'DON-2024-003',
      donorName: 'Priya Sharma',
      donorEmail: 'priya.sharma@email.com',
      amount: 15000,
      campaign: 'Community Development',
      type: 'individual',
      method: 'cheque',
      status: 'pending',
      date: '2024-01-10',
      reference: 'CHQ789012',
      notes: 'Cheque clearance pending'
    },
    {
      id: 'DON-2024-004',
      donorName: 'Helping Hands Foundation',
      donorEmail: 'grants@helpinghands.org',
      amount: 75000,
      campaign: 'Emergency Relief',
      type: 'foundation',
      method: 'online',
      status: 'completed',
      date: '2024-01-08',
      reference: 'GRANT2024A',
      notes: 'Emergency relief grant'
    },
    {
      id: 'DON-2024-005',
      donorName: 'Amit Patel',
      donorEmail: 'amit.patel@email.com',
      amount: 5000,
      campaign: 'Education Support',
      type: 'individual',
      method: 'cash',
      status: 'completed',
      date: '2024-01-05',
      reference: 'CASH001',
      notes: 'Cash donation at event'
    },
    {
      id: 'DON-2024-006',
      donorName: 'Global Corp Industries',
      donorEmail: 'donations@globalcorp.com',
      amount: 50000,
      campaign: 'Healthcare Initiative',
      type: 'corporate',
      method: 'online',
      status: 'failed',
      date: '2024-01-03',
      reference: 'FAIL123',
      notes: 'Payment gateway error'
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
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      completed: 'text-success-600 bg-success-50',
      pending: 'text-warning-600 bg-warning-50',
      failed: 'text-error-600 bg-error-50'
    };
    return statusColors[status] || 'text-text-muted bg-surface-secondary';
  };

  const getTypeIcon = (type) => {
    const typeIcons = {
      individual: 'User',
      corporate: 'Building',
      foundation: 'Award'
    };
    return typeIcons[type] || 'User';
  };

  const getMethodIcon = (method) => {
    const methodIcons = {
      online: 'CreditCard',
      bank_transfer: 'Banknote',
      cheque: 'FileText',
      cash: 'Wallet'
    };
    return methodIcons[method] || 'CreditCard';
  };

  // Filter donations
  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || donation.status === filterStatus;
    const matchesType = filterType === 'all' || donation.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDonations = filteredDonations.slice(startIndex, startIndex + itemsPerPage);

  // Export functions
  const handleExportPDF = async () => {
    setIsExporting(true);

    // Show loading alert
    showAlert({
      type: 'loading',
      title: 'Generating PDF...',
      message: 'Please wait while we create your donation history report.',
      autoClose: false
    });

    try {
      const filters = {
        searchTerm,
        status: filterStatus,
        type: filterType
      };
      const result = await exportDonationHistoryToPDF(filteredDonations, filters);
      if (result.success) {
        console.log(`PDF exported successfully: ${result.fileName}`);
        showAlert({
          type: 'celebration',
          title: 'PDF Export Successful! 🎉',
          message: `Your donation history report "${result.fileName}" has been downloaded successfully!`,
          autoClose: 5000
        });
      } else {
        console.error('PDF export failed:', result.error);
        showAlert({
          type: 'urgent',
          title: 'PDF Export Failed',
          message: 'Failed to generate PDF report. Please try again or contact support if the issue persists.',
          autoClose: 8000
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      showAlert({
        type: 'urgent',
        title: 'Export Error',
        message: 'An unexpected error occurred while generating the PDF. Please refresh the page and try again.',
        autoClose: 8000
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    setIsExporting(true);

    // Show loading alert
    showAlert({
      type: 'loading',
      title: 'Generating Excel...',
      message: 'Please wait while we create your donation history spreadsheet.',
      autoClose: false
    });

    try {
      const filters = {
        searchTerm,
        status: filterStatus,
        type: filterType
      };
      const result = await exportDonationHistoryToExcel(filteredDonations, filters);
      if (result.success) {
        console.log(`Excel exported successfully: ${result.fileName}`);
        showAlert({
          type: 'celebration',
          title: 'Excel Export Successful! 📊',
          message: `Your donation history spreadsheet "${result.fileName}" has been downloaded successfully!`,
          autoClose: 5000
        });
      } else {
        console.error('Excel export failed:', result.error);
        showAlert({
          type: 'urgent',
          title: 'Excel Export Failed',
          message: 'Failed to generate Excel spreadsheet. Please try again or contact support if the issue persists.',
          autoClose: 8000
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      showAlert({
        type: 'urgent',
        title: 'Export Error',
        message: 'An unexpected error occurred while generating the Excel file. Please refresh the page and try again.',
        autoClose: 8000
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="mb-8">
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-semibold text-text-primary">
              Donation History
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Complete record of all donations with filtering and search
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="FileText"
              iconPosition="left"
              onClick={handleExportPDF}
              disabled={isExporting}
            >
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={handleExportExcel}
              disabled={isExporting}
            >
              {isExporting ? 'Exporting...' : 'Export Excel'}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search donations, donors, or campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-surface text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Types</option>
            <option value="individual">Individual</option>
            <option value="corporate">Corporate</option>
            <option value="foundation">Foundation</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Donation ID</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Donor</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Campaign</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Method</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Status</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Date</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDonations.map((donation) => (
                <tr key={donation.id} className="border-b border-border hover:bg-surface-secondary">
                  <td className="py-3 px-4 text-sm font-medium text-text-primary">
                    {donation.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <Icon name={getTypeIcon(donation.type)} size={16} color="white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-text-primary">{donation.donorName}</div>
                        <div className="text-xs text-text-secondary">{donation.donorEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-text-primary">
                    {formatCurrency(donation.amount)}
                  </td>
                  <td className="py-3 px-4 text-sm text-text-primary">
                    {donation.campaign}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Icon name={getMethodIcon(donation.method)} size={16} className="text-text-muted" />
                      <span className="text-sm text-text-primary capitalize">
                        {donation.method.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                      {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-text-secondary">
                    {formatDate(donation.date)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Eye"
                        className="text-text-muted hover:text-text-primary"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Download"
                        className="text-text-muted hover:text-text-primary"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-text-secondary">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredDonations.length)} of {filteredDonations.length} donations
            </div>
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

export default DonationHistory;
