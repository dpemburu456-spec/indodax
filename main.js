async function updateUI() {
    const listDiv = document.getElementById('crypto-list');
    // Jika masih ada tulisan memuat, hapus dulu
    if (listDiv.innerHTML.includes('Memuat data')) {
        listDiv.innerHTML = '';
    }
    
    // ... (sisanya kode yang sebelumnya)
}



const daftarKoin = ['btc_idr', 'eth_idr', 'doge_idr', 'sol_idr', 'xrp_idr', 'ltc_idr', 'arb_idr'];

async function updateUI() {
    const listDiv = document.getElementById('crypto-list');
    
    // BAGIAN INI UNTUK MENGHAPUS TULISAN "MEMUAT DATA"
    if (listDiv.innerHTML.includes('Memuat data')) {
        listDiv.innerHTML = '';
    }

    for (const pair of daftarKoin) {
        const data = await getIndodaxTicker(pair);
        if (data) {
            const harga = parseInt(data.last);
            const nama = pair.split('_')[0].toUpperCase();
            
            let row = document.getElementById('row-' + pair);
            if (!row) {
                row = document.createElement('div');
                row.id = 'row-' + pair;
                row.style = "display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #333;";
                listDiv.appendChild(row);
            }
            
            const hargaLama = sessionStorage.getItem('price-' + pair);
            let warna = '#fff';
            if (hargaLama) {
                if (harga > parseInt(hargaLama)) warna = '#02c076';
                if (harga < parseInt(hargaLama)) warna = '#cf304a';
            }
            
            row.innerHTML = `
                <span style="color: #fff; font-weight: bold;">${nama}</span>
                <span style="color: ${warna}; font-weight: bold;">Rp ${harga.toLocaleString('id-ID')}</span>
            `;
            
            sessionStorage.setItem('price-' + pair, harga);
        }
    }
}

updateUI();
setInterval(updateUI, 7000);
