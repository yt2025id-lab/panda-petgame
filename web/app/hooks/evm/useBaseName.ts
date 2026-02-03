import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getReadProvider } from './providerUtils';

// Base Sepolia L2 Resolver for reverse resolution
// https://docs.base.org/docs/tools/basenames
const L2_RESOLVER_ADDRESS = "0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA";

const L2_RESOLVER_ABI = [
  "function name(bytes32 node) view returns (string)"
];

// Reverse node for an address: addr.reverse namehash
function getReverseNode(address: string): string {
  const addr = address.toLowerCase().replace("0x", "");
  const label = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(addr));
  const reverseNode = ethers.utils.namehash("addr.reverse");
  return ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(["bytes32", "bytes32"], [reverseNode, label])
  );
}

export default function useBaseName(account: string | undefined) {
  const [baseName, setBaseName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!account) {
      setBaseName(null);
      return;
    }

    let cancelled = false;

    async function resolve() {
      setIsLoading(true);
      try {
        const provider = getReadProvider();
        const resolver = new ethers.Contract(L2_RESOLVER_ADDRESS, L2_RESOLVER_ABI, provider);
        const node = getReverseNode(account!);
        const name = await resolver.name(node);
        if (!cancelled && name && name.length > 0) {
          setBaseName(name);
        }
      } catch {
        // No BaseName registered or resolver not available - that's fine
        if (!cancelled) setBaseName(null);
      }
      if (!cancelled) setIsLoading(false);
    }

    resolve();
    return () => { cancelled = true; };
  }, [account]);

  return { baseName, isLoading };
}
