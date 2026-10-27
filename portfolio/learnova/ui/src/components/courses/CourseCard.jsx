import { Link } from 'react-router-dom';

import { StatusBadge } from '../common/StatusBadge.jsx';

export const CourseCard = ({ course }) => {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            <Link to={`/courses/${course._id}`} className="hover:underline">
              {course.title}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {course.description?.length > 120 ? `${course.description.slice(0, 117)}...` : course.description}
          </p>
        </div>
        <StatusBadge status={course.status} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
        <span>Category: {course.category || 'General'}</span>
        <span>Duration: {course.duration || 0} hrs</span>
        <span>Enrollments: {course.enrollments || 0}</span>
        <span className="font-semibold text-primary-600">${course.price?.toFixed?.(2) ?? '0.00'}</span>
      </div>
    </div>
  );
};
