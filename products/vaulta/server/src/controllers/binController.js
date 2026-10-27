import Bin from '../models/Bin.js';
import File from '../models/File.js';
import Folder from '../models/Folder.js';
import User from '../models/User.js';
import storageService from '../utils/storageService.js';
import { HTTP_STATUS, BIN_AUTO_DELETE_DAYS } from '../../config/constants.js';

export const getBinItems = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user._id;

    const binItems = await Bin.find({ owner: userId })
      .sort({ deletedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalItems = await Bin.countDocuments({ owner: userId });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        items: binItems,
        pagination: {
          currentPage: parseInt(page),
          totalItems,
          totalPages: Math.ceil(totalItems / limit),
          hasNext: (page * limit) < totalItems,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to get bin items',
      error: error.message
    });
  }
};

export const restoreBinItem = async (req, res) => {
  try {
    const { binItemId } = req.params;
    const userId = req.user._id;

    const binItem = await Bin.findOne({
      _id: binItemId,
      owner: userId
    });

    if (!binItem) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Bin item not found'
      });
    }

    if (binItem.itemType === 'File') {
      // Restore file
      const file = await File.findOne({
        _id: binItem.itemId,
        owner: userId,
        isDeleted: true
      });

      if (!file) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'File not found'
        });
      }

      // Check if a file with the same name exists in the parent folder
      const existingFile = await File.findOne({
        name: file.name,
        parentFolder: file.parentFolder,
        owner: userId,
        isDeleted: false,
        _id: { $ne: file._id }
      });

      if (existingFile) {
        return res.status(HTTP_STATUS.CONFLICT).json({
          success: false,
          message: 'A file with this name already exists in the destination folder'
        });
      }

      // Restore file
      file.isDeleted = false;
      file.deletedAt = null;
      await file.save();

      // Update user storage used
      await User.findByIdAndUpdate(userId, {
        $inc: { storageUsed: file.size }
      });

    } else if (binItem.itemType === 'Folder') {
      // Restore folder
      const folder = await Folder.findOne({
        _id: binItem.itemId,
        owner: userId,
        isDeleted: true
      });

      if (!folder) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: 'Folder not found'
        });
      }

      // Check if a folder with the same name exists in the parent
      const existingFolder = await Folder.findOne({
        name: folder.name,
        parentFolder: folder.parentFolder,
        owner: userId,
        isDeleted: false,
        _id: { $ne: folder._id }
      });

      if (existingFolder) {
        return res.status(HTTP_STATUS.CONFLICT).json({
          success: false,
          message: 'A folder with this name already exists in the destination'
        });
      }

      // Restore folder and all its children
      await restoreFolderRecursively(folder._id, userId);
    }

    // Remove from bin
    await Bin.findByIdAndDelete(binItemId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: `${binItem.itemType} restored successfully`
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Restore failed',
      error: error.message
    });
  }
};

export const permanentlyDeleteBinItem = async (req, res) => {
  try {
    const { binItemId } = req.params;
    const userId = req.user._id;

    const binItem = await Bin.findOne({
      _id: binItemId,
      owner: userId
    });

    if (!binItem) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Bin item not found'
      });
    }

    if (binItem.itemType === 'File') {
      // Permanently delete file
      const file = await File.findOne({
        _id: binItem.itemId,
        owner: userId,
        isDeleted: true
      });

      if (file) {
        // Delete from storage
        try {
          await storageService.deleteFile(file.path);
        } catch (error) {
          console.error('Storage deletion failed:', error);
        }

        // Update user storage used
        await User.findByIdAndUpdate(userId, {
          $inc: { storageUsed: -file.size }
        });

        // Delete file record
        await File.findByIdAndDelete(file._id);
      }

    } else if (binItem.itemType === 'Folder') {
      // Permanently delete folder and all its contents
      await permanentlyDeleteFolderRecursively(binItem.itemId, userId);
    }

    // Remove from bin
    await Bin.findByIdAndDelete(binItemId);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: `${binItem.itemType} permanently deleted`
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Permanent deletion failed',
      error: error.message
    });
  }
};

