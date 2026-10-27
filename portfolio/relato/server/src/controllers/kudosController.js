import Kudos from '../models/kudosModel.js';
import { Student } from '../models/studentModel.js';

// Create a new kudos
export const createKudos = async (req, res) => {
  try {
    const { recipient_id, message, values = [], reactions = [], visibility = 'school' } = req.body;
    const { user_id, profile, school_id } = req.user;

    // Validate required fields
    if (!recipient_id || !message) {
      return res.status(400).json({
        success: false,
        message: 'Recipient ID and message are required'
      });
    }

    // Get recipient details
    const recipient = await Student.findById(recipient_id);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    // Process reactions array to match the schema format
    const processedReactions = reactions.map(reactionType => ({
      user_id: user_id,
      user_name: `${profile.first_name} ${profile.last_name}`.trim(),
      reaction_type: reactionType,
      created_at: new Date()
    }));

    // Create kudos
    const kudos = new Kudos({
      sender_id: user_id,
      sender_name: `${profile.first_name} ${profile.last_name}`.trim(),
      sender_email: profile.email_id || '',
      sender_image: profile.photo || '',
      recipient_id,
      recipient_name: `${recipient.firstname} ${recipient.lastname}`.trim(),
      recipient_email: recipient.profile?.email_id || '',
      recipient_image: recipient.profile?.photo || '',
      school_id,
      message,
      values,
      reactions: processedReactions,
      visibility
    });

    await kudos.save();

    res.status(201).json({
      success: true,
      message: 'Kudos created successfully',
      data: kudos
    });
  } catch (error) {
    console.error('Error creating kudos:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create kudos',
      error: error.message
    });
  }
};

// Get all kudos
export const getKudos = async (req, res) => {
  try {
    const { user_id, school_id } = req.user;
    const { user_type = 'all', page = 1, limit = 10, featured_only = false } = req.query;

    let query = {};

    if (user_type === 'sent') {
      query.sender_id = user_id;
    } else if (user_type === 'received') {
      query.recipient_id = user_id;
    } else if (user_type === 'school') {
      query.school_id = school_id;
    } else {
      // Show kudos where user is sender or recipient, or in same school
      query.$or = [
        { sender_id: user_id },
        { recipient_id: user_id },
        { school_id: school_id }
      ];
    }

    if (featured_only === 'true') {
      query.is_featured = true;
    }

    const kudos = await Kudos.find(query)
      .sort({ created_at: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Kudos.countDocuments(query);

    res.json({
      success: true,
      data: kudos,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching kudos:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch kudos',
      error: error.message
    });
  }
};

// Get a specific kudos
export const getKudosById = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, school_id } = req.user;

    const kudos = await Kudos.findById(id);
    
    if (!kudos) {
      return res.status(404).json({
        success: false,
        message: 'Kudos not found'
      });
    }

    // Check if user has access to this kudos
    const isSender = kudos.sender_id === user_id;
    const isRecipient = kudos.recipient_id === user_id;
    const isSameSchool = kudos.school_id === school_id;
    
    if (!isSender && !isRecipient && !isSameSchool) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: kudos
    });
  } catch (error) {
    console.error('Error fetching kudos:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch kudos',
      error: error.message
    });
  }
};

// Update kudos
export const updateKudos = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, values, reactions, visibility, is_featured } = req.body;
    const { user_id, school_id, profile } = req.user;

    const kudos = await Kudos.findById(id);
    if (!kudos) {
      return res.status(404).json({
        success: false,
        message: 'Kudos not found'
      });
    }

    // Check if user is sender or has school-level access
    const isSender = kudos.sender_id === user_id;
    const isSameSchool = kudos.school_id === school_id;
    
    if (!isSender && !isSameSchool) {
      return res.status(403).json({
        success: false,
        message: 'Only the sender or school admin can update kudos'
      });
    }

    // Update fields if provided
    if (message !== undefined) {
      kudos.message = message;
    }
    
    if (values !== undefined) {
      kudos.values = values;
    }
    
    if (reactions !== undefined) {
      // Process reactions array to match the schema format
      const processedReactions = reactions.map(reactionType => ({
        user_id: user_id,
        user_name: `${profile.first_name} ${profile.last_name}`.trim(),
        reaction_type: reactionType,
        created_at: new Date()
      }));
      kudos.reactions = processedReactions;
    }
    
    if (visibility !== undefined) {
      kudos.visibility = visibility;
    }

    // Only school admin can change featured status
    if (is_featured !== undefined && isSameSchool) {
      kudos.is_featured = is_featured;
    }
    
    await kudos.save();

    res.json({
      success: true,
      message: 'Kudos updated successfully',
      data: kudos
    });
  } catch (error) {
    console.error('Error updating kudos:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update kudos',
      error: error.message
    });
  }
};

