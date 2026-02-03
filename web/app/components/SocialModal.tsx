"use client"
import React, { useState } from 'react';
import { toast } from 'sonner';
import useSocial, { FriendInfo } from '../hooks/evm/useSocial';

interface SocialModalProps {
  evmAccount: string;
  onClose: () => void;
}

const GIFT_TYPES = [
  { id: 0, emoji: '🎋', name: 'Bamboo' },
  { id: 1, emoji: '🍰', name: 'Cake' },
  { id: 2, emoji: '💐', name: 'Flowers' },
  { id: 3, emoji: '🧸', name: 'Teddy' },
];

const SocialModal: React.FC<SocialModalProps> = ({ evmAccount, onClose }) => {
  const [friendAddress, setFriendAddress] = useState('');
  const [selectedGiftFriend, setSelectedGiftFriend] = useState<string | null>(null);
  const { friends, isLoading, isAdding, isVisiting, isSendingGift, addFriend, visitFriend, sendGift } = useSocial(evmAccount);

  const handleAddFriend = async () => {
    if (!friendAddress || !friendAddress.startsWith('0x') || friendAddress.length !== 42) {
      toast.error('Please enter a valid wallet address');
      return;
    }
    if (friendAddress.toLowerCase() === evmAccount.toLowerCase()) {
      toast.error("You can't add yourself!");
      return;
    }
    const toastId = toast.loading('Adding friend onchain...');
    try {
      await addFriend(friendAddress);
      toast.success('Friend added!', { id: toastId });
      setFriendAddress('');
    } catch (error: any) {
      const msg = error?.reason || error?.message || 'Failed to add friend';
      toast.error(msg.length > 80 ? 'Failed to add friend. Already friends or check gas.' : msg, { id: toastId });
    }
  };

  const handleVisit = async (addr: string) => {
    const toastId = toast.loading('Visiting friend...');
    try {
      await visitFriend(addr);
      toast.success('Visited friend!', { id: toastId });
    } catch (error: any) {
      const msg = error?.reason || error?.message || 'Failed to visit';
      toast.error(msg.length > 80 ? 'Cannot visit yet. Wait 1 hour between visits.' : msg, { id: toastId });
    }
  };

  const handleSendGift = async (toAddr: string, giftType: number) => {
    const gift = GIFT_TYPES.find(g => g.id === giftType);
    const toastId = toast.loading(`Sending ${gift?.name || 'gift'}...`);
    try {
      await sendGift(toAddr, giftType);
      toast.success(`Sent ${gift?.emoji} ${gift?.name} to friend!`, { id: toastId });
      setSelectedGiftFriend(null);
    } catch (error: any) {
      const msg = error?.reason || error?.message || 'Failed to send gift';
      toast.error(msg.length > 80 ? 'Failed to send gift. Check gas.' : msg, { id: toastId });
    }
  };

  const shortAddr = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
      <div
        className="bg-white rounded-[3rem] border-8 border-gray-800 w-full max-w-md shadow-[0_20px_0_#2d2d2d] animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 pb-4 border-b-4 border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <span className="text-4xl">👥</span>
            <div>
              <h2 className="text-3xl font-game text-gray-800">Social</h2>
              <p className="text-xs text-gray-400 font-bold">Friends & Gifts (onchain)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-2xl font-bold bg-red-100 text-red-600 rounded-full w-12 h-12 flex items-center justify-center border-4 border-gray-800 hover:scale-110 active:scale-95 transition-transform"
          >
            x
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Your Profile Card */}
          <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl border-4 border-blue-300">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🐼</div>
              <div>
                <div className="font-black text-gray-800">Your Panda</div>
                <div className="text-xs text-gray-500 font-mono">{shortAddr(evmAccount)}</div>
              </div>
              <div className="ml-auto text-xs font-black text-blue-600 bg-blue-200 px-2 py-1 rounded-full">
                {friends.length} friends
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
                disabled={isAdding}
                className="px-4 py-3 bg-blue-400 text-white rounded-xl border-4 border-gray-800 font-black text-sm hover:scale-105 active:scale-95 transition-transform shadow-[2px_2px_0px_#2d2d2d] disabled:opacity-50"
              >
                {isAdding ? '...' : 'Add'}
              </button>
            </div>
          </div>

          {/* Friends List */}
          <div>
            <h3 className="font-black text-gray-800 mb-3 flex items-center gap-2">
              <span>👫</span> Friends
            </h3>
            {isLoading ? (
              <div className="text-center py-6">
                <div className="text-3xl animate-bounce">👥</div>
                <p className="text-gray-400 text-xs font-bold mt-2">Loading friends...</p>
              </div>
            ) : friends.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-2xl border-4 border-dashed border-gray-200">
                <div className="text-4xl mb-2">🐼</div>
                <p className="text-gray-400 text-sm font-bold">No friends yet</p>
                <p className="text-gray-300 text-xs mt-1">Add a friend above to get started!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {friends.map((friend: FriendInfo) => (
                  <div key={friend.address} className="p-3 bg-gray-50 rounded-xl border-4 border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🐼</span>
                      <span className="text-xs font-mono font-bold text-gray-600 flex-1">{shortAddr(friend.address)}</span>
                      <button
                        onClick={() => handleVisit(friend.address)}
                        disabled={isVisiting || !friend.canVisit}
                        className="px-2 py-1 bg-green-400 text-white rounded-lg border-2 border-gray-800 text-[10px] font-black hover:scale-105 active:scale-95 transition-transform disabled:opacity-40"
                      >
                        {!friend.canVisit ? '1h' : '🏠 Visit'}
                      </button>
                      <button
                        onClick={() => setSelectedGiftFriend(selectedGiftFriend === friend.address ? null : friend.address)}
                        disabled={isSendingGift}
                        className="px-2 py-1 bg-pink-400 text-white rounded-lg border-2 border-gray-800 text-[10px] font-black hover:scale-105 active:scale-95 transition-transform disabled:opacity-40"
                      >
                        🎁
                      </button>
                    </div>

                    {/* Gift Picker */}
                    {selectedGiftFriend === friend.address && (
                      <div className="flex gap-2 mt-2 pt-2 border-t-2 border-gray-200">
                        {GIFT_TYPES.map(gift => (
                          <button
                            key={gift.id}
                            onClick={() => handleSendGift(friend.address, gift.id)}
                            disabled={isSendingGift}
                            className="flex-1 p-2 bg-white rounded-lg border-2 border-gray-300 hover:border-pink-400 hover:bg-pink-50 transition-all text-center disabled:opacity-50"
                          >
                            <div className="text-xl">{gift.emoji}</div>
                            <div className="text-[8px] font-black text-gray-600">{gift.name}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="text-center text-[10px] text-gray-400 font-bold">
            All social actions are recorded onchain
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocialModal;
