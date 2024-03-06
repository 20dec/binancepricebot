const { Telegraf, Extra } = require('telegraf');
const axios = require('axios');

const bot = new Telegraf('YOUR_TELEGRAM_BOT_API_KEY');
console.log('BOT START')
// Function to format number with thousand separators and rounding for numbers greater than or equal to 1
function numberWithCommas(x, isQuoteVolume = false) {
    if (x >= 1) {
        return parseFloat(x).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else if (x >= 0 && isQuoteVolume) {
        return Math.round(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
        // Round to six decimal places
        return parseFloat(Math.round(x * 1e7) / 1e7).toString();
    }
}


// Listen for commands with "p" prefix
bot.hears(/^p (.+)/, async (ctx) => {
    try {
        const symbol = ctx.match[1].toUpperCase(); // Extracting the cryptocurrency symbol from the command

        const response = await axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}USDT`);

        const { highPrice, lowPrice, quoteVolume, lastPrice } = response.data;

        const formattedLastPrice = numberWithCommas(parseFloat(lastPrice));
        const formattedHighPrice = numberWithCommas(parseFloat(highPrice));
        const formattedLowPrice = numberWithCommas(parseFloat(lowPrice));
        const formattedQuoteVolume = ((parseFloat(quoteVolume) * 1).toFixed(0) * 1).toLocaleString()

        const message = `<b>Cryptocurrency Data for ${symbol}</b>\n\n`
                      + `<b>Last Price:</b> ${formattedLastPrice} $\n`
                      + `<b>High Price:</b> ${formattedHighPrice} $\n`
                      + `<b>Low Price:</b> ${formattedLowPrice} $\n`
                      + `<b>Volume:</b> ${formattedQuoteVolume} $`;

        const updateButton = Extra.HTML().markup((m) =>
            m.inlineKeyboard([
                m.callbackButton('Update Data', `update_${symbol}`),
                m.callbackButton('Top 10 Gainers', 'top_gainers')
            ])
        );

        // Check if the message is sent by the bot itself
        if (ctx.message.from.id === ctx.botInfo.id) {
            // If the message is sent by the bot, edit the message with the update button
            ctx.editMessageText(message, updateButton);
        } else {
            // If the message is sent by a user, reply with the message and the update button
            ctx.reply(message, updateButton);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        ctx.reply('Error fetching data. Please try again later.');
    }
});

// Callback query to handle 'Update Data' button
bot.action(/^update_(.+)$/i, async (ctx) => {
    try {
        const symbol = ctx.match[1].toUpperCase();
        const response = await axios.get(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}USDT`);

        const { highPrice, lowPrice, quoteVolume, lastPrice } = response.data;

        const formattedLastPrice = numberWithCommas(parseFloat(lastPrice));
        const formattedHighPrice = numberWithCommas(parseFloat(highPrice));
        const formattedLowPrice = numberWithCommas(parseFloat(lowPrice));
        const formattedQuoteVolume = ((parseFloat(quoteVolume) * 1).toFixed(0) * 1).toLocaleString()

        const message = `<b>Cryptocurrency Data for ${symbol}</b>\n\n`
                      + `<b>Last Price:</b> ${formattedLastPrice} $\n`
                      + `<b>High Price:</b> ${formattedHighPrice} $\n`
                      + `<b>Low Price:</b> ${formattedLowPrice} $\n`
                      + `<b>Volume:</b> ${formattedQuoteVolume} $`;

        const updateButton = Extra.HTML().markup((m) =>
            m.inlineKeyboard([
                m.callbackButton('Update Data', `update_${symbol}`),
                m.callbackButton('Top 10 Gainers', 'top_gainers')
            ])
        );

        // Edit the existing message with the updated data and button
        ctx.editMessageText(message, updateButton);
    } catch (error) {
        console.error('Error updating data:', error);
        ctx.answerCbQuery('Error updating data. Please try again later.');
    }
});

// Callback query to handle 'Top 10 Gainers' buttonn
// Callback query to handle 'Top 10 Gainers' buttonn
bot.action('top_gainers', async (ctx) => {
    try {
        const response = await axios.get('https://api.binance.com/api/v3/ticker/24hr');

        // Filter response data for pairs with USDT and sort them by price change percentage in descending order
        const topGainersData = response.data
            .filter(item => item.symbol.endsWith('USDT'))
            .sort((a, b) => parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent))
            .slice(0, 10); // Get the top 10 gainers

        let message = '<b>Top 10 Gainers in Binance</b>\n\n';
        topGainersData.forEach((item, index) => {
            // Remove 'USDT' from the symbol
            const symbolWithoutUSDT = item.symbol.replace('USDT', '');
            const priceChangePercent = parseFloat(item.priceChangePercent).toFixed(2);
            message += `<b>${index + 1}:</b> ${symbolWithoutUSDT} (${priceChangePercent}%) \n`;
            // You can add more details from item if needed
        });

        ctx.reply(message, Extra.HTML());
    } catch (error) {
        console.error('Error fetching top gainers:', error);
        ctx.answerCbQuery('Error fetching top gainers. Please try again later.');
    }
});

bot.launch();
