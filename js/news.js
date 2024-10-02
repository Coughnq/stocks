function generateNews() {
    const newsItems = [
        "Market volatility increases due to global events",
        "Tech sector sees unexpected growth",
        "New regulations impact financial stocks",
        "Consumer confidence reaches all-time high",
        "Oil prices fluctuate amid geopolitical tensions"
    ];
    const randomNews = newsItems[Math.floor(Math.random() * newsItems.length)];
    addNewsItem(randomNews);
}

function addNewsItem(newsText) {
    const newsContainer = document.getElementById('newsContainer');
    if (newsContainer) {
        const newsElement = document.createElement('div');
        newsElement.className = 'news-item';
        newsElement.innerHTML = `
            <span class="news-time">${new Date().toLocaleTimeString()}</span>
            <p>${newsText}</p>
        `;
        newsContainer.prepend(newsElement);
        if (newsContainer.children.length > 5) {
            newsContainer.removeChild(newsContainer.lastChild);
        }
    }
}

// Make sure to expose these functions globally
window.generateNews = generateNews;
window.addNewsItem = addNewsItem;
