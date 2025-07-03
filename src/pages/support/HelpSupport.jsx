import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/ui/Header';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const HelpSupport = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [activeSection, setActiveSection] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });

  const { user } = useAuth();

  React.useEffect(() => {
    const handleToggleSidebarCollapse = () => {
      setIsSidebarCollapsed((prev) => !prev);
    };
    window.addEventListener('toggleSidebarCollapse', handleToggleSidebarCollapse);
    return () => {
      window.removeEventListener('toggleSidebarCollapse', handleToggleSidebarCollapse);
    };
  }, []);

  const faqData = [
    {
      category: 'Account Management',
      questions: [
        {
          question: 'How do I reset my password?',
          answer: 'You can reset your password by going to Profile Settings > Security tab and clicking "Change Password". You\'ll need to enter your current password and then your new password.'
        },
        {
          question: 'How do I update my profile information?',
          answer: 'Navigate to your Profile Settings from the user menu in the top right corner. Click "Edit Profile" to modify your name, email, and other details.'
        },
        {
          question: 'What are the different user roles?',
          answer: 'We have 5 user roles: Super Administrator (full access), Finance Administrator (financial reports), Event Administrator (event management), Project Administrator (project management), and Member Administrator (member management).'
        }
      ]
    },
    {
      category: 'Navigation & Features',
      questions: [
        {
          question: 'How do I access different sections of the dashboard?',
          answer: 'Use the sidebar navigation on the left to access different sections. The available sections depend on your user role and permissions.'
        },
        {
          question: 'How do I create a new member?',
          answer: 'Go to Member Management section and click the "Add New Member" button. Fill in the required information and save.'
        },
        {
          question: 'How do I generate financial reports?',
          answer: 'Navigate to the Financial Reports section where you can view various financial metrics, charts, and export reports in different formats.'
        }
      ]
    },
    {
      category: 'Technical Issues',
      questions: [
        {
          question: 'The page is not loading properly',
          answer: 'Try refreshing the page (Ctrl+F5 or Cmd+Shift+R). If the issue persists, clear your browser cache or try using a different browser.'
        },
        {
          question: 'I\'m getting permission errors',
          answer: 'Contact your system administrator to verify your user role and permissions. Some features may be restricted based on your access level.'
        },
        {
          question: 'How do I report a bug?',
          answer: 'Use the "Contact Support" section below to report any bugs or technical issues. Please provide as much detail as possible including steps to reproduce the issue.'
        }
      ]
    }
  ];

  const contactInfo = {
    phone: '+91 8956231452 / +91 9856231452',
    email: 'admin@rotarygulmohar.org',
    address: 'Rotary Club of Gulmohar Bangalore',
    hours: 'Monday - Friday: 9:00 AM - 6:00 PM'
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd send this to your support system
    alert('Support request submitted successfully! We\'ll get back to you soon.');
    setContactForm({ subject: '', message: '', priority: 'medium' });
  };

  const filteredFAQs = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
           q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const sections = [
    { id: 'faq', label: 'FAQ', icon: 'HelpCircle' },
    { id: 'contact', label: 'Contact Support', icon: 'MessageSquare' },
    { id: 'guides', label: 'User Guides', icon: 'Book' },
    { id: 'system', label: 'System Status', icon: 'Activity' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <NavigationSidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        isSidebarCollapsed={isSidebarCollapsed}
        isSidebarVisible={isSidebarVisible}
      />
      
      <main className={`${isSidebarCollapsed ? 'ml-20' : 'ml-60'} pt-16 transition-all duration-200`}>
        <div className="p-6">
          <BreadcrumbNavigation />
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
                Help & Support
              </h1>
              <p className="text-text-secondary">
                Get help with using the Rotary Gulmohar Bangalore dashboard
              </p>
            </div>
          </div>

          {/* Contact Info Banner */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Need Immediate Help?</h3>
                <p className="text-sm opacity-90">Contact our support team directly</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{contactInfo.phone}</p>
                <p className="text-sm opacity-90">{contactInfo.hours}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-surface border border-border rounded-xl p-4">
                <h3 className="font-semibold text-text-primary mb-4">Support Sections</h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? 'bg-primary text-white'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                      }`}
                    >
                      <Icon name={section.icon} size={16} />
                      <span className="text-sm font-medium">{section.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-surface border border-border rounded-xl p-6">
                
                {/* FAQ Section */}
                {activeSection === 'faq' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-text-primary">
                        Frequently Asked Questions
                      </h2>
                    </div>

                    {/* Search */}
                    <div className="relative">
                      <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                      <input
                        type="text"
                        placeholder="Search FAQ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    {/* FAQ Categories */}
                    <div className="space-y-6">
                      {filteredFAQs.map((category, categoryIndex) => (
                        <div key={categoryIndex}>
                          <h3 className="text-lg font-medium text-text-primary mb-3 border-b border-border pb-2">
                            {category.category}
                          </h3>
                          <div className="space-y-3">
                            {category.questions.map((faq, faqIndex) => (
                              <details key={faqIndex} className="group">
                                <summary className="flex items-center justify-between cursor-pointer p-3 bg-background rounded-lg hover:bg-surface-secondary">
                                  <span className="font-medium text-text-primary">{faq.question}</span>
                                  <Icon name="ChevronDown" size={16} className="text-text-muted group-open:rotate-180 transition-transform" />
                                </summary>
                                <div className="mt-2 p-3 text-text-secondary text-sm leading-relaxed">
                                  {faq.answer}
                                </div>
                              </details>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Support Section */}
                {activeSection === 'contact' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-text-primary">Contact Support</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Contact Information */}
                      <div className="space-y-4">
                        <h3 className="font-medium text-text-primary">Get in Touch</h3>
                        
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Icon name="Phone" size={16} className="text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-text-primary">Phone</p>
                              <p className="text-sm text-text-secondary">{contactInfo.phone}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Icon name="Mail" size={16} className="text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-text-primary">Email</p>
                              <p className="text-sm text-text-secondary">{contactInfo.email}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Icon name="Clock" size={16} className="text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-text-primary">Support Hours</p>
                              <p className="text-sm text-text-secondary">{contactInfo.hours}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact Form */}
                      <div>
                        <h3 className="font-medium text-text-primary mb-4">Send us a Message</h3>
                        <form onSubmit={handleContactSubmit} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                              Subject
                            </label>
                            <input
                              type="text"
                              value={contactForm.subject}
                              onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                              Priority
                            </label>
                            <select
                              value={contactForm.priority}
                              onChange={(e) => setContactForm(prev => ({ ...prev, priority: e.target.value }))}
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                              <option value="urgent">Urgent</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                              Message
                            </label>
                            <textarea
                              value={contactForm.message}
                              onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                              rows={4}
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                              required
                            />
                          </div>

                          <Button type="submit" variant="primary" iconName="Send">
                            Send Message
                          </Button>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                {/* User Guides Section */}
                {activeSection === 'guides' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-text-primary">User Guides</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-border rounded-lg hover:bg-surface-secondary transition-colors">
                        <div className="flex items-center space-x-3 mb-2">
                          <Icon name="User" size={20} className="text-primary" />
                          <h3 className="font-medium text-text-primary">Getting Started</h3>
                        </div>
                        <p className="text-sm text-text-secondary">Learn the basics of navigating and using the dashboard</p>
                      </div>

                      <div className="p-4 border border-border rounded-lg hover:bg-surface-secondary transition-colors">
                        <div className="flex items-center space-x-3 mb-2">
                          <Icon name="Users" size={20} className="text-primary" />
                          <h3 className="font-medium text-text-primary">Member Management</h3>
                        </div>
                        <p className="text-sm text-text-secondary">How to add, edit, and manage club members</p>
                      </div>

                      <div className="p-4 border border-border rounded-lg hover:bg-surface-secondary transition-colors">
                        <div className="flex items-center space-x-3 mb-2">
                          <Icon name="Calendar" size={20} className="text-primary" />
                          <h3 className="font-medium text-text-primary">Event Planning</h3>
                        </div>
                        <p className="text-sm text-text-secondary">Create and manage club events and activities</p>
                      </div>

                      <div className="p-4 border border-border rounded-lg hover:bg-surface-secondary transition-colors">
                        <div className="flex items-center space-x-3 mb-2">
                          <Icon name="DollarSign" size={20} className="text-primary" />
                          <h3 className="font-medium text-text-primary">Financial Reports</h3>
                        </div>
                        <p className="text-sm text-text-secondary">Generate and analyze financial data and reports</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* System Status Section */}
                {activeSection === 'system' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-text-primary">System Status</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-success/10 border border-success/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-success rounded-full"></div>
                          <span className="font-medium text-text-primary">Dashboard Service</span>
                        </div>
                        <span className="text-sm text-success font-medium">Operational</span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-success/10 border border-success/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-success rounded-full"></div>
                          <span className="font-medium text-text-primary">Authentication Service</span>
                        </div>
                        <span className="text-sm text-success font-medium">Operational</span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-success/10 border border-success/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-success rounded-full"></div>
                          <span className="font-medium text-text-primary">Database Service</span>
                        </div>
                        <span className="text-sm text-success font-medium">Operational</span>
                      </div>

                      <div className="p-4 bg-background rounded-lg">
                        <p className="text-sm text-text-secondary">
                          Last updated: {new Date().toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HelpSupport;
