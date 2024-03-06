# BINANCE PRICE BOT & GET TOP 10 GAINER

## Install NVM
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.39.0/install.sh | bash
source ~/.profile

## Turn off current session console & reopen
## Install node & npm
nvm install 19
## Check
node -v
npm -v

## Install Dependencies
npm install axios telegraf@3.38

## Add Telegram API Key (get it from @BotFather)
const bot = new Telegraf('**YOUR_TELEGRAM_BOT_API_KEY**');

## Run
node index.js

## Command
p symbol
Ex:
p btc
p bnb

Click update button to update current price
Click Top 10 Gainers button to get list

![price](https://github.com/20dec/binancepricebot/assets/26274812/31e5da05-8a4d-4d06-b08c-f735b61995fc)
