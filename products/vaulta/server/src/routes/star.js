import express from 'express';
import { toggleStar, getStarredItems } from '../controllers/starController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Star operations
router.post('/:itemType/:itemId', toggleStar);
router.get('/', getStarredItems);

export default router;
