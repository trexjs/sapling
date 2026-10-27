import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { useLms } from './context/LmsContext.jsx';
import { AppLayout } from './components/layout/AppLayout.jsx';

const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const CoursesPage = lazy(() => import('./pages/CoursesPage.jsx'));
const CourseDetailsPage = lazy(() => import('./pages/CourseDetailsPage.jsx'));
const CourseCreatePage = lazy(() => import('./pages/CourseCreatePage.jsx'));
const CourseEditPage = lazy(() => import('./pages/CourseEditPage.jsx'));

export default function App() {
  const { state } = useLms();

  return (
    <AppLayout>
      <Suspense fallback={<div className="p-6">Loading...</div>}>
        <Routes>
          <Route index element={<DashboardPage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="courses/new" element={<CourseCreatePage />} />
          <Route path="courses/:courseId" element={<CourseDetailsPage />} />
          <Route path="courses/:courseId/edit" element={<CourseEditPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AppLayout>
  );
}
