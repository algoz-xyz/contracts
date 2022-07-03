// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "openzeppelin-solidity/contracts/utils/cryptography/MerkleProof.sol";

contract Algoz {
    mapping(bytes32 => mapping(bytes32 => bool)) public consumed_tokenId;
    address public owner;
    bytes32 public merkle_root;
    uint256 public merkle_proof_length;

    modifier restricted() {
        require(
            msg.sender == owner,
            "This function is restricted to the contract's owner"
        );
        _;
    }

    constructor(bytes32 new_merkle_root, uint256 new_merkle_proof_length) {
        owner = msg.sender;
        update_merkle_root(new_merkle_root, new_merkle_proof_length);
    }

    function update_ownership(address new_owner) public restricted {
        owner = new_owner;
    }

    function update_merkle_root(bytes32 new_merkle_root, uint256 new_merkle_proof_length) public restricted {
        merkle_root = new_merkle_root;
        merkle_proof_length = new_merkle_proof_length;
    }

    // function used to validate if a captcha is valid
    function validate_token(bytes32 tokenId, bytes32[] calldata proof) public {
        require(MerkleProof.verify(proof, merkle_root, tokenId)); // verify merkle proof of tokenId
        require(!consumed_tokenId[merkle_root][tokenId]); // verify if the tokenId has been used in the past
        require(merkle_proof_length==proof.length); // validate merkle_proof_length
        consumed_tokenId[merkle_root][tokenId] = true;
        consumed_tokenId[merkle_root][proof[0]] = true;
    }
}
