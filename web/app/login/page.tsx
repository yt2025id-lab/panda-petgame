"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const { login, ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.replace("/");
    }
  }, [ready, authenticated, router]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-200 via-pink-100 to-blue-200 flex items-center justify-center p-4">
      {/* Floating panda emojis background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {["top-10 left-10", "top-20 right-16", "bottom-32 left-20", "bottom-16 right-10", "top-1/2 left-5", "top-1/3 right-8"].map(
          (pos, i) => (
            <div
              key={i}
              className={`absolute ${pos} text-6xl opacity-15 animate-bounce`}
              style={{ animationDelay: `${i * 0.3}s`, animationDuration: `${2 + i * 0.5}s` }}
            >
              🐼
            </div>
          )
        )}
      </div>

      <div className="bg-white rounded-[3rem] border-8 border-gray-800 shadow-[0_20px_0_#2d2d2d] p-10 max-w-md w-full space-y-8 text-center relative z-10">
        {/* Panda hero */}
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full border-8 border-gray-800 shadow-[4px_4px_0px_#2d2d2d]">
            <span className="text-7xl">🐼</span>
          </div>
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">
            Panda Pet
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            Your virtual pet on Base blockchain
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { emoji: "🎮", label: "Play Games" },
            { emoji: "🍕", label: "Feed Panda" },
            { emoji: "✨", label: "NFT Cosmetics" },
            { emoji: "🏆", label: "Missions" },
          ].map((feature) => (
            <span
              key={feature.label}
              className="bg-purple-100 text-purple-700 font-bold text-sm px-4 py-2 rounded-full border-2 border-purple-300"
            >
              {feature.emoji} {feature.label}
            </span>
          ))}
        </div>

        {/* Login button */}
        <button
          onClick={login}
          disabled={!ready}
          className="w-full h-14 text-xl font-black bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl border-4 border-gray-800 shadow-[4px_4px_0px_#2d2d2d] hover:-translate-y-1 active:translate-y-0 active:shadow-[2px_2px_0px_#2d2d2d] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {!ready ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <span className="text-2xl">🔗</span>
              Connect Wallet
            </>
          )}
        </button>

        <p className="text-xs text-gray-400 font-medium">
          Powered by Privy &middot; Coinbase Wallet &middot; Base Sepolia
        </p>
      </div>
    </div>
  );
}
