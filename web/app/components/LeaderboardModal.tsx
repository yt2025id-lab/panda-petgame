"use client"
import React from 'react';
import { LeaderboardEntry, PlayerStats } from '../hooks/evm/useLeaderboard';

interface LeaderboardModalProps {
  topPlayers: LeaderboardEntry[];
  playerStats: PlayerStats | null;
  evmAccount: string;
  isLoading: boolean;
  onClose: () => void;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  topPlayers,
  playerStats,
  evmAccount,
  isLoading,
  onClose,
}) => {
  const getRankEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
      <div
        className="bg-white rounded-[3rem] border-8 border-gray-800 w-full max-w-lg shadow-[0_20px_0_#2d2d2d] animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 pb-4 border-b-4 border-gray-100 flex justify-between items-center bg-gradient-to-r from-yellow-50 to-orange-50">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🏆</span>
            <h2 className="text-3xl font-game text-gray-800">Leaderboard</h2>
          </div>
          <button
            onClick={onClose}
            className="text-2xl font-bold bg-red-100 text-red-600 rounded-full w-12 h-12 flex items-center justify-center border-4 border-gray-800 hover:scale-110 active:scale-95 transition-transform"
          >
            x
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {/* Your Stats */}
          {playerStats && playerStats.rank > 0 && (
            <div className="mb-6 p-4 bg-blue-50 rounded-2xl border-4 border-blue-300">
              <div className="text-sm font-black text-blue-600 uppercase mb-2">Your Rank</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getRankEmoji(playerStats.rank)}</span>
                  <div>
                    <div className="font-black text-gray-800">{evmAccount.slice(0, 6)}...{evmAccount.slice(-4)}</div>
                    <div className="text-xs text-gray-500">Level {playerStats.pandaLevel} | {playerStats.gamesPlayed} games</div>
                  </div>
                </div>
                <div className="bg-yellow-400 px-4 py-2 rounded-full border-4 border-gray-800 font-game text-lg">
                  {playerStats.totalScore}
                </div>
              </div>
            </div>
          )}

          {/* Top Players */}
          {isLoading ? (
            <div className="text-center py-10">
              <div className="text-4xl animate-bounce mb-2">🏆</div>
              <p className="text-gray-400 font-bold">Loading rankings...</p>
            </div>
          ) : topPlayers.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-6xl mb-4">🎮</div>
              <p className="text-gray-500 font-bold text-lg">No players yet!</p>
              <p className="text-gray-400 text-sm mt-2">Play minigames to get on the leaderboard</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topPlayers.map((entry, i) => {
                const isYou = entry.player.toLowerCase() === evmAccount.toLowerCase();
                return (
                  <div
                    key={entry.player}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-4 transition-all ${
                      isYou
                        ? 'bg-blue-50 border-blue-400 shadow-[4px_4px_0px_#93c5fd]'
                        : 'bg-white border-gray-200 shadow-[2px_2px_0px_#e5e7eb]'
                    }`}
                  >
                    <div className="text-2xl font-black min-w-[40px] text-center">
                      {getRankEmoji(i + 1)}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-800 text-sm">
                        {isYou ? "You" : `${entry.player.slice(0, 6)}...${entry.player.slice(-4)}`}
                      </div>
                      <div className="text-xs text-gray-400">
                        Lvl {entry.pandaLevel} | {entry.gamesPlayed} games
                      </div>
                    </div>
                    <div className="bg-yellow-300 px-3 py-1 rounded-full border-2 border-gray-800 font-black text-sm">
                      {entry.totalScore} pts
                    </div>
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

export default LeaderboardModal;
