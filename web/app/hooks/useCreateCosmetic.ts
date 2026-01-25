import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation } from "@tanstack/react-query";
import { MODULE_NAME, PACKAGE_ID } from "../constans/contract";


type CreateCosmeticParams = {
  category: string;
  name: string;
  description: string;
  rarity: string;
};

export default function useCreateCosmetic({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  return useMutation({
    mutationFn: async (params: CreateCosmeticParams) => {
      if (!currentAccount?.address) {
        throw new Error("No connected account");
      }

      const tx = new Transaction();

      const cosmetic = tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::create_cosmetic`,
        arguments: [
          tx.pure.string(params.category),
          tx.pure.string(params.name),
          tx.pure.string(params.description),
          tx.pure.string(params.rarity),
        ],
      });

      tx.transferObjects([cosmetic], tx.pure.address(currentAccount.address));

      const result = await signAndExecute({ transaction: tx });
      onSuccess?.();
      return result;
    },
    onError: (error) => {
      onError?.(error as Error);
    },
  });
}
