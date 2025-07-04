# Export Functionality Setup

## Required Packages

To enable PDF and Excel export functionality in the Donations page, you need to install the following packages:

```bash
npm install jspdf jspdf-autotable xlsx file-saver
```

## Package Details

### PDF Export
- **jspdf**: Core PDF generation library
- **jspdf-autotable**: Plugin for creating tables in PDFs

### Excel Export
- **xlsx**: Excel file generation and parsing
- **file-saver**: Browser file download utility

## Features Included

### Donation History Export
- **PDF Export**: Complete donation records with filtering applied
- **Excel Export**: Multi-sheet workbook with donation data, summary, and applied filters

### Donation Summary Export
- **PDF Export**: Key metrics and campaign performance report
- **Excel Export**: Comprehensive summary with metrics, campaign data, and monthly trends

## Usage

Once the packages are installed, the export buttons will be fully functional:

1. **Donation History Page**: 
   - "Export PDF" button - Generates filtered donation history as PDF
   - "Export Excel" button - Creates comprehensive Excel workbook

2. **Main Donations Page**:
   - "Export PDF" button - Generates summary report as PDF
   - "Export Excel" button - Creates detailed summary workbook

## File Naming Convention

Exported files are automatically named with timestamps:
- `donation-history-YYYY-MM-DD.pdf`
- `donation-history-YYYY-MM-DD.xlsx`
- `donation-summary-YYYY-MM-DD.pdf`
- `donation-summary-YYYY-MM-DD.xlsx`

## Error Handling

If the packages are not installed, users will see helpful error messages directing them to install the required dependencies.

## Installation Command

Run this command in your project root directory:

```bash
npm install jspdf jspdf-autotable xlsx file-saver
```

After installation, refresh the application and the export functionality will be ready to use.
