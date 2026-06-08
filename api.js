async function getIndodaxTicker(pair) {
    try {
        const response = await fetch(`https://indodax.com/api/ticker/${pair}?t=${Date.now()}`);
        const data = await response.json();
        return data.ticker;
    } catch (error) {
        return null;
    }
}

