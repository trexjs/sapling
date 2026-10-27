// src/routes/schoolRoutes.tsx
import React from 'react';
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Layout from '../components/layout/Layout';
import SchoolsPage from '../pages/SchoolsPage';
import SchoolDetailPage from '../pages/SchoolDetailPage';
import SchoolForm from '../modules/schools/SchoolForm';

const schoolRoutes: RouteObject[] = [
  {
    path: '/schools',
    element: (
      <ProtectedRoute>
        <Layout title="Schools">
          <SchoolsPage />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/schools/:id',
    element: (
      <ProtectedRoute>
        <Layout title="School Details">
          <SchoolDetailPage />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/schools/:id/edit',
    element: (
      <ProtectedRoute>
        <Layout title="Edit School">
          <SchoolForm />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/schools/create',
    element: (
      <ProtectedRoute>
        <Layout title="Create School">
          <SchoolForm />
        </Layout>
      </ProtectedRoute>
    )
  }
];

export default schoolRoutes;
