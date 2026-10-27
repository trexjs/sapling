import Folder from '../models/Folder.js';
import File from '../models/File.js';
import Bin from '../models/Bin.js';
import { HTTP_STATUS, MAX_HIERARCHY_LEVELS, BIN_AUTO_DELETE_DAYS } from '../../config/constants.js';

export const createFolder = async (req, res) => {
  try {
    const { name, parentFolderId } = req.body;
    const userId = req.user._id;

    // Validate parent folder and check hierarchy level
    let parentFolder = null;
    let folderPath = '';
    let level = 1;

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

      // Check if adding this folder would exceed max hierarchy levels
      if (parentFolder.level >= MAX_HIERARCHY_LEVELS) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: `Maximum hierarchy level of ${MAX_HIERARCHY_LEVELS} exceeded`
        });
      }

      level = parentFolder.level + 1;
      folderPath = `${parentFolder.path}/${name}`;
    } else {
      folderPath = name;
    }

    // Check if folder with same name already exists in the same parent
    const existingFolder = await Folder.findOne({
      name,
      parentFolder: parentFolderId || null,
      owner: userId,
      isDeleted: false
    });

    if (existingFolder) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: 'A folder with this name already exists in this location'
      });
    }

    // Create new folder
    const folder = new Folder({
      name,
      owner: userId,
      parentFolder: parentFolderId || null,
      path: folderPath,
      level
    });

    await folder.save();

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Folder created successfully',
      data: { folder }
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Folder creation failed',
      error: error.message
    });
  }
};

export const getFolderContents = async (req, res) => {
  try {
    const { folderId } = req.params;
    const { page = 1, limit = 50, sortBy = 'name', sortOrder = 'asc' } = req.query;
    const userId = req.user._id;

    // If no folderId provided, get root contents
    const query = folderId ? { parentFolder: folderId } : { parentFolder: null };
    query.owner = userId;
    query.isDeleted = false;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get folders
    const folders = await Folder.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Get files
    const files = await File.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Combine and sort all items
    const allItems = [...folders, ...files];
    allItems.sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return sortOrder === 'desc' ? nameB.localeCompare(nameA) : nameA.localeCompare(nameB);
      }
      if (sortBy === 'createdAt') {
        return sortOrder === 'desc' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt;
      }
      if (sortBy === 'size') {
        return sortOrder === 'desc' ? (b.size || 0) - (a.size || 0) : (a.size || 0) - (b.size || 0);
      }
      return 0;
    });

    // Get total counts
    const totalFolders = await Folder.countDocuments(query);
    const totalFiles = await File.countDocuments(query);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        items: allItems,
        pagination: {
          currentPage: parseInt(page),
          totalItems: totalFolders + totalFiles,
          totalPages: Math.ceil((totalFolders + totalFiles) / limit),
          hasNext: (page * limit) < (totalFolders + totalFiles),
          hasPrev: page > 1
        },
        counts: {
          folders: totalFolders,
          files: totalFiles
        }
      }
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to get folder contents',
      error: error.message
    });
  }
};

export const getFolderInfo = async (req, res) => {
  try {
    const { folderId } = req.params;
    const userId = req.user._id;

    const folder = await Folder.findOne({
      _id: folderId,
      owner: userId,
      isDeleted: false
    }).populate('parentFolder', 'name path');

    if (!folder) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Folder not found'
      });
    }

    // Get folder statistics
    const filesCount = await File.countDocuments({
      parentFolder: folderId,
      owner: userId,
      isDeleted: false
    });

    const foldersCount = await Folder.countDocuments({
      parentFolder: folderId,
      owner: userId,
      isDeleted: false
    });

    // Calculate total size
    const files = await File.find({
      parentFolder: folderId,
      owner: userId,
      isDeleted: false
    }).select('size');

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        folder: {
          ...folder.toObject(),
          filesCount,
          foldersCount,
          totalSize
        }
      }
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to get folder info',
      error: error.message
    });
  }
};

export const renameFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const { name } = req.body;
    const userId = req.user._id;

    if (!name || name.trim().length === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Folder name is required'
      });
    }

    const folder = await Folder.findOne({
      _id: folderId,
      owner: userId,
      isDeleted: false
    });

    if (!folder) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Folder not found'
      });
    }

    // Check if folder with same name already exists in the same parent
    const existingFolder = await Folder.findOne({
      name: name.trim(),
      parentFolder: folder.parentFolder,
      owner: userId,
      isDeleted: false,
      _id: { $ne: folderId }
    });

    if (existingFolder) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: 'A folder with this name already exists in this location'
      });
    }

    // Update folder name and path
    const oldName = folder.name;
    folder.name = name.trim();
    folder.path = folder.parentFolder 
      ? folder.path.replace(oldName, name.trim())
      : name.trim();

    await folder.save();

    // Update all child folders' paths recursively
    await updateChildFolderPaths(folder._id, folder.path);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Folder renamed successfully',
      data: { folder }
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Folder rename failed',
      error: error.message
    });
  }
};

