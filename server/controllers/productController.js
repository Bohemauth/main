import { uploadToSevalla } from "../utils/s3Client.js";
import { v4 as uuidv4 } from "uuid";
import prisma from "../utils/prisma.js";
import { verifySignature } from "../utils/signature.js";

const createProduct = async (req, res) => {
  try {
    const { name, description, image, address, signature } = req.body;

    if (!name || !description || !image || !address || !signature) {
      return res.json({
        success: false,
        message: "Missing required fields",
      });
    }

    const domain = {
      name: "bohemauth",
      version: "1",
    };

    const types = {
      NewProduct: [
        { name: "name", type: "string" },
        { name: "description", type: "string" },
        { name: "image", type: "string" },
      ],
    };

    const message = {
      name,
      description,
      image,
    };

    const isValid = await verifySignature(
      domain,
      types,
      message,
      signature,
      address
    );

    if (!isValid) {
      return res.json({
        success: false,
        message: "Invalid signature",
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        image,
        userId: address,
        status: "DRAFT",
      },
    });

    return res.json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    return res.json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

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

const listProducts = async (req, res) => {
  try {
    const address = req.params.address;

    if (!address) {
      return res.json({
        success: false,
        message: "Missing address",
      });
    }

    const products = await prisma.product.findMany({
      where: {
        userId: address,
      },
    });

    return res.json({
      success: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("List products error:", error);
    return res.json({
      success: false,
      message: "Failed to list products",
      error: error.message,
    });
  }
};

export { createProduct, uploadProductImage, listProducts };
