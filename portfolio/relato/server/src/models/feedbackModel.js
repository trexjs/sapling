import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  sender_id: {
    type: String,
    required: true
  },
  sender_name: {
    type: String,
    required: true
  },
  sender_email: {
    type: String,
    default: ''
  },
  sender_image: {
    type: String,
    default: ''
  },
  receiver_id: {
    type: String,
    required: true
  },
  receiver_name: {
    type: String,
    required: true
  },
  receiver_email: {
    type: String,
    default: ''
  },
  receiver_image: {
    type: String,
    default: ''
  },
  school_id: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'received', 'given'],
    default: 'draft'
  },
  is_draft: {
    type: Boolean,
    default: true
  },
  submitted_at: {
    type: Date
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
feedbackSchema.index({ sender_id: 1, status: 1 });
feedbackSchema.index({ receiver_id: 1, status: 1 });
feedbackSchema.index({ school_id: 1, status: 1 });
feedbackSchema.index({ created_at: -1 });

// Pre-save middleware to update timestamps and status
feedbackSchema.pre('save', function(next) {
  this.updated_at = new Date();
  
  // Update submitted_at when status changes from draft
  if (this.isModified('status') && this.status !== 'draft' && !this.submitted_at) {
    this.submitted_at = new Date();
    this.is_draft = false;
  }
  
  next();
});

// Method to get feedback by status for a user
feedbackSchema.statics.getFeedbackByStatus = function(userId, status, userType = 'sender') {
  const query = {};
  
  if (userType === 'sender') {
    query.sender_id = userId;
  } else {
    query.receiver_id = userId;
  }
  
  if (status) {
    query.status = status;
  }
  
  return this.find(query).sort({ created_at: -1 });
};

// Method to get feedback statistics for a user
feedbackSchema.statics.getFeedbackStats = function(userId) {
  return this.aggregate([
    {
      $match: {
        $or: [
          { sender_id: userId },
          { receiver_id: userId }
        ]
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
};

export default mongoose.model('Feedback', feedbackSchema);
