import prisma from "../utils/prisma.js";
import { generateProof } from "../utils/shamir.js";
import { verifySignature } from "../utils/signature.js";

const addListing = async (req, res) => {
  try {
    const { productId, address, signature } = req.body;

    if (!productId || !address || !signature) {
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
      AddListing: [{ name: "productId", type: "string" }],
    };

    const message = {
      productId,
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

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.userId !== address) {
      return res.json({
        success: false,
        message: "You are not the manufacturer of this product",
      });
    }

    if (product.status !== "LAUNCHED") {
      return res.json({
        success: false,
        message: "Product is not launched",
      });
    }

    const listing = await prisma.listing.create({
      data: {
        productId,
        isClaimed: false,
      },
    });

    const id = listing.id;

    const manufacturerShard = await prisma.manufacturerShard.findUnique({
      where: {
        userId_productId: {
          userId: address,
          productId: productId,
        },
      },
    });

    if (!manufacturerShard) {
      return res.json({
        success: false,
        message: "Manufacturer shard not found",
      });
    }

    const proof = await generateProof(
      {
        shard1: manufacturerShard.shard,
        shard2: product.shard,
      },
      id,
      product.ProductHash
    );

    const proofPayload = await prisma.proof.create({
      data: {
        proof,
      },
    });

    return res.json({
      success: true,
      message: "Listing added successfully",
      listing,
      proofId: proofPayload.id,
    });
  } catch (error) {
    console.error("Add listing error:", error);
    return res.json({
      success: false,
      message: "Failed to add listing",
      error: error.message,
    });
  }
};

const getAllListings = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        Listings: true,
      },
    });

    if (!product) {
      return res.json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      message: "Listings fetched successfully",
      listings: product.Listings,
    });
  } catch (error) {
    console.error("Get all listings error:", error);
    return res.json({
      success: false,
      message: "Failed to get listings",
      error: error.message,
    });
  }
};

export { addListing, getAllListings };
