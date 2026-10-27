import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  // Direct school and teacher references
  school_id: { type: String, default: "" },
  teacher_id: { type: String, default: "" },
  class: { type: String, default: "" },
  section: { type: String, default: "" },
  
  // Basic student information
  firstname: { 
    type: String, 
    required: true,
    trim: true
  },
  lastname: { 
    type: String, 
    required: true,
    trim: true
  },
  displayname: { 
    type: String, 
    required: false,
    trim: true
  },
  
  // Profile information
  profile: {
    name: { type: String, default: "" },
    blood_group: { 
      type: String, 
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", ""],
      default: "" 
    },
    photo: { type: String, default: "" },
    email_id: { type: String, default: "" },
    age: { type: String, default: "" },
    gender: { type: String, default: "" }
  },
  
  // Guardian details
  guardian_details: {
    name: { type: String, default: "" },
    phone_number: [{ type: String }],
    relationship: [{ type: String }],
    address: {
      site: { type: String, default: "" },
      landmark: { type: String, default: "" },
      pincode: { type: String, default: "" },
      state: { type: String, default: "" }
    }
  },
  
  // Class teacher
  class_teacher: { type: String, default: "" },
  
  // Education information
  education: {
    csIdentifier: { type: String, default: "" },
    roll_number: { type: String, default: "" }
  },
  
  // Documents
  documents: [{
    type: { 
      type: String, 
      enum: ["proof", "id", "certificate", "photo", "other"], 
      default: "other" 
    },
    original_name: { 
      type: String, 
      default: "" 
    },
    storage_path: { 
      type: String, 
      default: "" 
    },
    mime_type: { 
      type: String, 
      default: "" 
    },
    uploaded_at: { 
      type: Date, 
      default: Date.now 
    }
  }],
}, { 
  strict: false, // Allow additional fields not defined in schema
  timestamps: true // Add createdAt and updatedAt
});

// Indexes for better query performance
studentSchema.index({ firstname: 1 });
studentSchema.index({ lastname: 1 });
studentSchema.index({ displayname: 1 });
studentSchema.index({ school_id: 1 });
studentSchema.index({ teacher_id: 1 });

export const Student = mongoose.model("Student", studentSchema);
