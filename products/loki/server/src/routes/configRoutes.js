import express from "express";
import {
  createConfig,
  getLatestConfigByName,
  updateConfigByName,
  getAllConfigs,
} from "../controllers/configController.js";

const router = express.Router();

// Get all configs
router.get("/", getAllConfigs);

// Create new config
router.post("/", createConfig);

// Get latest config
router.get("/:name/latest", getLatestConfigByName);

// Update config
router.put("/:name", updateConfigByName);

export default router;
