
    //SPDX-License-Identifier: Unlicense
    pragma solidity ^0.8.0;

    import "hardhat/console.sol";

    contract GreeterIntrospect {
    string public greeting;

    constructor(string memory _greeting) {
        console.log("Deploying a Greeter with greeting:", _greeting);
        greeting = _greeting;
    }
    