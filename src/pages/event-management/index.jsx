import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import AlertCenter from '../../components/ui/AlertCenter';
import Button from '../../components/ui/Button';
import EventCalendar from './components/EventCalendar';
import EventList from './components/EventList';
import CreateEventModal from './components/CreateEventModal';
import Icon from '../../components/AppIcon';

const EventManagement = ({ isSidebarCollapsed = false, isSidebarVisible = true }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Mock events data
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Weekly Club Meeting",
      type: "meeting",
      date: "2024-12-20",
      time: "19:00",
      location: "Rotary Club Hall, Mumbai",
      description: "Regular weekly meeting to discuss club activities and upcoming projects.",
      status: "confirmed",
      attendeeCount: 45,
      maxAttendees: 60,
      pendingApprovals: 3,
      registrationRequired: true,
      registrationDeadline: "2024-12-19"
    },
    {
      id: 2,
      title: "Annual Charity Gala",
      type: "fundraising",
      date: "2024-12-25",
      time: "18:30",
      location: "Grand Ballroom, Hotel Taj",
      description: "Annual fundraising gala to support our community health initiatives.",
      status: "confirmed",
      attendeeCount: 120,
      maxAttendees: 150,
      pendingApprovals: 8,
      registrationRequired: true,
      registrationDeadline: "2024-12-23"
    },
    {
      id: 3,
      title: "Community Health Camp",
      type: "community-service",
      date: "2024-12-22",
      time: "09:00",
      location: "Government School, Andheri",
      description: "Free health checkup camp for underprivileged community members.",
      status: "confirmed",
      attendeeCount: 25,
      maxAttendees: 30,
      pendingApprovals: 2,
      registrationRequired: true,
      registrationDeadline: "2024-12-21"
    },
    {
      id: 4,
      title: "New Year Social Gathering",
      type: "social",
      date: "2024-12-31",
      time: "20:00",
      location: "Club Garden, Bandra",
      description: "New Year celebration with club members and their families.",
      status: "pending",
      attendeeCount: 35,
      maxAttendees: 80,
      pendingApprovals: 5,
      registrationRequired: true,
      registrationDeadline: "2024-12-29"
    },
    {
      id: 5,
      title: "Youth Leadership Workshop",
      type: "community-service",
      date: "2024-12-18",
      time: "14:00",
      location: "Community Center, Powai",
      description: "Leadership development workshop for local youth.",
      status: "completed",
      attendeeCount: 40,
      maxAttendees: 40,
      pendingApprovals: 0,
      registrationRequired: true,
      registrationDeadline: "2024-12-17"
    },
    {
      id: 6,
      title: "Board Meeting",
      type: "meeting",
      date: "2024-12-15",
      time: "10:00",
      location: "Conference Room, Club Office",
      description: "Monthly board meeting to review club operations and finances.",
      status: "completed",
      attendeeCount: 12,
      maxAttendees: 15,
      pendingApprovals: 0,
      registrationRequired: false,
      registrationDeadline: ""
    },
    {
      id: 7,
      title: "Tree Plantation Drive",
      type: "community-service",
      date: "2024-12-28",
      time: "07:00",
      location: "Sanjay Gandhi National Park",
      description: "Environmental initiative to plant 500 trees in the national park.",
      status: "confirmed",
      attendeeCount: 55,
      maxAttendees: 70,
      pendingApprovals: 4,
      registrationRequired: true,
      registrationDeadline: "2024-12-26"
    },
    {
      id: 8,
      title: "Holiday Celebration",
      type: "social",
      date: "2024-12-24",
      time: "16:00",
      location: "Club Auditorium",
      description: "Christmas celebration with cultural programs and dinner.",
      status: "confirmed",
      attendeeCount: 85,
      maxAttendees: 100,
      pendingApprovals: 6,
      registrationRequired: true,
      registrationDeadline: "2024-12-22"
    }
  ]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleCreateEvent = (eventData) => {
    const newEvent = {
      id: events.length + 1,
      ...eventData,
      status: 'pending',
      attendeeCount: 0,
      maxAttendees: parseInt(eventData.maxAttendees) || 50,
      pendingApprovals: 0
    };
    setEvents([...events, newEvent]);
  };

  const handleEditEvent = (eventId) => {
    console.log('Edit event:', eventId);
    // Implementation for edit event
  };

  const handleDuplicateEvent = (eventId) => {
    const eventToDuplicate = events.find(event => event.id === eventId);
    if (eventToDuplicate) {
      const duplicatedEvent = {
        ...eventToDuplicate,
        id: events.length + 1,
        title: `${eventToDuplicate.title} (Copy)`,
        status: 'pending',
        attendeeCount: 0,
        pendingApprovals: 0
      };
      setEvents([...events, duplicatedEvent]);
    }
  };

  const handleCancelEvent = (eventId) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, status: 'cancelled' }
        : event
    ));
  };

  const handleViewAttendees = (eventId) => {
    console.log('View attendees for event:', eventId);
    // Implementation for viewing attendees
  };

  return (
    <div className="min-h-screen bg-background " >
      <Header />
      <NavigationSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} isSidebarCollapsed={isSidebarCollapsed} isSidebarVisible={isSidebarVisible} />
      <AlertCenter />
      
      <main className={`${!isSidebarVisible ? 'ml-0' : isSidebarCollapsed ? 'ml-20' : 'ml-64'} pt-10 transition-all duration-200`}>
        <div className="p-6">
          <BreadcrumbNavigation />

          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Icon name="Calendar" size={24} color="white" />
                </div>
                <h1 className="text-3xl font-heading font-bold text-text-primary">
                  Event Management
                </h1>
              </div>
              <p className="text-text-secondary">
                Plan, coordinate, and track all club events and activities
              </p>
            </div>
            
            <Button
              variant="primary"
              size="lg"
              iconName="Plus"
              iconPosition="left"
              onClick={() => setIsCreateModalOpen(true)}
              className="shadow-lg"
            >
              Create New Event
            </Button>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Calendar Panel */}
            <div className="xl:col-span-4">
              <EventCalendar
                events={events}
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
              />
            </div>

            {/* Events List Panel */}
            <div className="xl:col-span-8">
              <EventList
                events={events}
                onEditEvent={handleEditEvent}
                onDuplicateEvent={handleDuplicateEvent}
                onCancelEvent={handleCancelEvent}
                onViewAttendees={handleViewAttendees}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateEvent={handleCreateEvent}
      />
    </div>
  );
};

export default EventManagement;