import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ipfsToUrl(ipfsUri: string): string {
    if (!ipfsUri) return "";
    return ipfsUri.startsWith("ipfs://")
      ? `https://ipfs.io/ipfs/${ipfsUri.replace("ipfs://", "")}`
      : ipfsUri;
  }