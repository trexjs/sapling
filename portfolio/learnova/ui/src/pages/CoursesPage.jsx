import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { StatusBadge } from '../components/common/StatusBadge.jsx';
import { useLms } from '../context/LmsContext.jsx';

const STATUS_FILTERS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
  { value: 'unpublish', label: 'Unpublished' },
];

export default function CoursesPage() {
  const {
    state: { courses, isLoading, error },
  } = useLms();

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const stats = useMemo(() => {
    const total = courses.length;
    const published = courses.filter((course) => course.status === 'published').length;
    const draft = courses.filter((course) => course.status === 'draft').length;
    return { total, published, draft };
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [courses, searchTerm, statusFilter]);

  const onReset = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl">
        <div className="grid gap-10 p-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-200">
              Admin hub
              <span className="text-slate-400">• Manage courses</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight text-white">Craft and curate your course catalog</h1>
              <p className="max-w-2xl text-sm text-slate-200 lg:text-base">
                Search, filter, and refine every program in seconds. Keep content polished and ready for learners with quick visibility
                into status, enrollments, and performance.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-wide text-white/60">Total courses</p>
                <p className="mt-2 text-3xl font-semibold text-white">{stats.total}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-wide text-white/60">Published</p>
                <p className="mt-2 text-3xl font-semibold text-white">{stats.published}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-wide text-white/60">Draft</p>
                <p className="mt-2 text-3xl font-semibold text-white">{stats.draft}</p>
              </div>
            </div>
          </div>

          <aside className="flex flex-col justify-between gap-4 rounded-2xl bg-white/10 p-6 backdrop-blur">
            <div className="space-y-3">
              <p className="text-sm text-white/80">Ready to launch something new?</p>
              <button
                type="button"
                className="w-full rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-400"
                onClick={() => navigate('/courses/new')}
              >
                + Create a course
              </button>
              <button
                type="button"
                className="w-full rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                onClick={() => navigate('/courses')}
              >
                Browse catalog
              </button>
            </div>
            <p className="text-xs text-white/50">
              Tip: keep drafts under 10 chapters while iterating. Publish when everything’s polished to unlock enrollment notifications.
            </p>
          </aside>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:flex-row xl:items-center xl:justify-between">
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21 15 15m0 0a6 6 0 1 0-8.485-8.485A6 6 0 0 0 15 15Z" />
                </svg>
              </span>
              <input
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 transition focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-100"
                placeholder="Search by course title, tag, or instructor..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStatusFilter(option.value)}
                  className={`inline-flex h-11 items-center justify-center rounded-full border px-5 text-xs font-semibold transition ${
                    statusFilter === option.value
                      ? 'border-primary-200 bg-primary-50 text-primary-600'
                      : 'border-slate-200 text-slate-500 hover:border-primary-200 hover:text-primary-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-xs font-semibold text-slate-600 transition hover:border-primary-200 hover:text-primary-600"
              onClick={onReset}
            >
              Reset filters
            </button>
            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
              Showing
              <span className="rounded-full bg-white px-2 py-0.5 text-primary-600">{filteredCourses.length}</span>
              courses
            </div>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</div>
        ) : null}

        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-48 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        ) : filteredCourses.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course) => (
              <article
                key={course._id}
                className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{course.title}</h3>
                      <p className="text-xs uppercase tracking-wide text-slate-400">{course.category || 'General'}</p>
                    </div>
                    <StatusBadge status={course.status} />
                  </div>

                  <p className="text-sm text-slate-600">
                    {course.description?.length > 120
                      ? `${course.description.slice(0, 117)}...`
                      : course.description || 'No description yet.'}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-xs text-slate-500">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-base font-semibold leading-tight text-slate-900">
                        {course.students?.length || course.enrollments || 0}
                      </p>
                      <p className="mt-1">Enrolled learners</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-base font-semibold leading-tight text-slate-900">{course.chapters?.length || 0}</p>
                      <p className="mt-1">Total chapters</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-2 text-primary-600">
                    <span className="text-lg font-semibold">${course.price?.toFixed?.(2) ?? '0.00'}</span>
                    {course.discount ? (
                      <span className="rounded-full bg-primary-50 px-2 py-1 text-xs font-semibold text-primary-600">
                        {course.discount}% off
                      </span>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-primary-200 hover:text-primary-600"
                      onClick={() => navigate(`/courses/${course._id}`)}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="rounded-full bg-primary-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary-500"
                      onClick={() => navigate(`/courses/${course._id}/edit`)}
                    >
                      Manage
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h3 className="text-xl font-semibold text-slate-800">No courses match your filters</h3>
            <p className="mt-2 text-sm text-slate-500">
              Adjust the search or create a new course to keep your catalog fresh.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:border-primary-200 hover:text-primary-600"
                onClick={onReset}
              >
                Clear filters
              </button>
              <button
                type="button"
                className="rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary-500"
                onClick={() => navigate('/courses/new')}
              >
                Create a course
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
