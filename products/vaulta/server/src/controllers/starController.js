import File from '../models/File.js';
import Folder from '../models/Folder.js';
import { HTTP_STATUS } from '../../config/constants.js';

export const toggleStar = async (req, res) => {
  try {
    const { itemId, itemType } = req.params;
    const userId = req.user._id;

    let item;
    if (itemType === 'file') {
      item = await File.findOne({
        _id: itemId,
        owner: userId,
        isDeleted: false
      });
    } else if (itemType === 'folder') {
      item = await Folder.findOne({
        _id: itemId,
        owner: userId,
        isDeleted: false
      });
    }

    if (!item) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Toggle star status
    item.isStarred = !item.isStarred;
    await item.save();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: `Item ${item.isStarred ? 'starred' : 'unstarred'} successfully`,
      data: {
        item,
        isStarred: item.isStarred
      }
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to toggle star status',
      error: error.message
    });
  }
};

export const getStarredItems = async (req, res) => {
  try {
    const { page = 1, limit = 50, type } = req.query;
    const userId = req.user._id;

    let results = [];
    let totalCount = 0;

    if (!type || type === 'all' || type === 'files') {
      const starredFiles = await File.find({
        owner: userId,
        isDeleted: false,
        isStarred: true
      })
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      results = results.concat(starredFiles.map(file => ({
        ...file.toObject(),
        itemType: 'file'
      })));

      if (!type || type === 'all') {
        const fileCount = await File.countDocuments({
          owner: userId,
          isDeleted: false,
          isStarred: true
        });
        totalCount += fileCount;
      }
    }

    if (!type || type === 'all' || type === 'folders') {
      const starredFolders = await Folder.find({
        owner: userId,
        isDeleted: false,
        isStarred: true
      })
        .sort({ updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      results = results.concat(starredFolders.map(folder => ({
        ...folder.toObject(),
        itemType: 'folder'
      })));

      if (!type || type === 'all') {
        const folderCount = await Folder.countDocuments({
          owner: userId,
          isDeleted: false,
          isStarred: true
        });
        totalCount += folderCount;
      }
    }

    // Sort combined results by updatedAt
    results.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    // If type is specified, get exact count
    if (type && type !== 'all') {
      totalCount = results.length;
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        items: results,
        pagination: {
          currentPage: parseInt(page),
          totalItems: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNext: (page * limit) < totalCount,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to get starred items',
      error: error.message
    });
  }
};
