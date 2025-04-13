import { ethers } from "ethers";

const verifySignature = async (domain, types, message, signature, address) => {
  const hash = ethers.utils._TypedDataEncoder.hash(domain, types, message);

  // Try both recovery values (0 and 1)
  let isValid = false;

  // If signature is a hex string without v
  if (signature.startsWith("0x") && signature.length === 128 + 2) {
    // 0x + 64 bytes
    // Try both possible v values (27 and 28)
    for (const v of [27, 28]) {
      try {
        // Add the v value to the signature
        const fullSig = signature + v.toString(16).padStart(2, "0");
        const recoveredAddress = ethers.utils.recoverAddress(hash, fullSig);

        if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
          isValid = true;
          break;
        }
      } catch (error) {
        console.log("Recovery attempt failed:", error.message);
      }
    }
  } else {
    // Attempt to use the signature as-is
    try {
      const recoveredAddress = ethers.utils.recoverAddress(hash, signature);
      isValid = recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
      console.log("Standard recovery failed:", error.message);
    }
  }

  if (!isValid) {
    return false;
  }

  return true;
};

export { verifySignature };
