// src/routes/index.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { RouteObject } from 'react-router-dom';

// Import all route configurations
import authRoutes from './authRoutes';
import mainRoutes from './mainRoutes';
import engagementRoutes from './engagementRoutes';
import schoolRoutes from './schoolRoutes';
import userRoutes from './userRoutes';

const routes: RouteObject[] = [
  // Auth routes (public)
  ...authRoutes,

  // Main app routes (protected)
  ...mainRoutes,

  // Engagement routes (polls, feedback, kudos)
  ...engagementRoutes,

  // School management routes
  ...schoolRoutes,

  // User management routes (teachers, students, parents)
  ...userRoutes,

  // Default redirect
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />
  },

  // Catch all route
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />
  }
];

export default routes;