export const moveFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const { destinationFolderId } = req.body;
    const userId = req.user._id;

    const folder = await Folder.findOne({
      _id: folderId,
      owner: userId,
      isDeleted: false
    });

    if (!folder) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Folder not found'
      });
    }

    // Validate destination folder
    let destinationFolder = null;
    let newLevel = 1;

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

      // Check if moving would exceed max hierarchy levels
      newLevel = destinationFolder.level + 1;
      if (newLevel > MAX_HIERARCHY_LEVELS) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Moving this folder would exceed maximum hierarchy level'
        });
      }

      // Prevent moving folder into itself or its descendants
      if (isDescendantFolder(folderId, destinationFolderId, userId)) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Cannot move folder into itself or its descendants'
        });
      }
    }

    // Check if folder with same name exists in destination
    const existingFolder = await Folder.findOne({
      name: folder.name,
      parentFolder: destinationFolderId || null,
      owner: userId,
      isDeleted: false,
      _id: { $ne: folderId }
    });

    if (existingFolder) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: 'A folder with this name already exists in the destination'
      });
    }

    // Update folder
    const oldPath = folder.path;
    folder.parentFolder = destinationFolderId || null;
    folder.level = newLevel;
    folder.path = destinationFolder 
      ? `${destinationFolder.path}/${folder.name}`
      : folder.name;

    await folder.save();

    // Update all child folders' paths and levels recursively
    await updateChildFolderPathsAndLevels(folder._id, folder.path, newLevel);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Folder moved successfully',
      data: { folder }
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Folder move failed',
      error: error.message
    });
  }
};

export const deleteFolder = async (req, res) => {
  try {
    const { folderId } = req.params;
    const userId = req.user._id;

    const folder = await Folder.findOne({
      _id: folderId,
      owner: userId,
      isDeleted: false
    });

    if (!folder) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Folder not found'
      });
    }

    // Mark folder as deleted
    folder.isDeleted = true;
    folder.deletedAt = new Date();
    await folder.save();

    // Mark all child folders as deleted
    await Folder.updateMany(
      { path: { $regex: `^${folder.path}/` }, owner: userId, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date() } }
    );

    // Mark all files in this folder and subfolders as deleted
    await File.updateMany(
      { path: { $regex: `^${folder.path}/` }, owner: userId, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date() } }
    );

    // Add to bin
    const binItem = new Bin({
      itemId: folder._id,
      itemType: 'Folder',
      name: folder.name,
      owner: userId,
      originalPath: folder.path,
      parentFolder: folder.parentFolder,
      size: 0, // Will be calculated if needed
      autoDeleteDate: new Date(Date.now() + BIN_AUTO_DELETE_DAYS * 24 * 60 * 60 * 1000)
    });

    await binItem.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Folder moved to bin successfully'
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Folder deletion failed',
      error: error.message
    });
  }
};

// Helper functions
async function updateChildFolderPaths(folderId, parentPath) {
  const childFolders = await Folder.find({ parentFolder: folderId, isDeleted: false });
  
  for (const childFolder of childFolders) {
    const newPath = `${parentPath}/${childFolder.name}`;
    childFolder.path = newPath;
    await childFolder.save();
    
    // Recursively update grandchildren
    await updateChildFolderPaths(childFolder._id, newPath);
  }
}

async function updateChildFolderPathsAndLevels(folderId, parentPath, parentLevel) {
  const childFolders = await Folder.find({ parentFolder: folderId, isDeleted: false });
  
  for (const childFolder of childFolders) {
    const newPath = `${parentPath}/${childFolder.name}`;
    const newLevel = parentLevel + 1;
    
    childFolder.path = newPath;
    childFolder.level = newLevel;
    await childFolder.save();
    
    // Recursively update grandchildren
    await updateChildFolderPathsAndLevels(childFolder._id, newPath, newLevel);
  }
}

async function isDescendantFolder(folderId, potentialParentId, userId) {
  if (folderId.toString() === potentialParentId.toString()) {
    return true;
  }

  const folder = await Folder.findOne({
    _id: folderId,
    owner: userId,
    isDeleted: false
  });

  if (!folder || !folder.parentFolder) {
    return false;
  }

  return isDescendantFolder(folder.parentFolder, potentialParentId, userId);
}
