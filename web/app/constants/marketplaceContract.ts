// PandaMarketplace contract - deployed to Base Sepolia
// Update this address after running deploy-all.js
export const MARKETPLACE_ADDRESS = "0x4CE95c95cdB37D116C28A12AFFCb16Bf0523a041";

export const MARKETPLACE_ABI = [
  "function idrxToken() view returns (address)",
  "function DAILY_REWARD() view returns (uint256)",
  "function IDRX_PER_COIN() view returns (uint256)",
  "function claimDailyIDRX() external",
  "function canClaimDaily(address account) view returns (bool)",
  "function buyPremiumItem(uint256 itemId) external",
  "function depositIDRX(uint256 idrxAmount) external",
  "function withdrawIDRX(uint256 coinAmount) external",
  "function getItem(uint256 itemId) view returns (string name, uint256 priceIDRX, bool active, bool purchased)",
  "function getTotalItems() view returns (uint256)",
  "function premiumItems(uint256 id) view returns (uint256 id, string name, uint256 priceIDRX, bool active)",
  "function purchasedItems(address player, uint256 itemId) view returns (bool)",
  "event DailyRewardClaimed(address indexed player, uint256 amount)",
  "event ItemPurchased(address indexed player, uint256 indexed itemId, uint256 price)",
  "event CoinsDeposited(address indexed player, uint256 idrxAmount, uint256 coinsReceived)",
  "event CoinsWithdrawn(address indexed player, uint256 coinsSpent, uint256 idrxReceived)",
];
