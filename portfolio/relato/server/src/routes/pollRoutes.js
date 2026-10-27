import express from 'express';
import {
  createPoll,
  getPolls,
  getPollById,
  votePoll,
  updatePoll,
  deletePoll,
  getPollAnalytics
} from '../controllers/pollController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Poll routes
router.post('/', createPoll);
router.get('/', getPolls);
router.get('/:id', getPollById);
router.put('/:id', updatePoll);
router.post('/:id/vote', votePoll);
router.delete('/:id', deletePoll);
router.get('/:id/analytics', getPollAnalytics);

export default router;
