import { Router } from "express";
import {
  listTasks,
  getTask,
  createTask,
  updateTask,
  toggleComplete,
  toggleFavorite,
  duplicateTask,
  deleteTask,
  getTaskSummary,
} from "../controllers/task.controller.js";

const router = Router();

router.get("/", listTasks);
router.get("/summary", getTaskSummary);
router.get("/:id", getTask);
router.post("/", createTask);
router.patch("/:id", updateTask);
router.patch("/:id/complete", toggleComplete);
router.patch("/:id/favorite", toggleFavorite);
router.post("/:id/duplicate", duplicateTask);
router.delete("/:id", deleteTask);

export default router;
