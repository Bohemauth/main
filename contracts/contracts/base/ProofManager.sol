// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.9.0;
import "./Verifier.sol";
import "../libraries/Conversion.sol";

abstract contract ProofManager is Verifier {
    function verify(
        bytes calldata _proof,
        string calldata claimId,
        bytes32 claimHash,
        address _verifier
    ) internal view returns (bool) {
        bytes32[] memory publicInputs = Conversion.convertToInputs(
            claimId,
            claimHash
        );
        return verifyProof(_proof, publicInputs, _verifier);
    }
}
