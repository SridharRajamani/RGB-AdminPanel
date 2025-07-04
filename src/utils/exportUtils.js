// Export utilities for PDF and Excel generation
// Note: Requires installation of: npm install jspdf jspdf-autotable xlsx file-saver

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Format currency for display
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format date for display
 */
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Export donation history to PDF
 */
export const exportDonationHistoryToPDF = (donations, filters = {}) => {
  try {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.setTextColor(37, 37, 105); // Primary color
    doc.text('Rotary Club - Donation History Report', 20, 20);
    
    // Add generation date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 20, 30);
    
    // Add filters info if any
    let yPosition = 40;
    if (filters.searchTerm || filters.status !== 'all' || filters.type !== 'all') {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Applied Filters:', 20, yPosition);
      yPosition += 10;
      
      if (filters.searchTerm) {
        doc.setFontSize(10);
        doc.text(`Search: ${filters.searchTerm}`, 25, yPosition);
        yPosition += 8;
      }
      if (filters.status !== 'all') {
        doc.setFontSize(10);
        doc.text(`Status: ${filters.status}`, 25, yPosition);
        yPosition += 8;
      }
      if (filters.type !== 'all') {
        doc.setFontSize(10);
        doc.text(`Type: ${filters.type}`, 25, yPosition);
        yPosition += 8;
      }
      yPosition += 5;
    }
    
    // Prepare table data
    const tableColumns = [
      'Donation ID',
      'Donor Name',
      'Amount',
      'Campaign',
      'Method',
      'Status',
      'Date'
    ];
    
    const tableRows = donations.map(donation => [
      donation.id,
      donation.donorName,
      formatCurrency(donation.amount),
      donation.campaign,
      donation.method.replace('_', ' '),
      donation.status.charAt(0).toUpperCase() + donation.status.slice(1),
      formatDate(donation.date)
    ]);
    
    // Add table
    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: yPosition,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [37, 37, 105],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        2: { halign: 'right' }, // Amount column
        6: { halign: 'center' }  // Date column
      }
    });
    
    // Add summary at the bottom
    const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0);
    const finalY = doc.lastAutoTable.finalY + 20;
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Summary:', 20, finalY);
    doc.setFontSize(10);
    doc.text(`Total Donations: ${donations.length}`, 25, finalY + 10);
    doc.text(`Total Amount: ${formatCurrency(totalAmount)}`, 25, finalY + 20);
    
    // Save the PDF
    const fileName = `donation-history-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    return { success: true, fileName };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Export donation history to Excel
 */
export const exportDonationHistoryToExcel = (donations, filters = {}) => {
  try {
    // Prepare data for Excel
    const excelData = donations.map(donation => ({
      'Donation ID': donation.id,
      'Donor Name': donation.donorName,
      'Donor Email': donation.donorEmail,
      'Amount (₹)': donation.amount,
      'Campaign': donation.campaign,
      'Type': donation.type,
      'Payment Method': donation.method.replace('_', ' '),
      'Status': donation.status.charAt(0).toUpperCase() + donation.status.slice(1),
      'Date': formatDate(donation.date),
      'Reference': donation.reference || '',
      'Notes': donation.notes || ''
    }));
    
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Set column widths
    const colWidths = [
      { wch: 15 }, // Donation ID
      { wch: 25 }, // Donor Name
      { wch: 30 }, // Donor Email
      { wch: 12 }, // Amount
      { wch: 20 }, // Campaign
      { wch: 12 }, // Type
      { wch: 15 }, // Payment Method
      { wch: 10 }, // Status
      { wch: 12 }, // Date
      { wch: 15 }, // Reference
      { wch: 30 }  // Notes
    ];
    ws['!cols'] = colWidths;
    
    // Add summary sheet
    const summaryData = [
      { Metric: 'Total Donations', Value: donations.length },
      { Metric: 'Total Amount (₹)', Value: donations.reduce((sum, d) => sum + d.amount, 0) },
      { Metric: 'Completed Donations', Value: donations.filter(d => d.status === 'completed').length },
      { Metric: 'Pending Donations', Value: donations.filter(d => d.status === 'pending').length },
      { Metric: 'Failed Donations', Value: donations.filter(d => d.status === 'failed').length },
      { Metric: 'Individual Donors', Value: donations.filter(d => d.type === 'individual').length },
      { Metric: 'Corporate Donors', Value: donations.filter(d => d.type === 'corporate').length },
      { Metric: 'Foundation Donors', Value: donations.filter(d => d.type === 'foundation').length }
    ];
    
    const summaryWs = XLSX.utils.json_to_sheet(summaryData);
    summaryWs['!cols'] = [{ wch: 20 }, { wch: 15 }];
    
    // Add worksheets to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Donation History');
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');
    
    // Add filters info if any
    if (filters.searchTerm || filters.status !== 'all' || filters.type !== 'all') {
      const filtersData = [];
      if (filters.searchTerm) filtersData.push({ Filter: 'Search Term', Value: filters.searchTerm });
      if (filters.status !== 'all') filtersData.push({ Filter: 'Status', Value: filters.status });
      if (filters.type !== 'all') filtersData.push({ Filter: 'Type', Value: filters.type });
      
      const filtersWs = XLSX.utils.json_to_sheet(filtersData);
      filtersWs['!cols'] = [{ wch: 15 }, { wch: 20 }];
      XLSX.utils.book_append_sheet(wb, filtersWs, 'Applied Filters');
    }
    
    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    const fileName = `donation-history-${new Date().toISOString().split('T')[0]}.xlsx`;
    saveAs(data, fileName);
    
    return { success: true, fileName };
  } catch (error) {
    console.error('Error generating Excel:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Export donation summary report to PDF
 */
export const exportDonationSummaryToPDF = (summaryData, chartData) => {
  try {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.setTextColor(37, 37, 105);
    doc.text('Rotary Club - Donation Summary Report', 20, 20);
    
    // Add generation date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 20, 30);
    
    let yPosition = 50;
    
    // Summary metrics
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Key Metrics', 20, yPosition);
    yPosition += 15;
    
    const metrics = [
      ['Total Donations', formatCurrency(summaryData.totalDonations)],
      ['Total Donors', summaryData.totalDonors.toString()],
      ['Average Donation', formatCurrency(summaryData.averageDonation)],
      ['Monthly Donations', formatCurrency(summaryData.monthlyDonations)],
      ['Active Campaigns', summaryData.activeCampaigns.toString()],
      ['Completed Campaigns', summaryData.completedCampaigns.toString()],
      ['Pending Donations', formatCurrency(summaryData.pendingDonations)],
      ['Recurring Donors', summaryData.recurringDonors.toString()]
    ];
    
    doc.autoTable({
      body: metrics,
      startY: yPosition,
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { halign: 'right', cellWidth: 60 }
      },
      theme: 'grid'
    });
    
    // Campaign performance
    if (chartData && chartData.campaignData) {
      yPosition = doc.lastAutoTable.finalY + 20;
      doc.setFontSize(16);
      doc.text('Campaign Performance', 20, yPosition);
      yPosition += 15;
      
      const campaignRows = chartData.campaignData.map(campaign => [
        campaign.name,
        formatCurrency(campaign.raised),
        formatCurrency(campaign.target),
        `${((campaign.raised / campaign.target) * 100).toFixed(1)}%`,
        campaign.donors.toString()
      ]);
      
      doc.autoTable({
        head: [['Campaign', 'Raised', 'Target', 'Progress', 'Donors']],
        body: campaignRows,
        startY: yPosition,
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [37, 37, 105],
          textColor: 255,
          fontStyle: 'bold'
        },
        columnStyles: {
          1: { halign: 'right' },
          2: { halign: 'right' },
          3: { halign: 'center' },
          4: { halign: 'center' }
        }
      });
    }
    
    // Save the PDF
    const fileName = `donation-summary-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    return { success: true, fileName };
  } catch (error) {
    console.error('Error generating summary PDF:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Export donation summary to Excel
 */
export const exportDonationSummaryToExcel = (summaryData, chartData) => {
  try {
    const wb = XLSX.utils.book_new();
    
    // Summary metrics sheet
    const metricsData = [
      { Metric: 'Total Donations', Value: summaryData.totalDonations },
      { Metric: 'Total Donors', Value: summaryData.totalDonors },
      { Metric: 'Average Donation', Value: summaryData.averageDonation },
      { Metric: 'Monthly Donations', Value: summaryData.monthlyDonations },
      { Metric: 'Active Campaigns', Value: summaryData.activeCampaigns },
      { Metric: 'Completed Campaigns', Value: summaryData.completedCampaigns },
      { Metric: 'Pending Donations', Value: summaryData.pendingDonations },
      { Metric: 'Recurring Donors', Value: summaryData.recurringDonors }
    ];
    
    const metricsWs = XLSX.utils.json_to_sheet(metricsData);
    metricsWs['!cols'] = [{ wch: 20 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, metricsWs, 'Summary Metrics');
    
    // Campaign performance sheet
    if (chartData && chartData.campaignData) {
      const campaignData = chartData.campaignData.map(campaign => ({
        'Campaign Name': campaign.name,
        'Amount Raised (₹)': campaign.raised,
        'Target Amount (₹)': campaign.target,
        'Progress (%)': ((campaign.raised / campaign.target) * 100).toFixed(1),
        'Number of Donors': campaign.donors
      }));
      
      const campaignWs = XLSX.utils.json_to_sheet(campaignData);
      campaignWs['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, campaignWs, 'Campaign Performance');
    }
    
    // Monthly trends sheet
    if (chartData && chartData.monthlyData) {
      const monthlyData = chartData.monthlyData.map(data => ({
        'Month': data.month,
        'Donations (₹)': data.donations,
        'Number of Donors': data.donors
      }));
      
      const monthlyWs = XLSX.utils.json_to_sheet(monthlyData);
      monthlyWs['!cols'] = [{ wch: 10 }, { wch: 15 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, monthlyWs, 'Monthly Trends');
    }
    
    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    const fileName = `donation-summary-${new Date().toISOString().split('T')[0]}.xlsx`;
    saveAs(data, fileName);
    
    return { success: true, fileName };
  } catch (error) {
    console.error('Error generating summary Excel:', error);
    return { success: false, error: error.message };
  }
};
