# 🐼 Panda Pet Game

**A virtual pet game built on Base blockchain with IDRX integration.**

Mint your panda NFT, raise it, play minigames, earn IDRX tokens, climb the leaderboard — all onchain.

> 🏆 Built for the **Base Indonesia Hackathon**

🔗 **Live Demo:** `[VERCEL_URL]`

---

## ✨ Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Panda NFT** | Mint, name, and care for your own panda (ERC721) |
| 2 | **IDRX Token Economy** | MockIDRX faucet, marketplace purchases, daily rewards |
| 3 | **5 Minigames** | Ball Shooter, Bamboo Catcher, Dino Jump, Memory Match, Bamboo Slice |
| 4 | **Onchain Leaderboard** | Scores submitted and ranked onchain in real-time |
| 5 | **Soulbound Badges** | 8 non-transferable achievement badges (ERC721 SBT) |
| 6 | **Panda Evolution** | 5 visual evolution stages based on level |
| 7 | **BaseName Integration** | `.base.eth` names displayed in-game |
| 8 | **Social System** | Add friends, visit pandas, send gifts |
| 9 | **NFT Cosmetics** | Equip/unequip cosmetic items on your panda |
| 10 | **Care System** | Feed, wash, sleep, play — stats decay over time |
| 11 | **Daily Missions** | Complete missions for coin rewards |
| 12 | **Network Guard** | Auto-prompts to switch to Base Sepolia + faucet links |
| 13 | **Interactive Tutorial** | Step-by-step onboarding for new players |

---

## 🧪 How to Test (for Judges)

1. Visit the **[Live Demo](`[VERCEL_URL]`)**
2. Connect **MetaMask** or **Coinbase Wallet**
3. Switch to **Base Sepolia** when prompted (auto-detected)
4. Need testnet ETH? → [Base Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet) | [Alchemy Faucet](https://www.alchemy.com/faucets/base-sepolia)
5. **Create your Panda** — give it a name!
6. Explore: feed it, play minigames, claim IDRX from the in-app faucet
7. Check the leaderboard, earn achievement badges, add friends

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4, ethers.js v5 |
| Smart Contracts | Solidity 0.8.20, Hardhat, OpenZeppelin |
| Blockchain | Base Sepolia Testnet |
| Token | IDRX (Indonesian Rupiah Token) — MockIDRX for testing |

---

## 📜 Smart Contracts (Base Sepolia)

| Contract | Address |
|----------|---------|
| MockIDRX (ERC20) | [`0x929d97519f8ae159111dB4CfEe4dE98D00505ea2`](https://sepolia.basescan.org/address/0x929d97519f8ae159111dB4CfEe4dE98D00505ea2) |
| PandaMarketplace | [`0x4CE95c95cdB37D116C28A12AFFCb16Bf0523a041`](https://sepolia.basescan.org/address/0x4CE95c95cdB37D116C28A12AFFCb16Bf0523a041) |
| PandaLeaderboard | [`0x7705a10EA6e14D184D229A3d2a3A317C8DFD2364`](https://sepolia.basescan.org/address/0x7705a10EA6e14D184D229A3d2a3A317C8DFD2364) |
| PandaAchievements (SBT) | [`0x0a8D4d1FB5B768A78f1f9142393C8c9dD3eEf2a0`](https://sepolia.basescan.org/address/0x0a8D4d1FB5B768A78f1f9142393C8c9dD3eEf2a0) |
| PandaSocial | [`0xd89C24e031d08E07B6d48e3083815c0aF9749067`](https://sepolia.basescan.org/address/0xd89C24e031d08E07B6d48e3083815c0aF9749067) |

Plus **PandaNFT** and **PandaCosmetic** contracts (7 contracts total).

---

## 🔗 Base Ecosystem Integration

- **Built on Base Sepolia** — all game state lives onchain
- **IDRX token integration** — Indonesian Rupiah stablecoin (MockIDRX for testnet)
- **BaseName resolution** — `.base.eth` reverse lookup displayed in-game
- **ERC721 standard** — Panda NFTs compatible with any NFT marketplace
- **Soulbound tokens** — Non-transferable achievement badges (ERC721 SBT)
- **7 smart contracts** — NFTs, cosmetics, token, marketplace, leaderboard, achievements, social

---

## 🏛️ Architecture

```
┌──────────────────────────────────┐
│        Next.js 16 Frontend       │
│    React 19 + Tailwind CSS 4     │
├──────────────────────────────────┤
│    Custom Hooks per Contract     │
│  Read:  JsonRpcProvider (public) │
│  Write: Web3Provider + signer   │
│  ENS override for Base Sepolia   │
├──────────────────────────────────┤
│       Base Sepolia Testnet       │
│  PandaNFT · PandaCosmetic       │
│  MockIDRX · PandaMarketplace    │
│  PandaLeaderboard               │
│  PandaAchievements (SBT)        │
│  PandaSocial                    │
└──────────────────────────────────┘
```

---

## 🛠️ Local Development

**Frontend:**
```bash
cd web && npm install && npm run dev
```

**Smart Contracts:**
```bash
cd contracts/base && npm install && npx hardhat compile
```

---

**Built with ❤️ on Base for the Base Indonesia Hackathon**
