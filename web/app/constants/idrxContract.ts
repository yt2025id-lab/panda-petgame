// MockIDRX contract - deployed to Base Sepolia
// Update this address after running deploy-all.js
export const IDRX_ADDRESS = "0x929d97519f8ae159111dB4CfEe4dE98D00505ea2";

export const IDRX_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function faucet() external",
  "function canClaimFaucet(address account) view returns (bool)",
  "function timeUntilNextClaim(address account) view returns (uint256)",
  "function FAUCET_AMOUNT() view returns (uint256)",
];
