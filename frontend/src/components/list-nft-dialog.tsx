import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { OwnedNft } from "alchemy-sdk";
import useContractInteractions from "@/hooks/contractInteractions";

interface ListNFTDialogProps {
    nft: OwnedNft | null;
    onSuccess: () => void;
    onClose: () => void;
}

export default function ListNFTDialog({ nft, onSuccess, onClose }: ListNFTDialogProps) {

    const [price, setPrice] = useState<string>("");
    const [isApproved, setIsApproved] = useState<boolean>(false);
    const { approveNFT, listNFT, isPending, checkNFTApproval } = useContractInteractions();

    useEffect(() => {
        console.log(nft)
        if (!nft) {
            setIsApproved(false);
            return;
        }

        const checkApproval = async () => {
            const res = await checkNFTApproval(nft);
            console.log(res);
            setIsApproved(res);
        }
        checkApproval();
    }, [nft]);

    const handleApproveNft = () => {
        if (!nft || !price) return;
        approveNFT(nft);
        setIsApproved(true);
    }

    const handleListNft = () => {
        if (!nft || !price) return;
        listNFT(
            nft,
            price,
            () => onSuccess(),
            (error) => console.error("Error listing NFT:", error)
        );
    }

    return (
        <Dialog open={!!nft} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="gap-1">
                <DialogHeader>
                    <DialogTitle>List your NFT</DialogTitle>
                    <DialogDescription>
                        Enter the price to list your NFT on the marketplace.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center gap-4 py-4">
                    <div className="flex-1">
                        <Label className="pb-2" htmlFor="price">Price (ETH)</Label>
                        <Input
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Enter price in ETH"
                            type="number"
                            step="0.001"
                            min="0"
                            disabled={!isApproved}
                        />
                    </div>
                    {isApproved ? (
                        <Button onClick={handleListNft} disabled={!price || isPending} className="mt-6">
                            {isPending ? "Processing..." : "List NFT"}
                        </Button>
                    ) : (
                        <Button onClick={handleApproveNft} disabled={isPending} className="mt-6">
                            {isPending ? "Processing..." : "Approve NFT"}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}