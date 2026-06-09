// 1. Ambil data dari LocalStorage saat load
let savedBotToken = localStorage.getItem('tg_bot_token') || "";
let savedChatId = localStorage.getItem('tg_chat_id') || "";

// Isi input dengan data tersimpan jika ada
document.getElementById('inputBotToken').value = savedBotToken;
document.getElementById('inputChatId').value = savedChatId;

// 2. Fungsi Simpan
document.getElementById('saveConfigBtn').addEventListener('click', () => {
    const token = document.getElementById('inputBotToken').value.trim();
    const chat = document.getElementById('inputChatId').value.trim();
    
    if(!token || !chat) {
        alert("Mohon isi Token dan Chat ID dengan benar!");
        return;
    }
    
    localStorage.setItem('tg_bot_token', token);
    localStorage.setItem('tg_chat_id', chat);
    
    savedBotToken = token;
    savedChatId = chat;
    alert("✅ Konfigurasi tersimpan!");
});

// 3. Update fungsi kirim agar menggunakan data yang tersimpan secara dinamis
async function sendTelegramMessage(message) {
    if (!savedBotToken || !savedChatId) {
        alert("⚠️ Konfigurasi Telegram belum diisi di menu Settings!");
        return { ok: false };
    }
    
    const url = `https://api.telegram.org/bot${savedBotToken}/sendMessage`;
    const payload = { chat_id: savedChatId, text: message, parse_mode: "HTML" };
    
    try {
        const response = await fetch(url, { 
            method: "POST", 
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify(payload) 
        });
        return await response.json();
    } catch (err) {
        console.error("Error:", err);
        return { ok: false };
    }
}
