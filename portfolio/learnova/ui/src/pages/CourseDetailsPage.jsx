import { Link } from 'react-router-dom';

import { useLms } from '../context/LmsContext.jsx';

import { CourseCard } from '../components/courses/CourseCard.jsx';
import { MediaPreview } from '../components/courses/MediaPreview.jsx';
import { StatusBadge } from '../components/common/StatusBadge.jsx';
import { useCourse } from '../hooks/useCourse.js';

export default function CourseDetailsPage() {
  const { course, isLoading } = useCourse();
  const {
    state: { userRole },
  } = useLms();

  if (isLoading) {
    return <div className="rounded-xl border border-slate-200 bg-white p-6">Loading course...</div>;
  }

  if (!course) {
    return (
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 text-center">
        <h2 className="text-xl font-semibold text-slate-800">Course not found</h2>
        <p className="text-sm text-slate-500">The course you are looking for might have been removed or unpublished.</p>
        <Link
          to="/courses"
          className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          Back to Courses
        </Link>
      </div>
    );
  }

  const totalSections = course.chapters?.reduce((acc, chapter) => acc + (chapter.sections?.length || 0), 0) ?? 0;

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl">
        <div className="grid gap-10 p-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-slate-200">
              {course.category || 'General'}
              {course.subCategory ? <span className="text-slate-500">• {course.subCategory}</span> : null}
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight text-white lg:text-5xl">{course.title}</h1>
              <p className="max-w-2xl text-base text-slate-200 lg:text-lg">{course.description}</p>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-amber-400">
                  <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.322.988l-4.204 3.594a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.724-2.885a.563.563 0 0 0-.586 0L6.985 20.53a.562.562 0 0 1-.84-.61l1.285-5.385a.563.563 0 0 0-.182-.557L3.044 10.385a.563.563 0 0 1 .322-.988l5.518-.442a.563.563 0 0 0 .475-.345l2.125-5.111Z" />
                </svg>
                <span className="font-medium">{course.rating ?? '4.8'} rating</span>
                <span className="text-slate-400">({course.reviews?.length || 0} reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span>{course.duration || 0} total hours</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h12m-12 0a1.5 1.5 0 0 1 0-3h12a1.5 1.5 0 0 1 0 3m-12 0v15a1.5 1.5 0 0 0 1.5 1.5h9a1.5 1.5 0 0 0 1.5-1.5v-15m0 0h3m0 0a1.5 1.5 0 0 1 1.5-1.5h.75a1.5 1.5 0 0 1 1.5 1.5v15A1.5 1.5 0 0 1 21 21h-.75A1.5 1.5 0 0 1 18.75 19.5v-15" />
                </svg>
                <span>{course.chapters?.length || 0} chapters • {totalSections} lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <span>{course.students?.length || course.enrollments || 0} learners</span>
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="space-y-6 rounded-2xl bg-white/10 p-6 backdrop-blur">
              <div className="space-y-2">
                <p className="text-sm text-slate-300">Current price</p>
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-semibold text-white">${course.price?.toFixed?.(2) ?? '0.00'}</span>
                  {course.discount ? (
                    <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">
                      {course.discount}% off
                    </span>
                  ) : null}
                </div>
              </div>

              <button
                type="button"
                className="w-full rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition hover:bg-primary-400"
              >
                Add to cart
              </button>
              <button
                type="button"
                className="w-full rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Buy now
              </button>

              <ul className="space-y-3 text-sm text-slate-200">
                <li className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">{course.chapters?.length || 0}</span>
                  Chapter roadmap included
                </li>
                <li className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">HD</span>
                  High quality video lessons
                </li>
                <li className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">∞</span>
                  Lifetime access
                </li>
              </ul>

              {userRole === 'admin' ? (
                <Link
                  to={`/courses/${course._id}/edit`}
                  className="block w-full rounded-full border border-white/40 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Manage course
                </Link>
              ) : null}
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-slate-900">Course content</h2>
            <p className="text-sm text-slate-500">Explore the chapter roadmap and preview lessons before enrolling.</p>
          </div>

          <div className="space-y-4">
            {course.chapters?.length ? (
              course.chapters.map((chapter, index) => (
                <details
                  key={chapter._id || chapter.title}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                  open={index === 0}
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 bg-slate-50 px-6 py-4 text-left text-sm font-medium text-slate-700 transition group-open:bg-white">
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-slate-900">{chapter.title}</p>
                      <p className="text-xs text-slate-500">{chapter.description || 'No description provided.'}</p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                      {chapter.sections?.length || 0} lessons
                    </span>
                  </summary>

                  <div className="space-y-4 px-6 pb-6">
                    {chapter.sections?.length ? (
                      chapter.sections.map((section) => (
                        <article
                          key={section._id || section.title}
                          className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition hover:border-primary-100 hover:bg-white"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{section.title}</p>
                              <p className="text-xs text-slate-500">Duration: {section.duration || 0} mins</p>
                            </div>
                            <StatusBadge status={section.status} />
                          </div>
                          <div className="space-y-4">
                            {section.video ? <MediaPreview url={section.video} type="video" /> : null}
                            {section.pdf ? <MediaPreview url={section.pdf} type="pdf" /> : null}
                            {section.image ? <span className="block text-xs text-slate-500">Image: {section.image}</span> : null}
                          </div>
                        </article>
                      ))
                    ) : (
                      <p className="rounded-xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
                        No lessons configured for this chapter yet.
                      </p>
                    )}
                  </div>
                </details>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
                No chapters configured. Add chapters to structure your course content.
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">What you'll learn</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {(course.outcomes?.length ? course.outcomes : [
                'Build end-to-end MERN applications with modern tooling',
                'Design scalable React components and hooks',
                'Implement secure authentication and authorization flows',
                'Optimize performance and ship production-ready apps',
              ]).map((item, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary-600">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Course includes</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-primary-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 1 0-6.364-6.364 4.5 4.5 0 0 0 6.364 6.364ZM12 6v3m0 6v3m6-6h-3m-6 0H6" />
                </svg>
                Downloadable resources
              </li>
              <li className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-primary-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v-10.5a1.5 1.5 0 0 0-2.25-1.3l-7.5 4.5a1.5 1.5 0 0 0 0 2.6l7.5 4.5a1.5 1.5 0 0 0 2.25-1.3Z" />
                </svg>
                On-demand video lessons
              </li>
              <li className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-primary-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5.25h7.5M3 7.5h6m-6 2.25h7.5M3 12h6m-6 2.25h7.5M3 16.5h6m5.25-11.25H21m-6.75 2.25H21m-6.75 2.25H21m-6.75 2.25H21m-6.75 2.25H21m-6.75 2.25H21" />
                </svg>
                Articles & documentation
              </li>
              <li className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-primary-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Assignments & quizzes
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Related courses</h3>
            <div className="mt-4 grid gap-4">
              {course.relatedCourses?.length ? (
                course.relatedCourses.map((related) => <CourseCard key={related._id} course={related} />)
              ) : (
                <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  No related courses available yet.
                </p>
              )}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
