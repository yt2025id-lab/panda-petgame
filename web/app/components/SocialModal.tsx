"use client"
import React, { useState } from 'react';

interface SocialModalProps {
  evmAccount: string;
  onClose: () => void;
}

const SocialModal: React.FC<SocialModalProps> = ({ evmAccount, onClose }) => {
  const [friendAddress, setFriendAddress] = useState('');
  const [message, setMessage] = useState('');

  const handleAddFriend = () => {
    if (!friendAddress || friendAddress.length !== 42) {
      setMessage('Please enter a valid wallet address');
      return;
    }
    setMessage('Social features will be available after contract deployment!');
    setFriendAddress('');
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
      <div
        className="bg-white rounded-[3rem] border-8 border-gray-800 w-full max-w-md shadow-[0_20px_0_#2d2d2d] animate-in zoom-in-95 duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 pb-4 border-b-4 border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <span className="text-4xl">👥</span>
            <div>
              <h2 className="text-3xl font-game text-gray-800">Social</h2>
              <p className="text-xs text-gray-400 font-bold">Friends & Gifts</p>
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
          {/* Your Profile Card */}
          <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl border-4 border-blue-300">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🐼</div>
              <div>
                <div className="font-black text-gray-800">Your Panda</div>
                <div className="text-xs text-gray-500 font-mono">{evmAccount.slice(0, 10)}...{evmAccount.slice(-6)}</div>
              </div>
            </div>
          </div>

          {/* Add Friend */}
          <div>
            <h3 className="font-black text-gray-800 mb-3 flex items-center gap-2">
              <span>🤝</span> Add Friend
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={friendAddress}
                onChange={(e) => setFriendAddress(e.target.value)}
                placeholder="0x... wallet address"
                className="flex-1 px-4 py-3 rounded-xl border-4 border-gray-300 font-mono text-sm text-black bg-white focus:border-blue-400 focus:outline-none"
              />
              <button
                onClick={handleAddFriend}
                className="px-4 py-3 bg-blue-400 text-white rounded-xl border-4 border-gray-800 font-black text-sm hover:scale-105 active:scale-95 transition-transform shadow-[2px_2px_0px_#2d2d2d]"
              >
                Add
              </button>
            </div>
            {message && (
              <p className="mt-2 text-xs text-blue-600 font-bold">{message}</p>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-green-50 rounded-xl border-4 border-green-200 text-center">
              <div className="text-3xl mb-2">🏠</div>
              <div className="text-xs font-black text-gray-800">Visit Friends</div>
              <div className="text-[10px] text-gray-400 mt-1">See their pandas!</div>
            </div>
            <div className="p-4 bg-pink-50 rounded-xl border-4 border-pink-200 text-center">
              <div className="text-3xl mb-2">🎁</div>
              <div className="text-xs font-black text-gray-800">Send Gifts</div>
              <div className="text-[10px] text-gray-400 mt-1">Share the love!</div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 font-bold">
            Social features are onchain - powered by PandaSocial contract
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocialModal;
