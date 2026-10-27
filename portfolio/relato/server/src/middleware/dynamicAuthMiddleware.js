import jwt from "jsonwebtoken";
import { User } from "../models/authModel.js";
import { 
  loadApiAccessConfig, 
  isPublicEndpoint, 
  requiresAuth, 
  getAllowedRoles,
  getRequiredMiddleware,
  getSecurityConfig,
  getLoggingConfig
} from "../utils/configLoader.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
console.log('🔐 Dynamic Auth - JWT_SECRET loaded:', JWT_SECRET ? 'Secret exists' : 'No secret');

/**
 * Dynamic authentication middleware that uses api-access-config.json
 * This replaces the hardcoded authentication logic
 */
export const dynamicAuth = async (req, res, next) => {
  try {
    const { path, method } = req;
    const loggingConfig = getLoggingConfig();

    // Log request if logging is enabled
    if (loggingConfig.enabled && loggingConfig.logAuthAttempts) {
      console.log(`🔐 Auth check for ${method} ${path}`);
    }

    // Check if endpoint is public
    if (isPublicEndpoint(path, method)) {
      if (loggingConfig.enabled) {
        console.log(`✅ Public endpoint access granted for ${method} ${path}`);
      }
      return next();
    }

    // Check if endpoint requires authentication
    if (!requiresAuth(path, method)) {
      if (loggingConfig.enabled) {
        console.log(`✅ No auth required for ${method} ${path}`);
      }
      return next();
    }

    // Extract token from Authorization header
    const authHeader = req.headers['authorization'];
    console.log('🔐 Dynamic Auth - Authorization header:', authHeader);
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    console.log('🔐 Dynamic Auth - Extracted token:', token ? token.substring(0, 20) + '...' : 'No token');

    if (!token) {
      console.log(`❌ No token provided for protected endpoint ${method} ${path}`);
      return res.status(401).json({
        success: false,
        message: "Access token is required",
        endpoint: `${method} ${path}`
      });
    }

    // Verify JWT token
    console.log('🔐 Dynamic Auth - Verifying token:', token.substring(0, 20) + '...');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('🔐 Dynamic Auth - Decoded token:', decoded);
    
    // Check if user still exists and is active
    const user = await User.findById(decoded.userId).select('-password -refresh_tokens');
    console.log('🔐 Dynamic Auth - Found user:', user ? user.username : 'null');
    
    if (!user) {
      if (loggingConfig.enabled && loggingConfig.logFailedAttempts) {
        console.log(`❌ User not found for token on ${method} ${path}`);
      }
      return res.status(401).json({
        success: false,
        message: "User not found",
        endpoint: `${method} ${path}`
      });
    }

    if (!user.is_active) {
      if (loggingConfig.enabled && loggingConfig.logFailedAttempts) {
        console.log(`❌ Inactive user attempted access to ${method} ${path}`);
      }
      return res.status(401).json({
        success: false,
        message: "Account is deactivated",
        endpoint: `${method} ${path}`
      });
    }

    // Add user info to request
    req.user = {
      userId: user._id,
      username: user.username,
      email: user.email,
      user_type: user.user_type,
      school_id: user.school_id,
      is_verified: user.is_verified
    };

    console.log('🔐 Dynamic Auth - Setting req.user:', req.user);
    console.log('🔐 Dynamic Auth - User ID:', user._id);

    if (loggingConfig.enabled) {
      console.log(`✅ User authenticated: ${user.username} (${user.user_type}) for ${method} ${path}`);
    }

    next();
  } catch (error) {
    const loggingConfig = getLoggingConfig();
    
    if (error.name === 'JsonWebTokenError') {
      if (loggingConfig.enabled && loggingConfig.logFailedAttempts) {
        console.log(`❌ Invalid token for ${req.method} ${req.path}`);
      }
      return res.status(401).json({
        success: false,
        message: "Invalid token",
        endpoint: `${req.method} ${req.path}`
      });
    } else if (error.name === 'TokenExpiredError') {
      if (loggingConfig.enabled && loggingConfig.logFailedAttempts) {
        console.log(`❌ Expired token for ${req.method} ${req.path}`);
      }
      return res.status(401).json({
        success: false,
        message: "Token has expired",
        endpoint: `${req.method} ${req.path}`
      });
    } else {
      console.error("❌ Dynamic authentication error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error during authentication",
        endpoint: `${req.method} ${req.path}`
      });
    }
  }
};

