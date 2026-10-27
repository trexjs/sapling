import { Parent } from "../models/parentModel.js";
import { Student } from "../models/studentModel.js";
import { User } from "../models/authModel.js";
import bcrypt from "bcrypt";

// Get all parents
export const getParents = async (req, res) => {
  try {
    const { school_id, status } = req.query;
    
    const filter = {};
    if (school_id) filter.school_id = school_id;
    if (status !== undefined) filter.status = status === 'true';
    
    const parents = await Parent.find(filter)
      .populate('children.student_id', 'firstname lastname student_id class section')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      message: "Parents retrieved successfully",
      data: parents
    });
  } catch (error) {
    console.error("Error fetching parents:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch parents",
      error: error.message
    });
  }
};

// Get parent by ID
export const getParentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const parent = await Parent.findById(id)
      .populate('children.student_id', 'firstname lastname student_id class section profile address');
    
    if (!parent) {
      return res.status(404).json({
        success: false,
        message: "Parent not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Parent retrieved successfully",
      data: parent
    });
  } catch (error) {
    console.error("Error fetching parent:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch parent",
      error: error.message
    });
  }
};

// Get parent's children
export const getParentChildren = async (req, res) => {
  try {
    const { id } = req.params;
    
    const parent = await Parent.findById(id)
      .populate({
        path: 'children.student_id',
        select: 'firstname lastname student_id class section profile address parent_details admission_date status'
      });
    
    if (!parent) {
      return res.status(404).json({
        success: false,
        message: "Parent not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Children retrieved successfully",
      data: parent.children
    });
  } catch (error) {
    console.error("Error fetching children:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch children",
      error: error.message
    });
  }
};

// Create a new parent
export const createParent = async (req, res) => {
  try {
    const parentData = req.body;
    
    // Check if parent already exists with same email
    const existingParent = await Parent.findOne({ email: parentData.email });
    if (existingParent) {
      return res.status(400).json({
        success: false,
        message: "Parent already exists with this email"
      });
    }
    
    // Validate children if provided
    if (parentData.children && parentData.children.length > 0) {
      for (const child of parentData.children) {
        const student = await Student.findById(child.student_id);
        if (!student) {
          return res.status(400).json({
            success: false,
            message: `Student with ID ${child.student_id} not found`
          });
        }
      }
    }
    
    const parent = new Parent(parentData);
    await parent.save();
    
    res.status(201).json({
      success: true,
      message: "Parent created successfully",
      data: parent
    });
  } catch (error) {
    console.error("Error creating parent:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create parent",
      error: error.message
    });
  }
};

// Update parent
export const updateParent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Validate children if being updated
    if (updateData.children && updateData.children.length > 0) {
      for (const child of updateData.children) {
        const student = await Student.findById(child.student_id);
        if (!student) {
          return res.status(400).json({
            success: false,
            message: `Student with ID ${child.student_id} not found`
          });
        }
      }
    }
    
    const parent = await Parent.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('children.student_id', 'firstname lastname student_id class section');
    
    if (!parent) {
      return res.status(404).json({
        success: false,
        message: "Parent not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Parent updated successfully",
      data: parent
    });
  } catch (error) {
    console.error("Error updating parent:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update parent",
      error: error.message
    });
  }
};

// Delete parent
export const deleteParent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const parent = await Parent.findByIdAndDelete(id);
    
    if (!parent) {
      return res.status(404).json({
        success: false,
        message: "Parent not found"
      });
    }
    
    // Optionally delete associated user account
    if (parent.user_id) {
      await User.findByIdAndDelete(parent.user_id);
    }
    
    res.status(200).json({
      success: true,
      message: "Parent deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting parent:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete parent",
      error: error.message
    });
  }
};

// Add child to parent
export const addChildToParent = async (req, res) => {
  try {
    const { id } = req.params;
    const { student_id, relationship } = req.body;
    
    if (!student_id || !relationship) {
      return res.status(400).json({
        success: false,
        message: "student_id and relationship are required"
      });
    }
    
    // Verify student exists
    const student = await Student.findById(student_id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }
    
    const parent = await Parent.findById(id);
    if (!parent) {
      return res.status(404).json({
        success: false,
        message: "Parent not found"
      });
    }
    
    // Check if child already added
    const childExists = parent.children.some(
      child => child.student_id.toString() === student_id
    );
    
    if (childExists) {
      return res.status(400).json({
        success: false,
        message: "Student already associated with this parent"
      });
    }
    
    parent.children.push({ student_id, relationship });
    await parent.save();
    
    await parent.populate('children.student_id', 'firstname lastname student_id class section');
    
    res.status(200).json({
      success: true,
      message: "Child added successfully",
      data: parent
    });
  } catch (error) {
    console.error("Error adding child:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add child",
      error: error.message
    });
  }
};

// Remove child from parent
export const removeChildFromParent = async (req, res) => {
  try {
    const { id, studentId } = req.params;
    
    const parent = await Parent.findById(id);
    if (!parent) {
      return res.status(404).json({
        success: false,
        message: "Parent not found"
      });
    }
    
    parent.children = parent.children.filter(
      child => child.student_id.toString() !== studentId
    );
    
    await parent.save();
    await parent.populate('children.student_id', 'firstname lastname student_id class section');
    
    res.status(200).json({
      success: true,
      message: "Child removed successfully",
      data: parent
    });
  } catch (error) {
    console.error("Error removing child:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove child",
      error: error.message
    });
  }
};

// Create parent account (for login)
export const createParentAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "username and password are required"
      });
    }
    
    const parent = await Parent.findById(id);
    if (!parent) {
      return res.status(404).json({
        success: false,
        message: "Parent not found"
      });
    }
    
    if (parent.user_id) {
      return res.status(400).json({
        success: false,
        message: "Parent already has a user account"
      });
    }
    
    // Check if username already exists
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already taken"
      });
    }
    
    // Create user account
    const user = new User({
      username: username.toLowerCase(),
      email: parent.email,
      phone_number: parent.phone_number,
      password,
      user_type: 'parent',
      school_id: parent.school_id,
      profile: {
        first_name: parent.firstname,
        last_name: parent.lastname
      },
      is_verified: true,
      is_active: true
    });
    
    await user.save();
    
    // Link user to parent
    parent.user_id = user._id;
    await parent.save();
    
    res.status(201).json({
      success: true,
      message: "Parent account created successfully",
      data: {
        parent,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email
        }
      }
    });
  } catch (error) {
    console.error("Error creating parent account:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create parent account",
      error: error.message
    });
  }
};
