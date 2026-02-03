// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockIDRX is ERC20 {
    uint256 public constant FAUCET_AMOUNT = 10_000 * 10**2; // IDRX has 2 decimals
    mapping(address => uint256) public lastFaucetClaim;

    constructor() ERC20("Indonesian Rupiah Token", "IDRX") {
        // Mint 1 billion IDRX to deployer for marketplace funding
        _mint(msg.sender, 1_000_000_000 * 10**decimals());
    }

    function decimals() public pure override returns (uint8) {
        return 2; // IDRX uses 2 decimals (like IDR currency)
    }

    // Faucet: anyone can claim 10,000 IDRX every 24 hours
    function faucet() external {
        require(
            block.timestamp >= lastFaucetClaim[msg.sender] + 1 hours,
            "Faucet: wait 1 hour between claims"
        );
        lastFaucetClaim[msg.sender] = block.timestamp;
        _mint(msg.sender, FAUCET_AMOUNT);
    }

    // Check if address can claim faucet
    function canClaimFaucet(address account) external view returns (bool) {
        return block.timestamp >= lastFaucetClaim[account] + 1 hours;
    }

    // Time until next faucet claim (in seconds)
    function timeUntilNextClaim(address account) external view returns (uint256) {
        uint256 nextClaim = lastFaucetClaim[account] + 1 hours;
        if (block.timestamp >= nextClaim) return 0;
        return nextClaim - block.timestamp;
    }
}
