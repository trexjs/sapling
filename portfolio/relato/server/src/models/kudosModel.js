import mongoose from 'mongoose';

const kudosSchema = new mongoose.Schema({
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
  recipient_id: {
    type: String,
    required: true
  },
  recipient_name: {
    type: String,
    required: true
  },
  recipient_email: {
    type: String,
    default: ''
  },
  recipient_image: {
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
  values: [{
    type: String,
    trim: true
  }],
  reactions: [{
    user_id: {
      type: String,
      required: true
    },
    user_name: {
      type: String,
      required: true
    },
    reaction_type: {
      type: String,
      required: true,
      enum: ['like', 'love', 'celebrate', 'rocket', 'thumbs_up', 'clap', 'fire', 'star']
    },
    created_at: {
      type: Date,
      default: Date.now
    }
  }],
  visibility: {
    type: String,
    enum: ['public', 'school', 'private'],
    default: 'school'
  },
  is_featured: {
    type: Boolean,
    default: false
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
kudosSchema.index({ sender_id: 1, created_at: -1 });
kudosSchema.index({ recipient_id: 1, created_at: -1 });
kudosSchema.index({ school_id: 1, created_at: -1 });
kudosSchema.index({ visibility: 1, created_at: -1 });
kudosSchema.index({ is_featured: 1, created_at: -1 });

// Pre-save middleware to update timestamps
kudosSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Method to get kudos by user
kudosSchema.statics.getKudosByUser = function(userId, userType = 'recipient') {
  const query = {};
  
  if (userType === 'sender') {
    query.sender_id = userId;
  } else if (userType === 'recipient') {
    query.recipient_id = userId;
  } else {
    // Show kudos where user is sender or recipient
    query.$or = [
      { sender_id: userId },
      { recipient_id: userId }
    ];
  }
  
  return this.find(query).sort({ created_at: -1 });
};

// Method to get kudos statistics for a user
kudosSchema.statics.getKudosStats = function(userId) {
  return this.aggregate([
    {
      $match: {
        $or: [
          { sender_id: userId },
          { recipient_id: userId }
        ]
      }
    },
    {
      $group: {
        _id: null,
        total_received: {
          $sum: {
            $cond: [{ $eq: ['$recipient_id', userId] }, 1, 0]
          }
        },
        total_given: {
          $sum: {
            $cond: [{ $eq: ['$sender_id', userId] }, 1, 0]
          }
        },
        total_reactions: {
          $sum: { $size: '$reactions' }
        }
      }
    }
  ]);
};

// Method to add reaction
kudosSchema.methods.addReaction = function(userId, userName, reactionType) {
  // Remove existing reaction from this user
  this.reactions = this.reactions.filter(reaction => reaction.user_id !== userId);
  
  // Add new reaction
  this.reactions.push({
    user_id: userId,
    user_name: userName,
    reaction_type: reactionType,
    created_at: new Date()
  });
  
  return this.save();
};

// Method to remove reaction
kudosSchema.methods.removeReaction = function(userId) {
  this.reactions = this.reactions.filter(reaction => reaction.user_id !== userId);
  return this.save();
};

export default mongoose.model('Kudos', kudosSchema);
