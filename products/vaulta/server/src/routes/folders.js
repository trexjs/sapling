import express from 'express';
import { 
  createFolder, 
  getFolderContents, 
  getFolderInfo, 
  renameFolder, 
  moveFolder, 
  deleteFolder 
} from '../controllers/folderController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateFolderName } from '../middleware/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Folder operations
router.post('/', validateFolderName, createFolder);
router.get('/', getFolderContents); // Root folder contents
router.get('/:folderId', getFolderInfo);
router.get('/:folderId/contents', getFolderContents);
router.put('/:folderId/rename', validateFolderName, renameFolder);
router.post('/:folderId/move', moveFolder);
router.delete('/:folderId', deleteFolder);

export default router;
