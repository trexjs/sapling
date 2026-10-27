import jwt from "jsonwebtoken";
import { User } from "../models/authModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

// Authentication middleware
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token is required"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if user still exists and is active
    const user = await User.findById(decoded.userId).select('-password -refresh_tokens');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated"
      });
    }

    // Add user info to request
    req.user = {
      user_id: user._id,
      userId: user._id,
      username: user.username,
      email: user.email,
      user_type: user.user_type,
      school_id: user.school_id,
      is_verified: user.is_verified,
      profile: user.profile
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token has expired"
      });
    } else {
      console.error("Authentication error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error during authentication"
      });
    }
  }
};

// Middleware to check if user is verified
export const requireVerification = (req, res, next) => {
  if (!req.user.is_verified) {
    return res.status(403).json({
      success: false,
      message: "Email verification required"
    });
  }
  next();
};

// Middleware to check user type
export const requireUserType = (...allowedTypes) => {
  return (req, res, next) => {
    if (!allowedTypes.includes(req.user.user_type)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required user type: ${allowedTypes.join(' or ')}`
      });
    }
    next();
  };
};

// Middleware to check if user belongs to specific school
export const requireSchool = (req, res, next) => {
  const schoolId = req.params.school_id || req.body.school_id || req.query.school_id;
  
  if (schoolId && req.user.school_id !== schoolId) {
    return res.status(403).json({
      success: false,
      message: "Access denied. You don't have permission to access this school's data"
    });
  }
  next();
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password -refresh_tokens');
      
      if (user && user.is_active) {
        req.user = {
          user_id: user._id,
          userId: user._id,
          username: user.username,
          email: user.email,
          user_type: user.user_type,
          school_id: user.school_id,
          is_verified: user.is_verified,
          profile: user.profile
        };
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};
