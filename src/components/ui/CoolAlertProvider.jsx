import React, { createContext, useContext, useState, useCallback } from 'react';
import CoolAlert from './CoolAlert';

// Create Alert Context
const CoolAlertContext = createContext();

export const useCoolAlertContext = () => {
  const context = useContext(CoolAlertContext);
  if (!context) {
    throw new Error('useCoolAlertContext must be used within CoolAlertProvider');
  }
  return context;
};

const CoolAlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = useCallback((alertConfig) => {
    const id = Date.now() + Math.random();
    const alert = { id, ...alertConfig, isOpen: true };

    setAlerts(prev => [...prev, alert]);

    // Auto close if specified
    if (alertConfig.autoClose) {
      setTimeout(() => {
        closeAlert(id);
      }, alertConfig.autoCloseDelay || 3000);
    }

    // Return close function for manual closing
    return () => closeAlert(id);
  }, []);

  const closeAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const value = {
    alerts,
    showAlert,
    closeAlert
  };

  return (
    <CoolAlertContext.Provider value={value}>
      {children}

      {/* Render all active alerts */}
      {alerts.map((alert) => (
        <CoolAlert
          key={alert.id}
          {...alert}
          onClose={() => closeAlert(alert.id)}
        />
      ))}
    </CoolAlertContext.Provider>
  );
};

export default CoolAlertProvider;
