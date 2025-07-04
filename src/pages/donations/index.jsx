import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import AlertCenter from '../../components/ui/AlertCenter';
import Icon from '../../components/AppIcon';
import DonationSummary from './components/DonationSummary';
import DonationCharts from './components/DonationCharts';
import DonationHistory from './components/DonationHistory';
import DonationSidebar from './components/DonationSidebar';
import DonationForm from './components/DonationForm';
import Button from '../../components/ui/Button';
import { exportDonationSummaryToPDF, exportDonationSummaryToExcel } from '../../utils/exportUtils';

const Donations = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  React.useEffect(() => {
    const handleToggleSidebarCollapse = () => {
      setIsSidebarCollapsed((prev) => !prev);
    };
    window.addEventListener('toggleSidebarCollapse', handleToggleSidebarCollapse);
    return () => {
      window.removeEventListener('toggleSidebarCollapse', handleToggleSidebarCollapse);
    };
  }, []);

  const handleDonationSubmit = (donationData) => {
    console.log('New donation submitted:', donationData);
    // Here you would typically send the data to your backend API
    // For now, we'll just log it to the console
  };

  // Sample data for export (in a real app, this would come from your state/API)
  const getSummaryData = () => ({
    totalDonations: 2850000,
    totalDonors: 156,
    averageDonation: 18269,
    monthlyDonations: 285000,
    activeCampaigns: 4,
    completedCampaigns: 12,
    pendingDonations: 45000,
    recurringDonors: 89
  });

  const getChartData = () => ({
    monthlyData: [
      { month: 'Jan', donations: 180000, donors: 45 },
      { month: 'Feb', donations: 220000, donors: 52 },
      { month: 'Mar', donations: 195000, donors: 48 },
      { month: 'Apr', donations: 285000, donors: 67 },
      { month: 'May', donations: 310000, donors: 72 },
      { month: 'Jun', donations: 275000, donors: 65 },
      { month: 'Jul', donations: 285000, donors: 69 }
    ],
    campaignData: [
      { name: 'Education Support', raised: 450000, target: 500000, donors: 89 },
      { name: 'Healthcare Initiative', raised: 380000, target: 400000, donors: 67 },
      { name: 'Community Development', raised: 290000, target: 350000, donors: 54 },
      { name: 'Emergency Relief', raised: 180000, target: 200000, donors: 43 }
    ]
  });

  const handleExportSummaryPDF = async () => {
    setIsExporting(true);
    try {
      const summaryData = getSummaryData();
      const chartData = getChartData();
      const result = await exportDonationSummaryToPDF(summaryData, chartData);
      if (result.success) {
        console.log(`Summary PDF exported successfully: ${result.fileName}`);
      } else {
        console.error('Summary PDF export failed:', result.error);
        alert('Failed to export PDF. Please make sure the required libraries are installed.');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please install required packages: npm install jspdf jspdf-autotable');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportSummaryExcel = async () => {
    setIsExporting(true);
    try {
      const summaryData = getSummaryData();
      const chartData = getChartData();
      const result = await exportDonationSummaryToExcel(summaryData, chartData);
      if (result.success) {
        console.log(`Summary Excel exported successfully: ${result.fileName}`);
      } else {
        console.error('Summary Excel export failed:', result.error);
        alert('Failed to export Excel. Please make sure the required libraries are installed.');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please install required packages: npm install xlsx file-saver');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <NavigationSidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        isSidebarCollapsed={isSidebarCollapsed}
        isSidebarVisible={isSidebarVisible}
      />
      
      {/* Main Content */}
      <main className={`${!isSidebarVisible ? 'ml-0' : isSidebarCollapsed ? 'ml-20' : 'ml-64'} pt-16 sm:pt-18 md:pt-20 transition-all duration-200`}>
        <div className="p-6">
          <BreadcrumbNavigation />

          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Icon name="Heart" size={24} color="white" />
                </div>
                <h1 className="text-3xl font-heading font-bold text-text-primary">
                  Donations
                </h1>
              </div>
              <p className="text-text-secondary">
                Manage donations, track fundraising campaigns, and donor relationships
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="primary"
                size="md"
                iconName="Plus"
                iconPosition="left"
                onClick={() => setIsFormOpen(true)}
              >
                Add Donation
              </Button>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="md"
                  iconName="FileText"
                  iconPosition="left"
                  onClick={handleExportSummaryPDF}
                  disabled={isExporting}
                >
                  {isExporting ? 'Exporting...' : 'Export PDF'}
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  iconName="Download"
                  iconPosition="left"
                  onClick={handleExportSummaryExcel}
                  disabled={isExporting}
                >
                  {isExporting ? 'Exporting...' : 'Export Excel'}
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left Content Area */}
            <div className="xl:col-span-9 space-y-6">
              <DonationSummary />
              <DonationCharts />
              <DonationHistory />
            </div>

            {/* Right Sidebar - Donation Stats */}
            <div className="xl:col-span-3">
              <DonationSidebar onAddDonation={() => setIsFormOpen(true)} />
            </div>
          </div>
        </div>
      </main>

      {/* Donation Form Modal */}
      <DonationForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleDonationSubmit}
      />
    </div>
  );
};

export default Donations;
