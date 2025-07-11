// Export utilities for PDF and Excel generation
// Note: Requires installation of: npm install jspdf jspdf-autotable xlsx file-saver

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
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
 * Format phone number for display
 */
const formatPhone = (phone) => {
  return phone || 'N/A';
};

/**
 * Get status display text
 */
const getStatusText = (status) => {
  const statusMap = {
    'active': 'Active',
    'inactive': 'Inactive',
    'pending': 'Pending',
    'suspended': 'Suspended'
  };
  return statusMap[status] || status;
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
    autoTable(doc, {
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
    console.log('Creating professional PDF...');
    const doc = new jsPDF();

    // Professional Header Design
    // Top blue header bar
    doc.setFillColor(41, 128, 185); // Professional blue
    doc.rect(0, 0, 210, 25, 'F');

    // Company name in header
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('ROTARY CLUB GULMOHAR BANGALORE', 15, 16);

    // Document title section
    doc.setFontSize(24);
    doc.setTextColor(41, 128, 185);
    doc.setFont('helvetica', 'bold');
    doc.text('DONATION SUMMARY', 15, 40);

    // Document info box (top right)
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(130, 30, 65, 35);

    // Document details
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('Report Date:', 135, 38);
    doc.text('Generated:', 135, 45);
    doc.text('Period:', 135, 52);
    doc.text('Status:', 135, 59);

    // Document values
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    const currentDate = new Date().toLocaleDateString('en-IN');
    const currentTime = new Date().toLocaleTimeString('en-IN', { hour12: false });
    doc.text(currentDate, 165, 38);
    doc.text(currentTime, 165, 45);
    doc.text('FY 2024-25', 165, 52);
    doc.text('ACTIVE', 165, 59);

    let yPosition = 85;
    
    // Summary Overview Section
    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
    doc.setFont('helvetica', 'bold');
    doc.text('SUMMARY OVERVIEW', 15, yPosition);
    yPosition += 15;

    // Create two-column layout for key metrics
    const leftColumnMetrics = [
      ['Total Donations', formatCurrency(summaryData.totalDonations)],
      ['Average Donation', formatCurrency(summaryData.averageDonation)],
      ['Active Campaigns', summaryData.activeCampaigns.toLocaleString('en-IN')],
      ['Pending Donations', formatCurrency(summaryData.pendingDonations)]
    ];

    const rightColumnMetrics = [
      ['Total Donors', summaryData.totalDonors.toLocaleString('en-IN')],
      ['Monthly Donations', formatCurrency(summaryData.monthlyDonations)],
      ['Completed Campaigns', summaryData.completedCampaigns.toLocaleString('en-IN')],
      ['Recurring Donors', summaryData.recurringDonors.toLocaleString('en-IN')]
    ];

    // Left column table
    autoTable(doc, {
      body: leftColumnMetrics,
      startY: yPosition,
      styles: {
        fontSize: 10,
        cellPadding: 6,
        lineColor: [220, 220, 220],
        lineWidth: 0.3
      },
      columnStyles: {
        0: {
          cellWidth: 45,
          fontStyle: 'normal',
          textColor: [100, 100, 100],
          fillColor: [250, 250, 250]
        },
        1: {
          cellWidth: 40,
          halign: 'right',
          fontStyle: 'bold',
          textColor: [0, 0, 0]
        }
      },
      margin: { left: 15 },
      tableWidth: 85
    });

    // Right column table
    autoTable(doc, {
      body: rightColumnMetrics,
      startY: yPosition,
      styles: {
        fontSize: 10,
        cellPadding: 6,
        lineColor: [220, 220, 220],
        lineWidth: 0.3
      },
      columnStyles: {
        0: {
          cellWidth: 45,
          fontStyle: 'normal',
          textColor: [100, 100, 100],
          fillColor: [250, 250, 250]
        },
        1: {
          cellWidth: 40,
          halign: 'right',
          fontStyle: 'bold',
          textColor: [0, 0, 0]
        }
      },
      margin: { left: 110 },
      tableWidth: 85
    });

    // Campaign Performance Section
    if (chartData && chartData.campaignData) {
      yPosition = doc.lastAutoTable.finalY + 30;

      // Section header
      doc.setFontSize(14);
      doc.setTextColor(41, 128, 185);
      doc.setFont('helvetica', 'bold');
      doc.text('CAMPAIGN PERFORMANCE', 15, yPosition);
      yPosition += 15;

      const campaignRows = chartData.campaignData.map(campaign => {
        const progress = ((campaign.raised / campaign.target) * 100).toFixed(1);
        return [
          campaign.name,
          formatCurrency(campaign.raised),
          formatCurrency(campaign.target),
          `${progress}%`,
          campaign.donors.toLocaleString('en-IN')
        ];
      });

      autoTable(doc, {
        head: [['Campaign Name', 'Raised', 'Target', 'Progress', 'Donors']],
        body: campaignRows,
        startY: yPosition,
        styles: {
          fontSize: 9,
          cellPadding: 5,
          lineColor: [220, 220, 220],
          lineWidth: 0.3
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 10
        },
        columnStyles: {
          0: {
            cellWidth: 60,
            fontStyle: 'normal',
            textColor: [0, 0, 0]
          },
          1: {
            cellWidth: 35,
            halign: 'right',
            textColor: [0, 0, 0],
            fontStyle: 'bold'
          },
          2: {
            cellWidth: 35,
            halign: 'right',
            textColor: [100, 100, 100]
          },
          3: {
            cellWidth: 25,
            halign: 'center',
            fontStyle: 'bold',
            textColor: [41, 128, 185]
          },
          4: {
            cellWidth: 25,
            halign: 'center',
            textColor: [0, 0, 0]
          }
        },
        alternateRowStyles: {
          fillColor: [248, 248, 248]
        },
        margin: { left: 15, right: 15 }
      });
    }
    
    // Professional Footer Section
    const pageHeight = doc.internal.pageSize.height;
    const footerY = pageHeight - 40;

    // Add separator line
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(15, footerY - 10, 195, footerY - 10);

    // Footer content - Company info
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('Rotary Club Gulmohar Bangalore', 15, footerY);
    doc.text('Service Above Self', 15, footerY + 6);

    // Contact information
    doc.setFontSize(8);
    doc.text('Email: contact@rotarygulmohar.org', 15, footerY + 15);
    doc.text('Phone: +91-80-XXXX-XXXX', 15, footerY + 21);
    doc.text('Website: www.rotarygulmohar.org', 15, footerY + 27);

    // Document info (right side)
    doc.setTextColor(41, 128, 185);
    doc.setFont('helvetica', 'bold');
    doc.text('CONFIDENTIAL DOCUMENT', 130, footerY);

    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('This report contains confidential financial information', 130, footerY + 6);
    doc.text('Generated automatically by Rotary Management System', 130, footerY + 12);

    // Page number
    doc.setTextColor(150, 150, 150);
    doc.text('Page 1 of 1', 175, footerY + 27);

    // Save with professional filename
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `Donation-Summary-Report-${timestamp}.pdf`;
    doc.save(fileName);

    return { success: true, fileName };
  } catch (error) {
    console.error('Error generating summary PDF:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Export member list to PDF
 */
export const exportMemberListToPDF = (members, filters = {}) => {
  try {
    console.log('Creating member list PDF...');
    const doc = new jsPDF();

    // Professional Header Design
    // Top blue header bar
    doc.setFillColor(41, 128, 185); // Professional blue
    doc.rect(0, 0, 210, 25, 'F');

    // Company name in header
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('ROTARY CLUB GULMOHAR BANGALORE', 15, 16);

    // Document title section
    doc.setFontSize(24);
    doc.setTextColor(41, 128, 185);
    doc.setFont('helvetica', 'bold');
    doc.text('MEMBER DIRECTORY', 15, 40);

    // Document info box (top right)
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(130, 30, 65, 35);

    // Document details
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('Report Date:', 135, 38);
    doc.text('Total Members:', 135, 45);
    doc.text('Status:', 135, 52);
    doc.text('Generated:', 135, 59);

    // Document values
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    const currentDate = new Date().toLocaleDateString('en-IN');
    const currentTime = new Date().toLocaleTimeString('en-IN', { hour12: false });
    doc.text(currentDate, 165, 38);
    doc.text(members.length.toString(), 165, 45);
    doc.text('ACTIVE', 165, 52);
    doc.text(currentTime, 165, 59);

    let yPosition = 85;

    // Add filters info if any
    if (filters.membershipType || filters.status || filters.committee) {
      doc.setFontSize(12);
      doc.setTextColor(41, 128, 185);
      doc.setFont('helvetica', 'bold');
      doc.text('APPLIED FILTERS', 15, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');

      if (filters.membershipType) {
        doc.text(`Membership Type: ${filters.membershipType}`, 15, yPosition);
        yPosition += 6;
      }
      if (filters.status) {
        doc.text(`Status: ${getStatusText(filters.status)}`, 15, yPosition);
        yPosition += 6;
      }
      if (filters.committee) {
        doc.text(`Committee: ${filters.committee}`, 15, yPosition);
        yPosition += 6;
      }
      yPosition += 10;
    }

    // Member table
    const tableColumns = ['Name', 'ID', 'Type', 'Status', 'Committee', 'Join Date', 'Contact'];
    const tableRows = members.map(member => [
      member.name,
      member.membershipId,
      member.membershipType,
      getStatusText(member.status),
      member.committee || 'N/A',
      member.joinDate,
      member.email
    ]);

    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: yPosition,
      styles: {
        fontSize: 8,
        cellPadding: 4,
        lineColor: [220, 220, 220],
        lineWidth: 0.3
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9
      },
      columnStyles: {
        0: { cellWidth: 35, fontStyle: 'bold' }, // Name
        1: { cellWidth: 20, halign: 'center' }, // ID
        2: { cellWidth: 25, halign: 'center' }, // Type
        3: { cellWidth: 20, halign: 'center' }, // Status
        4: { cellWidth: 25 }, // Committee
        5: { cellWidth: 25, halign: 'center' }, // Join Date
        6: { cellWidth: 40 } // Contact
      },
      alternateRowStyles: {
        fillColor: [248, 248, 248]
      },
      margin: { left: 15, right: 15 }
    });

    // Professional Footer
    const pageHeight = doc.internal.pageSize.height;
    const footerY = pageHeight - 40;

    // Add separator line
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(15, footerY - 10, 195, footerY - 10);

    // Footer content
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('Rotary Club Gulmohar Bangalore', 15, footerY);
    doc.text('Service Above Self', 15, footerY + 6);

    // Contact information
    doc.setFontSize(8);
    doc.text('Email: contact@rotarygulmohar.org', 15, footerY + 15);
    doc.text('Phone: +91-80-XXXX-XXXX', 15, footerY + 21);

    // Document info (right side)
    doc.setTextColor(41, 128, 185);
    doc.setFont('helvetica', 'bold');
    doc.text('CONFIDENTIAL DOCUMENT', 130, footerY);

    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('This report contains confidential member information', 130, footerY + 6);

    // Page number
    doc.setTextColor(150, 150, 150);
    doc.text('Page 1 of 1', 175, footerY + 21);

    // Save with professional filename
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `Member-Directory-${timestamp}.pdf`;
    doc.save(fileName);

    return { success: true, fileName };
  } catch (error) {
    console.error('Error generating member PDF:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Export member list to Excel
 */
export const exportMemberListToExcel = (members, filters = {}) => {
  try {
    console.log('Creating member Excel export...');

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Prepare member data for Excel
    const memberData = members.map(member => ({
      'Member ID': member.membershipId,
      'Full Name': member.name,
      'Email': member.email,
      'Phone': formatPhone(member.phone),
      'Membership Type': member.membershipType,
      'Status': getStatusText(member.status),
      'Designation': member.designation || 'N/A',
      'Committee': member.committee || 'N/A',
      'Join Date': member.joinDate,
      'Last Activity': member.lastActivity || 'N/A',
      'Address': member.address || 'N/A',
      'Emergency Contact': member.emergencyContact || 'N/A',
      'Emergency Phone': formatPhone(member.emergencyPhone),
      'Profession': member.profession || 'N/A',
      'Company': member.company || 'N/A',
      'Skills': member.skills || 'N/A',
      'Interests': member.interests || 'N/A'
    }));

    // Create main worksheet
    const ws = XLSX.utils.json_to_sheet(memberData);

    // Set column widths
    const colWidths = [
      { wch: 12 }, // Member ID
      { wch: 25 }, // Full Name
      { wch: 30 }, // Email
      { wch: 18 }, // Phone
      { wch: 15 }, // Membership Type
      { wch: 12 }, // Status
      { wch: 20 }, // Designation
      { wch: 20 }, // Committee
      { wch: 12 }, // Join Date
      { wch: 15 }, // Last Activity
      { wch: 40 }, // Address
      { wch: 25 }, // Emergency Contact
      { wch: 18 }, // Emergency Phone
      { wch: 25 }, // Profession
      { wch: 30 }, // Company
      { wch: 40 }, // Skills
      { wch: 40 }  // Interests
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Member Directory');

    // Create summary worksheet
    const summaryData = [
      ['Report Information', ''],
      ['Generated Date', new Date().toLocaleDateString('en-IN')],
      ['Generated Time', new Date().toLocaleTimeString('en-IN')],
      ['Total Members', members.length],
      ['', ''],
      ['Membership Type Breakdown', ''],
      ...getMembershipTypeBreakdown(members),
      ['', ''],
      ['Status Breakdown', ''],
      ...getStatusBreakdown(members),
      ['', ''],
      ['Applied Filters', ''],
      ['Membership Type', filters.membershipType || 'All'],
      ['Status', filters.status || 'All'],
      ['Committee', filters.committee || 'All']
    ];

    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    summaryWs['!cols'] = [{ wch: 25 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

    // Save file
    const timestamp = new Date().toISOString().split('T')[0];
    const fileName = `Member-Directory-${timestamp}.xlsx`;
    XLSX.writeFile(wb, fileName);

    return { success: true, fileName };
  } catch (error) {
    console.error('Error generating member Excel:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Helper function to get membership type breakdown
 */
const getMembershipTypeBreakdown = (members) => {
  const breakdown = {};
  members.forEach(member => {
    breakdown[member.membershipType] = (breakdown[member.membershipType] || 0) + 1;
  });
  return Object.entries(breakdown).map(([type, count]) => [type, count]);
};

/**
 * Helper function to get status breakdown
 */
const getStatusBreakdown = (members) => {
  const breakdown = {};
  members.forEach(member => {
    const status = getStatusText(member.status);
    breakdown[status] = (breakdown[status] || 0) + 1;
  });
  return Object.entries(breakdown).map(([status, count]) => [status, count]);
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
