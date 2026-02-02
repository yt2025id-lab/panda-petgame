import { ethers } from "ethers";

const BASE_SEPOLIA_NETWORK = { chainId: 84532, name: "base-sepolia" };

/**
 * Creates an ethers v5 Web3Provider with ENS disabled.
 * Accepts an EIP-1193 provider (from Privy wallet or window.ethereum).
 */
export function getNoEnsProvider(
  ethereumProvider: ethers.providers.ExternalProvider
): ethers.providers.Web3Provider {
  const provider = new ethers.providers.Web3Provider(
    ethereumProvider,
    BASE_SEPOLIA_NETWORK
  );
  provider.resolveName = async (name: string) => name;
  return provider;
}
