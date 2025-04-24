// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.9.0;

import {IJsonApi} from "@flarenetwork/flare-periphery-contracts/coston2/IJsonApi.sol";

interface IBohemAuth {
    // Structs
    struct Product {
        string name;
        string description;
        string image;
        bytes32 productHash;
        string uri;
    }

    struct DataTransportObject {
        string id;
        string name;
        string description;
        string image;
        string productHash;
        string uri;
    }

    // Events
    event ProductAdded(string id, string productHash, string uri);

    // View functions
    function products(
        string calldata id
    )
        external
        view
        returns (
            string memory name,
            string memory description,
            string memory image,
            bytes32 productHash,
            string memory uri
        );

    function verifyProductClaim(
        IJsonApi.Proof calldata _proof,
        bytes calldata proof,
        string calldata claimId
    ) external view returns (bool);

    // State-changing functions
    function addProduct(IJsonApi.Proof calldata data) external;
}
