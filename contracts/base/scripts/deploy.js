const hre = require("hardhat");

async function main() {
  console.log("🐼 Deploying PandaNFT contract to", hre.network.name, "...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy PandaNFT
  console.log("🚀 Deploying PandaNFT contract...");
  const PandaNFT = await hre.ethers.getContractFactory("PandaNFT");
  const pandaNFT = await PandaNFT.deploy();

  await pandaNFT.waitForDeployment();
  const contractAddress = await pandaNFT.getAddress();

  console.log("✅ PandaNFT deployed to:", contractAddress);
  console.log("📋 Transaction hash:", pandaNFT.deploymentTransaction().hash);

  // Wait for a few confirmations
  console.log("\n⏳ Waiting for 5 confirmations...");
  await pandaNFT.deploymentTransaction().wait(5);
  console.log("✅ Confirmed!\n");

  // Get deployer address (contract owner)
  const owner = await pandaNFT.owner();
  console.log("👑 Contract owner:", owner);

  console.log("\n" + "=".repeat(60));
  console.log("📋 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Network:", hre.network.name);
  console.log("Contract Address:", contractAddress);
  console.log("Owner Address:", owner);
  console.log("Block Explorer:", `https://sepolia.basescan.org/address/${contractAddress}`);
  console.log("=".repeat(60));

  console.log("\n📝 Next Steps:");
  console.log("1. Update web/.env.local with:");
  console.log(`   NEXT_PUBLIC_PANDA_NFT_ADDRESS=${contractAddress}`);
  console.log("\n2. Verify contract (optional):");
  console.log(`   npx hardhat verify --network baseSepolia ${contractAddress}`);
  console.log("\n3. Create cosmetics as owner:");
  console.log("   Run: node scripts/create-cosmetics.js");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
