//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract AccessContract is AccessControl {
    
    modifier ichiGuard {
        require(hasRole(keccak256(abi.encodePacked(msg.sig)), msg.sender), "fancy error message");
        _;
    }

    modifier onlyMember(bytes32 roleId) {
        require(hasRole(roleId, msg.sender), "Restricted to members.");
        _;
    }

    // Use a bytes4 set over here 
    bytes4[] public functionSigs;

    struct functionInfo {
        uint256 index;
        string description;
        string nameVars;
    }

    mapping(bytes4 => functionInfo) public bytesToFunctions; 

    constructor (address root) {
        _setupRole(DEFAULT_ADMIN_ROLE, root);
    }

    // Make indexing more efficient 
    function registerFunctionWithHeirarchy(string memory nameAndParameters, bytes32 adminRoleId) public onlyMember(adminRoleId) {
        bytes4 roleSig = bytes4(keccak256(bytes(nameAndParameters)));
        functionSigs.push(roleSig);

        functionInfo memory thisFunctionInfo = functionInfo(functionSigs.length - 1, "A solidity function goven to any role", nameAndParameters);
        bytesToFunctions[roleSig] = thisFunctionInfo;

        _setRoleAdmin(keccak256(abi.encodePacked(roleSig)), adminRoleId);
    }

    // OnlyAdmin version of ^
    function registerFunctionToAdmin(string memory nameAndParameters) public onlyMember(DEFAULT_ADMIN_ROLE) {
        bytes4 roleSig = bytes4(keccak256(bytes(nameAndParameters)));
        functionSigs.push(roleSig);

        functionInfo memory thisFunctionInfo = functionInfo(functionSigs.length - 1, "A solidity function given only to Admin", nameAndParameters);
        bytesToFunctions[roleSig] = thisFunctionInfo;
        
        _setRoleAdmin(keccak256(abi.encodePacked(roleSig)), DEFAULT_ADMIN_ROLE);
    }

}