import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { ProtectedRoute } from './components/common/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { WorkoutPage } from './pages/WorkoutPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProgressPage } from './pages/ProgressPage';
import { ProfilePage } from './pages/ProfilePage';

export const App = () => {
  const { isAuthenticated, profile } = useAuth();
  const location = useLocation();

  // Show sidebar only on authenticated dashboard & feature routes
  const showSidebar = isAuthenticated &&
    ['/dashboard', '/workout', '/history', '/progress', '/profile'].some((path) =>
      location.pathname.startsWith(path)
    );

  return (
    <div className="app-container">
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Navbar />

        <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 65px)' }}>
          {showSidebar && <Sidebar />}

          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    profile?.onboarding_completed ? (
                      <Navigate to="/dashboard" replace />
                    ) : (
                      <Navigate to="/onboarding" replace />
                    )
                  ) : (
                    <LandingPage />
                  )
                }
              />
              <Route
                path="/login"
                element={
                  isAuthenticated ? (
                    profile?.onboarding_completed ? (
                      <Navigate to="/dashboard" replace />
                    ) : (
                      <Navigate to="/onboarding" replace />
                    )
                  ) : (
                    <LoginPage />
                  )
                }
              />
              <Route
                path="/register"
                element={
                  isAuthenticated ? (
                    <Navigate to="/onboarding" replace />
                  ) : (
                    <RegisterPage />
                  )
                }
              />

              {/* Onboarding Wizard Route */}
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute requireOnboarding={false}>
                    <OnboardingPage />
                  </ProtectedRoute>
                }
              />

              {/* Authenticated Core Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/workout"
                element={
                  <ProtectedRoute>
                    <WorkoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <HistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/progress"
                element={
                  <ProtectedRoute>
                    <ProgressPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};
