// ==========================================
// FUNGSI UPDATE TAMPILAN (VERSI MOBILE FRIENDLY)
// ==========================================
async function updateUI() {
    const listDiv = document.getElementById('crypto-list');
    
    // Hapus isi lama sebelum memasukkan yang baru
    listDiv.innerHTML = ''; 

    for (const pair of daftarKoin) {
        const data = await getIndodaxTicker(pair);
        if (data) {
            const hargaSekarang = parseInt(data.last);
            const namaKoin = pair.split('_')[0].toUpperCase();
            
            // CEK HARGA LAMA DARI SESSION STORAGE
            let hargaLama = sessionStorage.getItem(pair);
            let warna = '#fff';
            
            if (hargaLama) {
                if (hargaSekarang > parseInt(hargaLama)) warna = '#02c076'; // HIJAU
                if (hargaSekarang < parseInt(hargaLama)) warna = '#cf304a'; // MERAH
            }
            
            // SIMPAN HARGA BARU
            sessionStorage.setItem(pair, hargaSekarang);

            // BUAT ELEMEN BARU
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
