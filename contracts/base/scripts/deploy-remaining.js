const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

  // Already deployed
  const idrxAddress = "0x929d97519f8ae159111dB4CfEe4dE98D00505ea2";
  const marketplaceAddress = "0x4CE95c95cdB37D116C28A12AFFCb16Bf0523a041";

  // Fund marketplace with IDRX
  console.log("\n--- Funding Marketplace ---");
  const mockIDRX = await ethers.getContractAt("MockIDRX", idrxAddress);
  const marketplace = await ethers.getContractAt("PandaMarketplace", marketplaceAddress);
  const fundAmount = ethers.parseUnits("100000000", 2); // 100M IDRX
  const approveTx = await mockIDRX.approve(marketplaceAddress, fundAmount);
  await approveTx.wait();
  console.log("Approved IDRX");
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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
