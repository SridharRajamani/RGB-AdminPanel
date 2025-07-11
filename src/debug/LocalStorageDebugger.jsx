import React, { useState, useEffect } from 'react';

const LocalStorageDebugger = () => {
  const [eventsData, setEventsData] = useState(null);
  const [supportData, setSupportData] = useState(null);
  const [memberData, setMemberData] = useState(null);

  const loadAllData = () => {
    try {
      // Load events data
      const events = localStorage.getItem('rotary_events');
      setEventsData(events ? JSON.parse(events) : null);

      // Load support projects data
      const support = localStorage.getItem('rotary_support_projects');
      setSupportData(support ? JSON.parse(support) : null);

      // Load member data
      const members = localStorage.getItem('rotary_members');
      setMemberData(members ? JSON.parse(members) : null);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear ALL localStorage data? This cannot be undone.')) {
      localStorage.removeItem('rotary_events');
      localStorage.removeItem('rotary_support_projects');
      localStorage.removeItem('rotary_members');
      loadAllData();
      alert('All data cleared!');
    }
  };

  const addTestEvent = () => {
    const testEvent = {
      id: Date.now(),
      title: "Test Event - " + new Date().toLocaleTimeString(),
      type: "meeting",
      service: "Club Service",
      date: "2024-12-25",
      time: "18:00",
      location: "Test Location",
      description: "This is a test event to verify data storage",
      status: "confirmed",
      attendeeCount: 10,
      maxAttendees: 50,
      pendingApprovals: 0,
      registrationRequired: true,
      registrationDeadline: "2024-12-24"
    };

    const currentEvents = eventsData || [];
    const updatedEvents = [...currentEvents, testEvent];
    localStorage.setItem('rotary_events', JSON.stringify(updatedEvents));
    window.dispatchEvent(new CustomEvent('eventsDataUpdated'));
    loadAllData();
    alert('Test event added!');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">LocalStorage Data Debugger</h2>
      
      <div className="flex gap-4 mb-6">
        <button 
          onClick={loadAllData}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh Data
        </button>
        <button 
          onClick={addTestEvent}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Test Event
        </button>
        <button 
          onClick={clearAllData}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear All Data
        </button>
      </div>

      {/* Events Data */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Events Data ({eventsData?.length || 0} events)</h3>
        <div className="bg-gray-100 p-4 rounded max-h-60 overflow-y-auto">
          <pre className="text-sm">
            {eventsData ? JSON.stringify(eventsData, null, 2) : 'No events data found'}
          </pre>
        </div>
      </div>

      {/* Support Projects Data */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Support Projects Data ({supportData?.length || 0} projects)</h3>
        <div className="bg-gray-100 p-4 rounded max-h-60 overflow-y-auto">
          <pre className="text-sm">
            {supportData ? JSON.stringify(supportData, null, 2) : 'No support projects data found'}
          </pre>
        </div>
      </div>

      {/* Member Data */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Member Data ({memberData?.length || 0} members)</h3>
        <div className="bg-gray-100 p-4 rounded max-h-60 overflow-y-auto">
          <pre className="text-sm">
            {memberData ? JSON.stringify(memberData, null, 2) : 'No member data found'}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default LocalStorageDebugger;
