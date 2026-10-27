import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

import { CourseApi } from '../lib/api.js';

const initialState = {
  userRole: 'student',
  courses: [],
  isLoading: false,
  error: null,
};

const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_COURSES: 'SET_COURSES',
  SET_ERROR: 'SET_ERROR',
  SET_ROLE: 'SET_ROLE',
  ADD_COURSE: 'ADD_COURSE',
  UPDATE_COURSE: 'UPDATE_COURSE',
  DELETE_COURSE: 'DELETE_COURSE',
};

const lmsReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload, error: null };
    case ActionTypes.SET_COURSES:
      return { ...state, courses: action.payload, isLoading: false, error: null };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    case ActionTypes.SET_ROLE:
      return { ...state, userRole: action.payload };
    case ActionTypes.ADD_COURSE:
      return { ...state, courses: [action.payload, ...state.courses] };
    case ActionTypes.UPDATE_COURSE:
      return {
        ...state,
        courses: state.courses.map((course) => (course._id === action.payload._id ? action.payload : course)),
      };
    case ActionTypes.DELETE_COURSE:
      return { ...state, courses: state.courses.filter((course) => course._id !== action.payload) };
    default:
      return state;
  }
};

const LmsContext = createContext(null);

const FALLBACK_COURSES = [
  {
    _id: 'placeholder-1',
    title: 'Intro to MERN Stack',
    description: 'Learn to build full-stack applications using MongoDB, Express, React, and Node.js.',
    category: 'Development',
    status: 'published',
    price: 99,
    duration: 12,
    enrollments: 120,
  },
  {
    _id: 'placeholder-2',
    title: 'Advanced React Patterns',
    description: 'Dive into hooks, context, performance optimizations, and scalable component architectures.',
    category: 'Frontend',
    status: 'draft',
    price: 49,
    duration: 8,
    enrollments: 45,
  },
];

export const LmsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(lmsReducer, initialState);

  useEffect(() => {
    const controller = new AbortController();

    const loadCourses = async () => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      try {
        const payload = await CourseApi.list();
        const courses = Array.isArray(payload?.data) ? payload.data : payload;

        dispatch({ type: ActionTypes.SET_COURSES, payload: courses || [] });
      } catch (error) {
        if (error.name !== 'AbortError') {
          dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
          dispatch({ type: ActionTypes.SET_COURSES, payload: FALLBACK_COURSES });
        }
      }
    };

    loadCourses();

    return () => controller.abort();
  }, []);

  const value = useMemo(
    () => ({
      state,
      setRole: (role) => dispatch({ type: ActionTypes.SET_ROLE, payload: role }),
      reloadCourses: async () => {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        try {
          const payload = await CourseApi.list();
          const courses = Array.isArray(payload?.data) ? payload.data : payload;
          dispatch({ type: ActionTypes.SET_COURSES, payload: courses || [] });
        } catch (error) {
          dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
        }
      },
      createCourse: async (coursePayload) => {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        try {
          const created = await CourseApi.create(coursePayload);
          dispatch({ type: ActionTypes.ADD_COURSE, payload: created });
          return created;
        } catch (error) {
          dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
          throw error;
        } finally {
          dispatch({ type: ActionTypes.SET_LOADING, payload: false });
        }
      },
      updateCourse: async (courseId, updates) => {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        try {
          const updated = await CourseApi.update(courseId, updates);
          dispatch({ type: ActionTypes.UPDATE_COURSE, payload: updated });
          return updated;
        } catch (error) {
          dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
          throw error;
        } finally {
          dispatch({ type: ActionTypes.SET_LOADING, payload: false });
        }
      },
      deleteCourse: async (courseId) => {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        try {
          await CourseApi.remove(courseId);
          dispatch({ type: ActionTypes.DELETE_COURSE, payload: courseId });
        } catch (error) {
          dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
          throw error;
        } finally {
          dispatch({ type: ActionTypes.SET_LOADING, payload: false });
        }
      },
      updateCourseStatus: async (courseId, status) => {
        try {
          const updated = await CourseApi.updateStatus(courseId, { status });
          dispatch({ type: ActionTypes.UPDATE_COURSE, payload: updated });
          return updated;
        } catch (error) {
          dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
          throw error;
        }
      },
      addChapter: async (courseId, chapterPayload) => {
        try {
          const updated = await CourseApi.addChapter(courseId, chapterPayload);
          dispatch({ type: ActionTypes.UPDATE_COURSE, payload: updated });
          return updated;
        } catch (error) {
          dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
          throw error;
        }
      },
      updateChapter: async (courseId, chapterId, updates) => {
        try {
          const updated = await CourseApi.updateChapter(courseId, chapterId, updates);
          dispatch({ type: ActionTypes.UPDATE_COURSE, payload: updated });
          return updated;
        } catch (error) {
          dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
          throw error;
        }
      },
      deleteChapter: async (courseId, chapterId) => {
        try {
          const updated = await CourseApi.deleteChapter(courseId, chapterId);
          dispatch({ type: ActionTypes.UPDATE_COURSE, payload: updated });
          return updated;
        } catch (error) {
          dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
          throw error;
        }
      },
      addSection: async (courseId, chapterId, sectionPayload) => {
        try {
          const updated = await CourseApi.addSection(courseId, chapterId, sectionPayload);
          dispatch({ type: ActionTypes.UPDATE_COURSE, payload: updated });
          return updated;
        } catch (error) {
          dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
          throw error;
        }
      },
      updateSection: async (courseId, chapterId, sectionId, updates) => {
        try {
          const updated = await CourseApi.updateSection(courseId, chapterId, sectionId, updates);
          dispatch({ type: ActionTypes.UPDATE_COURSE, payload: updated });
          return updated;
        } catch (error) {
          dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
          throw error;
        }
      },
      deleteSection: async (courseId, chapterId, sectionId) => {
        try {
          const updated = await CourseApi.deleteSection(courseId, chapterId, sectionId);
          dispatch({ type: ActionTypes.UPDATE_COURSE, payload: updated });
          return updated;
        } catch (error) {
          dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
          throw error;
        }
      },
    }),
    [state]
  );

  return <LmsContext.Provider value={value}>{children}</LmsContext.Provider>;
};

export const useLms = () => {
  const context = useContext(LmsContext);
  if (!context) {
    throw new Error('useLms must be used within LmsProvider');
  }

  return context;
};
