// api.js
async function getIndodaxTicker(pair) {
    try {
        const proxyUrl = 'https://corsproxy.io/?';
        const targetUrl = `https://indodax.com/api/${pair}/ticker`;
        
        const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
        const data = await response.json();
        return data.ticker;
    } catch (error) {
        console.error("Gagal ambil data:", error);
        return null;
    }
}
