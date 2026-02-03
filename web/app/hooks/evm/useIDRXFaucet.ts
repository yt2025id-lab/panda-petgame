import { useCallback, useState } from 'react';
import { ethers } from 'ethers';
import { IDRX_ADDRESS, IDRX_ABI } from '../../constants/idrxContract';
import { getWriteProvider } from './providerUtils';

export default function useIDRXFaucet() {
  const [isClaiming, setIsClaiming] = useState(false);

  const claimFaucet = useCallback(async () => {
    setIsClaiming(true);
    try {
      const provider = getWriteProvider();
      const signer = provider.getSigner();
      const contract = new ethers.Contract(IDRX_ADDRESS, IDRX_ABI, signer);
      const tx = await contract.faucet();
      await tx.wait();
      return tx;
    } finally {
      setIsClaiming(false);
    }
  }, []);

  return { claimFaucet, isClaiming };
}
