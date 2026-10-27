import express from "express";
import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  generateOTPForPasswordChange,
  refreshToken,
  logout,
  getProfile,
  testAuth
} from "../controllers/authController.js";
// Import dynamic middleware
import { dynamicAuth, dynamicRoleAuth, requireVerification } from "../middleware/dynamicAuthMiddleware.js";

const router = express.Router();

// Public routes (no authentication required - handled by dynamic middleware)
router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refreshToken);

// Protected routes (authentication required - handled by dynamic middleware)
router.post("/logout", dynamicAuth, logout);
router.get("/profile", getProfile);
router.get("/test-auth", dynamicAuth, testAuth);
router.post("/generate-otp-password-change", dynamicAuth, generateOTPForPasswordChange);
router.post("/change-password", dynamicAuth, changePassword);

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Auth service is running",
    timestamp: new Date().toISOString()
  });
});

// JWT secret test endpoint (for debugging)
router.get("/jwt-test", (req, res) => {
  res.json({
    success: true,
    message: "JWT test endpoint",
    data: {
      hasSecret: true,
      timestamp: new Date().toISOString()
    }
  });
});

export default router;
