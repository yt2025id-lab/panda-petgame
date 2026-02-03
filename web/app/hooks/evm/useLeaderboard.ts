import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { LEADERBOARD_ADDRESS, LEADERBOARD_ABI } from '../../constants/leaderboardContract';
import { getReadProvider, getWriteProvider } from './providerUtils';

export interface LeaderboardEntry {
  player: string;
  totalScore: number;
  pandaLevel: number;
  gamesPlayed: number;
  lastUpdated: number;
}

export interface PlayerStats {
  totalScore: number;
  pandaLevel: number;
  gamesPlayed: number;
  rank: number;
}

export default function useLeaderboard(account: string | undefined) {
  const [topPlayers, setTopPlayers] = useState<LeaderboardEntry[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLeaderboard = useCallback(async () => {

    setIsLoading(true);
    try {
      const provider = getReadProvider();
      const contract = new ethers.Contract(LEADERBOARD_ADDRESS, LEADERBOARD_ABI, provider);

      const players = await contract.getTopPlayers(10);
      const parsed: LeaderboardEntry[] = players.map((p: any) => ({
        player: p.player,
        totalScore: Number(p.totalScore),
        pandaLevel: Number(p.pandaLevel),
        gamesPlayed: Number(p.gamesPlayed),
        lastUpdated: Number(p.lastUpdated),
      }));
      setTopPlayers(parsed);

      if (account) {
        const stats = await contract.getPlayerStats(account);
        setPlayerStats({
          totalScore: Number(stats.totalScore),
          pandaLevel: Number(stats.pandaLevel),
          gamesPlayed: Number(stats.gamesPlayed),
          rank: Number(stats.rank),
        });
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
    setIsLoading(false);
  }, [account]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const submitScore = useCallback(async (score: number) => {

    try {
      const provider = getWriteProvider();
      const signer = provider.getSigner();
      const contract = new ethers.Contract(LEADERBOARD_ADDRESS, LEADERBOARD_ABI, signer);
      const tx = await contract.submitScore(score);
      await tx.wait();
      fetchLeaderboard();
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  }, [fetchLeaderboard]);

  const updateLevel = useCallback(async (level: number) => {

    try {
      const provider = getWriteProvider();
      const signer = provider.getSigner();
      const contract = new ethers.Contract(LEADERBOARD_ADDRESS, LEADERBOARD_ABI, signer);
      const tx = await contract.updateLevel(level);
      await tx.wait();
    } catch (error) {
      console.error('Error updating level:', error);
    }
  }, []);

  return { topPlayers, playerStats, isLoading, submitScore, updateLevel, refetch: fetchLeaderboard };
}
