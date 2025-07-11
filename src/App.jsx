import React, { useState, useEffect } from "react";
import Routes from "./Routes";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SystemSettingsProvider } from "./context/SystemSettingsContext";
import { LanguageProvider } from "./context/LanguageContext";
import { NotificationProvider } from "./context/NotificationContext";
import CoolAlertProvider from "./components/ui/CoolAlertProvider";
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  useEffect(() => {
    const handleToggleSidebarCollapse = () => {
      setIsSidebarCollapsed((prev) => !prev);
    };
    const handleToggleSidebarVisibility = () => {
      setIsSidebarVisible((prev) => !prev);
    };
    window.addEventListener('toggleSidebarCollapse', handleToggleSidebarCollapse);
    window.addEventListener('toggleSidebarVisibility', handleToggleSidebarVisibility);
    return () => {
      window.removeEventListener('toggleSidebarCollapse', handleToggleSidebarCollapse);
      window.removeEventListener('toggleSidebarVisibility', handleToggleSidebarVisibility);
    };
  }, []);

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID_HERE">
      <ThemeProvider>
        <SystemSettingsProvider>
          <LanguageProvider>
            <NotificationProvider>
              <AuthProvider>
                <CoolAlertProvider>
                  <Routes
                    isSidebarCollapsed={isSidebarCollapsed}
                    isSidebarVisible={isSidebarVisible}
                  />
                </CoolAlertProvider>
              </AuthProvider>
            </NotificationProvider>
          </LanguageProvider>
        </SystemSettingsProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
