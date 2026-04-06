// SPDX-License-Identifier: MIT pragma solidity ^0.8.26;

contract Faucet { uint256 public constant WITHDRAW_AMOUNT = 0.01 ether; uint256 public constant WAIT_TIME = 1 days;

address public owner;
mapping(address => uint256) public lastWithdrawTime;

event Deposit(address indexed sender, uint256 amount);
event Withdraw(address indexed receiver, uint256 amount);

constructor() {
owner = msg.sender;
}

receive() external payable {
emit Deposit(msg.sender, msg.value);
}

function deposit() public payable {
require(msg.value > 0, "Send some ETH");
emit Deposit(msg.sender, msg.value);
}

function withdraw() public {
require(
block.timestamp >= lastWithdrawTime[msg.sender] + WAIT_TIME,
"Wait 24 hours before next withdrawal"
);

require(  
    address(this).balance >= WITHDRAW_AMOUNT,  
    "Not enough ETH in faucet"  
);

lastWithdrawTime[msg.sender] = block.timestamp;  
payable(msg.sender).transfer(WITHDRAW_AMOUNT);

emit Withdraw(msg.sender, WITHDRAW_AMOUNT);  
}

function getBalance() public view returns (uint256) {
return address(this).balance;
}

function ownerWithdraw(uint256 amount) public {
require(msg.sender == owner, "Not owner");
require(address(this).balance >= amount, "Insufficient balance");

payable(owner).transfer(amount);  
}

}
