// src/routes/engagementRoutes.tsx
import React from 'react';
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Layout from '../components/layout/Layout';
import PollsPage from '../pages/PollsPage';
import PollCreateForm from '../components/engagement/PollCreateForm';
import PollView from '../components/engagement/PollView';
import PollEditForm from '../components/engagement/PollEditForm';
import FeedbackView from '../components/engagement/FeedbackView';
import FeedbackCreateForm from '../components/engagement/FeedbackCreateForm';
import FeedbackEditForm from '../components/engagement/FeedbackEditForm';
import FeedbackDetailPage from '../pages/FeedbackDetailPage';
import KudosPage from '../pages/KudosPage';
import KudosCreatePage from '../pages/KudosCreatePage';
import KudosDetailPage from '../pages/KudosDetailPage';
import KudosEditPage from '../pages/KudosEditPage';

const engagementRoutes: RouteObject[] = [
  // Poll Routes
  {
    path: '/polls',
    element: (
      <ProtectedRoute>
        <Layout title="Polls">
          <PollsPage />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/polls/create',
    element: (
      <ProtectedRoute>
        <Layout title="Create Poll">
          <PollCreateForm />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/polls/:id',
    element: (
      <ProtectedRoute>
        <Layout title="Poll Details">
          <PollView />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/polls/:id/edit',
    element: (
      <ProtectedRoute>
        <Layout title="Edit Poll">
          <PollEditForm />
        </Layout>
      </ProtectedRoute>
    )
  },

  // Feedback Routes
  {
    path: '/feedback',
    element: (
      <ProtectedRoute>
        <Layout title="Feedback">
          <FeedbackView />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/feedback/create',
    element: (
      <ProtectedRoute>
        <Layout title="Create Feedback">
          <FeedbackCreateForm />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/feedback/:id',
    element: (
      <ProtectedRoute>
        <Layout title="Feedback Details">
          <FeedbackDetailPage />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/feedback/:id/edit',
    element: (
      <ProtectedRoute>
        <Layout title="Edit Feedback">
          <FeedbackEditForm />
        </Layout>
      </ProtectedRoute>
    )
  },

  // Kudos Routes
  {
    path: '/kudos',
    element: (
      <ProtectedRoute>
        <Layout title="Kudos">
          <KudosPage />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/kudos/create',
    element: (
      <ProtectedRoute>
        <Layout title="Give Kudos">
          <KudosCreatePage />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/kudos/:id',
    element: (
      <ProtectedRoute>
        <Layout title="Kudos Details">
          <KudosDetailPage />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/kudos/:id/edit',
    element: (
      <ProtectedRoute>
        <Layout title="Edit Kudos">
          <KudosEditPage />
        </Layout>
      </ProtectedRoute>
    )
  }
];

export default engagementRoutes;
