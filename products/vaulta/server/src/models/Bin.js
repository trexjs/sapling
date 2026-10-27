import mongoose from 'mongoose';

const binSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  itemType: {
    type: String,
    enum: ['File', 'Folder'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalPath: {
    type: String,
    required: true
  },
  parentFolder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null
  },
  size: {
    type: Number,
    default: 0
  },
  deletedAt: {
    type: Date,
    default: Date.now
  },
  autoDeleteDate: {
    type: Date,
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index for cleanup
binSchema.index({ autoDeleteDate: 1 });
binSchema.index({ owner: 1 });
binSchema.index({ itemType: 1 });

export default mongoose.model('Bin', binSchema);
