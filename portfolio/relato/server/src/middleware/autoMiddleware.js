import { 
  isPublicEndpoint, 
  requiresAuth, 
  getAllowedRoles,
  getRequiredMiddleware 
} from "../utils/configLoader.js";
import { dynamicAuth, dynamicRoleAuth, requireSchool } from "./dynamicAuthMiddleware.js";

/**
 * Auto-apply middleware based on api-access-config.json
 * This middleware automatically determines which middleware to apply
 * based on the endpoint configuration
 */
export const autoMiddleware = (req, res, next) => {
  try {
    const { path, method } = req;
    
    // Skip middleware application for public endpoints
    if (isPublicEndpoint(path, method)) {
      return next();
    }
    
    // If endpoint doesn't require auth, skip
    if (!requiresAuth(path, method)) {
      return next();
    }
    
    // Apply authentication middleware
    return dynamicAuth(req, res, (err) => {
      if (err) return next(err);
      
      // Apply role-based authorization if needed
      const allowedRoles = getAllowedRoles(path, method);
      if (allowedRoles.length > 0) {
        return dynamicRoleAuth(req, res, (err) => {
          if (err) return next(err);
          
          // Apply school access control if needed
          return requireSchool(req, res, next);
        });
      }
      
      // Apply school access control if needed
      return requireSchool(req, res, next);
    });
    
  } catch (error) {
    console.error("❌ Auto middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error in middleware",
      endpoint: `${req.method} ${req.path}`
    });
  }
};

/**
 * Conditional middleware application
 * Only applies middleware if the endpoint requires it
 */
export const conditionalAuth = (req, res, next) => {
  const { path, method } = req;
  
  if (isPublicEndpoint(path, method)) {
    return next();
  }
  
  if (requiresAuth(path, method)) {
    return dynamicAuth(req, res, next);
  }
  
  next();
};

/**
 * Conditional role-based middleware
 * Only applies role checking if the endpoint has role restrictions
 */
export const conditionalRoleAuth = (req, res, next) => {
  const { path, method } = req;
  const allowedRoles = getAllowedRoles(path, method);
  
  if (allowedRoles.length > 0) {
    return dynamicRoleAuth(req, res, next);
  }
  
  next();
};

/**
 * Smart middleware that applies all necessary middleware automatically
 * This is the main middleware to use for all routes
 */
export const smartMiddleware = [
  conditionalAuth,
  conditionalRoleAuth,
  requireSchool
];

/**
 * Public endpoint middleware (explicitly mark endpoints as public)
 * Use this for endpoints that should always be public regardless of config
 */
export const publicEndpoint = (req, res, next) => {
  // Force the endpoint to be treated as public
  req.isPublicEndpoint = true;
  next();
};

/**
 * Admin-only middleware (explicitly restrict to admin only)
 * Use this for endpoints that should always require admin role
 */
export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }
  
  if (req.user.user_type !== 'admin') {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
      userRole: req.user.user_type
    });
  }
  
  next();
};

/**
 * Teacher or Admin middleware
 * Use this for endpoints that require teacher or admin role
 */
export const teacherOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }
  
  if (!['teacher', 'admin'].includes(req.user.user_type)) {
    return res.status(403).json({
      success: false,
      message: "Teacher or Admin access required",
      userRole: req.user.user_type
    });
  }
  
  next();
};

/**
 * Student, Teacher or Admin middleware
 * Use this for endpoints that require student, teacher, or admin role
 */
export const studentTeacherOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }
  
  if (!['student', 'teacher', 'admin'].includes(req.user.user_type)) {
    return res.status(403).json({
      success: false,
      message: "Student, Teacher or Admin access required",
      userRole: req.user.user_type
    });
  }
  
  next();
};
