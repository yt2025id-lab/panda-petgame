import { useCallback } from 'react';
import { ethers } from 'ethers';
import { PANDA_NFT_ADDRESS, PANDA_NFT_ABI } from '../../constants/contractEvm';

const BASE_SEPOLIA_NETWORK = { chainId: 84532, name: 'base-sepolia' };

export interface UnequipCosmeticParams {
  pandaId: string; // objectId from query
  category: string;
  recipient: string;
}

export default function useUnequipCosmeticEvm(signer: ethers.Signer | undefined) {
  const unequipCosmetic = useCallback(
    async ({ pandaId, category }: UnequipCosmeticParams) => {
      if (!signer) throw new Error('No wallet connected');
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
        BASE_SEPOLIA_NETWORK
      );
      const freshSigner = provider.getSigner();
      const contract = new ethers.Contract(PANDA_NFT_ADDRESS, PANDA_NFT_ABI, freshSigner);
      const tx = await contract.unequipCosmetic(pandaId, category);
      await tx.wait();
      return tx;
    },
    [signer]
  );
  return { unequipCosmetic };
}
