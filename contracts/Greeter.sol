//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./accessContract.sol";

contract Greeter is AccessContract {

    string public greeting;

    constructor() AccessContract(msg.sender) {
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreetingAsUser(string memory _greeting) public ichiGuard() returns(bool value) {
        greeting = _greeting;
        value = true;
    }

    function setGreetingAsAdmin(string memory _greeting, uint256 _code) public ichiGuard() returns(bool value) {
        if (_code == 4) {
            greeting = _greeting;
        }
        value = true;
    }
}
