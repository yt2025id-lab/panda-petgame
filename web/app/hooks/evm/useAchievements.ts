import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { ACHIEVEMENTS_ADDRESS, ACHIEVEMENTS_ABI } from '../../constants/achievementsContract';
import { getReadProvider, getWriteProvider } from './providerUtils';

export interface AchievementInfo {
  id: number;
  name: string;
  description: string;
  category: string;
  imageEmoji: string;
  claimed: boolean;
}

export default function useAchievements(account: string | undefined) {
  const [achievements, setAchievements] = useState<AchievementInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const fetchAchievements = useCallback(async () => {
    if (!account) return;
    setIsLoading(true);
    try {
      const provider = getReadProvider();
      const contract = new ethers.Contract(ACHIEVEMENTS_ADDRESS, ACHIEVEMENTS_ABI, provider);

      const total = await contract.getTotalAchievements();
      const playerAchievements = await contract.getPlayerAchievements(account);

      const result: AchievementInfo[] = [];
      for (let i = 0; i < Number(total); i++) {
        const info = await contract.getAchievement(i);
        result.push({
          id: i,
          name: info.name,
          description: info.description,
          category: info.category,
          imageEmoji: info.imageEmoji,
          claimed: playerAchievements[i] || false,
        });
      }
      setAchievements(result);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
    setIsLoading(false);
  }, [account]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  const claimAchievement = useCallback(async (achievementId: number) => {
    setIsClaiming(true);
    try {
      const provider = getWriteProvider();
      const signer = provider.getSigner();
      const contract = new ethers.Contract(ACHIEVEMENTS_ADDRESS, ACHIEVEMENTS_ABI, signer);
      const tx = await contract.claimAchievement(achievementId);
      await tx.wait();
      fetchAchievements();
    } catch (error) {
      console.error('Error claiming achievement:', error);
      throw error;
    } finally {
      setIsClaiming(false);
    }
  }, [fetchAchievements]);

  return { achievements, isLoading, isClaiming, claimAchievement, refetch: fetchAchievements };
}
