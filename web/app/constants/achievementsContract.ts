// PandaAchievements (Soulbound Token) contract - deployed to Base Sepolia
// Update this address after running deploy-all.js
export const ACHIEVEMENTS_ADDRESS = "0x0a8D4d1FB5B768A78f1f9142393C8c9dD3eEf2a0";

export const ACHIEVEMENTS_ABI = [
  "function claimAchievement(uint256 achievementId) external",
  "function getPlayerAchievements(address player) view returns (bool[])",
  "function getAchievement(uint256 achievementId) view returns (string name, string description, string category, string imageEmoji)",
  "function getTotalAchievements() view returns (uint256)",
  "function hasAchievement(address player, uint256 achievementId) view returns (bool)",
  "event AchievementClaimed(address indexed player, uint256 indexed achievementId, uint256 tokenId)",
];

// Achievement metadata (matching contract initialization)
export const ACHIEVEMENT_EMOJIS: Record<string, string> = {
  egg: "🐣",
  chef: "👨‍🍳",
  gamepad: "🎮",
  star: "🌟",
  dress: "👗",
  gem: "💎",
  butterfly: "🦋",
  crown: "👑",
};
