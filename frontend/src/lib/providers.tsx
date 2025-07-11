"use client"

import type { ReactNode } from "react"
import { http, createConfig } from "wagmi"
import { mainnet, arbitrumSepolia } from "wagmi/chains"
import { injected, coinbaseWallet, walletConnect } from "wagmi/connectors"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// Create a client
const queryClient = new QueryClient()
const alchemyRpcUrl = `https://arb-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`

export const config = createConfig({
    chains: [arbitrumSepolia],
    transports: {
        // [mainnet.id]: http(),
        [arbitrumSepolia.id]: http(alchemyRpcUrl),
    },
    connectors: [
        injected()
    ],
})

export function Providers({ children }: { children: ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}

