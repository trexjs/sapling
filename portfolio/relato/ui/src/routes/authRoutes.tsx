// src/routes/authRoutes.tsx
import React from 'react';
import { RouteObject } from 'react-router-dom';
import LoginPage from '../components/auth/LoginPage';
import RegisterPage from '../components/auth/RegisterPage';

const authRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  }
];

export default authRoutes;
