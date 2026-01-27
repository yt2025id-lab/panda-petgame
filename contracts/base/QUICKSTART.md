# ⚡ Quick Start - Deploy in 5 Minutes

Fastest way to deploy PandaNFT contract.

---

## 🚀 1-Minute Setup

```bash
# 1. Go to contracts directory
cd /Users/macbookair/Documents/panda-app/contracts/base

# 2. Create .env file
cp .env.example .env

# 3. Edit .env and add your private key
nano .env
# or
open .env
```

**In .env, add:**
```
PRIVATE_KEY=your_metamask_private_key_here
```

---

## 🎯 Get Your Private Key

1. Open MetaMask
2. Click 3 dots → Account Details
3. Click "Show Private Key"
4. Enter password
5. Copy key (remove "0x" prefix if present)

---

## 💰 Get Test ETH

Visit: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

---

## 🚀 Deploy (2 Commands)

```bash
# 1. Deploy contract
npx hardhat run scripts/deploy.js --network baseSepolia

# 2. Copy contract address from output, then add to .env:
# PANDA_NFT_ADDRESS=0xYourAddress

# 3. Create cosmetics
npx hardhat run scripts/create-cosmetics.js --network baseSepolia
```

---

## 🌐 Update Frontend

```bash
cd ../../web

# Create .env.local
echo "NEXT_PUBLIC_PANDA_NFT_ADDRESS=0xYourContractAddress" > .env.local

# Restart dev server
npm run dev
```

---

## ✅ Done!

Visit http://localhost:3000 and create your first Panda! 🐼

Need help? See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guide.
