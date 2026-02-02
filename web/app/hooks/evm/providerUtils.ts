import { ethers } from "ethers";

const BASE_SEPOLIA = { chainId: 84532, name: "base-sepolia" };
const RPC_URL = "https://sepolia.base.org";

/**
 * Read-only provider using JsonRpcProvider.
 * No wallet needed, no ENS issues.
 */
export function getReadProvider(): ethers.providers.JsonRpcProvider {
  return new ethers.providers.JsonRpcProvider(RPC_URL, BASE_SEPOLIA);
}

/**
 * Write provider using Web3Provider from window.ethereum.
 * ENS resolution disabled for Base Sepolia.
 */
export function getWriteProvider(): ethers.providers.Web3Provider {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("No wallet found");
  }
  const provider = new ethers.providers.Web3Provider(
    window.ethereum as ethers.providers.ExternalProvider,
    BASE_SEPOLIA
  );
  provider.resolveName = async (name: string) => name;
  return provider;
}
