import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import Dashboard from "pages/dashboard";
import EventManagement from "pages/event-management";
import CommunicationCenter from "pages/communication-center";
import MemberManagement from "pages/member-management";
import ProjectManagement from "pages/project-management";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/event-management" element={<EventManagement />} />
        <Route path="/communication-center" element={<CommunicationCenter />} />
        <Route path="/member-management" element={<MemberManagement />} />
        <Route path="/project-management" element={<ProjectManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;