"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { useCurrentAccount } from "@mysten/dapp-kit";
import { PetStats, FoodItem, GameMessage, MissionStatus, ToyItem } from './components/type';
import { INITIAL_STATS, DECAY_RATES, FOOD_ITEMS, MISSIONS, getPandaDialogue } from './components/constant';
import StatBar from './components/StatBar';
import Panda from './components/Panda';
import CreatePandaInitializer from './components/CreatePandaInitializer';
import CreateCosmeticInitializer from './components/CreateCosmeticInitializer';
import useQueryPandas from './hooks/useQueryPandas';
import useQueryCosmetics from './hooks/useQueryCosmetics';
import useEquipCosmetic from './hooks/useEquipCosmetic';
import useUnequipCosmetic from './hooks/useUnequipCosmetic';
import { WalletButton } from './components/WalletButton';
import BallShooter from './components/minigames/BallShooter';
import BambooCatcher from './components/minigames/BambooCatcher';

const App: React.FC = () => {
  // Get current account for unequip operations
  const currentAccount = useCurrentAccount();

  // Blockchain state
  const [hasCreatedPanda, setHasCreatedPanda] = useState(false);
  const [pandaName, setPandaName] = useState<string | null>(null);
  const [showCosmeticMinter, setShowCosmeticMinter] = useState(false);
  const { data: ownedPandas = [], isLoading: isLoadingPandas } = useQueryPandas();
  const { data: ownedCosmetics = [] } = useQueryCosmetics();

  // Cosmetic equipment hooks
  const { mutateAsync: equipCosmetic, isPending: isEquipping } = useEquipCosmetic({
    onSuccess: () => {
      handlePandaTalk("I love my new cosmetic! ✨");
    },
    onError: (error) => {
      console.error("Failed to equip cosmetic:", error);
      handlePandaTalk("Oh no! Failed to equip cosmetic.");
    },
  });

  const { mutateAsync: unequipCosmetic, isPending: isUnequipping } = useUnequipCosmetic({
    onSuccess: () => {
      handlePandaTalk("I took off my cosmetic.");
    },
    onError: (error) => {
      console.error("Failed to unequip cosmetic:", error);
      handlePandaTalk("Oh no! Failed to remove cosmetic.");
    },
  });

  // Game state
  const [stats, setStats] = useState<PetStats>(INITIAL_STATS);
  const [coins, setCoins] = useState(100);
  const [username] = useState("PandaKeeper");
  const [isSleeping, setIsSleeping] = useState(false);
  const [isEating, setIsEating] = useState(false);
  const [isWashing, setIsWashing] = useState(false);
  const [messages, setMessages] = useState<GameMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [draggedFood, setDraggedFood] = useState<FoodItem | null>(null);
  const [draggedToy, setDraggedToy] = useState<ToyItem | null>(null);
  const [activeMenu, setActiveMenu] = useState<'NONE' | 'KITCHEN' | 'PLAY' | 'COINS' | 'COSMETIC'>('NONE');
  const [equippedCosmeticId, setEquippedCosmeticId] = useState<string | null>(null);
  const [missionStatuses, setMissionStatuses] = useState<MissionStatus[]>(
    MISSIONS.map(m => ({ missionId: m.id, progress: 0, claimed: false }))
  );
  const [activeMinigame, setActiveMinigame] = useState<'NONE' | 'BALLSHOOTER' | 'BAMBOOCATCHER'>('NONE');

  // Check if user has created a Panda on blockchain
  useEffect(() => {
    if (!isLoadingPandas && ownedPandas.length > 0) {
      setHasCreatedPanda(true);
      if (!pandaName && ownedPandas[0]) {
        setPandaName(ownedPandas[0].fields.name);
      }
    }
  }, [ownedPandas, isLoadingPandas, pandaName]);

  const handlePandaTalk = useCallback(async (customMessage?: string) => {
    if (isThinking || isSleeping) return;
    setIsThinking(true);
    const reply = await getPandaDialogue(stats, customMessage);
    setMessages([{ text: reply, sender: 'panda' }]);
    setIsThinking(false);
    setTimeout(() => setMessages([]), 5000);
  }, [isThinking, isSleeping, stats]);

  const updateMissionProgress = useCallback((type: string, value: number = 1, isAbsolute: boolean = false) => {
    setMissionStatuses(prev => prev.map(status => {
      const mission = MISSIONS.find(m => m.id === status.missionId);
      if (mission && mission.type === type && !status.claimed) {
        const newProgress = isAbsolute ? value : status.progress + value;
        return { ...status, progress: Math.min(mission.requirement, newProgress) };
      }
      return status;
    }));
  }, []);
  // Follow cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Leveling logic
  useEffect(() => {
    if (stats.xp >= 100) {
      setStats(prev => ({
        ...prev,
        xp: prev.xp - 100,
        level: prev.level + 1
      }));
      updateMissionProgress('level', stats.level + 1, true);
      handlePandaTalk(`Level Up! I'm now level ${stats.level + 1}! ✨`);
    }
  }, [stats.xp, stats.level, updateMissionProgress, handlePandaTalk]);

  // Game Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        hunger: Math.max(0, prev.hunger - (isSleeping ? DECAY_RATES.hunger / 2 : DECAY_RATES.hunger)),
        energy: isSleeping
          ? Math.min(100, prev.energy + 0.5)
          : Math.max(0, prev.energy - DECAY_RATES.energy),
        fun: Math.max(0, prev.fun - DECAY_RATES.fun),
        hygiene: Math.max(0, prev.hygiene - DECAY_RATES.hygiene),
        health: Math.max(0, prev.health - (prev.hunger === 0 ? 0.2 : 0)),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isSleeping]);




  const addXP = (amount: number) => {
    setStats(prev => ({ ...prev, xp: prev.xp + amount }));
  };

  const feedPet = (food: FoodItem) => {
    if (coins < food.cost || isSleeping) return;
    setCoins(prev => prev - food.cost);
    setIsEating(true);
    setStats(prev => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + food.nutrition),
      hygiene: Math.max(0, prev.hygiene - 2)
    }));
    addXP(10);
    updateMissionProgress('feed');
    setTimeout(() => setIsEating(false), 2000);
  };

  const playWithToy = (toy: ToyItem) => {
    if (stats.energy < toy.energyCost || isSleeping) return;
    setStats(prev => ({
      ...prev,
      fun: Math.min(100, prev.fun + toy.funValue),
      energy: Math.max(0, prev.energy - toy.energyCost)
    }));
    addXP(20);
    updateMissionProgress('play');
    if (Math.random() < 0.3) {
      handlePandaTalk(`Wheee! Playing with my ${toy.name}! ${toy.emoji}`);
    }
  };

  const claimMission = (missionId: string) => {
    const status = missionStatuses.find(s => s.missionId === missionId);
    const mission = MISSIONS.find(m => m.id === missionId);
    if (status && mission && status.progress >= mission.requirement && !status.claimed) {
      setCoins(prev => prev + mission.reward);
      setMissionStatuses(prev => prev.map(s => s.missionId === missionId ? { ...s, claimed: true } : s));
      handlePandaTalk(`Yay! Earned ${mission.reward} coins! 💰`);
    }
  };

  const handlePetting = useCallback(() => {
    if (isSleeping) return;
    setStats(prev => ({ ...prev, fun: Math.min(100, prev.fun + 0.5) }));
    updateMissionProgress('pet', 0.1);
    if (Math.random() < 0.01) {
      handlePandaTalk("is being petted and happy");
      addXP(1);
    }
  }, [isSleeping, updateMissionProgress, handlePandaTalk]);

  const washPet = () => {
    if (isSleeping) return;
    setIsWashing(true);
    setActiveMenu('NONE');
    setStats(prev => ({ ...prev, hygiene: Math.min(100, prev.hygiene + 20) }));
    addXP(10);
    updateMissionProgress('wash');
    setTimeout(() => setIsWashing(false), 2000);
  };

  const toggleSleep = () => {
    const newSleepState = !isSleeping;
    setIsSleeping(newSleepState);
    if (newSleepState) {
      setMessages([]);
      setActiveMenu('NONE');
    } else {
      handlePandaTalk("just woke up");
    }
  };

  const handleDropItem = () => {
    if (draggedFood) feedPet(draggedFood);
    else if (draggedToy) playWithToy(draggedToy);
  };

  const handleEquipCosmetic = useCallback(async (cosmeticId: string) => {
    // Get the first panda to equip/unequip the cosmetic
    if (!ownedPandas || ownedPandas.length === 0) {
      handlePandaTalk("You need a panda first!");
      return;
    }

    // Check if this is toggling off (unequip)
    if (equippedCosmeticId === cosmeticId) {
      try {
        // Find the cosmetic to get its category
        const cosmeticToRemove = ownedCosmetics.find(c => c.objectId === cosmeticId);
        if (!cosmeticToRemove) {
          handlePandaTalk("Cosmetic not found!");
          return;
        }

        if (!currentAccount?.address) {
          handlePandaTalk("Wallet not connected!");
          return;
        }

        // Call the unequip cosmetic function on blockchain
        await unequipCosmetic({
          pandaId: ownedPandas[0].objectId,
          category: cosmeticToRemove.fields.category,
          recipient: currentAccount.address,
        });

        // Only update local state after successful blockchain transaction
        setEquippedCosmeticId(null);
      } catch (error) {
        console.error("Error unequipping cosmetic:", error);
      }
      return;
    }

    try {
      // Call the equip cosmetic function on blockchain
      await equipCosmetic({
        pandaId: ownedPandas[0].objectId,
        cosmeticId: cosmeticId,
      });

      // Only update local state after successful blockchain transaction
      setEquippedCosmeticId(cosmeticId);
    } catch (error) {
      console.error("Error equipping cosmetic:", error);
    }
  }, [equippedCosmeticId, ownedPandas, ownedCosmetics, currentAccount, equipCosmetic, unequipCosmetic, handlePandaTalk]);

  const handleMinigameEnd = (score: number, xpEarned: number, coinsEarned: number) => {
    addXP(xpEarned);
    setCoins(prev => prev + coinsEarned);
    setActiveMinigame('NONE');
    handlePandaTalk(`Awesome game! Earned ${xpEarned} XP and ${coinsEarned} coins! 🎉`);
    updateMissionProgress('play', score);
  };

  return (
    <div className={`fixed inset-0 transition-colors duration-1000 ${isSleeping ? 'bg-[#0f0c29]' : 'bg-[#e0f7fa]'} flex flex-col overflow-hidden select-none`}>

      {/* Cosmetic Minter Modal */}
      {showCosmeticMinter && (
        <CreateCosmeticInitializer
          onSuccess={() => {
            setShowCosmeticMinter(false);
          }}
          coins={coins}
          onSpendCoins={(amount) => setCoins(prev => Math.max(0, prev - amount))}
        />
      )}

      {/* Minigame Modals */}
      {activeMinigame === 'BALLSHOOTER' && (
        <BallShooter
          onClose={() => setActiveMinigame('NONE')}
          onGameEnd={handleMinigameEnd}
        />
      )}
      {activeMinigame === 'BAMBOOCATCHER' && (
        <BambooCatcher
          onClose={() => setActiveMinigame('NONE')}
          onGameEnd={handleMinigameEnd}
        />
      )}

      {/* Panda Initialization Screen */}
      {!hasCreatedPanda && !isLoadingPandas && (
        <CreatePandaInitializer
          onSuccess={() => {
            setHasCreatedPanda(true);
          }}
        />
      )}

      {/* Loading Screen */}
      {isLoadingPandas && !hasCreatedPanda && (
        <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center z-50">
          <div className="text-center space-y-4">
            <div className="text-6xl animate-bounce">🐼</div>
            <p className="text-2xl font-bold text-gray-800">Loading your Panda...</p>
          </div>
        </div>
      )}

      {/* Game Content - Only show if Panda exists */}
      {hasCreatedPanda && (
        <>
          {/* Top Header */}
          <div className="p-4 flex flex-col gap-2 bg-white/60 backdrop-blur-md border-b-4 border-gray-800 z-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white font-game px-3 py-1 rounded-full border-4 border-gray-800 shadow-[2px_2px_0px_#2d2d2d]">
                  LVL {stats.level}
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-4 border-2 border-gray-800 overflow-hidden relative">
                  <div className="h-full bg-blue-400 transition-all duration-500" style={{ width: `${stats.xp}%` }} />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black uppercase text-gray-700">XP</span>
                </div>
              </div>
              <div className="flex gap-4">

                <div
                  onClick={() => setActiveMenu(activeMenu === 'COINS' ? 'NONE' : 'COINS')}
                  className="cursor-pointer bg-yellow-400 border-4 border-gray-800 rounded-full px-4 py-2 font-game text-xl shadow-[4px_4px_0px_#2d2d2d] hover:-translate-y-1 transition-transform flex items-center gap-2"
                >
                  💰 <span className="text-gray-900">{coins}</span>
                </div>
                <WalletButton />
              </div>
            </div>
            <div className="flex justify-between gap-2 overflow-x-auto pb-1 no-scrollbar">
              <StatBar label="Hunger" value={stats.hunger} icon="🍕" color="bg-orange-400" />
              <StatBar label="Health" value={stats.health} icon="❤️" color="bg-red-500" />
              <StatBar label="Fun" value={stats.fun} icon="⚽" color="bg-blue-400" />
              <StatBar label="Energy" value={stats.energy} icon="⚡" color="bg-yellow-400" />
              <StatBar label="Soap" value={stats.hygiene} icon="🧼" color="bg-teal-300" />
            </div>
          </div>

          {/* Main Game Area */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
            {messages.length > 0 && activeMenu === 'NONE' && (
              <div className="absolute top-20 bg-white border-4 border-gray-800 p-4 rounded-3xl max-w-xs shadow-xl animate-in fade-in slide-in-from-bottom-4 z-20">
                <p className="font-bold text-gray-800">{messages[0].text}</p>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[20px] border-t-gray-800" />
              </div>
            )}

            <div className={activeMenu !== 'NONE' ? ' transition-opacity' : 'transition-opacity'}>
              <Panda
                stats={stats}
                isSleeping={isSleeping}
                isEating={isEating}
                isWashing={isWashing}
                mousePos={mousePos}
                equippedCosmeticId={equippedCosmeticId}
                equippedCosmetic={ownedCosmetics.find(c => c.objectId === equippedCosmeticId)}
                onClick={() => !isSleeping && handlePandaTalk("Ouch! That tickles!")}
                onPet={handlePetting}
                onDropItem={handleDropItem}
              />
            </div>

            {/* Kitchen Tray Overlay */}
            {activeMenu === 'KITCHEN' && !isSleeping && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-in slide-in-from-bottom-full duration-300 z-30 w-full max-w-sm px-4">
                <div className="text-[10px] font-black bg-orange-500 text-white px-4 py-1 rounded-full uppercase tracking-tighter shadow-lg mb-[-10px] z-10 border-2 border-white">
                  Drag food to panda!
                </div>
                <div className="flex gap-4 p-5 bg-white border-8 border-gray-800 rounded-[2.5rem] shadow-[0_12px_0_#2d2d2d] overflow-x-auto w-full no-scrollbar">
                  {FOOD_ITEMS.map(food => (
                    <div
                      key={food.id}
                      draggable
                      onDragStart={() => { setDraggedFood(food); setDraggedToy(null); }}
                      onDragEnd={() => setDraggedFood(null)}
                      onClick={() => feedPet(food)}
                      className="flex-shrink-0 bg-orange-50 border-4 border-gray-800 p-3 rounded-2xl hover:bg-orange-100 transition-all cursor-grab active:cursor-grabbing hover:-translate-y-2 active:scale-95 shadow-[4px_4px_0px_#2d2d2d] flex flex-col items-center"
                    >
                      <div className="text-4xl">{food.emoji}</div>
                      <div className="text-xs font-black mt-2 text-gray-800">${food.cost}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Play Menu - Minigames */}
            {activeMenu === 'PLAY' && !isSleeping && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-in slide-in-from-bottom-full duration-300 z-30 w-full max-w-sm px-4">
                <div className="text-[10px] font-black bg-blue-500 text-white px-4 py-1 rounded-full uppercase tracking-tighter shadow-lg mb-[-10px] z-10 border-2 border-white">
                  Choose a minigame!
                </div>
                <div className="flex gap-4 p-5 bg-white border-8 border-gray-800 rounded-[2.5rem] shadow-[0_12px_0_#2d2d2d] overflow-x-auto w-full no-scrollbar">
                  <div
                    onClick={() => setActiveMinigame('BALLSHOOTER')}
                    className="flex-shrink-0 bg-blue-50 border-4 border-gray-800 p-4 rounded-2xl hover:bg-blue-100 transition-all cursor-pointer hover:-translate-y-2 active:scale-95 shadow-[4px_4px_0px_#2d2d2d] flex flex-col items-center"
                  >
                    <div className="text-4xl">⚽</div>
                    <div className="text-xs font-black mt-2 text-gray-800 text-center">Ball Shooter</div>
                  </div>
                  <div
                    onClick={() => setActiveMinigame('BAMBOOCATCHER')}
                    className="flex-shrink-0 bg-green-50 border-4 border-gray-800 p-4 rounded-2xl hover:bg-green-100 transition-all cursor-pointer hover:-translate-y-2 active:scale-95 shadow-[4px_4px_0px_#2d2d2d] flex flex-col items-center"
                  >
                    <div className="text-4xl">🎋</div>
                    <div className="text-xs font-black mt-2 text-gray-800 text-center">Bamboo Catcher</div>
                  </div>
                </div>
              </div>
            )}

            {/* Cosmetic Tray Overlay */}
            {activeMenu === 'COSMETIC' && !isSleeping && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-in slide-in-from-bottom-full duration-300 z-30 w-full max-w-sm px-4">
                <div className="text-[10px] font-black bg-pink-500 text-white px-4 py-1 rounded-full uppercase tracking-tighter shadow-lg mb-[-10px] z-10 border-2 border-white">
                  Tap to wear!
                </div>
                <div className="flex gap-4 p-5 bg-white border-8 border-gray-800 rounded-[2.5rem] shadow-[0_12px_0_#2d2d2d] overflow-x-auto w-full no-scrollbar min-h-[120px] items-center">
                  {ownedCosmetics.length > 0 ? (
                    ownedCosmetics.map(cosmetic => {
                      const isEquipped = equippedCosmeticId === cosmetic.objectId;
                      const isLoading = isEquipping || isUnequipping;
                      return (
                        <div
                          key={cosmetic.objectId}
                          onClick={() => handleEquipCosmetic(cosmetic.objectId)}
                          className={`flex-shrink-0 p-3 rounded-2xl border-4 border-gray-800 transition-all cursor-pointer hover:-translate-y-2 active:scale-95 shadow-[4px_4px_0px_#2d2d2d] flex flex-col items-center ${isEquipped ? 'bg-green-100' : 'bg-pink-50'} ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                          <div className="text-4xl mb-1">✨</div>
                          <div className="text-[9px] font-black text-center text-gray-800 mb-1 max-w-[60px] line-clamp-2">{cosmetic.fields.name}</div>
                          <div className={`text-[8px] font-black px-1 py-0.5 rounded border-2 border-gray-800 uppercase ${isEquipped ? 'bg-green-400' : 'bg-pink-400 text-white'}`}>
                            {isLoading ? 'LOADING...' : isEquipped ? 'ON' : 'OFF'}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div onClick={() => setShowCosmeticMinter(true)} className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl border-4 border-dashed border-pink-400 cursor-pointer hover:bg-gradient-to-r hover:from-pink-200 hover:to-purple-200 transition-colors w-full justify-center">
                      <span className="text-3xl">✨</span>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-600 uppercase leading-none">No cosmetics</span>
                        <span className="text-xs font-black text-purple-600 uppercase">Mint one!</span>
                      </div>
                    </div>
                  )}
                  <div onClick={() => setShowCosmeticMinter(true)} className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl border-4 border-dashed border-pink-400 cursor-pointer hover:bg-gradient-to-r hover:from-pink-200 hover:to-purple-200 transition-colors w-full justify-center">
                    <span className="text-3xl">✨</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-purple-600 uppercase">Mint one!</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Coins / Profile / Shop / Missions Overlay (Modal) */}
            {activeMenu === 'COINS' && !isSleeping && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
                <div
                  className="bg-white rounded-[3rem] border-8 border-gray-800 w-full max-w-lg shadow-[0_20px_0_#2d2d2d] animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-8 pb-4 border-b-4 border-gray-100 flex justify-between items-center bg-white">
                    <div className="flex flex-col">
                      <span className="text-sm font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Master Keeper</span>
                      <h2 className="text-3xl font-game text-gray-800 tracking-tight">@{username}</h2>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-yellow-400 border-4 border-gray-800 rounded-full px-4 py-2 font-game text-xl shadow-[4px_4px_0px_#2d2d2d]">💰 {coins}</div>
                      <button
                        onClick={() => setActiveMenu('NONE')}
                        className="text-2xl font-bold bg-red-100 text-red-600 rounded-full w-12 h-12 flex items-center justify-center border-4 border-gray-800 hover:scale-110 active:scale-95 transition-transform"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  <div className="p-8 pt-6 overflow-y-auto custom-scrollbar flex-1">
                    {/* Missions Section */}
                    <div className="mb-10">
                      <h3 className="text-2xl font-game mb-6 text-indigo-600 flex items-center gap-3">
                        <span className="bg-indigo-100 p-2 rounded-2xl border-4 border-gray-800">🎯</span> Daily Missions
                      </h3>
                      <div className="space-y-4">
                        {MISSIONS.map(m => {
                          const status = missionStatuses.find(s => s.missionId === m.id)!;
                          const canClaim = status.progress >= m.requirement && !status.claimed;
                          return (
                            <div key={m.id} className={`p-5 rounded-[2rem] border-4 border-gray-800 transition-all ${status.claimed ? 'bg-gray-100 opacity-60' : 'bg-indigo-50 shadow-[4px_4px_0px_#2d2d2d]'}`}>
                              <div className="flex justify-between items-start mb-3 text-left">
                                <div>
                                  <h4 className="font-bold text-lg text-gray-800">{m.title}</h4>
                                  <p className="text-sm text-gray-400 font-medium">{m.description}</p>
                                </div>
                                <div className="bg-yellow-300 px-3 py-1 rounded-full border-4 border-gray-800 text-sm font-black whitespace-nowrap">+{m.reward} 💰</div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex-1 bg-white rounded-full h-5 border-4 border-gray-800 overflow-hidden shadow-inner">
                                  <div
                                    className="h-full bg-indigo-500 transition-all duration-700 ease-out"
                                    style={{ width: `${(status.progress / m.requirement) * 100}%` }}
                                  />
                                </div>
                                <button
                                  disabled={!canClaim}
                                  onClick={() => claimMission(m.id)}
                                  className={`px-6 py-2 rounded-2xl border-4 border-gray-800 font-game text-sm transition-all ${status.claimed ? 'bg-gray-400' :
                                    canClaim ? 'bg-green-400 hover:scale-105 active:scale-90 shadow-[2px_2px_0_#2d2d2d]' : 'bg-gray-200 opacity-50'
                                    }`}
                                >
                                  {status.claimed ? 'Claimed' : 'Claim'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Shop Section */}
                    <div className="pb-4">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-game text-pink-500 flex items-center gap-3">
                          <span className="bg-pink-100 p-2 rounded-2xl border-4 border-gray-800">🛍️</span> Panda Boutique
                        </h3>
                        <button
                          onClick={() => {
                            setActiveMenu('NONE');
                            setShowCosmeticMinter(true);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-pink-400 to-purple-400 border-4 border-gray-800 rounded-2xl font-black text-xs uppercase hover:scale-105 active:scale-95 transition-transform shadow-[2px_2px_0px_#2d2d2d]"
                        >
                          ✨ Mint NFT
                        </button>
                      </div>

                      {/* Owned Cosmetics from Blockchain */}
                      {ownedCosmetics.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                            <span>💎 Your NFT Cosmetics</span>
                            <span className="bg-blue-200 px-3 py-1 rounded-full text-sm border-2 border-gray-800">{ownedCosmetics.length}</span>
                          </h4>
                          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-blue-50 border-4 border-blue-200 rounded-2xl">
                            {ownedCosmetics.map(cosmetic => {
                              const isEquipped = equippedCosmeticId === cosmetic.objectId;
                              const isLoading = isEquipping || isUnequipping;
                              return (
                                <div
                                  key={cosmetic.objectId}
                                  onClick={() => handleEquipCosmetic(cosmetic.objectId)}
                                  className={`
                                flex flex-col items-center justify-between border-4 border-gray-800 p-4 rounded-[2rem] transition-all cursor-pointer 
                                hover:-translate-y-1 shadow-[4px_4px_0px_#2d2d2d] active:shadow-none active:translate-y-1
                                ${isEquipped ? 'bg-green-100' : 'bg-white'} ${isLoading ? 'opacity-50 pointer-events-none' : ''}
                              `}
                                >
                                  <div className="text-4xl mb-2">✨</div>
                                  <div className="w-full">
                                    <p className="text-center font-bold text-gray-800 mb-2 text-sm line-clamp-2">{cosmetic.fields.name}</p>
                                    <div className={`text-center py-1 rounded-2xl border-4 border-gray-800 font-black uppercase text-xs ${isEquipped ? 'bg-green-400' : 'bg-blue-400 text-white'
                                      }`}>
                                      {isLoading ? 'LOADING...' : isEquipped ? 'Equipped' : 'Equip'}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}


                    </div>
                  </div>
                </div>
              </div>
            )}

            {isWashing && (
              <div className="absolute pointer-events-none inset-0 flex items-center justify-center z-50 overflow-hidden">
                {[...Array(12)].map((_, i) => (
                  // eslint-disable-next-line react-hooks/purity
                  <div key={i} className="text-6xl animate-bounce absolute" style={{ left: `${Math.random() * 80 + 10}%`, top: `${Math.random() * 80 + 10}%`, animationDelay: `${i * 0.1}s`, opacity: 0.6 }}>🫧</div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="p-6 bg-white/40 backdrop-blur-md border-t-4 border-gray-800 flex justify-around items-center z-40">
            <NavButton icon="🎮" label="Play" onClick={() => setActiveMenu(activeMenu === 'PLAY' ? 'NONE' : 'PLAY')} active={activeMenu === 'PLAY'} />
            <NavButton icon="🥘" label="Kitchen" onClick={() => setActiveMenu(activeMenu === 'KITCHEN' ? 'NONE' : 'KITCHEN')} active={activeMenu === 'KITCHEN'} />
            <NavButton icon="👗" label="Cosmetic" onClick={() => setActiveMenu(activeMenu === 'COSMETIC' ? 'NONE' : 'COSMETIC')} active={activeMenu === 'COSMETIC'} />
            <NavButton icon="🧼" label="Wash" onClick={washPet} active={isWashing} />
            <NavButton icon={isSleeping ? "☀️" : "🌙"} label={isSleeping ? "Wake" : "Sleep"} onClick={toggleSleep} active={isSleeping} />
          </div>

          {isThinking && <div className="absolute bottom-32 right-12 text-5xl animate-pulse z-30">🐼💭</div>}
        </>
      )}
    </div>
  );
};

interface NavButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
  active: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, onClick, active }) => (
  <button onClick={onClick} className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 border-4 ${active ? 'bg-white border-gray-800 -translate-y-4 shadow-[0_8px_0_#2d2d2d]' : 'bg-white/40 border-transparent hover:bg-white/60 hover:-translate-y-1 active:translate-y-0'}`}>
    <span className="text-3xl">{icon}</span>
    <span className="text-xs font-black mt-1 uppercase text-gray-800">{label}</span>
  </button>
);

export default App;