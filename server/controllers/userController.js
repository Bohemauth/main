import { ethers } from "ethers";
import prisma from "../utils/prisma.js";

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

    const recoveredAddress = ethers.utils.verifyTypedData(
      domain,
      types,
      message,
      signature
    );

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
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
