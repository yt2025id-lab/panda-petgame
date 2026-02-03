"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

interface MemoryMatchProps {
  onClose: () => void;
  onGameEnd: (score: number, xpEarned: number, coinsEarned: number) => void;
}

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

const EMOJIS = ["🐼", "🎋", "🍣", "🎮", "🌟", "💎", "🎀", "🏆"];
const GAME_DURATION = 60;
const POINTS_PER_MATCH = 10;
const XP_PER_MATCH = 5;
const COINS_PER_MATCH = 3;

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createDeck(): Card[] {
  const pairs = [...EMOJIS, ...EMOJIS];
  const shuffled = shuffleArray(pairs);
  return shuffled.map((emoji, index) => ({
    id: index,
    emoji,
    flipped: false,
    matched: false,
  }));
}

const MemoryMatch: React.FC<MemoryMatchProps> = ({ onClose, onGameEnd }) => {
  const [cards, setCards] = useState<Card[]>(() => createDeck());
  const [gameState, setGameState] = useState<"playing" | "ended">("playing");
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [lockBoard, setLockBoard] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasEndedRef = useRef(false);

  // Start countdown timer
  useEffect(() => {
    if (gameState !== "playing") return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // End game when time runs out
  useEffect(() => {
    if (timeLeft === 0 && gameState === "playing") {
      setGameState("ended");
    }
  }, [timeLeft, gameState]);

  // End game when all matches found
  useEffect(() => {
    if (matches === EMOJIS.length && gameState === "playing") {
      setGameState("ended");
    }
  }, [matches, gameState]);

  // Report results when game ends
  useEffect(() => {
    if (gameState === "ended" && !hasEndedRef.current) {
      hasEndedRef.current = true;
      if (timerRef.current) clearInterval(timerRef.current);

      const timeBonus = timeLeft * 2;
      const finalScore = score + timeBonus;
      const xpEarned = matches * XP_PER_MATCH;
      const coinsEarned = matches * COINS_PER_MATCH;

      onGameEnd(finalScore, xpEarned, coinsEarned);
    }
  }, [gameState, score, matches, timeLeft, onGameEnd]);

  const handleCardClick = useCallback(
    (id: number) => {
      if (lockBoard) return;
      if (gameState !== "playing") return;

      const card = cards.find((c) => c.id === id);
      if (!card || card.flipped || card.matched) return;
      if (flippedIds.includes(id)) return;

      // Flip the card
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, flipped: true } : c))
      );

      const newFlipped = [...flippedIds, id];
      setFlippedIds(newFlipped);

      if (newFlipped.length === 2) {
        setLockBoard(true);
        const [firstId, secondId] = newFlipped;
        const firstCard = cards.find((c) => c.id === firstId)!;
        const secondCard = cards.find((c) => c.id === secondId)!;

        if (firstCard.emoji === secondCard.emoji) {
          // Match found
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === firstId || c.id === secondId
                  ? { ...c, matched: true }
                  : c
              )
            );
            setScore((prev) => prev + POINTS_PER_MATCH);
            setMatches((prev) => prev + 1);
            setFlippedIds([]);
            setLockBoard(false);
          }, 400);
        } else {
          // No match - flip back
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === firstId || c.id === secondId
                  ? { ...c, flipped: false }
                  : c
              )
            );
            setFlippedIds([]);
            setLockBoard(false);
          }, 800);
        }
      }
    },
    [cards, flippedIds, lockBoard, gameState]
  );

  const handlePlayAgain = () => {
    hasEndedRef.current = false;
    setCards(createDeck());
    setScore(0);
    setMatches(0);
    setTimeLeft(GAME_DURATION);
    setFlippedIds([]);
    setLockBoard(false);
    setGameState("playing");
  };

  const timeBonus = timeLeft * 2;
  const finalScore = score + timeBonus;
  const xpEarned = matches * XP_PER_MATCH;
  const coinsEarned = matches * COINS_PER_MATCH;

  const timerColor =
    timeLeft <= 10
      ? "text-red-500"
      : timeLeft <= 20
        ? "text-orange-500"
        : "text-emerald-600";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[200] animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-[3rem] border-8 border-gray-800 w-full max-w-lg shadow-[0_20px_0_#2d2d2d] animate-in zoom-in-95 duration-300 overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b-4 border-gray-800 flex justify-between items-center bg-gradient-to-r from-purple-200 to-pink-200">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-game text-gray-800">
              🐼 Memory Match
            </h2>
            <div className="flex gap-3 text-sm font-black">
              <div className="bg-yellow-300 px-3 py-1 rounded-full border-2 border-gray-800">
                Score: {score}
              </div>
              <div className="bg-pink-300 px-3 py-1 rounded-full border-2 border-gray-800">
                Matches: {matches}/{EMOJIS.length}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            {gameState === "playing" && (
              <div
                className={`bg-white rounded-2xl border-4 border-gray-800 px-4 py-2 shadow-[3px_3px_0_#2d2d2d] ${timeLeft <= 10 ? "animate-pulse" : ""}`}
              >
                <div className="text-xs font-black uppercase text-gray-500">
                  Time
                </div>
                <div className={`text-2xl font-black ${timerColor}`}>
                  {timeLeft}s
                </div>
              </div>
            )}
            {gameState === "ended" && (
              <button
                onClick={onClose}
                className="text-2xl font-bold bg-red-100 text-red-600 rounded-full w-12 h-12 flex items-center justify-center border-4 border-gray-800 hover:scale-110 active:scale-95 transition-transform"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        {/* Game Area */}
        {gameState === "playing" ? (
          <div className="p-6">
            <div className="grid grid-cols-4 gap-3 max-w-[360px] mx-auto">
              {cards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className="aspect-square cursor-pointer"
                  style={{ perspective: "600px" }}
                >
                  <div
                    className="relative w-full h-full transition-transform duration-500"
                    style={{
                      transformStyle: "preserve-3d",
                      transform:
                        card.flipped || card.matched
                          ? "rotateY(180deg)"
                          : "rotateY(0deg)",
                    }}
                  >
                    {/* Card Back */}
                    <div
                      className={`absolute inset-0 rounded-2xl border-4 border-gray-800 shadow-[3px_3px_0_#2d2d2d] flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 active:scale-95 transition-colors ${
                        card.matched ? "opacity-0" : ""
                      }`}
                      style={{ backfaceVisibility: "hidden" }}
                    >
                      <span className="text-3xl select-none">❓</span>
                    </div>

                    {/* Card Front */}
                    <div
                      className={`absolute inset-0 rounded-2xl border-4 border-gray-800 shadow-[3px_3px_0_#2d2d2d] flex items-center justify-center ${
                        card.matched
                          ? "bg-gradient-to-br from-green-200 to-emerald-200 border-green-600"
                          : "bg-gradient-to-br from-white to-gray-100"
                      }`}
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <span
                        className={`text-3xl select-none ${card.matched ? "animate-bounce" : ""}`}
                      >
                        {card.emoji}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Hint text */}
            {matches === 0 && flippedIds.length === 0 && (
              <div className="mt-4 text-center text-xs font-bold text-gray-500 bg-white/50 px-4 py-2 rounded-full border-2 border-gray-400">
                Tap cards to find matching pairs!
              </div>
            )}
          </div>
        ) : (
          /* Results Screen */
          <div className="p-8 text-center">
            <div className="text-6xl mb-4 animate-bounce">
              {matches === EMOJIS.length ? "🏆" : "⏰"}
            </div>
            <h3 className="text-3xl font-game mb-2 text-gray-800">
              {matches === EMOJIS.length ? "Perfect Game!" : "Time's Up!"}
            </h3>
            <p className="text-sm font-black text-gray-500 mb-6">
              {matches === EMOJIS.length
                ? `All pairs found with ${timeLeft}s to spare!`
                : `You found ${matches} of ${EMOJIS.length} pairs`}
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-blue-100 border-4 border-gray-800 rounded-2xl p-4">
                <div className="text-sm font-black uppercase text-gray-600 mb-1">
                  Final Score
                </div>
                <div className="text-5xl font-black text-blue-600">
                  {finalScore}
                </div>
                <div className="text-xs font-bold text-gray-500 mt-1">
                  {score} pts + {timeBonus} time bonus
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-yellow-100 border-4 border-gray-800 rounded-2xl p-4">
                  <div className="text-xs font-black uppercase text-gray-600 mb-1">
                    XP Earned
                  </div>
                  <div className="text-3xl font-black text-yellow-600">
                    +{xpEarned}
                  </div>
                </div>
                <div className="bg-green-100 border-4 border-gray-800 rounded-2xl p-4">
                  <div className="text-xs font-black uppercase text-gray-600 mb-1">
                    Coins Earned
                  </div>
                  <div className="text-3xl font-black text-green-600">
                    +{coinsEarned}
                  </div>
                </div>
              </div>

              <div className="bg-purple-100 border-4 border-gray-800 rounded-2xl p-4">
                <div className="text-xs font-black uppercase text-gray-600 mb-1">
                  Pairs Found
                </div>
                <div className="text-3xl font-black text-purple-600">
                  {matches} / {EMOJIS.length}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handlePlayAgain}
                className="flex-1 bg-purple-500 hover:bg-purple-600 active:scale-95 text-white font-game text-xl py-4 rounded-2xl border-4 border-gray-800 shadow-[4px_4px_0_#2d2d2d] transition-all"
              >
                Play Again
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-game text-xl py-4 rounded-2xl border-4 border-gray-800 shadow-[4px_4px_0_#2d2d2d] transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryMatch;
