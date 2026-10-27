// src/routes/userRoutes.tsx
import React from 'react';
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Layout from '../components/layout/Layout';
import TeachersPage from '../pages/TeachersPage';
import TeacherDetailPage from '../pages/TeacherDetailPage';
import TeacherForm from '../modules/teachers/TeacherForm';
import StudentsPage from '../pages/StudentsPage';
import StudentDetailPage from '../pages/StudentDetailPage';
import StudentForm from '../modules/students/StudentForm';
import ParentsPage from '../pages/ParentsPage';
import ParentDashboard from '../pages/ParentDashboard';
import GuardianDetailPage from '../pages/GuardianDetailPage';

const userRoutes: RouteObject[] = [
  // Teacher Routes
  {
    path: '/teachers',
    element: (
      <ProtectedRoute>
        <Layout title="Teachers">
          <TeachersPage />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/teachers/:id',
    element: (
      <ProtectedRoute>
        <Layout title="Teacher Details">
          <TeacherDetailPage />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/teachers/:id/edit',
    element: (
      <ProtectedRoute>
        <Layout title="Edit Teacher">
          <TeacherForm />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/teachers/create',
    element: (
      <ProtectedRoute>
        <Layout title="Onboard Teacher">
          <TeacherForm />
        </Layout>
      </ProtectedRoute>
    )
  },

  // Student Routes
  {
    path: '/students',
    element: (
      <ProtectedRoute>
        <Layout title="Students">
          <StudentsPage />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/students/:id',
    element: (
      <ProtectedRoute>
        <Layout title="Student Details">
          <StudentDetailPage />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/students/:id/edit',
    element: (
      <ProtectedRoute>
        <Layout title="Edit Student">
          <StudentForm />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/students/create',
    element: (
      <ProtectedRoute>
        <Layout title="Register Student">
          <StudentForm />
        </Layout>
      </ProtectedRoute>
    )
  },

  // Parent Routes
  {
    path: '/parents',
    element: (
      <ProtectedRoute>
        <Layout title="Parents">
          <ParentsPage />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/parent-dashboard',
    element: (
      <ProtectedRoute>
        <Layout title="My Children">
          <ParentDashboard />
        </Layout>
      </ProtectedRoute>
    )
  },
  {
    path: '/guardians/:id',
    element: (
      <ProtectedRoute>
        <Layout title="Guardian Details">
          <GuardianDetailPage />
        </Layout>
      </ProtectedRoute>
    )
  }
];

export default userRoutes;
