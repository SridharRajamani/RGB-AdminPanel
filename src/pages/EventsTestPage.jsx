import React, { useState, useEffect } from 'react';

const EventsTestPage = () => {
  const [events, setEvents] = useState([]);

  // Load events from localStorage
  useEffect(() => {
    const loadEvents = () => {
      try {
        const savedEvents = localStorage.getItem('rotary_events');
        if (savedEvents) {
          setEvents(JSON.parse(savedEvents));
        }
      } catch (error) {
        console.error('Error loading events:', error);
      }
    };

    loadEvents();

    // Listen for storage changes
    const handleStorage = () => {
      loadEvents();
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('eventsDataUpdated', handleStorage);
    
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('eventsDataUpdated', handleStorage);
    };
  }, []);

  // Test function to add a sample event
  const addTestEvent = () => {
    const testEvent = {
      id: Date.now(),
      title: "Test Event from Landing Page",
      type: "meeting",
      service: "Club Service",
      date: "2024-12-25",
      time: "18:00",
      location: "Test Location",
      description: "This is a test event created from the landing page",
      status: "confirmed",
      attendeeCount: 10,
      maxAttendees: 50,
      pendingApprovals: 0,
      registrationRequired: true,
      registrationDeadline: "2024-12-24"
    };

    const updatedEvents = [...events, testEvent];
    setEvents(updatedEvents);
    localStorage.setItem('rotary_events', JSON.stringify(updatedEvents));
    window.dispatchEvent(new CustomEvent('eventsDataUpdated'));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Events Integration Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <button
            onClick={addTestEvent}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Test Event
          </button>
          <p className="text-sm text-gray-600 mt-2">
            This will add a test event to localStorage and sync with admin panel
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Events from localStorage ({events.length})</h2>
          
          {events.length === 0 ? (
            <p className="text-gray-500">No events found. Create events in the admin panel to see them here.</p>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {event.service}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <strong>Date:</strong> {event.date}
                    </div>
                    <div>
                      <strong>Time:</strong> {event.time}
                    </div>
                    <div>
                      <strong>Location:</strong> {event.location}
                    </div>
                    <div>
                      <strong>Status:</strong> {event.status}
                    </div>
                  </div>
                  <p className="text-gray-700 mt-2">{event.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">How to Test:</h3>
          <ol className="list-decimal list-inside text-yellow-700 space-y-1">
            <li>Go to Admin Panel → Event Management</li>
            <li>Create a new event with service category</li>
            <li>Come back to this page to see the event appear</li>
            <li>Or click "Add Test Event" above to test the sync</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default EventsTestPage;
