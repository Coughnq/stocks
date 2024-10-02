import { stocks } from './supabase-client.js';
import { balance, portfolio, performTrade } from './gameState.js';
import { updateDisplay } from './ui.js';

let currentTradeSymbol = '';
let currentTradeAction = '';

function openTradeModal(action, symbol) {
    currentTradeSymbol = symbol;
    currentTradeAction = action;

    const stock = stocks[symbol];
    const tradeModal = document.getElementById('tradeModal');
    const tradeSymbol = document.getElementById('tradeSymbol');
    const tradeAction = document.getElementById('tradeAction');
    const tradePrice = document.getElementById('tradePrice');
    const tradeTotalCost = document.getElementById('tradeTotalCost');
    const customShares = document.getElementById('customShares');

    tradeSymbol.textContent = symbol;
    tradeAction.textContent = action.charAt(0).toUpperCase() + action.slice(1);
    tradePrice.textContent = stock.price.toFixed(2);
    tradeTotalCost.textContent = '0.00';
    customShares.value = '';

    // Clear any existing error messages
    hideError();

    tradeModal.style.display = 'block';

    // Add event listeners
    document.querySelectorAll('.share-option').forEach(button => {
        button.addEventListener('click', handleShareOptionClick);
    });

    customShares.addEventListener('input', handleCustomSharesInput);
    document.getElementById('executeTrade').addEventListener('click', executeTrade);
    document.getElementById('cancelTrade').addEventListener('click', closeTradeModal);
}

function handleShareOptionClick(event) {
    const shares = event.target.dataset.shares;
    const stock = stocks[currentTradeSymbol];
    let quantity;

    if (shares === 'max') {
        quantity = currentTradeAction === 'buy' 
            ? Math.floor(balance / stock.price)
            : portfolio[currentTradeSymbol]?.shares || 0;
    } else {
        quantity = parseInt(shares);
    }

    document.getElementById('customShares').value = quantity;
    updateTotalCost(quantity);
}

function handleCustomSharesInput(event) {
    const quantity = parseInt(event.target.value) || 0;
    updateTotalCost(quantity);
}

function updateTotalCost(quantity) {
    const stock = stocks[currentTradeSymbol];
    const totalCost = (quantity * stock.price).toFixed(2);
    const tradeTotalCost = document.getElementById('tradeTotalCost');
    tradeTotalCost.textContent = totalCost;

    // Update the label to show "Total Cost" for buying and "Total Value" for selling
    const totalLabel = document.getElementById('totalLabel');
    if (totalLabel) {
        totalLabel.textContent = currentTradeAction === 'buy' ? 'Total Cost:' : 'Total Value:';
    }
}

function executeTrade() {
    const quantity = parseInt(document.getElementById('customShares').value);
    const stock = stocks[currentTradeSymbol];

    if (isNaN(quantity) || quantity <= 0) {
        showError('Please enter a valid number of shares.');
        return;
    }

    if (currentTradeAction === 'buy' && quantity * stock.price > balance) {
        showError('Insufficient funds for this trade.');
        return;
    }

    if (currentTradeAction === 'sell' && (portfolio[currentTradeSymbol]?.shares || 0) < quantity) {
        showError('Not enough shares to sell.');
        return;
    }

    const success = performTrade(currentTradeAction, currentTradeSymbol, quantity, stock.price);

    if (success) {
        closeTradeModal();
        updateDisplay();
    } else {
        showError('Trade failed. Please try again.');
    }
}

function closeTradeModal() {
    document.getElementById('tradeModal').style.display = 'none';
    // Remove event listeners
    document.querySelectorAll('.share-option').forEach(button => {
        button.removeEventListener('click', handleShareOptionClick);
    });
    document.getElementById('customShares').removeEventListener('input', handleCustomSharesInput);
    document.getElementById('executeTrade').removeEventListener('click', executeTrade);
    document.getElementById('cancelTrade').removeEventListener('click', closeTradeModal);

    // Hide any error messages when closing the modal
    hideError();
}

function showError(message) {
    const errorPopup = document.getElementById('errorPopup');
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorPopup.style.display = 'block';

    // Automatically hide the error after 3 seconds
    setTimeout(hideError, 3000);
}

function hideError() {
    const errorPopup = document.getElementById('errorPopup');
    errorPopup.style.display = 'none';
}

// Single export statement for all functions that need to be exported
export {
    openTradeModal,
    closeTradeModal
};
