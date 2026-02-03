// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PandaAchievements is ERC721, Ownable {
    struct Achievement {
        uint256 id;
        string name;
        string description;
        string category;
        string imageEmoji;
    }

    uint256 public nextTokenId;
    uint256 public nextAchievementId;

    mapping(uint256 => Achievement) public achievements; // achievementId => Achievement
    mapping(address => mapping(uint256 => bool)) public hasAchievement; // player => achievementId => bool
    mapping(uint256 => uint256) public tokenAchievement; // tokenId => achievementId

    event AchievementCreated(uint256 indexed achievementId, string name, string category);
    event AchievementClaimed(address indexed player, uint256 indexed achievementId, uint256 tokenId);

    constructor() ERC721("Panda Achievements", "PACHV") Ownable(msg.sender) {
        // Initialize achievements
        _createAchievement("First Steps", "Create your first panda", "getting_started", "egg");
        _createAchievement("Master Chef", "Feed your panda 50 times", "feeding", "chef");
        _createAchievement("Game Master", "Score 500 total in minigames", "gaming", "gamepad");
        _createAchievement("Evolved", "Reach panda level 5", "evolution", "star");
        _createAchievement("Fashion Icon", "Equip 3 different cosmetics", "cosmetic", "dress");
        _createAchievement("IDRX Holder", "Claim IDRX from faucet", "economy", "gem");
        _createAchievement("Social Butterfly", "Visit 5 friends", "social", "butterfly");
        _createAchievement("Legend", "Reach panda level 30", "evolution", "crown");
    }

    function _createAchievement(
        string memory name,
        string memory description,
        string memory category,
        string memory imageEmoji
    ) internal {
        achievements[nextAchievementId] = Achievement({
            id: nextAchievementId,
            name: name,
            description: description,
            category: category,
            imageEmoji: imageEmoji
        });
        emit AchievementCreated(nextAchievementId, name, category);
        nextAchievementId++;
    }

    // Claim achievement - anyone can claim if they haven't already
    function claimAchievement(uint256 achievementId) external {
        require(achievementId < nextAchievementId, "Achievement does not exist");
        require(!hasAchievement[msg.sender][achievementId], "Already claimed");

        hasAchievement[msg.sender][achievementId] = true;

        uint256 tokenId = nextTokenId;
        _safeMint(msg.sender, tokenId);
        tokenAchievement[tokenId] = achievementId;
        nextTokenId++;

        emit AchievementClaimed(msg.sender, achievementId, tokenId);
    }

    // Get all achievements for a player
    function getPlayerAchievements(address player) external view returns (bool[] memory) {
        bool[] memory result = new bool[](nextAchievementId);
        for (uint256 i = 0; i < nextAchievementId; i++) {
            result[i] = hasAchievement[player][i];
        }
        return result;
    }

    // Get achievement details
    function getAchievement(uint256 achievementId) external view returns (
        string memory name,
        string memory description,
        string memory category,
        string memory imageEmoji
    ) {
        Achievement memory a = achievements[achievementId];
        return (a.name, a.description, a.category, a.imageEmoji);
    }

    function getTotalAchievements() external view returns (uint256) {
        return nextAchievementId;
    }

    // ===== Soulbound: Override transfer to prevent transfers =====
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        // Allow minting (from == address(0)) but prevent transfers
        require(from == address(0), "Soulbound: non-transferable");
        return super._update(to, tokenId, auth);
    }

    // Owner can add new achievements
    function createAchievement(
        string memory name,
        string memory description,
        string memory category,
        string memory imageEmoji
    ) external onlyOwner {
        _createAchievement(name, description, category, imageEmoji);
    }
}
