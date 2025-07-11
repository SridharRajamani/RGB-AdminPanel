import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Card = ({ children, className }) => (
  <div className={`card ${className}`}>{children}</div>
);

const DashboardHeader = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now.toLocaleDateString('en-GB'));
    setCurrentTime(now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }));
  }, []);

  return (
    <header className="dashboard-header">
      <div className="container">
        <div className="header-content">
          <img
            src="https://placehold.co/150x40.png"
            alt="Rotary Logo"
            className="logo"
          />
          <div className="header-info">
            <div className="helpline">
              <span>📞 Help line No: +91 8956231452 / +91 9856231452</span>
            </div>
            <div className="datetime">
              <span>📅 Date: {currentDate}</span>
              <span>⏰ Time: {currentTime}</span>
            </div>
          </div>
          <div className="user-info">
            <span className="greeting">hello,</span>
            <span className="username">Loginuser Name</span>
            <div className="user-avatar">US</div>
          </div>
        </div>
      </div>
    </header>
  );
};

const summaryWidgetsData = [
  { value: '155', label: 'Members', className: 'green' },
  { value: '26', label: 'Donors', className: 'yellow' },
  { value: '₹15,632', label: 'Funds Available', className: 'red' },
  { value: '13', label: 'Active Projects', className: 'indigo' },
  { value: '7', label: 'Upcoming Events', className: 'purple' },
];

const SummaryWidgets = () => (
  <Card>
    <h2 className="card-title">📊 Summary Widgets</h2>
    <div className="summary-grid">
      {summaryWidgetsData.map(widget => (
        <div key={widget.label} className={`summary-box ${widget.className}`}>
          <p className="value">{widget.value}</p>
          <p className="label">{widget.label}</p>
        </div>
      ))}
    </div>
  </Card>
);

const quickActionsData = [
  'Member Management',
  'Event Management',
  'Communication & Announcements',
  'News Letters',
  'Club Meeting',
  'Club Monthly Report',
  'Settings & User Permissions',
  'Club Projects & Initiatives',
  'Donations & Fundraising',
  'Financial Reports',
  'Attendance & Meeting Logs',
];

const QuickActions = () => (
  <Card>
    <h2 className="card-title">⚙️ Quick Actions</h2>
    <div className="actions-grid">
      {quickActionsData.map((label, index) => (
        <div key={index} className="action-item">
          <img
            src="https://placehold.co/64x64/E8EAF6/7C81E8.png"
            alt={label}
            className="action-icon"
          />
          <p>{label}</p>
        </div>
      ))}
    </div>
  </Card>
);

const AlertItem = ({ title, details, status, tags, attachment }) => (
  <div className="alert-item">
    <div className="alert-header">
      <div>
        <h4>{title}</h4>
        <ul>
          {details.map((d, i) => (
            <li key={i}>✔️ {d}</li>
          ))}
        </ul>
      </div>
      <div className="alert-status">
        <div>⏳ {status.pending}</div>
        <div>📌 Applied: {status.applied}</div>
      </div>
    </div>
    <div className="alert-footer">
      <div className="tags">
        {tags && tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
        {attachment && <span className="attachment">📎 {attachment}</span>}
      </div>
      <div className="buttons">
        <button className="btn green">Approve</button>
        <button className="btn yellow">Request Changes</button>
        <button className="btn red">Reject</button>
        <button className="btn blue">Details</button>
      </div>
    </div>
  </div>
);

const AlertCenter = () => (
  <Card>
    <h2 className="card-title">🔔 Alert Center</h2>
    <div className="alerts">
      <AlertItem
        title="New Member Approval - Rajesh Kumar"
        details={["Skills: Fundraising, Public Speaking"]}
        status={{ pending: "Pending for 2 days", applied: "12-May-2024" }}
      />
      <AlertItem
        title="Project - Meal Sponsorship"
        details={["Budget Approval ₹10,000"]}
        status={{ pending: "Pending for 2 days", applied: "12-May-2024" }}
      />
      <AlertItem
        title="Project - Clean Water"
        details={["Budget Approval ₹50,000"]}
        status={{ pending: "Pending for 2 days", applied: "12-May-2024" }}
        tags={["Projects", "Budget approvals"]}
        attachment="Quote_May.pdf"
      />
    </div>
  </Card>
);

const DashboardFooter = () => (
  <footer className="dashboard-footer">
    <span>© 2025 Rotary International. All rights reserved.</span>
    <a href="#">Privacy Policy</a>
    <a href="#">Terms of Use</a>
  </footer>
);

export default function DashboardPage() {
  return (
    <div className="dashboard">
      <DashboardHeader />
      <main className="main-content">
        <div className="page-header">
          <h1>Dashboard</h1>
        </div>
        <div className="dashboard-grid">
          <div className="left-pane">
            <SummaryWidgets />
            <QuickActions />
          </div>
          <div className="right-pane">
            <AlertCenter />
          </div>
        </div>
      </main>
      <DashboardFooter />
    </div>
  );
}
