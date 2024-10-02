import { updateDisplay, setupEventListeners } from './ui.js';
import { initializeStocks, subscribeToStockUpdates } from './supabase-client.js';
import { loadGameState, saveGameState } from './gameState.js';
import { initializeChart } from './chart.js';
import { updateStockPrices } from './stock.js';
import { openTradeModal, closeTradeModal } from './trade.js';

async function initApp() {
    try {
        // Initialize the chart
        initializeChart();

        // Initialize stocks first
        await initializeStocks();

        // Subscribe to stock updates
        subscribeToStockUpdates(updateDisplay);

        // Load game state
        loadGameState();

        // Initial update
        updateDisplay();

        // Set up event listeners
        setupEventListeners();

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
});

// Make these functions available globally if needed
window.openTradeModal = openTradeModal;
window.closeTradeModal = closeTradeModal;

// Make sure to use openTradeModal when handling buy/sell button clicks
function setupTradeButtons() {
    document.querySelectorAll('.buy-button, .sell-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const symbol = e.target.getAttribute('data-symbol');
            const action = e.target.classList.contains('buy-button') ? 'buy' : 'sell';
            openTradeModal(action, symbol);
        });
    });
}

// Call this function after updating the stock list in your UI
setupTradeButtons();
