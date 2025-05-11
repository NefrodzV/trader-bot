# Trader Bot

A Node.js that monitors Binance data and sends notifications when certian conditions are met.

## 1. 🚀 Features

1. Fetches live crypto prices from Binance API
2. Monitors a specific trading pair (e.g., BTC/USDT)
3. Sends alerts if price crosses a threshold
4. Configurable intervals (e.g. every second)
5. Lightweight and simple to run

## 2. 🛠️ Requirements

- Node.js v18+ (v23 recommended for native `fetch`)
- Binance API (public access for market data)
- (Optional) Email service like Nodemailer or push notification service

## 3. 📦 Installation

```bash
git clone https://github.com/your-username/crypto-price-bot.git
cd crypto-price-bot
npm install 
```