import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import AlertCenter from '../../components/ui/AlertCenter';
import CommunicationSidebar from './components/CommunicationSidebar';
import MessageList from './components/MessageList';
import QuickActions from './components/QuickActions';
import SearchAndFilters from './components/SearchAndFilters';
import MessageComposer from './components/MessageComposer';

const CommunicationCenter = () => {
  const [selectedCategory, setSelectedCategory] = useState('announcements');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [readFilter, setReadFilter] = useState('all');
  const [selectedRecipients, setSelectedRecipients] = useState(['all-members']);
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerType, setComposerType] = useState('compose');

  // Mock data for communication categories
  const categories = [
    {
      id: 'announcements',
      name: 'Announcements',
      icon: 'Megaphone',
      unreadCount: 3
    },
    {
      id: 'newsletters',
      name: 'Newsletters',
      icon: 'FileText',
      unreadCount: 1
    },
    {
      id: 'meeting-minutes',
      name: 'Meeting Minutes',
      icon: 'FileEdit',
      unreadCount: 0
    },
    {
      id: 'general',
      name: 'General Messages',
      icon: 'MessageCircle',
      unreadCount: 7
    }
  ];

  // Mock data for messages
  const messages = [
    {
      id: 1,
      category: 'announcements',
      sender: 'Club President',
      subject: 'Annual Charity Gala - Save the Date',
      preview: `Dear Members, We are excited to announce our Annual Charity Gala scheduled for March 15th, 2024. This year's theme is "Building Bridges, Changing Lives" and we expect to raise significant funds for our community projects.`,
      content: `Dear Members,\n\nWe are excited to announce our Annual Charity Gala scheduled for March 15th, 2024. This year's theme is "Building Bridges, Changing Lives" and we expect to raise significant funds for our community projects.\n\nThe event will be held at the Grand Ballroom of Hotel Taj Palace from 7:00 PM onwards. We request all members to mark their calendars and confirm their attendance by February 28th.\n\nTicket prices:\n- Members: ₹2,500 per person\n- Non-members: ₹3,500 per person\n- Corporate tables: ₹25,000 (seats 10)\n\nPlease contact the organizing committee for bookings and sponsorship opportunities.\n\nBest regards,\nRotary Club Gulmohar`,
      date: '2024-01-15T10:30:00',
      read: false,
      priority: 'high',
      hasAttachment: true,
      expiryDate: '2024-03-15T23:59:59'
    },
    {
      id: 2,
      category: 'newsletters',
      sender: 'Newsletter Team',
      subject: 'Rotary Gulmohar Monthly Newsletter - January 2024',
      preview: `Welcome to our January newsletter! This month we highlight our successful blood donation camp, upcoming projects, and member spotlights.`,
      content: `Welcome to our January newsletter!\n\nThis month we highlight:\n- Successful blood donation camp with 150+ donors\n- Upcoming water conservation project\n- Member spotlight: Dr. Rajesh Kumar\n- Financial summary and upcoming events\n\nThank you for your continued support and participation.`,
      date: '2024-01-10T09:00:00',
      read: true,
      priority: 'medium',
      hasAttachment: false
    },
    {
      id: 3,
      category: 'meeting-minutes',
      sender: 'Club Secretary',
      subject: 'Board Meeting Minutes - January 8, 2024',
      preview: `Minutes from the board meeting held on January 8th, 2024. Key decisions on budget allocation and new project approvals.`,
      content: `Board Meeting Minutes - January 8, 2024\n\nAttendees: President, Secretary, Treasurer, 5 Board Members\n\nKey Decisions:\n1. Approved budget of ₹2,50,000 for community health camp\n2. New member applications reviewed - 3 approved\n3. Fundraising target set at ₹10,00,000 for this quarter\n4. Next meeting scheduled for February 5th, 2024`,
      date: '2024-01-08T19:30:00',
      read: true,
      priority: 'medium',
      hasAttachment: true
    },
    {
      id: 4,
      category: 'general',
      sender: 'Membership Committee',
      subject: 'Welcome New Members - January Batch',
      preview: `Please join us in welcoming our new members who joined this month. Let's make them feel at home in our Rotary family.`,
      content: `Dear Members,\n\nPlease join us in welcoming our new members:\n\n1. Mr. Amit Sharma - IT Professional\n2. Dr. Priya Patel - Pediatrician\n3. Ms. Kavita Singh - Social Worker\n\nPlease make an effort to introduce yourselves and help them integrate into our club activities.\n\nWelcome to the Rotary family!`,
      date: '2024-01-12T14:15:00',read: false,priority: 'low',
      hasAttachment: false
    },
    {
      id: 5,
      category: 'announcements',sender: 'Event Committee',subject: 'Weekly Meeting Venue Change - January 20th',
      preview: `Important: Our weekly meeting on January 20th has been moved to Conference Hall B due to maintenance work in the main hall.`,
      content: `Dear Members,\n\nPlease note that our weekly meeting scheduled for January 20th, 2024 has been moved from the Main Conference Hall to Conference Hall B due to scheduled maintenance work.\n\nTime remains the same: 7:00 PM - 9:00 PM\nNew Venue: Conference Hall B, 2nd Floor\n\nWe apologize for any inconvenience caused.\n\nThank you for your understanding.`,
      date: '2024-01-14T16:45:00',read: false,priority: 'medium',hasAttachment: false,expiryDate: '2024-01-20T21:00:00'
    },
    {
      id: 6,
      category: 'general',sender: 'Finance Committee',subject: 'Membership Fee Payment Reminder',
      preview: `Friendly reminder that quarterly membership fees are due by January 31st. Please ensure timely payment to avoid any inconvenience.`,
      content: `Dear Members,\n\nThis is a friendly reminder that quarterly membership fees for Q4 2023-24 are due by January 31st, 2024.\n\nFee Details:\n- Regular Members: ₹1,500\n- Senior Members: ₹1,200\n- Youth Members: ₹750\n\nPayment can be made through:\n- Bank transfer to Club account\n- Cash/Cheque at club office\n- Online payment portal\n\nFor any queries, please contact the Finance Committee.\n\nThank you for your cooperation.`,
      date: '2024-01-11T11:20:00',read: true,priority: 'medium',
      hasAttachment: false
    }
  ];

  // Mock data for recipient groups
  const recipientGroups = [
    {
      id: 'all-members',
      name: 'All Members',
      icon: 'Users',
      count: 155
    },
    {
      id: 'board-members',
      name: 'Board Members',
      icon: 'Crown',
      count: 12
    },
    {
      id: 'committee-chairs',
      name: 'Committee Chairs',
      icon: 'UserCheck',
      count: 8
    },
    {
      id: 'new-members',
      name: 'New Members',
      icon: 'UserPlus',
      count: 15
    },
    {
      id: 'donors',
      name: 'Donors',
      icon: 'Heart',
      count: 26
    }
  ];

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedMessage(null);
  };

  const handleMessageSelect = (message) => {
    setSelectedMessage(message);
    // Mark message as read
    console.log('Message selected:', message);
  };

  const handleRecipientChange = (groupId, checked) => {
    if (checked) {
      setSelectedRecipients(prev => [...prev, groupId]);
    } else {
      setSelectedRecipients(prev => prev.filter(id => id !== groupId));
    }
  };

  const handleActionSelect = (actionId) => {
    setComposerType(actionId);
    setComposerOpen(true);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setDateFilter('all');
    setReadFilter('all');
  };

  const filteredMessages = messages.filter(message => {
    if (message.category !== selectedCategory) return false;
    
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (readFilter === 'read' && !message.read) return false;
    if (readFilter === 'unread' && message.read) return false;
    
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <NavigationSidebar />
      <AlertCenter />
      
      <main className="main-content-offset min-h-screen">
        <div className="p-6">
          <BreadcrumbNavigation />
          
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path
                    d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold text-text-primary">
                  Communication Center
                </h1>
                <p className="text-text-secondary">
                  Manage announcements, newsletters, and member communications
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <SearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            readFilter={readFilter}
            onReadFilterChange={setReadFilter}
            onClearFilters={handleClearFilters}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Communication Categories */}
            <div className="lg:col-span-3">
              <CommunicationSidebar
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
                categories={categories}
              />
            </div>

            {/* Center Panel - Message List */}
            <div className="lg:col-span-6">
              <MessageList
                messages={filteredMessages}
                selectedCategory={selectedCategory}
                onMessageSelect={handleMessageSelect}
                searchTerm={searchTerm}
                dateFilter={dateFilter}
              />
            </div>

            {/* Right Panel - Quick Actions */}
            <div className="lg:col-span-3">
              <QuickActions
                onActionSelect={handleActionSelect}
                recipientGroups={recipientGroups}
                selectedRecipients={selectedRecipients}
                onRecipientChange={handleRecipientChange}
              />
            </div>
          </div>

          {/* Mobile Layout Adjustments */}
          <div className="lg:hidden mt-6">
            {/* Mobile Quick Actions */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => handleActionSelect('compose')}
                className="flex items-center justify-center space-x-2 p-4 bg-primary text-primary-foreground rounded-lg hover:shadow-md transition-all duration-150"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-current"
                >
                  <path
                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-sm font-medium">Compose</span>
              </button>
              
              <button
                onClick={() => handleActionSelect('announcement')}
                className="flex items-center justify-center space-x-2 p-4 bg-accent text-accent-foreground rounded-lg hover:shadow-md transition-all duration-150"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-current"
                >
                  <path
                    d="M3 11l18-5v12L3 14v-3z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.6 16.8a3 3 0 1 1-5.8-1.6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-sm font-medium">Announce</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Message Composer Modal */}
      <MessageComposer
        isOpen={composerOpen}
        onClose={() => setComposerOpen(false)}
        messageType={composerType}
        selectedRecipients={selectedRecipients}
      />
    </div>
  );
};

export default CommunicationCenter;