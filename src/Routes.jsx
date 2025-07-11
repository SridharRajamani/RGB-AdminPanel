import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/auth/ProtectedRoute";
import RouteGuard from "components/auth/RouteGuard";
import { useAuth } from "context/AuthContext";

// Landing Page Components
import PreLoader from "components/PreLoader/PreLoader";
import Navbar from "components/Buttons/Navbar/Navbar";
import Footer from "components/Footer/Footer";
import LandingContent from "pages/LandingPage/LandingContent";
import WhoWeAre from "pages/LandingPage/WhoWeAre";
import Events from "pages/LandingPage/Events";
import StrategicPriorityAreas from "pages/LandingPage/StrategicPriorityAreas";
import Donate from "pages/LandingPage/Donate";
import WhatWeareDoing from "pages/LandingPage/WhatWeAreDoing";
import JoinUsPaymentFlow from "pages/LandingPage/JoinUsPaymentFlow";

// Admin Panel Components
import Dashboard from "pages/AdminPanel/dashboard";
import EventManagement from "pages/AdminPanel/event-management";
import CommunicationCenter from "pages/AdminPanel/communication-center";
import MemberManagement from "pages/AdminPanel/member-management";
import ProjectManagement from "pages/AdminPanel/project-management";
import FinancialReports from "pages/AdminPanel/financial-reports";
import Donations from "pages/AdminPanel/donations";
import Login from "pages/AdminPanel/auth/Login";
import UserManagement from "pages/AdminPanel/admin/UserManagement";
import UserProfile from "pages/AdminPanel/profile/UserProfile";
import HelpSupport from "pages/AdminPanel/support/HelpSupport";
import Settings from "pages/AdminPanel/settings";
import LandingContentForm from "pages/AdminPanel/video-management";
import CoolAlertDemo from "pages/AdminPanel/CoolAlertDemo";
import NotFound from "pages/AdminPanel/NotFound";
import About from "pages/AdminPanel/about";
import FocusAreasManagement from "pages/AdminPanel/focus-areas";
import SupportRotaryManagement from "pages/AdminPanel/support-rotary";
import MemberInquisitiveManagement from "pages/AdminPanel/member-inquisitive";
import LocalStorageDebugger from "debug/LocalStorageDebugger";


