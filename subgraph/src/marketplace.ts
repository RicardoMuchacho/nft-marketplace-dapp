import {
  boughtNFT as boughtNFTEvent,
  listed as listedEvent,
  unlisted as unlistedEvent
} from "../generated/Marketplace/Marketplace"
import {
  Listing
} from "../generated/schema"
import { store } from '@graphprotocol/graph-ts'

export function handlelisted(event: listedEvent): void {
  let id = event.params.nftAddress.toHex() + "-" + event.params.tokenId.toString();
  let entity = new Listing(id)

  entity.seller = event.params.seller
  entity.nftAddress = event.params.nftAddress
  entity.tokenId = event.params.tokenId
  entity.price = event.params.price

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleboughtNFT(event: boughtNFTEvent): void {
    let id = event.params.listing.nftAddress.toHex() + "-" + event.params.listing.tokenId.toString();
    store.remove("Listing", id);
  }

export function handleunlisted(event: unlistedEvent): void {
  let id = event.params.listing.nftAddress.toHex() + "-" + event.params.listing.tokenId.toString();
  store.remove("Listing", id);
}
