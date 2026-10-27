import mongoose from 'mongoose';
import { FILE_TYPES, ITEM_TYPES, ICON_MAPPING } from '../../config/constants.js';

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  url: {
    type: String,
    default: null
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
  type: {
    type: String,
    enum: Object.values(FILE_TYPES),
    default: FILE_TYPES.OTHER
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
  downloadCount: {
    type: Number,
    default: 0
  },
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
fileSchema.virtual('icon').get(function() {
  return ICON_MAPPING[this.mimeType] || ICON_MAPPING.default;
});

// Virtual for item type
fileSchema.virtual('itemType').get(function() {
  return ITEM_TYPES.FILE;
});

// Index for search
fileSchema.index({ name: 'text', originalName: 'text' });
fileSchema.index({ owner: 1, isDeleted: 1 });
fileSchema.index({ parentFolder: 1, isDeleted: 1 });
fileSchema.index({ isStarred: 1, owner: 1 });

// Transform output
fileSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model('File', fileSchema);
