import { unlockAchievement } from './gameState.js';

function checkAchievements() {
    if (!achievements.find(a => a.id === 'firstTrade').achieved && Object.keys(portfolio).length > 0) {
        unlockAchievement('firstTrade');
    }
    
    if (!achievements.find(a => a.id === 'thousandaire').achieved && balance >= 11000) {
        unlockAchievement('thousandaire');
    }
    
    if (!achievements.find(a => a.id === 'diversified').achieved && 
        Object.keys(portfolio).length === Object.keys(stocks).length) {
        unlockAchievement('diversified');
    }
}

function unlockAchievement(id) {
    const achievement = achievements.find(a => a.id === id);
    if (achievement && !achievement.achieved) {
        achievement.achieved = true;
        const achievementsElement = document.getElementById('achievements');
        if (achievementsElement) {
            const achievementElement = document.createElement('div');
            achievementElement.className = 'achievement';
            achievementElement.textContent = `${achievement.name}: ${achievement.description}`;
            achievementsElement.appendChild(achievementElement);
        }
    }
}
