import Feedback from '../models/feedbackModel.js';
import { Student } from '../models/studentModel.js';

// Create a new feedback
export const createFeedback = async (req, res) => {
  try {
    const { receiver_id, message, status = 'draft' } = req.body;
    const { user_id, profile, school_id } = req.user;

    // Validate required fields
    if (!receiver_id || !message) {
      return res.status(400).json({
        success: false,
        message: 'Receiver ID and message are required'
      });
    }

    // Get receiver details
    const receiver = await Student.findById(receiver_id);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      });
    }

    // Create feedback
    const feedback = new Feedback({
      sender_id: user_id,
      sender_name: `${profile.first_name} ${profile.last_name}`.trim(),
      sender_email: profile.email_id || '',
      sender_image: profile.photo || '',
      receiver_id,
      receiver_name: `${receiver.firstname} ${receiver.lastname}`.trim(),
      receiver_email: receiver.profile?.email_id || '',
      receiver_image: receiver.profile?.photo || '',
      school_id,
      message,
      status,
      is_draft: status === 'draft'
    });

    await feedback.save();

    res.status(201).json({
      success: true,
      message: 'Feedback created successfully',
      data: feedback
    });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create feedback',
      error: error.message
    });
  }
};

// Get feedbacks by status
export const getFeedbacks = async (req, res) => {
  try {
    const { user_id, school_id } = req.user;
    const { status, user_type = 'sender', page = 1, limit = 10 } = req.query;

    const query = {};
    
    if (user_type === 'sender') {
      query.sender_id = user_id;
    } else if (user_type === 'receiver') {
      query.receiver_id = user_id;
    } else if (user_type === 'school') {
      // Show all feedbacks in the user's school
      query.school_id = school_id;
    } else {
      // Default: show feedbacks where user is sender or receiver, or in same school
      query.$or = [
        { sender_id: user_id },
        { receiver_id: user_id },
        { school_id: school_id }
      ];
    }
    
    if (status) {
      query.status = status;
    }

    const feedbacks = await Feedback.find(query)
      .sort({ created_at: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Feedback.countDocuments(query);

    res.json({
      success: true,
      data: feedbacks,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedbacks',
      error: error.message
    });
  }
};

// Get a specific feedback
export const getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.user;

    const feedback = await Feedback.findById(id);
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Check if user is sender, receiver, or has school-level access
    const { school_id: user_school_id } = req.user;
    const isSender = feedback.sender_id === user_id;
    const isReceiver = feedback.receiver_id === user_id;
    const isSameSchool = feedback.school_id === user_school_id;
    
    if (!isSender && !isReceiver && !isSameSchool) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    res.json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error.message
    });
  }
};

// Update feedback status
export const updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { user_id } = req.user;

    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Check if user is the sender
    if (feedback.sender_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: 'Only the sender can update feedback status'
      });
    }

    // Validate status
    const validStatuses = ['draft', 'pending', 'received', 'given'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    feedback.status = status;
    await feedback.save();

    res.json({
      success: true,
      message: 'Feedback status updated successfully',
      data: feedback
    });
  } catch (error) {
    console.error('Error updating feedback status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update feedback status',
      error: error.message
    });
  }
};

// Update feedback content
export const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, status } = req.body;
    const { user_id, school_id } = req.user;

    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Check if user is sender, receiver, or has school-level access
    const isSender = feedback.sender_id === user_id;
    const isReceiver = feedback.receiver_id === user_id;
    const isSameSchool = feedback.school_id === school_id;
    
    if (!isSender && !isReceiver && !isSameSchool) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Only allow status updates for non-draft feedbacks if user is sender or has school access
    if (status && status !== 'draft' && !isSender && !isSameSchool) {
      return res.status(403).json({
        success: false,
        message: 'Only sender or school admin can change status'
      });
    }

    // Update message if provided
    if (message !== undefined) {
      feedback.message = message;
    }
    
    // Update status if provided
    if (status !== undefined) {
      feedback.status = status;
      if (status !== 'draft') {
        feedback.is_draft = false;
        if (!feedback.submitted_at) {
          feedback.submitted_at = new Date();
        }
      }
    }
    
    await feedback.save();

    res.json({
      success: true,
      message: 'Feedback updated successfully',
      data: feedback
    });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update feedback',
      error: error.message
    });
  }
};

// Delete feedback
export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.user;

    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Check if user is the sender
    if (feedback.sender_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: 'Only the sender can delete feedback'
      });
    }

    await Feedback.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete feedback',
      error: error.message
    });
  }
};

// Get feedback statistics
export const getFeedbackStats = async (req, res) => {
  try {
    const { user_id } = req.user;

    const stats = await Feedback.getFeedbackStats(user_id);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback statistics',
      error: error.message
    });
  }
};

// Search students for feedback
export const searchStudents = async (req, res) => {
  try {
    const { query } = req.query;
    const { school_id } = req.user;

    console.log('query', query);
    console.log('school_id', school_id);
    console.log('req', req.user);

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
