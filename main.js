const daftarKoin = ['btc_idr', 'eth_idr', 'doge_idr', 'sol_idr', 'xrp_idr', 'ltc_idr', 'arb_idr'];

async function updateUI() {
    const listDiv = document.getElementById('crypto-list');
    let html = '';
    
    for (const pair of daftarKoin) {
        try {
            // Menggunakan corsproxy.io sebagai jembatan
            const response = await fetch(`https://corsproxy.io/?https://indodax.com/api/ticker/${pair}`);
            const json = await response.json();
            const harga = parseInt(json.ticker.last);
            const nama = pair.split('_')[0].toUpperCase();
            
            html += `<div style="padding: 10px; border-bottom: 1px solid #333; color: white; display: flex; justify-content: space-between;">
                        <span>${nama}</span> <span>Rp ${harga.toLocaleString('id-ID')}</span>
                     </div>`;
        } catch (e) {
            html += `<div style="padding: 10px; color: red;">Error: ${pair}</div>`;
        }
    }
    listDiv.innerHTML = html;
}

updateUI();
setInterval(updateUI, 15000); // Saya naikkan jadi 15 detik agar tidak dianggap spam
