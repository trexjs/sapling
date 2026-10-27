import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Modal } from '../components/common/Modal.jsx';
import { StatusBadge } from '../components/common/StatusBadge.jsx';
import { CourseBasicForm } from '../components/forms/CourseBasicForm.jsx';
import { ChapterForm } from '../components/forms/ChapterForm.jsx';
import { SectionForm } from '../components/forms/SectionForm.jsx';
import { MediaPreview } from '../components/courses/MediaPreview.jsx';
import { useLms } from '../context/LmsContext.jsx';
import { useCourse } from '../hooks/useCourse.js';

export default function CourseEditPage() {
  const navigate = useNavigate();
  const { course, isLoading, error } = useCourse();
  const {
    updateCourse,
    deleteCourse,
    addChapter,
    updateChapter,
    deleteChapter,
    addSection,
    updateSection,
    deleteSection,
  } = useLms();

  const [chapterModal, setChapterModal] = useState({ open: false, mode: 'create', chapter: null });
  const [sectionModal, setSectionModal] = useState({ open: false, mode: 'create', chapterId: null, section: null });

  if (isLoading) {
    return <div className="rounded-xl border border-slate-200 bg-white p-6">Loading course...</div>;
  }

  if (!course) {
    return (
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 text-center">
        <h2 className="text-xl font-semibold text-slate-800">Course not found</h2>
        <p className="text-sm text-slate-500">The course you are trying to edit might have been removed.</p>
        <Link
          to="/courses"
          className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          Back to Courses
        </Link>
      </div>
    );
  }

  const handleCourseUpdate = async (payload) => {
    await updateCourse(course._id, payload);
  };

  const handleDeleteCourse = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this course?');
    if (!confirmed) return;

    await deleteCourse(course._id);
    navigate('/courses');
  };

  const closeChapterModal = () => setChapterModal({ open: false, mode: 'create', chapter: null });
  const closeSectionModal = () => setSectionModal({ open: false, mode: 'create', chapterId: null, section: null });

  const handleChapterSubmit = async (payload) => {
    if (chapterModal.mode === 'edit' && chapterModal.chapter?._id) {
      await updateChapter(course._id, chapterModal.chapter._id, payload);
    } else {
      await addChapter(course._id, payload);
    }
    closeChapterModal();
  };

  const handleSectionSubmit = async (payload) => {
    if (!sectionModal.chapterId) return;

    if (sectionModal.mode === 'edit' && sectionModal.section?._id) {
      await updateSection(course._id, sectionModal.chapterId, sectionModal.section._id, payload);
    } else {
      await addSection(course._id, sectionModal.chapterId, payload);
    }
    closeSectionModal();
  };

  const renderChapterActions = (chapter) => (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-primary-200 hover:bg-primary-50/40 hover:text-primary-600"
        onClick={() => setChapterModal({ open: true, mode: 'edit', chapter })}
      >
        Edit chapter
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-primary-200 hover:bg-primary-50/40 hover:text-primary-600"
        onClick={() => setSectionModal({ open: true, mode: 'create', chapterId: chapter._id, section: null })}
      >
        + Add section
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
        onClick={() => deleteChapter(course._id, chapter._id)}
      >
        Delete
      </button>
    </div>
  );

  const renderSectionActions = (chapterId, section) => (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-primary-200 hover:bg-primary-50/40 hover:text-primary-600"
        onClick={() =>
          setSectionModal({ open: true, mode: 'edit', chapterId, section })
        }
      >
        Edit
      </button>
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
        onClick={() => deleteSection(course._id, chapterId, section._id)}
      >
        Delete
      </button>
    </div>
  );

  const totalSections = course.chapters?.reduce((acc, chapter) => acc + (chapter.sections?.length || 0), 0) ?? 0;

  return (
    <div className="space-y-10">
      <header className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-xl">
        <div className="flex flex-col gap-6 p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white/80">
              Course builder
              <span className="text-white/60">• Instructor workspace</span>
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight lg:text-4xl">Design your course experience</h1>
              <p className="max-w-3xl text-sm text-white/80 lg:text-base">
                Update core details, manage chapters, and polish lesson content. Changes are saved instantly after you submit each
                section.
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <StatusBadge status={course.status} />
                <span className="font-medium">Status</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <span>{course.duration || 0} hours</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h12m-12 0a1.5 1.5 0 0 1 0-3h12a1.5 1.5 0 0 1 0 3m-12 0v15a1.5 1.5 0 0 0 1.5 1.5h9a1.5 1.5 0 0 0 1.5-1.5v-15m0 0h3m0 0a1.5 1.5 0 0 1 1.5-1.5h.75a1.5 1.5 0 0 1 1.5 1.5v15A1.5 1.5 0 0 1 21 21h-.75A1.5 1.5 0 0 1 18.75 19.5v-15" />
                </svg>
                <span>{course.chapters?.length || 0} chapters • {totalSections} lessons</span>
              </div>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                <span>{course.students?.length || course.enrollments || 0} learners</span>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 rounded-2xl bg-white/10 p-6 backdrop-blur lg:w-80">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-white">${course.price?.toFixed?.(2) ?? '0.00'}</span>
              {course.discount ? (
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-100">
                  {course.discount}% off
                </span>
              ) : null}
            </div>
            <button
              type="button"
              className="mt-2 w-full rounded-full bg-white/90 px-6 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-white"
              onClick={() => navigate(`/courses/${course._id}`)}
            >
              View public course page
            </button>
            <button
              type="button"
              className="w-full rounded-full border border-white/50 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              onClick={handleDeleteCourse}
            >
              Delete course
            </button>
            <Link
              to="/courses"
              className="block w-full rounded-full border border-white/30 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Back to catalog
            </Link>
          </div>
        </div>
      </header>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</div>
      ) : null}

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Course overview</h2>
                <p className="text-sm text-slate-500">Polish the information learners see before enrolling.</p>
              </div>
              <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600">Overview</span>
            </div>
            <div className="mt-6">
              <CourseBasicForm initialValue={course} onSubmit={handleCourseUpdate} submitLabel="Save changes" />
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Chapters & lessons</h2>
                <p className="text-sm text-slate-500">Curate your roadmap with rich media content.</p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-500"
                onClick={() => setChapterModal({ open: true, mode: 'create', chapter: null })}
              >
                <span className="text-lg">+</span>
                Add chapter
              </button>
            </div>

            <div className="space-y-4">
              {course.chapters?.length ? (
                course.chapters.map((chapter, index) => (
                  <div
                    key={chapter._id || chapter.title}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm transition hover:border-primary-100 hover:shadow-md"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-5">
                      <div className="space-y-1">
                        <p className="text-sm uppercase tracking-wide text-slate-400">Chapter {index + 1}</p>
                        <h3 className="text-xl font-semibold text-slate-900">{chapter.title}</h3>
                        <p className="text-sm text-slate-500">{chapter.description || 'No description provided.'}</p>
                      </div>
                      {chapter._id ? renderChapterActions(chapter) : null}
                    </div>

                    <div className="space-y-3 px-6 py-5">
                      {chapter.sections?.length ? (
                        chapter.sections.map((section) => (
                          <div
                            key={section._id || section.title}
                            className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-primary-100 hover:bg-white"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <p className="text-sm font-semibold text-slate-900">{section.title}</p>
                                <p className="text-xs text-slate-500">Duration: {section.duration || 0} mins</p>
                              </div>
                              <div className="flex flex-wrap items-center gap-3">
                                <StatusBadge status={section.status} />
                                {section._id ? renderSectionActions(chapter._id, section) : null}
                              </div>
                            </div>
                            <div className="space-y-4">
                              {section.video ? <MediaPreview url={section.video} type="video" /> : null}
                              {section.pdf ? <MediaPreview url={section.pdf} type="pdf" /> : null}
                              {section.image ? <span className="block text-xs text-slate-500">Image: {section.image}</span> : null}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
                          No sections defined for this chapter yet.
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-500">
                  No chapters yet. Start by adding your first chapter to outline the course.
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Quick tips</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600">1</span>
                Use short lesson videos (5–8 mins) to keep engagement high.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600">2</span>
                Add downloadable PDFs for assignments or reference material.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600">3</span>
                Mark lessons as "draft" until you’re ready to publish.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Need a break?</h3>
            <p className="mt-2 text-sm text-slate-600">You can leave this page anytime. All saved changes remain intact.</p>
            <div className="mt-4 space-y-3">
              <Link
                to={`/courses/${course._id}`}
                className="block rounded-full border border-slate-200 px-5 py-2 text-center text-sm font-semibold text-slate-700 transition hover:border-primary-200 hover:text-primary-600"
              >
                Preview course
              </Link>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Return to dashboard
              </button>
            </div>
          </div>
        </aside>
      </section>

      <Modal
        title={chapterModal.mode === 'edit' ? 'Edit chapter' : 'Add chapter'}
        isOpen={chapterModal.open}
        onClose={closeChapterModal}
      >
        <ChapterForm initialValue={chapterModal.chapter || undefined} onSubmit={handleChapterSubmit} onCancel={closeChapterModal} />
      </Modal>

      <Modal
        title={sectionModal.mode === 'edit' ? 'Edit section' : 'Add section'}
        isOpen={sectionModal.open}
        onClose={closeSectionModal}
      >
        <SectionForm
          initialValue={sectionModal.section || undefined}
          onSubmit={handleSectionSubmit}
          onCancel={closeSectionModal}
          submitLabel={sectionModal.mode === 'edit' ? 'Save section' : 'Create section'}
        />
      </Modal>
    </div>
  );
}
