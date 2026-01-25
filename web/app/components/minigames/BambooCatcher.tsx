import React, { useState, useEffect, useRef } from 'react';
import Panda from '../Panda';
import { PetStats } from '../type';

interface Bamboo {
  id: number;
  x: number;
  y: number;
  speed: number;
}

interface BambooCatcherProps {
  onClose: () => void;
  onGameEnd: (score: number, xpEarned: number, coinsEarned: number) => void;
}

const BambooCatcher: React.FC<BambooCatcherProps> = ({ onClose, onGameEnd }) => {
  const [gameState, setGameState] = useState<'playing' | 'ended'>('playing');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [bamboos, setBamboos] = useState<Bamboo[]>([]);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; type: string }[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const gameRef = useRef<HTMLDivElement>(null);
  const bambooIdRef = useRef(0);
  const particleIdRef = useRef(0);
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const GAME_WIDTH = 400;
  const GAME_HEIGHT = 500;
  const BAMBOO_HEIGHT = 60;
  const BASE_SPEED = 2;
  const SPAWN_RATE = 1000 - level * 100;

  const pandaStats: PetStats = {
    hunger: 80,
    energy: 90,
    fun: 95,
    hygiene: 90,
    health: 100,
    xp: 0,
    level: 1
  };

  // Initialize game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Game update loop
    gameLoopRef.current = setInterval(() => {
      setBamboos(prev => {
        const updated = prev
          .map(b => ({ ...b, y: b.y + b.speed }))
          .filter(b => {
            if (b.y > GAME_HEIGHT) {
              // Missed bamboo
              setLives(l => {
                const newLives = l - 1;
                if (newLives <= 0) {
                  setGameState('ended');
                }
                return newLives;
              });
              return false;
            }
            return true;
          });
        return updated;
      });

      // Decay particles
      setParticles(prev =>
        prev
          .map(p => ({ ...p, y: p.y - 2 }))
          .filter(p => p.y > -20)
      );
    }, 30);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState]);

  // Spawn bamboo
  useEffect(() => {
    if (gameState !== 'playing') return;

    spawnIntervalRef.current = setInterval(() => {
      const randomX = Math.random() * (GAME_WIDTH - 40);
      const speed = BASE_SPEED + level * 0.3;
      setBamboos(prev => [
        ...prev,
        {
          id: bambooIdRef.current++,
          x: randomX,
          y: -BAMBOO_HEIGHT,
          speed
        }
      ]);
    }, Math.max(400, SPAWN_RATE));

    return () => {
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
    };
  }, [gameState, level]);

  const handleBambooClick = (id: number, x: number, y: number) => {
    setBamboos(prev => prev.filter(b => b.id !== id));
    setScore(s => s + 1);

    // Add sparkle particles
    const newParticles = [
      { id: particleIdRef.current++, x, y, type: '✨' },
      { id: particleIdRef.current++, x: x + 20, y: y - 10, type: '🎋' },
      { id: particleIdRef.current++, x: x - 20, y: y - 10, type: '✨' }
    ];
    setParticles(prev => [...prev, ...newParticles]);

    // Level up every 5 catches
    if ((score + 1) % 5 === 0) {
      setLevel(l => l + 1);
    }
  };

  const handleGameEnd = () => {
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);

    // Calculate rewards
    const xpEarned = score * 5;
    const coinsEarned = Math.floor(score * 2 + level * 10);

    // Call parent with results
    onGameEnd(score, xpEarned, coinsEarned);
  };

  useEffect(() => {
    if (gameState === 'ended') {
      handleGameEnd();
    }
  }, [gameState]);

  // Mouse tracking for panda eyes
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-100 animate-in fade-in duration-300">
      <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-[3rem] border-8 border-gray-800 w-full max-w-lg shadow-[0_20px_0_#2d2d2d] animate-in zoom-in-95 duration-300 overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b-4 border-gray-800 flex justify-between items-center bg-linear-to-r from-amber-200 to-orange-200">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-game text-gray-800">🎋 Bamboo Catcher</h2>
            <div className="flex gap-4 text-sm font-black">
              <div className="bg-blue-300 px-3 py-1 rounded-full border-2 border-gray-800">Level {level}</div>
              <div className="bg-red-300 px-3 py-1 rounded-full border-2 border-gray-800">❤️ {lives}</div>
            </div>
          </div>
          {gameState === 'ended' && (
            <button
              onClick={onClose}
              className="text-2xl font-bold bg-red-100 text-red-600 rounded-full w-12 h-12 flex items-center justify-center border-4 border-gray-800 hover:scale-110 active:scale-95 transition-transform"
            >
              ×
            </button>
          )}
        </div>

        {/* Game Area or Results */}
        {gameState === 'playing' ? (
          <div className="p-6">
            {/* Score Display */}
            <div className="text-center mb-4 bg-white rounded-2xl border-4 border-gray-800 p-4">
              <div className="text-5xl font-black text-yellow-600">{score}</div>
              <div className="text-xs font-black uppercase text-gray-600 mt-1">Bamboos Caught</div>
            </div>

            {/* Game Canvas */}
            <div
              ref={gameRef}
              className="relative bg-linear-to-b from-sky-200 to-sky-100 border-4 border-gray-800 rounded-2xl overflow-hidden shadow-inner"
              style={{ width: GAME_WIDTH, height: GAME_HEIGHT, margin: '0 auto' }}
            >
              {/* Bamboo stalks */}
              {bamboos.map(bamboo => (
                <div
                  key={bamboo.id}
                  onClick={() => handleBambooClick(bamboo.id, bamboo.x + 20, bamboo.y + 30)}
                  className="absolute cursor-pointer hover:scale-110 transition-transform active:scale-95 select-none"
                  style={{
                    left: bamboo.x,
                    top: bamboo.y,
                    width: 40,
                    height: BAMBOO_HEIGHT
                  }}
                >
                  <div className="text-4xl drop-shadow-lg">🎋</div>
                </div>
              ))}

              {/* Particles */}
              {particles.map(p => (
                <div
                  key={p.id}
                  className="absolute text-2xl pointer-events-none animate-pulse"
                  style={{
                    left: p.x,
                    top: p.y,
                    opacity: 0.8
                  }}
                >
                  {p.type}
                </div>
              ))}

              {/* Instruction Text */}
              {bamboos.length === 0 && score === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center bg-white/80 px-6 py-4 rounded-2xl border-4 border-gray-800">
                    <div className="text-3xl mb-2">🎋</div>
                    <div className="text-sm font-black text-gray-700 uppercase">Click bamboo as it falls!</div>
                  </div>
                </div>
              )}

              {/* Panda at bottom */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 scale-75 pointer-events-none">
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
            </div>

            {/* Difficulty Info */}
            <div className="mt-4 text-center text-xs font-bold text-gray-600 bg-white/50 px-4 py-2 rounded-full border-2 border-gray-400">
              Speed: {(BASE_SPEED + level * 0.3).toFixed(1)} | Spawn: {Math.max(400, SPAWN_RATE)}ms
            </div>
          </div>
        ) : (
          /* Results Screen */
          <div className="p-8 text-center">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h3 className="text-3xl font-game mb-6 text-gray-800">Game Over!</h3>

            <div className="space-y-4 mb-8">
              <div className="bg-blue-100 border-4 border-gray-800 rounded-2xl p-4">
                <div className="text-sm font-black uppercase text-gray-600 mb-1">Final Score</div>
                <div className="text-5xl font-black text-blue-600">{score}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-yellow-100 border-4 border-gray-800 rounded-2xl p-4">
                  <div className="text-xs font-black uppercase text-gray-600 mb-1">XP Earned</div>
                  <div className="text-3xl font-black text-yellow-600">+{score * 5}</div>
                </div>
                <div className="bg-green-100 border-4 border-gray-800 rounded-2xl p-4">
                  <div className="text-xs font-black uppercase text-gray-600 mb-1">Coins Earned</div>
                  <div className="text-3xl font-black text-green-600">+{Math.floor(score * 2 + level * 10)}</div>
                </div>
              </div>

              <div className="bg-purple-100 border-4 border-gray-800 rounded-2xl p-4">
                <div className="text-xs font-black uppercase text-gray-600 mb-1">Max Level Reached</div>
                <div className="text-3xl font-black text-purple-600">{level}</div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-game text-xl py-4 rounded-2xl border-4 border-gray-800 shadow-[4px_4px_0_#2d2d2d] transition-all"
            >
              Back to Panda
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BambooCatcher;
