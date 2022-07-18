// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "openzeppelin-solidity/contracts/utils/cryptography/ECDSA.sol";

contract Algoz {
    using ECDSA for bytes32;

    mapping(bytes32 => bool) public consumed_tokenId;
    address public tokenId_verifier_update_authority;
    address public tokenId_verifier;

    bool public verify_enabled;

    modifier restricted() {
        require(
            msg.sender == tokenId_verifier_update_authority,
            "This function is restricted to the contract's owner"
        );
        _;
    }

    constructor(address initial_tokenId_verifier) {
        tokenId_verifier_update_authority = msg.sender;
        tokenId_verifier = initial_tokenId_verifier;
        verify_enabled = true;
    }

    function update_tokenId_verifier_update_authority(address new_tokenId_verifier_update_authority) public restricted {
        tokenId_verifier_update_authority = new_tokenId_verifier_update_authority;
    }

    function update_tokenId_verifier(address new_tokenId_verifier) public restricted {
        tokenId_verifier = new_tokenId_verifier;
    }

    function toggle_verify_enabled() public restricted {
        verify_enabled = !verify_enabled;
    }

    function validate_token(bytes32 tokenId, bytes calldata tokenId_proof) public {
        if(!verify_enabled) return; // skip verification if verify_enabled is false
        require(!consumed_tokenId[tokenId]); // verify if the tokenId has been used in the past
        require(tokenId.recover(tokenId_proof) == tokenId_verifier); // verify if the tokenId has been used in the past
        consumed_tokenId[tokenId] = true;
    }
    
}