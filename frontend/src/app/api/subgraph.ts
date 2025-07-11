import { gql, request } from 'graphql-request'

const GET_LISTINGS = gql`{
  listings(first: 20) {
    id
    seller
    nftAddress
    tokenId
    price
    transactionHash
  }
}`
const url = "https://api.studio.thegraph.com/query/115498/rick-nft-marketplace/version/latest"
const headers = { Authorization: `Bearer ${process.env.NEXT_SUBGRAPH_API_KEY}` }

export async function getListings() {
    return request(url, GET_LISTINGS, {}, headers)
}

      