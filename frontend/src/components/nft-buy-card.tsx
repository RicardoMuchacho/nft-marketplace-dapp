"use client"

import { useState } from "react"
import { formatEther } from "viem"
import { useWriteContract } from "wagmi"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { NFTMarketplaceABI } from "@/lib/abi"
import { Listing } from "@/hooks/useGetListings"
import { useNftMetadata } from "@/hooks/useNftMetadata"
import { MARKETPLACE_CONTRACT_ADDRESS } from "@/lib/constants"

interface NFTBuyCardProps {
    nft: Listing;
    onSuccess?: () => void
}

export default function NFTBuyCard({ nft, onSuccess }: NFTBuyCardProps) {
    const [isLoading, setIsLoading] = useState(false)

    const { data, isLoading: isLoadingMetadata, error } = useNftMetadata(nft.tokenUri);
    const { writeContract, isPending } = useWriteContract()

    const handleBuy = () => {
        setIsLoading(true)
        writeContract(
            {
                address: MARKETPLACE_CONTRACT_ADDRESS as `0x${string}`,
                abi: NFTMarketplaceABI,
                functionName: "buyNFT",
                args: [nft.nftAddress, BigInt(nft.tokenId)],
                value: BigInt(nft.price),
            },
            {
                onSuccess: () => {
                    setTimeout(() => {
                        setIsLoading(false)
                        if (onSuccess) onSuccess()
                    }, 2000)
                },
                onError: () => {
                    setIsLoading(false)
                },
            },
        )
    }

    return (
        <Card className="overflow-hidden transition-all hover:shadow-md">
            <div className="relative aspect-square bg-muted">
                {isLoadingMetadata ?
                    <Skeleton className="absolute inset-0 h-full w-full" />
                    : (
                        <img
                            src={data?.image || "/placeholder.svg"}
                            className={`h-full w-full object-cover transition-opacity duration-300 ${!isLoadingMetadata ? "opacity-100" : "opacity-0"}`}
                        />
                    )}
            </div>
            <CardHeader>
                <CardTitle className="text-lg">{data?.name}</CardTitle>
                <CardDescription className="line-clamp-2">{data?.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="font-medium">{formatEther(BigInt(nft.price))} ETH</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Token ID</p>
                        <p className="font-medium">#{nft.tokenId}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                {true ? (
                    <Button className="w-full" onClick={handleBuy} disabled={isPending || isLoading}>
                        {isPending || isLoading ? "Processing..." : "Buy Now"}
                    </Button>
                ) : (
                    <Button variant="outline" className="w-full" disabled>
                        Owned by You
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
