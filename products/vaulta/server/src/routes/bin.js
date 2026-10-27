import express from 'express';
import { 
  getBinItems, 
  restoreBinItem, 
  permanentlyDeleteBinItem, 
  emptyBin 
} from '../controllers/binController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Bin operations
router.get('/', getBinItems);
router.post('/:binItemId/restore', restoreBinItem);
router.delete('/:binItemId', permanentlyDeleteBinItem);
router.delete('/', emptyBin); // Empty entire bin

export default router;
