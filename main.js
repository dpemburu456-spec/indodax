const daftarKoin = ['btc_idr', 'eth_idr', 'doge_idr', 'sol_idr', 'xrp_idr', 'ltc_idr', 'arb_idr'];

async function updateUI() {
    console.log("Mulai update...");
    const listDiv = document.getElementById('crypto-list');
    listDiv.innerHTML = 'Sedang mengambil data...'; 

    let html = '';
    for (const pair of daftarKoin) {
        try {
            // Kita coba fetch langsung di sini supaya yakin
            const response = await fetch(`https://indodax.com/api/ticker/${pair}?t=${Date.now()}`);
            const json = await response.json();
            const harga = parseInt(json.ticker.last);
            const nama = pair.split('_')[0].toUpperCase();
            
            html += `<div style="padding: 10px; border-bottom: 1px solid #333; color: white;">
                        ${nama}: Rp ${harga.toLocaleString('id-ID')}
                     </div>`;
        } catch (e) {
            html += `<div style="padding: 10px; color: red;">Error ${pair}</div>`;
        }
    }
    listDiv.innerHTML = html;
}

updateUI();
setInterval(updateUI, 10000);
