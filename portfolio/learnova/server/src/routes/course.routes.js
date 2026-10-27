import { Router } from 'express';
import {
  addChapter,
  addSection,
  createCourse,
  deleteChapter,
  deleteCourse,
  deleteSection,
  enrollInCourse,
  getCourseById,
  getCourses,
  updateChapter,
  updateCourse,
  updateCourseStatus,
  updateSection,
} from '../controllers/course.controller.js';
import { requireAdmin } from '../middleware/auth.middleware.js';
import { validateBody } from '../utils/validate.js';
import {
  chapterCreateSchema,
  chapterUpdateSchema,
  courseCreateSchema,
  courseEnrollSchema,
  courseStatusSchema,
  courseUpdateSchema,
  sectionCreateSchema,
  sectionUpdateSchema,
} from '../validation/course.schema.js';

const router = Router();

// router
//   .route('/')
//   .get(getCourses)
//   .post(validateBody(courseCreateSchema), createCourse);

// router
//   .route('/:id')
//   .get(getCourseById)
//   .put(requireAdmin, validateBody(courseUpdateSchema), updateCourse)
//   .delete(requireAdmin, deleteCourse);

// router.patch('/:id/status', requireAdmin, validateBody(courseStatusSchema), updateCourseStatus);
// router.post('/:id/enroll', validateBody(courseEnrollSchema), enrollInCourse);

// router.post('/:id/chapters', requireAdmin, validateBody(chapterCreateSchema), addChapter);
// router.patch(
//   '/:id/chapters/:chapterId',
//   requireAdmin,
//   validateBody(chapterUpdateSchema),
//   updateChapter
// );
// router.delete('/:id/chapters/:chapterId', requireAdmin, deleteChapter);

// router.post(
//   '/:id/chapters/:chapterId/sections',
//   requireAdmin,
//   validateBody(sectionCreateSchema),
//   addSection
// );
// router.patch(
//   '/:id/chapters/:chapterId/sections/:sectionId',
//   requireAdmin,
//   validateBody(sectionUpdateSchema),
//   updateSection
// );
// router.delete('/:id/chapters/:chapterId/sections/:sectionId', requireAdmin, deleteSection);

router
  .route('/')
  .get(getCourses)
  .post(validateBody(courseCreateSchema), createCourse);

router
  .route('/:id')
  .get(getCourseById)
  .put( validateBody(courseUpdateSchema), updateCourse)
  .delete( deleteCourse);

router.patch('/:id/status',  validateBody(courseStatusSchema), updateCourseStatus);
router.post('/:id/enroll', validateBody(courseEnrollSchema), enrollInCourse);

router.post('/:id/chapters',  validateBody(chapterCreateSchema), addChapter);
router.patch(
  '/:id/chapters/:chapterId',
  
  validateBody(chapterUpdateSchema),
  updateChapter
);
router.delete('/:id/chapters/:chapterId',  deleteChapter);

router.post(
  '/:id/chapters/:chapterId/sections',
  
  validateBody(sectionCreateSchema),
  addSection
);
router.patch(
  '/:id/chapters/:chapterId/sections/:sectionId',
  
  validateBody(sectionUpdateSchema),
  updateSection
);
router.delete('/:id/chapters/:chapterId/sections/:sectionId',  deleteSection);

export default router;
