import { stocks } from './supabase-client.js';
import { gameMode } from './gameState.js';

// Make sure stocks is available globally
window.stocks = stocks;

function updatePrice(stock) {
    const prevPrice = stock.price;
    let change;

    switch(gameMode) {
        case 'bullMarket':
            change = (Math.random() * 0.03) - 0.005; // Bias towards positive changes
            break;
        case 'bearMarket':
            change = (Math.random() * 0.03) - 0.025; // Bias towards negative changes
            break;
        case 'volatileMarket':
            change = (Math.random() * 0.06) - 0.03; // Larger price swings
            break;
        default: // normal mode
            change = (Math.random() * 0.02) - 0.01;
    }

    stock.price = Math.max(0.01, stock.price * (1 + change));
    stock.trend = (stock.price - prevPrice) / prevPrice;
    stock.history.push(stock.price);
    if (stock.history.length > 50) stock.history.shift();

    return stock.price - prevPrice;
}

function getRandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}

export function updateStockPrices() {
    for (const symbol in stocks) {
        const stock = stocks[symbol];
        const prevPrice = stock.price;
        let change;

        switch(gameMode) {
            case 'bullMarket':
                change = (Math.random() * 0.03) - 0.005; // Bias towards positive changes
                break;
            case 'bearMarket':
                change = (Math.random() * 0.03) - 0.025; // Bias towards negative changes
                break;
            case 'volatileMarket':
                change = (Math.random() * 0.06) - 0.03; // Larger price swings
                break;
            default: // normal mode
                change = (Math.random() * 0.02) - 0.01;
        }

        stock.price = Math.max(0.01, stock.price * (1 + change));
        stock.trend = (stock.price - prevPrice) / prevPrice;
        stock.history.push(stock.price);
        if (stock.history.length > 50) stock.history.shift();
    }
}

// Make sure to expose this function globally
window.updateStockPrices = updateStockPrices;
