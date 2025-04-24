import express from "express";
import dotenv from "dotenv";
const router = express.Router();
import {
  addListing,
  getAllListings,
  validateListing,
  redeemListing,
} from "../controllers/listingController.js";
dotenv.config();

router.post("/add", addListing);
router.get("/getAll/:id", getAllListings);
router.post("/validate", validateListing);
router.post("/redeem", redeemListing);

export default router;
