import { NftMintingABI, NFTMarketplaceABI, ERC721_ABI } from "@/lib/abi";
import { NFT_MINT_ADDRESS, MARKETPLACE_CONTRACT_ADDRESS } from "@/lib/constants";
import { useWriteContract, usePublicClient } from "wagmi";
import { OwnedNft } from "alchemy-sdk";
import { parseEther } from "viem";

export default function useContractInteractions() {
    const { writeContract, isPending } = useWriteContract();
    const publicClient = usePublicClient();

    const approveNFT = (nft: OwnedNft) => {
        writeContract({
            address: nft.contract.address as `0x${string}`,
            abi: ERC721_ABI,
            functionName: "approve",
            args: [MARKETPLACE_CONTRACT_ADDRESS, nft.tokenId],
        });
    };

    const checkNFTApproval = async (nft: OwnedNft) => {
        if (!publicClient) {
            console.error("Public client not available");
            return false;
        }
        try {
            const approvedAddress = await publicClient.readContract({
                address: nft.contract.address as `0x${string}`,
                abi: ERC721_ABI,
                functionName: 'getApproved',
                args: [BigInt(nft.tokenId)],
            });
            return approvedAddress === MARKETPLACE_CONTRACT_ADDRESS;
        } catch (error) {
            console.error("Error checking NFT approval:", error);
            return false;
        }
    };

    const mintTestNFT = async () => {
        try {
            writeContract({
                address: NFT_MINT_ADDRESS,
                abi: NftMintingABI,
                functionName: "mint"
            });
        } catch (error) {
            console.log(error)
        }
    };

    const listNFT = (nft: OwnedNft, price: string, onSuccess?: () => void, onError?: (error: Error) => void) => {
        writeContract(
            {
                address: MARKETPLACE_CONTRACT_ADDRESS,
                abi: NFTMarketplaceABI,
                functionName: "listNFT",
                args: [nft.contract.address, BigInt(nft.tokenId), parseEther(price)],
            },
            {
                onSuccess,
                onError,
            }
        );
    }

    return { approveNFT, mintTestNFT, checkNFTApproval, listNFT, isPending };
}