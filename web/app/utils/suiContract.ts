import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';

// Configuration - Update these with your contract details
export const CONTRACT_CONFIG = {
  PACKAGE_ID: process.env.NEXT_PUBLIC_YERU_PACKAGE_ID || '0x0',
  MODULE_NAME: 'yeru_contract',
  NETWORK: (process.env.NEXT_PUBLIC_SUI_NETWORK as 'testnet' | 'mainnet' | 'devnet') || 'testnet',
};

export interface ContractCallParams {
  function: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  arguments?: any[];
  typeArguments?: string[];
}

/**
 * Create a transaction for calling a contract function
 */
export function createContractTransaction(
  params: ContractCallParams
): Transaction {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${CONTRACT_CONFIG.PACKAGE_ID}::${CONTRACT_CONFIG.MODULE_NAME}::${params.function}`,
    arguments: params.arguments || [],
    typeArguments: params.typeArguments || [],
  });

  return tx;
}

/**
 * Query contract state/data
 */
export async function queryContractState(
  client: SuiClient,
  objectId: string
) {
  try {
    const obj = await client.getObject({
      id: objectId,
      options: { showContent: true },
    });
    return obj;
  } catch (error) {
    console.error('Failed to query contract state:', error);
    throw error;
  }
}

/**
 * Get events from contract calls
 */
export async function getContractEvents(
  client: SuiClient,
  eventType: string,
  limit: number = 10
) {
  try {
    const events = await client.queryEvents({
      query: {
        MoveEventType: eventType,
      },
      limit,
      order: 'descending',
    });
    return events.data;
  } catch (error) {
    console.error('Failed to get contract events:', error);
    throw error;
  }
}

/**
 * Get objects owned by an address
 */
export async function getOwnedObjects(
  client: SuiClient,
  owner: string,
  filter?: { structType?: string }
) {
  try {
    const objects = await client.getOwnedObjects({
      owner,
      filter: filter?.structType ? { StructType: filter.structType } : undefined,
      options: { showContent: true },
    });
    return objects.data;
  } catch (error) {
    console.error('Failed to get owned objects:', error);
    throw error;
  }
}
