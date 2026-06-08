import { getCryptoData } from './api.js';
import { renderCrypto } from './ui.js';

async function init() {
    const data = await getCryptoData();
    renderCrypto(data);
}

init();
