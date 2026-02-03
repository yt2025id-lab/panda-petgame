"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import useSound from "../../hooks/useSound";

interface BambooSliceProps {
  onClose: () => void;
  onGameEnd: (score: number, xpEarned: number, coinsEarned: number) => void;
}

interface FlyingItem {
  id: number;
  emoji: string;
  isBomb: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  sliced: boolean;
  sliceTime: number;
  missed: boolean;
  size: number;
}

interface SlashTrail {
  id: number;
  x: number;
  y: number;
  angle: number;
  time: number;
}

const BAMBOO_EMOJIS = ["🎋", "🌿", "🍀"];
const BOMB_EMOJI = "💣";
const GAME_DURATION = 45;
const MAX_LIVES = 3;
const GRAVITY = 0.15;
const SCORE_PER_SLICE = 10;
const BOMB_PENALTY = 20;
const ITEM_SIZE = 48;

export default function BambooSlice({ onClose, onGameEnd }: BambooSliceProps) {
  const sound = useSound();
  const [gameState, setGameState] = useState<"ready" | "playing" | "over">("ready");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [items, setItems] = useState<FlyingItem[]>([]);
  const [slashTrails, setSlashTrails] = useState<SlashTrail[]>([]);
  const [combo, setCombo] = useState(0);
  const [showCombo, setShowCombo] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  const itemIdRef = useRef<number>(0);
  const slashIdRef = useRef<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const itemsRef = useRef<FlyingItem[]>([]);
  const livesRef = useRef(MAX_LIVES);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const gameStateRef = useRef<"ready" | "playing" | "over">("ready");
  const containerSizeRef = useRef({ width: 0, height: 0 });

  // Sync refs with state
  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const spawnItem = useCallback(() => {
    const container = canvasRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    containerSizeRef.current = { width, height };

    const isBomb = Math.random() < 0.2;
    const emoji = isBomb ? BOMB_EMOJI : BAMBOO_EMOJIS[Math.floor(Math.random() * BAMBOO_EMOJIS.length)];

    const startX = Math.random() * (width - 80) + 40;
    const vx = (Math.random() - 0.5) * 4;
    const vy = -(Math.random() * 4 + 8);

    const newItem: FlyingItem = {
      id: itemIdRef.current++,
      emoji,
      isBomb,
      x: startX,
      y: height + 20,
      vx,
      vy,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 10,
      sliced: false,
      sliceTime: 0,
      missed: false,
      size: ITEM_SIZE,
    };

    itemsRef.current = [...itemsRef.current, newItem];
  }, []);

  const gameLoop = useCallback(
    (timestamp: number) => {
      if (gameStateRef.current !== "playing") return;

      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Spawn items
      spawnTimerRef.current += delta;
      const spawnInterval = Math.max(400, 1000 - scoreRef.current * 2);
      if (spawnTimerRef.current > spawnInterval) {
        spawnTimerRef.current = 0;
        const count = Math.random() < 0.3 ? 2 : 1;
        for (let i = 0; i < count; i++) {
          setTimeout(() => spawnItem(), i * 150);
        }
      }

      // Update items
      const height = containerSizeRef.current.height || 800;
      let newMissed = 0;
      const updatedItems: FlyingItem[] = [];

      for (const item of itemsRef.current) {
        if (item.sliced) {
          if (timestamp - item.sliceTime > 500) continue;
          updatedItems.push(item);
          continue;
        }

        const newItem = { ...item };
        newItem.x += newItem.vx;
        newItem.y += newItem.vy;
        newItem.vy += GRAVITY;
        newItem.rotation += newItem.rotationSpeed;

        // Check if fell off screen
        if (newItem.y > height + 60 && !newItem.missed) {
          if (!newItem.isBomb) {
            newItem.missed = true;
            newMissed++;
          }
          continue; // Remove from list
        }

        updatedItems.push(newItem);
      }

      itemsRef.current = updatedItems;
      setItems([...updatedItems]);

      // Handle missed bamboo
      if (newMissed > 0) {
        const newLives = Math.max(0, livesRef.current - newMissed);
        setLives(newLives);
        comboRef.current = 0;
        setCombo(0);
        if (newLives <= 0) {
          endGame();
          return;
        }
      }

      // Clean up old slash trails
      setSlashTrails((prev) => prev.filter((t) => timestamp - t.time < 300));

      animFrameRef.current = requestAnimationFrame(gameLoop);
    },
    [spawnItem]
  );

  const endGame = useCallback(() => {
    sound.play('gameover');
    setGameState("over");
    gameStateRef.current = "over";
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
  }, []);

  const startGame = useCallback(() => {
    setScore(0);
    setLives(MAX_LIVES);
    setTimeLeft(GAME_DURATION);
    setItems([]);
    setSlashTrails([]);
    setCombo(0);
    setShowCombo(false);
    scoreRef.current = 0;
    livesRef.current = MAX_LIVES;
    comboRef.current = 0;
    itemsRef.current = [];
    spawnTimerRef.current = 0;
    itemIdRef.current = 0;

    setGameState("playing");
    gameStateRef.current = "playing";

    // Update container size
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      containerSizeRef.current = { width: rect.width, height: rect.height };
    }

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(gameLoop);

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [gameLoop, endGame]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const handleSlice = useCallback(
    (clientX: number, clientY: number) => {
      if (gameStateRef.current !== "playing") return;

      const container = canvasRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      let hitSomething = false;

      itemsRef.current = itemsRef.current.map((item) => {
        if (item.sliced) return item;

        const dx = x - item.x;
        const dy = y - item.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < item.size * 0.7) {
          hitSomething = true;

          if (item.isBomb) {
            sound.play('error');
            const newLives = Math.max(0, livesRef.current - 1);
            setLives(newLives);
            comboRef.current = 0;
            setCombo(0);
            setShowCombo(false);
            if (newLives <= 0) {
              setTimeout(() => endGame(), 50);
            }
            setScore((prev) => Math.max(0, prev - BOMB_PENALTY));
            scoreRef.current = Math.max(0, scoreRef.current - BOMB_PENALTY);
          } else {
            sound.play('score');
            comboRef.current += 1;
            const c = comboRef.current;
            setCombo(c);
            if (c >= 3) {
              setShowCombo(true);
              setTimeout(() => setShowCombo(false), 800);
            }
            const bonus = c >= 3 ? Math.floor(c / 3) * 5 : 0;
            const points = SCORE_PER_SLICE + bonus;
            setScore((prev) => prev + points);
            scoreRef.current += points;
          }

          // Add slash trail
          const angle = Math.random() * 360;
          setSlashTrails((prev) => [
            ...prev,
            { id: slashIdRef.current++, x: item.x, y: item.y, angle, time: performance.now() },
          ]);

          return { ...item, sliced: true, sliceTime: performance.now() };
        }
        return item;
      });

      setItems([...itemsRef.current]);

      if (!hitSomething) {
        // Add a miss slash trail for visual feedback
        setSlashTrails((prev) => [
          ...prev,
          { id: slashIdRef.current++, x, y, angle: Math.random() * 360, time: performance.now() },
        ]);
      }
    },
    [endGame]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      handleSlice(e.clientX, e.clientY);
    },
    [handleSlice]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (e.buttons > 0) {
        handleSlice(e.clientX, e.clientY);
      }
    },
    [handleSlice]
  );

  const finalScore = score;
  const xpEarned = Math.max(0, Math.floor(finalScore / 5));
  const coinsEarned = Math.max(0, Math.floor(finalScore / 10));

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70">
      <div
        className="relative w-full h-full max-w-lg max-h-[90vh] mx-auto my-auto flex flex-col overflow-hidden
                    border-4 border-gray-800 rounded-2xl shadow-[4px_4px_0px_#2d2d2d] bg-gradient-to-b from-green-200 via-green-100 to-emerald-200"
      >
        {/* Header HUD */}
        <div className="flex items-center justify-between px-4 py-2 bg-green-800/90 border-b-4 border-gray-800 z-10">
          <div className="flex items-center gap-1">
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <span key={i} className="text-xl">
                {i < lives ? "❤️" : "🖤"}
              </span>
            ))}
          </div>
          <div
            className="px-3 py-1 bg-yellow-400 border-2 border-gray-800 rounded-lg
                        shadow-[2px_2px_0px_#2d2d2d] font-black text-gray-900 text-lg"
          >
            {score}
          </div>
          <div
            className="px-3 py-1 bg-white border-2 border-gray-800 rounded-lg
                        shadow-[2px_2px_0px_#2d2d2d] font-black text-gray-900 text-lg"
          >
            ⏱ {timeLeft}s
          </div>
          <button
            onClick={onClose}
            className="px-2 py-1 bg-red-500 border-2 border-gray-800 rounded-lg
                       shadow-[2px_2px_0px_#2d2d2d] font-black text-white text-sm
                       hover:bg-red-600 active:translate-y-[2px] active:shadow-none transition-all"
          >
            ✕
          </button>
        </div>

        {/* Game Area */}
        <div
          ref={canvasRef}
          className="flex-1 relative overflow-hidden select-none touch-none cursor-crosshair"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          style={{ touchAction: "none" }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="absolute bottom-0 left-[10%] text-6xl">🎋</div>
            <div className="absolute bottom-0 right-[15%] text-5xl">🎋</div>
            <div className="absolute bottom-0 left-[50%] text-7xl">🎋</div>
          </div>

          {/* Combo indicator */}
          {showCombo && combo >= 3 && (
            <div
              className="absolute top-4 left-1/2 -translate-x-1/2 z-20
                          px-4 py-2 bg-orange-500 border-3 border-gray-800 rounded-xl
                          shadow-[3px_3px_0px_#2d2d2d] font-black text-white text-2xl
                          animate-bounce"
            >
              {combo}x COMBO!
            </div>
          )}

          {/* Flying Items */}
          {items.map((item) => (
            <div
              key={item.id}
              className="absolute pointer-events-none"
              style={{
                left: item.x - item.size / 2,
                top: item.y - item.size / 2,
                width: item.size,
                height: item.size,
                transform: `rotate(${item.rotation}deg)`,
                transition: item.sliced ? "opacity 0.3s, transform 0.3s" : "none",
                opacity: item.sliced ? 0 : 1,
              }}
            >
              {item.sliced ? (
                <div className="relative w-full h-full">
                  <span
                    className="absolute text-3xl"
                    style={{
                      transform: "translate(-8px, -8px) rotate(-20deg)",
                      filter: "brightness(0.8)",
                    }}
                  >
                    {item.emoji}
                  </span>
                  <span
                    className="absolute text-3xl"
                    style={{
                      transform: "translate(8px, 8px) rotate(20deg)",
                      filter: "brightness(0.8)",
                    }}
                  >
                    {item.emoji}
                  </span>
                </div>
              ) : (
                <span className="text-4xl block text-center leading-none">{item.emoji}</span>
              )}
            </div>
          ))}

          {/* Slash Trails */}
          {slashTrails.map((trail) => (
            <div
              key={trail.id}
              className="absolute pointer-events-none"
              style={{
                left: trail.x - 30,
                top: trail.y - 4,
                width: 60,
                height: 8,
                transform: `rotate(${trail.angle}deg)`,
                background: "linear-gradient(90deg, transparent, #fff, #fef08a, #fff, transparent)",
                borderRadius: 4,
                opacity: 0.9,
                animation: "slashFade 0.3s ease-out forwards",
              }}
            />
          ))}

          {/* Ready Screen */}
          {gameState === "ready" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black/40 z-30">
              <div
                className="px-6 py-4 bg-green-500 border-4 border-gray-800 rounded-2xl
                            shadow-[4px_4px_0px_#2d2d2d] text-center"
              >
                <h2 className="text-3xl font-black text-white mb-2" style={{ textShadow: "2px 2px 0 #2d2d2d" }}>
                  🎋 Bamboo Slice 🎋
                </h2>
                <p className="text-white font-black text-sm mb-1">Slice the bamboo! Avoid the bombs!</p>
                <p className="text-green-100 font-black text-xs">Swipe or tap to slice</p>
              </div>
              <div className="flex flex-col items-center gap-3 text-white font-black text-sm">
                <div
                  className="px-4 py-2 bg-white/20 border-2 border-white/40 rounded-xl
                              backdrop-blur-sm"
                >
                  <span className="text-lg mr-2">🎋🌿🍀</span> = +{SCORE_PER_SLICE} pts
                </div>
                <div
                  className="px-4 py-2 bg-white/20 border-2 border-white/40 rounded-xl
                              backdrop-blur-sm"
                >
                  <span className="text-lg mr-2">💣</span> = -{BOMB_PENALTY} pts & lose a life
                </div>
                <div
                  className="px-4 py-2 bg-white/20 border-2 border-white/40 rounded-xl
                              backdrop-blur-sm"
                >
                  ❤️❤️❤️ 3 lives &bull; ⏱ {GAME_DURATION}s
                </div>
              </div>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-yellow-400 border-4 border-gray-800 rounded-xl
                           shadow-[4px_4px_0px_#2d2d2d] font-black text-gray-900 text-xl
                           hover:bg-yellow-300 active:translate-y-[4px] active:shadow-none
                           transition-all"
              >
                START!
              </button>
            </div>
          )}

          {/* Game Over Screen */}
          {gameState === "over" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-black/50 z-30">
              <div
                className="px-8 py-6 bg-white border-4 border-gray-800 rounded-2xl
                            shadow-[4px_4px_0px_#2d2d2d] text-center max-w-xs w-full mx-4"
              >
                <h2 className="text-2xl font-black text-gray-900 mb-4" style={{ textShadow: "1px 1px 0 #ccc" }}>
                  Game Over!
                </h2>
                <div className="space-y-2 mb-5">
                  <div
                    className="flex items-center justify-between px-4 py-2 bg-yellow-100
                                border-2 border-gray-800 rounded-lg"
                  >
                    <span className="font-black text-gray-700">Score</span>
                    <span className="font-black text-gray-900 text-xl">{finalScore}</span>
                  </div>
                  <div
                    className="flex items-center justify-between px-4 py-2 bg-blue-100
                                border-2 border-gray-800 rounded-lg"
                  >
                    <span className="font-black text-gray-700">⭐ XP</span>
                    <span className="font-black text-blue-700 text-xl">+{xpEarned}</span>
                  </div>
                  <div
                    className="flex items-center justify-between px-4 py-2 bg-amber-100
                                border-2 border-gray-800 rounded-lg"
                  >
                    <span className="font-black text-gray-700">🪙 Coins</span>
                    <span className="font-black text-amber-700 text-xl">+{coinsEarned}</span>
                  </div>
                </div>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={startGame}
                    className="px-5 py-2 bg-green-500 border-3 border-gray-800 rounded-xl
                               shadow-[3px_3px_0px_#2d2d2d] font-black text-white text-base
                               hover:bg-green-400 active:translate-y-[3px] active:shadow-none
                               transition-all"
                  >
                    Retry
                  </button>
                  <button
                    onClick={() => onGameEnd(finalScore, xpEarned, coinsEarned)}
                    className="px-5 py-2 bg-yellow-400 border-3 border-gray-800 rounded-xl
                               shadow-[3px_3px_0px_#2d2d2d] font-black text-gray-900 text-base
                               hover:bg-yellow-300 active:translate-y-[3px] active:shadow-none
                               transition-all"
                  >
                    Collect
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inline keyframe animation for slash fade */}
      <style>{`
        @keyframes slashFade {
          0% { opacity: 0.9; transform: rotate(var(--tw-rotate, 0deg)) scaleX(0.5); }
          50% { opacity: 1; transform: rotate(var(--tw-rotate, 0deg)) scaleX(1.2); }
          100% { opacity: 0; transform: rotate(var(--tw-rotate, 0deg)) scaleX(1.5); }
        }
      `}</style>
    </div>
  );
}