// AppContent component with loading and navigation logic
function AppContent({ isSidebarCollapsed, isSidebarVisible }) {
  const [loading, setLoading] = useState(true);
  const { logoutLoading } = useAuth();
  const location = useLocation();

  // Initial loading effect (only on page refresh/first load)
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  // Hide Navbar and Footer on admin panel routes
  const hideNavAndFooter = location.pathname.startsWith('/dashboard') ||
                          location.pathname.startsWith('/event-management') ||
                          location.pathname.startsWith('/focus-areas') ||
                          location.pathname.startsWith('/member-inquisitive') ||
                          location.pathname.startsWith('/communication-center') ||
                          location.pathname.startsWith('/member-management') ||
                          location.pathname.startsWith('/project-management') ||
                          location.pathname.startsWith('/financial-reports') ||
                          location.pathname.startsWith('/donations') ||
                          location.pathname.startsWith('/settings') ||
                          location.pathname.startsWith('/admin') ||
                          location.pathname.startsWith('/profile') ||
                          location.pathname.startsWith('/help-support') ||
                          location.pathname.startsWith('/landing-content-form') ||
                          location.pathname.startsWith('/cool-alert-demo') ||
                          location.pathname.startsWith('/support-rotary') ||
                          location.pathname.startsWith('/debug');

  return (
    <>
      {loading || logoutLoading ? (
        <PreLoader />
      ) : (
        <>
          {!hideNavAndFooter && <Navbar />}
          <RouterRoutes>
            {/* Landing Page Route */}
            <Route path="/" element={
              <>
                <LandingContent />
                <WhoWeAre />
                <Events />
                <StrategicPriorityAreas />
                <Donate />
                <WhatWeareDoing />
              </>
            } />

            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/join-us" element={<JoinUsPaymentFlow />} />

            {/* Protected Admin Panel Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard isSidebarCollapsed={isSidebarCollapsed} isSidebarVisible={isSidebarVisible} />
            </ProtectedRoute>
          } />
          <Route path="/event-management" element={
            <ProtectedRoute requiredPermission="event_management">
              <EventManagement isSidebarCollapsed={isSidebarCollapsed} isSidebarVisible={isSidebarVisible} />
            </ProtectedRoute>
          } />
          <Route path="/focus-areas" element={
            <ProtectedRoute requiredPermission="focus_areas_management">
              <FocusAreasManagement isSidebarCollapsed={isSidebarCollapsed} isSidebarVisible={isSidebarVisible} />
            </ProtectedRoute>
          } />
          <Route path="/member-inquisitive" element={
            <ProtectedRoute requiredPermission="member_inquisitive_management">
              <MemberInquisitiveManagement isSidebarCollapsed={isSidebarCollapsed} isSidebarVisible={isSidebarVisible} />
            </ProtectedRoute>
          } />
          <Route path="/support-rotary" element={
            <ProtectedRoute requiredPermission="support_rotary_management">
              <SupportRotaryManagement isSidebarCollapsed={isSidebarCollapsed} isSidebarVisible={isSidebarVisible} />
            </ProtectedRoute>
          } />
          <Route path="/communication-center" element={
            <ProtectedRoute requiredPermission="communication_center">
              <CommunicationCenter isSidebarCollapsed={isSidebarCollapsed} isSidebarVisible={isSidebarVisible} />
            </ProtectedRoute>
          } />
          <Route path="/member-management" element={
            <ProtectedRoute requiredPermission="member_management">
              <MemberManagement isSidebarCollapsed={isSidebarCollapsed} isSidebarVisible={isSidebarVisible} />
            </ProtectedRoute>
          } />
          <Route path="/project-management" element={
            <ProtectedRoute requiredPermission="project_management">
              <ProjectManagement isSidebarCollapsed={isSidebarCollapsed} isSidebarVisible={isSidebarVisible} />
            </ProtectedRoute>
          } />
          <Route path="/financial-reports" element={
            <ProtectedRoute requiredPermission="financial_reports">
              <FinancialReports isSidebarCollapsed={isSidebarCollapsed} isSidebarVisible={isSidebarVisible} />
            </ProtectedRoute>
          } />
          <Route path="/donations" element={
            <RouteGuard requiredPermissions={['donations_view', 'donations_manage']} requireAll={false}>
              <Donations isSidebarCollapsed={isSidebarCollapsed} isSidebarVisible={isSidebarVisible} />
            </RouteGuard>
          } />
          <Route path="/settings" element={
            <ProtectedRoute requiredPermission="settings">
              <Settings isSidebarCollapsed={isSidebarCollapsed} isSidebarVisible={isSidebarVisible} />
            </ProtectedRoute>
          } />
          <Route path="/landing-content-form" element={
            <ProtectedRoute requiredPermission="content_management">
              <LandingContentForm isSidebarCollapsed={isSidebarCollapsed} isSidebarVisible={isSidebarVisible} />
            </ProtectedRoute>
          } />
          <Route path="/admin/about" element={
            <ProtectedRoute requiredPermission="content_management">
              <About isSidebarCollapsed={isSidebarCollapsed} isSidebarVisible={isSidebarVisible} />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/users" element={
            <RouteGuard requiredPermissions={['user_management']}>
              <UserManagement isSidebarCollapsed={isSidebarCollapsed} isSidebarVisible={isSidebarVisible} />
            </RouteGuard>
          } />

          {/* Profile Routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />

          {/* Support Routes */}
          <Route path="/help-support" element={
            <ProtectedRoute>
              <HelpSupport />
            </ProtectedRoute>
          } />

          {/* Demo Routes */}
          <Route path="/cool-alert-demo" element={
            <ProtectedRoute>
              <CoolAlertDemo />
            </ProtectedRoute>
          } />

          {/* Debug Routes */}
          <Route path="/debug/localstorage" element={
            <ProtectedRoute>
              <LocalStorageDebugger />
            </ProtectedRoute>
          } />
          <Route path="/support-rotary" element={
            <ProtectedRoute requiredPermission="project_management">
              <SupportRotaryManagement isSidebarCollapsed={isSidebarCollapsed} isSidebarVisible={isSidebarVisible} />
            </ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
          </RouterRoutes>
          {!hideNavAndFooter && <Footer />}
        </>
      )}
    </>
  );
}

const Routes = ({ isSidebarCollapsed, isSidebarVisible }) => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <AppContent isSidebarCollapsed={isSidebarCollapsed} isSidebarVisible={isSidebarVisible} />
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;