const hre = require("hardhat");

async function main() {

  // const AccessContract = await hre.ethers.getContractFactory("AccessContract");
  // const accessContract = await AccessContract.deploy(process.env.PUBLIC_KEY);

  // await accessContract.deployed();

  // console.log("accessControl deployed to:", accessContract.address);

  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy();

  await greeter.deployed();

  console.log("Greeter deployed to:", greeter.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
