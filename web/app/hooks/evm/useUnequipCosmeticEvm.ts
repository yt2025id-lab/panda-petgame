import { useCallback } from 'react';
import { ethers } from 'ethers';
import { PANDA_NFT_ADDRESS, PANDA_NFT_ABI } from '../../constants/contractEvm';
import { getWriteProvider } from './providerUtils';

export interface UnequipCosmeticParams {
  pandaId: string;
  category: string;
  recipient: string;
}

export default function useUnequipCosmeticEvm() {
  const unequipCosmetic = useCallback(async ({ pandaId, category }: UnequipCosmeticParams) => {
    const provider = getWriteProvider();
    const signer = provider.getSigner();
    const contract = new ethers.Contract(PANDA_NFT_ADDRESS, PANDA_NFT_ABI, signer);
    const tx = await contract.unequipCosmetic(pandaId, category);
    await tx.wait();
    return tx;
  }, []);
  return { unequipCosmetic };
}
