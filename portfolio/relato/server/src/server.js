import express from "express";
import mongoose from "mongoose";
import uploadRoutes from "./routes/uploadRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import featuresRoutes from "./routes/featuresRoutes.js";
import schoolRoutes from "./routes/schoolRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import pollRoutes from "./routes/pollRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import kudosRoutes from "./routes/kudosRoutes.js";
import mappingRoutes from "./routes/mappingRoutes.js";
import parentRoutes from "./routes/parentRoutes.js";

// Import dynamic middleware
import { dynamicCors, apiCors } from "./middleware/dynamicCorsMiddleware.js";
import {
  smartRateLimit,
  rateLimitLogger,
} from "./middleware/rateLimitMiddleware.js";
import { loadApiAccessConfig } from "./utils/configLoader.js";

const app = express();

// Load configuration on startup
try {
  loadApiAccessConfig();
  console.log("✅ Dynamic middleware system initialized");
} catch (error) {
  console.error("❌ Failed to load API access configuration:", error);
  console.log("⚠️ Falling back to basic middleware");
}

// Apply dynamic CORS middleware
app.use(apiCors);

// Apply rate limiting and logging
app.use(rateLimitLogger);
app.use(smartRateLimit);

// Parse JSON bodies
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/ktlo_db");

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/features", featuresRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/kudos", kudosRoutes);
app.use("/api/mapping", mappingRoutes);
app.use("/api/parents", parentRoutes);

app.listen(8080, () => console.log("✅ Server running on port 8080"));
