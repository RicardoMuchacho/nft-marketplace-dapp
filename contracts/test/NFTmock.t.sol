// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.24;

import "../lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import {Test, console} from "forge-std/Test.sol";

contract NFTmock is ERC721 {
    constructor() ERC721("NFT mock", "NFTM") {}

    // mint NFT
    function mint(address to, uint256 tokenId_) external {
        _mint(to, tokenId_);
    }
}
