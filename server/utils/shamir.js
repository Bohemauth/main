import { ethers } from "ethers";
import { Noir } from "@noir-lang/noir_js";
import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import { createRequire } from "node:module";
import crypto from "crypto";
import {
  uint32ArrayToUint8Array,
  uint8ArrayToUint32Array,
} from "./ArrayConversion.js";

const require = createRequire(import.meta.url);

const shamirProve = require("../circuits/shamir_prove.json");
const shamirGenerate = require("../circuits/shamir_generate_2_3.json");
const p2Hash = require("../circuits/p2_hash_32.json");

export const keyToShares = async (privateKey) => {
  const backend = new BarretenbergBackend(shamirGenerate);
  const noir = new Noir(shamirGenerate, backend);

  const secret = ethers.utils.arrayify(privateKey);
  const a1 = generateRandomCoefficients(32);

  const inputs = {
    secret: Array.from(secret),
    a1: a1,
  };

  const { witness, returnValue } = await noir.execute(inputs);

  const shard1 = ethers.utils.hexlify(
    uint32ArrayToUint8Array(
      new Uint32Array(returnValue[0].y.map((x) => Number(x)))
    )
  );

  const shard2 = ethers.utils.hexlify(
    uint32ArrayToUint8Array(
      new Uint32Array(returnValue[1].y.map((x) => Number(x)))
    )
  );

  const shard3 = ethers.utils.hexlify(
    uint32ArrayToUint8Array(
      new Uint32Array(returnValue[2].y.map((x) => Number(x)))
    )
  );

  const shards = {
    shard1,
    shard2,
    shard3,
  };

  return shards;
};

export const getShardHash = async (privateKey) => {
  const backend = new BarretenbergBackend(p2Hash);
  const noir = new Noir(p2Hash, backend);

  const secret = ethers.utils.arrayify(privateKey);

  const inputs = {
    inputs: Array.from(secret),
  };

  const { witness, returnValue } = await noir.execute(inputs);

  return returnValue;
};

function generateRandomCoefficients(count) {
  const prime = 7919;

  const coefficients = [];
  for (let i = 0; i < count; i++) {
    const bytes = crypto.randomBytes(32);
    let num = BigInt("0x" + bytes.toString("hex"));
    coefficients.push((num % BigInt(prime)).toString());
  }
  return coefficients;
}

export const generateProof = async (shares, message, shardHash) => {
  const backend = new BarretenbergBackend(shamirProve);
  const noir = new Noir(shamirProve, backend);

  const inputs = {
    shares: [
      {
        x: 1,
        y: Array.from(
          uint8ArrayToUint32Array(ethers.utils.arrayify(shares.shard1))
        ),
      },
      {
        x: 2,
        y: Array.from(
          uint8ArrayToUint32Array(ethers.utils.arrayify(shares.shard2))
        ),
      },
    ],
    claimId: message,
    hash: shardHash,
  };

  const { witness } = await noir.execute(inputs);
  const rawProof = await backend.generateProof(witness);
  const proof = ethers.utils.hexlify(rawProof.proof);
  return proof;
};
