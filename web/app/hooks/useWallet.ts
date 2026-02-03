"use client"
import { useState, useEffect, useCallback } from 'react';

const BASE_SEPOLIA_CHAIN_ID = '0x14a34'; // 84532 in hex

export default function useWallet() {
  const [evmAccount, setEvmAccount] = useState<string | undefined>(undefined);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('Please install a wallet (MetaMask or Coinbase Wallet) to continue.');
      return;
    }
    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: BASE_SEPOLIA_CHAIN_ID }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: BASE_SEPOLIA_CHAIN_ID,
              chainName: 'Base Sepolia',
              nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://sepolia.base.org'],
              blockExplorerUrls: ['https://sepolia.basescan.org'],
            }],
          });
        }
      }

      if (accounts && accounts.length > 0) {
        setEvmAccount(accounts[0]);
      }
    } catch (e: any) {
      console.error('Failed to connect wallet:', e);
    }
    setIsConnecting(false);
  }, []);

  // Auto-connect if already connected
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;
    const eth = window.ethereum;
    (async () => {
      try {
        const accounts = await eth.request({ method: 'eth_accounts' }) as string[];
        if (accounts && accounts.length > 0) {
          setEvmAccount(accounts[0]);
        }
      } catch {}
    })();

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setEvmAccount(accounts[0]);
      } else {
        setEvmAccount(undefined);
      }
    };
    eth.on?.('accountsChanged', handleAccountsChanged);
    return () => {
      eth.removeListener?.('accountsChanged', handleAccountsChanged);
    };
  }, []);

  const disconnect = useCallback(() => {
    setEvmAccount(undefined);
  }, []);

  return { evmAccount, isConnecting, connectWallet, disconnect };
}
