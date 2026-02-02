// Contract address and ABI for PandaNFT (Solidity)
export const PANDA_NFT_ADDRESS = "0xFd7cb65d2F95AF8935bD3947b893ba3032e7Ed6e";
export const PANDA_NFT_ABI = [
  // ERC721 Standard Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",

  // ERC721Enumerable Functions
  "function totalSupply() view returns (uint256)",
  "function tokenByIndex(uint256 index) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",

  // Panda Functions
  "function mint(string memory tokenURI) external",
  "function pandaLevel(uint256 tokenId) view returns (uint8)",
  "function levelUp(uint256 tokenId) external",
  "function getTotalPandas() view returns (uint256)",

  // Cosmetic Management (Admin only)
  "function createCosmetic(string memory category, string memory name, string memory description, string memory rarity) external returns (uint256)",
  "function cosmetics(uint256 cosmeticId) view returns (uint256 id, string memory category, string memory name, string memory description, string memory rarity)",
  "function getCosmetic(uint256 cosmeticId) view returns (uint256 id, string memory category, string memory name, string memory description, string memory rarity)",
  "function getTotalCosmetics() view returns (uint256)",

  // Equip/Unequip Functions
  "function equipCosmetic(uint256 pandaId, uint256 cosmeticId) external",
  "function unequipCosmetic(uint256 pandaId, string memory category) external",
  "function getEquippedCosmetic(uint256 pandaId, string memory category) view returns (uint256)",
  "function isSlotOccupied(uint256 pandaId, string memory category) view returns (bool)",
  "function pandaCosmetics(uint256 pandaId, string memory category) view returns (uint256)",

  // Events
  "event CosmeticCreated(uint256 indexed cosmeticId, string category, string name, string rarity)",
  "event CosmeticEquipped(uint256 indexed pandaId, uint256 indexed cosmeticId, string category)",
  "event CosmeticUnequipped(uint256 indexed pandaId, string category)",
];
