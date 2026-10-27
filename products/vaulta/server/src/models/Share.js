import mongoose from 'mongoose';

const shareSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  itemType: {
    type: String,
    enum: ['File', 'Folder'],
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sharedWith: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  permissions: [{
    type: String,
    enum: ['read', 'write', 'delete', 'share'],
    required: true
  }],
  shareToken: {
    type: String,
    unique: true,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: null
  },
  accessCount: {
    type: Number,
    default: 0
  },
  lastAccessed: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for lookups
shareSchema.index({ itemId: 1, itemType: 1 });
shareSchema.index({ sharedWith: 1, isActive: 1 });
shareSchema.index({ shareToken: 1 });
shareSchema.index({ owner: 1 });

export default mongoose.model('Share', shareSchema);
