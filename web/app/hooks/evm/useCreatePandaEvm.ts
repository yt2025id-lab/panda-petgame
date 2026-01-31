import { useCallback } from 'react';
import { ethers } from 'ethers';
import { PANDA_NFT_ADDRESS, PANDA_NFT_ABI } from '../../constants/contractEvm';

const BASE_SEPOLIA_NETWORK = { chainId: 84532, name: 'base-sepolia' };

interface CreatePandaParams {
  name: string;
}

export default function useCreatePandaEvm(signer: ethers.Signer | undefined) {
  const createPanda = useCallback(
    async ({ name }: CreatePandaParams) => {
      if (!signer) throw new Error('No wallet connected');
      // Create provider with explicit network to prevent ENS resolution attempts
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
        BASE_SEPOLIA_NETWORK
      );
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
