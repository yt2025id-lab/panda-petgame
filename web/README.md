# Panda Pet Game - Frontend

**Next.js web application for the Panda Pet Game on Base blockchain with IDRX integration.**

> Built for the **Base Indonesia Hackathon**

## Tech Stack

| Technology | Version |
|------------|---------|
| Next.js | 16.1.4 |
| React | 19 |
| Tailwind CSS | 4 |
| ethers.js | v5 |
| Web Audio API | Built-in browser |

## Features

- **Panda NFT (ERC721)** - Mint and care for your digital panda on Base Sepolia
- **IDRX Token Economy** - MockIDRX faucet, marketplace purchases, daily rewards
- **5 Minigames** - Ball Shooter, Bamboo Catcher, Dino Jump, Memory Match, Bamboo Slice
- **Onchain Leaderboard** - Scores submitted and ranked onchain
- **Soulbound Badges** - 8 non-transferable achievement badges (ERC721 SBT)
- **Panda Evolution** - 5 visual stages based on level
- **BaseName Integration** - `.base.eth` name resolution in-game
- **Social System** - Add friends, visit pandas, send gifts (onchain)
- **NFT Cosmetics** - Mint and equip cosmetic items
- **Real-time Care** - Feed, wash, sleep, play with stat decay
- **Daily Missions & Streak** - 3 rotating daily missions, login streak with milestone bonuses
- **Sound Effects** - 11 synthesized sounds via Web Audio API (zero external files)
- **Level Up Celebration** - Fullscreen confetti particle animation
- **Idle Behaviors** - Random mood-based animations (yawn, wave, bounce, wiggle, spin, shake)
- **Animated Background** - Parallax clouds (day), twinkling stars & shooting stars (night)
- **Network Guard** - Auto-prompt to switch to Base Sepolia
- **Interactive Tutorial** - Step-by-step onboarding for new players

## Smart Contracts (Base Sepolia)

| Contract | Address |
|----------|---------|
| MockIDRX (ERC20) | `0x929d97519f8ae159111dB4CfEe4dE98D00505ea2` |
| PandaMarketplace | `0x4CE95c95cdB37D116C28A12AFFCb16Bf0523a041` |
| PandaLeaderboard | `0x7705a10EA6e14D184D229A3d2a3A317C8DFD2364` |
| PandaAchievements (SBT) | `0x0a8D4d1FB5B768A78f1f9142393C8c9dD3eEf2a0` |
| PandaSocial | `0xd89C24e031d08E07B6d48e3083815c0aF9749067` |
| PandaNFT (ERC721) | `0xFd7cb65d2F95AF8935bD3947b893ba3032e7Ed6e` |

**7 smart contracts total** (including PandaCosmetic).

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

```env
NEXT_PUBLIC_OPENROUTER_API_KEY=your_key  # For panda AI dialogue
```

## Project Structure

```
app/
├── components/
│   ├── Panda.tsx              # Panda SVG with idle animations
│   ├── GameHeader.tsx         # Header with stats, coins, sound toggle
│   ├── GameBackground.tsx     # Animated background (clouds/stars)
│   ├── ProfileModal.tsx       # Missions, streak, cosmetics
│   ├── DailyCheckIn.tsx       # Daily login bonus modal
│   ├── LevelUpCelebration.tsx # Confetti particle animation
│   ├── SoundToggle.tsx        # Mute/unmute button
│   ├── StatBar.tsx            # Pet stat display bars
│   ├── constant.ts            # Game data, missions, dialogue
│   ├── type.ts                # TypeScript types
│   └── minigames/
│       ├── BallShooter.tsx
│       ├── BambooCatcher.tsx
│       ├── BambooSlice.tsx
│       ├── DinoJump.tsx
│       └── MemoryMatch.tsx
├── hooks/
│   ├── useGameState.ts        # Core game logic, stats, missions, streak
│   └── useSound.ts            # Web Audio API sound synthesizer
├── page.tsx                   # Main game page
├── layout.tsx                 # Root layout
└── globals.css                # Animations and global styles
```

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build with type checking
- `npm start` - Production server
- `npm run lint` - ESLint

---

**Built on Base for the Base Indonesia Hackathon**
