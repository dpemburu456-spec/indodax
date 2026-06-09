const BOT_TOKEN = "8709487447:AAHjoJVmXFXW_1c4tiAJVu2GqnwFw4h4b5U";
const CHAT_ID = "8294553147";
let lastSentSignalHash = "", autoNotifyEnabled = false, latestSignalData = {};

async function sendTelegramMessage(message) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    return fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: "HTML" }) });
}

// ... (Masukkan fungsi calcEMA, calcRSI, calcMACD, detectPatterns, dll dari kode asli Anda di sini) ...

async function fetchAndAnalyze() {
    // ... (Logika fetch data Binance dan pembaruan UI seperti kode asli Anda) ...
}

// Event Listeners
document.getElementById('refreshBtn').addEventListener('click', fetchAndAnalyze);
document.getElementById('sendTgBtn').addEventListener('click', async () => { /* Logika kirim manual */ });
document.getElementById('autoNotifyCheckbox').addEventListener('change', (e) => { autoNotifyEnabled = e.target.checked; });
document.getElementById('loadAllSymbolsBtn').addEventListener('click', loadAllUsdtSymbols);

// Initial Load
loadAllUsdtSymbols().then(() => {
    document.getElementById('symbolInput').value = "BTCUSDT";
    fetchAndAnalyze();
});
setInterval(fetchAndAnalyze, 75000);
