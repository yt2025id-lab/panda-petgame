# Panda Pet Game

**A virtual pet game built on Base blockchain with IDRX integration.**

Mint your panda NFT, raise it, play minigames, earn IDRX tokens, climb the leaderboard — all onchain.

> Built for the **Base Indonesia Hackathon**

**Live Demo:** `[VERCEL_URL]`

---

## Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Panda NFT** | Mint, name, and care for your own panda (ERC721) |
| 2 | **IDRX Token Economy** | MockIDRX faucet, marketplace purchases, daily rewards |
| 3 | **5 Minigames** | Ball Shooter, Bamboo Catcher, Dino Jump, Memory Match, Bamboo Slice |
| 4 | **Onchain Leaderboard** | Scores submitted and ranked onchain in real-time |
| 5 | **Soulbound Badges** | 8 non-transferable achievement badges (ERC721 SBT) |
| 6 | **Panda Evolution** | 5 visual evolution stages based on level |
| 7 | **BaseName Integration** | `.base.eth` names displayed in-game |
| 8 | **Social System** | Add friends, visit pandas, send gifts — all onchain |
| 9 | **NFT Cosmetics** | Mint, equip/unequip cosmetic items on your panda |
| 10 | **Care System** | Feed, wash, sleep, play — stats decay in real-time |
| 11 | **Daily Missions & Streak** | 3 rotating daily missions, login streak with milestone bonuses |
| 12 | **Sound Effects** | 11 synthesized game sounds (Web Audio API, no external files) |
| 13 | **Level Up Celebration** | Fullscreen confetti particle animation on level up |
| 14 | **Panda Idle Behaviors** | Random mood-based animations (yawn, wave, bounce, wiggle, spin, shake) |
| 15 | **Animated Background** | Parallax clouds (day), twinkling stars & shooting stars (night) |
| 16 | **Network Guard** | Auto-prompts to switch to Base Sepolia + faucet links |
| 17 | **Interactive Tutorial** | Step-by-step onboarding for new players |

---

## How to Test (for Judges)

