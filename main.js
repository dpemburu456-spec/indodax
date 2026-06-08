// ==========================================
// DAFTAR KOIN YANG DIPANTAU
// ==========================================
const daftarKoin = ['btc_idr', 'eth_idr', 'doge_idr', 'sol_idr', 'xrp_idr', 'ltc_idr', 'arb_idr'];

// ==========================================
// FUNGSI UTAMA UNTUK UPDATE TAMPILAN
// ==========================================
async function updateUI() {
    const listDiv = document.getElementById('crypto-list');
    let htmlContent = '';

    for (const pair of daftarKoin) {
        const data = await getIndodaxTicker(pair);
        if (data) {
            const namaKoin = pair.split('_')[0].toUpperCase();
            htmlContent += `
                <div class="row" style="display: flex; justify-content: space-between; margin-bottom: 10px; padding: 10px; border-bottom: 1px solid #333;">
                    <span style="color: #fff; font-weight: bold;">${namaKoin}</span>
                    <span style="color: #02c076; font-weight: bold;">
                        Rp ${parseInt(data.last).toLocaleString('id-ID')}
                    </span>
                </div>
            `;
        }
    }
    listDiv.innerHTML = htmlContent;
}

// ==========================================
// PEMBARUAN DATA OTOMATIS SETIAP 5 DETIK
// ==========================================
updateUI();
setInterval(updateUI, 5000);
