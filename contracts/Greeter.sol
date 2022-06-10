//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Greeter {

    string public greeting;

    constructor() {
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
