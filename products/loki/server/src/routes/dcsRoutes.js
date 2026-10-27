import express from "express";
import {
  getFlagStatus,
  createOrUpdateFlag,
  mapFlagToAccount,
  getAllFlags,
} from "../controllers/dcsController.js";

const router = express.Router();

router.get("/flags", getAllFlags);
http://localhost:5000/api/dcs/status?flag=enableSearch&tenant=school_001
router.get("/status", getFlagStatus);
router.post("/", createOrUpdateFlag);
router.put("/map", mapFlagToAccount);
export default router;
