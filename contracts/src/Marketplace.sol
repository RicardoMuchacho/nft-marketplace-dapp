// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.24;

import "../lib/openzeppelin-contracts/contracts/interfaces/IERC721.sol";
import "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import "../lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import {Strings} from "../lib/openzeppelin-contracts/contracts/utils/Strings.sol";

contract Marketplace is Ownable, ReentrancyGuard {
    using Strings for uint256;

    uint256 public feeFraction = 500; //5%
    uint256 public collectedFees;

    struct Listing {
        address nftAddress;
        address seller;
        uint256 tokenId;
        uint256 price;
    }

    // Nested mapping
    mapping(address nftAddress => mapping(uint256 tokenId => Listing)) public listings;

    event listed(address indexed seller, address indexed nftAddress, uint256 indexed tokenId, uint256 price);
    event unlisted(address indexed seller, Listing listing);
    event boughtNFT(address buyer, Listing listing, uint256 fees);
    event feesCollected(uint256 fees);

    constructor() Ownable(msg.sender) {}

    // List NFT
    function listNFT(address nftAddress_, uint256 tokenId_, uint256 price_) external nonReentrant {
        require(price_ > 0, "Price can't be 0");
        require(IERC721(nftAddress_).ownerOf(tokenId_) == msg.sender, "Only owner can list NFT");

        Listing memory listing_ =
            Listing({nftAddress: nftAddress_, seller: msg.sender, tokenId: tokenId_, price: price_});

        listings[listing_.nftAddress][listing_.tokenId] = listing_;

        emit listed(msg.sender, nftAddress_, tokenId_, price_);
    }

    // Unlist NFT
    function unlistNFT(address contract_, uint256 tokenId_) external nonReentrant {
        Listing memory currentListing = listings[contract_][tokenId_];

        require(msg.sender == currentListing.seller, "Only Seller can unlist");

        delete listings[contract_][tokenId_];

        emit unlisted(msg.sender, currentListing);
    }

    // Buy NFT
    function buyNFT(address nftAddress_, uint256 tokenId_) external payable nonReentrant {
        Listing memory currentListing = listings[nftAddress_][tokenId_];

        require(currentListing.seller != address(0), "Not listed");
        require(msg.value == currentListing.price, "Incorrect ETH amount");

        delete listings[nftAddress_][tokenId_];

        // transferNFT
        IERC721(nftAddress_).safeTransferFrom(currentListing.seller, msg.sender, currentListing.tokenId);

        // distribute ETH to seller and apply fees
        uint256 fees = (currentListing.price * 500) / 10000;
        collectedFees += fees;
        (bool success,) = currentListing.seller.call{value: currentListing.price - fees}("");
        if (!success) revert();

        emit boughtNFT(msg.sender, currentListing, fees);
    }

    function withdrawFees() external onlyOwner {
        uint256 currentFees = collectedFees;
        collectedFees = 0;
        (bool success,) = owner().call{value: currentFees}("");
        if (!success) revert();

        emit feesCollected(currentFees);
    }
}