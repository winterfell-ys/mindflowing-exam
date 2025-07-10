import express from "express";
import { getUsers, createUser } from "../controllers/UserController";

const router = express.Router();

router.get("/users", getUsers);
router.post("/users", createUser);

export default router;
