# 🚀 PandaNFT Deployment Guide

Complete guide to deploy PandaNFT contract to Base Sepolia testnet.

---

## 📋 Prerequisites

Before deploying, make sure you have:

1. **MetaMask Wallet** with Base Sepolia network added
2. **Test ETH** on Base Sepolia (get from faucet)
3. **Node.js 18+** installed

---

## 🌐 Add Base Sepolia to MetaMask

1. Open MetaMask
2. Click network dropdown → "Add Network"
3. Fill in these details:

```
Network Name: Base Sepolia
RPC URL: https://sepolia.base.org
Chain ID: 84532
Currency Symbol: ETH
Block Explorer: https://sepolia.basescan.org
```

---

## 💰 Get Test ETH

Get free test ETH from Base Sepolia faucet:

1. Visit: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
2. Connect your wallet
3. Request test ETH (0.1 ETH per request)
4. Wait ~1-2 minutes for confirmation

---

## ⚙️ Setup Environment

### 1. Export Your Private Key

⚠️ **WARNING: Never share or commit your private key!**

**From MetaMask:**
1. Click on your account icon
2. Account Details → Show Private Key
3. Enter password → Copy private key

### 2. Create `.env` File

```bash
cd /Users/macbookair/Documents/panda-app/contracts/base
cp .env.example .env
```

### 3. Edit `.env` File

Open `.env` and add your private key:

```bash
PRIVATE_KEY=your_private_key_here_without_0x_prefix
```

**Example:**
```bash
PRIVATE_KEY=abcd1234efgh5678ijkl9012mnop3456qrst7890uvwx1234yzab5678cdef
```

---

## 🚀 Deploy Contract

### Step 1: Deploy to Base Sepolia

```bash
cd /Users/macbookair/Documents/panda-app/contracts/base
npx hardhat run scripts/deploy.js --network baseSepolia
```

**Expected Output:**
```
🐼 Deploying PandaNFT contract to baseSepolia ...

📝 Deploying with account: 0xYourAddress
💰 Account balance: 0.1 ETH

🚀 Deploying PandaNFT contract...
✅ PandaNFT deployed to: 0xYourContractAddress
📋 Transaction hash: 0x...

⏳ Waiting for 5 confirmations...
✅ Confirmed!

============================================================
📋 DEPLOYMENT SUMMARY
============================================================
Network: baseSepolia
Contract Address: 0xYourContractAddress
Owner Address: 0xYourAddress
Block Explorer: https://sepolia.basescan.org/address/0xYourContractAddress
============================================================
```

### Step 2: Save Contract Address

Copy the deployed contract address from output.

---

## 🎨 Create Cosmetic Templates

### 1. Add Contract Address to `.env`

Edit `.env` and add:

```bash
PANDA_NFT_ADDRESS=0xYourDeployedContractAddress
```

### 2. Run Cosmetic Creation Script

```bash
npx hardhat run scripts/create-cosmetics.js --network baseSepolia
```

This will create 12 cosmetic templates:
- 4 Hats (Party Hat, Crown, Baseball Cap, Witch Hat)
- 4 Shirts (Cool Tee, Tuxedo, Superhero Cape, Hoodie)
- 4 Accessories (Sunglasses, Bow Tie, Necklace, Headphones)

**Expected Output:**
```
🐼 Creating cosmetic templates...

🎨 Creating 12 cosmetic templates...

[1/12] Creating: Party Hat (hat)...
   ✅ Created! ID: 0 | Rarity: common
[2/12] Creating: Crown (hat)...
   ✅ Created! ID: 1 | Rarity: legendary
...

============================================================
📊 CREATION SUMMARY
============================================================
✅ Successfully created: 12
❌ Failed: 0
📝 Total cosmetics: 12
============================================================
```

---

## 🌐 Update Frontend

### 1. Update Web App Environment

```bash
cd /Users/macbookair/Documents/panda-app/web
```

Edit `web/.env.local` (create if doesn't exist):

```bash
NEXT_PUBLIC_PANDA_NFT_ADDRESS=0xYourDeployedContractAddress
```

### 2. Restart Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

---

## ✅ Verify Deployment

### 1. Check Contract on BaseScan

Visit: https://sepolia.basescan.org/address/0xYourContractAddress

You should see:
- ✅ Contract deployed
- ✅ Transaction history
- ✅ Contract code (will show as bytecode initially)

### 2. Verify Contract Code (Optional)

To make contract readable on BaseScan:

```bash
npx hardhat verify --network baseSepolia 0xYourContractAddress
```

This uploads your source code to BaseScan for transparency.

### 3. Test in Web App

1. Open http://localhost:3000
2. Connect your MetaMask wallet
3. Switch to Base Sepolia network
4. Click "Create Panda NFT"
5. Enter a name → Create
6. Approve transaction in MetaMask
7. Wait for confirmation
8. Your Panda should appear! 🐼

---

## 🎮 Test Full Flow

1. **Create Panda** ✅
2. **Check Stats** (Hunger, Health, etc.) ✅
3. **Feed Panda** (Kitchen menu) ✅
4. **Play Minigames** (Play menu) ✅
5. **Equip Cosmetics** (Cosmetic menu) ✅
6. **Complete Missions** (Coins menu) ✅

---

## 🔧 Troubleshooting

### "Insufficient funds for gas"
- Get more test ETH from faucet
- Check you're on Base Sepolia network

### "Invalid address"
- Make sure you copied full contract address (0x...)
- Check no extra spaces in .env file

### "Only owner can call"
- Make sure you're using same wallet that deployed contract
- Contract owner = deployer address

### Contract not found
- Wait 1-2 minutes after deployment
- Check transaction on BaseScan
- Verify network is Base Sepolia

---

## 🎯 Gas Costs Estimate

| Operation | Gas Cost | USD (at $2000 ETH) |
|-----------|----------|-------------------|
| Deploy Contract | ~3,000,000 gas | ~$0.006 |
| Create Cosmetic | ~150,000 gas | ~$0.0003 |
| Mint Panda | ~200,000 gas | ~$0.0004 |
| Equip Cosmetic | ~80,000 gas | ~$0.00016 |

**Total Setup Cost:** ~$0.01 (deployment + 12 cosmetics)

---

## 📚 Additional Resources

- [Base Documentation](https://docs.base.org)
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [BaseScan Explorer](https://sepolia.basescan.org)

---

## 🔐 Security Best Practices

1. ✅ Never commit `.env` file to git
2. ✅ Never share your private key
3. ✅ Use separate wallet for testnet
4. ✅ Verify all transactions before signing
5. ✅ Keep MetaMask updated

---

## 🚀 Deploy to Mainnet (Production)

**Only after thorough testing on testnet!**

```bash
# Deploy to Base Mainnet
npx hardhat run scripts/deploy.js --network base

# Create cosmetics on mainnet
npx hardhat run scripts/create-cosmetics.js --network base
```

⚠️ **Mainnet uses REAL ETH - costs real money!**

---

**Questions?** Check the main [README.md](../../README.md) or open an issue on GitHub.
