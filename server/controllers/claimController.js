import prisma from "../utils/prisma.js";

const getUserClaims = async (req, res) => {
  try {
    const { address } = req.params;
    const claims = await prisma.claim.findMany({
      where: {
        userId: address,
      },
      include: {
        Listing: true,
      },
    });

    const claimWithProduct = await Promise.all(
      claims.map(async (claim) => {
        const product = await prisma.product.findUnique({
          where: {
            id: claim.Listing.productId,
          },
        });
        return {
          ...claim,
          Product: product,
        };
      })
    );

    return res.json({
      success: true,
      message: "Claims fetched successfully",
      claims: claimWithProduct,
    });
  } catch (error) {
    console.error("Get user claims error:", error);
    return res.json({
      success: false,
      message: "Failed to get user claims",
      error: error.message,
    });
  }
};

export { getUserClaims };
