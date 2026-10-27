import mongoose from "mongoose";

const parentSchema = new mongoose.Schema({
  // Basic parent information
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
  
  // Contact information
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone_number: {
    type: String,
    required: true,
    trim: true
  },
  
  // School association
  school_id: { 
    type: String, 
    required: true,
    index: true
  },
  
  // User account reference (for login)
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  // Children (students) associated with this parent
  children: [{
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    relationship: {
      type: String,
      enum: ['father', 'mother', 'guardian', 'other'],
      required: true
    }
  }],
  
  // Address information
  address: {
    site: { 
      type: String, 
      default: "",
      trim: true
    },
    landmark: { 
      type: String, 
      default: "",
      trim: true
    },
    pincode: { 
      type: String, 
      default: "",
      trim: true
    },
    state: { 
      type: String, 
      default: "",
      trim: true
    }
  },
  
  // Profile information
  profile: {
    photo: { 
      type: String, 
      default: "" 
    },
    occupation: {
      type: String,
      default: ""
    },
    blood_group: { 
      type: String, 
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", ""], 
      default: "" 
    }
  },
  
  // Status
  status: { 
    type: Boolean, 
    default: true 
  }

}, { 
  strict: false,
  timestamps: true
});

// Indexes for better query performance
parentSchema.index({ school_id: 1, status: 1 });
parentSchema.index({ email: 1 });
parentSchema.index({ phone_number: 1 });
parentSchema.index({ 'children.student_id': 1 });

export const Parent = mongoose.model("Parent", parentSchema);
