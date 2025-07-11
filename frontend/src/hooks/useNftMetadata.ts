import { useQuery } from "@tanstack/react-query";
import { ipfsToUrl } from "@/lib/utils";

interface NFTAttribute {
  trait_type: string;
  value: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
}

export function useNftMetadata(ipfsUri: string) {
  return useQuery<NFTMetadata>({
    queryKey: ["nft-metadata", ipfsUri],
    queryFn: async (): Promise<NFTMetadata> => {
      if (!ipfsUri) throw new Error("No IPFS URI provided");
      const res = await fetch(ipfsToUrl(ipfsUri));
      if (!res.ok) throw new Error("Failed to fetch metadata");
      const data = await res.json();
      const image = data.image ? ipfsToUrl(data.image) : "";
      
      return {
        name: data.name ?? "",
        description: data.description ?? "",
        image,
        attributes: Array.isArray(data.attributes) ? data.attributes : [],
      };
    },
    enabled: !!ipfsUri,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes (optional)
  });
}