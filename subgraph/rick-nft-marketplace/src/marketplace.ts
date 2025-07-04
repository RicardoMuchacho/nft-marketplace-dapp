import {
  OwnershipTransferred as OwnershipTransferredEvent,
  boughtNFT as boughtNFTEvent,
  feesCollected as feesCollectedEvent,
  listed as listedEvent,
  unlisted as unlistedEvent
} from "../generated/Marketplace/Marketplace"
import {
  OwnershipTransferred,
  boughtNFT,
  feesCollected,
  listed,
  unlisted
} from "../generated/schema"

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleboughtNFT(event: boughtNFTEvent): void {
  let entity = new boughtNFT(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.buyer = event.params.buyer
  entity.listing_nftAddress = event.params.listing.nftAddress
  entity.listing_seller = event.params.listing.seller
  entity.listing_tokenId = event.params.listing.tokenId
  entity.listing_price = event.params.listing.price
  entity.fees = event.params.fees

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlefeesCollected(event: feesCollectedEvent): void {
  let entity = new feesCollected(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.fees = event.params.fees

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlelisted(event: listedEvent): void {
  let entity = new listed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.seller = event.params.seller
  entity.nftAddress = event.params.nftAddress
  entity.tokenId = event.params.tokenId
  entity.price = event.params.price

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleunlisted(event: unlistedEvent): void {
  let entity = new unlisted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.seller = event.params.seller
  entity.listing_nftAddress = event.params.listing.nftAddress
  entity.listing_seller = event.params.listing.seller
  entity.listing_tokenId = event.params.listing.tokenId
  entity.listing_price = event.params.listing.price

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
