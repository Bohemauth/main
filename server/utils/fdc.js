import axios from "axios";
import dotenv from "dotenv";
import contracts from "../lib/config.js";
import chains from "../lib/chains.js";
import wallet from "../lib/wallet.js";
import { ethers } from "ethers";
dotenv.config();

// Request data
const apiUrl = "https://jsonplaceholder.typicode.com/todos/1";
const postprocessJq = `{
    userId: .userId | tonumber,
    id: .id | tonumber,
    title: .title,
    completed: .completed
}`;
const abiSignature = `{
    "components": [
        {"internalType": "uint8","name": "userId","type": "uint8"},
        {"internalType": "uint8","name": "id","type": "uint8"},
        {"internalType": "string","name": "title","type": "string"},
        {"internalType": "bool","name": "completed","type": "bool"}
    ],
    "name": "task",
    "type": "tuple"
}`;

// Configuration constants
const attestationTypeBase = "IJsonApi";
const sourceIdBase = "WEB2";
const verifierUrlBase = process.env.JQ_VERIFIER_URL_TESTNET;

const prepareAttestationRequest = async (
  apiUrl,
  postprocessJq,
  abiSignature
) => {
  const requestBody = {
    url: apiUrl,
    postprocessJq: postprocessJq,
    abi_signature: abiSignature,
  };

  const url = `${verifierUrlBase}JsonApi/prepareRequest`;
  const apiKey = process.env.JQ_VERIFIER_API_KEY_TESTNET;

  const attestationType = toUtf8HexString(attestationTypeBase);
  const sourceId = toUtf8HexString(sourceIdBase);

  const request = {
    attestationType: attestationType,
    sourceId: sourceId,
    requestBody: requestBody,
  };

  console.log("Prepared request:\n", request, "\n");

  const response = await axios.post(url, request, {
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

const calculateRoundId = async (receipt) => {
  const flareSystemsManager = contracts.getContract(
    "flareSystemsManager",
    "coston2"
  );

  const chainConfig = chains.getChain("coston2");
  const provider = new ethers.providers.JsonRpcProvider(chainConfig.rpcUrl);

  const blockNumber = receipt.blockNumber;
  const block = await provider.getBlock(blockNumber);
  const blockTimestamp = BigInt(block.timestamp);

  const firsVotingRoundStartTs = BigInt(
    await flareSystemsManager.firstVotingRoundStartTs()
  );
  const votingEpochDurationSeconds = BigInt(
    await flareSystemsManager.votingEpochDurationSeconds()
  );

  console.log("Block timestamp:", blockTimestamp, "\n");
  console.log("First voting round start ts:", firsVotingRoundStartTs, "\n");
  console.log(
    "Voting epoch duration seconds:",
    votingEpochDurationSeconds,
    "\n"
  );

  const roundId = Number(
    (blockTimestamp - firsVotingRoundStartTs) / votingEpochDurationSeconds
  );
  console.log("Calculated round id:", roundId, "\n");
  console.log(
    "Received round id:",
    Number(await flareSystemsManager.getCurrentVotingEpochId()),
    "\n"
  );

  return roundId;
};

const submitAttestationRequest = async (abiEncodedRequest) => {
  const fdcHub = contracts.getContract("fdcHub", "coston2");
  const feeConfiguration = await fdcHub.fdcRequestFeeConfigurations();
  console.log("Fee configuration:\n", feeConfiguration, "\n");

  const fdcRequestFeeConfigurations = contracts.getContractByAddress(
    "fdcRequestFeeConfigurations",
    "coston2",
    feeConfiguration
  );
  const fee = await fdcRequestFeeConfigurations.getRequestFee(
    abiEncodedRequest
  );
  console.log("Fee:\n", Number(fee), "\n");

  const signer = wallet.getWallet("coston2");

  const data = fdcHub.interface.encodeFunctionData("requestAttestation", [
    abiEncodedRequest,
  ]);

  const transaction = {
    to: fdcHub.address,
    data: data,
    value: fee,
  };

  const tx = await signer.sendTransaction(transaction);
  const receipt = await tx.wait();

  const roundId = await calculateRoundId(receipt);
  return roundId;
};

const retrieveDataAndProof = async (abiEncodedRequest, roundId) => {
  console.log("Waiting for the round to finalize...");

  const relay = contracts.getContract("relay", "coston2");

  while (!(await relay.isFinalized(200, roundId))) {
    await sleep(30000);
  }

  console.log("Round finalized!\n");

  const request = {
    votingRoundId: roundId,
    requestBytes: abiEncodedRequest,
  };
  console.log("Prepared request:\n", request, "\n");

  const url = `${process.env.COSTON2_DA_LAYER_URL}api/v1/fdc/proof-by-request-round-raw`;

  await sleep(10000);
  let proof = await postRequestToDALayer(url, request, true);
  console.log("Waiting for the DA Layer to generate the proof...");
  while (proof.response_hex == undefined) {
    await sleep(10000);
    proof = await postRequestToDALayer(url, request, false);
  }
  console.log("Proof generated!\n");

  console.log("Proof:", proof, "\n");
  return proof;
};

async function postRequestToDALayer(url, request, watchStatus = false) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      //   "X-API-KEY": "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  if (watchStatus && response.status != 200) {
    throw new Error(
      `Response status is not OK, status ${response.status} ${response.statusText}\n`
    );
  } else if (watchStatus) {
    console.log("Response status is OK\n");
  }
  return await response.json();
}

const main = async (req, res) => {
  try {
    const data = await prepareAttestationRequest(
      apiUrl,
      postprocessJq,
      abiSignature
    );

    const abiEncodedRequest = data.abiEncodedRequest;
    console.log("Abi encoded request:\n", abiEncodedRequest, "\n");
    const roundId = await submitAttestationRequest(abiEncodedRequest);

    const proof = await retrieveDataAndProof(abiEncodedRequest, roundId);

    return res.json({
      success: true,
      data,
      proof,
      roundId,
      message: "FDC endpoint reached",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

function toHex(data) {
  var result = "";
  for (var i = 0; i < data.length; i++) {
    result += data.charCodeAt(i).toString(16);
  }
  return result.padEnd(64, "0");
}

function toUtf8HexString(data) {
  return "0x" + toHex(data);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { main };
