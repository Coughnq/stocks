import { balance, portfolio, gameMode, executeTrade } from './gameState.js';
import { stocks } from './supabase-client.js';
import { updateChart } from './chart.js';
import { transactions } from './app.js';

export function updateDisplay() {
    updateStockList();
    updatePortfolioList();
    updateBalance();
    updateChart();
    updateRecentTransactions();
    updateROI();
}

function updateStockList() {
    const stockListElement = document.getElementById('stockList');
    if (!stockListElement) return;

    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Symbol</th>
                    <th>Price</th>
                    <th>Change</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (const [symbol, stock] of Object.entries(stocks)) {
        const changePercent = stock.trend * 100;
        const changeClass = changePercent >= 0 ? 'positive-change' : 'negative-change';
        
        tableHTML += `
            <tr>
                <td>${symbol}</td>
                <td>$${stock.price.toFixed(2)}</td>
                <td class="${changeClass}">${changePercent.toFixed(2)}%</td>
                <td>
                    <button class="trade-button" onclick="openTradeModal('${symbol}')">Trade</button>
                </td>
            </tr>
        `;
    }

    tableHTML += `
            </tbody>
        </table>
    `;

    stockListElement.innerHTML = tableHTML;
}

function updatePortfolioList() {
    const portfolioListElement = document.getElementById('portfolioList');
    if (!portfolioListElement) return;

    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Symbol</th>
                    <th>Shares</th>
                    <th>Current Price</th>
                    <th>Value</th>
                    <th>Profit/Loss</th>
                </tr>
            </thead>
            <tbody>
    `;

    let totalValue = 0;

    for (const [symbol, holding] of Object.entries(portfolio)) {
        const stock = stocks[symbol];
        if (!stock) continue;

        const currentPrice = stock.price;
        const value = holding.shares * currentPrice;
        const profitLoss = value - holding.totalCost;
        const profitLossClass = profitLoss >= 0 ? 'positive-change' : 'negative-change';
        
        totalValue += value;

        tableHTML += `
            <tr>
                <td>${symbol}</td>
                <td>${holding.shares}</td>
                <td>$${currentPrice.toFixed(2)}</td>
                <td>$${value.toFixed(2)}</td>
                <td class="${profitLossClass}">$${profitLoss.toFixed(2)}</td>
            </tr>
        `;
    }

    tableHTML += `
            </tbody>
        </table>
    `;

    portfolioListElement.innerHTML = tableHTML;

    // Update Portfolio Value
    const portfolioValueElement = document.getElementById('portfolioValue');
    if (portfolioValueElement) {
        portfolioValueElement.textContent = totalValue.toFixed(2);
    }
}

function updateBalance() {
    const balanceElement = document.getElementById('balance');
    if (balanceElement) balanceElement.textContent = balance.toFixed(2);
}

function updateMarketOverview() {
    // Implement market overview update logic
}

function updateRecentTransactions() {
    const transactionLogElement = document.getElementById('transactionLog');
    if (!transactionLogElement) return;

    let tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Time</th>
                    <th>Action</th>
                    <th>Symbol</th>
                    <th>Shares</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
    `;

    transactions.slice(-5).reverse().forEach(transaction => {
        tableHTML += `
            <tr>
                <td>${transaction.time}</td>
                <td>${transaction.action}</td>
                <td>${transaction.symbol}</td>
                <td>${transaction.shares}</td>
                <td>$${transaction.price.toFixed(2)}</td>
                <td>$${transaction.total.toFixed(2)}</td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    transactionLogElement.innerHTML = tableHTML;
}

function updateROI() {
    const roiElement = document.getElementById('roi');
    if (roiElement) {
        const initialBalance = 10000;
        const roi = ((balance - initialBalance) / initialBalance) * 100;
        roiElement.textContent = roi.toFixed(2);
    }
}

let tutorialStep = 0;
const tutorialSteps = [
    "Welcome to the Stock Market Simulator! Let's get started.",
    "This is your balance. You start with $10,000.",
    "Here you can see the available stocks. Click on a stock to trade.",
    "The chart shows the performance of stocks over time.",
    "Your portfolio shows the stocks you own and their current value.",
    "Keep an eye on the news! It can affect stock prices.",
    "Good luck and happy trading!"
];

export function showTutorial() {
    tutorialStep = 0;
    document.getElementById('tutorialModal').style.display = 'block';
    showTutorialStep();
}

function showTutorialStep() {
    document.getElementById('tutorialContent').textContent = tutorialSteps[tutorialStep];
}

export function nextTutorialStep() {
    tutorialStep++;
    if (tutorialStep < tutorialSteps.length) {
        showTutorialStep();
    } else {
        document.getElementById('tutorialModal').style.display = 'none';
    }
}

export function closeSettings() {
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
        settingsModal.style.display = 'none';
    }
}

export function addTransaction(action, symbol, price, shares, total) {
    const transaction = {
        time: new Date().toLocaleTimeString(),
        action,
        symbol,
        shares,
        price,
        total
    };
    transactions.unshift(transaction);
    if (transactions.length > 20) {
        transactions.pop();
    }
    updateRecentTransactions();
}

function updatePortfolioContainer() {
    const portfolioList = document.getElementById('portfolio-list');
    const portfolioTotal = document.getElementById('portfolio-total');
    
    if (!portfolioList || !portfolioTotal) {
        console.error('Portfolio elements not found');
        return;
    }

    portfolioList.innerHTML = '';
    let totalValue = 0;

    for (const [symbol, holding] of Object.entries(portfolio)) {
        if (holding.shares > 0) {
            const stockPrice = stocks[symbol].price;
            const value = holding.shares * stockPrice;
            totalValue += value;

            const portfolioItem = document.createElement('div');
            portfolioItem.className = 'portfolio-item';
            portfolioItem.innerHTML = `
                <span>${symbol}: ${holding.shares} shares</span>
                <span>$${value.toFixed(2)}</span>
            `;
            portfolioList.appendChild(portfolioItem);
        }
    }

    portfolioTotal.textContent = `Total Portfolio Value: $${totalValue.toFixed(2)}`;

    // Update balance display
    const balanceDisplay = document.getElementById('balance');
    if (balanceDisplay) {
        balanceDisplay.textContent = balance.toFixed(2);
    }
}