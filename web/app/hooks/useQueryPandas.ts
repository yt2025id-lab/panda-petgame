import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import type { SuiObjectData } from "@mysten/sui/client";
import { PANDA_TYPE } from "../constans/contract";


export type PandaFields = {
  id: { id: string };
  name: string;
  owner: string;
};

export type PandaObject = {
  objectId: string;
  fields: PandaFields;
};

export default function useQueryPandas() {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();

  return useQuery({
    queryKey: ["queryPandas", currentAccount?.address],
    queryFn: async () => {
      if (!currentAccount?.address) throw new Error("No connected account");

      const response = await suiClient.getOwnedObjects({
        owner: currentAccount.address,
        filter: { StructType: PANDA_TYPE },
        options: { showContent: true, showType: true },
      });

      return response.data
        .filter((item) => item.data?.content?.dataType === "moveObject")
        .map((item) => {
          const data = item.data as SuiObjectData;
          const fields = (data.content as any)?.fields as PandaFields;
          return { objectId: data.objectId, fields };
        });
    },
    enabled: !!currentAccount,
  });
}
