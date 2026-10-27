// src/routes/mainRoutes.tsx
import React from 'react';
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Layout from '../components/layout/Layout';
import Dashboard from '../pages/Dashboard';
import AttendancePage from '../pages/AttendancePage';
import SettingsPage from '../pages/SettingsPage';
import OnboardingPage from '../pages/OnboardingPage';

const mainRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Layout title="Dashboard">
          <Dashboard />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/attendance',
    element: (
      <ProtectedRoute>
        <Layout title="Attendance">
          <AttendancePage />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <Layout title="Settings">
          <SettingsPage />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/onboarding',
    element: (
      <ProtectedRoute>
        <Layout title="Onboarding">
          <OnboardingPage />
        </Layout>
      </ProtectedRoute>
    )
  }
];

export default mainRoutes;
