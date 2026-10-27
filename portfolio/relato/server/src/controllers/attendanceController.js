import { Attendance } from "../models/attendanceModel.js";
import { AttendanceConfig } from "../models/attendanceConfigModel.js";
import { Student } from "../models/studentModel.js";
import { Teacher } from "../models/teacherModel.js";

// Simple test endpoint to check if the controller is working
export const testAttendanceConfig = async (req, res) => {
  try {
    console.log('Test endpoint called');
    res.json({
      success: true,
      message: "Attendance config test endpoint working",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({
      success: false,
      message: "Test endpoint error",
      error: error.message
    });
  }
};

// Get attendance configuration for a school
export const getAttendanceConfig = async (req, res) => {
  try {
    const school_id = req.params.school_id || req.query.school_id;
    
    let config = await AttendanceConfig.findOne({ school_id });
    
    if (!config) {
      // Create default configuration if none exists
      config = new AttendanceConfig({
        school_id,
        holidays: {}, // Use empty object instead of Map
        frozen_time: {
          hour: 15,
          minute: 0,
          period: "PM",
          enabled: true
        },
        working_days: [1, 2, 3, 4, 5],
        academic_year: {
          start_month: 4,
          end_month: 3
        },
        settings: {
          auto_mark_absent: false,
          allow_retroactive_updates: true,
          require_teacher_approval: false,
          max_retroactive_days: 7
        }
      });
      
      await config.save();
    }
    
    res.status(200).json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Error in getAttendanceConfig:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching attendance configuration",
      error: error.message
    });
  }
};

// Update attendance configuration
export const updateAttendanceConfig = async (req, res) => {
  try {
    const school_id = req.params.school_id || req.query.school_id;
    const updateData = req.body;
    
    const config = await AttendanceConfig.findOneAndUpdate(
      { school_id },
      updateData,
      { new: true, upsert: true }
    );
    
    res.status(200).json({
      success: true,
      message: "Attendance configuration updated successfully",
      data: config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating attendance configuration",
      error: error.message
    });
  }
};

// Get attendance for a specific student
export const getStudentAttendance = async (req, res) => {
  try {
    const { type, student_id, school_id, start_date, end_date } = req.query;
    const { year, month } = req.query;
    
    // Support both old (month-based) and new (date range) queries
    if (start_date && end_date && student_id && school_id) {
      // New date range query
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      
      const attendanceRecords = await Attendance.find({
        school_id,
        student_id,
        date: {
          $gte: startDate,
          $lte: endDate
        }
      }).sort({ date: -1 });
      
      const formattedRecords = attendanceRecords.map(record => ({
        date: record.date,
        status: record.status,
        remarks: record.details?.remarks || record.remarks || '',
        teacher_id: record.teacher_id,
        marked_at: record.details?.marked_at || record.createdAt
      }));
      
      return res.status(200).json({
        success: true,
        data: {
          student_id,
          school_id,
          start_date: startDate,
          end_date: endDate,
          attendance: formattedRecords
        }
      });
    }
    
    // Old month-based query (keep for backward compatibility)
    const { school_id: bodySchoolId, teacher_id } = req.body;
    
    if (!bodySchoolId || !teacher_id) {
      return res.status(400).json({
        success: false,
        message: "School ID and Teacher ID are required in request body, or use query params: student_id, school_id, start_date, end_date"
      });
    }
    
    if (type !== "student") {
      return res.status(400).json({
        success: false,
        message: "Invalid type. Only 'student' type is supported"
      });
    }
    
    const targetYear = year || new Date().getFullYear();
    const targetMonth = month || new Date().toLocaleString('default', { month: 'short' }).toUpperCase();
    
    // Get attendance configuration
    const config = await AttendanceConfig.findOne({ school_id });
    if (!config) {
      return res.status(404).json({
        success: false,
        message: "Attendance configuration not found for this school"
      });
    }
    
    // Get attendance records
    const attendanceRecords = await Attendance.getMonthlyAttendance(
      school_id, 
      targetYear, 
      targetMonth, 
      student_id
    );
    
    // Get holidays for the year
    const holidays = config.getHolidaysForYear(targetYear);
    const monthHolidays = holidays.filter(h => h.month === targetMonth);
    
    // Calculate working days and non-working days
    const totalDays = new Date(targetYear, new Date(`${targetMonth} 1, ${targetYear}`).getMonth() + 1, 0).getDate();
    const workingDays = [];
    const nonWorkingDays = [];
    
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(targetYear, new Date(`${targetMonth} 1, ${targetYear}`).getMonth(), day);
      const isWorkingDay = config.isWorkingDay(date);
      const isHoliday = config.isHoliday(date);
      
      if (isWorkingDay && !isHoliday) {
        workingDays.push(day);
      } else {
        const dayInfo = { day };
        if (!isWorkingDay) dayInfo.weekend = true;
        if (isHoliday) {
          const holiday = monthHolidays.find(h => h.date === day.toString());
          dayInfo.holiday = holiday ? holiday.name : "Holiday";
        }
        dayInfo.remarks = "";
        nonWorkingDays.push(dayInfo);
      }
    }
    
    // Format attendance data
    const dates = {};
    attendanceRecords.forEach(record => {
      if (!dates[record.day]) {
        dates[record.day] = [];
      }
      dates[record.day].push(record.toFormattedRecord());
    });
    
    // Check if attendance is frozen
    const isFrozen = config.isAttendanceFrozen();
    
    const response = {
      meta: {
        total_days: totalDays,
        today: new Date().getDate(),
        working_days: workingDays,
        non_working_days: nonWorkingDays,
        frozen: isFrozen
      },
      dates
    };
    
    res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching student attendance",
      error: error.message
    });
  }
};

