import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  // Primary identifiers
  school_id: {
    type: String,
    required: true
  },
  teacher_id: {
    type: String,
    required: true
  },
  student_id: {
    type: String,
    required: true
  },
  
  // Date information
  date: {
    type: Date,
    required: true
  },
  year: {
    type: Number,
    required: true,
    index: true
  },
  month: {
    type: String,
    required: true,
    index: true
  },
  day: {
    type: Number,
    required: true
  },
  
  // Attendance status
  status: {
    type: String,
    enum: ["present", "absent", "late", "excused", "half_day"],
    required: true,
    default: "absent"
  },
  
  // Additional attendance details
  details: {
    check_in_time: { type: Date },
    check_out_time: { type: Date },
    remarks: { type: String, default: "" },
    marked_by: { type: String }, // teacher_id who marked the attendance
    marked_at: { type: Date, default: Date.now },
    is_retroactive: { type: Boolean, default: false },
    approval_status: { 
      type: String, 
      enum: ["pending", "approved", "rejected"], 
      default: "approved" 
    }
  },
  
  // Metadata
  meta: {
    is_working_day: { type: Boolean, default: true },
    is_holiday: { type: Boolean, default: false },
    is_frozen: { type: Boolean, default: false },
    academic_year: { type: String },
    class: { type: String },
    section: { type: String }
  }

}, { 
  strict: false,
  timestamps: true 
});

// Compound indexes for better query performance
attendanceSchema.index({ school_id: 1, year: 1, month: 1 });
attendanceSchema.index({ school_id: 1, student_id: 1, date: 1 });
attendanceSchema.index({ school_id: 1, teacher_id: 1, date: 1 });
attendanceSchema.index({ school_id: 1, date: 1, status: 1 });
attendanceSchema.index({ school_id: 1, year: 1, month: 1, day: 1 });

// Unique constraint to prevent duplicate attendance records
attendanceSchema.index({ 
  school_id: 1, 
  student_id: 1, 
  date: 1 
}, { unique: true });

// Pre-save middleware to set date-related fields
attendanceSchema.pre('save', function(next) {
  if (this.date) {
    const date = new Date(this.date);
    this.year = date.getFullYear();
    this.month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    this.day = date.getDate();
  }
  next();
});

// Static method to get attendance for a specific month
attendanceSchema.statics.getMonthlyAttendance = async function(schoolId, year, month, studentId = null) {
  const query = { school_id: schoolId, year, month };
  if (studentId) {
    query.student_id = studentId;
  }
  
  return await this.find(query).sort({ day: 1, student_id: 1 });
};

// Static method to get attendance summary for a student
attendanceSchema.statics.getStudentAttendanceSummary = async function(schoolId, studentId, year, month = null) {
  const query = { school_id: schoolId, student_id: studentId, year };
  if (month) {
    query.month = month;
  }
  
  const attendance = await this.find(query);
  
  const summary = {
    total_days: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    half_day: 0,
    attendance_percentage: 0
  };
  
  attendance.forEach(record => {
    if (record.meta.is_working_day && !record.meta.is_holiday) {
      summary.total_days++;
      summary[record.status]++;
    }
  });
  
  if (summary.total_days > 0) {
    summary.attendance_percentage = Math.round(((summary.present + summary.late + summary.half_day) / summary.total_days) * 100);
  }
  
  return summary;
};

// Static method to bulk update attendance
attendanceSchema.statics.bulkUpdateAttendance = async function(attendanceData) {
  const operations = attendanceData.map(data => ({
    updateOne: {
      filter: { 
        school_id: data.school_id, 
        student_id: data.student_id, 
        date: data.date 
      },
      update: {
        $set: {
          status: data.status,
          teacher_id: data.teacher_id,
          'details.marked_by': data.teacher_id,
          'details.marked_at': new Date(),
          'details.remarks': data.remarks || '',
          'details.is_retroactive': data.is_retroactive || false
        }
      },
      upsert: true
    }
  }));
  
  return await this.bulkWrite(operations);
};

// Instance method to check if attendance can be modified
attendanceSchema.methods.canBeModified = function(config) {
  if (this.meta.is_frozen) return false;
  if (config && config.isAttendanceFrozen(this.date)) return false;
  return true;
};

// Instance method to get formatted attendance record
attendanceSchema.methods.toFormattedRecord = function() {
  return {
    id: this.student_id,
    status: this.status,
    check_in_time: this.details.check_in_time,
    check_out_time: this.details.check_out_time,
    remarks: this.details.remarks,
    marked_at: this.details.marked_at
  };
};

export const Attendance = mongoose.model("Attendance", attendanceSchema);
