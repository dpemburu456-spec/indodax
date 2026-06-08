window.HELAYO_API = {
    async fetchTopCoins(limit = 100) { // Sudah saya set jadi 100
        const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1`);
        return await res.json();
    }
};
