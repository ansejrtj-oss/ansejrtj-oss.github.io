# 암호화폐 가격 조회 웹사이트 제작 과정

## 1. GitHub 계정 생성
GitHub에서 계정을 생성하였다.

## 2. GitHub Pages Repository 생성
ansejrtj-oss.github.io 저장소를 만들었다.

## 3. CoinGecko API 확인
다음 API를 사용하였다.
https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd

## 4. HTML 파일 작성
index.html 파일을 만들고 표를 작성하였다.

## 5. JavaScript fetch() 사용
fetch()를 이용하여 비트코인과 이더리움 가격을 가져왔다.

## 6. 자동 업데이트 구현
setInterval()을 사용하여 10초마다 가격이 갱신되도록 만들었다.
