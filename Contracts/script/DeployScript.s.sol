// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {DecentralizedCredentialSystem} from "../src/Credentify.sol";


contract DeployScript is Script {
    DecentralizedCredentialSystem public dcs;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        dcs = new DecentralizedCredentialSystem();

        vm.stopBroadcast();
    }
}
