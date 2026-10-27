import mongoose from "mongoose";

const attendanceConfigSchema = new mongoose.Schema({
  school_id: {
    type: String,
    required: true
  },
  
  // Holidays configuration
  holidays: {
    type: Map,
    of: [{
      date: { type: String, required: true }, // Format: "DD-MM" or "DD-MM-YYYY"
      name: { type: String, required: true },
      type: { 
        type: String, 
        enum: ["national", "regional", "school_specific"], 
        default: "national" 
      },
      recurring: { type: Boolean, default: false } // For annual holidays
    }],
    default: new Map()
  },
  
  // Frozen time configuration for attendance updates
  frozen_time: {
    hour: { 
      type: Number, 
      required: true, 
      min: 0, 
      max: 23,
      default: 15 // 3 PM
    },
    minute: { 
      type: Number, 
      required: true, 
      min: 0, 
      max: 59,
      default: 0
    },
    period: { 
      type: String, 
      enum: ["AM", "PM"], 
      default: "PM" 
    },
    enabled: { type: Boolean, default: true }
  },
  
  // Working days configuration (1=Monday, 7=Sunday)
  working_days: {
    type: [Number],
    default: [1, 2, 3, 4, 5], // Monday to Friday
    validate: {
      validator: function(days) {
        return days.every(day => day >= 1 && day <= 7);
      },
      message: 'Working days must be between 1 (Monday) and 7 (Sunday)'
    }
  },
  
  // Academic year configuration
  academic_year: {
    start_month: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 12,
      default: 4 // April
    },
    end_month: { 
      type: Number, 
      required: true, 
      min: 1, 
      max: 12,
      default: 3 // March
    }
  },
  
  // Additional settings
  settings: {
    auto_mark_absent: { type: Boolean, default: false },
    allow_retroactive_updates: { type: Boolean, default: true },
    require_teacher_approval: { type: Boolean, default: false },
    max_retroactive_days: { type: Number, default: 7 }
  }

}, { 
  strict: false,
  timestamps: true 
});

// Indexes for better query performance
attendanceConfigSchema.index({ school_id: 1 });
attendanceConfigSchema.index({ 'frozen_time.enabled': 1 });

// Method to check if attendance is frozen for a given date
attendanceConfigSchema.methods.isAttendanceFrozen = function(date = new Date()) {
  if (!this.frozen_time.enabled) return false;
  
  const now = new Date();
  const targetDate = new Date(date);
  
  // If checking for a different date, it's not frozen
  if (now.toDateString() !== targetDate.toDateString()) {
    return false;
  }
  
  // Check if current time is past frozen time
  const frozenHour = this.frozen_time.period === 'PM' && this.frozen_time.hour !== 12 
    ? this.frozen_time.hour + 12 
    : this.frozen_time.period === 'AM' && this.frozen_time.hour === 12 
    ? 0 
    : this.frozen_time.hour;
  
  const frozenTime = new Date();
  frozenTime.setHours(frozenHour, this.frozen_time.minute, 0, 0);
  
  return now >= frozenTime;
};

// Method to get holidays for a specific year
attendanceConfigSchema.methods.getHolidaysForYear = function(year) {
  const yearHolidays = [];
  
  for (const [month, holidays] of this.holidays) {
    holidays.forEach(holiday => {
      if (holiday.recurring || holiday.date.includes(year.toString())) {
        yearHolidays.push({
          ...holiday.toObject(),
          month: month,
          year: year
        });
      }
    });
  }
  
  return yearHolidays;
};

// Method to check if a date is a holiday
attendanceConfigSchema.methods.isHoliday = function(date) {
  const targetDate = new Date(date);
  const month = targetDate.toLocaleString('default', { month: 'short' }).toUpperCase();
  const day = targetDate.getDate().toString();
  const year = targetDate.getFullYear();
  
  const monthHolidays = this.holidays.get(month) || [];
  
  return monthHolidays.some(holiday => {
    if (holiday.recurring) {
      return holiday.date === day;
    } else {
      return holiday.date === `${day}-${month}-${year}` || holiday.date === `${day}-${month}`;
    }
  });
};

// Method to check if a date is a working day
attendanceConfigSchema.methods.isWorkingDay = function(date) {
  const targetDate = new Date(date);
  const dayOfWeek = targetDate.getDay() === 0 ? 7 : targetDate.getDay(); // Convert Sunday from 0 to 7
  
  return this.working_days.includes(dayOfWeek) && !this.isHoliday(date);
};

export const AttendanceConfig = mongoose.model("AttendanceConfig", attendanceConfigSchema);
