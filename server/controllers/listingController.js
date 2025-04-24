import prisma from "../utils/prisma.js";
import { generateProof, verifyProof } from "../utils/shamir.js";
import { verifySignature } from "../utils/signature.js";
import wallet from "../lib/wallet.js";
import contracts from "../lib/config.js";

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

const validateListing = async (req, res) => {
  try {
    const { listingId, proofId } = req.body;

    if (!listingId || !proofId) {
      return res.json({
        success: false,
        message: "Missing required fields",
      });
    }

    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      include: {
        Product: true,
      },
    });

    if (!listing) {
      return res.json({
        success: false,
        message: "Listing not found",
      });
    }

    const proof = await prisma.proof.findUnique({
      where: {
        id: proofId,
      },
    });

    if (!proof) {
      return res.json({
        success: true,
        message: "Proof not found",
        listing,
        isValid: false,
      });
    }

    const isValid = await verifyProof(
      proof.proof,
      listing.id,
      listing.Product.ProductHash
    );

    return res.json({
      success: true,
      message: "Listing validated successfully",
      isValid,
      listing,
    });
  } catch (error) {
    console.error("Validate listing error:", error);
    return res.json({
      success: false,
      message: "Failed to validate listing",
      error: error.message,
    });
  }
};

const redeemListing = async (req, res) => {
  try {
    const { listingId, proofId, signature, address } = req.body;

    if (!listingId || !proofId || !address || !signature) {
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
      RedeemListing: [
        { name: "listingId", type: "string" },
        { name: "proofId", type: "string" },
      ],
    };

    const message = {
      listingId,
      proofId,
    };

    const isSignatureValid = await verifySignature(
      domain,
      types,
      message,
      signature,
      address
    );

    if (!isSignatureValid) {
      return res.json({
        success: false,
        message: "Invalid signature",
      });
    }

    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      include: {
        Product: true,
      },
    });

    if (!listing) {
      return res.json({
        success: false,
        message: "Listing not found",
      });
    }

    if (listing.isClaimed) {
      return res.json({
        success: false,
        message: "Listing already claimed",
      });
    }

    const proof = await prisma.proof.findUnique({
      where: {
        id: proofId,
      },
    });

    if (!proof) {
      return res.json({
        success: true,
        message: "Proof not found",
        listing,
        isValid: false,
      });
    }

    const isValid = await verifyProof(
      proof.proof,
      listing.id,
      listing.Product.ProductHash
    );

    if (!isValid) {
      return res.json({
        success: false,
        message: "Invalid proof",
      });
    }

    const signer = wallet.getWallet("coston2");

    const BohemAuthNFT = contracts.getContract("bohemAuthNFT", "coston2");

    const nftId = Number(await BohemAuthNFT._nextTokenId());

    const data = BohemAuthNFT.interface.encodeFunctionData("redeemProduct", [
      listing.Product.fdcProof,
      proof.proof,
      listing.id,
      address,
    ]);

    const transaction = await signer.sendTransaction({
      to: BohemAuthNFT.address,
      data,
      value: 0,
      gasLimit: 4000000,
    });

    await transaction.wait();

    await prisma.listing.update({
      where: {
        id: listing.id,
      },
      data: {
        isClaimed: true,
      },
    });

    await prisma.claim.create({
      data: {
        userId: address,
        nftId: nftId.toString(),
        listingId: listing.id,
      },
    });

    return res.json({
      success: true,
      message: "Listing redeemed successfully",
      listing,
      nftId,
    });
  } catch (error) {
    console.error("Redeem listing error:", error);
    return res.json({
      success: false,
      message: "Failed to redeem listing",
      error: error.message,
    });
  }
};

export { addListing, getAllListings, validateListing, redeemListing };
