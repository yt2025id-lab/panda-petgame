"use client";
import React, { useEffect, useRef, useState } from "react";

interface LevelUpCelebrationProps {
  level: number;
  onComplete: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
  emoji?: string;
}

const COLORS = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#F7DC6F", "#BB8FCE", "#FF69B4", "#00FF7F"];
const EMOJIS = ["⭐", "✨", "🎉", "🎊", "💫", "🌟", "🐼", "🎋"];

const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({ level, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];

    // Create initial burst of particles
    for (let i = 0; i < 80; i++) {
      const angle = (Math.PI * 2 * i) / 80;
      const speed = 3 + Math.random() * 8;
      const useEmoji = Math.random() > 0.6;
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 3,
        vy: Math.sin(angle) * speed - Math.random() * 3,
        size: useEmoji ? 20 + Math.random() * 15 : 4 + Math.random() * 8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        life: 0,
        maxLife: 60 + Math.random() * 40,
        emoji: useEmoji ? EMOJIS[Math.floor(Math.random() * EMOJIS.length)] : undefined,
      });
    }

    let frame = 0;
    const maxFrames = 120; // 2 seconds at 60fps

    const animate = () => {
      if (frame >= maxFrames) {
        setVisible(false);
        setTimeout(onComplete, 300);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravity
        p.vx *= 0.99; // drag
        p.rotation += p.rotationSpeed;
        p.life++;

        const alpha = Math.max(0, 1 - p.life / p.maxLife);
        if (alpha <= 0) return;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = alpha;

        if (p.emoji) {
          ctx.font = `${p.size}px serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(p.emoji, 0, 0);
        } else {
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        }

        ctx.restore();
      });

      frame++;
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="relative z-10 animate-in zoom-in-50 duration-500">
        <div className="bg-white/95 backdrop-blur-sm rounded-[3rem] border-8 border-yellow-400 shadow-[0_0_60px_rgba(255,215,0,0.5)] px-12 py-8 text-center">
          <div className="text-6xl mb-2">🎉</div>
          <h1 className="text-4xl font-black text-gray-800 mb-1">LEVEL UP!</h1>
          <div className="text-6xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            {level}
          </div>
          <p className="text-gray-500 font-bold text-sm mt-2">Your panda is growing stronger!</p>
        </div>
      </div>
    </div>
  );
};

export default LevelUpCelebration;
