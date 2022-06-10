//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract ICHIIntrospect is AccessControl {
    bytes4[] public functionSigs;

    struct FunctionInfo {
        string description;
        string nameVars;
    }

    mapping(bytes4 => FunctionInfo) public bytesToFunctions;

    event NewRoleCreated(bytes32 _roleId, string _nameAndParameters);

    modifier ichiGuard() {
        bytes32 roleFromMsg = keccak256(abi.encodePacked(msg.sig));
        require(
            hasRole(roleFromMsg, msg.sender),
            string(
                abi.encodePacked(
                    "AccessControl: account ",
                    Strings.toHexString(uint160(msg.sender), 20),
                    " does not have access to ",
                    Strings.toHexString(uint256(roleFromMsg), 32)
                )
            )
        );
        _;
    }

    constructor(address root) {
        _setupRole(DEFAULT_ADMIN_ROLE, root);
    }

    function registerFunction(
        string memory _nameAndParameters,
        string memory _description
    ) internal onlyRole(DEFAULT_ADMIN_ROLE) {
        bytes4 roleSig = bytes4(keccak256(bytes(_nameAndParameters)));
        require(
            bytes(bytesToFunctions[roleSig].nameVars).length *
                bytes(bytesToFunctions[roleSig].description).length ==
                0,
            "This function has been registered already"
        );

        functionSigs.push(roleSig);
        bytesToFunctions[roleSig] = FunctionInfo(
            _description,
            _nameAndParameters
        );
        bytes32 newRoleId = keccak256(abi.encodePacked(roleSig));

        emit NewRoleCreated(newRoleId, _nameAndParameters);
    }
}
