// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PandaSocial {
    mapping(address => address[]) public friendsList;
    mapping(address => mapping(address => bool)) public isFriend;
    mapping(address => mapping(address => uint256)) public lastVisit;
    mapping(address => uint256) public totalVisitsReceived;

    event FriendAdded(address indexed player, address indexed friend);
    event FriendVisited(address indexed visitor, address indexed friend, uint256 timestamp);
    event GiftSent(address indexed from, address indexed to, uint256 giftType, uint256 timestamp);

    // Add a friend
    function addFriend(address friend) external {
        require(friend != msg.sender, "Cannot add yourself");
        require(!isFriend[msg.sender][friend], "Already friends");

        friendsList[msg.sender].push(friend);
        isFriend[msg.sender][friend] = true;

        emit FriendAdded(msg.sender, friend);
    }

    // Visit a friend (once per hour per friend)
    function visitFriend(address friend) external {
        require(friend != msg.sender, "Cannot visit yourself");
        require(
            block.timestamp >= lastVisit[msg.sender][friend] + 1 hours,
            "Wait before visiting again"
        );

        lastVisit[msg.sender][friend] = block.timestamp;
        totalVisitsReceived[friend]++;

        emit FriendVisited(msg.sender, friend, block.timestamp);
    }

    // Send a gift (just emits event, game handles the logic)
    function sendGift(address to, uint256 giftType) external {
        require(to != msg.sender, "Cannot gift yourself");
        emit GiftSent(msg.sender, to, giftType, block.timestamp);
    }

    // View functions
    function getFriends(address player) external view returns (address[] memory) {
        return friendsList[player];
    }

    function getFriendsCount(address player) external view returns (uint256) {
        return friendsList[player].length;
    }

    function canVisit(address visitor, address friend) external view returns (bool) {
        return block.timestamp >= lastVisit[visitor][friend] + 1 hours;
    }
}
