import React, { useState, useEffect } from "react";
import { Nft, OwnedNft } from "alchemy-sdk";
import NFTCard from "./nft-buy-card";
import { TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAccount } from "wagmi";
import { alchemy } from '@/lib/alchemyClient';
import { Plus } from "lucide-react"
import NFTBuyCard from "./nft-buy-card";

const MarketplaceNftsTab = () => {

    const [nfts, setNfts] = useState<Nft[]>([])
    const [loading, setLoading] = useState(true)

    const { address: userAddress, isConnected } = useAccount()

    useEffect(() => {
        if (!userAddress) return;

        const fetchNFTs = async () => {
            try {
                // Fetch NFTs for the provided wallet address.
                const response = await alchemy.nft.getNftsForOwner(userAddress);
                setNfts(response.ownedNfts);
            } catch (err: any) {
                console.error('Error fetching NFTs:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchNFTs();
    }, [userAddress]);


    return (
        <TabsContent value="marketplace" className="space-y-4">
            {loading ? (
                <div className="text-center py-12">Loading NFTs...</div>
            ) : nfts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {nfts.map((nft) => (
                        <NFTBuyCard
                            nft={nft}
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