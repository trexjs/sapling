import Poll from '../models/pollModel.js';

// Create a new poll
export const createPoll = async (req, res) => {
  try {
    const { question, options, duration_days = 3 } = req.body;
    const { user_id, profile, school_id } = req.user;

    // Validate required fields
    if (!question || !options || options.length < 2 || options.length > 7) {
      return res.status(400).json({
        success: false,
        message: 'Question is required and options must be between 2-7'
      });
    }

    // Calculate expiration date
    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + duration_days);

    // Create poll
    const poll = new Poll({
      question,
      options: options.map((option, index) => ({
        text: option.text,
        order: option.order || index + 1
      })),
      creator_id: user_id,
      creator_name: `${profile.first_name} ${profile.last_name}`.trim(),
      creator_image: profile.photo || '',
      school_id,
      duration_days,
      expires_at
    });

    await poll.save();

    res.status(201).json({
      success: true,
      message: 'Poll created successfully',
      data: poll
    });
  } catch (error) {
    console.error('Error creating poll:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create poll',
      error: error.message
    });
  }
};

// Get all polls for a school
export const getPolls = async (req, res) => {
  try {
    const { school_id } = req.user;
    const { page = 1, limit = 10, status = 'active' } = req.query;

    const query = { school_id };
    
    if (status === 'active') {
      query.is_active = true;
      query.expires_at = { $gt: new Date() };
    } else if (status === 'expired') {
      query.expires_at = { $lte: new Date() };
    }

    const polls = await Poll.find(query)
      .sort({ created_at: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Poll.countDocuments(query);

    res.json({
      success: true,
      data: polls,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching polls:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch polls',
      error: error.message
    });
  }
};

// Get a specific poll
export const getPollById = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.user;

    const poll = await Poll.findById(id);
    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found'
      });
    }

    // Add user's vote information
    const pollObj = poll.toObject();
    pollObj.user_has_voted = poll.hasUserVoted(user_id);
    pollObj.user_vote = poll.getUserVote(user_id);
    pollObj.vote_stats = poll.getVoteStats();
    pollObj.is_expired = poll.is_expired;

    res.json({
      success: true,
      data: pollObj
    });
  } catch (error) {
    console.error('Error fetching poll:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch poll',
      error: error.message
    });
  }
};

// Vote on a poll
export const votePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const { option_id } = req.body;
    const { user_id } = req.user;

    const poll = await Poll.findById(id);
    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found'
      });
    }

    // Check if poll is expired
    if (poll.is_expired) {
      return res.status(400).json({
        success: false,
        message: 'Poll has expired'
      });
    }

    // Check if user has already voted
    if (poll.hasUserVoted(user_id)) {
      return res.status(400).json({
        success: false,
        message: 'You have already voted on this poll'
      });
    }

    // Check if option exists
    const option = poll.options.id(option_id);
    if (!option) {
      return res.status(400).json({
        success: false,
        message: 'Invalid option'
      });
    }

    // Add vote
    poll.votes.push({
      user_id,
      option_id
    });

    await poll.save();

    res.json({
      success: true,
      message: 'Vote recorded successfully',
      data: {
        vote_stats: poll.getVoteStats(),
        total_votes: poll.total_votes
      }
    });
  } catch (error) {
    console.error('Error voting on poll:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to vote on poll',
      error: error.message
    });
  }
};

// Update a poll (only by creator)
export const updatePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, options, duration_days } = req.body;
    const { user_id } = req.user;

    const poll = await Poll.findById(id);
    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found'
      });
    }

    // Check if user is the creator
    if (poll.creator_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: 'Only the creator can update this poll'
      });
    }

    // Check if poll has votes
    if (poll.votes.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update poll that has votes'
      });
    }

    // Update poll
    if (question) poll.question = question;
    if (options) {
      poll.options = options.map((option, index) => ({
        text: option.text,
        order: option.order || index + 1
      }));
    }
    if (duration_days) {
      poll.duration_days = duration_days;
      const expires_at = new Date();
      expires_at.setDate(expires_at.getDate() + duration_days);
      poll.expires_at = expires_at;
    }

    await poll.save();

    res.json({
      success: true,
      message: 'Poll updated successfully',
      data: poll
    });
  } catch (error) {
    console.error('Error updating poll:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update poll',
      error: error.message
    });
  }
};

// Delete a poll (only by creator)
export const deletePoll = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.user;

    const poll = await Poll.findById(id);
    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found'
      });
    }

    // Check if user is the creator
    if (poll.creator_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: 'Only the creator can delete this poll'
      });
    }

    await Poll.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Poll deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting poll:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete poll',
      error: error.message
    });
  }
};

// Get poll analytics
export const getPollAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.user;

    const poll = await Poll.findById(id);
    if (!poll) {
      return res.status(404).json({
        success: false,
        message: 'Poll not found'
      });
    }

    // Check if user is the creator
    // if (poll.creator_id !== user_id) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Only the creator can view analytics'
    //   });
    // }

    const analytics = {
      total_votes: poll.total_votes,
      vote_stats: poll.getVoteStats(),
      is_expired: poll.is_expired,
      time_remaining: poll.is_expired ? 0 : Math.max(0, poll.expires_at - new Date()),
      created_at: poll.created_at,
      expires_at: poll.expires_at
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching poll analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch poll analytics',
      error: error.message
    });
  }
};
