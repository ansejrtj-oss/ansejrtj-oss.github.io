require("dotenv").config();
const https = require("https");

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const INFURA_URL = `https://mainnet.infura.io/v3/${INFURA_API_KEY}`;

function sendJsonRpcRequest(method, params = []) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            jsonrpc: "2.0",
            method: method,
            params: params,
            id: 1
        });

        const url = new URL(INFURA_URL);

        const options = {
            hostname: url.hostname,
            path: url.pathname,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = "";

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                try {
                    const json = JSON.parse(data);

                    if (json.error) {
                        reject(new Error(json.error.message));
                        return;
                    }

                    resolve(json.result);
                } catch (err) {
                    reject(err);
                }
            });
        });

        req.on("error", (err) => {
            reject(err);
        });

        req.write(postData);
        req.end();
    });
}

async function main() {
    try {
        if (!INFURA_API_KEY) {
            throw new Error(".env 파일에 INFURA_API_KEY가 설정되지 않았습니다.");
        }

        // 1) 최신 블록 번호 조회
        const latestBlockHex = await sendJsonRpcRequest("eth_blockNumber");
        const latestBlockNumber = parseInt(latestBlockHex, 16);

        // 2) 해당 블록 상세 조회
        const blockData = await sendJsonRpcRequest("eth_getBlockByNumber", [
            latestBlockHex,
            true
        ]);

        const transactionCount = blockData.transactions.length;

        console.log("최신 이더리움 블록 번호:", latestBlockNumber);
        console.log("해당 블록의 트랜잭션 개수:", transactionCount);
    } catch (error) {
        console.error("오류 발생:", error.message);
    }
}

main();
