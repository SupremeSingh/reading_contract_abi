const contract = require("../artifacts/contracts/Greeter.sol/Greeter.json");
var diff = require('deep-diff').diff;
var fs = require("fs");

async function main() {

  var differences = diff(parentContract1, contract);

  let registerBlock = "";
  let mutabilityToIgnore = ["pure", "view", "private"];
  let functioNameToIgnore = [
    "grantRole",
    "registerFunction",
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
      registerBlock += "registerFunction('" + arg + "', 'This is a test');" + "\n";
    }
  }

  // Writing the new introspective contract to a file

  var newName = contractName + "Introspect";
  var filepath =
    "C:/Users/User/Desktop/reading_contract_abi/contracts/" + newName + ".sol";

  var fileContent = `
    //SPDX-License-Identifier: Unlicense
    pragma solidity ^0.8.0;
    
    import "hardhat/console.sol";
    import "./ICHIIntrospect.sol";
    
    contract ${newName} is ICHIIntrospect {
    
        constructor() ICHIIntrospect(msg.sender) {
            ${registerBlock}
        }
    }
    `;

  fs.writeFile(filepath, fileContent, (err) => {
    if (err) throw err;
    console.log("The file was succesfully saved!");
  });
}

main();
