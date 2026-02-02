import { useCallback } from 'react';
import { ethers } from 'ethers';
import { PANDA_NFT_ADDRESS, PANDA_NFT_ABI } from '../../constants/contractEvm';

const BASE_SEPOLIA_NETWORK = { chainId: 84532, name: 'base-sepolia' };

function getNoEnsProvider() {
  const provider = new ethers.providers.Web3Provider(
    (window as any).ethereum,
    BASE_SEPOLIA_NETWORK
  );
  // Disable ENS resolution completely - Base Sepolia has no ENS support
  provider.resolveName = async (name: string) => name;
  return provider;
}

interface CreatePandaParams {
  name: string;
}

export default function useCreatePandaEvm(signer: ethers.Signer | undefined) {
  const createPanda = useCallback(
    async ({ name }: CreatePandaParams) => {
      if (!signer) throw new Error('No wallet connected');
      const provider = getNoEnsProvider();
      const freshSigner = provider.getSigner();
      const contract = new ethers.Contract(PANDA_NFT_ADDRESS, PANDA_NFT_ABI, freshSigner);
      const tx = await contract.mint(name);
      await tx.wait();
      return tx;
    },
    [signer]
  );
  return { createPanda };
}
