import { ethers } from "ethers";
import chains from "./chains.js";
import dotenv from "dotenv";

dotenv.config();

const wallet = {
  getWallet: (chain) => {
    const chainConfig = chains.getChain(chain);
    const provider = new ethers.providers.JsonRpcProvider(chainConfig.rpcUrl);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    return wallet;
  },
};

export default wallet;
