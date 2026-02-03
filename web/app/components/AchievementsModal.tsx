"use client"
import React from 'react';
import { AchievementInfo } from '../hooks/evm/useAchievements';
import { ACHIEVEMENT_EMOJIS } from '../constants/achievementsContract';

export interface AchievementRequirement {
  met: boolean;
  progress: string; // e.g. "12/50 feeds"
}

interface AchievementsModalProps {
  achievements: AchievementInfo[];
  requirements: Record<number, AchievementRequirement>;
  isLoading: boolean;
  isClaiming: boolean;
  onClaim: (achievementId: number) => void;
  onClose: () => void;
}

const AchievementsModal: React.FC<AchievementsModalProps> = ({
  achievements,
  requirements,
  isLoading,
  isClaiming,
  onClaim,
  onClose,
}) => {
  const getEmoji = (imageEmoji: string) => {
    return ACHIEVEMENT_EMOJIS[imageEmoji] || "🏅";
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
      <div
        className="bg-white rounded-[3rem] border-8 border-gray-800 w-full max-w-lg shadow-[0_20px_0_#2d2d2d] animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 pb-4 border-b-4 border-gray-100 flex justify-between items-center bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🏅</span>
            <div>
              <h2 className="text-3xl font-game text-gray-800">Achievements</h2>
              <p className="text-xs text-gray-400 font-bold">Soulbound NFT Badges</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-2xl font-bold bg-red-100 text-red-600 rounded-full w-12 h-12 flex items-center justify-center border-4 border-gray-800 hover:scale-110 active:scale-95 transition-transform"
          >
            x
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="text-center py-10">
              <div className="text-4xl animate-bounce mb-2">🏅</div>
              <p className="text-gray-400 font-bold">Loading achievements...</p>
            </div>
          ) : achievements.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-6xl mb-4">🔒</div>
              <p className="text-gray-500 font-bold text-lg">No achievements available</p>
              <p className="text-gray-400 text-sm mt-2">Achievements will appear after contract deployment</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement) => {
                const req = requirements[achievement.id];
                const canClaim = req?.met && !achievement.claimed;
                return (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-2xl border-4 transition-all flex flex-col items-center text-center ${
                      achievement.claimed
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-400 shadow-[4px_4px_0px_#fbbf24]'
                        : canClaim
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-400 shadow-[4px_4px_0px_#22c55e]'
                        : 'bg-gray-50 border-gray-200 opacity-70'
                    }`}
                  >
                    <div className={`text-4xl mb-2 ${achievement.claimed ? '' : canClaim ? '' : 'grayscale'}`}>
                      {getEmoji(achievement.imageEmoji)}
                    </div>
                    <h4 className="font-black text-sm text-gray-800 mb-1">{achievement.name}</h4>
                    <p className="text-[10px] text-gray-400 mb-1">{achievement.description}</p>

                    {/* Progress indicator */}
                    {!achievement.claimed && req && (
                      <p className={`text-[10px] font-bold mb-2 ${req.met ? 'text-green-600' : 'text-gray-400'}`}>
                        {req.progress}
                      </p>
                    )}

                    {achievement.claimed ? (
                      <div className="px-3 py-1 bg-green-400 rounded-full border-2 border-gray-800 text-[10px] font-black uppercase">
                        Earned!
                      </div>
                    ) : canClaim ? (
                      <button
                        onClick={() => onClaim(achievement.id)}
                        disabled={isClaiming}
                        className="px-3 py-1 bg-green-500 text-white rounded-full border-2 border-gray-800 text-[10px] font-black uppercase hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 animate-pulse"
                      >
                        {isClaiming ? 'Claiming...' : 'Claim!'}
                      </button>
                    ) : (
                      <div className="px-3 py-1 bg-gray-200 text-gray-500 rounded-full border-2 border-gray-300 text-[10px] font-black uppercase">
                        Locked
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementsModal;
