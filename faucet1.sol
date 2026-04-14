// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BasicStaking {
    // 각 주소별 스테이킹한 금액 저장
    mapping(address => uint256) public stakedBalance;

    // 스테이킹 이벤트
    event Staked(address indexed user, uint256 amount);

    // 출금 이벤트
    event Withdrawn(address indexed user, uint256 amount);

    // ETH를 스테이킹하는 함수
    function stake() public payable {
        require(msg.value > 0, "Must stake more than 0 ETH");

        stakedBalance[msg.sender] += msg.value;

        emit Staked(msg.sender, msg.value);
    }

    // 스테이킹한 ETH를 출금하는 함수
    function withdraw(uint256 amount) public {
        require(amount > 0, "Withdraw amount must be greater than 0");
        require(stakedBalance[msg.sender] >= amount, "Insufficient staked balance");

        stakedBalance[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);

        emit Withdrawn(msg.sender, amount);
    }

    // 자신의 스테이킹 잔액 조회
    function getMyStake() public view returns (uint256) {
        return stakedBalance[msg.sender];
    }

    // 컨트랙트 전체 잔액 조회
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
