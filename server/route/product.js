import express from "express";
import dotenv from "dotenv";
const router = express.Router();
import multer from "multer";
dotenv.config();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

import {
  createProduct,
  uploadProductImage,
  listProducts,
  editProduct,
  getProduct,
} from "../controllers/productController.js";

router.post("/create", createProduct);
router.post("/upload", upload.single("image"), uploadProductImage);
router.get("/list/:address", listProducts);
router.post("/edit", editProduct);
router.get("/get/:id", getProduct);

export default router;
