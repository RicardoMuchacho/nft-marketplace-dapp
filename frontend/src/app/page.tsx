"use client";

import dynamic from "next/dynamic";

const NFTMarketplace = dynamic(() => import("@/components/nft-marketplace"), {
    ssr: false,
});

export default function Home() {
    return (
        <main className="min-h-screen bg-background">
            <NFTMarketplace />
        </main>
    );
}
