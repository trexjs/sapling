import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  // Basic teacher information
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
  school_id: { 
    type: String, 
    required: true
  },
  teacher_id: { 
    type: String, 
    required: true,
    unique: true,
    index: true
  },
  status: { 
    type: Boolean, 
    default: true 
  },
  joining_date: { 
    type: Date, 
    required: true 
  },

  // Profile information
  profile: {
    blood_group: { 
      type: String, 
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", ""], 
      default: "" 
    },
    photo: [{ 
      type: String, 
      default: "" 
    }],
    email_id: { 
      type: String, 
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    age: { 
      type: Number, 
      required: true 
    },
    phone_number: [{ 
      type: String, 
      required: true 
    }],
    gender: { 
      type: String, 
      enum: ["male", "female", "other"], 
      required: true 
    },
    expertised_fields: [{ 
      type: String, 
      required: true 
    }],
    experience: [{ 
      type: String, 
      required: true 
    }],
    dob: { 
      type: Date, 
      required: true 
    }
  },

  // Address information
  address: {
    site: { 
      type: String, 
      required: true,
      trim: true
    },
    landmark: { 
      type: String, 
      default: "",
      trim: true
    },
    pincode: { 
      type: String, 
      required: true,
      trim: true
    },
    state: { 
      type: String, 
      required: true,
      trim: true
    }
  },

  // Emergency contact information
  emergency_contact: {
    name: { 
      type: String, 
      default: "",
      trim: true
    },
    relationship: { 
      type: String, 
      default: "",
      trim: true
    },
    phone: { 
      type: String, 
      default: "",
      trim: true
    },
    email: { 
      type: String, 
      default: "",
      lowercase: true,
      trim: true
    }
  },

  // Attendance tracking (can be expanded later)
  attendance: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
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
      required: true,
      trim: true
    },
    storage_path: { 
      type: String, 
      required: true,
      trim: true
    },
    mime_type: { 
      type: String, 
      default: ""
    },
    uploaded_at: { 
      type: Date, 
      default: Date.now 
    }
  }]

}, { 
  strict: false, // Allow additional fields not defined in schema
  timestamps: true // Add createdAt and updatedAt
});

// Indexes for better query performance
teacherSchema.index({ school_id: 1, status: 1 });
teacherSchema.index({ firstname: 1 });
teacherSchema.index({ lastname: 1 });
teacherSchema.index({ displayname: 1 });
teacherSchema.index({ 'profile.email_id': 1 });

// Pre-save middleware to calculate age from DOB
teacherSchema.pre('save', function(next) {
  if (this.profile.dob && !this.profile.age) {
    const today = new Date();
    const birthDate = new Date(this.profile.dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    this.profile.age = age;
  }
  next();
});

export const Teacher = mongoose.model("Teacher", teacherSchema);
