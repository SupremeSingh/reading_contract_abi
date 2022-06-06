//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract ICHIGuard is AccessControl {
    
    bytes4[] public functionSigs;

    struct FunctionInfo {
        string description;
        string nameVars;
    }

    mapping(bytes4 => functionInfo) public bytesToFunctions; 

    event NewRoleCreated(bytes32 _roleId, string _nameAndParameters, bytes32 _adminRoleId); 

/**
Think about raising a meaningful error that presents the context for both user and developer. 
Given that there are function descriptions on hand, this could be human-readable. Ideally, 
there is an indication that takes someone to the part of the contract that called this
modifier to revert. 

For example:

    function _checkRole(bytes32 role, address account) internal view virtual {
        if (!hasRole(role, account)) {
            revert(
                string(
                    abi.encodePacked(
                        "AccessControl: account ",
                        Strings.toHexString(uint160(account), 20),
                        " is missing role ",
                        Strings.toHexString(uint256(role), 32)
                    )
                )
            );
        }
    }

*/


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

// No need to specific admin role. DEFAULT_ADMIN_ROLE will be acceptable most of the time. Can be revised post-deployment. 

    function registerFunctionWithHeirarchy(string memory _nameAndParameters, string memory _description /*, bytes32 _adminRoleId */) public onlyMember(_adminRoleId) {
        bytes4 roleSig = bytes4(keccak256(bytes(_nameAndParameters)));
           
        /**
        If you are relying on exclusively on external inputs to set this up, then you have to account for input errors. I think that means
        implementing Sets with a delete capability. 
        
        If you are relying on an append-only, one-time setup, then the only viable solution is to also construct a code generator that is not
        subject to input errors and simply inherit the setup process as a constructor. 
        
        The code doesn't seem to fully commit to either concept. 
        */
     
         // Does not check for duplicates. That can lead to integrity issues in production. 
         
        functionSigs.push(roleSig);
        
        // next two lines can be one (gas)
        functionInfo memory thisFunctionInfo = functionInfo(_description, _nameAndParameters);
        bytesToFunctions[roleSig] = thisFunctionInfo;
        
        bytes32 newRoleId = keccak256(abi.encodePacked(roleSig));
        emit newRoleCreated(newRoleId, _nameAndParameters /*, _adminRoleId */);

        // _setRoleAdmin(newRoleId, _adminRoleId);
    }
    
}
