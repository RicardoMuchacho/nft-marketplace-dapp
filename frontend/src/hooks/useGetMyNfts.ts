import React, { useState, useEffect, useCallback } from "react";
import { alchemy } from '@/lib/alchemyClient';
import { useAccount } from "wagmi";
import { OwnedNft } from "alchemy-sdk";
// import { NFTMarketplaceABI } from "@/lib/abi";
// import { MARKETPLACE_CONTRACT_ADDRESS } from "@/lib/constants";
// import { parseAbiItem, keccak256, toBytes} from "viem";

export default function useGetMyNfts() {
    const [myNfts, setMyNfts] = useState<OwnedNft[]>([]);
    const { address: userAddress, isConnected } = useAccount();
    const [loading, setLoading] = useState(true);

    const fetchNFTs = useCallback(async () => {
        try {
            setLoading(true);
            const response = await alchemy.nft.getNftsForOwner(userAddress as string);
            setMyNfts(response.ownedNfts);
        } catch (err: any) {
            console.error('Error fetching NFTs:', err);
        } finally {
            setLoading(false);
        }
    }, [userAddress]);

    const refetchNFTs = useCallback(async () => {
        await fetchNFTs();
    }, []);

    useEffect(() => {
        if (!userAddress && myNfts.length > 0) return;
        fetchNFTs();
    }, [userAddress, fetchNFTs]);

    return { myNfts, loading, refetchNFTs };
}
