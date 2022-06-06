//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract AccessContract is AccessControl {
    
    bytes4[] public functionSigs;

    struct functionInfo {
        string description;
        string nameVars;
    }

    mapping(bytes4 => functionInfo) public bytesToFunctions; 

    event newRoleCreated(bytes32 _roleId, string _nameAndParameters, bytes32 _adminRoleId); 

    modifier ichiGuard {
        require(hasRole(keccak256(abi.encodePacked(msg.sig)), msg.sender), "fancy error message");
        _;
    }

    modifier onlyMember(bytes32 roleId) {
        require(hasRole(roleId, msg.sender), "Restricted to members.");
        _;
    }

    constructor (address root) {
        _setupRole(DEFAULT_ADMIN_ROLE, root);
    }

    function registerFunctionToAdmin(string memory _nameAndParameters, string memory _description) public {
        registerFunctionWithHeirarchy(_nameAndParameters, _description, DEFAULT_ADMIN_ROLE);
    }

    function registerFunctionWithHeirarchy(string memory _nameAndParameters, string memory _description, bytes32 _adminRoleId) public onlyMember(_adminRoleId) {
        bytes4 roleSig = bytes4(keccak256(bytes(_nameAndParameters)));
        functionSigs.push(roleSig);
        
        functionInfo memory thisFunctionInfo = functionInfo(_description, _nameAndParameters);
        bytesToFunctions[roleSig] = thisFunctionInfo;
        
        bytes32 newRoleId = keccak256(abi.encodePacked(roleSig));
        emit newRoleCreated(newRoleId, _nameAndParameters, _adminRoleId);

        _setRoleAdmin(newRoleId, _adminRoleId);
    }
    
}