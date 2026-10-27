import express from 'express';
import {
  mapTeachersToSchool,
  mapStudentsToSchool,
  getSchoolTeachers,
  getSchoolStudents,
  removeTeacherFromSchool,
  removeStudentFromSchool
} from '../controllers/mappingController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Map teachers to school
router.post('/schools/:schoolId/teachers', authenticateToken, mapTeachersToSchool);

// Map students to school
router.post('/schools/:schoolId/students', authenticateToken, mapStudentsToSchool);

// Get teachers for a school
router.get('/schools/:schoolId/teachers', authenticateToken, getSchoolTeachers);

// Get students for a school
router.get('/schools/:schoolId/students', authenticateToken, getSchoolStudents);

// Remove teacher from school
router.delete('/schools/:schoolId/teachers/:teacherId', authenticateToken, removeTeacherFromSchool);

// Remove student from school
router.delete('/schools/:schoolId/students/:studentId', authenticateToken, removeStudentFromSchool);

export default router;
