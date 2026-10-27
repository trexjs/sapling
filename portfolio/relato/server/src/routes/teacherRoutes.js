import express from "express";
import {
  onboardTeacher,
  searchTeachers,
  getTeacherById,
  updateTeacher,
  disableTeacher,
  getAllTeachers,
  getTeacherStats
} from "../controllers/teacherController.js";
// Import dynamic middleware
import { dynamicAuth, dynamicRoleAuth } from "../middleware/dynamicAuthMiddleware.js";

const router = express.Router();

// Teacher onboarding route (requires teacher or admin role)
router.post("/onboard", dynamicAuth, dynamicRoleAuth, onboardTeacher);

// Get all teachers with optional filtering (requires teacher or admin role)
router.get("/", dynamicAuth, dynamicRoleAuth, getAllTeachers);

// Get teacher statistics (requires teacher or admin role)
router.get("/stats", dynamicAuth, dynamicRoleAuth, getTeacherStats);

// Search teachers by name or teacher ID (requires teacher or admin role)
router.get("/search", dynamicAuth, dynamicRoleAuth, searchTeachers);

// Get teacher by ID (requires teacher or admin role)
router.get("/:id", dynamicAuth, dynamicRoleAuth, getTeacherById);

// Update teacher details (requires teacher or admin role)
router.put("/:id", dynamicAuth, dynamicRoleAuth, updateTeacher);

// Disable a teacher (requires teacher or admin role)
router.patch("/disable/:teacher_id", dynamicAuth, dynamicRoleAuth, disableTeacher);

export default router;
