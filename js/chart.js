import { stocks } from './supabase-client.js';

let chart;

export function initializeChart() {
    const ctx = document.getElementById('stockChart');
    if (!ctx) {
        console.warn('Cannot find stockChart element. Chart initialization skipped.');
        return;
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'second'
                    }
                },
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

export function updateChart() {
    if (!chart) {
        console.warn('Chart not initialized. Skipping update.');
        return;
    }

    console.log('Updating chart with stocks:', stocks);

    if (Object.keys(stocks).length === 0) {
        console.warn('No stock data available for chart update. Waiting for data...');
        return;
    }

    const currentTime = new Date();

    Object.entries(stocks).forEach(([symbol, stock]) => {
        let dataset = chart.data.datasets.find(ds => ds.label === symbol);
        if (!dataset) {
            dataset = {
                label: symbol,
                data: [],
                borderColor: getRandomColor(),
                fill: false
            };
            chart.data.datasets.push(dataset);
        }
        dataset.data.push({x: currentTime, y: stock.price});
        if (dataset.data.length > 50) dataset.data.shift();
    });

    chart.update();
}

function getRandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
}
