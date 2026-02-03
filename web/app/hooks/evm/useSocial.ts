import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { SOCIAL_ADDRESS, SOCIAL_ABI } from '../../constants/socialContract';
import { getReadProvider, getWriteProvider } from './providerUtils';

export interface FriendInfo {
  address: string;
  canVisit: boolean;
}

export default function useSocial(account: string | undefined) {
  const [friends, setFriends] = useState<FriendInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isVisiting, setIsVisiting] = useState(false);
  const [isSendingGift, setIsSendingGift] = useState(false);

  const fetchFriends = useCallback(async () => {
    if (!account) return;
    setIsLoading(true);
    try {
      const provider = getReadProvider();
      const contract = new ethers.Contract(SOCIAL_ADDRESS, SOCIAL_ABI, provider);

      const friendAddresses: string[] = await contract.getFriends(account);
      const friendInfos: FriendInfo[] = [];

      for (const addr of friendAddresses) {
        let canVisitFriend = true;
        try {
          canVisitFriend = await contract.canVisit(account, addr);
        } catch {
          // default to true if check fails
        }
        friendInfos.push({ address: addr, canVisit: canVisitFriend });
      }

      setFriends(friendInfos);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
    setIsLoading(false);
  }, [account]);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const addFriend = useCallback(async (friendAddress: string) => {
    setIsAdding(true);
    try {
      const provider = getWriteProvider();
      const signer = provider.getSigner();
      const contract = new ethers.Contract(SOCIAL_ADDRESS, SOCIAL_ABI, signer);
      const tx = await contract.addFriend(friendAddress);
      await tx.wait();
      await fetchFriends();
    } catch (error) {
      console.error('Error adding friend:', error);
      throw error;
    } finally {
      setIsAdding(false);
    }
  }, [fetchFriends]);

  const visitFriend = useCallback(async (friendAddress: string) => {
    setIsVisiting(true);
    try {
      const provider = getWriteProvider();
      const signer = provider.getSigner();
      const contract = new ethers.Contract(SOCIAL_ADDRESS, SOCIAL_ABI, signer);
      const tx = await contract.visitFriend(friendAddress);
      await tx.wait();
      await fetchFriends();
    } catch (error) {
      console.error('Error visiting friend:', error);
      throw error;
    } finally {
      setIsVisiting(false);
    }
  }, [fetchFriends]);

  const sendGift = useCallback(async (toAddress: string, giftType: number) => {
    setIsSendingGift(true);
    try {
      const provider = getWriteProvider();
      const signer = provider.getSigner();
      const contract = new ethers.Contract(SOCIAL_ADDRESS, SOCIAL_ABI, signer);
      const tx = await contract.sendGift(toAddress, giftType);
      await tx.wait();
    } catch (error) {
      console.error('Error sending gift:', error);
      throw error;
    } finally {
      setIsSendingGift(false);
    }
  }, []);

  return {
    friends,
    isLoading,
    isAdding,
    isVisiting,
    isSendingGift,
    addFriend,
    visitFriend,
    sendGift,
    refetch: fetchFriends,
  };
}
