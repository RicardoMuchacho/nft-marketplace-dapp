// alchemyClient.ts
import { Alchemy, Network } from 'alchemy-sdk';

// Use an environment variable for your API key
const settings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY, // set in your .env.local file
    network: Network.ARB_SEPOLIA, // Or choose the network you want
};

export const alchemy = new Alchemy(settings);