export const emptyBin = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all bin items
    const binItems = await Bin.find({ owner: userId });

    // Permanently delete each item
    for (const binItem of binItems) {
      if (binItem.itemType === 'File') {
        const file = await File.findOne({
          _id: binItem.itemId,
          owner: userId,
          isDeleted: true
        });

        if (file) {
          try {
            await storageService.deleteFile(file.path);
          } catch (error) {
            console.error('Storage deletion failed:', error);
          }

          await User.findByIdAndUpdate(userId, {
            $inc: { storageUsed: -file.size }
          });

          await File.findByIdAndDelete(file._id);
        }
      } else if (binItem.itemType === 'Folder') {
        await permanentlyDeleteFolderRecursively(binItem.itemId, userId);
      }
    }

    // Delete all bin items
    await Bin.deleteMany({ owner: userId });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Bin emptied successfully'
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to empty bin',
      error: error.message
    });
  }
};

export const autoCleanupBin = async () => {
  try {
    const now = new Date();
    
    // Find items that should be auto-deleted
    const expiredItems = await Bin.find({
      autoDeleteDate: { $lte: now }
    });

    for (const binItem of expiredItems) {
      if (binItem.itemType === 'File') {
        const file = await File.findOne({
          _id: binItem.itemId,
          isDeleted: true
        });

        if (file) {
          try {
            await storageService.deleteFile(file.path);
          } catch (error) {
            console.error('Storage deletion failed:', error);
          }

          await User.findByIdAndUpdate(file.owner, {
            $inc: { storageUsed: -file.size }
          });

          await File.findByIdAndDelete(file._id);
        }
      } else if (binItem.itemType === 'Folder') {
        await permanentlyDeleteFolderRecursively(binItem.itemId, binItem.owner);
      }

      // Remove from bin
      await Bin.findByIdAndDelete(binItem._id);
    }

    console.log(`Auto-cleanup: Permanently deleted ${expiredItems.length} items from bin`);
  } catch (error) {
    console.error('Auto-cleanup failed:', error);
  }
};

// Helper functions
async function restoreFolderRecursively(folderId, userId) {
  const folder = await Folder.findOne({
    _id: folderId,
    owner: userId,
    isDeleted: true
  });

  if (folder) {
    folder.isDeleted = false;
    folder.deletedAt = null;
    await folder.save();

    // Restore child folders
    const childFolders = await Folder.find({
      parentFolder: folderId,
      owner: userId,
      isDeleted: true
    });

    for (const childFolder of childFolders) {
      await restoreFolderRecursively(childFolder._id, userId);
    }

    // Restore files in this folder
    await File.updateMany(
      { parentFolder: folderId, owner: userId, isDeleted: true },
      { $set: { isDeleted: false, deletedAt: null } }
    );
  }
}

async function permanentlyDeleteFolderRecursively(folderId, userId) {
  const folder = await Folder.findOne({
    _id: folderId,
    owner: userId,
    isDeleted: true
  });

  if (folder) {
    // Delete child folders recursively
    const childFolders = await Folder.find({
      parentFolder: folderId,
      owner: userId,
      isDeleted: true
    });

    for (const childFolder of childFolders) {
      await permanentlyDeleteFolderRecursively(childFolder._id, userId);
    }

    // Delete files in this folder
    const files = await File.find({
      parentFolder: folderId,
      owner: userId,
      isDeleted: true
    });

    for (const file of files) {
      try {
        await storageService.deleteFile(file.path);
      } catch (error) {
        console.error('Storage deletion failed:', error);
      }

      await User.findByIdAndUpdate(userId, {
        $inc: { storageUsed: -file.size }
      });

      await File.findByIdAndDelete(file._id);
    }

    // Delete folder record
    await Folder.findByIdAndDelete(folder._id);
  }
}
