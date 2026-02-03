"use client"
import React from 'react';

interface IDRXWalletProps {
  balance: string;
  canClaim: boolean;
  isClaiming: boolean;
  onClaimFaucet: () => void;
  onClose: () => void;
}

const IDRXWallet: React.FC<IDRXWalletProps> = ({
  balance,
  canClaim,
  isClaiming,
  onClaimFaucet,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
      <div
        className="bg-white rounded-[3rem] border-8 border-gray-800 w-full max-w-md shadow-[0_20px_0_#2d2d2d] animate-in zoom-in-95 duration-300 overflow-hidden"
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
              {Number(balance).toLocaleString()} <span className="text-lg text-emerald-600">IDRX</span>
            </div>
            <div className="text-xs text-emerald-500 mt-1">~ Rp {Number(balance).toLocaleString('id-ID')}</div>
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

          {/* Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-yellow-50 rounded-xl border-2 border-yellow-200 text-center">
              <div className="text-xl mb-1">🔄</div>
              <div className="text-[10px] font-black text-gray-600 uppercase">Exchange Rate</div>
              <div className="text-xs font-bold text-gray-800">1 Coin = 100 IDRX</div>
            </div>
            <div className="p-3 bg-pink-50 rounded-xl border-2 border-pink-200 text-center">
              <div className="text-xl mb-1">🛍️</div>
              <div className="text-[10px] font-black text-gray-600 uppercase">Premium Shop</div>
              <div className="text-xs font-bold text-gray-800">Buy exclusive items</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDRXWallet;