// Delete kudos
export const deleteKudos = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, school_id } = req.user;

    const kudos = await Kudos.findById(id);
    if (!kudos) {
      return res.status(404).json({
        success: false,
        message: 'Kudos not found'
      });
    }

    // Check if user is sender or has school-level access
    const isSender = kudos.sender_id === user_id;
    const isSameSchool = kudos.school_id === school_id;
    
    if (!isSender && !isSameSchool) {
      return res.status(403).json({
        success: false,
        message: 'Only the sender or school admin can delete kudos'
      });
    }

    await Kudos.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Kudos deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting kudos:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete kudos',
      error: error.message
    });
  }
};

// Add reaction to kudos
export const addReaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { reaction_type } = req.body;
    const { user_id, profile } = req.user;

    const kudos = await Kudos.findById(id);
    if (!kudos) {
      return res.status(404).json({
        success: false,
        message: 'Kudos not found'
      });
    }

    const validReactions = ['like', 'love', 'celebrate', 'rocket', 'thumbs_up', 'clap', 'fire', 'star'];
    if (!validReactions.includes(reaction_type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reaction type'
      });
    }

    const userName = `${profile.first_name} ${profile.last_name}`.trim();
    await kudos.addReaction(user_id, userName, reaction_type);

    res.json({
      success: true,
      message: 'Reaction added successfully',
      data: kudos
    });
  } catch (error) {
    console.error('Error adding reaction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add reaction',
      error: error.message
    });
  }
};

// Remove reaction from kudos
export const removeReaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.user;

    const kudos = await Kudos.findById(id);
    if (!kudos) {
      return res.status(404).json({
        success: false,
        message: 'Kudos not found'
      });
    }

    await kudos.removeReaction(user_id);

    res.json({
      success: true,
      message: 'Reaction removed successfully',
      data: kudos
    });
  } catch (error) {
    console.error('Error removing reaction:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove reaction',
      error: error.message
    });
  }
};

// Get kudos statistics
export const getKudosStats = async (req, res) => {
  try {
    const { user_id } = req.user;

    const stats = await Kudos.getKudosStats(user_id);

    res.json({
      success: true,
      data: stats[0] || { total_received: 0, total_given: 0, total_reactions: 0 }
    });
  } catch (error) {
    console.error('Error fetching kudos stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch kudos statistics',
      error: error.message
    });
  }
};

// Search students for kudos
export const searchStudents = async (req, res) => {
  try {
    const { query } = req.query;
    const { school_id } = req.user;

    if (!query || query.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    const students = await Student.find({
      'school_id': school_id,
      $or: [
        { firstname: { $regex: query, $options: 'i' } },
        { lastname: { $regex: query, $options: 'i' } },
        { displayname: { $regex: query, $options: 'i' } }
      ]
    })
    .select('_id firstname lastname displayname profile.photo')
    .limit(10);

    const formattedStudents = students.map(student => ({
      _id: student._id,
      name: `${student.firstname} ${student.lastname}`.trim(),
      displayname: student.displayname,
      photo: student.profile?.photo || ''
    }));

    res.json({
      success: true,
      data: formattedStudents
    });
  } catch (error) {
    console.error('Error searching students:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search students',
      error: error.message
    });
  }
};
