// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.24;

import "../lib/openzeppelin-contracts/contracts/interfaces/IERC721.sol";
import {Test, console} from "forge-std/Test.sol";
import {NFTmock} from "./NFTmock.t.sol";
import {Marketplace} from "../src/Marketplace.sol";

contract MarketplaceTest is Test {
    Marketplace marketplace;
    NFTmock nft;

    address owner = vm.addr(1);
    address seller = vm.addr(2);
    address buyer = vm.addr(3);

    struct Listing {
        address nftAddress;
        address seller;
        uint256 tokenId;
        uint256 price;
    }

    function setUp() public {
        vm.startPrank(owner);
        marketplace = new Marketplace();
        vm.stopPrank();

        nft = new NFTmock();
        nft.mint(seller, 0);
        nft.mint(seller, 1);
    }

    function test_deployedContracts() public view {
        assert(address(marketplace) != address(0));
        assert(address(nft) != address(0));
    }

    function test_mintNFT() public view {
        uint256 nftBalance = nft.balanceOf(seller);
        address nftOwner = nft.ownerOf(0);
        assertEq(nftBalance, 2);
        assertEq(nftOwner, seller);
    }

    // List NFT
    function test_listNft() public {
        vm.startPrank(seller);

        (, address sellerBefore,,) = marketplace.listings(address(nft), 0);
        marketplace.listNFT(address(nft), 0, 0.1 ether);
        (, address sellerAfter,,) = marketplace.listings(address(nft), 0);

        vm.stopPrank();

        assertEq(sellerBefore, address(0));
        assertEq(sellerAfter, seller);
    }

    function test_revertListNftIfPrice0() public {
        vm.startPrank(seller);
        vm.expectRevert("Price can't be 0");
        marketplace.listNFT(address(nft), 0, 0);
        vm.stopPrank();
    }

    function test_revertListNftIfNotOwner() public {
        vm.startPrank(owner);
        vm.expectRevert("Only owner can list NFT");
        marketplace.listNFT(address(nft), 0, 0.1 ether);
        vm.stopPrank();
    }

    // Unlist NFT
    function test_unlistNft() public {
        vm.startPrank(seller);

        marketplace.listNFT(address(nft), 0, 0.1 ether);

        (, address sellerBefore,,) = marketplace.listings(address(nft), 0);
        marketplace.unlistNFT(address(nft), 0);
        (, address sellerAfter,,) = marketplace.listings(address(nft), 0);

        assertEq(sellerBefore, seller);
        assertEq(sellerAfter, address(0));

        vm.stopPrank();
    }

    function test_revertUnlistNftIfNotSeller() public {
        vm.startPrank(owner);
        vm.expectRevert("Only Seller can unlist");
        marketplace.unlistNFT(address(nft), 0);
        vm.stopPrank();
    }

    // Buy NFT
    function test_buyNft() public payable {
        uint256 tokenId = 0;
        uint256 nftPrice = 0.1 ether;

        vm.startPrank(seller);
        nft.approve(address(marketplace), tokenId);
        marketplace.listNFT(address(nft), tokenId, nftPrice);
        vm.stopPrank();

        vm.startPrank(buyer);
        vm.deal(buyer, nftPrice);

        uint256 sellerBalanceBefore = seller.balance;
        uint256 feesBefore = address(marketplace).balance;
        marketplace.buyNFT{value: nftPrice}(address(nft), tokenId);
        address nftOwnerAfter = nft.ownerOf(tokenId);
        (, address sellerAfter,,) = marketplace.listings(address(nft), 0);
        uint256 feesAfter = address(marketplace).balance;

        uint256 expectedFees = (nftPrice * marketplace.feeFraction()) / 10000;
        uint256 expectedPayment = nftPrice - expectedFees;
        uint256 sellerBalanceAfter = seller.balance;

        vm.stopPrank();

        assertEq(sellerAfter, address(0)); //listing deleted
        assertEq(sellerBalanceAfter, sellerBalanceBefore + expectedPayment); // seller payed
        assertEq(nftOwnerAfter, buyer); // buyer received NFT
        assertEq(expectedFees, feesAfter - feesBefore); // marketplace fees collected
    }

    function test_revertBuyNftIfNotListed() public payable {
        vm.deal(buyer, 0.2 ether);

        vm.startPrank(buyer);
        vm.expectRevert("Not listed");
        marketplace.buyNFT(address(nft), 1);
        vm.stopPrank();
    }

    function test_revertBuyNftIfNotEnoughEth() public payable {
        uint256 tokenId = 0;
        uint256 nftPrice = 0.1 ether;

        vm.deal(buyer, nftPrice);
        vm.startPrank(seller);
        marketplace.listNFT(address(nft), tokenId, nftPrice);
        vm.stopPrank();

        vm.startPrank(buyer);
        vm.expectRevert("Incorrect ETH amount");
        marketplace.buyNFT{value: nftPrice - 1}(address(nft), tokenId);
        vm.stopPrank();
    }

    // Withdraw Fees
    function test_withdrawFees() public {
        uint256 tokenId = 0;
        uint256 nftPrice = 0.1 ether;

        vm.startPrank(seller);
        marketplace.listNFT(address(nft), tokenId, nftPrice);
        nft.approve(address(marketplace), tokenId);
        vm.stopPrank();

        vm.startPrank(buyer);
        vm.deal(buyer, nftPrice);
        marketplace.buyNFT{value: nftPrice}(address(nft), tokenId);
        vm.stopPrank();

        vm.startPrank(owner);

        uint256 balanceOwnerBefore = owner.balance;
        uint256 feesBefore = address(marketplace).balance;
        marketplace.withdrawFees();
        uint256 balanceOwnerAfter = owner.balance;
        uint256 feesAfter = address(marketplace).balance;
        uint256 expectedFees = (nftPrice * marketplace.feeFraction()) / 10000;

        vm.stopPrank();

        assertEq(feesBefore - expectedFees, feesAfter);
        assertEq(balanceOwnerAfter, balanceOwnerBefore + expectedFees);
    }

    function test_revertWithdrawFeesIfNotOwner() public {
        vm.startPrank(seller);
        vm.expectRevert();
        marketplace.withdrawFees();
        vm.stopPrank();
    }

    function test_buyNftErrors() public payable {
        uint256 tokenId = 0;
        uint256 nftPrice = 0.1 ether;

        vm.startPrank(seller);
        nft.approve(address(marketplace), tokenId);
        marketplace.listNFT(address(nft), tokenId, nftPrice);
        vm.stopPrank();

        vm.startPrank(buyer);
        vm.deal(buyer, nftPrice);

        uint256 feesBefore = address(marketplace).balance;
        marketplace.buyNFT{value: nftPrice}(address(nft), tokenId);

        address nftOwnerAfter = nft.ownerOf(tokenId);
        (, address sellerAfter,,) = marketplace.listings(address(nft), 0);
        uint256 feesAfter = address(marketplace).balance;

        uint256 expectedFees = (nftPrice * marketplace.feeFraction()) / 10000;

        vm.stopPrank();

        assertEq(sellerAfter, address(0)); //listing deleted
        // assertEq(sellerBalanceAfter, sellerBalanceBefore + expectedPayment); // seller payed
        assertEq(nftOwnerAfter, buyer); // buyer received NFT
        assertEq(expectedFees, feesAfter - feesBefore); // marketplace fees collected
    }
}
