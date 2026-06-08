// ==========================================
// DAFTAR KOIN
// ==========================================
const daftarKoin = ['btc_idr', 'eth_idr', 'doge_idr', 'sol_idr', 'xrp_idr', 'ltc_idr', 'arb_idr'];

// ==========================================
// FUNGSI UPDATE TAMPILAN
// ==========================================
async function updateUI() {
    const listDiv = document.getElementById('crypto-list');
    let htmlContent = '';

    for (const pair of daftarKoin) {
        const data = await getIndodaxTicker(pair);
        
        // TES: APAKAH DATA DITERIMA?
        if (data) {
            console.log("Data diterima untuk " + pair, data.last); // Cek ini di Inspect Element -> Console
            
            const hargaSekarang = parseInt(data.last);
            const namaKoin = pair.split('_')[0].toUpperCase();
            
            htmlContent += `
                <div class="row" style="display: flex; justify-content: space-between; margin-bottom: 10px; padding: 10px; border-bottom: 1px solid #333;">
                    <span style="color: #fff; font-weight: bold;">${namaKoin}</span>
                    <span style="color: #fff; font-weight: bold;">
                        Rp ${hargaSekarang.toLocaleString('id-ID')}
                    </span>
                </div>
            `;
        } else {
            console.log("Gagal ambil data untuk " + pair);
        }
    }
    listDiv.innerHTML = htmlContent;
}

// ==========================================
// PEMBARUAN OTOMATIS
// ==========================================
updateUI();
setInterval(updateUI, 10000); // Saya ubah jadi 10 detik agar server Indodax tidak memblokir

