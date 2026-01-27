import { useCallback } from 'react';
import { ethers } from 'ethers';
import { PANDA_NFT_ADDRESS, PANDA_NFT_ABI } from '../../constants/contractEvm';

export interface EquipCosmeticParams {
  pandaId: string; // objectId from query
  cosmeticId: string;
}

export default function useEquipCosmeticEvm(signer: ethers.Signer | undefined) {
  const equipCosmetic = useCallback(
    async ({ pandaId, cosmeticId }: EquipCosmeticParams) => {
      if (!signer) throw new Error('No wallet connected');
      const contract = new ethers.Contract(PANDA_NFT_ADDRESS, PANDA_NFT_ABI, signer);
      const tx = await contract.equipCosmetic(pandaId, cosmeticId);
      await tx.wait();
      return tx;
    },
    [signer]
  );
  return { equipCosmetic };
}
