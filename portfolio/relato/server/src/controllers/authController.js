import { User } from "../models/authModel.js";
import { School } from "../models/schoolModel.js";
import { Teacher } from "../models/teacherModel.js";
import { Student } from "../models/studentModel.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/emailService.js";

// JWT Secret (should be in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-super-secret-refresh-key-change-in-production";
const JWT_EXPIRES_IN = "1h";
const JWT_REFRESH_EXPIRES_IN = "7d";

// Generate JWT tokens
const generateTokens = (userId) => {
  console.log('🔐 Auth Controller - Generating tokens for userId:', userId);
  console.log('🔐 Auth Controller - Using JWT_SECRET:', JWT_SECRET ? 'Secret exists' : 'No secret');
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });
  console.log('🔐 Auth Controller - Generated access token:', accessToken.substring(0, 20) + '...');
  return { accessToken, refreshToken };
};

// Register a new user
export const register = async (req, res) => {
  try {
    const {
      username,
      email,
      phone_number,
      password,
      confirm_password,
      user_type,
      school_id,
      profile
    } = req.body;

    // Validate required fields
    if (!username || !email || !phone_number || !password || !confirm_password || !user_type || !school_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: username, email, phone_number, password, confirm_password, user_type, school_id"
      });
    }

    // Validate password confirmation
    if (password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password do not match"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() },
        { phone_number }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email, username, or phone number"
      });
    }

    // Verify school exists and is active
    const school = await School.findOne({ school_code: school_id, school_status: true });
    if (!school) {
      return res.status(400).json({
        success: false,
        message: "School not found or inactive"
      });
    }

    // Check if user type is valid for the school
    if (user_type === "teacher") {
      // Teachers must be pre-registered by admin before they can create an account
      const teacher = await Teacher.findOne({ 
        "profile.email_id": email.toLowerCase(),
        school_id: school._id 
      });
      if (!teacher) {
        return res.status(400).json({
          success: false,
          message: "Teacher not found in school records. Please contact school administration to be added as a teacher first."
        });
      }
    }
    // Students and admins can self-register without pre-registration

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Create new user
    const user = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      phone_number,
      password,
      user_type,
      school_id: school._id,
      email_verification_token: emailVerificationToken,
      profile: {
        first_name: profile?.first_name || "",
        last_name: profile?.last_name || "",
        avatar: profile?.avatar || ""
      }
    });

    await user.save();

    // Send welcome email with verification link
    try {
      await sendEmail({
        to: user.email,
        subject: "Welcome to School Platform - Verify Your Email",
        template: "welcome",
        data: {
          name: `${user.profile.first_name} ${user.profile.last_name}`,
          verificationLink: `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email?token=${emailVerificationToken}`,
          schoolName: school.school_code
        }
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail registration if email fails
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please check your email to verify your account.",
      data: {
        user_id: user._id,
        username: user.username,
        email: user.email,
        user_type: user.user_type,
        school_id: user.school_id,
        is_verified: user.is_verified
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during registration",
      error: error.message
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { username_or_email, password } = req.body;

    if (!username_or_email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username/email and password are required"
      });
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [
        { username: username_or_email.toLowerCase() },
        { email: username_or_email.toLowerCase() }
      ]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Check if account is locked
    if (user.isLocked()) {
      return res.status(423).json({
        success: false,
        message: "Account is temporarily locked due to too many failed login attempts. Please try again later."
      });
    }

    // Check if account is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated. Please contact support."
      });
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      await user.incLoginAttempts();
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Update last login
    user.last_login = new Date();
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Store refresh token
    user.refresh_tokens.push({ token: refreshToken });
    await user.save();

    // Get school information
    const school = await School.findOne({ school_id: user.school_id });

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          user_id: user._id,
          username: user.username,
          email: user.email,
          user_type: user.user_type,
          school_id: user.school_id,
          school_name: school?.school_name || "",
          is_verified: user.is_verified,
          profile: user.profile
        },
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: JWT_EXPIRES_IN
        }
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during login",
      error: error.message
    });
  }
};

// Verify email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required"
      });
    }

    const user = await User.findOne({ email_verification_token: token });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token"
      });
    }

    if (user.is_verified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified"
      });
    }

    // Verify email
    user.is_verified = true;
    user.email_verified_at = new Date();
    user.email_verification_token = null;
    await user.save();

    res.json({
      success: true,
      message: "Email verified successfully"
    });

  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during email verification",
      error: error.message
    });
  }
};

// Forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { username_or_email_or_phone } = req.body;

    if (!username_or_email_or_phone) {
      return res.status(400).json({
        success: false,
        message: "Username, email, or phone number is required"
      });
    }

    // Find user by username, email, or phone
    const user = await User.findOne({
      $or: [
        { username: username_or_email_or_phone.toLowerCase() },
        { email: username_or_email_or_phone.toLowerCase() },
        { phone_number: username_or_email_or_phone }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Generate OTP
    const otp = user.generateOTP();
    await user.save();

    // Send OTP via email
    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset OTP",
        template: "forgot_password",
        data: {
          name: `${user.profile.first_name} ${user.profile.last_name}`,
          otp: otp
        }
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP. Please try again."
      });
    }

    res.json({
      success: true,
      message: "OTP sent to your registered email address"
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during forgot password",
      error: error.message
    });
  }
};

