const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

  // 1. Deploy MockIDRX
  console.log("\n--- Deploying MockIDRX ---");
  const MockIDRX = await ethers.getContractFactory("MockIDRX");
  const mockIDRX = await MockIDRX.deploy();
  await mockIDRX.waitForDeployment();
  const idrxAddress = await mockIDRX.getAddress();
  console.log("MockIDRX deployed to:", idrxAddress);

  // 2. Deploy PandaMarketplace
  console.log("\n--- Deploying PandaMarketplace ---");
  const PandaMarketplace = await ethers.getContractFactory("PandaMarketplace");
  const marketplace = await PandaMarketplace.deploy(idrxAddress);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("PandaMarketplace deployed to:", marketplaceAddress);

  // Fund marketplace with IDRX for daily rewards
  console.log("\n--- Funding Marketplace ---");
  const fundAmount = ethers.parseUnits("100000000", 2); // 100M IDRX
  const approveTx = await mockIDRX.approve(marketplaceAddress, fundAmount);
  await approveTx.wait();
  const fundTx = await marketplace.fundMarketplace(fundAmount);
  await fundTx.wait();
  console.log("Marketplace funded with 100M IDRX");

  // 3. Deploy PandaLeaderboard
  console.log("\n--- Deploying PandaLeaderboard ---");
  const PandaLeaderboard = await ethers.getContractFactory("PandaLeaderboard");
  const leaderboard = await PandaLeaderboard.deploy();
  await leaderboard.waitForDeployment();
  const leaderboardAddress = await leaderboard.getAddress();
  console.log("PandaLeaderboard deployed to:", leaderboardAddress);

  // 4. Deploy PandaAchievements
  console.log("\n--- Deploying PandaAchievements ---");
  const PandaAchievements = await ethers.getContractFactory("PandaAchievements");
  const achievements = await PandaAchievements.deploy();
  await achievements.waitForDeployment();
  const achievementsAddress = await achievements.getAddress();
  console.log("PandaAchievements deployed to:", achievementsAddress);

  // 5. Deploy PandaSocial
  console.log("\n--- Deploying PandaSocial ---");
  const PandaSocial = await ethers.getContractFactory("PandaSocial");
  const social = await PandaSocial.deploy();
  await social.waitForDeployment();
  const socialAddress = await social.getAddress();
  console.log("PandaSocial deployed to:", socialAddress);

  // Summary
  console.log("\n========================================");
  console.log("ALL CONTRACTS DEPLOYED SUCCESSFULLY");
  console.log("========================================");
  console.log("MockIDRX:          ", idrxAddress);
  console.log("PandaMarketplace:  ", marketplaceAddress);
  console.log("PandaLeaderboard:  ", leaderboardAddress);
  console.log("PandaAchievements: ", achievementsAddress);
  console.log("PandaSocial:       ", socialAddress);
  console.log("========================================");
  console.log("\nUpdate these addresses in web/app/constants/");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
