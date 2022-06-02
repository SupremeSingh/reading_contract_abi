//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Greeter {
    string public greeting;

    constructor(string memory _greeting) {
        console.log("Deploying a Greeter with greeting:", _greeting);
        greeting = _greeting;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreetingAsUser(string memory _greeting) public returns(bool value) {
        greeting = _greeting;
        value = true;
    }

    function setGreetingAsAdmin(string memory _greeting, uint256 _code) public returns(bool value) {
        if (_code == 4) {
            greeting = _greeting;
        }
        value = true;
    }
}
