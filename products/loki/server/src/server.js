import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import configRoutes from "./routes/configRoutes.js";
import dcsRoutes from "./routes/dcsRoutes.js";
import cmsRoutes from "./routes/cmsRoutes.js";

const app = express();

// Add CORS middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Load configuration on startup
try {
  // loadApiAccessConfig();
  console.log("✅ Dynamic middleware system initialized");
} catch (error) {
  console.error("❌ Failed to load API access configuration:", error);
  console.log("⚠️ Falling back to basic middleware");
}


// Parse JSON bodies
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/editor_db")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.use("/api/config", configRoutes);
app.use("/api/dcs", dcsRoutes);
app.use("/api/cms", cmsRoutes);

app.listen(5000, () => console.log("✅ Server running on port 5000"));
