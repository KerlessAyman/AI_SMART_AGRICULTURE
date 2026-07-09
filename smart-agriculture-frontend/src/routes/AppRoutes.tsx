import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// ─── Reusable auth guard ───────────────────────────────────────────────────
import ProtectedRoute from '../components/common/ProtectedRoute';

// ─── Public pages ─────────────────────────────────────────────────────────
import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import ForgotPasswordPage from '../pages/public/ForgotPasswordPage';
import AboutPage from '../pages/public/AboutPage';
import MaintenancePage from '../pages/system/MaintenancePage';
import NotFoundPage from '../pages/system/NotFoundPage';

// ─── Protected pages ──────────────────────────────────────────────────────
import DashboardRouter from '../pages/DashboardRouter';
import MarketplacePage from '../pages/marketplace/MarketplacePage';
import ReportsPage from '../pages/reports/ReportsPage';
import ProfilePage from '../pages/profile/ProfilePage';
import NotificationsPage from '../pages/profile/NotificationsPage';
import SettingsPage from '../pages/settings/SettingsPage';
import FarmPage from '../pages/FarmPage';
import ExportDocsPage from '../pages/export/ExportDocsPage';
import AdminDashboard from '../pages/admin/AdminDashboard';

// ─── AI module pages ──────────────────────────────────────────────────────
import DiseaseDetectionPage from '../pages/ai/DiseaseDetectionPage';
import QualityAssessmentPage from '../pages/ai/QualityAssessmentPage';
import ExportIntelligencePage from '../pages/ai/ExportIntelligencePage';
import SmartEnvironmentPage from '../pages/ai/SmartEnvironmentPage';

// ─── Chatbot ──────────────────────────────────────────────────────────────
import { ChatbotPage } from '../pages/chatbot/ChatbotPage';

import ResetPasswordPage from '../pages/public/ResetPasswordPage';



const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public: accessible without authentication ─────────────────── */}
        <Route path="/"                element={<LandingPage />} />
        <Route path="/signin"          element={<LoginPage />} />
        <Route path="/register"        element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password"  element={<ResetPasswordPage />} />
        <Route path="/about"           element={<AboutPage />} />
        <Route path="/maintenance"     element={<MaintenancePage />} />

        {/* Legacy /login alias → redirect to /signin */}
        <Route path="/login" element={<Navigate to="/signin" replace />} />

        {/* ── Protected: require a valid accessToken ────────────────────── */}

        {/* Core */}
        <Route path="/dashboard" element={
          <ProtectedRoute><DashboardRouter /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><ProfilePage /></ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute><NotificationsPage /></ProtectedRoute>
        } />
        <Route
 path="/settings"
 element={
<ProtectedRoute>
<ProfilePage />
</ProtectedRoute>
 }
/>
        <Route path="/marketplace" element={
          <ProtectedRoute><MarketplacePage /></ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute><ReportsPage /></ProtectedRoute>
        } />
        <Route path="/farm" element={
          <ProtectedRoute><FarmPage /></ProtectedRoute>
        } />
        <Route path="/export-docs" element={
          <ProtectedRoute><ExportDocsPage /></ProtectedRoute>
        } />

        {/* Admin */}
        <Route path="/admin" element={
          <ProtectedRoute><AdminDashboard /></ProtectedRoute>
        } />

        {/* AI modules */}
        <Route path="/disease" element={
          <ProtectedRoute><DiseaseDetectionPage /></ProtectedRoute>
        } />
        <Route path="/quality" element={
          <ProtectedRoute><QualityAssessmentPage /></ProtectedRoute>
        } />
        <Route path="/export" element={
          <ProtectedRoute><ExportIntelligencePage /></ProtectedRoute>
        } />
        <Route path="/environment" element={
          <ProtectedRoute><SmartEnvironmentPage /></ProtectedRoute>
        } />

        {/* Chatbot — two paths, same component */}
        <Route path="/chatbot" element={
          <ProtectedRoute><ChatbotPage /></ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute><ChatbotPage /></ProtectedRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
