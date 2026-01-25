import React, { useState, useEffect, useRef } from 'react';
import Panda from '../Panda';
import { PetStats } from '../type';

interface BallShooterProps {
  onClose: () => void;
  onGameEnd: (score: number, xpEarned: number, coinsEarned: number) => void;
}

const BallShooter: React.FC<BallShooterProps> = ({ onClose, onGameEnd }) => {
  const [gameState, setGameState] = useState<'playing' | 'ended'>('playing');
  const [score, setScore] = useState(0);
  const [shotsRemaining, setShotsRemaining] = useState(5);
  const [ballX, setBallX] = useState(200);
  const [ballY, setBallY] = useState(420);
  const [ballInFlight, setBallInFlight] = useState(false);
  const [flightBall, setFlightBall] = useState({ x: 200, y: 420, vx: 0, vy: 0 });
  const [arrowAngle, setArrowAngle] = useState(45);
  const [goalX, setGoalX] = useState(175);
  const [goalDirection, setGoalDirection] = useState(1); // 1 for right, -1 for left
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; type: string }[]>([]);
  const [frozenTrajectoryAngle, setFrozenTrajectoryAngle] = useState<number | null>(null);
  
  const gameRef = useRef<HTMLDivElement>(null);
  const particleIdRef = useRef(0);
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const goalMoveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const GAME_WIDTH = 400;
  const GAME_HEIGHT = 500;
  const GOAL_WIDTH = 80;
  const GOAL_HEIGHT = 30;
  const BALL_RADIUS = 12;
  const MAX_SHOTS = 5;

  const pandaStats: PetStats = {
    hunger: 80,
    energy: 90,
    fun: 95,
    hygiene: 90,
    health: 100,
    xp: 0,
    level: 1
  };

  // Arrow animation - oscillates between -60 and 60 degrees (only when ball not in flight)
  useEffect(() => {
    if (ballInFlight) return; // Stop updating arrow when shooting
    
    let angle = -60;
    let direction = 1;
    const angleInterval = setInterval(() => {
      angle += direction * 3;
      if (angle >= 60) {
        angle = 60;
        direction = -1;
      } else if (angle <= -60) {
        angle = -60;
        direction = 1;
      }
      setArrowAngle(angle);
    }, 30);
    return () => clearInterval(angleInterval);
  }, [ballInFlight]);

  // Goalpost movement - side to side
  useEffect(() => {
    goalMoveRef.current = setInterval(() => {
      setGoalX(prev => {
        let newX = prev + goalDirection * 2;
        if (newX <= 0) {
          setGoalDirection(1);
          newX = 0;
        } else if (newX + GOAL_WIDTH >= GAME_WIDTH) {
          setGoalDirection(-1);
          newX = GAME_WIDTH - GOAL_WIDTH;
        }
        return newX;
      });
    }, 20);
    return () => {
      if (goalMoveRef.current) clearInterval(goalMoveRef.current);
    };
  }, [goalDirection]);

  // Mouse tracking for panda eyes
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Ball physics loop
  useEffect(() => {
    if (!ballInFlight || gameState !== 'playing') return;

    gameLoopRef.current = setInterval(() => {
      setFlightBall(prev => {
        let { x, y, vx, vy } = prev;
        
        // Minimal gravity for realistic feel but mostly straight trajectory
        vy += 0.01;
        
        // Update position
        x += vx;
        y += vy;

        // Check if ball is out of bounds
        if (y > GAME_HEIGHT || x < 0 || x > GAME_WIDTH) {
          setBallInFlight(false);
          setBallX(200);
          setBallY(420);
          setFrozenTrajectoryAngle(null);
          setShotsRemaining(s => {
            const newShots = s - 1;
            if (newShots <= 0) {
              setGameState('ended');
            }
            return newShots;
          });
          return { x: 200, y: 420, vx: 0, vy: 0 };
        }

        // Check collision with goalpost
        if (
          x + BALL_RADIUS > goalX &&
          x - BALL_RADIUS < goalX + GOAL_WIDTH &&
          y - BALL_RADIUS < GOAL_HEIGHT
        ) {
          // Goal scored!
          setScore(s => s + 1);

          // Add particles
          const newParticles = [
            { id: particleIdRef.current++, x: goalX + GOAL_WIDTH / 2, y: 20, type: '⭐' },
            { id: particleIdRef.current++, x: goalX + 20, y: 10, type: '✨' },
            { id: particleIdRef.current++, x: goalX + GOAL_WIDTH - 20, y: 10, type: '✨' }
          ];
          setParticles(prev => [...prev, ...newParticles]);

          setBallInFlight(false);
          setBallX(200);
          setBallY(420);
          setFrozenTrajectoryAngle(null);
          setShotsRemaining(s => {
            const newShots = s - 1;
            if (newShots <= 0) {
              setGameState('ended');
            }
            return newShots;
          });
          return { x: 200, y: 420, vx: 0, vy: 0 };
        }

        return { x, y, vx, vy };
      });

      // Decay particles
      setParticles(prev =>
        prev
          .map(p => ({ ...p, y: p.y - 2 }))
          .filter(p => p.y > -20)
      );
    }, 20);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [ballInFlight, gameState]);

  const handleShoot = () => {
    if (ballInFlight || gameState !== 'playing' || shotsRemaining <= 0) return;

    // Freeze trajectory angle at shoot time
    setFrozenTrajectoryAngle(arrowAngle);

    // Convert angle to radians - match trajectory calculation
    const radians = (arrowAngle * Math.PI) / 180;
    const power = 8;
    
    // Use sin for x and -cos for y to match trajectory line
    const vx = Math.sin(radians) * power;
    const vy = -Math.cos(radians) * power;

    setBallInFlight(true);
    setFlightBall({
      x: ballX,
      y: ballY,
      vx,
      vy
    });
  };

  const handleGameEnd = () => {
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    if (goalMoveRef.current) clearInterval(goalMoveRef.current);

    // Calculate rewards
    const xpEarned = score * 10;
    const coinsEarned = Math.floor(score * 5 + score * 20);

    onGameEnd(score, xpEarned, coinsEarned);
  };

  useEffect(() => {
    if (gameState === 'ended') {
      handleGameEnd();
    }
  }, [gameState]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-100 animate-in fade-in duration-300">
      <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-[3rem] border-8 border-gray-800 w-full max-w-lg shadow-[0_20px_0_#2d2d2d] animate-in zoom-in-95 duration-300 overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b-4 border-gray-800 flex justify-between items-center bg-linear-to-r from-blue-200 to-cyan-200">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-game text-gray-800">⚽ Ball Shooter</h2>
            <div className="flex gap-4 text-sm font-black">
              <div className="bg-yellow-300 px-3 py-1 rounded-full border-2 border-gray-800">Score {score}</div>
              <div className="bg-red-300 px-3 py-1 rounded-full border-2 border-gray-800">Shots {shotsRemaining}</div>
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
            {/* Game Canvas */}
            <div
              ref={gameRef}
              className="relative bg-linear-to-b from-sky-200 to-sky-100 border-4 border-gray-800 rounded-2xl overflow-hidden shadow-inner cursor-pointer"
              onClick={handleShoot}
              style={{ width: GAME_WIDTH, height: GAME_HEIGHT, margin: '0 auto' }}
            >
              {/* Goalpost at top */}
              <div
                className="absolute top-2 bg-yellow-400 border-4 border-gray-800 rounded-lg flex items-center justify-center transition-all"
                style={{
                  left: goalX,
                  width: GOAL_WIDTH,
                  height: GOAL_HEIGHT,
                  boxShadow: '0 4px 0 #2d2d2d'
                }}
              >
                <div className="text-lg font-black">🥅</div>
              </div>

              {/* Trajectory path line */}
              <svg
                className="absolute inset-0 pointer-events-none"
                width={GAME_WIDTH}
                height={GAME_HEIGHT}
                style={{ overflow: 'visible' }}
              >
                <line
                  x1={ballX}
                  y1={ballY}
                  x2={ballX + Math.sin(((frozenTrajectoryAngle ?? arrowAngle) * Math.PI) / 180) * 150}
                  y2={ballY - Math.cos(((frozenTrajectoryAngle ?? arrowAngle) * Math.PI) / 180) * 150}
                  stroke="rgba(100, 150, 255, 0.5)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  strokeLinecap="round"
                />
                {/* Dots along path */}
                {[...Array(6)].map((_, i) => {
                  const t = (i + 1) / 6;
                  const angle = frozenTrajectoryAngle ?? arrowAngle;
                  const x = ballX + Math.sin((angle * Math.PI) / 180) * 150 * t;
                  const y = ballY - Math.cos((angle * Math.PI) / 180) * 150 * t;
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="3"
                      fill="rgba(100, 150, 255, 0.6)"
                    />
                  );
                })}
              </svg>

              {/* Arrow indicator removed - using trajectory path instead */}

              {/* Ball - stationary or in flight */}
              {!ballInFlight ? (
                <div
                  className="absolute rounded-full bg-white border-4 border-gray-800 flex items-center justify-center font-black text-lg"
                  style={{
                    left: ballX - BALL_RADIUS,
                    top: ballY - BALL_RADIUS,
                    width: BALL_RADIUS * 2,
                    height: BALL_RADIUS * 2,
                    boxShadow: '0 2px 0 #2d2d2d'
                  }}
                >
                  ⚽
                </div>
              ) : (
                <div
                  className="absolute rounded-full bg-white border-4 border-gray-800 flex items-center justify-center font-black text-lg"
                  style={{
                    left: flightBall.x - BALL_RADIUS,
                    top: flightBall.y - BALL_RADIUS,
                    width: BALL_RADIUS * 2,
                    height: BALL_RADIUS * 2,
                    boxShadow: '0 2px 0 #2d2d2d'
                  }}
                >
                  ⚽
                </div>
              )}

              {/* Particles */}
              {particles.map(p => (
                <div
                  key={p.id}
                  className="absolute text-xl pointer-events-none animate-pulse"
                  style={{
                    left: p.x,
                    top: p.y,
                    opacity: 0.8
                  }}
                >
                  {p.type}
                </div>
              ))}

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

              {/* Instruction Text */}
              {shotsRemaining > 0 && !ballInFlight && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <div className="text-xs font-black bg-white/80 px-4 py-2 rounded-full border-2 border-gray-800 uppercase">
                    Click to shoot!
                  </div>
                </div>
              )}
            </div>

            {/* Controls Info */}
            <div className="mt-4 text-center text-xs font-bold text-gray-600 bg-white/50 px-4 py-2 rounded-full border-2 border-gray-400">
              Arrow rotates automatically • Click to shoot • Hit goalpost to score
            </div>
          </div>
        ) : (
          /* Results Screen */
          <div className="p-8 text-center">
            <div className="text-6xl mb-4 animate-bounce">⚽</div>
            <h3 className="text-3xl font-game mb-6 text-gray-800">Game Over!</h3>

            <div className="space-y-4 mb-8">
              <div className="bg-blue-100 border-4 border-gray-800 rounded-2xl p-4">
                <div className="text-sm font-black uppercase text-gray-600 mb-1">Final Score</div>
                <div className="text-5xl font-black text-blue-600">{score}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-yellow-100 border-4 border-gray-800 rounded-2xl p-4">
                  <div className="text-xs font-black uppercase text-gray-600 mb-1">XP Earned</div>
                  <div className="text-3xl font-black text-yellow-600">+{score * 10}</div>
                </div>
                <div className="bg-green-100 border-4 border-gray-800 rounded-2xl p-4">
                  <div className="text-xs font-black uppercase text-gray-600 mb-1">Coins Earned</div>
                  <div className="text-3xl font-black text-green-600">+{Math.floor(score * 5 + score * 20)}</div>
                </div>
              </div>

              <div className="bg-purple-100 border-4 border-gray-800 rounded-2xl p-4">
                <div className="text-xs font-black uppercase text-gray-600 mb-1">Accuracy</div>
                <div className="text-3xl font-black text-purple-600">{Math.round((score / MAX_SHOTS) * 100)}%</div>
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

export default BallShooter;
