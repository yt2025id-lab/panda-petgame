// PandaSocial contract - deployed to Base Sepolia
// Update this address after running deploy-all.js
export const SOCIAL_ADDRESS = "0xd89C24e031d08E07B6d48e3083815c0aF9749067";

export const SOCIAL_ABI = [
  "function addFriend(address friend) external",
  "function visitFriend(address friend) external",
  "function sendGift(address to, uint256 giftType) external",
  "function getFriends(address player) view returns (address[])",
  "function getFriendsCount(address player) view returns (uint256)",
  "function canVisit(address visitor, address friend) view returns (bool)",
  "function isFriend(address player, address friend) view returns (bool)",
  "function totalVisitsReceived(address player) view returns (uint256)",
  "event FriendAdded(address indexed player, address indexed friend)",
  "event FriendVisited(address indexed visitor, address indexed friend, uint256 timestamp)",
  "event GiftSent(address indexed from, address indexed to, uint256 giftType, uint256 timestamp)",
];
