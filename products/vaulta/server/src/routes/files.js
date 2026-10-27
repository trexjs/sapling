import express from 'express';
import { 
  upload, 
  uploadFile, 
  downloadFile, 
  getFileInfo, 
  renameFile, 
  copyFile, 
  moveFile, 
  deleteFile 
} from '../controllers/fileController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateFileUpload } from '../middleware/validation.js';
import { uploadRateLimit } from '../middleware/rateLimiter.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// File operations
router.post('/upload', uploadRateLimit, upload.single('file'), validateFileUpload, uploadFile);
router.get('/:fileId/download', downloadFile);
router.get('/:fileId/info', getFileInfo);
router.put('/:fileId/rename', renameFile);
router.post('/:fileId/copy', copyFile);
router.post('/:fileId/move', moveFile);
router.delete('/:fileId', deleteFile);

export default router;
