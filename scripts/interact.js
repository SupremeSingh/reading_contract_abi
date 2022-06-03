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

async function main() {

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

  let contractName = contract["contractName"];

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
  
  alchemyProvider.on(filter, (e) => {
    let hash = e.data.substring(0,66);
    console.log("RoleID - " + hash);
});

  /* Grant the roles to the super admin here itself -- necessary

  alchemyProvider.on(filter, (e) => {
      let hash = e.data.substring(0,66);
      console.log(`Assigning role to admin  ...`);
      const tx = await greeterInstance.grantRole(
        hash,
        PUBLIC_KEY
      );
      await tx.wait();
  });

  /*

  /* Writing a new "introspective contract" --optional

    var newName = contractName + "Introspect";
    var filepath = "C:/Users/User/Desktop/reading_contract_abi/contracts/" + newName + ".sol"; 

    var fileContent = 
    `
    //SPDX-License-Identifier: Unlicense
    pragma solidity ^0.8.0;

    import "hardhat/console.sol";

    contract ${newName} {
    string public greeting;

    constructor(string memory _greeting) {
        console.log("Deploying a Greeter with greeting:", _greeting);
        greeting = _greeting;
    }
    `; 

    fs.writeFile(filepath, fileContent, (err) => { 
        if (err) throw err; 
        console.log("The file was succesfully saved!"); 
    });  

    */
}

main();
