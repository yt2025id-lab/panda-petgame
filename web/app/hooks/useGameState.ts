"use client"
import { useState, useEffect, useCallback } from 'react';
import { PetStats, FoodItem, GameMessage, MissionStatus, ToyItem } from '../components/type';
import { INITIAL_STATS, DECAY_RATES, MISSIONS, getPandaDialogue } from '../components/constant';

function loadSavedState<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch { return fallback; }
}

export default function useGameState() {
  const [stats, setStats] = useState<PetStats>(() => loadSavedState('panda_stats', INITIAL_STATS));
  const [coins, setCoins] = useState(() => loadSavedState('panda_coins', 100));
  const [isSleeping, setIsSleeping] = useState(false);
  const [isEating, setIsEating] = useState(false);
  const [isWashing, setIsWashing] = useState(false);
  const [messages, setMessages] = useState<GameMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [missionStatuses, setMissionStatuses] = useState<MissionStatus[]>(() =>
    loadSavedState('panda_missions', MISSIONS.map(m => ({ missionId: m.id, progress: 0, claimed: false })))
  );

  // Save game state to localStorage
  useEffect(() => {
    localStorage.setItem('panda_stats', JSON.stringify(stats));
  }, [stats]);
  useEffect(() => {
    localStorage.setItem('panda_coins', JSON.stringify(coins));
  }, [coins]);
  useEffect(() => {
    localStorage.setItem('panda_missions', JSON.stringify(missionStatuses));
  }, [missionStatuses]);

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

  // Game Loop - stat decay
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

  const addXP = useCallback((amount: number) => {
    setStats(prev => ({ ...prev, xp: prev.xp + amount }));
  }, []);

  const feedPet = useCallback((food: FoodItem) => {
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
  }, [coins, isSleeping, addXP, updateMissionProgress]);

  const playWithToy = useCallback((toy: ToyItem) => {
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
  }, [stats.energy, isSleeping, addXP, updateMissionProgress, handlePandaTalk]);

  const claimMission = useCallback((missionId: string) => {
    const status = missionStatuses.find(s => s.missionId === missionId);
    const mission = MISSIONS.find(m => m.id === missionId);
    if (status && mission && status.progress >= mission.requirement && !status.claimed) {
      setCoins(prev => prev + mission.reward);
      setMissionStatuses(prev => prev.map(s => s.missionId === missionId ? { ...s, claimed: true } : s));
      handlePandaTalk(`Yay! Earned ${mission.reward} coins! 💰`);
    }
  }, [missionStatuses, handlePandaTalk]);

  const handlePetting = useCallback(() => {
    if (isSleeping) return;
    setStats(prev => ({ ...prev, fun: Math.min(100, prev.fun + 0.5) }));
    updateMissionProgress('pet', 0.1);
    if (Math.random() < 0.01) {
      handlePandaTalk("is being petted and happy");
      addXP(1);
    }
  }, [isSleeping, updateMissionProgress, handlePandaTalk, addXP]);

  const washPet = useCallback(() => {
    if (isSleeping) return;
    setIsWashing(true);
    setStats(prev => ({ ...prev, hygiene: Math.min(100, prev.hygiene + 20) }));
    addXP(10);
    updateMissionProgress('wash');
    setTimeout(() => setIsWashing(false), 2000);
  }, [isSleeping, addXP, updateMissionProgress]);

  const toggleSleep = useCallback(() => {
    const newSleepState = !isSleeping;
    setIsSleeping(newSleepState);
    if (newSleepState) {
      setMessages([]);
    } else {
      handlePandaTalk("just woke up");
    }
  }, [isSleeping, handlePandaTalk]);

  return {
    stats,
    coins,
    setCoins,
    isSleeping,
    isEating,
    isWashing,
    messages,
    isThinking,
    missionStatuses,
    handlePandaTalk,
    updateMissionProgress,
    addXP,
    feedPet,
    playWithToy,
    claimMission,
    handlePetting,
    washPet,
    toggleSleep,
  };
}
