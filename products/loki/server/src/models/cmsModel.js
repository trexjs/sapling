import mongoose from "mongoose";

const cmsDocumentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['terms-and-conditions', 'privacy-policy'],
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  version: {
    type: String,
    required: true,
    default: '0.0.0'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update the updatedAt field before saving
cmsDocumentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes
cmsDocumentSchema.index({ type: 1 });
cmsDocumentSchema.index({ version: 1 });

const CMSDocument = mongoose.model('CMSDocument', cmsDocumentSchema);

export default CMSDocument;
