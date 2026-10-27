import express from 'express';
import {
  createKudos,
  getKudos,
  getKudosById,
  updateKudos,
  deleteKudos,
  addReaction,
  removeReaction,
  getKudosStats,
  searchStudents
} from '../controllers/kudosController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Kudos routes
router.post('/', createKudos);
router.get('/', getKudos);
router.get('/stats', getKudosStats);
router.get('/search-students', searchStudents);
router.get('/:id', getKudosById);
router.put('/:id', updateKudos);
router.delete('/:id', deleteKudos);
router.post('/:id/reactions', addReaction);
router.delete('/:id/reactions', removeReaction);

export default router;
