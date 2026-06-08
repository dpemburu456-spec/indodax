// ==========================================
// DAFTAR KOIN
// ==========================================
const daftarKoin = ['btc_idr', 'eth_idr', 'doge_idr', 'sol_idr', 'xrp_idr', 'ltc_idr', 'arb_idr'];

// ==========================================
// FUNGSI UPDATE TAMPILAN
// ==========================================
async function updateUI() {
    const listDiv = document.getElementById('crypto-list');
    listDiv.innerHTML = ''; // Kosongkan layar

    for (const pair of daftarKoin) {
        const data = await getIndodaxTicker(pair);
        if (data) {
            const hargaSekarang = parseFloat(data.last);
            const hargaLama = parseFloat(sessionStorage.getItem(pair) || hargaSekarang);
            const namaKoin = pair.split('_')[0].toUpperCase();
            
            // TENTUKAN WARNA
            let warna = '#fff';
            if (hargaSekarang > hargaLama) warna = '#02c076'; // HIJAU
            if (hargaSekarang < hargaLama) warna = '#cf304a'; // MERAH
            
            // SIMPAN HARGA SEKARANG
            sessionStorage.setItem(pair, hargaSekarang);

            // TAMPILKAN
            const row = document.createElement('div');
            row.style = "display: flex; justify-content: space-between; margin-bottom: 10px; padding: 10px; border-bottom: 1px solid #333;";
            row.innerHTML = `
                <span style="color: #fff; font-weight: bold;">${namaKoin}</span>
                <span style="color: ${warna}; font-weight: bold;">Rp ${hargaSekarang.toLocaleString('id-ID')}</span>
            `;
            listDiv.appendChild(row);
        }
    }
}

// ==========================================
// JALANKAN PEMBARUAN SETIAP 7 DETIK
// ==========================================
updateUI();
setInterval(updateUI, 7000);
