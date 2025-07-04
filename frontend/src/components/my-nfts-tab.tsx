import React, { useState } from "react";
import { OwnedNft } from "alchemy-sdk";
import NFTOwnedCard from "./nft-owned-card";
import { TabsContent } from "@/components/ui/tabs"
import ListNFTDialog from "./list-nft-dialog";
import useGetMyNfts from "@/hooks/useGetMyNfts";

interface MyNftsTabProps {
    myNfts: OwnedNft[];
    loading: boolean;
}

const MyNftsTab = ({ myNfts, loading }: MyNftsTabProps) => {
    const [selectedNft, setSelectedNft] = useState<OwnedNft | null>(null)

    const handleListNFT = (nft: OwnedNft) => {
        setSelectedNft(nft);
    }

    return (
        <TabsContent value="my-nfts" className="space-y-4">
            {loading ? (
                <div className="text-center py-12">Loading your NFTs...</div>
            ) : myNfts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {myNfts.map((nft, i) => (
                        <NFTOwnedCard key={nft.tokenId + i} nft={nft} handleListNFT={handleListNFT} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">You don't own any NFTs yet</p>
                </div>
            )}
            <ListNFTDialog nft={selectedNft} onSuccess={() => setSelectedNft(null)} onClose={() => setSelectedNft(null)} />
        </TabsContent>
    )
}


export default MyNftsTab