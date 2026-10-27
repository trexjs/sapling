import express from "express";
import { getFeatures, updateFeatures, getFeaturesSection } from "../controllers/featureController.js";

const router = express.Router();

// GET route to retrieve all configuration data
router.get("/", getFeatures);

// GET route to retrieve specific configuration section
router.get("/:section", getFeaturesSection);

// PUT route to update configuration data
router.put("/", updateFeatures);

export default router;
