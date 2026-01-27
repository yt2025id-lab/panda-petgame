import { useCallback } from 'react';
import { ethers } from 'ethers';
import { PANDA_NFT_ADDRESS, PANDA_NFT_ABI } from '../../constants/contractEvm';

export interface UnequipCosmeticParams {
  pandaId: string; // objectId from query
  category: string;
  recipient: string;
}

export default function useUnequipCosmeticEvm(signer: ethers.Signer | undefined) {
  const unequipCosmetic = useCallback(
    async ({ pandaId, category }: UnequipCosmeticParams) => {
      if (!signer) throw new Error('No wallet connected');
      const contract = new ethers.Contract(PANDA_NFT_ADDRESS, PANDA_NFT_ABI, signer);
      // Note: recipient not needed in EVM version since cosmetics aren't NFTs
      const tx = await contract.unequipCosmetic(pandaId, category);
      await tx.wait();
      return tx;
    },
    [signer]
  );
  return { unequipCosmetic };
}
