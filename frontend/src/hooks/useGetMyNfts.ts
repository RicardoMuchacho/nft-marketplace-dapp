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

    // const LISTED_EVENT_TOPIC = keccak256(toBytes('listed(address,address,uint256,uint256)'));
    // const BLOCK_PAGE_SIZE = 490; // Alchemy max block range

    // const fetchListedNFTs = async () => {
    //     try {
    //       const latestBlock = await alchemy.core.getBlockNumber();
                    
    //         const fromBlock = latestBlock - BLOCK_PAGE_SIZE;
    //         const toBlock = latestBlock;
    //         const logs = await alchemy.core.getLogs({
    //             address: MARKETPLACE_CONTRACT_ADDRESS,
    //             topics: [ LISTED_EVENT_TOPIC ],
    //             fromBlock: `0x${fromBlock.toString(16)}`,
    //             toBlock: `0x${toBlock.toString(16)}`
    //         });
    //         console.log(logs)
    //         console.log(`Fetched ${logs.length} logs from block ${fromBlock} to ${toBlock}`);
          
      
      
    //     } catch (error) {
    //       console.error("Error fetching logs:", error);
    //     }
    //   };
          
    // fetchListedNFTs();

    const refetchNFTs = useCallback(async () => {
        await fetchNFTs();
    }, []);

    useEffect(() => {
        if (!userAddress && myNfts.length > 0) return;
        fetchNFTs();
    }, [userAddress, fetchNFTs]);

    return { myNfts, loading, refetchNFTs };
}
