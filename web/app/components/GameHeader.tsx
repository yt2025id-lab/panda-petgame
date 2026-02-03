"use client"
import React from 'react';
import { PetStats } from './type';
import StatBar from './StatBar';

interface GameHeaderProps {
  stats: PetStats;
  coins: number;
  evmAccount: string;
  idrxBalance?: string;
  baseName?: string | null;
  onCoinsClick: () => void;
  onDisconnect: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  stats,
  coins,
  evmAccount,
  idrxBalance,
  baseName,
  onCoinsClick,
  onDisconnect,
}) => {
  const displayName = baseName || `${evmAccount.slice(0, 6)}...${evmAccount.slice(-4)}`;

  return (
    <div className="p-4 flex flex-col gap-2 bg-white/60 backdrop-blur-md border-b-4 border-gray-800 z-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white font-game px-3 py-1 rounded-full border-4 border-gray-800 shadow-[2px_2px_0px_#2d2d2d]">
            LVL {stats.level}
          </div>
          <div className="w-32 bg-gray-200 rounded-full h-4 border-2 border-gray-800 overflow-hidden relative">
            <div className="h-full bg-blue-400 transition-all duration-500" style={{ width: `${stats.xp}%` }} />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black uppercase text-gray-700">XP</span>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {idrxBalance && (
            <div className="bg-emerald-400 border-4 border-gray-800 rounded-full px-3 py-2 font-game text-sm shadow-[2px_2px_0px_#2d2d2d] flex items-center gap-1">
              💎 <span className="text-gray-900">{idrxBalance}</span>
            </div>
          )}
          <div
            onClick={onCoinsClick}
            className="cursor-pointer bg-yellow-400 border-4 border-gray-800 rounded-full px-4 py-2 font-game text-xl shadow-[4px_4px_0px_#2d2d2d] hover:-translate-y-1 transition-transform flex items-center gap-2"
          >
            💰 <span className="text-gray-900">{coins}</span>
          </div>
          <div className="bg-green-500 text-white font-bold px-3 py-2 rounded-lg border-4 border-gray-800 shadow-[2px_2px_0px_#2d2d2d] text-sm">
            {displayName}
          </div>
          <button
            onClick={onDisconnect}
            className="bg-red-400 text-white font-bold px-3 py-2 rounded-lg border-4 border-gray-800 shadow-[2px_2px_0px_#2d2d2d] hover:-translate-y-1 transition-transform text-sm"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex justify-between gap-2 overflow-x-auto pb-1 no-scrollbar">
        <StatBar label="Hunger" value={stats.hunger} icon="🍕" color="bg-orange-400" />
        <StatBar label="Health" value={stats.health} icon="❤️" color="bg-red-500" />
        <StatBar label="Fun" value={stats.fun} icon="⚽" color="bg-blue-400" />
        <StatBar label="Energy" value={stats.energy} icon="⚡" color="bg-yellow-400" />
        <StatBar label="Soap" value={stats.hygiene} icon="🧼" color="bg-teal-300" />
      </div>
    </div>
  );
};

export default GameHeader;