// Reset password with OTP
export const resetPassword = async (req, res) => {
  try {
    const { username_or_email_or_phone, new_password, confirm_password, otp } = req.body;

    if (!username_or_email_or_phone || !new_password || !confirm_password || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: username_or_email_or_phone, new_password, confirm_password, otp"
      });
    }

    // Validate password confirmation
    if (new_password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match"
      });
    }

    // Find user
    const user = await User.findOne({
      $or: [
        { username: username_or_email_or_phone.toLowerCase() },
        { email: username_or_email_or_phone.toLowerCase() },
        { phone_number: username_or_email_or_phone }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Verify OTP
    if (!user.verifyOTP(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    // Update password
    user.password = new_password;
    user.clearOTP();
    await user.save();

    res.json({
      success: true,
      message: "Password reset successfully"
    });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during password reset",
      error: error.message
    });
  }
};

// Change password (authenticated user)
export const changePassword = async (req, res) => {
  try {
    const { old_password, new_password, confirm_password, otp } = req.body;
    const userId = req.user.userId;

    if (!old_password || !new_password || !confirm_password || !otp) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: old_password, new_password, confirm_password, otp"
      });
    }

    // Validate password confirmation
    if (new_password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Verify old password
    const isOldPasswordValid = await user.validatePassword(old_password);
    if (!isOldPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid old password"
      });
    }

    // Verify OTP
    if (!user.verifyOTP(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
    }

    // Update password
    user.password = new_password;
    user.clearOTP();
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during password change",
      error: error.message
    });
  }
};

// Generate OTP for password change
export const generateOTPForPasswordChange = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Generate OTP
    const otp = user.generateOTP();
    await user.save();

    // Send OTP via email
    try {
      await sendEmail({
        to: user.email,
        subject: "Password Change OTP",
        template: "password_change_otp",
        data: {
          name: `${user.profile.first_name} ${user.profile.last_name}`,
          otp: otp
        }
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP. Please try again."
      });
    }

    res.json({
      success: true,
      message: "OTP sent to your registered email address"
    });

  } catch (error) {
    console.error("Generate OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during OTP generation",
      error: error.message
    });
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required"
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refresh_token, JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token"
      });
    }

    // Check if refresh token exists in user's tokens
    const tokenExists = user.refresh_tokens.some(tokenObj => tokenObj.token === refresh_token);
    if (!tokenExists) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token"
      });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);

    // Remove old refresh token and add new one
    user.refresh_tokens = user.refresh_tokens.filter(tokenObj => tokenObj.token !== refresh_token);
    user.refresh_tokens.push({ token: newRefreshToken });
    await user.save();

    res.json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        access_token: accessToken,
        refresh_token: newRefreshToken,
        expires_in: JWT_EXPIRES_IN
      }
    });

  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid refresh token"
    });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    const userId = req.user.userId;

    if (refresh_token) {
      // Remove specific refresh token
      await User.findByIdAndUpdate(userId, {
        $pull: { refresh_tokens: { token: refresh_token } }
      });
    } else {
      // Remove all refresh tokens (logout from all devices)
      await User.findByIdAndUpdate(userId, {
        $set: { refresh_tokens: [] }
      });
    }

    res.json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during logout",
      error: error.message
    });
  }
};

// Test endpoint to verify authentication middleware
export const testAuth = async (req, res) => {
  try {
    console.log('Test Auth - req.user:', req.user);
    console.log('Test Auth - req.headers:', req.headers);
    
    // Decode JWT token manually to see what's in it
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      try {
        const decoded = jwt.decode(token);
        console.log('Test Auth - Manual JWT decode:', decoded);
        
        // Try to verify the token with the same secret
        try {
          const verified = jwt.verify(token, JWT_SECRET);
          console.log('Test Auth - Token verification successful:', verified);
        } catch (verifyError) {
          console.log('Test Auth - Token verification failed:', verifyError.message);
        }
      } catch (e) {
        console.log('Test Auth - JWT decode error:', e.message);
      }
    }
    
    res.json({
      success: true,
      message: "Auth test successful",
      data: {
        user: req.user,
        headers: req.headers,
        token: token ? token.substring(0, 20) + '...' : 'No token'
      }
    });
  } catch (error) {
    console.error("Test Auth error:", error);
    res.status(500).json({
      success: false,
      message: "Test Auth error",
      error: error.message
    });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    console.log('Profile request - req.headers:', req.headers);
    
    // Extract token from Authorization header
    const authHeader = req.headers['authorization'];
    console.log('Profile request - Authorization header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing or invalid"
      });
    }
    
    const token = authHeader.split(' ')[1];
    console.log('Profile request - Extracted token:', token ? token.substring(0, 20) + '...' : 'No token');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token is required"
      });
    }
    
    // Verify and decode the JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log('Profile request - Decoded token:', decoded);
    } catch (jwtError) {
      console.log('Profile request - JWT verification failed:', jwtError.message);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token"
      });
    }
    
    const userId = decoded.userId;
    console.log('Profile request - userId from token:', userId);
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload"
      });
    }

    // Fetch user from database
    const user = await User.findById(userId).select('-password -refresh_tokens -otp -otp_expires');
    console.log('Profile request - Found user:', user ? user.username : 'null');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Get school information if available
    let school = null;
    if (user.school_id) {
      school = await School.findOne({ school_id: user.school_id });
      console.log('Profile request - Found school:', school ? school.school_name : 'null');
    }

    res.json({
      success: true,
      message: "Profile retrieved successfully",
      data: {
        user: {
          user_id: user._id,
          username: user.username,
          email: user.email,
          phone_number: user.phone_number,
          user_type: user.user_type,
          school_id: user.school_id,
          school_name: school?.school_name || "",
          is_verified: user.is_verified,
          is_active: user.is_active,
          profile: user.profile,
          last_login: user.last_login,
          created_at: user.createdAt,
          updated_at: user.updatedAt
        }
      }
    });

  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while retrieving profile",
      error: error.message
    });
  }
};