// Mark attendance for students
export const markAttendance = async (req, res) => {
  try {
    const { school_id, teacher_id, date, students } = req.body;
    
    if (!school_id || !teacher_id || !date || !students || !Array.isArray(students)) {
      return res.status(400).json({
        success: false,
        message: "School ID, Teacher ID, date, and students array are required"
      });
    }
    
    // Get attendance configuration
    const config = await AttendanceConfig.findOne({ school_id });
    if (!config) {
      return res.status(404).json({
        success: false,
        message: "Attendance configuration not found for this school"
      });
    }
    
    // Check if attendance is frozen
    if (config.isAttendanceFrozen(new Date(date))) {
      return res.status(403).json({
        success: false,
        message: "Attendance cannot be marked after frozen time"
      });
    }
    
    // Validate teacher - TEMPORARILY DISABLED
    // const teacher = await Teacher.findOne({ teacher_id, school_id, status: true });
    // if (!teacher) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Teacher not found or inactive"
    //   });
    // }
    
    // Prepare attendance data
    const attendanceData = students.map(student => ({
      school_id,
      teacher_id,
      student_id: student.id,
      date: new Date(date),
      status: student.status || "absent",
      remarks: student.remarks || "",
      is_retroactive: student.is_retroactive || false
    }));
    
    // Bulk update attendance (upsert: create if not exists, update if exists)
    const result = await Attendance.bulkUpdateAttendance(attendanceData);
    
    const message = result.upsertedCount > 0 
      ? `Attendance saved successfully (${result.upsertedCount} new, ${result.modifiedCount} updated)`
      : `Attendance updated successfully (${result.modifiedCount} records)`;
    
    res.status(200).json({
      success: true,
      message: message,
      data: {
        matched: result.matchedCount,
        modified: result.modifiedCount,
        upserted: result.upsertedCount,
        total: students.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error marking attendance",
      error: error.message
    });
  }
};

// Get attendance summary for a student
export const getAttendanceSummary = async (req, res) => {
  try {
    const { school_id, student_id } = req.params;
    const { year, month } = req.query;
    
    const targetYear = year || new Date().getFullYear();
    
    const summary = await Attendance.getStudentAttendanceSummary(
      school_id,
      student_id,
      targetYear,
      month
    );
    
    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching attendance summary",
      error: error.message
    });
  }
};

