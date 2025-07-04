import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

interface ListingEvent {
  seller: string;
  nftAddress: string;
  tokenId: string;
  price: string;
}

/**
 * Decode a single listing event log.
 * Assumes:
 *  - topics[1] is the seller (padded 32 bytes)
 *  - topics[2] is the nftAddress (padded 32 bytes)
 *  - topics[3] is the tokenId (encoded as uint256)
 *  - data contains the price (encoded as uint256)
 */

function decodeListingEvent(log: { data: string; topics: string[] }): ListingEvent {
    // Extract seller and nftAddress by removing the padding.
    // Addresses are padded to 32 bytes (64 hex characters) but the address is the last 40 hex characters.
    const seller = '0x' + log.topics[1].slice(-40);
    const nftAddress = '0x' + log.topics[2].slice(-40);
    // Decode tokenId and price from hex to a decimal string.
    const tokenId = ethers.parseUnits(log.topics[3], 0).toString();
    const price = ethers.parseUnits(log.data, 0).toString();
  
    return { seller, nftAddress, tokenId, price };
  }