// SPDX-License-Identifier: MIT pragma solidity ^0.8.26;

interface ICounter { function count() external; function counter() external view returns (uint256); }

contract CounterNumber {

ICounter public counterContract = ICounter(0x0fC5025C764cE34df352757e82f7B5c4Df39A836);

function increase() public {
counterContract.count();
}

function getCounter() public view returns (uint256) {
return counterContract.counter();
}

}
