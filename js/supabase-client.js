import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = 'https://fvwubzaccwjleizxlwwf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2d3ViemFjY3dqbGVpenhsd3dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc0MTY5NjcsImV4cCI6MjA0Mjk5Mjk2N30.3rEEdEJQTb5bWRvmRz7iar-R-fTF74PMkuQ8ygoUAOM';
const supabase = createClient(supabaseUrl, supabaseKey);

export let stocks = {};

async function initializeStocks() {
    console.log('Fetching stocks from Supabase...');
    const { data, error } = await supabase
        .from('stocks')
        .select('*')
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('Error fetching stocks:', error);
        return initializeDefaultStocks();
    }

    console.log('Received stock data:', data);

    if (!data || data.length === 0) {
        console.warn('No stock data received from Supabase, using default stocks');
        return initializeDefaultStocks();
    }

    data.forEach(stock => {
        stocks[stock.symbol] = {
            price: parseFloat(stock.price),
            history: [parseFloat(stock.price)],
            trend: 0
        };
    });

    console.log('Stocks initialized:', stocks);
    return stocks;
}

async function initializeDefaultStocks() {
    const defaultStocks = {
        AAPL: 150,
        GOOGL: 2800,
        MSFT: 300,
        AMZN: 3300,
        FB: 330,
        TSLA: 700,
        NFLX: 550,
        NVDA: 800
    };

    for (const [symbol, price] of Object.entries(defaultStocks)) {
        stocks[symbol] = {
            price: price,
            history: [price],
            trend: 0
        };
    }

    console.log('Default stocks initialized:', stocks);

    // Send the default stocks to Supabase
    await sendStocksToSupabase(stocks);

    return stocks;
}

async function sendStocksToSupabase(stocks) {
    const stocksArray = Object.entries(stocks).map(([symbol, data]) => ({
        symbol,
        price: data.price,
        updated_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
        .from('stocks')
        .upsert(stocksArray, { 
            onConflict: 'symbol',
            update: ['price', 'updated_at']
        });

    if (error) {
        console.error('Error sending stocks to Supabase:', error);
    } else {
        console.log('Stocks successfully sent to Supabase:', data);
    }
}

function subscribeToStockUpdates(updateCallback) {
    supabase
        .channel('public:stocks')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'stocks' }, payload => {
            const stock = payload.new;
            if (stocks[stock.symbol]) {
                stocks[stock.symbol].price = parseFloat(stock.price);
                stocks[stock.symbol].history.push(parseFloat(stock.price));
                if (stocks[stock.symbol].history.length > 50) {
                    stocks[stock.symbol].history.shift();
                }
            }
            if (typeof updateCallback === 'function') {
                updateCallback();
            }
        })
        .subscribe();
}

// Export the functions and stocks object
export { initializeStocks, subscribeToStockUpdates };

export async function updateStockPrice(symbol, price) {
    const { data, error } = await supabase
        .from('stocks')
        .upsert({ 
            symbol, 
            price, 
            updated_at: new Date().toISOString() 
        }, { 
            onConflict: 'symbol',
            update: ['price', 'updated_at']
        });

    if (error) {
        console.error('Error updating stock price:', error);
        return null;
    }
    return data;
}

export async function signIn(email, password) {
    const { user, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return user;
}

export async function signUp(email, password) {
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return user;
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}
