let balance = 10000; // Default starting balance
let portfolio = {};
let gameMode = 'normal'; // Default game mode
let achievements = []; // You might want to initialize this with your achievement definitions

function saveGameState() {
    const gameState = {
        balance: balance,
        portfolio: portfolio,
        gameMode: gameMode,
        achievements: achievements
    };
    localStorage.setItem('stockMarketGameState', JSON.stringify(gameState));
}

function loadGameState() {
    const savedState = localStorage.getItem('stockMarketGameState');
    if (savedState) {
        const state = JSON.parse(savedState);
        balance = state.balance;
        portfolio = state.portfolio;
        gameMode = state.gameMode;
        achievements = state.achievements;
    }
}

function updateBalance(amount) {
    balance += amount;
    saveGameState();
}

function updatePortfolio(symbol, shares, cost) {
    if (!portfolio[symbol]) {
        portfolio[symbol] = { shares: 0, totalCost: 0 };
    }
    portfolio[symbol].shares += shares;
    portfolio[symbol].totalCost += cost;
    if (portfolio[symbol].shares <= 0) {
        delete portfolio[symbol];
    }
    saveGameState();
}

function executeTrade(action, symbol, shares, price) {
    const totalCost = shares * price;
    if (action === 'buy') {
        if (balance >= totalCost) {
            updateBalance(-totalCost);
            updatePortfolio(symbol, shares, totalCost);
            return true;
        }
    } else if (action === 'sell') {
        if (portfolio[symbol] && portfolio[symbol].shares >= shares) {
            updateBalance(totalCost);
            updatePortfolio(symbol, -shares, -totalCost);
            return true;
        }
    }
    return false;
}

function resetGameState() {
    localStorage.removeItem('stockMarketGameState');
    balance = 10000;
    portfolio = {};
    gameMode = 'normal';
    achievements = [];
    saveGameState();
}

function unlockAchievement(achievementId) {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && !achievement.achieved) {
        achievement.achieved = true;
        saveGameState();
        // You might want to add some code here to display a notification to the user
        console.log(`Achievement unlocked: ${achievement.name}`);
    }
}

// Single export statement for all functions and variables
export {
    balance,
    portfolio,
    gameMode,
    achievements,
    saveGameState,
    loadGameState,
    updateBalance,
    updatePortfolio,
    executeTrade,
    resetGameState,
    unlockAchievement
};
