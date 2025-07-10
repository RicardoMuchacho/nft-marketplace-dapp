import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  OwnershipTransferred,
  boughtNFT,
  feesCollected,
  listed,
  unlisted
} from "../generated/Marketplace/Marketplace"

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createboughtNFTEvent(
  buyer: Address,
  listing: ethereum.Tuple,
  fees: BigInt
): boughtNFT {
  let boughtNftEvent = changetype<boughtNFT>(newMockEvent())

  boughtNftEvent.parameters = new Array()

  boughtNftEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  boughtNftEvent.parameters.push(
    new ethereum.EventParam("listing", ethereum.Value.fromTuple(listing))
  )
  boughtNftEvent.parameters.push(
    new ethereum.EventParam("fees", ethereum.Value.fromUnsignedBigInt(fees))
  )

  return boughtNftEvent
}

export function createfeesCollectedEvent(fees: BigInt): feesCollected {
  let feesCollectedEvent = changetype<feesCollected>(newMockEvent())

  feesCollectedEvent.parameters = new Array()

  feesCollectedEvent.parameters.push(
    new ethereum.EventParam("fees", ethereum.Value.fromUnsignedBigInt(fees))
  )

  return feesCollectedEvent
}

export function createlistedEvent(
  seller: Address,
  nftAddress: Address,
  tokenId: BigInt,
  price: BigInt
): listed {
  let listedEvent = changetype<listed>(newMockEvent())

  listedEvent.parameters = new Array()

  listedEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  listedEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  listedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  listedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return listedEvent
}

export function createunlistedEvent(
  seller: Address,
  listing: ethereum.Tuple
): unlisted {
  let unlistedEvent = changetype<unlisted>(newMockEvent())

  unlistedEvent.parameters = new Array()

  unlistedEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  unlistedEvent.parameters.push(
    new ethereum.EventParam("listing", ethereum.Value.fromTuple(listing))
  )

  return unlistedEvent
}
