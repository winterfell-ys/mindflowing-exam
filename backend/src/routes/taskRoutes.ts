import express from "express";
import { getTasks, createTask } from "../controllers/TaskController";

const router = express.Router();

router.get("/tasks", getTasks);
router.post("/tasks", createTask);

export default router;
