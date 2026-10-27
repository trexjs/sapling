import { useMemo } from 'react';

import { useLms } from '../context/LmsContext.jsx';
import { StatusBadge } from '../components/common/StatusBadge.jsx';

const statsCards = [
  {
    key: 'totalCourses',
    label: 'Total Courses',
  },
  {
    key: 'publishedCourses',
    label: 'Published',
  },
  {
    key: 'enrollments',
    label: 'Total Enrollments',
  },
];

const latestCoursesLimit = 5;

export default function DashboardPage() {
  const {
    state: { courses, isLoading },
  } = useLms();

  const stats = useMemo(() => {
    const totalCourses = courses.length;
    const publishedCourses = courses.filter((course) => course.status === 'published').length;
    const enrollments = courses.reduce((acc, course) => acc + (course.enrollments || 0), 0);

    return { totalCourses, publishedCourses, enrollments };
  }, [courses]);

  const latestCourses = useMemo(
    () => courses.slice(0, latestCoursesLimit),
    [courses]
  );

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-semibold text-slate-900">Overview</h2>
        <p className="mt-1 text-sm text-slate-600">
          Monitor platform activity and manage courses efficiently.
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {statsCards.map((stat) => (
            <div key={stat.key} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-medium text-slate-500">{stat.label}</h3>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {stats[stat.key] ?? 0}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Latest Courses</h2>
          {isLoading && <span className="text-sm text-slate-500">Loading...</span>}
        </div>

        <div className="mt-4 space-y-3">
          {latestCourses.map((course) => (
            <div
              key={course._id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">{course.title}</p>
                <p className="text-xs text-slate-500">{course.category || 'General'}</p>
              </div>
              <div className="flex items-center gap-6">
                <StatusBadge status={course.status} />
                <p className="text-sm font-semibold text-primary-600">{course.enrollments || 0} students</p>
              </div>
            </div>
          ))}

          {!latestCourses.length && !isLoading && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
              No courses available. Start by creating your first course.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
