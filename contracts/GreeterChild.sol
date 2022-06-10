//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Greeter.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract GreeterChild is Greeter, ERC721 {

    constructor() Greeter() ERC721("MyCollectible", "MCO"){
    }

    function setGreetingAsHigherAdmin(string memory _greeting, uint256 _code) public returns(bool value) {
        if (_code == 5) {
            greeting = _greeting;
        }
        value = true;
    }

    function deleteGreeting(uint256 _code) public returns(bool value) {
        if (_code == 6) {
            greeting = "";
        }
        value = true;
    }
}
