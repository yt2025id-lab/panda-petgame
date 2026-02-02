import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { PANDA_NFT_ADDRESS, PANDA_NFT_ABI } from '../../constants/contractEvm';
import { getReadProvider } from './providerUtils';

export type CosmeticFields = {
  id: { id: string };
  category: string;
  name: string;
  description: string;
  rarity: string;
};

export type CosmeticObject = {
  objectId: string;
  fields: CosmeticFields;
};

export default function useQueryCosmeticsEvm(account: string | undefined) {
  const [cosmetics, setCosmetics] = useState<CosmeticObject[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!account) return;
    const fetchCosmetics = async () => {
      setIsLoading(true);
      try {
        const provider = getReadProvider();
        const contract = new ethers.Contract(PANDA_NFT_ADDRESS, PANDA_NFT_ABI, provider);
        const cosmeticsList: CosmeticObject[] = [];
        for (let i = 0; i < 20; i++) {
          try {
            const c = await contract.cosmetics(i);
            if (c.name && c.name.length > 0) {
              cosmeticsList.push({
                objectId: c.id.toString(),
                fields: {
                  id: { id: c.id.toString() },
                  category: c.category,
                  name: c.name,
                  description: c.description,
                  rarity: c.rarity,
                }
              });
            }
          } catch {
            // Skip if cosmetic doesn't exist
          }
        }
        setCosmetics(cosmeticsList);
      } catch (e) {
        console.error('Error fetching cosmetics:', e);
        setCosmetics([]);
      }
      setIsLoading(false);
    };
    fetchCosmetics();
  }, [account]);

  return { cosmetics, isLoading };
}
