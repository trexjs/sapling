import express from "express";
import {
  createSchool,
  getAllSchools,
  getSchoolById,
  getSchoolByCode,
  updateSchoolById,
  updateSchoolByCode,
  deactivateSchool,
  activateSchool,
  deleteSchool,
  searchSchools,
  getSchoolStats,
  getSchoolIdByCode
} from "../controllers/schoolController.js";
// Import dynamic middleware
import { dynamicAuth, dynamicRoleAuth } from "../middleware/dynamicAuthMiddleware.js";

const router = express.Router();

// School creation route (requires admin role)
router.post("/", dynamicAuth, dynamicRoleAuth, createSchool);

// Get all schools with optional filtering and pagination (requires admin role)
router.get("/", dynamicAuth, dynamicRoleAuth, getAllSchools);

// Get school statistics (requires admin role)
router.get("/stats", dynamicAuth, dynamicRoleAuth, getSchoolStats);

// Search schools (requires admin role)
router.get("/search", dynamicAuth, dynamicRoleAuth, searchSchools);

// Get school by ID (requires admin role)
router.get("/:id", dynamicAuth, dynamicRoleAuth, getSchoolById);

// Get school by school code (requires admin role)
router.get("/code/:school_code", dynamicAuth, dynamicRoleAuth, getSchoolByCode);

// Get school ID by school code (helper endpoint) (requires admin role)
router.get("/id/code/:school_code", dynamicAuth, dynamicRoleAuth, getSchoolIdByCode);

// Update school by ID (requires admin role)
router.put("/:id", dynamicAuth, dynamicRoleAuth, updateSchoolById);

// Update school by school code (requires admin role)
router.put("/code/:school_code", dynamicAuth, dynamicRoleAuth, updateSchoolByCode);

// Deactivate school (soft delete) (requires admin role)
router.patch("/:id/deactivate", dynamicAuth, dynamicRoleAuth, deactivateSchool);

// Activate school (requires admin role)
router.patch("/:id/activate", dynamicAuth, dynamicRoleAuth, activateSchool);

// Delete school permanently (requires admin role)
router.delete("/:id", dynamicAuth, dynamicRoleAuth, deleteSchool);

export default router;
