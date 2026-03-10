require("dotenv").config();
const { ethers } = require("ethers");

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const INFURA_URL = `https://mainnet.infura.io/v3/${INFURA_API_KEY}`;

async function main() {
    try {
        if (!INFURA_API_KEY) {
            throw new Error(".env 파일에 INFURA_API_KEY가 설정되지 않았습니다.");
        }

        // Infura에 연결
        const provider = new ethers.JsonRpcProvider(INFURA_URL);

        // 최신 블록 번호 조회
        const latestBlockNumber = await provider.getBlockNumber();

        // 해당 블록 정보 조회
        const block = await provider.getBlock(latestBlockNumber);

        // 트랜잭션 개수 계산
        const transactionCount = block.transactions.length;

        console.log("최신 이더리움 블록 번호:", latestBlockNumber);
        console.log("해당 블록의 트랜잭션 개수:", transactionCount);
    } catch (error) {
        console.error("오류 발생:", error.message);
    }
}

main();
