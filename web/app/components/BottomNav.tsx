"use client"
import React from 'react';

export type MenuType = 'NONE' | 'KITCHEN' | 'PLAY' | 'COINS' | 'COSMETIC' | 'LEADERBOARD' | 'ACHIEVEMENTS' | 'SOCIAL' | 'IDRX';

interface NavButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
  active: boolean;
  small?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, onClick, active, small }) => (
  <button onClick={onClick} className={`flex flex-col items-center rounded-xl sm:rounded-2xl transition-all duration-300 border-3 sm:border-4 ${small ? 'p-1 sm:p-2' : 'p-2 sm:p-3'} ${active ? 'bg-white border-gray-800 -translate-y-3 sm:-translate-y-4 shadow-[0_6px_0_#2d2d2d] sm:shadow-[0_8px_0_#2d2d2d]' : 'bg-white/40 border-transparent hover:bg-white/60 hover:-translate-y-1 active:translate-y-0'}`}>
    <span className={small ? "text-lg sm:text-2xl" : "text-2xl sm:text-3xl"}>{icon}</span>
    <span className={`font-black mt-0.5 uppercase text-gray-800 ${small ? 'text-[7px] sm:text-[8px]' : 'text-[9px] sm:text-xs'}`}>{label}</span>
  </button>
);

interface BottomNavProps {
  activeMenu: MenuType;
  isSleeping: boolean;
  isWashing: boolean;
  onMenuChange: (menu: MenuType) => void;
  onWash: () => void;
  onToggleSleep: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({
  activeMenu,
  isSleeping,
  isWashing,
  onMenuChange,
  onWash,
  onToggleSleep,
}) => {
  const toggleMenu = (menu: MenuType) => {
    onMenuChange(activeMenu === menu ? 'NONE' : menu);
  };

  return (
    <div className="bg-white/40 backdrop-blur-md border-t-4 border-gray-800 z-40 safe-area-bottom">
      {/* Main Row */}
      <div className="px-2 sm:px-4 pt-2 sm:pt-3 pb-0.5 sm:pb-1 flex justify-around items-center">
        <NavButton icon="🎮" label="Play" onClick={() => toggleMenu('PLAY')} active={activeMenu === 'PLAY'} />
        <NavButton icon="🥘" label="Kitchen" onClick={() => toggleMenu('KITCHEN')} active={activeMenu === 'KITCHEN'} />
        <NavButton icon="👗" label="Cosmetic" onClick={() => toggleMenu('COSMETIC')} active={activeMenu === 'COSMETIC'} />
        <NavButton icon="🧼" label="Wash" onClick={onWash} active={isWashing} />
        <NavButton icon={isSleeping ? "☀️" : "🌙"} label={isSleeping ? "Wake" : "Sleep"} onClick={onToggleSleep} active={isSleeping} />
      </div>
      {/* Secondary Row - New Features */}
      <div className="px-2 sm:px-4 pb-2 sm:pb-3 pt-0.5 sm:pt-1 flex justify-around items-center">
        <NavButton icon="💎" label="IDRX" onClick={() => toggleMenu('IDRX')} active={activeMenu === 'IDRX'} small />
        <NavButton icon="🏆" label="Rank" onClick={() => toggleMenu('LEADERBOARD')} active={activeMenu === 'LEADERBOARD'} small />
        <NavButton icon="🏅" label="Badges" onClick={() => toggleMenu('ACHIEVEMENTS')} active={activeMenu === 'ACHIEVEMENTS'} small />
        <NavButton icon="👥" label="Social" onClick={() => toggleMenu('SOCIAL')} active={activeMenu === 'SOCIAL'} small />
      </div>
    </div>
  );
};

export default BottomNav;
