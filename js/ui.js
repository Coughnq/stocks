import { balance, portfolio, transactions } from './gameState.js';
import { stocks } from './supabase-client.js';
import { openTradeModal } from './trade.js';
import { updateChart } from './chart.js';

export function updateDisplay() {
    updateBalance();
    updateROI();
    updatePortfolioValue();
    updateStockList();
    updatePortfolio();
    updateTransactionLog();
    updateChart();
}

function updateBalance() {
    const balanceElement = document.getElementById('balance');
    if (balanceElement) {
        balanceElement.textContent = balance.toFixed(2);
    }
}

function updateROI() {
    // Implement ROI calculation logic here
    const roiElement = document.getElementById('roi');
    if (roiElement) {
        roiElement.textContent = '0.00'; // Placeholder value
    }
}

function updatePortfolioValue() {
    let totalValue = Object.entries(portfolio).reduce((total, [symbol, holding]) => {
        return total + (holding.shares * stocks[symbol].price);
    }, 0);
    const portfolioValueElement = document.getElementById('portfolioValue');
    if (portfolioValueElement) {
        portfolioValueElement.textContent = totalValue.toFixed(2);
    }
}

function updateStockList() {
    const stockListElement = document.getElementById('stockList');
    if (!stockListElement) return;

    stockListElement.innerHTML = '';
    for (const [symbol, stock] of Object.entries(stocks)) {
        const row = document.createElement('div');
        row.className = 'stock-row';
        row.innerHTML = `
            <span>${symbol}</span>
            <span>$${stock.price.toFixed(2)}</span>
            <span class="${stock.trend >= 0 ? 'positive-change' : 'negative-change'}">
                ${(stock.trend * 100).toFixed(2)}%
            </span>
            <div class="button-container">
                <button class="buy-button" data-symbol="${symbol}">Buy</button>
                <button class="sell-button" data-symbol="${symbol}">Sell</button>
            </div>
        `;
        stockListElement.appendChild(row);
    }

    // Add event listeners to buy and sell buttons
    stockListElement.querySelectorAll('.buy-button, .sell-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const symbol = e.target.getAttribute('data-symbol');
            const action = e.target.classList.contains('buy-button') ? 'buy' : 'sell';
            openTradeModal(action, symbol);
        });
    });
}

function updatePortfolio() {
    const portfolioListElement = document.getElementById('portfolioList');
    if (!portfolioListElement) return;

    portfolioListElement.innerHTML = '';
    for (const [symbol, holding] of Object.entries(portfolio)) {
        const stock = stocks[symbol];
        if (!stock) continue;

        const currentValue = holding.shares * stock.price;
        const profitLoss = currentValue - holding.totalCost;

        const row = document.createElement('div');
        row.className = 'portfolio-row';
        row.innerHTML = `
            <span>${symbol}</span>
            <span>${holding.shares}</span>
            <span>$${currentValue.toFixed(2)}</span>
            <span class="${profitLoss >= 0 ? 'positive-change' : 'negative-change'}">
                $${profitLoss.toFixed(2)}
            </span>
        `;
        portfolioListElement.appendChild(row);
    }
}

function updateTransactionLog() {
    const transactionLogElement = document.getElementById('transactionLog');
    if (!transactionLogElement) return;

    transactionLogElement.innerHTML = '';
    for (const transaction of transactions.slice().reverse()) {
        const row = document.createElement('div');
        row.className = 'transaction-row';
        row.innerHTML = `
            <span>${transaction.time}</span>
            <span>${transaction.action.toUpperCase()}</span>
            <span>${transaction.symbol}</span>
            <span>${transaction.shares}</span>
            <span>$${transaction.price.toFixed(2)}</span>
            <span>$${(transaction.shares * transaction.price).toFixed(2)}</span>
        `;
        transactionLogElement.appendChild(row);
    }
}

export function setupEventListeners() {
    const tutorialBtn = document.getElementById('tutorialBtn');
    const settingsBtn = document.getElementById('settingsBtn');

    if (tutorialBtn) {
        tutorialBtn.addEventListener('click', showTutorial);
    }

    if (settingsBtn) {
        settingsBtn.addEventListener('click', showSettings);
    }
}

function showTutorial() {
    // Implement tutorial logic here
    console.log('Tutorial button clicked');
}

function showSettings() {
    // Implement settings logic here
    console.log('Settings button clicked');
}