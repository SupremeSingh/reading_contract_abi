const contract = require("../artifacts/contracts/GreeterChild.sol/GreeterChild.json");
const parentContract1 = require("../artifacts/contracts/ICHIIntrospect.sol/ICHIIntrospect.json");
const parentContract2 = require("../artifacts/contracts/Greeter.sol/Greeter.json");
var fs = require("fs");

let parentContractABISet = [parentContract1.abi, parentContract2.abi];
let parentContractFunctions = [];

let registerBlock = "";
let mutabilityToIgnore = ["pure", "view", "private"];

function functionNameExists(parentContractABISet, functionName) {
  for (let i = 0; i < parentContractABISet.length; i++) {
    for (let j = 0; j < parentContractABISet[i].length; j++) {
      if (parentContractABISet[i][j].name === functionName) {
        parentContractFunctions.push(parentContractABISet[i][j]);
      }
    }
  }
}

async function main() {
  let contractName = contract["contractName"];
  for (let i = 0; i < contract["abi"].length; i++) {
    let type = contract["abi"][i].type;
    let functionName = contract["abi"][i].name;
    let mutability = contract["abi"][i].stateMutability;
    if (
      type === "function" &&
      !mutabilityToIgnore.includes(mutability)
    ) {
      functionNameExists(parentContractABISet, functionName);
      let arg = functionName + "(";
      let numParams = contract["abi"][i].inputs.length;
      if (numParams > 0) {
        for (let j = 0; j < numParams - 1; j++) {
          arg = arg + contract["abi"][i].inputs[j].type + ",";
        }
      }
      arg = arg + contract["abi"][i].inputs[numParams - 1].type + ")";
      registerBlock +=
        "registerFunction('" + arg + "', 'This is a test');" + "\n";
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

  console.log("The following functions wre registered, but have not been guarded ...");
  console.log(parentContractFunctions);

  fs.writeFile(filepath, fileContent, (err) => {
    if (err) throw err;
    console.log("The file was succesfully saved!");
  });
}

main();
