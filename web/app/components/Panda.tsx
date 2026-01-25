
import React, { useMemo, useState, useEffect } from 'react';
import { PetStats } from './type';

export interface CosmeticItem {
  objectId: string;
  fields: {
    name: string;
    category: string;
    rarity: string;
  };
}

interface PandaProps {
  stats: PetStats;
  isSleeping: boolean;
  isEating: boolean;
  isWashing: boolean;
  isBouncing: boolean;
  activeToyAnimation: string | null;
  mousePos: { x: number; y: number };
  equippedCosmeticId: string | null;
  equippedCosmetic?: CosmeticItem | null;
  onClick: () => void;
  onPet: () => void;
  onDropItem: () => void;
}

const Panda: React.FC<PandaProps> = ({
  stats,
  isSleeping,
  isEating,
  isWashing,
  isBouncing,
  activeToyAnimation,
  mousePos,
  equippedCosmeticId,
  equippedCosmetic,
  onClick,
  onPet,
  onDropItem
}) => {
  const [isOver, setIsOver] = useState(false);
  const [isWiggling, setIsWiggling] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number; type: string }[]>([]);
  const pandaRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEating) {
      setIsWiggling(true);
      const interval = setInterval(() => {
        const newSparkle = {
          id: Date.now() + Math.random(),
          x: 40 + Math.random() * 160,
          y: 100 + Math.random() * 100,
          type: Math.random() > 0.5 ? '✨' : '🎋'
        };
        setHearts(prev => [...prev, newSparkle]);
        setTimeout(() => {
          setHearts(prev => prev.filter(h => h.id !== newSparkle.id));
        }, 800);
      }, 200);
      return () => clearInterval(interval);
    } else {
      setIsWiggling(false);
      return;
    }
  }, [isEating]);

  const getExpression = () => {
    if (isSleeping) return '😴';
    if (isEating) return '😋';
    if (isWashing) return '🧼';
    if (isBouncing) return '🤩';
    if (stats.hunger < 20) return '😫';
    if (stats.fun < 20) return '😢';
    if (stats.energy < 20) return '🥱';
    return '😊';
  };

  const expression = getExpression();

  const handlePandaClick = (e: React.MouseEvent) => {
    if (isSleeping) return;

    // Trigger animations
    setIsWiggling(true);
    setIsJumping(true);

    // Add heart particle at click position
    const newHeart = {
      id: Date.now(),
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
      type: '❤️'
    };
    setHearts(prev => [...prev, newHeart]);

    setTimeout(() => setIsWiggling(false), 500);
    setTimeout(() => setIsJumping(false), 600);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1000);

    onClick();
  };

  // Eye tracking logic
  const pupilOffset = useMemo(() => {
    // eslint-disable-next-line react-hooks/refs
    if (!pandaRef.current || isSleeping) return { x: 0, y: 0 };
    // eslint-disable-next-line react-hooks/refs
    const rect = pandaRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = mousePos.x - centerX;
    const dy = mousePos.y - centerY;
    const angle = Math.atan2(dy, dx);
    const distance = Math.min(8, Math.sqrt(dx * dx + dy * dy) / 15);

    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    };
  }, [mousePos, isSleeping]);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons === 1) {
      onPet();
    }
  };

  return (
    <div
      ref={pandaRef}
      className={`relative cursor-grab active:cursor-grabbing transform-gpu
        ${activeToyAnimation === 'bounce' ? 'panda-jump' :
          activeToyAnimation === 'spin' ? 'panda-spin' :
            activeToyAnimation === 'wiggle' ? 'panda-wiggle' :
              activeToyAnimation === 'shake' ? 'panda-shake' :
                isEating ? 'panda-jiggle' :
                  (isBouncing || isJumping) ? 'panda-jump' : 'float-animation'} 
        ${isOver ? 'scale-110 rotate-2' : 'scale-100'}
        smooth-transition`}
      onPointerMove={handlePointerMove}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        onDropItem();
      }}
      onClick={handlePandaClick}
    >
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="heart-particle text-3xl z-50"
          style={{ left: heart.x, top: heart.y }}
        >
          {heart.type}
        </div>
      ))}
      <svg
        width="240"
        height="260"
        viewBox="0 0 240 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="breathe-animation"
      >
        {/* Ears */}
        <circle cx="60" cy="70" r="35" fill="#2D2D2D" className={`ear-left ${isWiggling ? 'ear-wiggle-left' : ''} smooth-transition`} />
        <circle cx="180" cy="70" r="35" fill="#2D2D2D" className={`ear-right ${isWiggling ? 'ear-wiggle-right' : ''} smooth-transition`} />

        {/* Body */}
        <path
          d="M20,160 C20,100 80,60 120,60 C160,60 220,100 220,160 C220,230 180,260 120,260 C60,260 20,230 20,160 Z"
          fill="white"
          stroke={isOver ? "#4CAF50" : "#2D2D2D"}
          strokeWidth={isOver ? "10" : "6"}
          className="smooth-transition"
        />

        {/* Eye Patches */}
        <ellipse cx="85" cy="140" rx="30" ry="35" fill="#2D2D2D" className="smooth-transition" />
        <ellipse cx="155" cy="140" rx="30" ry="35" fill="#2D2D2D" className="smooth-transition" />

        {/* Eyes */}
        {!isSleeping ? (
          <g style={{ transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`, transition: 'transform 0.1s ease-out' }}>
            <circle cx="85" cy="135" r="12" fill="white" className="blink" />
            <circle cx="155" cy="135" r="12" fill="white" className="blink" />
            <circle cx="85" cy="135" r="5" fill="#2D2D2D" className="blink" />
            <circle cx="155" cy="135" r="5" fill="#2D2D2D" className="blink" />
          </g>
        ) : (
          <>
            <path d="M75,140 Q85,150 95,140" stroke="white" strokeWidth="3" fill="none" />
            <path d="M145,140 Q155,150 165,140" stroke="white" strokeWidth="3" fill="none" />
          </>
        )}

        {/* Cosmetics: Eyes (Glasses) */}
        {(equippedCosmeticId === 'sunglasses' || (equippedCosmetic?.fields.category === 'glasses' && equippedCosmetic?.fields.name.includes('Sunglasses'))) && !isSleeping && (
          <g style={{ transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`, transition: 'transform 0.1s ease-out' }}>
            <rect x="55" y="125" width="60" height="30" rx="5" fill="#2D2D2D" fillOpacity="0.8" />
            <rect x="125" y="125" width="60" height="30" rx="5" fill="#2D2D2D" fillOpacity="0.8" />
            <line x1="115" y1="140" x2="125" y2="140" stroke="#2D2D2D" strokeWidth="4" />
          </g>
        )}

        {/* Monocle */}
        {equippedCosmetic?.fields.category === 'glasses' && equippedCosmetic?.fields.name.includes('Monocle') && !isSleeping && (
          <g style={{ transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`, transition: 'transform 0.1s ease-out' }}>
            <circle cx="155" cy="135" r="25" stroke="#FFD700" strokeWidth="4" fill="#FFD700" fillOpacity="0.2" />
            <line x1="180" y1="135" x2="200" y2="160" stroke="#FFD700" strokeWidth="2" />
          </g>
        )}

        {/* Nose */}
        <ellipse cx="120" cy="170" rx="10" ry="7" fill="#2D2D2D" className="smooth-transition" />

        {/* Mouth */}
        <g className={`smooth-transition ${isEating ? 'chew-animation' : ''}`}>
          {expression === '😊' && <path d="M100,185 Q120,205 140,185" stroke="#2D2D2D" strokeWidth="4" fill="none" strokeLinecap="round" />}
          {expression === '😋' && <path d="M100,185 Q120,215 140,185" stroke="#2D2D2D" strokeWidth="4" fill="#FF8A80" strokeLinecap="round" />}
          {expression === '🤩' && <path d="M100,185 Q120,225 140,185" stroke="#FF4081" strokeWidth="4" fill="#FF80AB" strokeLinecap="round" />}
          {(expression === '😫' || expression === '😢') && <path d="M100,195 Q120,175 140,195" stroke="#2D2D2D" strokeWidth="4" fill="none" strokeLinecap="round" />}
          {expression === '🥱' && <circle cx="120" cy="195" r="8" fill="#2D2D2D" />}
          {expression === '😴' && <path d="M105,190 H135" stroke="#2D2D2D" strokeWidth="4" fill="none" strokeLinecap="round" />}
        </g>

        {/* Graphics: Body Extras (Shirts) */}
        {equippedCosmetic?.fields.category === 'shirt' && equippedCosmetic?.fields.name.includes('T-Shirt') && (
          <path d="M40,160 Q120,130 200,160 L210,240 Q120,265 30,240 Z" fill="#2196F3" stroke="#2D2D2D" strokeWidth="4" />
        )}
        {equippedCosmetic?.fields.category === 'shirt' && equippedCosmetic?.fields.name.includes('Tuxedo') && (
          <g>
            <path d="M40,160 Q120,130 200,160 L210,240 Q120,265 30,240 Z" fill="#2D2D2D" stroke="#000" strokeWidth="4" />
            <path d="M120,160 L80,240 L160,240 Z" fill="white" />
            <circle cx="120" cy="190" r="3" fill="#000" />
            <circle cx="120" cy="210" r="3" fill="#000" />
            <circle cx="120" cy="230" r="3" fill="#000" />
          </g>
        )}

        {/* Cosmetics: Neck (Bowtie/Jewelry) */}
        {(equippedCosmeticId === 'bowtie' || (equippedCosmetic?.fields.category === 'accessory' && equippedCosmetic?.fields.name.includes('Bow Tie'))) && (
          <g transform="translate(90, 220)">
            <path d="M0,0 L30,15 L0,30 Z" fill="#E91E63" stroke="#2D2D2D" strokeWidth="2" />
            <path d="M60,0 L30,15 L60,30 Z" fill="#E91E63" stroke="#2D2D2D" strokeWidth="2" />
            <circle cx="30" cy="15" r="8" fill="#C2185B" stroke="#2D2D2D" strokeWidth="2" />
          </g>
        )}
        {equippedCosmetic?.fields.category === 'accessory' && equippedCosmetic?.fields.name.includes('Necklace') && (
          <path d="M60,200 Q120,240 180,200" fill="none" stroke="#FFD700" strokeWidth="6" strokeLinecap="round" />
        )}

        {/* Blush */}
        {!isSleeping && (
          <>
            <circle cx="60" cy="165" r="10" fill="#FFCDD2" fillOpacity="0.6" />
            <circle cx="180" cy="165" r="10" fill="#FFCDD2" fillOpacity="0.6" />
          </>
        )}

        {/* Cosmetics: Hats */}
        {equippedCosmeticId === 'top_hat' && (
          <g transform="translate(70, 10)">
            <rect x="0" y="40" width="100" height="10" rx="5" fill="#2D2D2D" stroke="#000" strokeWidth="2" />
            <rect x="15" y="0" width="70" height="40" fill="#2D2D2D" stroke="#000" strokeWidth="2" />
            <rect x="15" y="30" width="70" height="5" fill="#D32F2F" />
          </g>
        )}
        {(equippedCosmeticId === 'party_hat' || (equippedCosmetic?.fields.category === 'hat' && equippedCosmetic?.fields.name.includes('Party Hat'))) && (
          <g transform="translate(85, 0)">
            <path d="M0,70 L35,0 L70,70 Z" fill="#FFEB3B" stroke="#2D2D2D" strokeWidth="3" />
            <circle cx="35" cy="0" r="8" fill="#F44336" />
          </g>
        )}
        {(equippedCosmeticId === 'crown' || (equippedCosmetic?.fields.category === 'hat' && equippedCosmetic?.fields.name.includes('Crown'))) && (
          <g transform="translate(75, 15)">
            <path d="M0,50 L0,10 L22,30 L45,0 L68,30 L90,10 L90,50 Z" fill="#FFD700" stroke="#B8860B" strokeWidth="3" />
            <circle cx="45" cy="15" r="5" fill="#FF0000" />
          </g>
        )}
        {equippedCosmetic?.fields.category === 'hat' && equippedCosmetic?.fields.name.includes('Santa') && (
          <g transform="translate(60, 10)">
            <path d="M0,60 Q60,0 120,60 Z" fill="#F44336" stroke="#2D2D2D" strokeWidth="3" />
            <rect x="0" y="50" width="120" height="15" rx="7.5" fill="white" stroke="#2D2D2D" strokeWidth="2" />
            <circle cx="125" cy="65" r="10" fill="white" stroke="#2D2D2D" strokeWidth="2" />
          </g>
        )}
      </svg>

      {/* Bubble Message */}
      {(isEating || isWashing || isBouncing) && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full border-4 border-gray-800 shadow-lg text-2xl animate-bounce">
          {expression}
        </div>
      )}
    </div>
  );
};

export default Panda;
