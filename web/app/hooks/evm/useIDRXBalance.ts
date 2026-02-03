import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { IDRX_ADDRESS, IDRX_ABI } from '../../constants/idrxContract';
import { getReadProvider } from './providerUtils';

export default function useIDRXBalance(account: string | undefined) {
  const [balance, setBalance] = useState<string>("0");
  const [rawBalance, setRawBalance] = useState<bigint>(BigInt(0));
  const [canClaim, setCanClaim] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!account) return;
    setIsLoading(true);
    try {
      const provider = getReadProvider();
      const contract = new ethers.Contract(IDRX_ADDRESS, IDRX_ABI, provider);
      const bal = await contract.balanceOf(account);
      setRawBalance(BigInt(bal.toString()));
      // IDRX has 2 decimals
      setBalance(ethers.utils.formatUnits(bal, 2));

      const faucetAvailable = await contract.canClaimFaucet(account);
      setCanClaim(faucetAvailable);
    } catch (error) {
      console.error('Error fetching IDRX balance:', error);
    }
    setIsLoading(false);
  }, [account]);

  useEffect(() => {
    fetchBalance();
    const interval = setInterval(fetchBalance, 15000); // Refresh every 15s
    return () => clearInterval(interval);
  }, [fetchBalance]);

  return { balance, rawBalance, canClaim, isLoading, refetch: fetchBalance };
}
