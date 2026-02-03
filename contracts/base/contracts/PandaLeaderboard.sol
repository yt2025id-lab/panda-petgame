// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PandaLeaderboard {
    struct LeaderboardEntry {
        address player;
        uint256 totalScore;
        uint256 pandaLevel;
        uint256 gamesPlayed;
        uint256 lastUpdated;
    }

    LeaderboardEntry[] public entries;
    mapping(address => uint256) public playerIndex; // 1-indexed (0 = no entry)

    event ScoreSubmitted(address indexed player, uint256 score, uint256 totalScore);
    event LevelUpdated(address indexed player, uint256 level);

    function submitScore(uint256 score) external {
        if (playerIndex[msg.sender] == 0) {
            entries.push(LeaderboardEntry({
                player: msg.sender,
                totalScore: score,
                pandaLevel: 1,
                gamesPlayed: 1,
                lastUpdated: block.timestamp
            }));
            playerIndex[msg.sender] = entries.length; // 1-indexed
        } else {
            uint256 idx = playerIndex[msg.sender] - 1;
            entries[idx].totalScore += score;
            entries[idx].gamesPlayed += 1;
            entries[idx].lastUpdated = block.timestamp;
        }

        emit ScoreSubmitted(msg.sender, score, _getPlayerEntry(msg.sender).totalScore);
    }

    function updateLevel(uint256 level) external {
        if (playerIndex[msg.sender] == 0) {
            entries.push(LeaderboardEntry({
                player: msg.sender,
                totalScore: 0,
                pandaLevel: level,
                gamesPlayed: 0,
                lastUpdated: block.timestamp
            }));
            playerIndex[msg.sender] = entries.length;
        } else {
            uint256 idx = playerIndex[msg.sender] - 1;
            entries[idx].pandaLevel = level;
            entries[idx].lastUpdated = block.timestamp;
        }

        emit LevelUpdated(msg.sender, level);
    }

    function _getPlayerEntry(address player) internal view returns (LeaderboardEntry memory) {
        require(playerIndex[player] != 0, "Player not found");
        return entries[playerIndex[player] - 1];
    }

    // View: get top N players sorted by total score (off-chain sorting recommended for large N)
    function getTopPlayers(uint256 count) external view returns (LeaderboardEntry[] memory) {
        uint256 len = entries.length;
        if (count > len) count = len;

        // Copy and sort (simple insertion sort for on-chain - fine for small leaderboards)
        LeaderboardEntry[] memory sorted = new LeaderboardEntry[](len);
        for (uint256 i = 0; i < len; i++) {
            sorted[i] = entries[i];
        }

        for (uint256 i = 1; i < len; i++) {
            LeaderboardEntry memory key = sorted[i];
            uint256 j = i;
            while (j > 0 && sorted[j - 1].totalScore < key.totalScore) {
                sorted[j] = sorted[j - 1];
                j--;
            }
            sorted[j] = key;
        }

        // Return top N
        LeaderboardEntry[] memory result = new LeaderboardEntry[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = sorted[i];
        }
        return result;
    }

    function getPlayerStats(address player) external view returns (
        uint256 totalScore, uint256 pandaLevel, uint256 gamesPlayed, uint256 rank
    ) {
        if (playerIndex[player] == 0) {
            return (0, 0, 0, 0);
        }
        LeaderboardEntry memory entry = entries[playerIndex[player] - 1];

        // Calculate rank
        uint256 playerRank = 1;
        for (uint256 i = 0; i < entries.length; i++) {
            if (entries[i].totalScore > entry.totalScore) {
                playerRank++;
            }
        }

        return (entry.totalScore, entry.pandaLevel, entry.gamesPlayed, playerRank);
    }

    function getTotalPlayers() external view returns (uint256) {
        return entries.length;
    }
}
