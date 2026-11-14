// ============================================
// CIPUNG STORE — script.js
// ============================================

// --- DATA PAYMENT (DEFAULT) ---
const dataPay = {
    dana:     { name: 'DANA',     num: '08xxxx', img: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg' },
    shopee:   { name: 'ShopeePay', num: '08xxxx', img: 'pay.jpg' },
    gopay:    { name: 'GoPay',    num: '08xxxx', img: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg' },
    ovo:      { name: 'OVO',      num: '08xxxx', img: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg' },
    linkaja:  { name: 'LinkAja',  num: '08xxxx', img: 'link.jpg' },
    sea:      { name: 'BCA',      num: '08xxxx', img: 'bca.jpg' },
    sea2:     { name: 'SeaBank',  num: '08xxxx', img: 'bank.jpg' },
    bri:      { name: 'BRI',      num: '08xxxx', img: 'https://upload.wikimedia.org/wikipedia/commons/6/68/BANK_BRI_logo.svg' },
    pulsa:    { name: 'Telkomsel', num: '08xxxx', img: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Telkomsel_2021_icon.svg' },
    indosat:  { name: 'Indosat',  num: '08xxxx', img: 'indosat.jpg' },
    tri:      { name: 'Tri (3)',  num: '08xxxx', img: 'tri.jpg' },
    smartfren:{ name: 'Smartfren', num: '08xxxx', img: 'smr.jpg' }
};

// --- SOUND ---
const audio = document.getElementById('clickSound');
const playTick = () => { if (audio) { audio.currentTime = 0; audio.play().catch(()=>{}); } };
window.playTick = playTick;

// --- TYPING NAME ---
const txtName = "CIPUNG STORE";
let i = 0;
function typeWriter() {
    const el = document.getElementById('userName');
    if (!el) return;
    if (i < txtName.length) {
        el.innerHTML += txtName.charAt(i);
        i++;
        setTimeout(typeWriter, 80);
    }
}
setTimeout(typeWriter, 500);

// ============================================
// FIREBASE STATE
// ============================================
let FB_READY = false;
let PRODUCTS_CACHE = [];

function waitFirebase() {
    return new Promise(resolve => {
        if (window.FB) return resolve();
        window.addEventListener("firebase-ready", () => resolve(), { once: true });
    });
}

// ============================================
// VISITOR COUNTER GLOBAL
// ============================================
async function initVisitorCounter() {
    const el = document.getElementById("visitorCount");
    if (!el) return;
    await waitFirebase();
    try {
        const { db, doc, getDoc, setDoc, increment } = window.FB;
        const ref = doc(db, "stats", "visitors");
        const snap = await getDoc(ref);
        if (snap.exists()) {
            await setDoc(ref, { count: increment(1) }, { merge: true });
            const updated = await getDoc(ref);
            el.innerText = (updated.data().count || 0).toLocaleString("id-ID");
        } else {
            await setDoc(ref, { count: 1 });
            el.innerText = "1";
        }
    } catch (e) {
        console.error("Visitor error:", e);
        el.innerText = "—";
    }
}
initVisitorCounter();

// ============================================
// STATS TRANSAKSI
// ============================================
async function loadStats() {
    const el = document.getElementById("statTrx");
    if (!el) return;
    await waitFirebase();
    try {
        const { db, collection, getDocs } = window.FB;
        const snap = await getDocs(collection(db, "orders"));
        const count = snap.size;
        if (count >= 1000) el.innerText = (count / 1000).toFixed(1) + "K+";
        else el.innerText = count + "+";
    } catch (e) {
        el.innerText = "0";
    }
}
loadStats();

// ============================================
// PRODUCTS (DARI FIREBASE)
// ============================================
async function loadProducts() {
    const container = document.getElementById("productList");
    if (!container) return;
    await waitFirebase();

    const { db, collection, getDocs } = window.FB;
    try {
        const snap = await getDocs(collection(db, "products"));
        PRODUCTS_CACHE = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
        renderProducts();
    } catch (e) {
        console.error("Load products error:", e);
        container.innerHTML = `<div style="text-align:center;padding:40px;color:#888;">
            <i class="ri-error-warning-line" style="font-size:32px;color:#ef4444;"></i>
            <p style="margin-top:10px;font-size:12px;">Gagal memuat produk. Periksa koneksi atau database.</p>
        </div>`;
    }
}

function renderProducts() {
    const container = document.getElementById("productList");
    if (!container) return;
    if (PRODUCTS_CACHE.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:40px;color:#888;">
            <i class="ri-shopping-bag-line" style="font-size:32px;"></i>
            <p style="margin-top:10px;font-size:12px;">Belum ada produk.</p>
        </div>`;
        return;
    }
    container.innerHTML = PRODUCTS_CACHE.map(product => {
        const statusClass = product.ready ? "ready" : "sold";
        const statusText = product.ready ? "● READY" : "● HABIS";
        return `
        <div class="product-card">
            <div class="product-image-wrap">
                <img src="${product.image || 'https://placehold.co/800x500?text=Produk'}" class="product-image" alt="${product.name}"
                     onerror="this.src='https://placehold.co/800x500?text=Produk'">
                <div class="product-status ${statusClass}">${statusText}</div>
            </div>
            <div class="product-content">
                <div class="product-name">${product.name}</div>
                <div class="product-price">${formatRupiah(product.price)}</div>
                <div class="product-description">${product.description || ""}</div>
                <div class="product-detail">
                    <div class="product-detail-title">DETAIL PRODUK</div>
                    <div class="product-detail-text">${(product.detail || "").replace(/\n/g, "<br>")}</div>
                </div>
                <div class="product-actions">
                    <button class="product-btn btn-question" onclick="askProduct('${product._id}')">
                        <i class="ri-question-line"></i> Tanya
                    </button>
                    ${product.ready
                        ? `<button class="product-btn btn-buy" onclick="buyProduct('${product._id}')">
                             <i class="ri-shopping-cart-2-line"></i> Beli Sekarang
                           </button>`
                        : `<button class="product-btn btn-disabled" disabled>
                             <i class="ri-close-circle-line"></i> Stok Habis
                           </button>`}
                </div>
            </div>
        </div>`;
    }).join("");
}

function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency", currency: "IDR", maximumFractionDigits: 0
    }).format(number);
}

// ============================================
// WHATSAPP HELPER
// ============================================
function openWhatsApp(message, phone) {
    const num = phone || "6285216704274"; // Ganti nomor WA kamu di sini
    window.open("https://wa.me/" + num + "?text=" + encodeURIComponent(message), "_blank");
}

// ============================================
// BELI PRODUK (Simpan ke Database)
// ============================================
window.buyProduct = async function(id) {
    const product = PRODUCTS_CACHE.find(p => p._id === id);
    if (!product || !product.ready) return;
    playTick();

    await waitFirebase();
    try {
        const { db, collection, addDoc, serverTimestamp } = window.FB;
        await addDoc(collection(db, "orders"), {
            productId: product._id,
            productName: product.name,
            price: product.price,
            status: "pending",
            createdAt: serverTimestamp()
        });
    } catch (e) {
        console.error("Order save error:", e);
    }

    const message =
`Halo Admin CIPUNG STORE 👋

Saya ingin membeli produk:

📦 Produk:
${product.name}

💰 Harga:
${formatRupiah(product.price)}

Saya siap melakukan pembayaran.

Mohon info proses selanjutnya 🙏`;
    openWhatsApp(message);
};

// ============================================
// TANYA PRODUK
// ============================================
window.askProduct = function(id) {
    const product = PRODUCTS_CACHE.find(p => p._id === id);
    if (!product) return;
    playTick();
    const message =
`Halo Admin CIPUNG STORE 👋

Saya ingin bertanya mengenai produk:

📦 Produk:
${product.name}

💰 Harga:
${formatRupiah(product.price)}

Apakah produk tersebut masih tersedia?

Terima kasih 🙏`;
    openWhatsApp(message);
};

// ============================================
// NOTIFIKASI SYSTEM
// ============================================
let notifCount = 0;
const notifBadge = document.getElementById('notifBadge');
const notifContainer = document.getElementById('notifList');

function addLog(actionName) {
    notifCount++;
    if (notifBadge) {
        notifBadge.innerText = notifCount;
        notifBadge.classList.add('show');
    }
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    if (notifContainer.querySelector('.empty-state')) notifContainer.innerHTML = '';
    const item = document.createElement('div');
    item.className = 'notif-item';
    item.innerHTML = `
        <div class="ni-icon"><i class="ri-file-list-3-line"></i></div>
        <div class="ni-text">
            <h5>Membuka Menu: ${actionName}</h5>
            <p>Tercatat pada ${time}</p>
        </div>`;
    notifContainer.prepend(item);
}

window.toggleNotifPanel = function() {
    playTick();
    const p = document.getElementById('notifPanel');
    p.classList.toggle('active');
    if (p.classList.contains('active')) {
        notifCount = 0;
        if (notifBadge) notifBadge.classList.remove('show');
    }
};

// ============================================
// SHEET LOGIC (PEMBAYARAN)
// ============================================
const sheet = document.getElementById('sheet');
const list = document.getElementById('sheetList');
const title = document.getElementById('sheetTitle');

function rowHtml(key) {
    const d = dataPay[key];
    const imgUrl = d.img || 'https://placehold.co/100';
    return `
    <div class="pay-item">
        <div class="pi-left">
            <img src="${imgUrl}" class="pi-img" onerror="this.src='https://placehold.co/100'">
            <div class="pi-info">
                <h5>${d.name}</h5>
                <p id="t-${key}">${d.num}</p>
            </div>
        </div>
        <button class="btn-action ripple" onclick="copyIt('t-${key}', '${d.name}')">
            <i class="ri-file-copy-line"></i>
        </button>
    </div>`;
}

window.openSheet = (mode) => {
    playTick();
    const bottomNav = document.querySelector(".bottom-nav");
    if (bottomNav) bottomNav.style.display = "none";

    let html = '';
    let logName = '';

    if (mode === 'qris') {
        title.innerText = "SCAN QRIS";
        logName = "QRIS Payment";
        html = `<div class="qris-display">
            <img src="qr8.jpg" style="width:100%; max-width:220px; border-radius:10px;">
            <p style="margin-top:10px; font-size:12px; color:#555;">Support All E-Wallet & Bank</p>
        </div>`;
    } else if (mode === 'dana_only') {
        title.innerText = "E-WALLET";
        logName = "Menu E-Wallet";
        ['dana','shopee','gopay','ovo','linkaja'].forEach(k => html += rowHtml(k));
    } else if (mode === 'bank') {
        title.innerText = "TRANSFER BANK";
        logName = "Menu Bank";
        ['sea','sea2','bri'].forEach(k => html += rowHtml(k));
    } else if (mode === 'pulsa') {
        title.innerText = "TOP UP PULSA";
        logName = "Menu Pulsa";
        ['pulsa','indosat','tri','smartfren'].forEach(k => html += rowHtml(k));
    } else {
        title.innerText = "SEMUA METODE";
        logName = "Semua Menu";
        Object.keys(dataPay).forEach(k => html += rowHtml(k));
    }

    addLog(logName);
    list.innerHTML = html;
    sheet.classList.add('active');
};

document.getElementById('btnCloseSheet').onclick = () => {
    sheet.classList.remove('active');
    const bottomNav = document.querySelector(".bottom-nav");
    if (bottomNav) bottomNav.style.display = "flex";
    playTick();
};

window.copyIt = (id, label) => {
    playTick();
    const txt = document.getElementById(id).innerText;
    if (txt.includes('Hubungi')) return;
    navigator.clipboard.writeText(txt);
    showToast(label + ' berhasil disalin!');
};

// ============================================
// CHAT LIVE SUPPORT
// ============================================
const fab = document.getElementById('fabChat');
const win = document.getElementById('chatWin');
const closeC = document.getElementById('closeChat');
const bodyC = document.getElementById('chatBody');

if (fab && win && closeC) {
    fab.onclick = () => { playTick(); win.classList.add('active'); fab.style.transform = 'scale(0)'; };
    closeC.onclick = () => { playTick(); win.classList.remove('active'); fab.style.transform = 'scale(1)'; };
}

window.sendChat = (msg) => {
    playTick();
    const u = document.createElement('div');
    u.className = 'bubble b-user';
    u.innerText = msg;
    bodyC.appendChild(u);
    bodyC.scrollTop = bodyC.scrollHeight;
    setTimeout(() => {
        const b = document.createElement('div');
        b.className = 'bubble b-bot';
        if (msg === 'konfirmasi') b.innerHTML = "✅ Konfirmasi Pembayaran Untuk mempercepat proses, mohon kirimkan bukti transfer kepada admin.";
        else if (msg === 'admin') b.innerHTML = "📞 Hubungi Admin Untuk konfirmasi pembayaran atau informasi lebih lanjut, silakan hubungi admin melalui WhatsApp: 085216704274 Terima kasih.";
        else b.innerHTML = "⚠️ Ada Kendala? Kalau pembayaran bermasalah, tunggu sebentar ya. Masih error? Langsung chat admin biar dibantu.";
        bodyC.appendChild(b);
        bodyC.scrollTop = bodyC.scrollHeight;
        playTick();
    }, 800);
};

// ============================================
// RIPPLE EFFECT
// ============================================
document.addEventListener('click', e => {
    const btn = e.target.closest('.ripple');
    if (btn) {
        const c = document.createElement('span');
        const d = Math.max(btn.clientWidth, btn.clientHeight);
        c.style.width = c.style.height = d + 'px';
        c.style.left = (e.clientX - btn.getBoundingClientRect().left - d/2) + 'px';
        c.style.top = (e.clientY - btn.getBoundingClientRect().top - d/2) + 'px';
        btn.appendChild(c);
        setTimeout(() => c.remove(), 600);
    }
});

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'toast-wanz';
    t.innerText = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
}
window.showToast = showToast;

// ============================================
// LOADER
// ============================================
window.addEventListener('load', () => {
    setTimeout(() => {
        const l = document.getElementById('loaderWanz');
        if (l) l.style.display = 'none';
    }, 1500);
});

// ============================================
// POSTER SLIDER (OTOMATIS DARI ADMIN)
// ============================================
let posterIndex = 0;
let sliderInterval = null;

function startPosterSlider() {
    if (sliderInterval) clearInterval(sliderInterval);
    sliderInterval = setInterval(() => {
        const posters = document.querySelectorAll('.poster-img');
        if (posters.length <= 1) return;

        posters[posterIndex].classList.remove('active');
        posterIndex = (posterIndex + 1) % posters.length;
        posters[posterIndex].classList.add('active');
    }, 5000);
}
startPosterSlider();

// ============================================
// THEME TOGGLE
// ============================================
const themeBtn = document.getElementById("themeBtn");
if (themeBtn) {
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-mode");
        themeBtn.querySelector("i").className = "ri-moon-line";
    }
    themeBtn.onclick = () => {
        document.body.classList.toggle("light-mode");
        const icon = themeBtn.querySelector("i");
        if (document.body.classList.contains("light-mode")) {
            icon.className = "ri-moon-line";
            localStorage.setItem("theme", "light");
        } else {
            icon.className = "ri-sun-line";
            localStorage.setItem("theme", "dark");
        }
    };
}

// ============================================
// BACKGROUND MUSIC
// ============================================
const musicBtn = document.getElementById("musicBtn");
const bgMusic = document.getElementById("bgMusic");
let musicOn = localStorage.getItem("wanzMusic") === "on";

function updateMusicButton() {
    if (!musicBtn) return;
    const icon = musicBtn.querySelector("i");
    icon.className = musicOn ? "ri-volume-up-line" : "ri-volume-mute-line";
}

if (musicBtn && bgMusic) {
    musicBtn.onclick = () => {
        if (musicOn) {
            bgMusic.pause();
            musicOn = false;
            localStorage.setItem("wanzMusic", "off");
        } else {
            bgMusic.play().then(() => {
                musicOn = true;
                localStorage.setItem("wanzMusic", "on");
                updateMusicButton();
            }).catch(() => {
                musicOn = false;
                updateMusicButton();
            });
        }
        updateMusicButton();
    };
    updateMusicButton();
}

// ============================================
// PAGE NAVIGATION
// ============================================
window.showPage = function(page, button) {
    const home = document.getElementById("homePage");
    const info = document.getElementById("infoPage");
    const links = document.getElementById("linksPage");
    const shop = document.getElementById("shopPage");

    document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
    if (button) button.classList.add("active");

    if(home) home.style.display = "none";
    if(info) info.classList.remove("active");
    if(links) links.classList.remove("active");
    if(shop) shop.classList.remove("active");

    if (page === "home" && home) home.style.display = "";
    else if (page === "shop" && shop) { shop.classList.add("active"); loadProducts(); }
    else if (page === "info" && info) info.classList.add("active");
    else if (page === "links" && links) links.classList.add("active");
};

// ============================================
// LOAD PENGATURAN PEMBAYARAN & GAMBAR DARI DATABASE
// ============================================
async function loadPaymentSettings() {
    await waitFirebase();
    try {
        const { db, doc, getDoc } = window.FB;
        const snap = await getDoc(doc(db, "settings", "payments"));
        
        if (snap.exists()) {
            const data = snap.data();
            
            // 1. Update Nomor Pembayaran
            Object.keys(data).forEach(key => {
                if (dataPay[key] && data[key] && !key.startsWith('banner') && key !== 'logo') {
                    dataPay[key].num = data[key];
                }
            });

            // 2. Update Logo Profil (Home & Links)
            if (data.logo) {
                const pImg = document.querySelector('.p-img');
                const linksImg = document.querySelector('.links-avatar-wrap img');
                if (pImg) pImg.src = data.logo;
                if (linksImg) linksImg.src = data.logo;
            }

            // 3. Update Banner (Poster Slider)
            const posterContainer = document.querySelector('.poster-slider');
            if (posterContainer) {
                let bannerHtml = '';
                let hasBanner = false;

                for (let i = 1; i <= 5; i++) {
                    if (data['banner' + i]) {
                        hasBanner = true;
                        const activeClass = i === 1 ? 'active' : '';
                        bannerHtml += `<img src="${data['banner' + i]}" class="poster-img ${activeClass}" alt="Banner ${i}" />`;
                    }
                }

                if (hasBanner) {
                    posterContainer.innerHTML = bannerHtml;
                    posterIndex = 0;
                    startPosterSlider();
                }
            }
            console.log("Data pengaturan berhasil dimuat dari database.");
        }
    } catch (e) {
        console.error("Gagal load setting pembayaran:", e);
    }
}

// ============================================
// INIT SEMUA FITUR SAAT HALAMAN DIBUKA
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    loadPaymentSettings();
});

// ============================================
// EASTER EGG: TOMBOL RAHASIA ADMIN
// (Klik logo "CIPUNG STORE" 5x dengan cepat)
// ============================================
let logoClickCount = 0;
let logoTimer;

document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo-wanz');
    
    if (logo) {
        logo.addEventListener('click', () => {
            logoClickCount++;
            
            clearTimeout(logoTimer);
            logoTimer = setTimeout(() => {
                logoClickCount = 0;
            }, 1500);

            logo.style.transform = 'scale(0.95)';
            setTimeout(() => logo.style.transform = 'scale(1)', 100);

            if (logoClickCount >= 5) {
                logoClickCount = 0;
                playTick();
                showToast('🔓 Membuka Admin Panel...');
                
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 1000);
            }
        });
    }
});
