"use client";
import React, { useState } from "react";
import { STREAK_REWARDS } from "./constant";

interface DailyCheckInProps {
  streak: number;
  onCheckIn: () => void;
  bonus: number;
}

const DailyCheckIn: React.FC<DailyCheckInProps> = ({ streak, onCheckIn, bonus }) => {
  const [claimed, setClaimed] = useState(false);
  const [animatedBonus, setAnimatedBonus] = useState(0);

  const handleClaim = () => {
    onCheckIn();
    setClaimed(true);
    // Animate bonus count up
    let current = 0;
    const target = bonus || 100;
    const step = Math.ceil(target / 20);
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      setAnimatedBonus(current);
      if (current >= target) clearInterval(interval);
    }, 30);
  };

  const nextMilestone = Object.keys(STREAK_REWARDS)
    .map(Number)
    .find((d) => d > streak + 1);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[150] animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] border-8 border-gray-800 w-full max-w-sm shadow-[0_20px_0_#2d2d2d] animate-in zoom-in-95 duration-300 overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-amber-200 to-orange-200 border-b-4 border-gray-800 text-center">
          <div className="text-5xl mb-2">🌅</div>
          <h2 className="text-3xl font-game text-gray-800">Welcome Back!</h2>
          <p className="text-sm font-black text-gray-600 mt-1">Daily Check-In</p>
        </div>

        <div className="p-6 space-y-4">
          {/* Streak Display */}
          <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl border-4 border-orange-300 p-4 text-center">
            <div className="text-xs font-black uppercase text-gray-500 mb-1">Login Streak</div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl font-black text-orange-600">{streak + 1}</span>
              <span className="text-2xl">🔥</span>
            </div>
            <div className="flex justify-center gap-1 mt-2">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full border-2 border-gray-800 flex items-center justify-center text-xs font-black ${
                    i < (streak + 1) % 7 || (streak + 1 >= 7 && i === 6)
                      ? "bg-orange-400 text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            {nextMilestone && (
              <p className="text-[10px] font-bold text-gray-500 mt-2">
                {nextMilestone - (streak + 1)} days to {nextMilestone}-day bonus (+{STREAK_REWARDS[nextMilestone]} coins!)
              </p>
            )}
          </div>

          {/* Bonus Display */}
          {!claimed ? (
            <button
              onClick={handleClaim}
              className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-2xl border-4 border-gray-800 font-game text-xl shadow-[4px_4px_0_#2d2d2d] hover:scale-105 active:scale-95 transition-transform"
            >
              Claim Daily Bonus!
            </button>
          ) : (
            <div className="text-center space-y-3">
              <div className="bg-yellow-100 rounded-2xl border-4 border-gray-800 p-4">
                <div className="text-xs font-black uppercase text-gray-500 mb-1">You received</div>
                <div className="text-4xl font-black text-yellow-600">+{animatedBonus} 💰</div>
              </div>
              {STREAK_REWARDS[streak + 1] && (
                <div className="bg-red-100 rounded-2xl border-4 border-gray-800 p-3">
                  <div className="text-xs font-black uppercase text-gray-500 mb-1">Streak Bonus!</div>
                  <div className="text-2xl font-black text-red-600">+{STREAK_REWARDS[streak + 1]} 💰</div>
                </div>
              )}
              <button
                onClick={() => {/* parent will unmount by checking showDailyCheckIn */}}
                className="w-full py-3 bg-green-400 text-white rounded-2xl border-4 border-gray-800 font-game text-lg shadow-[4px_4px_0_#2d2d2d] hover:scale-105 active:scale-95 transition-transform"
              >
                Let's Play!
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyCheckIn;
