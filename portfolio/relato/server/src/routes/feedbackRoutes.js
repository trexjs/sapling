import express from 'express';
import {
  createFeedback,
  getFeedbacks,
  getFeedbackById,
  updateFeedbackStatus,
  updateFeedback,
  deleteFeedback,
  getFeedbackStats,
  searchStudents
} from '../controllers/feedbackController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Feedback routes
router.post('/', createFeedback);
router.get('/', getFeedbacks);
router.get('/stats', getFeedbackStats);
router.get('/search-students', searchStudents);
router.get('/:id', getFeedbackById);
router.put('/:id', updateFeedback);
router.patch('/:id/status', updateFeedbackStatus);
router.delete('/:id', deleteFeedback);

export default router;
