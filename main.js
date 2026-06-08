/**
 * Main Module: Logika UI, render data, interval refresh, dan event handling
 */

// Tunggu DOM siap
document.addEventListener('DOMContentLoaded', () => {
    // Elemen DOM
    const assetsContainer = document.getElementById('assets-container');
    const fearGreedContainer = document.getElementById('fear-greed-container');
    const refreshBtn = document.getElementById('refreshBtn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    // State
    let currentMarketData = null;
    let refreshInterval = null;
    let isLoading = false;
    
    // Konfigurasi refresh interval (10 detik)
    const REFRESH_INTERVAL_MS = 10000;
    
    // Ikon untuk setiap aset (berdasarkan baseAsset)
    const assetIcons = {
        'BTC': 'fa-bitcoin',
        'ETH': 'fa-empire',  // FontAwesome 4 tidak punya ethereum, pakai empire/gg
        'BNB': 'fa-coins',
        'SOL': 'fa-rocket',
        'XRP': 'fa-money'
    };
    
    const assetColors = {
        'BTC': 'primary',
        'ETH': 'secondary',
        'BNB': 'amber',
        'SOL': 'purple',
        'XRP': 'green'
    };
    
    // Helper: dapatkan kelas warna untuk background icon
    function getIconBgColor(asset) {
        const colorMap = {
            'BTC': 'primary',
            'ETH': 'secondary',
            'BNB': 'amber-500',
            'SOL': 'purple-500',
            'XRP': 'green-500'
        };
        return colorMap[asset] || 'primary';
    }
    
    // Render daftar aset ke dalam container
    function renderAssets(assetsData) {
        if (!assetsData) return;
        
        const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT'];
        let html = '';
        
        for (const symbol of symbols) {
            const asset = assetsData[symbol];
            if (!asset) continue;
            
            const baseAsset = asset.baseAsset;
            const iconClass = assetIcons[baseAsset] || 'fa-line-chart';
            const colorTheme = assetColors[baseAsset] || 'primary';
            const isPositive = asset.changeRaw >= 0;
            const priceColorClass = isPositive ? 'text-success' : 'text-danger';
            const changeSymbol = isPositive ? '↑' : '↓';
            
            // Warna background icon gradient (tetap menggunakan kelas Tailwind)
            const bgIconClass = `bg-${colorTheme === 'primary' ? 'primary' : colorTheme === 'secondary' ? 'secondary' : colorTheme === 'amber' ? 'amber-500' : colorTheme === 'purple' ? 'purple-500' : 'green-500'}/20`;
            const iconColorClass = `text-${colorTheme === 'primary' ? 'primary' : colorTheme === 'secondary' ? 'secondary' : colorTheme === 'amber' ? 'amber-400' : colorTheme === 'purple' ? 'purple-400' : 'green-400'}`;
            
            html += `
                <div class="asset-item flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-700/30 transition-all">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full ${bgIconClass} flex items-center justify-center ${iconColorClass}">
                            <i class="fa ${iconClass}"></i>
                        </div>
                        <div>
                            <span class="text-xl font-medium block">${baseAsset}/USDT</span>
                            <span class="text-xs text-gray-400">24h: ${asset.change24h}</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="${priceColorClass} font-semibold text-xl block">$${asset.price}</span>
                        <span class="text-xs ${isPositive ? 'text-success' : 'text-danger'}">${changeSymbol} ${Math.abs(asset.changeRaw).toFixed(2)}%</span>
                    </div>
                </div>
            `;
        }
        
        assetsContainer.innerHTML = html;
    }
    
    // Render Fear & Greed Index
    function renderFearGreed(fgData) {
        if (!fgData) {
            fearGreedContainer.innerHTML = `
                <div class="flex items-center justify-between w-full">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-danger/20 flex items-center justify-center text-danger">
                            <i class="fa fa-exclamation-triangle"></i>
                        </div>
                        <span class="text-lg font-medium">Gagal memuat data</span>
                    </div>
                    <span class="text-xl font-bold">--</span>
                </div>
            `;
            return;
        }
        
        if (fgData.error || fgData.value === null) {
            fearGreedContainer.innerHTML = `
                <div class="flex items-center justify-between w-full">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-gray-500/20 flex items-center justify-center text-gray-400">
                            <i class="fa fa-meh-o"></i>
                        </div>
                        <span class="text-lg font-medium">Tidak tersedia</span>
                    </div>
                    <span class="text-xl font-bold">--</span>
                </div>
            `;
            return;
        }
        
        // Tentukan warna berdasarkan nilai (0-100)
        let colorClass = 'text-success';
        let bgClass = 'bg-success/20';
        if (fgData.value <= 25) {
            colorClass = 'text-danger';
            bgClass = 'bg-danger/20';
        } else if (fgData.value <= 45) {
            colorClass = 'text-orange-400';
            bgClass = 'bg-orange-400/20';
        } else if (fgData.value <= 55) {
            colorClass = 'text-gray-300';
            bgClass = 'bg-gray-500/20';
        } else if (fgData.value <= 75) {
            colorClass = 'text-secondary';
            bgClass = 'bg-secondary/20';
        } else {
            colorClass = 'text-success';
            bgClass = 'bg-success/20';
        }
        
        fearGreedContainer.innerHTML = `
            <div class="flex items-center justify-between w-full">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full ${bgClass} flex items-center justify-center ${colorClass}">
                        <i class="fa fa-bar-chart"></i>
                    </div>
                    <div>
                        <span class="text-lg font-medium">${fgData.classification}</span>
                        <span class="text-xs text-gray-400 block">update: ${fgData.updateTime || 'baru'}</span>
                    </div>
                </div>
                <span class="text-2xl font-bold ${colorClass}">${fgData.value}</span>
            </div>
        `;
    }
    
    // Menampilkan loading state pada assets
    function showLoadingAssets() {
        assetsContainer.innerHTML = `
            <div class="text-center py-8 text-gray-400 loading-pulse">
                <i class="fa fa-spinner fa-spin text-3xl"></i>
                <p class="mt-2">Memuat data pasar...</p>
            </div>
        `;
    }
    
    // Fungsi utama untuk mengambil dan merender semua data
    async function refreshAllData() {
        if (isLoading) return;
        isLoading = true;
        
        // Tampilkan loading hanya jika belum ada data
        if (!currentMarketData) {
            showLoadingAssets();
        }
        
        // Tampilkan indikator refresh pada tombol
        if (refreshBtn) {
            refreshBtn.classList.add('animate-spin');
            setTimeout(() => {
                if (refreshBtn) refreshBtn.classList.remove('animate-spin');
            }, 1000);
        }
        
        try {
            // Ambil data pasar dan Fear & Greed secara paralel
            const [marketData, fearGreed] = await Promise.all([
                HELAYO_API.getMarketData(),
                HELAYO_API.getFearGreedIndex()
            ]);
            
            currentMarketData = marketData;
            renderAssets(currentMarketData);
            renderFearGreed(fearGreed);
            
        } catch (error) {
            console.error('Error refreshing data:', error);
            if (!currentMarketData) {
                assetsContainer.innerHTML = `
                    <div class="text-center py-8 text-danger">
                        <i class="fa fa-warning text-3xl"></i>
                        <p class="mt-2">Gagal memuat data. Cek koneksi internet.</p>
                        <button id="retryLoadBtn" class="mt-4 px-4 py-2 bg-primary rounded-full text-sm">Coba Lagi</button>
                    </div>
                `;
                const retryBtn = document.getElementById('retryLoadBtn');
                if (retryBtn) retryBtn.addEventListener('click', refreshAllData);
            } else {
                // Tampilkan notifikasi error kecil tanpa merusak tampilan
                const toast = document.createElement('div');
                toast.className = 'fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-danger text-white px-4 py-2 rounded-full text-sm z-50 shadow-lg';
                toast.innerText = 'Gagal refresh data, coba lagi nanti';
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 3000);
            }
        } finally {
            isLoading = false;
        }
    }
    
    // Setup navigasi tab (mock / visual feedback)
    function setupTabs() {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Hapus class active dari semua tab
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const tabName = btn.getAttribute('data-tab');
                // Untuk sementara, hanya tampilkan alert (karena ini hanya UI mock)
                // Bisa dikembangkan lebih lanjut untuk konten berbeda
                console.log(`Tab switched to: ${tabName}`);
                // Jika ingin feedback visual:
                const tempMsg = document.createElement('div');
                tempMsg.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-slate-800 text-gray-200 px-4 py-2 rounded-full text-sm z-50 border border-primary/50';
                tempMsg.innerText = `Mode ${tabName} (demo)`;
                document.body.appendChild(tempMsg);
                setTimeout(() => tempMsg.remove(), 1500);
            });
        });
        // Aktifkan tab Home secara default
        const homeTab = document.querySelector('[data-tab="home"]');
        if (homeTab) homeTab.classList.add('active');
    }
    
    // Setup refresh tombol dan interval
    function setupRefresh() {
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                refreshAllData();
            });
        }
        
        // Mulai interval refresh
        if (refreshInterval) clearInterval(refreshInterval);
        refreshInterval = setInterval(refreshAllData, REFRESH_INTERVAL_MS);
    }
    
    // Inisialisasi
    function init() {
        setupTabs();
        setupRefresh();
        // Ambil data pertama kali
        refreshAllData();
    }
    
    // Bersihkan interval saat halaman ditutup (opsional)
    window.addEventListener('beforeunload', () => {
        if (refreshInterval) clearInterval(refreshInterval);
    });
    
    init();
});