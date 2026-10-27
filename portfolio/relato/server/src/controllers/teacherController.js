import { Teacher } from "../models/teacherModel.js";
import { School } from "../models/schoolModel.js";
import { 
  generateTeacherId, 
  calculateAge, 
  isValidEmail, 
  isValidPhone, 
  isValidPincode,
  isEmailAlreadyExists,
  isTeacherWorkingForAnotherSchool
} from "../utils/teacherUtils.js";

// Onboard a new teacher
export const onboardTeacher = async (req, res) => {
  try {
    const { 
      school_code, 
      super_admin_password, 
      firstname,
      lastname,
      displayname,
      profile,
      address,
      documents,
      joining_date
    } = req.body;

    // Validate super admin password
    if (!super_admin_password || super_admin_password !== "1997") {
      return res.status(401).json({
        success: false,
        message: "Invalid super admin password"
      });
    }

    // Validate required fields
    if (!school_code || !firstname || !lastname || !profile || !address || !joining_date) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: school_code, firstname, lastname, profile, address, joining_date"
      });
    }

    // Validate documents if provided
    if (documents && !Array.isArray(documents)) {
      return res.status(400).json({
        success: false,
        message: "Documents must be an array"
      });
    }

    // Check if school exists and is active
    const school = await School.findOne({ school_code, school_status: true });
    if (!school) {
      return res.status(400).json({
        success: false,
        message: "School not found or inactive. Teacher can only be onboarded to an active school."
      });
    }

    // Validate profile fields
    const { email_id, phone_number, dob, gender, expertised_fields, experience } = profile;
    
    if (!email_id || !phone_number || !dob || !gender || !expertised_fields || !experience) {
      return res.status(400).json({
        success: false,
        message: "Missing required profile fields: email_id, phone_number, dob, gender, expertised_fields, experience"
      });
    }

    // Validate email format
    if (!isValidEmail(email_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    // Check if email already exists
    if (await isEmailAlreadyExists(email_id)) {
      return res.status(400).json({
        success: false,
        message: "Teacher with this email already exists"
      });
    }

    // Check if teacher is already working for another school
    if (await isTeacherWorkingForAnotherSchool(email_id, school._id.toString())) {
      return res.status(400).json({
        success: false,
        message: "A teacher can only be working for 1 single school throughout entertainment"
      });
    }

    // Validate phone numbers
    if (!Array.isArray(phone_number) || phone_number.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one phone number is required"
      });
    }

    for (const phone of phone_number) {
      if (!isValidPhone(phone)) {
        return res.status(400).json({
          success: false,
          message: `Invalid phone number format: ${phone}`
        });
      }
    }

    // Validate pincode
    if (!isValidPincode(address.pincode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid pincode format"
      });
    }

    // Calculate age from DOB
    let age;
    try {
      age = calculateAge(dob);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    // Generate teacher ID
    let teacher_id;
    try {
      teacher_id = await generateTeacherId();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate teacher ID"
      });
    }

    // Create teacher data
    const teacherData = {
      firstname,
      lastname,
      displayname: displayname || `${firstname} ${lastname}`, // Use firstname + lastname as default displayname
      school_id: school._id.toString(),
      teacher_id,
      status: true, // Default status is true
      joining_date: new Date(joining_date),
      profile: {
        ...profile,
        age,
        dob: new Date(dob)
      },
      address,
      documents: documents || []
    };

    // Create new teacher
    const teacher = new Teacher(teacherData);
    await teacher.save();

    res.status(201).json({
      success: true,
      message: "Teacher onboarded successfully",
      data: teacher
    });

  } catch (error) {
    console.error("Error onboarding teacher:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Search teachers by name or teacher ID
export const searchTeachers = async (req, res) => {
  try {
    const { query, school_id, page = 1, limit = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    let searchQuery = {
      status: true,
      $or: [
        { firstname: { $regex: query, $options: 'i' } },
        { lastname: { $regex: query, $options: 'i' } },
        { displayname: { $regex: query, $options: 'i' } },
        { teacher_id: { $regex: query, $options: 'i' } }
      ]
    };

    // Filter by school if provided
    if (school_id) {
      searchQuery.school_id = school_id;
    }

    const teachers = await Teacher.find(searchQuery)
      .populate('school_id', 'school_code')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Teacher.countDocuments(searchQuery);

    res.status(200).json({
      success: true,
      message: "Search results retrieved successfully",
      data: teachers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalTeachers: total
      }
    });

  } catch (error) {
    console.error("Error searching teachers:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get teacher by ID
export const getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const teacher = await Teacher.findById(id).populate('school_id', 'school_code');
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Teacher retrieved successfully",
      data: teacher
    });

  } catch (error) {
    console.error("Error fetching teacher:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Update teacher details
export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { super_admin_password } = req.body;

    // Validate super admin password
    if (!super_admin_password || super_admin_password !== "1997") {
      return res.status(401).json({
        success: false,
        message: "Invalid super admin password"
      });
    }

    // Check if teacher exists
    const existingTeacher = await Teacher.findById(id);
    if (!existingTeacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found"
      });
    }

    // Check if teacher is active
    if (!existingTeacher.status) {
      return res.status(400).json({
        success: false,
        message: "Cannot update inactive teacher"
      });
    }

    // Remove restricted fields from update data
    const updateData = { ...req.body };
    delete updateData.super_admin_password;
    delete updateData.teacher_id; // User cannot update Teacher ID
    delete updateData.status; // User cannot update Status field

    // If DOB is being updated, recalculate age
    if (updateData.profile && updateData.profile.dob) {
      try {
        updateData.profile.age = calculateAge(updateData.profile.dob);
        updateData.profile.dob = new Date(updateData.profile.dob);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
    }

    // If email is being updated, check for duplicates
    if (updateData.profile && updateData.profile.email_id) {
      if (!isValidEmail(updateData.profile.email_id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format"
        });
      }

      if (await isEmailAlreadyExists(updateData.profile.email_id, id)) {
        return res.status(400).json({
          success: false,
          message: "Teacher with this email already exists"
        });
      }
    }

    // If phone numbers are being updated, validate them
    if (updateData.profile && updateData.profile.phone_number) {
      if (!Array.isArray(updateData.profile.phone_number) || updateData.profile.phone_number.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one phone number is required"
        });
      }

      for (const phone of updateData.profile.phone_number) {
        if (!isValidPhone(phone)) {
          return res.status(400).json({
            success: false,
            message: `Invalid phone number format: ${phone}`
          });
        }
      }
    }

    // If pincode is being updated, validate it
    if (updateData.address && updateData.address.pincode) {
      if (!isValidPincode(updateData.address.pincode)) {
        return res.status(400).json({
          success: false,
          message: "Invalid pincode format"
        });
      }
    }

    const teacher = await Teacher.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('school_id', 'school_code');

    res.status(200).json({
      success: true,
      message: "Teacher updated successfully",
      data: teacher
    });

  } catch (error) {
    console.error("Error updating teacher:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Disable a teacher
export const disableTeacher = async (req, res) => {
  try {
    const { teacher_id } = req.params;
    const { super_admin_password } = req.body;

    // Validate super admin password
    if (!super_admin_password || super_admin_password !== "1997") {
      return res.status(401).json({
        success: false,
        message: "Invalid super admin password"
      });
    }

    // Find teacher by teacher_id
    const teacher = await Teacher.findOne({ teacher_id });
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found"
      });
    }

    // Check if teacher is active
    if (!teacher.status) {
      return res.status(400).json({
        success: false,
        message: "Teacher is already inactive"
      });
    }

    // Disable the teacher
    teacher.status = false;
    await teacher.save();

    res.status(200).json({
      success: true,
      message: "Teacher disabled successfully",
      data: teacher
    });

  } catch (error) {
    console.error("Error disabling teacher:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get all teachers with optional filtering
export const getAllTeachers = async (req, res) => {
  try {
    const { school_id, status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (school_id) {
      query.school_id = school_id;
    }
    if (status !== undefined) {
      query.status = status === 'true';
    }

    const teachers = await Teacher.find(query)
      .populate('school_id', 'school_code')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Teacher.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Teachers retrieved successfully",
      data: teachers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalTeachers: total
      }
    });

  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// Get teacher statistics
export const getTeacherStats = async (req, res) => {
  try {
    const totalTeachers = await Teacher.countDocuments();
    const activeTeachers = await Teacher.countDocuments({ status: true });
    const inactiveTeachers = await Teacher.countDocuments({ status: false });
    
    // Get teachers by school
    const teachersBySchool = await Teacher.aggregate([
      {
        $group: {
          _id: "$school_id",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "schools",
          localField: "_id",
          foreignField: "_id",
          as: "school"
        }
      },
      {
        $unwind: "$school"
      },
      {
        $project: {
          school_code: "$school.school_code",
          teacher_count: "$count"
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: "Teacher statistics retrieved successfully",
      data: {
        total: totalTeachers,
        active: activeTeachers,
        inactive: inactiveTeachers,
        bySchool: teachersBySchool
      }
    });

  } catch (error) {
    console.error("Error fetching teacher statistics:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
