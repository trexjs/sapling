import express from 'express';
import authRoutes from './auth.js';
import fileRoutes from './files.js';
import folderRoutes from './folders.js';
import binRoutes from './bin.js';
import searchRoutes from './search.js';
import shareRoutes from './share.js';
import starRoutes from './star.js';

const router = express.Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/files', fileRoutes);
router.use('/folders', folderRoutes);
router.use('/bin', binRoutes);
router.use('/search', searchRoutes);
router.use('/share', shareRoutes);
router.use('/star', starRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Document Master API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

export default router;
