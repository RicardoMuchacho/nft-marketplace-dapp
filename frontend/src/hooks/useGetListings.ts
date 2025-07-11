// hooks/useListings.ts
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getListings } from '@/app/api/subgraph';

// Define the type for a single listing
export interface Listing {
  id: string;
  seller: string;
  nftAddress: string;
  tokenId: string;
  price: string;
  transactionHash: string;
}

// Define the type for the listings response
export interface ListingsResponse {
  listings: Listing[];
}

export const useGetListings = (): UseQueryResult<ListingsResponse> => {
  return useQuery<ListingsResponse>({
    queryKey: ['listings'],
    queryFn: async () => {
      const data: any = await getListings();
      return {
        listings: Array.isArray(data?.listings) ? data.listings : [],
      };
    },
    staleTime: 1000 * 60,
  });
};
