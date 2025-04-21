// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.9.0;

import {ContractRegistry} from "@flarenetwork/flare-periphery-contracts/coston/ContractRegistry.sol";
import {IFdcVerification} from "@flarenetwork/flare-periphery-contracts/coston/IFdcVerification.sol";
import {IJsonApi} from "@flarenetwork/flare-periphery-contracts/coston/IJsonApi.sol";
import {Conversion} from "./libraries/Conversion.sol";
import {ProofManager} from "./base/ProofManager.sol";

contract BohemAuth is ProofManager {
    struct Product {
        bytes32 productHash;
        string uri;
    }

    struct DataTransportObject {
        string id;
        string productHash;
        string uri;
    }

    event ProductAdded(string id, string productHash, string uri);

    mapping(string => Product) public products;

    address private indexer;

    address private verifier;

    constructor(address _verifier) {
        indexer = msg.sender;
        verifier = _verifier;
    }

    modifier onlyIndexer() {
        require(msg.sender == indexer, "Not authorized");
        _;
    }

    function isJsonApiProofValid(
        IJsonApi.Proof calldata _proof
    ) private view returns (bool) {
        // Inline the check for now until we have an official contract deployed
        return
            ContractRegistry.auxiliaryGetIJsonApiVerification().verifyJsonApi(
                _proof
            );
    }

    function addProduct(IJsonApi.Proof calldata data) public onlyIndexer {
        require(isJsonApiProofValid(data), "Invalid proof");

        DataTransportObject memory dto = abi.decode(
            data.data.responseBody.abi_encoded_data,
            (DataTransportObject)
        );

        products[dto.id] = Product({
            productHash: Conversion.hexStringToBytes32(dto.productHash),
            uri: dto.uri
        });

        emit ProductAdded(dto.id, dto.productHash, dto.uri);
    }

    function verifyProductClaim(
        string calldata productId,
        bytes calldata proof,
        string calldata claimId
    ) public view returns (bool) {
        Product memory product = products[productId];

        return verify(proof, claimId, product.productHash, verifier);
    }
}
