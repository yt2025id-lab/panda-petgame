import { useCallback } from 'react';
import { ethers } from 'ethers';
import { PANDA_NFT_ADDRESS, PANDA_NFT_ABI } from '../../constants/contractEvm';
import { getNoEnsProvider } from './providerUtils';

export interface EquipCosmeticParams {
  pandaId: string;
  cosmeticId: string;
}

export default function useEquipCosmeticEvm(
  signer: ethers.Signer | undefined,
  ethereumProvider?: any
) {
  const equipCosmetic = useCallback(
    async ({ pandaId, cosmeticId }: EquipCosmeticParams) => {
      if (!signer) throw new Error('No wallet connected');
      if (!ethereumProvider) throw new Error('No provider available');
      const provider = getNoEnsProvider(ethereumProvider);
      const freshSigner = provider.getSigner();
      const contract = new ethers.Contract(PANDA_NFT_ADDRESS, PANDA_NFT_ABI, freshSigner);
      const tx = await contract.equipCosmetic(pandaId, cosmeticId);
      await tx.wait();
      return tx;
    },
    [signer, ethereumProvider]
  );
  return { equipCosmetic };
}
