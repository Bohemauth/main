import prisma from "../utils/prisma.js";
import { verifySignature } from "../utils/signature.js";

const getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        address: req.params.address,
      },
    });
    return res.json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, description, role, address, signature } = req.body;

    if (!name || !description || !role || !address || !signature) {
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
      NewUser: [
        { name: "name", type: "string" },
        { name: "description", type: "string" },
        { name: "role", type: "string" },
      ],
    };

    const message = {
      name,
      description,
      role,
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

    const user = await prisma.user.create({
      data: {
        address,
        name,
        description,
        role,
      },
    });

    return res.json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Failed to create user",
    });
  }
};

export { getUser, createUser };
