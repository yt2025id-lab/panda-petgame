import { useCallback, useEffect, useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";

export type CosmeticState = {
  [category: string]: string;
};

export type PandaCosmeticsState = {
  [pandaId: string]: CosmeticState;
};

export default function usePandaCosmetics() {
  const currentAccount = useCurrentAccount();
  const [cosmetics, setCosmetics] = useState<PandaCosmeticsState>({});

  const storageKey = `panda_cosmetics_${currentAccount?.address}`;

  useEffect(() => {
    if (!currentAccount?.address) {
      setCosmetics({});
      return;
    }

    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setCosmetics(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse cosmetics from localStorage", e);
        setCosmetics({});
      }
    }
  }, [currentAccount?.address, storageKey]);

  const saveToStorage = useCallback(
    (data: PandaCosmeticsState) => {
      if (currentAccount?.address) {
        localStorage.setItem(storageKey, JSON.stringify(data));
        setCosmetics(data);
      }
    },
    [currentAccount?.address, storageKey]
  );

  const equipCosmetic = useCallback(
    (pandaId: string, category: string, cosmeticId: string) => {
      setCosmetics((prev) => {
        const updated = { ...prev };
        if (!updated[pandaId]) {
          updated[pandaId] = {};
        }
        updated[pandaId][category] = cosmeticId;
        saveToStorage(updated);
        return updated;
      });
    },
    [saveToStorage]
  );

  const unequipCosmetic = useCallback(
    (pandaId: string, category: string) => {
      setCosmetics((prev) => {
        const updated = { ...prev };
        if (updated[pandaId]) {
          delete updated[pandaId][category];
        }
        saveToStorage(updated);
        return updated;
      });
    },
    [saveToStorage]
  );

  const getCosmeticsForPanda = useCallback(
    (pandaId: string): CosmeticState => {
      return cosmetics[pandaId] || {};
    },
    [cosmetics]
  );

  return {
    cosmetics,
    equipCosmetic,
    unequipCosmetic,
    getCosmeticsForPanda,
  };
}
