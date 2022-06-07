//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./ICHIIntrospect.sol";

contract GreeterIntrospect is ICHIIntrospect {
    constructor() ICHIIntrospect(msg.sender) {
        registerFunction(
            "setGreetingAsAdmin(string,uint256)",
            "This is a test"
        );
        registerFunction("setGreetingAsUser(string)", "This is a test");
    }
}
