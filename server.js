const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const url = require("url");
const { ethers } = require("ethers");

/*
========================================================
여기를 반드시 네 값으로 바꿔야 함
========================================================
*/
const INFURA_MAINNET_URL = "여기에_인퓨라_메인넷_URL";
const INFURA_SEPOLIA_URL = "여기에_인퓨라_세폴리아_URL";
const PRIVATE_KEY = "여기에_세폴리아_서버지갑_개인키";

/*
예시
const INFURA_MAINNET_URL = "https://mainnet.infura.io/v3/네프로젝트ID";
const INFURA_SEPOLIA_URL = "https://sepolia.infura.io/v3/네프로젝트ID";
const PRIVATE_KEY = "0x....";
*/

const mainProvider = new ethers.JsonRpcProvider(INFURA_MAINNET_URL);
const sepoliaProvider = new ethers.JsonRpcProvider(INFURA_SEPOLIA_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, sepoliaProvider);

// 30초 가격 캐시
let cachedPrices = null;
let lastPriceFetchTime = 0;

function sendJson(res, statusCode, obj) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
    });
    res.end(JSON.stringify(obj));
}

function fetchCoinGeckoPrices(callback) {
    const options = {
        hostname: "api.coingecko.com",
        path: "/api/v3/simple/price?ids=bitcoin,ethereum,tether-gold&vs_currencies=usd,krw",
        method: "GET",
        headers: {
            "User-Agent": "node.js"
        }
    };

    const req = https.request(options, (apiRes) => {
        let data = "";

        apiRes.on("data", (chunk) => {
            data += chunk;
        });

        apiRes.on("end", () => {
            try {
                const json = JSON.parse(data);
                callback(null, json);
            } catch (e) {
                callback(e);
            }
        });
    });

    req.on("error", (err) => {
        callback(err);
    });

    req.end();
}

async function serveStaticFile(req, res, pathname) {
    let filePath;

    if (pathname === "/") {
        filePath = path.join(__dirname, "index.html");
    } else {
        filePath = path.join(__dirname, pathname);
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("파일을 찾을 수 없습니다.");
            return;
        }

        let contentType = "text/plain; charset=utf-8";

        if (filePath.endsWith(".html")) contentType = "text/html; charset=utf-8";
        else if (filePath.endsWith(".css")) contentType = "text/css; charset=utf-8";
        else if (filePath.endsWith(".js")) contentType = "application/javascript; charset=utf-8";
        else if (filePath.endsWith(".json")) contentType = "application/json; charset=utf-8";
        else if (filePath.endsWith(".png")) contentType = "image/png";
        else if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) contentType = "image/jpeg";

        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
    });
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // CORS preflight
    if (req.method === "OPTIONS") {
        res.writeHead(204, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        });
        res.end();
        return;
    }

    // 가격 조회
    if (pathname === "/api/prices" && req.method === "GET") {
        const now = Date.now();

        if (cachedPrices && (now - lastPriceFetchTime < 30000)) {
            sendJson(res, 200, cachedPrices);
            return;
        }

        fetchCoinGeckoPrices((err, data) => {
            if (err) {
                sendJson(res, 500, { error: "가격 조회 실패" });
                return;
            }

            cachedPrices = data;
            lastPriceFetchTime = Date.now();
            sendJson(res, 200, data);
        });

        return;
    }

    // 최신 블록 조회
    if (pathname === "/api/block-info" && req.method === "GET") {
        try {
            const blockNumber = await mainProvider.getBlockNumber();
            const block = await mainProvider.getBlock(blockNumber);

            const timestamp = block && block.timestamp
                ? new Date(Number(block.timestamp) * 1000).toLocaleString("ko-KR")
                : "알 수 없음";

            sendJson(res, 200, {
                blockNumber: blockNumber,
                txCount: block && block.transactions ? block.transactions.length : 0,
                gasUsed: block && block.gasUsed ? block.gasUsed.toString() : "0",
                timestamp: timestamp
            });
        } catch (e) {
            sendJson(res, 500, { error: "블록 조회 실패" });
        }
        return;
    }

    // 트랜잭션 조회
    if (pathname === "/api/tx" && req.method === "GET") {
        try {
            const hash = parsedUrl.query.hash;

            if (!hash) {
                sendJson(res, 400, { error: "hash가 필요합니다." });
                return;
            }

            const tx = await mainProvider.getTransaction(hash);

            if (!tx) {
                sendJson(res, 404, { error: "해당 트랜잭션을 찾을 수 없습니다." });
                return;
            }

            sendJson(res, 200, {
                hash: tx.hash,
                from: tx.from,
                to: tx.to,
                valueEth: ethers.formatEther(tx.value),
                blockNumber: tx.blockNumber,
                nonce: tx.nonce
            });
        } catch (e) {
            sendJson(res, 500, { error: "트랜잭션 조회 실패" });
        }
        return;
    }

    // Sepolia ETH 전송
    if (pathname === "/api/send-eth" && req.method === "POST") {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", async () => {
            try {
                const parsed = JSON.parse(body);
                const to = parsed.to;
                const amount = parsed.amount;

                if (!to || !amount) {
                    sendJson(res, 400, { error: "to와 amount가 필요합니다." });
                    return;
                }

                if (!ethers.isAddress(to)) {
                    sendJson(res, 400, { error: "올바른 이더리움 주소가 아닙니다." });
                    return;
                }

                const tx = await wallet.sendTransaction({
                    to: to,
                    value: ethers.parseEther(amount)
                });

                const receipt = await tx.wait();

                sendJson(res, 200, {
                    txHash: tx.hash,
                    blockNumber: receipt.blockNumber
                });
            } catch (e) {
                sendJson(res, 500, { error: "ETH 전송 실패" });
            }
        });

        return;
    }

    // 정적 파일
    serveStaticFile(req, res, pathname);
});

server.listen(5500, () => {
    console.log("서버 실행 중: http://localhost:5500");
});
