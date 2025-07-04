import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/ui/Header';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import AlertCenter from '../../components/ui/AlertCenter';
import Icon from '../../components/AppIcon';
import FinancialSummary from './components/FinancialSummary';
import FinancialCharts from './components/FinancialCharts';
import FinancialReportsTable from './components/FinancialReportsTable';
import FinancialSidebar from './components/FinancialSidebar';

const FinancialReports = () => {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  React.useEffect(() => {
    const handleToggleSidebarCollapse = () => {
      setIsSidebarCollapsed((prev) => !prev);
    };
    window.addEventListener('toggleSidebarCollapse', handleToggleSidebarCollapse);
    return () => {
      window.removeEventListener('toggleSidebarCollapse', handleToggleSidebarCollapse);
    };
  }, []);

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
      <main className={`${!isSidebarVisible ? 'ml-0' : isSidebarCollapsed ? 'ml-20' : 'ml-64'} pt-18 transition-all duration-200`}>
        <div className="p-6">
          <BreadcrumbNavigation />

          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Icon name="DollarSign" size={24} color="white" />
                </div>
                <h1 className="text-3xl font-heading font-bold text-text-primary">
                  {t('navigation.finance', 'Financial Reports')}
                </h1>
              </div>
              <p className="text-text-secondary">
                {t('finance.overview', 'Comprehensive financial overview and detailed reporting')}
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left Content Area */}
            <div className="xl:col-span-9 space-y-6">
              <FinancialSummary />
              <FinancialCharts />
              <FinancialReportsTable />
            </div>

            {/* Right Sidebar - Financial Stats */}
            <div className="xl:col-span-3">
              <FinancialSidebar />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`${isSidebarCollapsed ? 'ml-20' : 'ml-60'} bg-surface border-t border-border mt-12`}>
        <div className="px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Dashboard
                </p>
                <p className="text-xs text-text-secondary">
                  Financial Management System
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <div className="flex items-center space-x-4 text-sm text-text-secondary">
                <a href="#" className="hover:text-primary transition-colors duration-150">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-primary transition-colors duration-150">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-primary transition-colors duration-150">
                  Support
                </a>
              </div>
              <div className="text-xs text-text-muted">
                © {new Date().getFullYear()} Rotary Gulmohar. All rights reserved.
              </div>
            </div>
          </div>

          {/* Additional Footer Info */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
              <div>
                <h4 className="text-sm font-medium text-text-primary mb-2">
                  Contact Information
                </h4>
                <p className="text-xs text-text-secondary">
                  Email: admin@dashboard.org
                </p>
                <p className="text-xs text-text-secondary">
                  Phone: +91 98765 43210
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-text-primary mb-2">
                  Club Details
                </h4>
                <p className="text-xs text-text-secondary">
                  Charter Date: 15th March 1995
                </p>
                <p className="text-xs text-text-secondary">
                  District: 3141
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-text-primary mb-2">
                  System Status
                </h4>
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-xs text-success">All systems operational</span>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  Last updated: {new Date().toLocaleTimeString('en-IN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FinancialReports;
