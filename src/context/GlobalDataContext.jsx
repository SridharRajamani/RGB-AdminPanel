import React, { createContext, useContext, useState } from 'react';

const GlobalDataContext = createContext();
export const useGlobalData = () => useContext(GlobalDataContext);

export const GlobalDataProvider = ({ children }) => {
  // Members data
  const [members] = useState([
    { id: 1, name: "Rajesh Kumar", membershipId: "RC001" },
    { id: 2, name: "Priya Sharma", membershipId: "RC002" },
    { id: 3, name: "Amit Patel", membershipId: "RC003" },
    { id: 4, name: "Sunita Reddy", membershipId: "RC004" },
    { id: 5, name: "Vikram Singh", membershipId: "RC005" },
    { id: 6, name: "Meera Joshi", membershipId: "RC006" },
    { id: 7, name: "Ravi Gupta", membershipId: "RC007" },
    { id: 8, name: "Kavya Nair", membershipId: "RC008" },
  ]);

  // Events data
  const [events] = useState([
    { id: 1, title: "Weekly Club Meeting" },
    { id: 2, title: "Annual Charity Gala" },
    { id: 3, title: "Community Health Camp" },
    { id: 4, title: "New Year Social Gathering" },
    { id: 5, title: "Youth Leadership Workshop" },
    { id: 6, title: "Board Meeting" },
    { id: 7, title: "Tree Plantation Drive" },
    { id: 8, title: "Holiday Celebration" },
  ]);

  // Projects data
  const [projects] = useState([
    { id: 1, name: "Clean Water Initiative" },
    { id: 2, name: "Literacy Program" },
    { id: 3, name: "Health Awareness Drive" },
    { id: 4, name: "Tree Plantation" },
    { id: 5, name: "Women Empowerment" },
  ]);

  return (
    <GlobalDataContext.Provider value={{ members, events, projects }}>
      {children}
    </GlobalDataContext.Provider>
  );
}; 