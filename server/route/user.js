import express from "express";
import dotenv from "dotenv";
const router = express.Router();
dotenv.config();

import { getUser, createUser } from "../controllers/userController.js";

router.get("/get/:address", getUser);
router.post("/create", createUser);

export default router;
