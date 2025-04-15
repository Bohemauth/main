import { uploadToSevalla } from "../utils/s3Client.js";
import { v4 as uuidv4 } from "uuid";

const createProduct = async (req, res) => {};

const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.json({
        success: false,
        message: "No image file provided",
      });
    }

    // Generate unique filename
    const fileName = uuidv4();
    const contentType = req.file.mimetype;

    // Upload directly from buffer to Sevalla
    const imageUrl = await uploadToSevalla(
      req.file.buffer,
      fileName,
      contentType
    );

    return res.json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.json({
      success: false,
      message: "Failed to upload image",
      error: error.message,
    });
  }
};

export { createProduct, uploadProductImage };
