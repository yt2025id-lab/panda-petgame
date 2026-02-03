"use client"
import React, { useEffect, useState, useCallback } from 'react';

const BASE_SEPOLIA_CHAIN_ID = '0x14a34';
const BASE_SEPOLIA_CHAIN_ID_DECIMAL = 84532;

const BASE_SEPOLIA_PARAMS = {
  chainId: BASE_SEPOLIA_CHAIN_ID,
  chainName: 'Base Sepolia',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: ['https://sepolia.base.org'],
  blockExplorerUrls: ['https://sepolia.basescan.org'],
};

interface NetworkGuardProps {
  children: React.ReactNode;
}

const NetworkGuard: React.FC<NetworkGuardProps> = ({ children }) => {
  const [currentChainId, setCurrentChainId] = useState<number | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const checkChain = useCallback(async () => {
    try {
      const ethereum = (window as any).ethereum;
      if (!ethereum) {
        setChecked(true);
        return;
      }
      const chainIdHex: string = await ethereum.request({ method: 'eth_chainId' });
      setCurrentChainId(parseInt(chainIdHex, 16));
    } catch {
      // If we can't check, allow through
    } finally {
      setChecked(true);
    }
  }, []);

  useEffect(() => {
    checkChain();

    const ethereum = (window as any).ethereum;
    if (!ethereum) return;

    const handleChainChanged = (chainIdHex: string) => {
      setCurrentChainId(parseInt(chainIdHex, 16));
      setError(null);
    };

    ethereum.on('chainChanged', handleChainChanged);
    return () => {
      ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [checkChain]);

  const handleSwitch = async () => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) return;

    setIsSwitching(true);
    setError(null);

    try {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_SEPOLIA_CHAIN_ID }],
      });
    } catch (switchError: any) {
      // 4902 = chain not added yet
      if (switchError?.code === 4902) {
        try {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [BASE_SEPOLIA_PARAMS],
          });
        } catch (addError: any) {
          setError(addError?.message || 'Failed to add Base Sepolia network.');
        }
      } else {
        setError(switchError?.message || 'Failed to switch network.');
      }
    } finally {
      setIsSwitching(false);
    }
  };

  // Haven't checked yet - don't flash anything
  if (!checked) return null;

  // No wallet or already on the correct chain - render children
  if (!currentChainId || currentChainId === BASE_SEPOLIA_CHAIN_ID_DECIMAL) {
    return <>{children}</>;
  }

  // Wrong network - show overlay
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200 flex items-center justify-center p-4 z-50">
      {/* Floating panda emojis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {["top-10 left-10", "top-20 right-16", "bottom-32 left-20", "bottom-16 right-10", "top-1/2 left-5", "top-1/3 right-8"].map(
          (pos, i) => (
            <div
              key={i}
              className={`absolute ${pos} text-6xl opacity-15 animate-bounce`}
              style={{ animationDelay: `${i * 0.3}s`, animationDuration: `${2 + i * 0.5}s` }}
            >
              🐼
            </div>
          )
        )}
      </div>

      <div className="bg-white rounded-[3rem] border-8 border-gray-800 shadow-[0_20px_0_#2d2d2d] p-10 max-w-md w-full space-y-6 text-center relative z-10">
        {/* Warning icon */}
        <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-red-400 to-orange-500 rounded-full border-8 border-gray-800 shadow-[4px_4px_0px_#2d2d2d]">
          <span className="text-6xl">&#9888;&#65039;</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">
            Wrong Network!
          </h1>
          <p className="text-gray-500 font-medium text-base">
            Panda Pet runs on <span className="font-bold text-purple-600">Base Sepolia</span>. Please switch your wallet to continue playing.
          </p>
        </div>

        <button
          onClick={handleSwitch}
          disabled={isSwitching}
          className="w-full h-14 text-xl font-black bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl border-4 border-gray-800 shadow-[4px_4px_0px_#2d2d2d] hover:-translate-y-1 active:translate-y-0 active:shadow-[2px_2px_0px_#2d2d2d] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isSwitching ? (
            <span className="animate-spin inline-block w-6 h-6 border-4 border-white/30 border-t-white rounded-full" />
          ) : (
            <>
              🔄 Switch to Base Sepolia
            </>
          )}
        </button>

        {error && (
          <p className="text-red-500 text-sm font-bold bg-red-50 rounded-xl border-2 border-red-200 p-3">
            {error}
          </p>
        )}

        <div className="space-y-2 pt-2">
          <p className="text-sm text-gray-400 font-medium">
            Need testnet ETH?{' '}
            <a
              href="https://www.alchemy.com/faucets/base-sepolia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-500 hover:text-purple-700 font-bold underline"
            >
              Get it from the Base Sepolia Faucet
            </a>
          </p>
          <p className="text-sm text-gray-400 font-medium">
            Or use{' '}
            <a
              href="https://faucet.quicknode.com/base/sepolia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-500 hover:text-purple-700 font-bold underline"
            >
              Coinbase Faucet
            </a>
          </p>
        </div>

        <p className="text-xs text-gray-400 font-medium">
          Current: Chain ID {currentChainId} &middot; Required: Base Sepolia (84532)
        </p>
      </div>
    </div>
  );
};

export default NetworkGuard;
