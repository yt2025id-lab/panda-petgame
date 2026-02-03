// PandaLeaderboard contract - deployed to Base Sepolia
// Update this address after running deploy-all.js
export const LEADERBOARD_ADDRESS = "0x7705a10EA6e14D184D229A3d2a3A317C8DFD2364";

export const LEADERBOARD_ABI = [
  "function submitScore(uint256 score) external",
  "function updateLevel(uint256 level) external",
  "function getTopPlayers(uint256 count) view returns (tuple(address player, uint256 totalScore, uint256 pandaLevel, uint256 gamesPlayed, uint256 lastUpdated)[])",
  "function getPlayerStats(address player) view returns (uint256 totalScore, uint256 pandaLevel, uint256 gamesPlayed, uint256 rank)",
  "function getTotalPlayers() view returns (uint256)",
  "event ScoreSubmitted(address indexed player, uint256 score, uint256 totalScore)",
  "event LevelUpdated(address indexed player, uint256 level)",
];
