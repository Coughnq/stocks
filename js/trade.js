import { balance, portfolio } from './gameState.js';
import { stocks } from './supabase-client.js';

const tradingFee = 0.001; // 0.1% trading fee
let currentTradeSymbol = '';
let currentTradeInterval;
let currentTradeShares = 0;
let currentTradeAction = ''; // Add this line to keep track of the current action (buy or sell)

export function openTradeModal(symbol) {
    currentTradeSymbol = symbol;
    currentTradeShares = 0;
    currentTradeAction = ''; // Reset the action when opening the modal
    const stock = stocks[symbol];
    const tradeModal = document.getElementById('tradeModal');
    const tradeStockSymbol = document.getElementById('tradeStockSymbol');
    const tradeCurrentPrice = document.getElementById('tradeCurrentPrice');
    const tradeShares = document.getElementById('tradeShares');
    const tradeTotalCost = document.getElementById('tradeTotalCost');
    const buyButton = document.getElementById('buyButton');
    const sellButton = document.getElementById('sellButton');

    tradeStockSymbol.textContent = symbol;
    updateTradePrice();

    tradeModal.style.display = 'block';

    // Clear any existing warnings
    document.getElementById('tradeWarning').style.display = 'none';

    // Clear previous interval if exists
    if (currentTradeInterval) clearInterval(currentTradeInterval);

    // Set up real-time price updates
    currentTradeInterval = setInterval(updateTradePrice, 1000);

    // Add event listeners for amount buttons
    const amountButtons = document.querySelectorAll('.amount-button');
    amountButtons.forEach(button => {
        button.addEventListener('click', () => setTradeAmount(button.dataset.amount));
    });

    // Add event listener for custom amount input
    const customAmountInput = document.getElementById('customAmount');
    customAmountInput.addEventListener('input', () => setTradeAmount(customAmountInput.value));

    // Update event listeners for buy and sell buttons
    buyButton.addEventListener('click', () => {
        currentTradeAction = 'buy';
        executeTrade('buy');
    });
    sellButton.addEventListener('click', () => {
        currentTradeAction = 'sell';
        executeTrade('sell');
    });

    // Add event listeners for buy and sell buttons
    buyButton.addEventListener('click', () => executeTrade('buy'));
    sellButton.addEventListener('click', () => executeTrade('sell'));
}

function setTradeAmount(amount) {
    const stock = stocks[currentTradeSymbol];
    if (amount === 'max') {
        if (currentTradeAction === 'sell' && portfolio[currentTradeSymbol]) {
            // For selling, set max to the number of shares owned
            currentTradeShares = portfolio[currentTradeSymbol].shares;
        } else {
            // For buying, calculate max shares that can be bought with current balance
            currentTradeShares = Math.floor(balance / stock.price);
        }
    } else {
        currentTradeShares = parseInt(amount) || 0;
    }
    updateTradeTotalCost();
}

function updateTradePrice() {
    const tradeCurrentPrice = document.getElementById('tradeCurrentPrice');
    tradeCurrentPrice.textContent = stocks[currentTradeSymbol].price.toFixed(2);
    updateTradeTotalCost();
}

function updateTradeTotalCost() {
    const tradeShares = document.getElementById('tradeShares');
    const tradeTotalCost = document.getElementById('tradeTotalCost');
    const totalCost = currentTradeShares * stocks[currentTradeSymbol].price;
    tradeShares.textContent = currentTradeShares;
    tradeTotalCost.textContent = totalCost.toFixed(2);

    // Update buy/sell button states
    const buyButton = document.getElementById('buyButton');
    const sellButton = document.getElementById('sellButton');
    
    buyButton.disabled = totalCost > balance;
    sellButton.disabled = !portfolio[currentTradeSymbol] || portfolio[currentTradeSymbol].shares < currentTradeShares;
}

function closeTradeModal() {
    document.getElementById('tradeModal').style.display = 'none';
    if (currentTradeInterval) clearInterval(currentTradeInterval);
}

function showWarning(message) {
    const warningElement = document.getElementById('tradeWarning');
    warningElement.textContent = message;
    warningElement.style.display = 'block';
    setTimeout(() => {
        warningElement.style.display = 'none';
    }, 3000); // Hide the warning after 3 seconds
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    const cancelTradeBtn = document.getElementById('cancelTradeBtn');
    if (cancelTradeBtn) {
        cancelTradeBtn.addEventListener('click', closeTradeModal);
    }
});

// Remove any window assignments
