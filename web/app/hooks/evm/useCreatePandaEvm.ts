import { useCallback } from 'react';
import { ethers } from 'ethers';
import { PANDA_NFT_ADDRESS, PANDA_NFT_ABI } from '../../constants/contractEvm';

interface CreatePandaParams {
  name: string;
}

export default function useCreatePandaEvm(signer: ethers.Signer | undefined) {
  const createPanda = useCallback(
    async ({ name }: CreatePandaParams) => {
      if (!signer) throw new Error('No wallet connected');
      const contract = new ethers.Contract(PANDA_NFT_ADDRESS, PANDA_NFT_ABI, signer);
      // Updated: mint function now only takes tokenURI, msg.sender becomes owner automatically
      const tx = await contract.mint(name); // name as tokenURI for demo
      await tx.wait();
      return tx;
    },
    [signer]
  );
  return { createPanda };
}
