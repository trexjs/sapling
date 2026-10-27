import express from "express";
import { 
  getStudentData, 
  getStudentById, 
  getAllStudentData, 
  createStudent,
  updateStudent,
  deleteStudent,
  cleanupStudentData 
} from "../controllers/uploadController.js";
// Import dynamic middleware
import { dynamicAuth, dynamicRoleAuth } from "../middleware/dynamicAuthMiddleware.js";

const router = express.Router();

// GET route for retrieving all student data with search (requires teacher or admin role)
router.get("/", dynamicAuth, dynamicRoleAuth, getStudentData);

// Debug route to see all data without pagination (requires teacher or admin role)
// IMPORTANT: This must come BEFORE /:id route to avoid matching "debug" as an id
router.get("/debug/all", dynamicAuth, dynamicRoleAuth, getAllStudentData);

// GET route for retrieving a specific student by ID (requires teacher or admin role)
router.get("/:id", dynamicAuth, dynamicRoleAuth, getStudentById);

// POST route for creating a new student (requires teacher or admin role)
router.post("/", dynamicAuth, dynamicRoleAuth, createStudent);

// PUT route for updating a student by ID (requires teacher or admin role)
router.put("/:id", dynamicAuth, dynamicRoleAuth, updateStudent);

// DELETE route for deleting a single student by ID (requires teacher or admin role)
router.delete("/:id", dynamicAuth, dynamicRoleAuth, deleteStudent);

// DELETE route to clean up all student data (requires teacher or admin role)
router.delete("/cleanup", dynamicAuth, dynamicRoleAuth, cleanupStudentData);

export default router;
