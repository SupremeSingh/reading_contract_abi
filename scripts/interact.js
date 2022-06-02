// interact.js

const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.GREETER_ADDRESS;

const contract = require("../artifacts/contracts/Greeter.sol/Greeter.json");
var fs = require('fs'); 

// provider - Alchemy
const alchemyProvider = new ethers.providers.AlchemyProvider(network="rinkeby", API_KEY);

// signer - you
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

// contract instance
const helloWorldContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

async function main() {

    /*
    const message = await helloWorldContract.greeting();
    console.log("The message is: " + message);

    console.log("Updating the message...");
    const tx = await helloWorldContract.setGreeting("this is the new message");
    await tx.wait();

    const newMessage = await helloWorldContract.greeting();
    console.log("The new message is: " + newMessage);
    */

    function contractMetaData(name, mutability, params) {
        this.name = name;
        this.mutability = mutability;
        this.params = params;
      }
    
    var myContract = [];

    // Stripping down ABI for mutable functions
    let mutabilityToIgnore = ["pure", "view", "private"];
    let functioNameToIgnore = ["grantRole", "registerFunctionToAdmin", "registerFunctionWithHeirarchy", "renounceRole", "revokeRole"];

    let contractName = contract["contractName"];

    for (let i=0; i < contract["abi"].length; i++) {
        let type = contract["abi"][i].type;
        let functionName = contract["abi"][i].name;
        let mutability = contract["abi"][i].stateMutability;
        if ((type === "function") && !(mutabilityToIgnore.includes(mutability)) && !(functioNameToIgnore.includes(functionName))) {
            let args = [];
            let numParams = contract["abi"][i].inputs.length;
            if (numParams > 0) {
                for (let j=0; j< numParams; j++) {
                    args.push(contract["abi"][i].inputs[j].type);
                }
            }
            // Add name and params to a struct for this contract 
            myContract.push(new contractMetaData(functionName, mutability, args));
        }
    }

    console.log(myContract);

    for (let i=0; i < myContract.length; i++) {
        let arg = myContract[0].name + "("
        let count = myContract[i].params.length;
        for (let j=0; j < count - 1; j++) {
            arg = arg + myContract[i].params[j] + ",";
        }
        arg = arg + myContract[i].params[count - 1] + ")";

        console.log(`Registering  ${arg}...`);
        const tx = await helloWorldContract.registerFunctionToAdmin(arg);
        await tx.wait();
    }

    /* Writing a new "introspective contract"

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