import { v4 as uuidv4 } from 'uuid';
import Share from '../models/Share.js';
import File from '../models/File.js';
import Folder from '../models/Folder.js';
import User from '../models/User.js';
import { HTTP_STATUS } from '../../config/constants.js';

export const shareItem = async (req, res) => {
  try {
    const { itemId, itemType, sharedWith, permissions, expiresAt } = req.body;
    const userId = req.user._id;

    // Validate item exists and user owns it
    let item;
    if (itemType === 'File') {
      item = await File.findOne({
        _id: itemId,
        owner: userId,
        isDeleted: false
      });
    } else if (itemType === 'Folder') {
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

    // Validate sharedWith user exists
    const targetUser = await User.findById(sharedWith);
    if (!targetUser) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already shared
    const existingShare = await Share.findOne({
      itemId,
      itemType,
      sharedWith,
      isActive: true
    });

    if (existingShare) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: 'Item is already shared with this user'
      });
    }

    // Create share record
    const share = new Share({
      itemId,
      itemType,
      itemName: item.name,
      owner: userId,
      sharedWith,
      permissions,
      shareToken: uuidv4(),
      expiresAt: expiresAt ? new Date(expiresAt) : null
    });

    await share.save();

    // Update item's sharedWith array
    const shareData = {
      user: sharedWith,
      permissions,
      sharedAt: new Date()
    };

    if (itemType === 'File') {
      await File.findByIdAndUpdate(itemId, {
        $push: { sharedWith: shareData }
      });
    } else {
      await Folder.findByIdAndUpdate(itemId, {
        $push: { sharedWith: shareData }
      });
    }

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Item shared successfully',
      data: {
        share: {
          ...share.toObject(),
          sharedWithUser: {
            id: targetUser._id,
            username: targetUser.username,
            email: targetUser.email,
            fullName: targetUser.fullName
          }
        }
      }
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Sharing failed',
      error: error.message
    });
  }
};

export const getSharedWithMe = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    
    if (!req.user || !req.user._id) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    const userId = req.user._id;

    const query = {
      sharedWith: userId,
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    };

    const sharedItems = await Share.find(query)
      .populate({
        path: 'owner',
        select: 'username email firstName lastName',
        options: { strictPopulate: false }
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean(); // Use lean() to get plain objects and avoid mongoose document issues

    const totalCount = await Share.countDocuments(query);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        items: sharedItems,
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
    console.error('Error in getSharedWithMe:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to get shared items',
      error: error.message
    });
  }
};

export const getMySharedItems = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    
    if (!req.user || !req.user._id) {
      console.error('req.user is undefined or missing _id:', req.user);
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'User not authenticated'
      });
    }
    
    const userId = req.user._id;

    const query = {
      owner: userId,
      isActive: true
    };

    const sharedItems = await Share.find(query)
      .populate({
        path: 'sharedWith',
        select: 'username email firstName lastName',
        options: { strictPopulate: false }
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean(); // Use lean() to get plain objects and avoid mongoose document issues

    const totalCount = await Share.countDocuments(query);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        items: sharedItems,
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
    console.error('Error in getMySharedItems:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to get my shared items',
      error: error.message
    });
  }
};

export const updateSharePermissions = async (req, res) => {
  try {
    const { shareId } = req.params;
    const { permissions } = req.body;
    const userId = req.user._id;

    const share = await Share.findOne({
      _id: shareId,
      owner: userId,
      isActive: true
    });

    if (!share) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Share not found'
      });
    }

    share.permissions = permissions;
    await share.save();

    // Update item's sharedWith array
    const itemModel = share.itemType === 'File' ? File : Folder;
    await itemModel.findByIdAndUpdate(share.itemId, {
      $set: {
        'sharedWith.$[elem].permissions': permissions
      }
    }, {
      arrayFilters: [{ 'elem.user': share.sharedWith }]
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Share permissions updated successfully',
      data: { share }
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to update share permissions',
      error: error.message
    });
  }
};

export const revokeShare = async (req, res) => {
  try {
    const { shareId } = req.params;
    const userId = req.user._id;

    const share = await Share.findOne({
      _id: shareId,
      owner: userId,
      isActive: true
    });

    if (!share) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Share not found'
      });
    }

    share.isActive = false;
    await share.save();

    // Remove from item's sharedWith array
    const itemModel = share.itemType === 'File' ? File : Folder;
    await itemModel.findByIdAndUpdate(share.itemId, {
      $pull: { sharedWith: { user: share.sharedWith } }
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Share revoked successfully'
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to revoke share',
      error: error.message
    });
  }
};

export const getSharedItemAccess = async (req, res) => {
  try {
    const { shareToken } = req.params;
    const userId = req.user._id;

    const share = await Share.findOne({
      shareToken,
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    }).populate('owner', 'username email firstName lastName');

    if (!share) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'Shared item not found or expired'
      });
    }

    // Check if user has access to this shared item
    const hasAccess = share.sharedWith.toString() === userId.toString();

    if (!hasAccess) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'You do not have access to this shared item'
      });
    }

    // Update access count
    await Share.findByIdAndUpdate(share._id, {
      $inc: { accessCount: 1 },
      lastAccessed: new Date()
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: { share }
    });
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to access shared item',
      error: error.message
    });
  }
};
