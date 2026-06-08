async function fetchIndodax() {
    const listDiv = document.getElementById('crypto-list');
    
    try {
        // Kita gunakan proxy agar browser mengizinkan akses ke API Indodax
        const proxyUrl = 'https://corsproxy.io/?';
        const targetUrl = 'https://indodax.com/api/btc_idr/ticker';
        
        const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
        const data = await response.json();
        
        const price = data.ticker.last;
        
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

fetchIndodax();
setInterval(fetchIndodax, 5000);
