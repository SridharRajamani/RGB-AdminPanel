import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/auth/ProtectedRoute";
import RouteGuard from "components/auth/RouteGuard";
// Add your imports here
import Dashboard from "pages/dashboard";
import EventManagement from "pages/event-management";
import CommunicationCenter from "pages/communication-center";
import MemberManagement from "pages/member-management";
import ProjectManagement from "pages/project-management";
import FinancialReports from "pages/financial-reports";
import Donations from "pages/donations";
import Login from "pages/auth/Login";
import UserManagement from "pages/admin/UserManagement";
import UserProfile from "pages/profile/UserProfile";
import HelpSupport from "pages/support/HelpSupport";
import Settings from "pages/settings";
import CoolAlertDemo from "pages/CoolAlertDemo";
import NotFound from "pages/NotFound";

const Routes = ({ isSidebarCollapsed, isSidebarVisible }) => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard isSidebarCollapsed={isSidebarCollapsed} isSidebarVisible={isSidebarVisible} />
          </ProtectedRoute>
        } />
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

        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;