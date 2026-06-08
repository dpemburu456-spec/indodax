// ==========================================
// FUNGSI MENGAMBIL DATA API INDODAX
// ==========================================
async function getIndodaxTicker(pair) {
    try {
        // MENGGUNAKAN TIMESTAMP AGAR TIDAK MENGAMBIL DATA LAMA (CACHE)
        const response = await fetch(`https://indodax.com/api/ticker/${pair}?_=${Date.now()}`);
        const data = await response.json();
        return data.ticker;
    } catch (error) {
        return null;
    }
}
