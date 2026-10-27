import express from 'express';
import { searchItems, searchRecent, searchStarred } from '../controllers/searchController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateSearchQuery } from '../middleware/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Search operations
router.get('/', validateSearchQuery, searchItems);
router.get('/recent', searchRecent);
router.get('/starred', searchStarred);

export default router;