/**
 * Dynamic role-based authorization middleware
 * Checks if user has required role for the endpoint
 */
export const dynamicRoleAuth = (req, res, next) => {
  try {
    const { path, method } = req;
    const loggingConfig = getLoggingConfig();

    // Get allowed roles for this endpoint
    const allowedRoles = getAllowedRoles(path, method);
    
    // If no role restrictions, allow access
    if (allowedRoles.length === 0) {
      return next();
    }

    // Check if user has required role
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required before role check",
        endpoint: `${method} ${path}`
      });
    }

    if (!allowedRoles.includes(req.user.user_type)) {
      if (loggingConfig.enabled && loggingConfig.logFailedAttempts) {
        console.log(`❌ Role access denied: ${req.user.user_type} not in [${allowedRoles.join(', ')}] for ${method} ${path}`);
      }
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${allowedRoles.join(' or ')}`,
        userRole: req.user.user_type,
        requiredRoles: allowedRoles,
        endpoint: `${method} ${path}`
      });
    }

    if (loggingConfig.enabled) {
      console.log(`✅ Role access granted: ${req.user.user_type} for ${method} ${path}`);
    }

    next();
  } catch (error) {
    console.error("❌ Dynamic role authorization error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during role authorization",
      endpoint: `${req.method} ${req.path}`
    });
  }
};

/**
 * Email verification middleware
 * Checks if user email is verified
 */
export const requireVerification = (req, res, next) => {
  const securityConfig = getSecurityConfig();
  const loggingConfig = getLoggingConfig();

  // Check if email verification is required by config
  if (securityConfig.emailVerification && !securityConfig.emailVerification.required) {
    return next();
  }

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required before verification check"
    });
  }

  if (!req.user.is_verified) {
    if (loggingConfig.enabled && loggingConfig.logFailedAttempts) {
      console.log(`❌ Email verification required for user ${req.user.username}`);
    }
    return res.status(403).json({
      success: false,
      message: "Email verification required",
      user: req.user.username
    });
  }

  if (loggingConfig.enabled) {
    console.log(`✅ Email verification confirmed for user ${req.user.username}`);
  }

  next();
};

/**
 * School access middleware
 * Checks if user has access to specific school data
 */
export const requireSchool = (req, res, next) => {
  const schoolId = req.params.school_id || req.body.school_id || req.query.school_id;
  
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required before school check"
    });
  }

  // Admin users can access any school
  if (req.user.user_type === 'admin') {
    return next();
  }

  // Check if user belongs to the requested school
  if (schoolId && req.user.school_id !== schoolId) {
    const loggingConfig = getLoggingConfig();
    if (loggingConfig.enabled && loggingConfig.logFailedAttempts) {
      console.log(`❌ School access denied: user school ${req.user.school_id} != requested ${schoolId}`);
    }
    return res.status(403).json({
      success: false,
      message: "Access denied. You don't have permission to access this school's data",
      userSchool: req.user.school_id,
      requestedSchool: schoolId
    });
  }

  next();
};

/**
 * Apply all required middleware for an endpoint based on config
 * This is a convenience function that applies all middleware at once
 */
export const applyDynamicMiddleware = (req, res, next) => {
  const { path, method } = req;
  const requiredMiddleware = getRequiredMiddleware(path, method);
  
  // Apply middleware in sequence
  const middlewareChain = [
    dynamicAuth,
    dynamicRoleAuth,
    // Add more middleware as needed
  ];

  let currentIndex = 0;

  const executeNext = () => {
    if (currentIndex < middlewareChain.length) {
      const middleware = middlewareChain[currentIndex++];
      middleware(req, res, executeNext);
    } else {
      next();
    }
  };

  executeNext();
};

/**
 * Optional authentication middleware (doesn't fail if no token)
 * Useful for endpoints that work with or without authentication
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password -refresh_tokens');
      
      if (user && user.is_active) {
        req.user = {
          userId: user._id,
          username: user.username,
          email: user.email,
          user_type: user.user_type,
          school_id: user.school_id,
          is_verified: user.is_verified
        };
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};
