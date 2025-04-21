import Queue from "bull";
import prisma from "./prisma.js";
import { v4 as uuidv4 } from "uuid";
import { uploadToSevalla } from "./s3Client.js";
import { decodeResponse, prepareProductProof } from "./fdc.js";
import wallet from "../lib/wallet.js";
import contracts from "../lib/config.js";

const bohemauthQueue = new Queue("bohemauth:queue", {
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
  },
});

const loadQueuedProduct = async () => {
  try {
    const queuedProducts = await prisma.product.findMany({
      where: { status: "QUEUED" },
    });
    queuedProducts.forEach((product) => {
      bohemauthQueue.add({ id: product.id });
    });

    console.log("Loaded queued products:", queuedProducts.length);
  } catch (error) {
    console.error("Error loading queued product:", error);
  }
};

bohemauthQueue.process(async (job) => {
  const { id } = job.data;
  console.log("Processing product:", id);

  await processProduct(id);
});

const processProduct = async (id) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const fileName = uuidv4();

    const data = {
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.image,
      productHash: product.ProductHash,
      uri: `${process.env.PUBLIC_URL}/${fileName}`,
    };

    await uploadToSevalla(
      Buffer.from(JSON.stringify(data)),
      fileName,
      "application/json"
    );

    const apiUrl = `${process.env.PUBLIC_URL}/${fileName}`;

    const payload = await prepareProductProof(apiUrl);

    if (!payload.success) {
      throw new Error(payload.message);
    }

    const signer = wallet.getWallet("coston2");

    const bohemAuthContract = contracts.getContract("bohemAuth", "coston2");

    const decodedResponse = decodeResponse(payload.proof.response_hex);

    const proof = {
      merkleProof: payload.proof.proof,
      data: decodedResponse,
    };

    const addProductData = bohemAuthContract.interface.encodeFunctionData(
      "addProduct",
      [proof]
    );

    const unsignedTx = {
      data: addProductData,
      to: bohemAuthContract.address,
      value: 0,
      gasLimit: 4000000,
    };

    const tx = await signer.sendTransaction(unsignedTx);

    await tx.wait();

    await prisma.product.update({
      where: { id },
      data: {
        status: "LAUNCHED",
        fdcProof: proof,
      },
    });

    console.log("Product launched successfully");
  } catch (error) {
    console.error("Error processing product:", error);
  }
};

export { bohemauthQueue, loadQueuedProduct };
