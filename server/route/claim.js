import express from "express";
import dotenv from "dotenv";
const router = express.Router();
dotenv.config();

import { getUserClaims } from "../controllers/claimController.js";

router.get("/get/:address", getUserClaims);

export default router;
