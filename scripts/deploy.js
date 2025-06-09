const { ethers } = require("hardhat");

async function main() {
  const GbeseArts = await ethers.getContractFactory("GbeseArts");
  const nft = await GbeseArts.deploy();
  await nft.waitForDeployment();

  console.log("✅ GbeseArts deployed to:", nft.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
