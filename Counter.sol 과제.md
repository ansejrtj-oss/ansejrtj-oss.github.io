Blockchain Solidity Practice

이 문서는 Solidity 실습으로 작성한 스마트 컨트랙트들을 정리한 파일이다.
구성은 다음과 같다.

HelloWorld 기본 버전
HelloWorld 확장 버전
Counter
CounterNumber
Faucet
1. HelloWorld 기본 버전

가장 기본적인 형태의 문자열 저장 스마트 컨트랙트이다.
greet 상태 변수를 public으로 선언하여 외부에서도 바로 값을 확인할 수 있다.

코드
pragma solidity ^0.8.26;

contract HelloWorld {
string public greet = "Hello World";
}

파일명
SendToTA.sol

2. HelloWorld 확장 버전

기본 HelloWorld를 확장한 버전이다.
문자열을 private 변수로 저장하고, greet() 함수로 값을 읽고 setGreeting() 함수로 값을 변경할 수 있도록 구현하였다.

코드
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

파일명
SendToTA2.sol

특징

private 상태 변수 사용
함수로 값 조회
문자열 변경 가능
3. Counter

숫자를 1씩 증가시키는 카운터 스마트 컨트랙트이다.
컨트랙트를 배포한 사람만 count() 함수를 실행할 수 있도록 owner 권한 제한을 두었다.

코드
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

파일명
Counter.sol

특징

counter 값 저장
owner만 증가 가능
현재 값 조회 가능

실행 화면
<img width="1047" height="675" src="https://github.com/user-attachments/assets/64120e43-c5d9-4bed-999e-0608b7244e33" />

4. CounterNumber

이미 배포된 Counter 컨트랙트와 연결하여 외부 컨트랙트를 호출하는 예제이다.

코드
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface ICounter {
function count() external;
function counter() external view returns (uint256);
}

contract CounterNumber {

ICounter public counterContract = ICounter(0x0fC5025C764cE34df352757e82f7B5c4Df39A836);

function increase() public {  
    counterContract.count();  
}

function getCounter() public view returns (uint256) {  
    return counterContract.counter();  
}  

}

파일명
CounterNumber.sol

특징

인터페이스 사용
외부 컨트랙트 호출
Counter 값 조회 가능

실행 화면
<img width="1220" height="767" src="https://github.com/user-attachments/assets/efacc67f-e275-4a2b-aeb1-49a27215fe9e" />

5. Faucet

Faucet은 일정량의 ETH를 사용자에게 지급하는 스마트 컨트랙트이다.
한 번에 0.01 ETH를 출금할 수 있고, 24시간 제한이 있다.

코드
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

파일명
Faucet.sol

주요 기능

ETH 입금 가능
0.01 ETH 출금
24시간 제한
owner 잔액 회수 가능

실행 화면
<img width="1091" height="780" src="https://github.com/user-attachments/assets/700ab675-8208-43e4-8f5e-c7e07c704d75" />









