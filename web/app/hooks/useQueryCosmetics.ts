import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import type { SuiObjectData } from "@mysten/sui/client";
import { COSMETIC_TYPE } from "../constans/contract";


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

export default function useQueryCosmetics() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();

  return useQuery({
    queryKey: ["queryCosmetics", currentAccount?.address],
    queryFn: async () => {
      if (!currentAccount?.address) throw new Error("No connected account");

      const response = await suiClient.getOwnedObjects({
        owner: currentAccount.address,
        filter: { StructType: COSMETIC_TYPE },
        options: { showContent: true, showType: true },
      });

      return response.data
        .filter((item) => item.data?.content?.dataType === "moveObject")
        .map((item) => {
          const data = item.data as SuiObjectData;
          const fields = (data.content as unknown as { fields: CosmeticFields })?.fields as CosmeticFields;
          return { objectId: data.objectId, fields };
        });
    },
    enabled: !!currentAccount,
  });
}
