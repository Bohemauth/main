import { createRequire } from "module";
const require = createRequire(import.meta.url);

const IFdcHub = require("./contracts/IFdcHub.json");
const IFdcRequestFeeConfigurations = require("./contracts/IFdcRequestFeeConfigurations.json");
const IFflareSystemsManager = require("./contracts/IFlareSystemsManager.json");
const IRelay = require("./contracts/IRelay.json");
import chains from "./chains.js";
import ethers from "ethers";

const contracts = {
  data: [
    {
      name: "fdcHub",
      address: "0x48aC463d7975828989331F4De43341627b9c5f1D",
      chain: "coston2",
      abi: IFdcHub.abi,
    },
    {
      name: "fdcRequestFeeConfigurations",
      address: null,
      chain: "coston2",
      abi: IFdcRequestFeeConfigurations.abi,
    },
    {
      name: "flareSystemsManager",
      address: "0xA90Db6D10F856799b10ef2A77EBCbF460aC71e52",
      chain: "coston2",
      abi: IFflareSystemsManager.abi,
    },
    {
      name: "relay",
      address: "0x97702e350CaEda540935d92aAf213307e9069784",
      chain: "coston2",
      abi: IRelay.abi,
    },
  ],

  getContract: (name, chain) => {
    const chainConfig = chains.getChain(chain);
    const contractConfig = contracts.data.find(
      (contract) =>
        contract.name === name && contract.chain === chainConfig.name
    );

    const provider = new ethers.providers.JsonRpcProvider(chainConfig.rpcUrl);
    const contract = new ethers.Contract(
      contractConfig.address,
      contractConfig.abi,
      provider
    );

    return contract;
  },

  getContractByAddress: (name, chain, address) => {
    const chainConfig = chains.getChain(chain);
    const contractConfig = contracts.data.find(
      (contract) =>
        contract.name === name && contract.chain === chainConfig.name
    );

    const provider = new ethers.providers.JsonRpcProvider(chainConfig.rpcUrl);
    const contract = new ethers.Contract(address, contractConfig.abi, provider);

    return contract;
  },
};

export default contracts;