1. Visit the **Live Demo**
2. Connect **MetaMask** or **Coinbase Wallet**
3. Switch to **Base Sepolia** when prompted (auto-detected)
4. Need testnet ETH? → [Base Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet) | [Alchemy Faucet](https://www.alchemy.com/faucets/base-sepolia)
5. **Create your Panda** — give it a name!
6. Explore: feed it, play minigames, claim IDRX from the in-app faucet
7. Check the leaderboard, earn achievement badges, add friends
8. Come back tomorrow to see daily check-in, streak bonuses, and new daily missions

### What to Look For

- **Tap the panda** — hear click sound, see heart particles, watch idle animations
- **Feed/wash/sleep** — stats change in real-time, sound effects play
- **Play minigames** — scores submitted onchain, sound effects throughout
- **Level up** — confetti celebration with fanfare sound
- **Toggle sleep** — background transitions from clouds to stars with moon
- **Open profile** — daily missions with progress bars, streak counter, permanent missions
- **Mute/unmute** — sound toggle persists across sessions

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4, ethers.js v5 |
| Smart Contracts | Solidity 0.8.20, Hardhat, OpenZeppelin |
| Blockchain | Base Sepolia Testnet |
| Token | IDRX (Indonesian Rupiah Token) — MockIDRX for testing |
| Audio | Web Audio API (synthesized sounds, zero external files) |
| Animations | CSS keyframes + Canvas API (confetti particles) |

---

## Smart Contracts (Base Sepolia)

All contracts are deployed and verified on Base Sepolia:

| Contract | Address | Verified |
|----------|---------|----------|
| MockIDRX (ERC20) | [`0x929d97519f8ae159111dB4CfEe4dE98D00505ea2`](https://sepolia.basescan.org/address/0x929d97519f8ae159111dB4CfEe4dE98D00505ea2) | Basescan |
| PandaMarketplace | [`0x4CE95c95cdB37D116C28A12AFFCb16Bf0523a041`](https://sepolia.basescan.org/address/0x4CE95c95cdB37D116C28A12AFFCb16Bf0523a041) | Basescan |
| PandaLeaderboard | [`0x7705a10EA6e14D184D229A3d2a3A317C8DFD2364`](https://sepolia.basescan.org/address/0x7705a10EA6e14D184D229A3d2a3A317C8DFD2364) | Basescan |
| PandaAchievements (SBT) | [`0x0a8D4d1FB5B768A78f1f9142393C8c9dD3eEf2a0`](https://sepolia.basescan.org/address/0x0a8D4d1FB5B768A78f1f9142393C8c9dD3eEf2a0) | Basescan |
| PandaSocial | [`0xd89C24e031d08E07B6d48e3083815c0aF9749067`](https://sepolia.basescan.org/address/0xd89C24e031d08E07B6d48e3083815c0aF9749067) | Basescan |
| PandaNFT (ERC721) | [`0xFd7cb65d2F95AF8935bD3947b893ba3032e7Ed6e`](https://sepolia.basescan.org/address/0xFd7cb65d2F95AF8935bD3947b893ba3032e7Ed6e) | Sourcify |

**7 smart contracts total** (including PandaCosmetic).

---

## Base Ecosystem Integration

- **Built on Base Sepolia** — all game state lives onchain
- **IDRX token integration** — Indonesian Rupiah stablecoin (MockIDRX for testnet)
- **BaseName resolution** — `.base.eth` reverse lookup displayed in-game
- **ERC721 standard** — Panda NFTs compatible with any NFT marketplace
- **Soulbound tokens** — Non-transferable achievement badges (ERC721 SBT)
- **7 smart contracts** — NFTs, cosmetics, token, marketplace, leaderboard, achievements, social

---

## Architecture

```
┌──────────────────────────────────────┐
│         Next.js 16 Frontend          │
│     React 19 + Tailwind CSS 4        │
│                                      │
│  Sound: Web Audio API (synthesized)  │
│  Animations: CSS + Canvas particles  │
│  State: React hooks + localStorage   │
├──────────────────────────────────────┤
│      Custom Hooks per Contract       │
│   Read:  JsonRpcProvider (public)    │
│   Write: Web3Provider + signer       │
│   ENS override for Base Sepolia      │
├──────────────────────────────────────┤
│        Base Sepolia Testnet          │
│   PandaNFT · PandaCosmetic          │
│   MockIDRX · PandaMarketplace       │
│   PandaLeaderboard                  │
│   PandaAchievements (SBT)           │
│   PandaSocial                       │
└──────────────────────────────────────┘
```

---

## Game Detail

### Pet Care System
- **4 stats**: Hunger, Energy, Fun, Hygiene — all decay in real-time (1s interval)
- **Health**: Drops when hunger hits 0
- **XP & Leveling**: Every action earns XP, level up at 100 XP
- **Evolution**: Panda visually evolves at levels 5, 10, 20, 50

### Minigames (5 total)
| Game | How to Play | Onchain |
|------|-------------|---------|
| Ball Shooter | Tap to shoot balls at goal | Score → Leaderboard |
| Bamboo Catcher | Move basket to catch falling bamboo | Score → Leaderboard |
| Dino Jump | Tap to jump over obstacles (5 types) | Score → Leaderboard |
| Memory Match | Flip cards to find emoji pairs | Score → Leaderboard |
| Bamboo Slice | Swipe to slice bamboo, avoid bombs | Score → Leaderboard |

### Daily Missions & Streak
- **3 daily missions** rotate from a pool of 15 (seeded by date)
- **Login streak** tracks consecutive days with milestone bonuses:
  - 3 days: +100 coins
  - 7 days: +300 coins
  - 14 days: +500 coins
  - 30 days: +1000 coins
- **Daily check-in** awards 50-200 random coins

### Sound System
- 11 synthesized sounds via Web Audio API (click, eat, wash, coin, levelup, success, score, error, gameover, swoosh, button)
- Zero external audio files — all generated in code
- Mute toggle persists across sessions via localStorage

### Panda Behaviors
- **6 idle animations** trigger every 8-15 seconds: wiggle, spin, shake, yawn, wave, bounce
- **Mood-weighted**: hungry panda yawns more, happy panda bounces more, tired panda shakes
- **Interactive**: tap for hearts, feed for chewing animation, wash for bubbles

### Animated Background
- **Day**: 3 parallax cloud layers + butterfly
- **Night**: 40 twinkling stars, crescent moon, shooting stars every 10-20s
- Smooth transition when toggling sleep

---

## Local Development

**Frontend:**
```bash
cd web && npm install && npm run dev
```

**Smart Contracts:**
```bash
cd contracts/base && npm install && npx hardhat compile
```

**Deploy contracts:**
```bash
cd contracts/base && npx hardhat run scripts/deploy.js --network baseSepolia
```

**Environment variables** (web/.env.local):
```env
NEXT_PUBLIC_OPENROUTER_API_KEY=your_key  # For panda dialogue AI
```

---

**Built with care on Base for the Base Indonesia Hackathon**
