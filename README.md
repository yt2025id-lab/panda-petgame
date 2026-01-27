# 🐼 Panda - Virtual Pet NFT Game on Base

A blockchain-based virtual pet game built on **Base** blockchain using **Solidity** smart contracts.

## 🎮 Game Features

### Core Gameplay
- **Virtual Pet**: Create and care for your Panda NFT
- **Stats System**: Manage Hunger, Health, Fun, Energy, and Hygiene
- **Feeding System**: Buy and feed food to your Panda
- **Mini-games**:
  - ⚽ Ball Shooter
  - 🎋 Bamboo Catcher
- **Cosmetics**: Equip cosmetic items to customize your Panda
- **Missions**: Complete daily missions to earn coins
- **Leveling**: Earn XP and level up your Panda

### Blockchain Features
- **Panda NFT**: ERC721 token with enumerable extension
- **Public Minting**: Anyone can mint their own Panda NFT
- **Cosmetic System**: Shared cosmetic templates (gas-efficient)
- **Equip/Unequip**: Slot-based system for customization
- **On-chain Ownership**: Full NFT ownership on Base

## 🏗️ Project Structure

```
panda-game/
├── contracts/
│   └── base/
│       └── PandaNFT.sol          # Main smart contract
│
├── web/                           # Next.js frontend
│   ├── app/
│   │   ├── components/            # React components
│   │   ├── hooks/
│   │   │   └── evm/              # Blockchain hooks
│   │   ├── constans/
│   │   │   └── contractEvm.ts    # Contract config & ABI
│   │   └── page.tsx              # Main game UI
│   └── package.json
│
└── README.md                      # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MetaMask or compatible Web3 wallet
- Base Sepolia testnet ETH (for testing)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd yeru-app

# Install dependencies
cd web
npm install
```

### Environment Setup

Create `web/.env.local`:

```env
NEXT_PUBLIC_PANDA_NFT_ADDRESS=0xYourDeployedContractAddress
```

### Run Development Server

```bash
cd web
npm run dev
```

Visit `http://localhost:3000` and connect your wallet!

## 📝 Smart Contract

### PandaNFT.sol Features

- **ERC721 Compliance**: Standard NFT implementation
- **ERC721Enumerable**: Query all tokens owned by an address
- **ERC721URIStorage**: Store metadata URIs
- **Public Minting**: No access control for creating Pandas
- **Cosmetic System**:
  - Admin creates cosmetic templates
  - Users can equip/unequip cosmetics
  - Slot-based (category) system
  - No individual cosmetic ownership (shared templates)

### Key Functions

```solidity
// Mint a new Panda (anyone can call)
function mint(string memory tokenURI) external

// Create cosmetic template (admin only)
function createCosmetic(
    string memory category,
    string memory name,
    string memory description,
    string memory rarity
) external onlyOwner

// Equip cosmetic to Panda
function equipCosmetic(uint256 pandaId, uint256 cosmeticId) external

// Unequip cosmetic from Panda
function unequipCosmetic(uint256 pandaId, string memory category) external
```

## 🎨 How Cosmetics Work

Unlike traditional NFT games, cosmetics in Panda are **shared templates**:

1. **Admin** creates cosmetic templates (once)
2. **All users** can equip any cosmetic to their Panda
3. **No minting** required for individual cosmetics
4. **Gas-efficient**: Only updates mapping, no NFT transfers

### Benefits:
- ✅ Lower gas costs for users
- ✅ No need to buy/mint cosmetics
- ✅ Instant access to all cosmetics
- ✅ Simple on-chain logic

## 🔧 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS 4
- **Blockchain**: ethers.js v5
- **State**: React Hooks
- **UI**: Lucide React icons
- **Notifications**: Sonner

### Smart Contracts
- **Language**: Solidity ^0.8.20
- **Standard**: OpenZeppelin ERC721
- **Chain**: Base (EVM-compatible)

## 📦 Deployment

### 1. Deploy Smart Contract

#### Using Remix IDE (Easiest)
1. Open https://remix.ethereum.org
2. Create new file `PandaNFT.sol`
3. Copy code from `contracts/base/PandaNFT.sol`
4. Compile with Solidity 0.8.20
5. Connect MetaMask to Base Sepolia
6. Deploy contract
7. Copy deployed address

#### Using Hardhat
```bash
cd contracts/base
npm init -y
npm install --save-dev hardhat @openzeppelin/contracts
npx hardhat init

# Create deploy script and run:
npx hardhat run scripts/deploy.js --network baseSepolia
```

### 2. Update Environment

```bash
# In web/.env.local
NEXT_PUBLIC_PANDA_NFT_ADDRESS=0x... # Your deployed address
```

### 3. Create Initial Cosmetics (Admin)

As contract owner, create some cosmetics using Remix or Hardhat:

```javascript
await panda.createCosmetic("hat", "Party Hat", "Festive hat", "common");
await panda.createCosmetic("hat", "Crown", "Royal crown", "legendary");
await panda.createCosmetic("shirt", "Cool Shirt", "Casual tee", "common");
await panda.createCosmetic("shirt", "Tuxedo", "Fancy suit", "rare");
await panda.createCosmetic("accessory", "Sunglasses", "Cool shades", "common");
```

### 4. Deploy Frontend

```bash
cd web
npm run build
npm run start

# Or deploy to Vercel
vercel deploy
```

## 🎯 Game Mechanics

### Stats Decay
- **Hunger**: Decreases over time (faster when awake)
- **Energy**: Decreases when awake, increases when sleeping
- **Fun**: Decreases slowly over time
- **Hygiene**: Decreases slowly over time
- **Health**: Decreases when hunger reaches 0

### Earning XP
- Feed: +10 XP
- Play minigames: +20 XP
- Wash: +10 XP
- Pet: +1 XP (occasional)

### Missions
Complete daily missions to earn coins:
- Feed your Panda 5 times
- Play 3 games
- Wash your Panda once
- Reach Level 5
- Pet your Panda 100 times

## 🌐 Base Network

### Testnet (Development)
- **Network**: Base Sepolia
- **Chain ID**: 84532
- **RPC**: https://sepolia.base.org
- **Faucet**: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
- **Explorer**: https://sepolia.basescan.org

### Mainnet (Production)
- **Network**: Base
- **Chain ID**: 8453
- **RPC**: https://mainnet.base.org
- **Explorer**: https://basescan.org

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License

## 🔗 Links

- [Base Documentation](https://docs.base.org)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [ethers.js Documentation](https://docs.ethers.org/v5/)
- [Next.js Documentation](https://nextjs.org/docs)

## 💡 Tips

### For Players
- Keep all stats above 50% for best health
- Play minigames to earn coins and XP quickly
- Complete missions for bonus coins
- Put your Panda to sleep when energy is low

### For Developers
- Contract uses standard OpenZeppelin implementations
- All cosmetics are stored on-chain as mappings
- Frontend uses ethers.js v5 for blockchain interactions
- Type safety with TypeScript throughout

---

**Built with ❤️ on Base**
