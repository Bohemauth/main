import express from "express";
import dotenv from "dotenv";
const router = express.Router();
import { addListing } from "../controllers/listingController.js";
dotenv.config();

router.post("/add", addListing);

export default router;
