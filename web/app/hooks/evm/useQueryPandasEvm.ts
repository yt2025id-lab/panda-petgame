import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { PANDA_NFT_ADDRESS, PANDA_NFT_ABI } from '../../constants/contractEvm';
import { getReadProvider } from './providerUtils';

export type PandaFields = {
  id: { id: string };
  name: string;
  owner: string;
};

export type PandaObject = {
  objectId: string;
  fields: PandaFields;
};

export default function useQueryPandasEvm(account: string | undefined) {
  const [pandas, setPandas] = useState<PandaObject[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!account) return;
    const fetchPandas = async () => {
      setIsLoading(true);
      try {
        const provider = getReadProvider();
        const contract = new ethers.Contract(PANDA_NFT_ADDRESS, PANDA_NFT_ABI, provider);
        const balance = await contract.balanceOf(account);
        const pandaList: PandaObject[] = [];
        for (let i = 0; i < balance.toNumber(); i++) {
          const tokenId = await contract.tokenOfOwnerByIndex(account, i);
          const tokenURI = await contract.tokenURI(tokenId);
          pandaList.push({
            objectId: tokenId.toString(),
            fields: {
              id: { id: tokenId.toString() },
              name: tokenURI,
              owner: account,
            }
          });
        }
        setPandas(pandaList);
      } catch (e) {
        console.error('Error fetching pandas:', e);
        setPandas([]);
      }
      setIsLoading(false);
    };
    fetchPandas();
  }, [account]);

  return { pandas, isLoading };
}
