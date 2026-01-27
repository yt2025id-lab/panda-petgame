const hre = require("hardhat");
require("dotenv").config();

async function main() {
  // Get deployed contract address from env
  const CONTRACT_ADDRESS = process.env.PANDA_NFT_ADDRESS;

  if (!CONTRACT_ADDRESS) {
    console.error("❌ Error: PANDA_NFT_ADDRESS not found in .env");
    console.log("Please add: PANDA_NFT_ADDRESS=0xYourContractAddress");
    process.exit(1);
  }

  console.log("🐼 Creating cosmetic templates...\n");
  console.log("📝 Contract Address:", CONTRACT_ADDRESS);

  // Get contract instance
  const PandaNFT = await hre.ethers.getContractFactory("PandaNFT");
  const pandaNFT = PandaNFT.attach(CONTRACT_ADDRESS);

  // Get deployer (must be owner)
  const [deployer] = await hre.ethers.getSigners();
  console.log("👤 Creating as:", deployer.address);

  // Check if deployer is owner
  const owner = await pandaNFT.owner();
  if (owner.toLowerCase() !== deployer.address.toLowerCase()) {
    console.error("❌ Error: You are not the contract owner!");
    console.log("Owner:", owner);
    console.log("Your address:", deployer.address);
    process.exit(1);
  }

  // Cosmetics to create
  const cosmetics = [
    // Hats
    { category: "hat", name: "Party Hat", description: "Festive party hat", rarity: "common" },
    { category: "hat", name: "Crown", description: "Royal golden crown", rarity: "legendary" },
    { category: "hat", name: "Baseball Cap", description: "Cool baseball cap", rarity: "common" },
    { category: "hat", name: "Witch Hat", description: "Magical witch hat", rarity: "rare" },

    // Shirts
    { category: "shirt", name: "Cool Tee", description: "Casual t-shirt", rarity: "common" },
    { category: "shirt", name: "Tuxedo", description: "Fancy formal suit", rarity: "rare" },
    { category: "shirt", name: "Superhero Cape", description: "Heroic cape", rarity: "legendary" },
    { category: "shirt", name: "Hoodie", description: "Cozy hoodie", rarity: "common" },

    // Accessories
    { category: "accessory", name: "Sunglasses", description: "Cool shades", rarity: "common" },
    { category: "accessory", name: "Bow Tie", description: "Classy bow tie", rarity: "rare" },
    { category: "accessory", name: "Necklace", description: "Shiny necklace", rarity: "rare" },
    { category: "accessory", name: "Headphones", description: "Music lover headphones", rarity: "common" },
  ];

  console.log(`\n🎨 Creating ${cosmetics.length} cosmetic templates...\n`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < cosmetics.length; i++) {
    const cosmetic = cosmetics[i];
    try {
      console.log(`[${i + 1}/${cosmetics.length}] Creating: ${cosmetic.name} (${cosmetic.category})...`);

      const tx = await pandaNFT.createCosmetic(
        cosmetic.category,
        cosmetic.name,
        cosmetic.description,
        cosmetic.rarity
      );

      const receipt = await tx.wait();

      // Extract cosmetic ID from event
      const event = receipt.logs.find(log => {
        try {
          const parsed = pandaNFT.interface.parseLog(log);
          return parsed?.name === 'CosmeticCreated';
        } catch {
          return false;
        }
      });

      if (event) {
        const parsed = pandaNFT.interface.parseLog(event);
        const cosmeticId = parsed.args[0];
        console.log(`   ✅ Created! ID: ${cosmeticId} | Rarity: ${cosmetic.rarity}`);
      } else {
        console.log(`   ✅ Created! (Event not captured)`);
      }

      successCount++;
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
      failCount++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("📊 CREATION SUMMARY");
  console.log("=".repeat(60));
  console.log("✅ Successfully created:", successCount);
  console.log("❌ Failed:", failCount);
  console.log("📝 Total cosmetics:", successCount);
  console.log("=".repeat(60));

  // Get total cosmetics from contract
  try {
    const totalCosmetics = await pandaNFT.getTotalCosmetics();
    console.log("\n🎨 Total cosmetics in contract:", totalCosmetics.toString());
  } catch (error) {
    console.log("\n⚠️  Could not fetch total cosmetics");
  }

  console.log("\n✅ Done! Players can now equip these cosmetics to their Pandas!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
