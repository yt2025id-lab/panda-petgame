"use client"
import React from 'react';

interface LandingPageProps {
  onPlayNow: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onPlayNow }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#1a0533] via-[#2d1b69] to-[#0f0c29] flex flex-col overflow-auto">
      {/* Floating panda emojis background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {["top-10 left-10", "top-20 right-16", "bottom-32 left-20", "bottom-16 right-10", "top-1/2 left-5", "top-1/3 right-8", "top-[15%] left-[40%]", "bottom-[25%] right-[30%]"].map(
          (pos, i) => (
            <div
              key={i}
              className={`absolute ${pos} text-5xl opacity-10 animate-bounce`}
              style={{ animationDelay: `${i * 0.4}s`, animationDuration: `${3 + i * 0.5}s` }}
            >
              🐼
            </div>
          )
        )}
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative z-10">
        <div className="text-center space-y-6 max-w-lg">
          <div className="inline-flex items-center justify-center w-36 h-36 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full border-8 border-white/20 shadow-[0_0_60px_rgba(168,85,247,0.4)]">
            <span className="text-8xl">🐼</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-5xl font-black text-white tracking-tight">
              Panda Pet Game
            </h1>
            <p className="text-xl text-purple-200 font-medium">
              Adopt, Feed, Play & Earn on Base Blockchain
            </p>
          </div>

          <p className="text-purple-300/80 text-base leading-relaxed max-w-sm mx-auto">
            Your own virtual panda NFT! Take care of your panda, play minigames, complete missions, and customize with cosmetics.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 gap-4 mt-10 max-w-md w-full px-4">
          {[
            { emoji: "🎮", title: "Minigames", desc: "Ball Shooter, Bamboo Catcher & more" },
            { emoji: "🍕", title: "Feed & Care", desc: "Keep your panda happy and healthy" },
            { emoji: "💰", title: "IDRX Economy", desc: "Claim IDRX & convert to Coins" },
            { emoji: "🏆", title: "Leaderboard", desc: "Compete with other players" },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-white/10 backdrop-blur-sm border-2 border-white/10 rounded-2xl p-4 text-center hover:bg-white/15 transition-colors"
            >
              <div className="text-3xl mb-2">{feature.emoji}</div>
              <h3 className="text-white font-bold text-sm">{feature.title}</h3>
              <p className="text-purple-300/70 text-xs mt-1">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-10 w-full max-w-md px-4 space-y-4">
          <button
            onClick={onPlayNow}
            className="w-full h-16 text-2xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 rounded-2xl border-4 border-gray-800 shadow-[4px_4px_0px_#2d2d2d] hover:-translate-y-1 active:translate-y-0 active:shadow-[2px_2px_0px_#2d2d2d] transition-all flex items-center justify-center gap-3"
          >
            🎮 Play Now
          </button>

          <div className="flex items-center justify-center gap-4 text-purple-400/60 text-xs font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              Base Sepolia
            </span>
            <span>|</span>
            <span>Free to Play</span>
            <span>|</span>
            <span>Powered by IDRX</span>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-12 max-w-md w-full px-4">
          <h2 className="text-center text-white/60 text-xs font-bold uppercase tracking-widest mb-4">How It Works</h2>
          <div className="flex items-center justify-between gap-2">
            {[
              { step: "1", label: "Connect Wallet" },
              { step: "2", label: "Create Panda NFT" },
              { step: "3", label: "Play & Earn" },
            ].map((s, i) => (
              <React.Fragment key={s.step}>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-purple-500/30 border-2 border-purple-400/40 flex items-center justify-center text-white font-black text-sm">
                    {s.step}
                  </div>
                  <span className="text-purple-300/70 text-xs font-medium text-center">{s.label}</span>
                </div>
                {i < 2 && <div className="flex-1 h-[2px] bg-purple-500/20 mb-6" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-purple-400/40 text-xs font-medium">
        Panda Pet Game &middot; Built on Base &middot; Powered by IDRX
      </div>
    </div>
  );
};

export default LandingPage;
