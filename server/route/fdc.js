import express from "express";
import dotenv from "dotenv";
const router = express.Router();

dotenv.config();

import { main } from "../utils/fdc.js";

router.post("/", main);

export default router;
