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
  soundToggle?: React.ReactNode;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  stats,
  coins,
  evmAccount,
  idrxBalance,
  baseName,
  onCoinsClick,
  onDisconnect,
  soundToggle,
}) => {
  const displayName = baseName || `${evmAccount.slice(0, 6)}...${evmAccount.slice(-4)}`;

  return (
    <div className="p-2 sm:p-4 flex flex-col gap-1 sm:gap-2 bg-white/60 backdrop-blur-md border-b-4 border-gray-800 z-10">
      <div className="flex justify-between items-center gap-1">
        <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
          <div className="bg-blue-600 text-white font-game px-2 sm:px-3 py-1 rounded-full border-4 border-gray-800 shadow-[2px_2px_0px_#2d2d2d] text-xs sm:text-base whitespace-nowrap">
            LVL {stats.level}
          </div>
          <div className="w-16 sm:w-32 bg-gray-200 rounded-full h-3 sm:h-4 border-2 border-gray-800 overflow-hidden relative">
            <div className="h-full bg-blue-400 transition-all duration-500" style={{ width: `${stats.xp}%` }} />
            <span className="absolute inset-0 flex items-center justify-center text-[8px] sm:text-[10px] font-black uppercase text-gray-700">XP</span>
          </div>
        </div>
        <div className="flex gap-1 sm:gap-2 items-center">
          {idrxBalance && (
            <div className="bg-emerald-400 border-4 border-gray-800 rounded-full px-2 sm:px-3 py-1 sm:py-2 font-game text-xs sm:text-sm shadow-[2px_2px_0px_#2d2d2d] flex items-center gap-1">
              💎 <span className="text-gray-900 hidden sm:inline">{idrxBalance}</span>
              <span className="text-gray-900 sm:hidden">{Number(idrxBalance.replace(/,/g, '')) > 9999 ? Math.floor(Number(idrxBalance.replace(/,/g, '')) / 1000) + 'K' : idrxBalance}</span>
            </div>
          )}
          <div
            onClick={onCoinsClick}
            className="cursor-pointer bg-yellow-400 border-4 border-gray-800 rounded-full px-2 sm:px-4 py-1 sm:py-2 font-game text-sm sm:text-xl shadow-[2px_2px_0px_#2d2d2d] sm:shadow-[4px_4px_0px_#2d2d2d] hover:-translate-y-1 transition-transform flex items-center gap-1"
          >
            💰 <span className="text-gray-900">{coins}</span>
          </div>
          <div className="hidden sm:block bg-green-500 text-white font-bold px-3 py-2 rounded-lg border-4 border-gray-800 shadow-[2px_2px_0px_#2d2d2d] text-sm truncate max-w-[140px]">
            {displayName}
          </div>
          {soundToggle}
          <button
            onClick={onDisconnect}
            className="bg-red-400 text-white font-bold px-2 sm:px-3 py-1 sm:py-2 rounded-lg border-4 border-gray-800 shadow-[2px_2px_0px_#2d2d2d] hover:-translate-y-1 transition-transform text-xs sm:text-sm"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex justify-between gap-1 sm:gap-2 overflow-x-auto pb-1 no-scrollbar">
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
