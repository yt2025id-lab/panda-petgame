import { useCallback } from 'react';
import { ethers } from 'ethers';
import { PANDA_NFT_ADDRESS, PANDA_NFT_ABI } from '../../constants/contractEvm';
import { getNoEnsProvider } from './providerUtils';

export interface UnequipCosmeticParams {
  pandaId: string;
  category: string;
  recipient: string;
}

export default function useUnequipCosmeticEvm(
  signer: ethers.Signer | undefined,
  ethereumProvider?: any
) {
  const unequipCosmetic = useCallback(
    async ({ pandaId, category }: UnequipCosmeticParams) => {
      if (!signer) throw new Error('No wallet connected');
      if (!ethereumProvider) throw new Error('No provider available');
      const provider = getNoEnsProvider(ethereumProvider);
      const freshSigner = provider.getSigner();
      const contract = new ethers.Contract(PANDA_NFT_ADDRESS, PANDA_NFT_ABI, freshSigner);
      const tx = await contract.unequipCosmetic(pandaId, category);
      await tx.wait();
      return tx;
    },
    [signer, ethereumProvider]
  );
  return { unequipCosmetic };
}
