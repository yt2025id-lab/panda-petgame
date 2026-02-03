// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PandaMarketplace is Ownable {
    IERC20 public idrxToken;

    // Daily reward
    uint256 public constant DAILY_REWARD = 5_000 * 10**2; // 5000 IDRX (2 decimals)
    mapping(address => uint256) public lastDailyClaim;

    // Coin exchange rate: 1 coin = 100 IDRX (2 decimals)
    uint256 public constant IDRX_PER_COIN = 100;

    // Premium items
    struct PremiumItem {
        uint256 id;
        string name;
        uint256 priceIDRX; // in smallest unit (2 decimals)
        bool active;
    }

    uint256 public nextItemId;
    mapping(uint256 => PremiumItem) public premiumItems;
    mapping(address => mapping(uint256 => bool)) public purchasedItems;

    // Events
    event DailyRewardClaimed(address indexed player, uint256 amount);
    event ItemPurchased(address indexed player, uint256 indexed itemId, uint256 price);
    event CoinsDeposited(address indexed player, uint256 idrxAmount, uint256 coinsReceived);
    event CoinsWithdrawn(address indexed player, uint256 coinsSpent, uint256 idrxReceived);

    constructor(address _idrxToken) Ownable(msg.sender) {
        idrxToken = IERC20(_idrxToken);

        // Initialize premium items
        _addItem("Golden Bamboo", 2000 * 10**2);      // 2000 IDRX
        _addItem("Rainbow Sushi", 1500 * 10**2);       // 1500 IDRX
        _addItem("Diamond Cookie", 3000 * 10**2);      // 3000 IDRX
        _addItem("Legendary Pizza", 5000 * 10**2);     // 5000 IDRX
        _addItem("Panda Crown NFT Skin", 10000 * 10**2); // 10000 IDRX
    }

    function _addItem(string memory name, uint256 price) internal {
        premiumItems[nextItemId] = PremiumItem({
            id: nextItemId,
            name: name,
            priceIDRX: price,
            active: true
        });
        nextItemId++;
    }

    // Claim daily IDRX reward
    function claimDailyIDRX() external {
        require(
            block.timestamp >= lastDailyClaim[msg.sender] + 24 hours,
            "Already claimed today"
        );
        lastDailyClaim[msg.sender] = block.timestamp;

        // Transfer from contract balance
        require(
            idrxToken.transfer(msg.sender, DAILY_REWARD),
            "Transfer failed"
        );

        emit DailyRewardClaimed(msg.sender, DAILY_REWARD);
    }

    // Check if can claim daily reward
    function canClaimDaily(address account) external view returns (bool) {
        return block.timestamp >= lastDailyClaim[account] + 24 hours;
    }

    // Buy premium item with IDRX
    function buyPremiumItem(uint256 itemId) external {
        PremiumItem memory item = premiumItems[itemId];
        require(item.active, "Item not available");
        require(!purchasedItems[msg.sender][itemId], "Already purchased");

        require(
            idrxToken.transferFrom(msg.sender, address(this), item.priceIDRX),
            "Payment failed"
        );

        purchasedItems[msg.sender][itemId] = true;
        emit ItemPurchased(msg.sender, itemId, item.priceIDRX);
    }

    // Deposit IDRX to get in-game coins (1 coin = 100 IDRX)
    function depositIDRX(uint256 idrxAmount) external {
        require(idrxAmount >= IDRX_PER_COIN, "Minimum 1 coin worth");
        uint256 coinsToGive = idrxAmount / IDRX_PER_COIN;

        require(
            idrxToken.transferFrom(msg.sender, address(this), coinsToGive * IDRX_PER_COIN),
            "Transfer failed"
        );

        emit CoinsDeposited(msg.sender, coinsToGive * IDRX_PER_COIN, coinsToGive);
    }

    // Withdraw coins as IDRX (1 coin = 100 IDRX)
    function withdrawIDRX(uint256 coinAmount) external {
        uint256 idrxToGive = coinAmount * IDRX_PER_COIN;

        require(
            idrxToken.transfer(msg.sender, idrxToGive),
            "Transfer failed"
        );

        emit CoinsWithdrawn(msg.sender, coinAmount, idrxToGive);
    }

    // View functions
    function getItem(uint256 itemId) external view returns (
        string memory name, uint256 priceIDRX, bool active, bool purchased
    ) {
        PremiumItem memory item = premiumItems[itemId];
        return (item.name, item.priceIDRX, item.active, purchasedItems[msg.sender][itemId]);
    }

    function getTotalItems() external view returns (uint256) {
        return nextItemId;
    }

    // Owner: fund the marketplace with IDRX for daily rewards
    function fundMarketplace(uint256 amount) external onlyOwner {
        require(
            idrxToken.transferFrom(msg.sender, address(this), amount),
            "Funding failed"
        );
    }

    // Owner: add new item
    function addItem(string memory name, uint256 priceIDRX) external onlyOwner {
        _addItem(name, priceIDRX);
    }
}
