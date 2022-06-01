// interact.js

const API_KEY = process.env.API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const contract = require("../artifacts/contracts/Greeter.sol/Greeter.json");

// provider - Alchemy
const alchemyProvider = new ethers.providers.AlchemyProvider(network="rinkeby", API_KEY);

// signer - you
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);

// contract instance
const helloWorldContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

async function main() {

    // Play with the ABI and see how it works
    console.log(contract);

    const message = await helloWorldContract.greeting();
    console.log("The message is: " + message);

    console.log("Updating the message...");
    const tx = await helloWorldContract.setGreeting("this is the new message");
    await tx.wait();

    const newMessage = await helloWorldContract.greeting();
    console.log("The new message is: " + newMessage);
}

main();