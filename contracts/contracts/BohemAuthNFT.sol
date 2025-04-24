// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721URIStorage, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {IBohemAuth} from "./interfaces/IBohemAuth.sol";
import {IJsonApi} from "@flarenetwork/flare-periphery-contracts/coston2/IJsonApi.sol";

contract BohemAuthNFT is ERC721URIStorage {
    uint256 public _nextTokenId;

    IBohemAuth public bohemAuth;

    mapping(string => bool) public usedClaimIds;

    struct DataTransportObject {
        string id;
        string name;
        string description;
        string image;
        string productHash;
        string uri;
    }

    constructor(address _bohemAuth) ERC721("BohemAuth", "Bohem") {
        bohemAuth = IBohemAuth(_bohemAuth);
    }

    function redeemProduct(
        IJsonApi.Proof calldata _proof,
        bytes calldata proof,
        string calldata claimId,
        address recipient
    ) public {
        require(
            bohemAuth.verifyProductClaim(_proof, proof, claimId),
            "Invalid proof"
        );

        DataTransportObject memory dto = abi.decode(
            _proof.data.responseBody.abi_encoded_data,
            (DataTransportObject)
        );

        require(!usedClaimIds[claimId], "ClaimId already used");
        usedClaimIds[claimId] = true;

        uint256 tokenId = _nextTokenId++;
        _mint(recipient, tokenId);
        _setTokenURI(tokenId, dto.uri);
    }
}
