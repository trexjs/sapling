import { School } from "../models/schoolModel.js";

// Middleware to verify super admin password
const verifySuperAdminPassword = (req, res, next) => {
  const { super_admin_password } = req.body;
  
  if (!super_admin_password || super_admin_password !== "1997") {
    return res.status(401).json({
      success: false,
      message: "Invalid super admin password"
    });
  }
  
  next();
};

// Create a new school
export const createSchool = async (req, res) => {
  try {
    const { school_code, super_admin_password } = req.body;

    // Verify super admin password
    if (!super_admin_password || super_admin_password !== "1997") {
      return res.status(401).json({
        success: false,
        message: "Invalid super admin password"
      });
    }

    // Check if school with this code already exists
    const existingSchool = await School.findOne({ school_code });
    if (existingSchool) {
      return res.status(400).json({
        success: false,
        message: "School with this code already exists"
      });
    }

    // Create new school with default status as true
    const schoolData = {
      ...req.body,
      school_status: true
    };

    const school = new School(schoolData);
    await school.save();

    res.status(201).json({
      success: true,
      message: "School created successfully",
      data: school
    });
  } catch (error) {
    console.error("Error creating school:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get all schools
export const getAllSchools = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status !== undefined) {
      query.school_status = status === 'true';
    }

    const schools = await School.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await School.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Schools retrieved successfully",
      data: schools,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalSchools: total
      }
    });
  } catch (error) {
    console.error("Error fetching schools:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get school by ID
export const getSchoolById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const school = await School.findById(id);
    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "School retrieved successfully",
      data: school
    });
  } catch (error) {
    console.error("Error fetching school:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get school by school code
export const getSchoolByCode = async (req, res) => {
  try {
    const { school_code } = req.params;
    
    const school = await School.findOne({ school_code });
    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "School retrieved successfully",
      data: school
    });
  } catch (error) {
    console.error("Error fetching school:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Update school by ID
export const updateSchoolById = async (req, res) => {
  try {
    const { id } = req.params;
    const { super_admin_password } = req.body;

    // Verify super admin password
    if (!super_admin_password || super_admin_password !== "1997") {
      return res.status(401).json({
        success: false,
        message: "Invalid super admin password"
      });
    }

    // Check if school exists and is active
    const existingSchool = await School.findById(id);
    if (!existingSchool) {
      return res.status(404).json({
        success: false,
        message: "School not found"
      });
    }

    if (!existingSchool.school_status) {
      return res.status(400).json({
        success: false,
        message: "Cannot update inactive school"
      });
    }

    // Remove super_admin_password from update data
    const updateData = { ...req.body };
    delete updateData.super_admin_password;

    const school = await School.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "School updated successfully",
      data: school
    });
  } catch (error) {
    console.error("Error updating school:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Update school by school code
export const updateSchoolByCode = async (req, res) => {
  try {
    const { school_code } = req.params;
    const { super_admin_password } = req.body;

    // Verify super admin password
    if (!super_admin_password || super_admin_password !== "1997") {
      return res.status(401).json({
        success: false,
        message: "Invalid super admin password"
      });
    }

    // Check if school exists and is active
    const existingSchool = await School.findOne({ school_code });
    if (!existingSchool) {
      return res.status(404).json({
        success: false,
        message: "School not found"
      });
    }

    if (!existingSchool.school_status) {
      return res.status(400).json({
        success: false,
        message: "Cannot update inactive school"
      });
    }

    // Remove super_admin_password from update data
    const updateData = { ...req.body };
    delete updateData.super_admin_password;

    const school = await School.findOneAndUpdate(
      { school_code },
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "School updated successfully",
      data: school
    });
  } catch (error) {
    console.error("Error updating school:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Deactivate school (soft delete)
export const deactivateSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const { super_admin_password } = req.body;

    // Verify super admin password
    if (!super_admin_password || super_admin_password !== "1997") {
      return res.status(401).json({
        success: false,
        message: "Invalid super admin password"
      });
    }

    const school = await School.findByIdAndUpdate(
      id,
      { school_status: false },
      { new: true }
    );

    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "School deactivated successfully",
      data: school
    });
  } catch (error) {
    console.error("Error deactivating school:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Activate school
export const activateSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const { super_admin_password } = req.body;

    // Verify super admin password
    if (!super_admin_password || super_admin_password !== "1997") {
      return res.status(401).json({
        success: false,
        message: "Invalid super admin password"
      });
    }

    const school = await School.findByIdAndUpdate(
      id,
      { school_status: true },
      { new: true }
    );

    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "School activated successfully",
      data: school
    });
  } catch (error) {
    console.error("Error activating school:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Delete school permanently
export const deleteSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const { super_admin_password } = req.body;

    // Verify super admin password
    if (!super_admin_password || super_admin_password !== "1997") {
      return res.status(401).json({
        success: false,
        message: "Invalid super admin password"
      });
    }

    const school = await School.findByIdAndDelete(id);

    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "School deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting school:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Search schools
export const searchSchools = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    const searchRegex = new RegExp(query, 'i');
    const schools = await School.find({
      $or: [
        { school_code: searchRegex },
        { 'contact_details.email_id': searchRegex },
        { 'address.state': searchRegex },
        { 'address.pincode': searchRegex }
      ],
      school_status: true
    })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 });

    const total = await School.countDocuments({
      $or: [
        { school_code: searchRegex },
        { 'contact_details.email_id': searchRegex },
        { 'address.state': searchRegex },
        { 'address.pincode': searchRegex }
      ],
      school_status: true
    });

    res.status(200).json({
      success: true,
      message: "Search results retrieved successfully",
      data: schools,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalSchools: total
      }
    });
  } catch (error) {
    console.error("Error searching schools:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get school ID by school code (helper endpoint)
export const getSchoolIdByCode = async (req, res) => {
  try {
    const { school_code } = req.params;
    
    const school = await School.findOne({ school_code }).select('_id school_code');
    if (!school) {
      return res.status(404).json({
        success: false,
        message: "School not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "School ID retrieved successfully",
      data: {
        school_id: school._id,
        school_code: school.school_code
      }
    });
  } catch (error) {
    console.error("Error fetching school ID:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get school statistics
export const getSchoolStats = async (req, res) => {
  try {
    const totalSchools = await School.countDocuments();
    const activeSchools = await School.countDocuments({ school_status: true });
    const inactiveSchools = await School.countDocuments({ school_status: false });
    
    // Get schools by type
    const daySchools = await School.countDocuments({ school_type: "day_schooler" });
    const boardingSchools = await School.countDocuments({ school_type: "boarding" });

    res.status(200).json({
      success: true,
      message: "School statistics retrieved successfully",
      data: {
        total: totalSchools,
        active: activeSchools,
        inactive: inactiveSchools,
        byType: {
          day_schooler: daySchools,
          boarding: boardingSchools
        }
      }
    });
  } catch (error) {
    console.error("Error fetching school statistics:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
