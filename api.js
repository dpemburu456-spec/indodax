/**
 * API Module untuk mengambil data dari Binance dan Alternative.me
 * Menggunakan Fetch API dengan timeout dan error handling
 */

const HELAYO_API = (function() {
    // Konfigurasi dasar
    const CONFIG = {
        BINANCE_BASE: 'https://api.binance.com/api/v3',
        FEAR_GREED_URL: 'https://api.alternative.me/fng/',
        TIMEOUT_MS: 10000,
        SYMBOLS: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT']
    };

    // Helper: fetch dengan timeout
    async function fetchWithTimeout(url, options = {}, timeout = CONFIG.TIMEOUT_MS) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        try {
            const response = await fetch(url, { ...options, signal: controller.signal });
            clearTimeout(id);
            if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            return await response.json();
        } catch (err) {
            clearTimeout(id);
            if (err.name === 'AbortError') throw new Error('Request timeout');
            throw err;
        }
    }

    // Format angka harga
    function formatPrice(price, symbol) {
        const num = parseFloat(price);
        if (isNaN(num)) return '0.00';
        if (symbol === 'XRPUSDT') return num.toFixed(4);
        if (num > 1000) return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return num.toFixed(2);
    }

    // Format persentase perubahan
    function formatPercent(percent) {
        const num = parseFloat(percent);
        if (isNaN(num)) return '0.00%';
        return (num > 0 ? '+' : '') + num.toFixed(2) + '%';
    }

    // Ambil data ticker 24 jam dari Binance untuk beberapa simbol
    async function getMarketData() {
        try {
            // Gunakan endpoint untuk multiple symbols
            const symbolsParam = JSON.stringify(CONFIG.SYMBOLS);
            const url = `${CONFIG.BINANCE_BASE}/ticker/24hr?symbols=${encodeURIComponent(symbolsParam)}`;
            const data = await fetchWithTimeout(url);
            
            if (!Array.isArray(data)) throw new Error('Invalid response from Binance');
            
            // Mapping data ke format yang mudah digunakan
            const assets = {};
            for (const item of data) {
                const symbol = item.symbol;
                assets[symbol] = {
                    symbol: symbol,
                    baseAsset: symbol.replace('USDT', ''),
                    price: formatPrice(item.lastPrice, symbol),
                    priceRaw: parseFloat(item.lastPrice),
                    change24h: formatPercent(item.priceChangePercent),
                    changeRaw: parseFloat(item.priceChangePercent),
                    high: formatPrice(item.highPrice, symbol),
                    low: formatPrice(item.lowPrice, symbol),
                    volume: parseFloat(item.volume).toLocaleString()
                };
            }
            
            // Pastikan semua simbol yang diminta ada (fallback jika ada yang missing)
            for (const sym of CONFIG.SYMBOLS) {
                if (!assets[sym]) {
                    assets[sym] = {
                        symbol: sym,
                        baseAsset: sym.replace('USDT', ''),
                        price: '0.00',
                        priceRaw: 0,
                        change24h: '0.00%',
                        changeRaw: 0,
                        high: '0',
                        low: '0',
                        volume: '0'
                    };
                }
            }
            
            return assets;
        } catch (error) {
            console.error('Error fetching Binance data:', error);
            throw new Error(`Gagal mengambil data pasar: ${error.message}`);
        }
    }

    // Ambil Fear & Greed Index
    async function getFearGreedIndex() {
        try {
            const url = `${CONFIG.FEAR_GREED_URL}?limit=1`;
            const data = await fetchWithTimeout(url);
            
            if (data && data.data && data.data.length > 0) {
                const latest = data.data[0];
                return {
                    value: parseInt(latest.value),
                    classification: latest.value_classification,
                    timestamp: latest.timestamp,
                    updateTime: new Date().toLocaleTimeString()
                };
            }
            throw new Error('Invalid response structure');
        } catch (error) {
            console.error('Error fetching Fear & Greed:', error);
            return {
                value: null,
                classification: 'Tidak tersedia',
                error: error.message
            };
        }
    }

    // Public API
    return {
        getMarketData,
        getFearGreedIndex,
        formatPrice,
        formatPercent
    };
})();

// Ekspos ke global scope (untuk digunakan di main.js)
window.HELAYO_API = HELAYO_API;