# BINANCE PRICE BOT & GET TOP 10 GAINER

#Install NVM
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.39.0/install.sh | bash
source ~/.profile

#Turn off current session console & reopen
#Install node & npm
nvm install 19
#check
node -v
npm -v

#Install Dependencies
npm install axios telegraf@3.38

#Run
node index.js

#Command
p symbol
Ex:
p btc
p bnb

Click update button to update current price
Click Top 10 Gainers button to get list

