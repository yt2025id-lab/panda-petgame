"use client";
import React, { useEffect, useState } from "react";

interface GameBackgroundProps {
  isSleeping: boolean;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

const GameBackground: React.FC<GameBackgroundProps> = ({ isSleeping }) => {
  const [stars, setStars] = useState<Star[]>([]);
  const [shootingStar, setShootingStar] = useState<{ id: number; x: number } | null>(null);

  // Generate stars for night mode
  useEffect(() => {
    const generated: Star[] = [];
    for (let i = 0; i < 40; i++) {
      generated.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 70,
        size: 1 + Math.random() * 2,
        delay: Math.random() * 3,
        duration: 1.5 + Math.random() * 2,
      });
    }
    setStars(generated);
  }, []);

  // Shooting star every 10-20s at night
  useEffect(() => {
    if (!isSleeping) return;
    const schedule = () => {
      const delay = 10000 + Math.random() * 10000;
      return setTimeout(() => {
        setShootingStar({ id: Date.now(), x: 10 + Math.random() * 60 });
        setTimeout(() => setShootingStar(null), 1500);
        timer = schedule();
      }, delay);
    };
    let timer = schedule();
    return () => clearTimeout(timer);
  }, [isSleeping]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {!isSleeping ? (
        <>
          {/* Day: Clouds */}
          <div className="cloud-layer-1 absolute w-full h-full">
            <div className="absolute text-5xl opacity-30 cloud-drift-slow" style={{ top: "8%", left: "-10%" }}>☁️</div>
            <div className="absolute text-4xl opacity-25 cloud-drift-slow" style={{ top: "15%", left: "30%", animationDelay: "-8s" }}>☁️</div>
            <div className="absolute text-6xl opacity-20 cloud-drift-slow" style={{ top: "5%", left: "60%", animationDelay: "-16s" }}>☁️</div>
          </div>
          <div className="cloud-layer-2 absolute w-full h-full">
            <div className="absolute text-3xl opacity-20 cloud-drift-medium" style={{ top: "20%", left: "-5%" }}>☁️</div>
            <div className="absolute text-5xl opacity-15 cloud-drift-medium" style={{ top: "12%", left: "45%", animationDelay: "-6s" }}>☁️</div>
            <div className="absolute text-4xl opacity-20 cloud-drift-medium" style={{ top: "25%", left: "75%", animationDelay: "-12s" }}>☁️</div>
          </div>
          <div className="cloud-layer-3 absolute w-full h-full">
            <div className="absolute text-7xl opacity-10 cloud-drift-fast" style={{ top: "3%", left: "20%" }}>☁️</div>
            <div className="absolute text-6xl opacity-10 cloud-drift-fast" style={{ top: "10%", left: "55%", animationDelay: "-4s" }}>☁️</div>
          </div>
          {/* Occasional butterfly */}
          <div className="absolute text-xl butterfly-float" style={{ top: "40%", left: "15%" }}>🦋</div>
        </>
      ) : (
        <>
          {/* Night: Stars */}
          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute rounded-full bg-white star-twinkle"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: star.size,
                height: star.size,
                animationDelay: `${star.delay}s`,
                animationDuration: `${star.duration}s`,
              }}
            />
          ))}
          {/* Moon */}
          <div className="absolute top-[5%] right-[10%] text-5xl opacity-80">🌙</div>
          {/* Shooting star */}
          {shootingStar && (
            <div
              key={shootingStar.id}
              className="absolute shooting-star"
              style={{ top: "10%", left: `${shootingStar.x}%` }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default GameBackground;
