// ==========================================
// DAFTAR KOIN YANG DIPANTAU
// ==========================================
const daftarKoin = ['btc_idr', 'eth_idr', 'doge_idr', 'sol_idr', 'xrp_idr', 'ltc_idr', 'arb_idr'];

// SIMPAN HARGA SEBELUMNYA UNTUK PERBANDINGAN
let hargaLama = {};

// ==========================================
// FUNGSI UTAMA UNTUK UPDATE TAMPILAN
// ==========================================
async function updateUI() {
    const listDiv = document.getElementById('crypto-list');
    let htmlContent = '';

    for (const pair of daftarKoin) {
        const data = await getIndodaxTicker(pair);
        if (data) {
            const hargaSekarang = parseInt(data.last);
            const namaKoin = pair.split('_')[0].toUpperCase();
            
            // TENTUKAN WARNA BERDASARKAN PERBANDINGAN HARGA
            let warna = '#fff'; // Default putih
            if (hargaLama[pair]) {
                if (hargaSekarang > hargaLama[pair]) warna = '#02c076'; // HIJAU JIKA NAIK
                if (hargaSekarang < hargaLama[pair]) warna = '#cf304a'; // MERAH JIKA TURUN
            }
            
            // UPDATE HARGA LAMA DENGAN HARGA TERKINI
            hargaLama[pair] = hargaSekarang;

            htmlContent += `
                <div class="row" style="display: flex; justify-content: space-between; margin-bottom: 10px; padding: 10px; border-bottom: 1px solid #333;">
                    <span style="color: #fff; font-weight: bold;">${namaKoin}</span>
                    <span style="color: ${warna}; font-weight: bold; transition: color 0.5s;">
                        Rp ${hargaSekarang.toLocaleString('id-ID')}
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

