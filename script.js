async function fetchIndodax() {
    const listDiv = document.getElementById('crypto-list');
    
    try {
        // Mengambil data ticker BTC/IDR dari API Publik Indodax
        const response = await fetch('https://indodax.com/api/btc_idr/ticker');
        const data = await response.json();
        
        const price = data.ticker.last;
        
        // Menampilkan harga ke HTML
        listDiv.innerHTML = `
            <div class="row">
                <span>Bitcoin (BTC)</span>
                <span style="color: #02c076; font-weight: bold;">
                    Rp ${parseInt(price).toLocaleString('id-ID')}
                </span>
            </div>
        `;
    } catch (error) {
        listDiv.innerHTML = "<p style='color: #cf304a;'>Gagal memuat data. Periksa koneksi.</p>";
        console.error("Error:", error);
    }
}

// Jalankan saat halaman dimuat
fetchIndodax();

// Refresh harga otomatis setiap 5 detik
setInterval(fetchIndodax, 5000);
