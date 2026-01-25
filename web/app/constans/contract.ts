// Yeru Contract - Published on Sui Testnet
// Package ID: 0x8bc247ceaa11acc92d7e71750ccc5cd35f21b7d2d4656f1a671144532fa28e20
// Publisher: 0x914319df7168933418f335e0819aeda6518f331d2ab2c2642419ef5191a9cdfb
// Display Object ID: 0xfe6c8b3238267e8a4b304c63cf9667e7e5ecd27358ee56dac51b327550b7eb49
// Transaction Digest: HW9pqMbGBGZBnHfECSryUMarnL9QEvXULb7Cg6JomAsA
// 0x8bc247ceaa11acc92d7e71750ccc5cd35f21b7d2d4656f1a671144532fa28e20

export const PACKAGE_ID: string = "0x8bc247ceaa11acc92d7e71750ccc5cd35f21b7d2d4656f1a671144532fa28e20";
export const MODULE_NAME: string = "yeru_contract";
export const NFT_STRUCT_NAME: string = "Panda";
export const COSMETIC_STRUCT_NAME: string = "Cosmetic";

// Publisher object - needed for transactions
export const PUBLISHER_ID: string = "0x914319df7168933418f335e0819aeda6518f331d2ab2c2642419ef5191a9cdfb";

// Display object for Panda NFT
export const DISPLAY_ID: string = "0xfe6c8b3238267e8a4b304c63cf9667e7e5ecd27358ee56dac51b327550b7eb49";

// NFT Types for querying and transactions
export const PANDA_TYPE = `${PACKAGE_ID}::${MODULE_NAME}::${NFT_STRUCT_NAME}`;
export const COSMETIC_TYPE = `${PACKAGE_ID}::${MODULE_NAME}::${COSMETIC_STRUCT_NAME}`;

// Event types for indexing
export const COSMETIC_EQUIPPED_EVENT = `${PACKAGE_ID}::${MODULE_NAME}::CosmeticEquipped`;
export const COSMETIC_UNEQUIPPED_EVENT = `${PACKAGE_ID}::${MODULE_NAME}::CosmeticUnequipped`;