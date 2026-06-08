async function getIndodaxTicker(pair) {
    try {
        // MENAMBAHKAN TIMESTAMP (?t=...) AGAR BROWSER TIDAK MENGAMBIL CACHE LAMA
        const response = await fetch(`https://indodax.com/api/ticker/${pair}?t=${new Date().getTime()}`);
        const data = await response.json();
        return data.ticker;
    } catch (error) {
        console.error("GAGAL MENGAMBIL DATA:", error);
        return null;
    }
}
