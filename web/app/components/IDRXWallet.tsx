"use client"
import React, { useState } from 'react';

const IDRX_PER_COIN = 1000; // 1,000 IDRX = 1 Coin

interface IDRXWalletProps {
  balance: string;
  canClaim: boolean;
  isClaiming: boolean;
  onClaimFaucet: () => void;
  onConvertToCoins: (idrxAmount: number) => Promise<void>;
  onClose: () => void;
}

const IDRXWallet: React.FC<IDRXWalletProps> = ({
  balance,
  canClaim,
  isClaiming,
  onClaimFaucet,
  onConvertToCoins,
  onClose,
}) => {
  const [convertAmount, setConvertAmount] = useState('');
  const [isConverting, setIsConverting] = useState(false);

  const numBalance = Number(balance);
  const numConvert = Number(convertAmount) || 0;
  const coinsToReceive = Math.floor(numConvert / IDRX_PER_COIN);
  const canConvert = numConvert >= IDRX_PER_COIN && numConvert <= numBalance && !isConverting;

  const handleConvert = async () => {
    if (!canConvert) return;
    setIsConverting(true);
    try {
      await onConvertToCoins(numConvert);
      setConvertAmount('');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
      <div
        className="bg-white rounded-[3rem] border-8 border-gray-800 w-full max-w-md shadow-[0_20px_0_#2d2d2d] animate-in zoom-in-95 duration-300 overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 pb-4 border-b-4 border-gray-100 flex justify-between items-center bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center gap-3">
            <span className="text-4xl">💎</span>
            <div>
              <h2 className="text-3xl font-game text-gray-800">IDRX Wallet</h2>
              <p className="text-xs text-gray-400 font-bold">Indonesian Rupiah Token</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-2xl font-bold bg-red-100 text-red-600 rounded-full w-12 h-12 flex items-center justify-center border-4 border-gray-800 hover:scale-110 active:scale-95 transition-transform"
          >
            x
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Balance Display */}
          <div className="text-center p-6 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl border-4 border-emerald-300">
            <div className="text-sm font-black text-emerald-600 uppercase mb-2">Your Balance</div>
            <div className="text-4xl font-game text-gray-800">
              {numBalance.toLocaleString()} <span className="text-lg text-emerald-600">IDRX</span>
            </div>
            <div className="text-xs text-emerald-500 mt-1">~ Rp {numBalance.toLocaleString('id-ID')}</div>
          </div>

          {/* Faucet */}
          <div className="p-4 bg-blue-50 rounded-2xl border-4 border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-black text-gray-800">IDRX Faucet</h3>
                <p className="text-xs text-gray-400">Claim 10,000 IDRX every hour</p>
              </div>
              <span className="text-2xl">🚰</span>
            </div>
            <button
              onClick={onClaimFaucet}
              disabled={!canClaim || isClaiming}
              className={`w-full py-3 rounded-2xl border-4 border-gray-800 font-black uppercase text-sm transition-all ${
                canClaim && !isClaiming
                  ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white shadow-[4px_4px_0px_#2d2d2d] hover:-translate-y-1 active:translate-y-0 active:shadow-[2px_2px_0px_#2d2d2d]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isClaiming ? 'Claiming...' : canClaim ? 'Claim 10,000 IDRX' : 'Already Claimed (wait 1hr)'}
            </button>
          </div>

          {/* Convert IDRX to Coins */}
          <div className="p-4 bg-orange-50 rounded-2xl border-4 border-orange-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-black text-gray-800">Convert to Coins</h3>
                <p className="text-xs text-gray-400">1,000 IDRX = 1 Coin</p>
              </div>
              <span className="text-2xl">🪙</span>
            </div>

            {/* Preset buttons */}
            <div className="flex gap-2 mb-3">
              {[1000, 5000, 10000].map(amount => (
                <button
                  key={amount}
                  onClick={() => setConvertAmount(String(amount))}
                  disabled={amount > numBalance}
                  className={`flex-1 py-2 rounded-xl border-3 border-gray-800 font-black text-xs transition-all ${
                    amount <= numBalance
                      ? 'bg-white hover:bg-orange-100 active:scale-95 shadow-[2px_2px_0px_#2d2d2d]'
                      : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {(amount / 1000)}K
                </button>
              ))}
            </div>

            {/* Input */}
            <input
              type="number"
              value={convertAmount}
              onChange={(e) => setConvertAmount(e.target.value)}
              placeholder="Enter IDRX amount..."
              min={IDRX_PER_COIN}
              max={numBalance}
              className="w-full py-3 px-4 rounded-xl border-3 border-gray-300 font-bold text-gray-800 text-center focus:border-orange-400 focus:outline-none mb-3"
            />

            {/* Preview */}
            {numConvert >= IDRX_PER_COIN && (
              <div className="text-center mb-3 p-2 bg-white rounded-xl border-2 border-orange-200">
                <span className="font-black text-gray-800">{numConvert.toLocaleString()} IDRX</span>
                <span className="mx-2 text-orange-400">→</span>
                <span className="font-black text-orange-600">{coinsToReceive} Coins 🪙</span>
              </div>
            )}

            {/* Convert button */}
            <button
              onClick={handleConvert}
              disabled={!canConvert}
              className={`w-full py-3 rounded-2xl border-4 border-gray-800 font-black uppercase text-sm transition-all ${
                canConvert
                  ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-[4px_4px_0px_#2d2d2d] hover:-translate-y-1 active:translate-y-0 active:shadow-[2px_2px_0px_#2d2d2d]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isConverting ? 'Converting...' : `Convert to ${coinsToReceive || 0} Coins`}
            </button>
          </div>

          {/* Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-yellow-50 rounded-xl border-2 border-yellow-200 text-center">
              <div className="text-xl mb-1">🔄</div>
              <div className="text-[10px] font-black text-gray-600 uppercase">Exchange Rate</div>
              <div className="text-xs font-bold text-gray-800">1,000 IDRX = 1 Coin</div>
            </div>
            <div className="p-3 bg-pink-50 rounded-xl border-2 border-pink-200 text-center">
              <div className="text-xl mb-1">⛓️</div>
              <div className="text-[10px] font-black text-gray-600 uppercase">Onchain</div>
              <div className="text-xs font-bold text-gray-800">Verified on Base</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDRXWallet;
