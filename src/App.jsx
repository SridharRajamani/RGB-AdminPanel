import React, { useState, useEffect } from "react";
import Routes from "./Routes";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

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
    <ThemeProvider>
      <AuthProvider>
        <Routes
          isSidebarCollapsed={isSidebarCollapsed}
          isSidebarVisible={isSidebarVisible}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
