import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation } from "@tanstack/react-query";
import { MODULE_NAME, PACKAGE_ID } from "../constans/contract";


type UnequipCosmeticParams = {
  pandaId: string;
  category: string;
  recipient: string;
};

export default function useUnequipCosmetic({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  return useMutation({
    mutationFn: async (params: UnequipCosmeticParams) => {
      if (!currentAccount?.address) {
        throw new Error("No connected account");
      }

      const tx = new Transaction();

      tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::unequip_item`,
        arguments: [
          tx.object(params.pandaId),
          tx.pure.string(params.category),
          tx.pure.address(params.recipient),
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
