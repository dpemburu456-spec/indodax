const daftarKoin = ['btc_idr', 'eth_idr', 'doge_idr', 'sol_idr', 'xrp_idr', 'ltc_idr', 'arb_idr'];

async function updateUI() {
    const listDiv = document.getElementById('crypto-list');
    
    // Tampilkan pesan loading jika kosong
    if (listDiv.innerHTML === '') {
        listDiv.innerHTML = '<div style="color: #888; text-align: center;">Memuat data...</div>';
    }

    for (const pair of daftarKoin) {
        const data = await getIndodaxTicker(pair);
        if (data) {
            const harga = parseInt(data.last);
            const nama = pair.split('_')[0].toUpperCase();
            
            // Cari elemen koinnya, kalau belum ada, buat baru
            let row = document.getElementById('row-' + pair);
            if (!row) {
                row = document.createElement('div');
                row.id = 'row-' + pair;
                row.style = "display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #333;";
                listDiv.appendChild(row);
            }
            
            // Cek harga lama untuk warna
            const hargaLama = sessionStorage.getItem('price-' + pair);
            let warna = '#fff';
            if (hargaLama) {
                if (harga > parseInt(hargaLama)) warna = '#02c076';
                if (harga < parseInt(hargaLama)) warna = '#cf304a';
            }
            
            // Update isi baris
            row.innerHTML = `
                <span style="color: #fff; font-weight: bold;">${nama}</span>
                <span style="color: ${warna}; font-weight: bold;">Rp ${harga.toLocaleString('id-ID')}</span>
            `;
            
            // Simpan harga baru
            sessionStorage.setItem('price-' + pair, harga);
        }
    }
}

// Jalankan
updateUI();
setInterval(updateUI, 7000);
