import mongoose from 'mongoose';

const pollOptionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  order: {
    type: Number,
    required: true
  }
}, { _id: true });

const pollVoteSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  option_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  voted_at: {
    type: Date,
    default: Date.now
  }
});

const pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: [pollOptionSchema],
  creator_id: {
    type: String,
    required: true
  },
  creator_name: {
    type: String,
    required: true
  },
  creator_image: {
    type: String,
    default: ''
  },
  school_id: {
    type: String,
    required: true
  },
  duration_days: {
    type: Number,
    default: 3,
    min: 1,
    max: 30
  },
  expires_at: {
    type: Date,
    required: true
  },
  is_active: {
    type: Boolean,
    default: true
  },
  votes: [pollVoteSchema],
  total_votes: {
    type: Number,
    default: 0
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
pollSchema.index({ school_id: 1, is_active: 1 });
pollSchema.index({ creator_id: 1 });
pollSchema.index({ expires_at: 1 });

// Virtual for checking if poll is expired
pollSchema.virtual('is_expired').get(function() {
  return new Date() > this.expires_at;
});

// Method to get vote statistics
pollSchema.methods.getVoteStats = function() {
  const stats = {};
  this.options.forEach(option => {
    const voteCount = this.votes.filter(vote => vote.option_id.toString() === option._id.toString()).length;
    stats[option._id] = {
      count: voteCount,
      percentage: this.total_votes > 0 ? Math.round((voteCount / this.total_votes) * 100) : 0
    };
  });
  return stats;
};

// Method to check if user has voted
pollSchema.methods.hasUserVoted = function(userId) {
  return this.votes.some(vote => vote.user_id === userId);
};

// Method to get user's vote
pollSchema.methods.getUserVote = function(userId) {
  const vote = this.votes.find(vote => vote.user_id === userId);
  return vote ? vote.option_id : null;
};

// Pre-save middleware to calculate total votes
pollSchema.pre('save', function(next) {
  this.total_votes = this.votes.length;
  this.updated_at = new Date();
  next();
});

export default mongoose.model('Poll', pollSchema);
