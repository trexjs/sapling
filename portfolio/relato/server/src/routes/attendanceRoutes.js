import express from "express";
import {
  getAttendanceConfig,
  updateAttendanceConfig,
  getStudentAttendance,
  markAttendance,
  getAttendanceSummary,
  getClassAttendance,
  updateAttendanceRecord,
  deleteAttendanceRecord,
  testAttendanceConfig
} from "../controllers/attendanceController.js";
// Import dynamic middleware
import { dynamicAuth, dynamicRoleAuth, requireSchool } from "../middleware/dynamicAuthMiddleware.js";

const router = express.Router();

// Configuration routes (requires teacher, admin, or student role)
router.get("/config", getAttendanceConfig);
router.put("/config", updateAttendanceConfig);
// router.get("/config", dynamicAuth, requireSchool, getAttendanceConfig);
// router.put("/config", dynamicAuth, requireSchool, updateAttendanceConfig);

// Test route without middleware for debugging
router.get("/test", testAttendanceConfig);

// Student attendance routes (authorization temporarily disabled)
router.get("/student", getStudentAttendance); // Query: ?type=student&student_id=1222&year=2025&month=JAN
router.post("/mark", markAttendance);

// Attendance summary routes (authorization temporarily disabled)
router.get("/summary/:school_id/:student_id", getAttendanceSummary); // Query: ?year=2025&month=JAN

// Class attendance routes (authorization temporarily disabled)
router.get("/class/:school_id/:teacher_id", getClassAttendance); // Query: ?date=2025-01-28&class_name=10&section=A

// Individual attendance record routes (authorization temporarily disabled)
router.put("/record/:school_id/:student_id/:date", updateAttendanceRecord);
router.delete("/record/:school_id/:student_id/:date", deleteAttendanceRecord);

export default router;
