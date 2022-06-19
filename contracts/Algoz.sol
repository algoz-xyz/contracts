// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "openzeppelin-solidity/contracts/utils/cryptography/MerkleProof.sol";

contract Algoz {
    mapping(bytes32 => mapping(bytes32 => bool)) public consumed_tokenId;
    address public owner;
    bytes32 public merkle_root;

    modifier restricted() {
        require(
            msg.sender == owner,
            "This function is restricted to the contract's owner"
        );
        _;
    }

    constructor(bytes32 initial_merkle_root) {
        owner = msg.sender;
        merkle_root = initial_merkle_root;
    }

    function update_ownership(address new_owner) public restricted {
        owner = new_owner;
    }

    function update_merkle_root(bytes32 new_merkle_root) public restricted {
        merkle_root = new_merkle_root;
    }

    // function used to validate if a captcha is valid
    function validate_token(bytes32 tokenId, bytes32[] calldata proof) public {
        require(MerkleProof.verify(proof, merkle_root, tokenId)); // verify merkle proof of tokenId
        require(!consumed_tokenId[merkle_root][tokenId]); // verify if the tokenId has been used in the past
        consumed_tokenId[merkle_root][tokenId] = true;
    }
}
