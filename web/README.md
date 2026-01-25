# Yeru - Sui DApp Panda Game

A Next.js-based interactive panda tamagotchi game integrated with the Sui blockchain. Players can care for their digital panda, earn coins, and interact with on-chain smart contracts.

## 🎮 Features

- **Interactive Panda Pet**: Feed, play with, and care for your panda
- **Wallet Integration**: Connect with Sui wallets using `@mysten/dapp-kit`
- **Coin System**: Earn and spend coins in the game
- **Missions & Achievements**: Complete challenges for rewards
- **Cosmetics**: Customize your panda with equipped items
- **Real-time Stats**: Hunger, happiness, energy, and hygiene tracking
- **Smart Contract Integration**: Interact with the Yeru Move contract on Sui

## 🏗️ Project Structure

```
app/
├── components/          # UI Components
│   ├── Panda.tsx       # Panda animation and rendering
│   ├── WalletButton.tsx # Sui wallet connect button
│   ├── StatBar.tsx      # Pet stats display
│   ├── constant.ts      # Game constants and data
│   └── type.ts          # TypeScript types
├── hooks/              # React hooks
│   ├── useWalletConnection.ts  # Wallet connection logic
│   ├── useYeruContract.ts       # Contract interactions
│   └── useTransactionUtils.ts   # Transaction helpers
├── providers/          # React Context providers
│   └── SuiProvider.tsx  # Sui wallet provider setup
├── utils/              # Utilities
│   └── suiContract.ts   # Contract utilities and calls
├── layout.tsx          # Root layout with providers
└── page.tsx            # Main game page
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Sui wallet (use [Sui Wallet](https://chrome.google.com/webstore/detail/sui-wallet) or similar)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` file with Sui configuration:

```env
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_YERU_PACKAGE_ID=0x...  # Your deployed contract package ID
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) to play!

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production with type checking
- `npm start` - Start production server
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint

## 📦 Dependencies

- **Next.js 16.1.4** - React framework
- **React 19.2.3** - UI library
- **@mysten/dapp-kit ^0.14.0** - Sui dApp wallet integration
- **@mysten/sui.js ^0.50.0** - Sui JavaScript SDK
- **@suiet/wallet-adapter ^0.2.0** - Wallet adapter
- **Tailwindcss 4** - Utility-first CSS framework
- **Framer Motion 12.29.0** - Animation library

## 🎯 Game Mechanics

### Pet Stats
- **Hunger**: Decreases over time, feed with food items
- **Happiness**: Increases through play, decreases with neglect
- **Energy**: Required for activities, restores through sleep
- **Hygiene**: Decreases over time, restore by washing

### Gameplay
- **Feed**: Use kitchen items to satisfy hunger
- **Play**: Use toys to increase happiness
- **Sleep**: Restore energy
- **Wash**: Maintain hygiene
- **Cosmetics**: Equip items for visual customization
- **Missions**: Complete objectives for coin rewards

## 🔗 Sui Integration

### Smart Contract
The game interacts with the Move smart contract located in `../yeru_contract/`. The contract handles:
- Coin transfers
- Game state management
- Transaction validation

### Key Hooks

**useWalletConnection()**: Manage Sui wallet connection
```typescript
const { address, connected, connectWallet, disconnectWallet } = useWalletConnection();
```

**useYeruContract()**: Interact with the smart contract
```typescript
const { executeTransaction, queryGameState } = useYeruContract();
```

### Environment Variables

- `NEXT_PUBLIC_SUI_NETWORK` - Network (testnet, mainnet, devnet)
- `NEXT_PUBLIC_YERU_PACKAGE_ID` - Deployed contract package ID

## 🎨 Styling

This project uses:
- **Tailwindcss 4** for responsive utility styles
- **Framer Motion** for smooth animations and transitions
- **CSS Modules** for component-specific styles

## 🧪 Development

### Type Checking
```bash
npm run type-check
```

### Building
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Sui Documentation](https://docs.sui.io)
- [Tailwindcss Docs](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is part of the Sui Workshop series.
