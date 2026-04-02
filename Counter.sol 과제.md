
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
pragma solidity ^0.8.26;

contract HelloWorld {
    string public greet = "Hello World";
}


---->>>>  SendToTA.sol



~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract HelloWorld {
    string private _greeting = "Hello, World!";

    function greet() public view returns (string memory) {
        return _greeting;
    }

    function setGreeting(string memory newGreeting) public {
        _greeting = newGreeting;
    }
}


---->>>> SendToTA2.sol


~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Counter {
    uint256 public counter;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function count() public {
        require(msg.sender == owner, "Not owner");
        counter += 1;
    }

    function get() public view returns (uint256) {
        return counter;
    }
}


Counter.sol

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

// Counter 인터페이스
interface ICounter {
    function count() external;
    function counter() external view returns (uint256);
}

contract CounterNumber {


    ICounter public counterContract = ICounter(0x0fC5025C764cE34df352757e82f7B5c4Df39A836);

    // Counter 증가
    function increase() public {
        counterContract.count();
    }

    // Counter 값 조회
    function getCounter() public view returns (uint256) {
        return counterContract.counter();
    }
}



CounterNumber.sol



~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Faucet {
    uint256 public constant WITHDRAW_AMOUNT = 0.01 ether;
    uint256 public constant WAIT_TIME = 1 days;

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







faucet 제작 완료



   
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~














