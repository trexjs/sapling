import express from 'express';
import { 
  shareItem, 
  getSharedWithMe, 
  getMySharedItems, 
  updateSharePermissions, 
  revokeShare, 
  getSharedItemAccess 
} from '../controllers/shareController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all routes except public access
router.use((req, res, next) => {
  // Skip auth for public access route
  if (req.path.startsWith('/access/')) {
    return optionalAuth(req, res, next);
  }
  // Apply full auth to all other routes
  return authenticateToken(req, res, next);
});

// Sharing operations (all require authentication)
router.post('/share', shareItem);
router.get('/shared-with-me', getSharedWithMe);
router.get('/my-shared', getMySharedItems);
router.put('/share/:shareId/permissions', updateSharePermissions);
router.delete('/share/:shareId', revokeShare);

// Public shared item access (optional auth for tracking)
router.get('/access/:shareToken', getSharedItemAccess);

export default router;
