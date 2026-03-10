# Infura를 이용한 Ethereum 블록 정보 조회

## 1. 프로젝트 설명

이 프로젝트는 **Infura API**를 이용하여 Ethereum 블록체인에서 **최신 블록 번호와 해당 블록의 트랜잭션 개수**를 조회하는 프로그램입니다.

프로젝트에서는 두 가지 방식으로 동일한 기능을 구현하여 비교합니다.

1. **Raw JSON-RPC 방식**
   JSON-RPC 요청을 직접 작성하여 Infura 서버에 요청을 보내는 방식
   → `jsonrpc.js`

2. **ethers.js 라이브러리 방식**
   ethers.js 라이브러리를 사용하여 Ethereum 네트워크와 통신하는 방식
   → `ethers-version.js`

이 프로젝트의 목적은 **블록체인 데이터를 조회하는 두 가지 방법(JSON-RPC 직접 호출 vs 라이브러리 사용)을 비교하고 이해하는 것**입니다.

---

## 2. 의존성 설치 방법

먼저 컴퓨터에 **Node.js**가 설치되어 있어야 합니다.

프로젝트 폴더에서 아래 명령어를 실행하여 필요한 라이브러리를 설치합니다.

```
npm install
```

또는 다음 명령어로 직접 설치할 수 있습니다.

```
npm install dotenv ethers
```

설치되는 주요 라이브러리

* **dotenv** : `.env` 파일에서 환경 변수를 불러오기 위한 라이브러리
* **ethers** : Ethereum 블록체인과 쉽게 상호작용하기 위한 JavaScript 라이브러리

---

## 3. .env 파일 설정 방법

프로젝트 폴더에 `.env` 파일을 생성합니다.

그리고 Infura에서 발급받은 **API Key(Project ID)** 를 아래와 같이 입력합니다.

```
INFURA_API_KEY=여기에_본인의_Infura_API_Key
```

예시

```
INFURA_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

이 API Key는 **Infura 서버를 통해 Ethereum 네트워크에 접속하기 위해 사용됩니다.**

---

## 4. 프로그램 실행 방법

### JSON-RPC 방식 실행

다음 명령어를 실행합니다.

```
node jsonrpc.js
```

이 프로그램은 JSON-RPC 요청을 직접 생성하여 Infura 서버에 보내고 다음 정보를 가져옵니다.

* 최신 Ethereum 블록 번호
* 해당 블록의 트랜잭션 개수

---

### ethers.js 방식 실행

다음 명령어를 실행합니다.

```
node ethers-version.js
```

이 프로그램은 **ethers.js 라이브러리**를 사용하여 같은 정보를 더 간단한 코드로 조회합니다.

---

## 실행 결과 예시

```
최신 이더리움 블록 번호: 22019321
해당 블록의 트랜잭션 개수: 173
```

---

## 프로젝트 구조

```
crypto_project
│
├ jsonrpc.js
├ ethers-version.js
├ package.json
├ .env
├ node_modules
└ README.md
```

---

## 작성자

이름: (본인 이름)
과목: 블록체인 프로그래밍
