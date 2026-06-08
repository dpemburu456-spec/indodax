// main.js
async function updateUI() {
    const listDiv = document.getElementById('crypto-list');
    
    // Kita panggil fungsi dari api.js
    const btcData = await getIndodaxTicker('btc_idr');
    
    if (btcData) {
        listDiv.innerHTML = `
            <div class="row">
                <span>Bitcoin (BTC)</span>
                <span style="color: #02c076; font-weight: bold;">
                    Rp ${parseInt(btcData.last).toLocaleString('id-ID')}
                </span>
            </div>
        `;
    } else {
        listDiv.innerHTML = "<p style='color: #cf304a;'>Gagal memuat data.</p>";
    }
}

// Jalankan update setiap 5 detik
updateUI();
setInterval(updateUI, 5000);

