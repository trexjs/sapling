import { Teacher } from '../models/teacherModel.js';
import { Student } from '../models/studentModel.js';
import { School } from '../models/schoolModel.js';

// Map teachers to school
export const mapTeachersToSchool = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const { teacherIds } = req.body;

    if (!teacherIds || !Array.isArray(teacherIds) || teacherIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Teacher IDs are required'
      });
    }

    // Verify school exists
    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    // Update teachers with school_id
    const updateResult = await Teacher.updateMany(
      { _id: { $in: teacherIds } },
      { $set: { school_id: schoolId } }
    );

    res.json({
      success: true,
      message: `${updateResult.modifiedCount} teachers mapped to school successfully`,
      data: {
        schoolId,
        mappedCount: updateResult.modifiedCount
      }
    });
  } catch (error) {
    console.error('Error mapping teachers to school:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to map teachers to school',
      error: error.message
    });
  }
};

// Map students to school
export const mapStudentsToSchool = async (req, res) => {
  try {
    const { schoolId } = req.params;
    const { studentIds } = req.body;

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Student IDs are required'
      });
    }

    // Verify school exists
    const school = await School.findById(schoolId);
    if (!school) {
      return res.status(404).json({
        success: false,
        message: 'School not found'
      });
    }

    // Update students with school_id
    const updateResult = await Student.updateMany(
      { _id: { $in: studentIds } },
      { $set: { school_id: schoolId } }
    );

    res.json({
      success: true,
      message: `${updateResult.modifiedCount} students mapped to school successfully`,
      data: {
        schoolId,
        mappedCount: updateResult.modifiedCount
      }
    });
  } catch (error) {
    console.error('Error mapping students to school:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to map students to school',
      error: error.message
    });
  }
};

// Get teachers for a school
export const getSchoolTeachers = async (req, res) => {
  try {
    const { schoolId } = req.params;

    const teachers = await Teacher.find({ school_id: schoolId })
      .select('-password')
      .populate('profile');

    res.json({
      success: true,
      data: teachers
    });
  } catch (error) {
    console.error('Error fetching school teachers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch school teachers',
      error: error.message
    });
  }
};

// Get students for a school
export const getSchoolStudents = async (req, res) => {
  try {
    const { schoolId } = req.params;

    const students = await Student.find({ school_id: schoolId })
      .select('-password')
      .populate('profile');

    res.json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error('Error fetching school students:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch school students',
      error: error.message
    });
  }
};

// Remove teacher from school
export const removeTeacherFromSchool = async (req, res) => {
  try {
    const { schoolId, teacherId } = req.params;

    const teacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { $unset: { school_id: 1 } },
      { new: true }
    );

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.json({
      success: true,
      message: 'Teacher removed from school successfully'
    });
  } catch (error) {
    console.error('Error removing teacher from school:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove teacher from school',
      error: error.message
    });
  }
};

// Remove student from school
export const removeStudentFromSchool = async (req, res) => {
  try {
    const { schoolId, studentId } = req.params;

    const student = await Student.findByIdAndUpdate(
      studentId,
      { $unset: { school_id: 1 } },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      message: 'Student removed from school successfully'
    });
  } catch (error) {
    console.error('Error removing student from school:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove student from school',
      error: error.message
    });
  }
};