// Get class attendance for a specific date
export const getClassAttendance = async (req, res) => {
  try {
    const { school_id, teacher_id } = req.params;
    const { date, class_name, section } = req.query;
    
    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required"
      });
    }
    
    // Parse date and create date range for the entire day
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
    
    console.log(`Searching attendance for date range: ${startOfDay} to ${endOfDay}`);
    console.log(`School: ${school_id}, Class: ${class_name}, Section: ${section}`);
    
    // Get all students for the school first
    // Note: Many students might not have class/section set, so we'll filter attendance records instead
    const students = await Student.find({ 'school_id': school_id });
    console.log(`Found ${students.length} total students in school`);
    
    // Debug: If no students found, check if any students exist for this school
    if (students.length === 0) {
      const allSchoolStudents = await Student.find({ school_id }).limit(5);
      console.log(`Total students in school: ${allSchoolStudents.length}`);
      if (allSchoolStudents.length > 0) {
        console.log('Sample student:', JSON.stringify({
          _id: allSchoolStudents[0]._id,
          school_id: allSchoolStudents[0].school_id,
          class: allSchoolStudents[0].class,
          section: allSchoolStudents[0].section,
          name: allSchoolStudents[0].displayname || allSchoolStudents[0].firstname
        }, null, 2));
      }
      
      // Also check if we can find the student from the attendance record
      const attendanceStudentIds = await Attendance.distinct('student_id', { school_id, date: { $gte: startOfDay, $lte: endOfDay } });
      console.log(`Students with attendance today: ${attendanceStudentIds.length}`);
      if (attendanceStudentIds.length > 0) {
        const attendanceStudent = await Student.findById(attendanceStudentIds[0]);
        if (attendanceStudent) {
          console.log('Student from attendance record:', JSON.stringify({
            _id: attendanceStudent._id,
            school_id: attendanceStudent.school_id,
            class: attendanceStudent.class,
            section: attendanceStudent.section,
            name: attendanceStudent.displayname || attendanceStudent.firstname
          }, null, 2));
        }
      }
    }
    
    // Get attendance for all students on the specific date (using date range to handle timezone issues)
    const attendanceRecords = await Attendance.find({
      school_id,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });
    
    console.log(`Found ${attendanceRecords.length} attendance records for this date`);
    
    // Debug: Log first attendance record if exists
    if (attendanceRecords.length > 0) {
      console.log('Sample attendance record:', JSON.stringify(attendanceRecords[0], null, 2));
    } else {
      console.log('No attendance records found. Checking all attendance for this school...');
      const allSchoolAttendance = await Attendance.find({ school_id }).limit(5);
      console.log(`Total attendance records for school: ${allSchoolAttendance.length}`);
      if (allSchoolAttendance.length > 0) {
        console.log('Sample record from school:', JSON.stringify(allSchoolAttendance[0], null, 2));
      }
    }
    
    // Format response - return all attendance records for the date
    // Note: Since students don't have class/section populated, we return all records
    const attendanceData = attendanceRecords.map(record => {
      const student = students.find(s => s._id.toString() === record.student_id);
      return {
        student_id: record.student_id,
        student_name: student ? (student.displayname || student.profile?.name || `${student.firstname} ${student.lastname}`) : 'Unknown',
        status: record.status,
        remarks: record.details?.remarks || record.remarks || '',
        marked_at: record.details?.marked_at || record.createdAt,
        // Include student class/section if available
        class: student?.class || '',
        section: student?.section || ''
      };
    });
    
    console.log(`Returning ${attendanceData.length} attendance records`);
    
    res.status(200).json({
      success: true,
      data: {
        date: targetDate,
        class: class_name,
        section: section,
        attendance: attendanceData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching class attendance",
      error: error.message
    });
  }
};

// Update individual attendance record
export const updateAttendanceRecord = async (req, res) => {
  try {
    const { school_id, student_id, date } = req.params;
    const { status, remarks, teacher_id } = req.body;
    
    if (!status || !teacher_id) {
      return res.status(400).json({
        success: false,
        message: "Status and Teacher ID are required"
      });
    }
    
    // Get attendance configuration
    const config = await AttendanceConfig.findOne({ school_id });
    if (!config) {
      return res.status(404).json({
        success: false,
        message: "Attendance configuration not found"
      });
    }
    
    // Check if attendance can be modified
    const targetDate = new Date(date);
    if (config.isAttendanceFrozen(targetDate)) {
      return res.status(403).json({
        success: false,
        message: "Attendance cannot be modified after frozen time"
      });
    }
    
    // Update attendance record
    const attendance = await Attendance.findOneAndUpdate(
      { school_id, student_id, date: targetDate },
      {
        status,
        teacher_id,
        'details.remarks': remarks || "",
        'details.marked_by': teacher_id,
        'details.marked_at': new Date()
      },
      { new: true, upsert: true }
    );
    
    res.status(200).json({
      success: true,
      message: "Attendance record updated successfully",
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating attendance record",
      error: error.message
    });
  }
};

// Delete attendance record
export const deleteAttendanceRecord = async (req, res) => {
  try {
    const { school_id, student_id, date } = req.params;
    
    // Get attendance configuration
    const config = await AttendanceConfig.findOne({ school_id });
    if (!config) {
      return res.status(404).json({
        success: false,
        message: "Attendance configuration not found"
      });
    }
    
    // Check if attendance can be modified
    const targetDate = new Date(date);
    if (config.isAttendanceFrozen(targetDate)) {
      return res.status(403).json({
        success: false,
        message: "Attendance cannot be deleted after frozen time"
      });
    }
    
    const attendance = await Attendance.findOneAndDelete({
      school_id,
      student_id,
      date: targetDate
    });
    
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found"
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Attendance record deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting attendance record",
      error: error.message
    });
  }
};
