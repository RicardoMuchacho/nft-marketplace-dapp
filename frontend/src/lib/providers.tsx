"use client"

import type { ReactNode } from "react"
import { http, createConfig } from "wagmi"
import { mainnet, arbitrumSepolia } from "wagmi/chains"
import { injected, coinbaseWallet, walletConnect } from "wagmi/connectors"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// Create a client
const queryClient = new QueryClient()

export const config = createConfig({
    chains: [arbitrumSepolia],
    transports: {
        // [mainnet.id]: http(),
        [arbitrumSepolia.id]: http(),
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

