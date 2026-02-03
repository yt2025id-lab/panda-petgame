"use client";
import React, { useState } from "react";

interface SoundToggleProps {
  isMuted: () => boolean;
  onToggle: () => boolean;
}

const SoundToggle: React.FC<SoundToggleProps> = ({ isMuted, onToggle }) => {
  const [muted, setMuted] = useState(isMuted());

  const handleClick = () => {
    const newMuted = onToggle();
    setMuted(newMuted);
  };

  return (
    <button
      onClick={handleClick}
      className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white/80 hover:bg-white rounded-full border-2 border-gray-800 shadow-[2px_2px_0px_#2d2d2d] hover:scale-110 active:scale-95 transition-transform text-sm sm:text-base"
      title={muted ? "Unmute" : "Mute"}
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );
};

export default SoundToggle;
