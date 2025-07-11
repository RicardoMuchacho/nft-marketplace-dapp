import React from "react";
import { TabsContent } from "@/components/ui/tabs"
import NFTBuyCard from "./nft-buy-card";
import { Listing, useGetListings } from "@/hooks/useGetListings";

const MarketplaceNftsTab = () => {
    const { data, isLoading } = useGetListings()

    return (
        <TabsContent value="marketplace" className="space-y-4">
            {isLoading ? (
                <div className="text-center py-12">Loading NFTs...</div>
            ) : data?.listings && data.listings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {data.listings.map((listing: Listing) => (
                        <NFTBuyCard
                            key={listing.nftAddress + listing.tokenId}
                            nft={listing}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No NFTs listed in the marketplace</p>
                </div>
            )}
        </TabsContent>
    )
}

export default MarketplaceNftsTab