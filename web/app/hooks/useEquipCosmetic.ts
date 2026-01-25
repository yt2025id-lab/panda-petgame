import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation } from "@tanstack/react-query";
import { MODULE_NAME, PACKAGE_ID } from "../constans/contract";


type EquipCosmeticParams = {
  pandaId: string;
  cosmeticId: string;
};

export default function useEquipCosmetic({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  return useMutation({
    mutationFn: async (params: EquipCosmeticParams) => {
      if (!currentAccount?.address) {
        throw new Error("No connected account");
      }

      const tx = new Transaction();

      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::equip_item`,
        arguments: [
          tx.object(params.pandaId),
          tx.object(params.cosmeticId),
        ],
      });

      const result = await signAndExecute({ transaction: tx });
      onSuccess?.();
      return result;
    },
    onError: (error) => {
      onError?.(error as Error);
    },
  });
}
