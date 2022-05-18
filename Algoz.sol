// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Algoz {
    mapping(bytes32 => mapping(bytes32 => bool)) public consumed_tokenId;
    address public owner;
    bytes32 public merkle_root;

    constructor(bytes32 initial_merkle_root) { 
        owner = msg.sender;
        merkle_root = initial_merkle_root;
    }

    function update_ownership(address new_owner) public {
        require(msg.sender == owner); // verify contract ownership
        owner = new_owner;
    }

    function update_merkle_root(bytes32 new_merkle_root) public {
        require(msg.sender == owner); // verify contract ownership
        merkle_root = new_merkle_root;
    }

    // function used to validate if a captcha is valid
    function validate_captcha(bytes32 tokenId, bytes32[] calldata proof) public {
        require(MerkleProof.verify(proof, merkle_root, tokenId)); // verify merkle proof of tokenId
        require(!consumed_tokenId[merkle_root][tokenId]); // verify if the tokenId has been used in the past
        consumed_tokenId[merkle_root][tokenId] = true;
    }
}