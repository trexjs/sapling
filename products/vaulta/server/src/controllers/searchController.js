import File from '../models/File.js';
import Folder from '../models/Folder.js';
import { HTTP_STATUS } from '../../config/constants.js';

export const searchItems = async (req, res) => {
  try {
    const { q, type, page = 1, limit = 50 } = req.query;
    const userId = req.user._id;

    if (!q || q.trim().length === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const searchQuery = {
      owner: userId,
      isDeleted: false,
      $text: { $search: q.trim() }
    };

    let results = [];
    let totalCount = 0;

    if (!type || type === 'all' || type === 'files') {
      const fileResults = await File.find(searchQuery, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      results = results.concat(fileResults.map(file => ({
        ...file.toObject(),
        itemType: 'file'
      })));
    }

    if (!type || type === 'all' || type === 'folders') {
      const folderResults = await Folder.find(searchQuery, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));

      results = results.concat(folderResults.map(folder => ({
        ...folder.toObject(),
        itemType: 'folder'
      })));
    }

    // Sort combined results by text score
    results.sort((a, b) => (b.score || 0) - (a.score || 0));

    // Get total counts
    if (!type || type === 'all' || type === 'files') {
      const fileCount = await File.countDocuments(searchQuery);
      totalCount += fileCount;
    }

    if (!type || type === 'all' || type === 'folders') {
      const folderCount = await Folder.countDocuments(searchQuery);
      totalCount += folderCount;
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        query: q,
        results,
        pagination: {
          currentPage: parseInt(page),
          totalItems: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNext: (page * limit) < totalCount,
          hasPrev: page > 1
        },
        counts: {
          files: type === 'files' ? results.filter(r => r.itemType === 'file').length : null,
          folders: type === 'folders' ? results.filter(r => r.itemType === 'folder').length : null,
          total: results.length
        }
      }
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
};

export const searchRecent = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user._id;

    // Get recent files
    const recentFiles = await File.find({
      owner: userId,
      isDeleted: false
    })
      .sort({ lastAccessed: -1, updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Get recent folders
    const recentFolders = await Folder.find({
      owner: userId,
      isDeleted: false
    })
      .sort({ lastAccessed: -1, updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Combine and sort by last accessed/updated
    const allRecent = [
      ...recentFiles.map(file => ({ ...file.toObject(), itemType: 'file' })),
      ...recentFolders.map(folder => ({ ...folder.toObject(), itemType: 'folder' }))
    ].sort((a, b) => {
      const aTime = new Date(a.lastAccessed || a.updatedAt);
      const bTime = new Date(b.lastAccessed || b.updatedAt);
      return bTime - aTime;
    });

    const totalCount = await File.countDocuments({ owner: userId, isDeleted: false }) +
                      await Folder.countDocuments({ owner: userId, isDeleted: false });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        items: allRecent,
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
      message: 'Failed to get recent items',
      error: error.message
    });
  }
};

export const searchStarred = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user._id;

    // Get starred files
    const starredFiles = await File.find({
      owner: userId,
      isDeleted: false,
      isStarred: true
    })
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Get starred folders
    const starredFolders = await Folder.find({
      owner: userId,
      isDeleted: false,
      isStarred: true
    })
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Combine results
    const allStarred = [
      ...starredFiles.map(file => ({ ...file.toObject(), itemType: 'file' })),
      ...starredFolders.map(folder => ({ ...folder.toObject(), itemType: 'folder' }))
    ].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    const totalCount = await File.countDocuments({ owner: userId, isDeleted: false, isStarred: true }) +
                      await Folder.countDocuments({ owner: userId, isDeleted: false, isStarred: true });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        items: allStarred,
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
