"use client"

import { useEffect, useState } from "react"
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet } from "lucide-react"
import MyNftsTab from "./my-nfts-tab"
import MarketplaceNftsTab from "./listings-tab"
import useContractInteractions from "@/hooks/useContractInteractions"
import useGetMyNfts from "@/hooks/useGetMyNfts"
import { arbitrumSepolia } from "wagmi/chains"
import { useGetListings } from "@/hooks/useGetListings"

export default function NFTMarketplace() {
    const { address: userAddress, isConnected, chain } = useAccount()
    const { connect, connectors } = useConnect()
    const { switchChain } = useSwitchChain()
    const { disconnect } = useDisconnect()
    const { mintTestNFT, isPending } = useContractInteractions()
    const { myNfts, refetchNFTs, loading } = useGetMyNfts()
    const { refetch: refetchListings } = useGetListings()

    const [activeTab, setActiveTab] = useState("marketplace");

    useEffect(() => {
        if (isConnected && chain?.id !== arbitrumSepolia.id) {
            switchChain({ chainId: arbitrumSepolia.id })
        }
    }, [isConnected, chain])

    const handleConnect = async () => {
        connect({ connector: connectors[0] });
    }

    const handleRefetch = async () => {
        activeTab == "my-nfts" ? refetchNFTs() : refetchListings();
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h1 className="text-3xl font-bold mb-4 md:mb-0">Rick's NFT Marketplace</h1>
                <div className="flex items-center gap-4">
                    {isConnected ? (
                        <Button onClick={() => disconnect()} variant="outline" className="flex items-center gap-2">
                            <Wallet className="h-4 w-4" />
                            {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
                        </Button>
                    ) : (
                        <Button onClick={() => connect({ connector: connectors[0] })} className="flex items-center gap-2">
                            <Wallet className="h-4 w-4" />
                            Connect Wallet
                        </Button>
                    )}
                </div>
            </div>

            {isConnected ? (
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="flex justify-between gap-2">
                        <TabsList className="mb-6">
                            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
                            <TabsTrigger value="my-nfts">My NFTs</TabsTrigger>
                        </TabsList>
                        <div className="flex gap-2">
                            <Button disabled={isPending} onClick={mintTestNFT}>Mint Test NFT</Button>
                            <Button disabled={loading} onClick={handleRefetch}>Refresh NFTs</Button>
                        </div>
                    </div>
                    <MarketplaceNftsTab />
                    <MyNftsTab myNfts={myNfts} loading={loading} />
                </Tabs>
            ) : (
                <div className="flex flex-col text-center justify-center py-20">
                    <h2 className="text-2xl font-semibold mb-4">Connect your wallet to view NFTs</h2>
                    <p className="text-muted-foreground mb-6">You need to connect your wallet to interact with the marketplace</p>
                    <Button onClick={handleConnect} size="lg" className="fle m-auto items-center gap-2">
                        <Wallet className="h-5 w-5" />
                        Connect Wallet
                    </Button>
                </div>
            )}
        </div>
    )
}

