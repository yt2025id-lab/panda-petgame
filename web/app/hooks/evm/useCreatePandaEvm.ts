import { useCallback } from 'react';
import { ethers } from 'ethers';
import { PANDA_NFT_ADDRESS, PANDA_NFT_ABI } from '../../constants/contractEvm';
import { getWriteProvider } from './providerUtils';

interface CreatePandaParams {
  name: string;
}

export default function useCreatePandaEvm() {
  const createPanda = useCallback(async ({ name }: CreatePandaParams) => {
    const provider = getWriteProvider();
    const signer = provider.getSigner();
    const contract = new ethers.Contract(PANDA_NFT_ADDRESS, PANDA_NFT_ABI, signer);
    const tx = await contract.mint(name);
    await tx.wait();
    return tx;
  }, []);
  return { createPanda };
}
