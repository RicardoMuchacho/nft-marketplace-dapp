// SPDX-License-Identifier: MIT

pragma solidity >=0.8.24;

import "../lib/openzeppelin-contracts/contracts/interfaces/IERC721.sol";
import {Script} from "forge-std/Script.sol";
import {Marketplace} from "../src/Marketplace.sol";

contract MarketplaceScript is Script {
    function run() external returns (Marketplace) {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(privateKey);

        Marketplace marketplace = new Marketplace();
        vm.stopBroadcast();

        return marketplace;
    }
}
