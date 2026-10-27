import mongoose from 'mongoose';
import { ITEM_TYPES, MAX_HIERARCHY_LEVELS } from '../../config/constants.js';

const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parentFolder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null
  },
  path: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: MAX_HIERARCHY_LEVELS
  },
  isStarred: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  },
  sharedWith: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permissions: [{
      type: String,
      enum: ['read', 'write', 'delete', 'share']
    }],
    sharedAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Virtual for icon
folderSchema.virtual('icon').get(function() {
  return '📁';
});

// Virtual for item type
folderSchema.virtual('itemType').get(function() {
  return ITEM_TYPES.FOLDER;
});

// Virtual for children count
folderSchema.virtual('childrenCount', {
  ref: 'Folder',
  localField: '_id',
  foreignField: 'parentFolder',
  count: true
});

// Virtual for files count
folderSchema.virtual('filesCount', {
  ref: 'File',
  localField: '_id',
  foreignField: 'parentFolder',
  count: true
});

// Index for search
folderSchema.index({ name: 'text' });
folderSchema.index({ owner: 1, isDeleted: 1 });
folderSchema.index({ parentFolder: 1, isDeleted: 1 });
folderSchema.index({ path: 1 });
folderSchema.index({ level: 1 });
folderSchema.index({ isStarred: 1, owner: 1 });

// Transform output
folderSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model('Folder', folderSchema);
