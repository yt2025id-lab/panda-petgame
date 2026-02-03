"use client"
import React from 'react';
import { MissionStatus } from './type';
import { MISSIONS } from './constant';

interface ProfileModalProps {
  coins: number;
  username: string;
  missionStatuses: MissionStatus[];
  ownedCosmetics: any[];
  equippedCosmeticId: string | null;
  isEquipping: boolean;
  isUnequipping: boolean;
  onClose: () => void;
  onClaimMission: (missionId: string) => void;
  onEquipCosmetic: (cosmeticId: string) => void;
  onMintCosmetic: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  coins,
  username,
  missionStatuses,
  ownedCosmetics,
  equippedCosmeticId,
  isEquipping,
  isUnequipping,
  onClose,
  onClaimMission,
  onEquipCosmetic,
  onMintCosmetic,
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
      <div
        className="bg-white rounded-[3rem] border-8 border-gray-800 w-full max-w-lg shadow-[0_20px_0_#2d2d2d] animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 pb-4 border-b-4 border-gray-100 flex justify-between items-center bg-white">
          <div className="flex flex-col">
            <span className="text-sm font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Master Keeper</span>
            <h2 className="text-3xl font-game text-gray-800 tracking-tight">@{username}</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 border-4 border-gray-800 rounded-full px-4 py-2 font-game text-xl shadow-[4px_4px_0px_#2d2d2d]">💰 {coins}</div>
            <button
              onClick={onClose}
              className="text-2xl font-bold bg-red-100 text-red-600 rounded-full w-12 h-12 flex items-center justify-center border-4 border-gray-800 hover:scale-110 active:scale-95 transition-transform"
            >
              x
            </button>
          </div>
        </div>

        <div className="p-8 pt-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Missions Section */}
          <div className="mb-10">
            <h3 className="text-2xl font-game mb-6 text-indigo-600 flex items-center gap-3">
              <span className="bg-indigo-100 p-2 rounded-2xl border-4 border-gray-800">🎯</span> Daily Missions
            </h3>
            <div className="space-y-4">
              {MISSIONS.map(m => {
                const status = missionStatuses.find(s => s.missionId === m.id)!;
                const canClaim = status.progress >= m.requirement && !status.claimed;
                return (
                  <div key={m.id} className={`p-5 rounded-[2rem] border-4 border-gray-800 transition-all ${status.claimed ? 'bg-gray-100 opacity-60' : 'bg-indigo-50 shadow-[4px_4px_0px_#2d2d2d]'}`}>
                    <div className="flex justify-between items-start mb-3 text-left">
                      <div>
                        <h4 className="font-bold text-lg text-gray-800">{m.title}</h4>
                        <p className="text-sm text-gray-400 font-medium">{m.description}</p>
                      </div>
                      <div className="bg-yellow-300 px-3 py-1 rounded-full border-4 border-gray-800 text-sm font-black whitespace-nowrap">+{m.reward} 💰</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-white rounded-full h-5 border-4 border-gray-800 overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-indigo-500 transition-all duration-700 ease-out"
                          style={{ width: `${(status.progress / m.requirement) * 100}%` }}
                        />
                      </div>
                      <button
                        disabled={!canClaim}
                        onClick={() => onClaimMission(m.id)}
                        className={`px-6 py-2 rounded-2xl border-4 border-gray-800 font-game text-sm transition-all ${status.claimed ? 'bg-gray-400' :
                          canClaim ? 'bg-green-400 hover:scale-105 active:scale-90 shadow-[2px_2px_0_#2d2d2d]' : 'bg-gray-200 opacity-50'
                          }`}
                      >
                        {status.claimed ? 'Claimed' : 'Claim'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shop Section */}
          <div className="pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-game text-pink-500 flex items-center gap-3">
                <span className="bg-pink-100 p-2 rounded-2xl border-4 border-gray-800">🛍️</span> Panda Boutique
              </h3>
              <button
                onClick={onMintCosmetic}
                className="px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-400 border-4 border-gray-800 rounded-2xl font-black text-xs uppercase hover:scale-105 active:scale-95 transition-transform shadow-[2px_2px_0px_#2d2d2d]"
              >
                ✨ Mint NFT
              </button>
            </div>

            {ownedCosmetics.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span>💎 Your NFT Cosmetics</span>
                  <span className="bg-blue-200 px-3 py-1 rounded-full text-sm border-2 border-gray-800">{ownedCosmetics.length}</span>
                </h4>
                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-blue-50 border-4 border-blue-200 rounded-2xl">
                  {ownedCosmetics.map(cosmetic => {
                    const isEquipped = equippedCosmeticId === cosmetic.objectId;
                    const isLoading = isEquipping || isUnequipping;
                    return (
                      <div
                        key={cosmetic.objectId}
                        onClick={() => onEquipCosmetic(cosmetic.objectId)}
                        className={`
                          flex flex-col items-center justify-between border-4 border-gray-800 p-4 rounded-[2rem] transition-all cursor-pointer
                          hover:-translate-y-1 shadow-[4px_4px_0px_#2d2d2d] active:shadow-none active:translate-y-1
                          ${isEquipped ? 'bg-green-100' : 'bg-white'} ${isLoading ? 'opacity-50 pointer-events-none' : ''}
                        `}
                      >
                        <div className="text-4xl mb-2">✨</div>
                        <div className="w-full">
                          <p className="text-center font-bold text-gray-800 mb-2 text-sm line-clamp-2">{cosmetic.fields.name}</p>
                          <div className={`text-center py-1 rounded-2xl border-4 border-gray-800 font-black uppercase text-xs ${isEquipped ? 'bg-green-400' : 'bg-blue-400 text-white'
                            }`}>
                            {isLoading ? 'LOADING...' : isEquipped ? 'Equipped' : 'Equip'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
