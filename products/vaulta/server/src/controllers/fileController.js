import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import File from '../models/File.js';
import Folder from '../models/Folder.js';
import Bin from '../models/Bin.js';
import User from '../models/User.js';
import storageService from '../utils/storageService.js';
import { HTTP_STATUS, FILE_TYPES, BIN_AUTO_DELETE_DAYS } from '../../config/constants.js';

// Configure multer for memory storage
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 100 * 1024 * 1024 // 100MB
  }
});

export const uploadFile = async (req, res) => {
  try {
    const { parentFolderId } = req.body;
    const userId = req.user._id;

    // Check storage quota
    const user = await User.findById(userId);
    const newSize = user.storageUsed + req.file.size;
    
    if (newSize > user.maxStorage) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Storage quota exceeded'
      });
    }

    // Validate parent folder if provided
    let parentFolder = null;
    let folderPath = '';
    
    if (parentFolderId) {
      parentFolder = await Folder.findOne({
        _id: parentFolderId,
        owner: userId,
        isDeleted: false
      });
      
      if (!parentFolder) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Parent folder not found'
        });
      }
      
      folderPath = parentFolder.path;
    }

    // Determine file type
    let fileType = FILE_TYPES.OTHER;
    if (req.file.mimetype.startsWith('image/')) {
      fileType = FILE_TYPES.IMAGE;
    } else if (req.file.mimetype.includes('document') || 
               req.file.mimetype.includes('pdf') || 
               req.file.mimetype.includes('text')) {
      fileType = FILE_TYPES.DOCUMENT;
    }

    // Upload file to storage
    const uploadResult = await storageService.uploadFile(req.file, userId, folderPath);

    // Create file record
    const file = new File({
      name: req.file.originalname,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: uploadResult.path,
      url: uploadResult.url,
      owner: userId,
      parentFolder: parentFolderId || null,
      type: fileType
    });

    await file.save();

    // Update user storage used
    await User.findByIdAndUpdate(userId, {
      $inc: { storageUsed: req.file.size }
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'File uploaded successfully',
      data: { file }
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'File upload failed',
      error: error.message
    });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.user._id;

    const file = await File.findOne({
      _id: fileId,
      owner: userId,
      isDeleted: false
    });

    if (!file) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'File not found'
      });
    }

    // Download file from storage
    const fileData = await storageService.downloadFile(file.path);

    // Update access tracking
    await File.findByIdAndUpdate(fileId, {
      $inc: { downloadCount: 1 },
      lastAccessed: new Date()
    });

    res.setHeader('Content-Type', fileData.contentType || file.mimeType);
    res.setHeader('Content-Length', fileData.contentLength || file.size);
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);

    res.send(fileData.buffer);
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'File download failed',
      error: error.message
    });
  }
};

export const getFileInfo = async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.user._id;

    const file = await File.findOne({
      _id: fileId,
      owner: userId,
      isDeleted: false
    }).populate('parentFolder', 'name path');

    if (!file) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'File not found'
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { file }
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to get file info',
      error: error.message
    });
  }
};

export const renameFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { name } = req.body;
    const userId = req.user._id;

    if (!name || name.trim().length === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'File name is required'
      });
    }

    const file = await File.findOne({
      _id: fileId,
      owner: userId,
      isDeleted: false
    });

    if (!file) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'File not found'
      });
    }

    // Check if name already exists in the same folder
    const existingFile = await File.findOne({
      name: name.trim(),
      parentFolder: file.parentFolder,
      owner: userId,
      isDeleted: false,
      _id: { $ne: fileId }
    });

    if (existingFile) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: 'A file with this name already exists in this folder'
      });
    }

    file.name = name.trim();
    await file.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'File renamed successfully',
      data: { file }
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'File rename failed',
      error: error.message
    });
  }
};

export const copyFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { destinationFolderId } = req.body;
    const userId = req.user._id;

    const sourceFile = await File.findOne({
      _id: fileId,
      owner: userId,
      isDeleted: false
    });

    if (!sourceFile) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Source file not found'
      });
    }

    // Validate destination folder
    let destinationFolder = null;
    if (destinationFolderId) {
      destinationFolder = await Folder.findOne({
        _id: destinationFolderId,
        owner: userId,
        isDeleted: false
      });

      if (!destinationFolder) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Destination folder not found'
        });
      }
    }

    // Check if file with same name exists in destination
    const existingFile = await File.findOne({
      name: sourceFile.name,
      parentFolder: destinationFolderId || null,
      owner: userId,
      isDeleted: false
    });

    if (existingFile) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: 'A file with this name already exists in the destination folder'
      });
    }

    // Copy file in storage
    const newPath = `users/${userId}/${destinationFolder?.path || ''}/${uuidv4()}${path.extname(sourceFile.path)}`;
    await storageService.copyFile(sourceFile.path, newPath);

    // Create new file record
    const copiedFile = new File({
      name: sourceFile.name,
      originalName: sourceFile.originalName,
      mimeType: sourceFile.mimeType,
      size: sourceFile.size,
      path: newPath,
      url: null, // Will be generated on demand for S3
      owner: userId,
      parentFolder: destinationFolderId || null,
      type: sourceFile.type
    });

    await copiedFile.save();

    // Update user storage used
    await User.findByIdAndUpdate(userId, {
      $inc: { storageUsed: sourceFile.size }
    });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'File copied successfully',
      data: { file: copiedFile }
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'File copy failed',
      error: error.message
    });
  }
};

export const moveFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { destinationFolderId } = req.body;
    const userId = req.user._id;

    const file = await File.findOne({
      _id: fileId,
      owner: userId,
      isDeleted: false
    });

    if (!file) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'File not found'
      });
    }

    // Validate destination folder
    let destinationFolder = null;
    if (destinationFolderId) {
      destinationFolder = await Folder.findOne({
        _id: destinationFolderId,
        owner: userId,
        isDeleted: false
      });

      if (!destinationFolder) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Destination folder not found'
        });
      }
    }

    // Check if file with same name exists in destination
    const existingFile = await File.findOne({
      name: file.name,
      parentFolder: destinationFolderId || null,
      owner: userId,
      isDeleted: false,
      _id: { $ne: fileId }
    });

    if (existingFile) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: 'A file with this name already exists in the destination folder'
      });
    }

    // Update file record
    file.parentFolder = destinationFolderId || null;
    await file.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'File moved successfully',
      data: { file }
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'File move failed',
      error: error.message
    });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.user._id;

    const file = await File.findOne({
      _id: fileId,
      owner: userId,
      isDeleted: false
    });

    if (!file) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'File not found'
      });
    }

    // Mark as deleted
    file.isDeleted = true;
    file.deletedAt = new Date();
    await file.save();

    // Add to bin
    const binItem = new Bin({
      itemId: file._id,
      itemType: 'File',
      name: file.name,
      owner: userId,
      originalPath: file.path,
      parentFolder: file.parentFolder,
      size: file.size,
      autoDeleteDate: new Date(Date.now() + BIN_AUTO_DELETE_DAYS * 24 * 60 * 60 * 1000)
    });

    await binItem.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'File moved to bin successfully'
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'File deletion failed',
      error: error.message
    });
  }
};
