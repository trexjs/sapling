import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useLms } from '../context/LmsContext.jsx';

export const useCourse = () => {
  const { courseId } = useParams();
  const {
    state: { courses, isLoading, error },
  } = useLms();

  const course = useMemo(() => courses.find((item) => item._id === courseId), [courses, courseId]);

  return { courseId, course, isLoading, error };
};
