import { useCallback } from 'react';
import { ethers } from 'ethers';
import { PANDA_NFT_ADDRESS, PANDA_NFT_ABI } from '../../constants/contractEvm';
import { getWriteProvider } from './providerUtils';

export interface EquipCosmeticParams {
  pandaId: string;
  cosmeticId: string;
}

export default function useEquipCosmeticEvm() {
  const equipCosmetic = useCallback(async ({ pandaId, cosmeticId }: EquipCosmeticParams) => {
    const provider = getWriteProvider();
    const signer = provider.getSigner();
    const contract = new ethers.Contract(PANDA_NFT_ADDRESS, PANDA_NFT_ABI, signer);
    const tx = await contract.equipCosmetic(pandaId, cosmeticId);
    await tx.wait();
    return tx;
  }, []);
  return { equipCosmetic };
}
