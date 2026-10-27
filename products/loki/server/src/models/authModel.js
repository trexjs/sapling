import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  // Basic user information
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
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
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  
  // User type and role
  user_type: {
    type: String,
    enum: ["student", "teacher", "admin"],
    required: true
  },
  school_id: {
    type: String,
    required: true,
    index: true
  },
  
  // Account status
  is_verified: {
    type: Boolean,
    default: false
  },
  is_active: {
    type: Boolean,
    default: true
  },
  
  // Email verification
  email_verification_token: {
    type: String,
    default: null
  },
  email_verified_at: {
    type: Date,
    default: null
  },
  
  // Password reset
  password_reset_token: {
    type: String,
    default: null
  },
  password_reset_expires: {
    type: Date,
    default: null
  },
  
  // OTP for various operations
  otp: {
    type: String,
    default: null
  },
  otp_expires: {
    type: Date,
    default: null
  },
  
  // Refresh token for JWT
  refresh_tokens: [{
    token: String,
    created_at: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Profile information
  profile: {
    first_name: {
      type: String,
      required: true,
      trim: true
    },
    last_name: {
      type: String,
      required: true,
      trim: true
    },
    avatar: {
      type: String,
      default: ""
    }
  },
  
  // Last login tracking
  last_login: {
    type: Date,
    default: null
  },
  login_attempts: {
    type: Number,
    default: 0
  },
  lockout_until: {
    type: Date,
    default: null
  }

}, { 
  strict: false,
  timestamps: true
});

// Password validation middleware
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to validate password
userSchema.methods.validatePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate OTP
userSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = otp;
  this.otp_expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return otp;
};

// Method to verify OTP
userSchema.methods.verifyOTP = function(otp) {
  if (!this.otp || !this.otp_expires) {
    return false;
  }
  
  if (new Date() > this.otp_expires) {
    this.otp = null;
    this.otp_expires = null;
    return false;
  }
  
  return this.otp === otp;
};

// Method to clear OTP
userSchema.methods.clearOTP = function() {
  this.otp = null;
  this.otp_expires = null;
};

// Method to check if account is locked
userSchema.methods.isLocked = function() {
  return !!(this.lockout_until && this.lockout_until > Date.now());
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockout_until && this.lockout_until < Date.now()) {
    return this.updateOne({
      $unset: { lockout_until: 1 },
      $set: { login_attempts: 1 }
    });
  }
  
  const updates = { $inc: { login_attempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.login_attempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockout_until: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { login_attempts: 1, lockout_until: 1 }
  });
};

// Indexes for better query performance
userSchema.index({ school_id: 1, user_type: 1 });
userSchema.index({ email_verification_token: 1 });
userSchema.index({ password_reset_token: 1 });

// Password validation
userSchema.pre('validate', function(next) {
  const passwordRegex = /^[a-zA-Z0-9_@#$%]{6,}$/;
  
  if (this.password && !passwordRegex.test(this.password)) {
    const error = new Error('Password must be at least 6 characters and contain only letters, numbers, and special characters: _, @, #, $, %');
    return next(error);
  }
  
  next();
});

export const User = mongoose.model("User", userSchema);
