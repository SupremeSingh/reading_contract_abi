const API_KEY = process.env.API_KEY;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const GREETER_ADDRESS = process.env.GREETER_ADDRESS;

const contract = require("../artifacts/contracts/Greeter.sol/Greeter.json");
var fs = require("fs");

const alchemyProvider = new ethers.providers.AlchemyProvider(
  (network = "rinkeby"),
  API_KEY
);

const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

const greeterInstance = new ethers.Contract(
  GREETER_ADDRESS,
  contract.abi,
  signer
);

let globalNonceCounter = 0;

async function grantDefaultRole(roleID) {
  
  console.log("Adding roleID - " + roleID);
  
  // const tx = await greeterInstance.grantRole(roleID, PUBLIC_KEY, { gasLimit: 8000000, nonce: globalNonceCounter});
  // await tx.wait();

  // globalCounter += 1;
  console.log("Role has been added");
}

async function main() {

  globalNonceCounter = await alchemyProvider.getTransactionCount(PUBLIC_KEY);
  console.log("Nonce: " + globalNonceCounter);

  filter = {
    address: GREETER_ADDRESS,
    topics: [ethers.utils.id("newRoleCreated(bytes32,string,bytes32)")],
  };
  

  function contractMetaData(name, mutability, params) {
    this.name = name;
    this.mutability = mutability;
    this.params = params;
  }

  let mutabilityToIgnore = ["pure", "view", "private"];
  let functioNameToIgnore = [
    "grantRole",
    "registerFunctionToAdmin",
    "registerFunctionWithHeirarchy",
    "renounceRole",
    "revokeRole",
  ];

  for (let i = 0; i < contract["abi"].length; i++) {
    let type = contract["abi"][i].type;
    let functionName = contract["abi"][i].name;
    let mutability = contract["abi"][i].stateMutability;
    if (
      type === "function" &&
      !mutabilityToIgnore.includes(mutability) &&
      !functioNameToIgnore.includes(functionName)
    ) {
      let arg = functionName + "(";
      let numParams = contract["abi"][i].inputs.length;
      if (numParams > 0) {
        for (let j = 0; j < numParams - 1; j++) {
          arg = arg + contract["abi"][i].inputs[j].type + ",";
        }
      }
      arg = arg + contract["abi"][i].inputs[numParams - 1].type + ")";

      console.log(`Registering  ${arg}...`);
      const tx = await greeterInstance.registerFunctionToAdmin(
        arg,
        "This is a test"
      );
      await tx.wait();
    }
  }

  alchemyProvider.on(filter, (e) => grantDefaultRole(e.data.substring(0,66)));

}

main();
