import React, { useState, useEffect, useRef } from 'react';
import Panda from '../Panda';
import { PetStats } from '../type';

interface DinoJumpProps {
  onClose: () => void;
  onGameEnd: (score: number, xpEarned: number, coinsEarned: number) => void;
}

interface Obstacle {
  id: number;
  x: number;
  height: number;
}

const DinoJump: React.FC<DinoJumpProps> = ({ onClose, onGameEnd }) => {
  const [gameState, setGameState] = useState<'playing' | 'ended'>('playing');
  const [score, setScore] = useState(0);
  const [pandaY, setPandaY] = useState(366); // GROUND_Y - PANDA_EFFECTIVE_HEIGHT - GROUND_OFFSET
  const [pandaVelocityY, setPandaVelocityY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [gameSpeed, setGameSpeed] = useState(5);
  
  const gameRef = useRef<HTMLDivElement>(null);
  const obstacleIdRef = useRef(0);
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scoreIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const GAME_WIDTH = 400;
  const GAME_HEIGHT = 500;
  const GROUND_Y = 400; // Move ground lower
  const PANDA_SIZE = 60; // Base size before scaling
  const PANDA_SCALE = 0.5;
  const PANDA_EFFECTIVE_HEIGHT = PANDA_SIZE * PANDA_SCALE; // 30px
  const GROUND_OFFSET = 4; // small lift so panda sits on line visually
  const OBSTACLE_BOTTOM_OFFSET = 25;
  const PANDA_X = 50;
  const JUMP_FORCE = -12;
  const GRAVITY = 0.6;

  const pandaStats: PetStats = {
    hunger: 80,
    energy: 90,
    fun: 95,
    hygiene: 90,
    health: 100,
    xp: 0,
    level: 1
  };

  // Mouse tracking for panda eyes
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Jump handler
  const handleJump = () => {
    if (gameState !== 'playing' || isJumping) return;
    setIsJumping(true);
    setPandaVelocityY(JUMP_FORCE);
  };

  // Spawn obstacles
  useEffect(() => {
    if (gameState !== 'playing') return;

    spawnIntervalRef.current = setInterval(() => {
      const height = 55;
      setObstacles(prev => [...prev, {
        id: obstacleIdRef.current++,
        x: GAME_WIDTH,
        height
      }]);
    }, 2000); // Spawn every 2 seconds

    return () => {
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
    };
  }, [gameState]);

  // Score increment over time
  useEffect(() => {
    if (gameState !== 'playing') return;

    scoreIntervalRef.current = setInterval(() => {
      setScore(s => s + 1);
      
      // Increase speed over time
      setGameSpeed(speed => Math.min(speed + 0.1, 12));
    }, 500);

    return () => {
      if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current);
    };
  }, [gameState]);

  // Game loop - physics and collision
  useEffect(() => {
    if (gameState !== 'playing') return;

    gameLoopRef.current = setInterval(() => {
      // Update panda physics
      setPandaVelocityY(vy => {
        const newVy = vy + GRAVITY;
        return newVy;
      });

      setPandaY(y => {
        const newY = y + pandaVelocityY;
        if (newY >= GROUND_Y - PANDA_EFFECTIVE_HEIGHT - GROUND_OFFSET) {
          setIsJumping(false);
          return GROUND_Y - PANDA_EFFECTIVE_HEIGHT - GROUND_OFFSET;
        }
        return newY;
      });

      // Move obstacles
      setObstacles(prev => {
        const updated = prev.map(obs => ({
          ...obs,
          x: obs.x - gameSpeed
        })).filter(obs => obs.x > -50); // Remove off-screen obstacles

        // Check collisions
        const pandaLeft = PANDA_X;
        const pandaRight = PANDA_X + PANDA_EFFECTIVE_HEIGHT;
        const pandaTop = pandaY;
        const pandaBottom = pandaY + PANDA_EFFECTIVE_HEIGHT;

        for (const obs of updated) {
          const obsLeft = obs.x;
          const obsWidth = 52;
          const obsRight = obsLeft + obsWidth;
          const obsBottom = GROUND_Y - OBSTACLE_BOTTOM_OFFSET;
          const obsTop = obsBottom - obs.height;

          // AABB collision detection
          if (
            pandaRight > obsLeft &&
            pandaLeft < obsRight &&
            pandaBottom > obsTop &&
            pandaTop < obsBottom
          ) {
            setGameState('ended');
            return prev;
          }
        }

        return updated;
      });
    }, 20);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState, pandaY, pandaVelocityY, gameSpeed]);

  const handleGameEnd = () => {
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
    if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current);

    // Calculate rewards
    const xpEarned = Math.floor(score * 0.5);
    const coinsEarned = Math.floor(score * 0.3);

    onGameEnd(score, xpEarned, coinsEarned);
  };

  useEffect(() => {
    if (gameState === 'ended') {
      handleGameEnd();
    }
  }, [gameState]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleJump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isJumping, gameState]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-green-50 to-lime-50 rounded-[3rem] border-8 border-gray-800 w-full max-w-lg shadow-[0_20px_0_#2d2d2d] animate-in zoom-in-95 duration-300 overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b-4 border-gray-800 flex justify-between items-center bg-gradient-to-r from-green-200 to-lime-200">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-game text-gray-800">🦖 Dino Jump</h2>
            <div className="flex gap-3 text-sm font-black">
              <div className="bg-yellow-300 px-3 py-1 rounded-full border-2 border-gray-800">Score {score}</div>
              <div className="bg-green-300 px-3 py-1 rounded-full border-2 border-gray-800">Speed {gameSpeed.toFixed(1)}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-red-400 text-white px-6 py-3 rounded-2xl border-4 border-gray-800 font-black text-lg hover:bg-red-500 active:scale-95 shadow-[4px_4px_0_#2d2d2d] transition-all"
          >
            ✕
          </button>
        </div>

        {/* Game Area */}
        {gameState === 'playing' && (
          <div className="p-6">
            <div
              ref={gameRef}
              className="relative bg-gradient-to-b from-sky-200 to-green-100 border-4 border-gray-800 rounded-2xl overflow-hidden shadow-inner cursor-pointer"
              onClick={handleJump}
              style={{ width: GAME_WIDTH, height: GAME_HEIGHT, margin: '0 auto' }}
            >
              {/* Ground line */}
              <div 
                className="absolute left-0 right-0 h-1 bg-gray-800"
                style={{ top: GROUND_Y }}
              />

              {/* Panda character */}
              <div
                className="absolute transition-none"
                style={{
                  left: PANDA_X,
                  top: pandaY,
                  width: PANDA_SIZE,
                  height: PANDA_SIZE,
                  transform: `scale(${PANDA_SCALE})`
                }}
              >
                <Panda
                  stats={pandaStats}
                  isSleeping={false}
                  isEating={false}
                  isWashing={false}
                  mousePos={mousePos}
                  equippedCosmeticId={null}
                  onClick={() => {}}
                  onPet={() => {}}
                  onDropItem={() => {}}
                />
              </div>

              {/* Obstacles */}
              {obstacles.map(obs => (
                <div
                  key={obs.id}
                  className="absolute"
                  style={{
                    left: obs.x,
                    bottom: GAME_HEIGHT - GROUND_Y - OBSTACLE_BOTTOM_OFFSET,
                    width: 52,
                    height: obs.height,
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    🌵
                  </div>
                </div>
              ))}

              {/* Instruction Text */}
              {score < 5 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 px-4 py-2 rounded-full border-2 border-gray-800 text-xs font-black text-gray-800 animate-bounce">
                  Click or SPACE to jump!
                </div>
              )}
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'ended' && (
          <div className="p-6 flex flex-col items-center gap-6">
            <div className="text-center">
              <div className="text-6xl mb-4">💥</div>
              <div className="text-4xl font-black text-gray-800 mb-2">Game Over!</div>
              <div className="bg-white border-4 border-gray-800 rounded-2xl p-6 shadow-[4px_4px_0_#2d2d2d]">
                <div className="text-sm font-black uppercase text-gray-600 mb-1">Final Score</div>
                <div className="text-5xl font-black text-green-600">{score}</div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-green-400 text-white px-8 py-4 rounded-2xl border-4 border-gray-800 font-black text-xl hover:bg-green-500 active:scale-95 shadow-[4px_4px_0_#2d2d2d] transition-all"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DinoJump;
