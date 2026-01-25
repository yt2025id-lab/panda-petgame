import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useMutation } from "@tanstack/react-query";
import { MODULE_NAME, PACKAGE_ID } from "../constans/contract";


type CreatePandaParams = {
  name: string;
};

export default function useCreatePanda({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
} = {}) {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  return useMutation({
    mutationFn: async (params: CreatePandaParams) => {
      if (!currentAccount?.address) {
        throw new Error("No connected account");
      }

      const tx = new Transaction();

      const panda = tx.moveCall({
        target: `${PACKAGE_ID}::${MODULE_NAME}::create_panda`,
        arguments: [tx.pure.string(params.name)],
      });

      tx.transferObjects([panda], tx.pure.address(currentAccount.address));

      const result = await signAndExecute({ transaction: tx });
      onSuccess?.();
      return result;
    },
    onError: (error) => {
      onError?.(error as Error);
    },
  });
}
