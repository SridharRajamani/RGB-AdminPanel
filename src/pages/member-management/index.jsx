import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/ui/Header';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import AlertCenter from '../../components/ui/AlertCenter';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';


// Import components
import MemberTable from './components/MemberTable';
import MemberFilters from './components/MemberFilters';
import MembershipSummary from './components/MembershipSummary';
import MemberModal from './components/MemberModal';

const MemberManagement = ({ isSidebarCollapsed: propSidebarCollapsed = false, isSidebarVisible = true }) => {
  const { t } = useTranslation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(propSidebarCollapsed);

  // Listen for sidebar state changes
  React.useEffect(() => {
    const handleSidebarStateChange = (event) => {
      setIsSidebarCollapsed(event.detail.collapsed);
    };

    window.addEventListener('sidebarStateChanged', handleSidebarStateChange);
    return () => {
      window.removeEventListener('sidebarStateChanged', handleSidebarStateChange);
    };
  }, []);
  // Mock data for members
  const [members] = useState([
    {
      id: 1,
      name: "Rajesh Kumar",
      email: "rajesh.kumar@email.com",
      phone: "+91 98765 43210",
      membershipId: "RC001",
      membershipType: "Regular",
      status: "active",
      designation: "President",
      committee: "Club Service",
      joinDate: "15/03/2022",
      lastActivity: "2 days ago",
      address: "123 MG Road, Bangalore, Karnataka 560001",
      emergencyContact: "Priya Kumar",
      emergencyPhone: "+91 98765 43211",
      profession: "Software Engineer",
      company: "Tech Solutions Pvt Ltd",
      skills: "Technology, Project Management, Public Speaking",
      interests: "Photography, Reading, Community Service"
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya.sharma@email.com",
      phone: "+91 87654 32109",
      membershipId: "RC002",
      membershipType: "Regular",
      status: "active",
      designation: "Secretary",
      committee: "Community Service",
      joinDate: "22/05/2022",
      lastActivity: "1 day ago",
      address: "456 Brigade Road, Bangalore, Karnataka 560025",
      emergencyContact: "Amit Sharma",
      emergencyPhone: "+91 87654 32108",
      profession: "Doctor",
      company: "City Hospital",
      skills: "Healthcare, Administration, Event Planning",
      interests: "Medical Research, Yoga, Travel"
    },
    {
      id: 3,
      name: "Amit Patel",
      email: "amit.patel@email.com",
      phone: "+91 76543 21098",
      membershipId: "RC003",
      membershipType: "Corporate",
      status: "active",
      designation: "Treasurer",
      committee: "Fundraising",
      joinDate: "10/01/2023",
      lastActivity: "3 hours ago",
      address: "789 Commercial Street, Bangalore, Karnataka 560001",
      emergencyContact: "Neha Patel",
      emergencyPhone: "+91 76543 21097",
      profession: "Business Owner",
      company: "Patel Enterprises",
      skills: "Finance, Business Development, Networking",
      interests: "Business, Cricket, Cooking"
    },
    {
      id: 4,
      name: "Sunita Reddy",
      email: "sunita.reddy@email.com",
      phone: "+91 65432 10987",
      membershipId: "RC004",
      membershipType: "Regular",
      status: "active",
      designation: "Vice President",
      committee: "Youth Service",
      joinDate: "08/07/2021",
      lastActivity: "5 days ago",
      address: "321 Koramangala, Bangalore, Karnataka 560034",
      emergencyContact: "Ravi Reddy",
      emergencyPhone: "+91 65432 10986",
      profession: "Teacher",
      company: "St. Mary's School",
      skills: "Education, Youth Development, Communication",
      interests: "Teaching, Music, Social Work"
    },
    {
      id: 5,
      name: "Vikram Singh",
      email: "vikram.singh@email.com",
      phone: "+91 54321 09876",
      membershipId: "RC005",
      membershipType: "Honorary",
      status: "inactive",
      designation: "Past President",
      committee: "International Service",
      joinDate: "12/11/2020",
      lastActivity: "2 weeks ago",
      address: "654 Indiranagar, Bangalore, Karnataka 560038",
      emergencyContact: "Kavita Singh",
      emergencyPhone: "+91 54321 09875",
      profession: "Retired Government Officer",
      company: "Government of Karnataka",
      skills: "Administration, Policy Making, Leadership",
      interests: "Politics, History, Gardening"
    },
    {
      id: 6,
      name: "Meera Joshi",
      email: "meera.joshi@email.com",
      phone: "+91 43210 98765",
      membershipId: "RC006",
      membershipType: "Associate",
      status: "pending",
      designation: "Member",
      committee: "Public Relations",
      joinDate: "25/09/2023",
      lastActivity: "1 week ago",
      address: "987 Jayanagar, Bangalore, Karnataka 560011",
      emergencyContact: "Suresh Joshi",
      emergencyPhone: "+91 43210 98764",
      profession: "Marketing Manager",
      company: "Global Marketing Inc",
      skills: "Marketing, Social Media, Brand Management",
      interests: "Digital Marketing, Fashion, Dance"
    },
    {
      id: 7,
      name: "Ravi Gupta",
      email: "ravi.gupta@email.com",
      phone: "+91 32109 87654",
      membershipId: "RC007",
      membershipType: "Regular",
      status: "active",
      designation: "Committee Chair",
      committee: "Vocational Service",
      joinDate: "14/02/2022",
      lastActivity: "4 days ago",
      address: "147 Whitefield, Bangalore, Karnataka 560066",
      emergencyContact: "Anjali Gupta",
      emergencyPhone: "+91 32109 87653",
      profession: "Chartered Accountant",
      company: "Gupta & Associates",
      skills: "Accounting, Tax Planning, Financial Advisory",
      interests: "Finance, Chess, Classical Music"
    },
    {
      id: 8,
      name: "Kavya Nair",
      email: "kavya.nair@email.com",
      phone: "+91 21098 76543",
      membershipId: "RC008",
      membershipType: "Regular",
      status: "active",
      designation: "Member",
      committee: "Community Service",
      joinDate: "30/06/2023",
      lastActivity: "1 day ago",
      address: "258 Electronic City, Bangalore, Karnataka 560100",
      emergencyContact: "Arun Nair",
      emergencyPhone: "+91 21098 76542",
      profession: "Software Developer",
      company: "Innovation Labs",
      skills: "Software Development, AI/ML, Data Analysis",
      interests: "Technology, Badminton, Movies"
    }
  ]);

  // State management
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [filters, setFilters] = useState({
    membershipType: '',
    status: '',
    committee: '',
    dateRange: ''
  });
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'view', // 'view', 'edit', 'add'
    member: null
  });

  // Summary data
  const summaryData = useMemo(() => {
    const totalMembers = members.length;
    const activeMembers = members.filter(m => m.status === 'active').length;
    const newJoiners = members.filter(m => {
      const joinDate = new Date(m.joinDate.split('/').reverse().join('-'));
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return joinDate >= oneMonthAgo;
    }).length;
    const renewalReminders = members.filter(m => m.status === 'pending').length;
    const activeCommittees = [...new Set(members.map(m => m.committee))].length;

    return {
      totalMembers,
      activeMembers,
      newJoiners,
      renewalReminders,
      activeCommittees
    };
  }, [members]);

  // Filtered members based on current filters
  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesType = !filters.membershipType || member.membershipType === filters.membershipType;
      const matchesStatus = !filters.status || member.status === filters.status;
      const matchesCommittee = !filters.committee || member.committee === filters.committee;
      
      return matchesType && matchesStatus && matchesCommittee;
    });
  }, [members, filters]);

  // Event handlers
  const handleSelectMember = (memberId, isSelected) => {
    setSelectedMembers(prev => 
      isSelected 
        ? [...prev, memberId]
        : prev.filter(id => id !== memberId)
    );
  };

  const handleSelectAll = (isSelected) => {
    setSelectedMembers(isSelected ? filteredMembers.map(m => m.id) : []);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      membershipType: '',
      status: '',
      committee: '',
      dateRange: ''
    });
  };

  const handleViewMember = (member) => {
    setModalState({
      isOpen: true,
      mode: 'view',
      member
    });
  };

  const handleEditMember = (member) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      member
    });
  };

  const handleAddMember = () => {
    setModalState({
      isOpen: true,
      mode: 'add',
      member: null
    });
  };

  const handleDeactivateMember = (member) => {
    // Handle member deactivation
    console.log('Deactivating member:', member.name);
  };

  const handleExportMembers = () => {
    // Handle export functionality
    console.log('Exporting members...');
  };

  const handleSaveMember = (memberData) => {
    // Handle save member functionality
    console.log('Saving member:', memberData);
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      mode: 'view',
      member: null
    });
  };

  return (
    <div className="min-h-screen bg-background mt-12">
      <Header />
      <NavigationSidebar isSidebarCollapsed={isSidebarCollapsed} isSidebarVisible={isSidebarVisible} />
      <AlertCenter />
      
      <main className={`${isSidebarCollapsed ? 'ml-20' : 'ml-64'} pt-0 transition-all duration-200`}>
        <div className="p-6">
          <BreadcrumbNavigation />
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={24} color="white" />
                </div>
                <h1
                  className="text-3xl font-heading font-bold text-text-primary mb-2" 
                >
                  Member Management
                </h1>
              </div>
              <p className="text-text-secondary">
                Manage club members, track membership status, and handle member operations
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <Button
                variant="outline"
                iconName="Download"
                iconPosition="left"
                onClick={handleExportMembers}
                className="text-text-secondary hover:text-primary border-border hover:border-primary"
              >
                {t('buttons.export', 'Export Data')}
              </Button>

              <Button
                variant="primary"
                iconName="UserPlus"
                iconPosition="left"
                onClick={handleAddMember}
              >
                {t('buttons.addNew', 'Add New Member')}
              </Button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left Section - Member Table */}
            <div className="xl:col-span-9 space-y-6">
              {/* Filters */}
              <MemberFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                onExportMembers={handleExportMembers}
                selectedCount={selectedMembers.length}
              />

              {/* Member Table */}
              <MemberTable
                members={filteredMembers}
                selectedMembers={selectedMembers}
                onSelectMember={handleSelectMember}
                onSelectAll={handleSelectAll}
                onViewMember={handleViewMember}
                onEditMember={handleEditMember}
                onDeactivateMember={handleDeactivateMember}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                sortConfig={sortConfig}
                onSort={handleSort}
              />
            </div>

            {/* Right Section - Summary Cards */}
            <div className="xl:col-span-3">
              <MembershipSummary summaryData={summaryData} />
            </div>
          </div>
        </div>
      </main>

      {/* Member Modal */}
      <MemberModal
        member={modalState.member}
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        mode={modalState.mode}
        onSave={handleSaveMember}
      />
    </div>
  );
};

export default MemberManagement;