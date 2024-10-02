import { openTradeModal } from './trade.js';
import { initializeStocks, subscribeToStockUpdates } from './supabase-client.js';
import { initializeChart } from './chart.js';
import { 
    balance, 
    portfolio, 
    gameMode, 
    achievements, 
    saveGameState, 
    loadGameState, 
    updateBalance,
    updatePortfolio, 
    unlockAchievement,
    executeTrade,
    resetGameState
} from './gameState.js';
import { updateDisplay } from './ui.js';
import { showTutorial, nextTutorialStep, closeSettings } from './ui.js';
import { updateStockPrices } from './stock.js';  // Add this import

let transactions = [];

const STOCK_SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'FB', 'TSLA', 'NVDA', 'JPM'];

function generateRandomStockData() {
    STOCK_SYMBOLS.forEach(symbol => {
        if (!stocks[symbol]) {
            stocks[symbol] = {
                price: Math.random() * 1000 + 50,
                history: []
            };
        }
        const change = (Math.random() - 0.5) * 0.02; // -1% to 1% change
        const newPrice = Math.max(0.01, stocks[symbol].price * (1 + change));
        stocks[symbol].price = parseFloat(newPrice.toFixed(2));
        stocks[symbol].history.push(stocks[symbol].price);
        if (stocks[symbol].history.length > 50) stocks[symbol].history.shift();
        
        updateStockPrice(symbol, stocks[symbol].price);
    });
    
    // Update the display after generating new stock data
    updateDisplay();
}

async function initApp() {
    try {
        // Initialize the chart
        initializeChart();

        // Initialize stocks first
        const initializedStocks = await initializeStocks();
        if (!initializedStocks || Object.keys(initializedStocks).length === 0) {
            throw new Error('Failed to initialize stocks');
        }

        // Subscribe to stock updates
        subscribeToStockUpdates(updateDisplay);

        // Load game state
        loadGameState();

        // Initial update
        updateDisplay();

        // Set up periodic updates
        setInterval(() => {
            updateStockPrices();
            saveGameState();
            updateDisplay();
        }, 5000);

    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded, initializing app...');
    initApp();
    updateDisplay(); // Initial update
    setInterval(updateDisplay, 5000); // Update every 5 seconds
});

window.triggerSaveGameState = saveGameState;

export { transactions };

window.addEventListener('storage', (event) => {
    if (event.key === 'stockMarketGameState') {
        loadGameState();
        updateDisplay();
    }
});
