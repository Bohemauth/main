// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library Conversion {
    function convertToInputs(
        string memory claimId,
        bytes32 claimHash
    ) internal pure returns (bytes32[] memory) {
        bytes32[] memory publicInputs = new bytes32[](37);

        bytes32[] memory bytesArray = stringToByteArray(claimId);

        for (uint256 i = 0; i < 36; i++) {
            publicInputs[i] = bytesArray[i];
        }

        publicInputs[36] = claimHash;

        return publicInputs;
    }

    function stringToByteArray(
        string memory input
    ) internal pure returns (bytes32[] memory) {
        bytes memory stringBytes = bytes(input);
        uint256 length = stringBytes.length;

        bytes32[] memory result = new bytes32[](length);

        for (uint256 i = 0; i < length; i++) {
            // Convert each byte to a bytes32 value
            // This pads it with zeros to fill the 32 bytes
            result[i] = bytes32(uint256(uint8(stringBytes[i])));
        }

        return result;
    }

    // Helper function to test the output
    function getStringBytes(
        string memory input
    ) internal pure returns (bytes memory) {
        return bytes(input);
    }

    function hexStringToBytes32(
        string memory hexString
    ) internal pure returns (bytes32) {
        // Remove "0x" prefix if present
        bytes memory hexBytes = bytes(hexString);
        uint start = 0;
        if (
            hexBytes.length >= 2 &&
            hexBytes[0] == 0x30 &&
            (hexBytes[1] == 0x78 || hexBytes[1] == 0x58)
        ) {
            start = 2;
        }

        require(hexBytes.length - start == 64, "Invalid hex string length");

        bytes32 result = 0;
        for (uint i = 0; i < 32; i++) {
            // For each byte (2 hex characters)
            uint8 highNibble = parseHexChar(uint8(hexBytes[start + i * 2]));
            uint8 lowNibble = parseHexChar(uint8(hexBytes[start + i * 2 + 1]));

            // Combine into byte and shift into position
            uint8 byteValue = (highNibble << 4) | lowNibble;

            // Place the byte in the correct position in the bytes32
            result = bytes32(
                uint256(result) | (uint256(byteValue) << (8 * (31 - i)))
            );
        }

        return result;
    }

    function parseHexChar(uint8 c) internal pure returns (uint8) {
        // '0' to '9'
        if (c >= 48 && c <= 57) {
            return c - 48;
        }
        // 'a' to 'f'
        if (c >= 97 && c <= 102) {
            return c - 97 + 10;
        }
        // 'A' to 'F'
        if (c >= 65 && c <= 70) {
            return c - 65 + 10;
        }
        revert("Invalid hex character");
    }
}
