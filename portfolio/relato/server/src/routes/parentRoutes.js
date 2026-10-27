import express from "express";
import {
  getParents,
  getParentById,
  getParentChildren,
  createParent,
  updateParent,
  deleteParent,
  addChildToParent,
  removeChildFromParent,
  createParentAccount
} from "../controllers/parentController.js";

const router = express.Router();

// Parent CRUD routes (no auth required for v0)
router.get("/", getParents);
router.get("/:id", getParentById);
router.get("/:id/children", getParentChildren);
router.post("/", createParent);
router.put("/:id", updateParent);
router.delete("/:id", deleteParent);

// Child management routes
router.post("/:id/children", addChildToParent);
router.delete("/:id/children/:studentId", removeChildFromParent);

// Account creation route
router.post("/:id/create-account", createParentAccount);

export default router;
