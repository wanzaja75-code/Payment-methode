// --- DATA PAYMENT (UPDATED) ---
const dataPay = {
    // E-Wallet
    dana: { name: 'DANA', num: '08xxxx', img: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg' },
    shopee: { name: 'ShopeePay', num: '08xxxx', img: 'pay.jpg' },
    gopay: { name: 'GoPay', num: '08xxxx', img: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg' },
    ovo: { name: 'OVO', num: '08xxxx', img: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg' },
    linkaja: { name: 'LinkAja', num: '08xxxx', img: 'link.jpg' },
    
    // Bank
    sea: { name: 'BCA', num: '08xxxx', img: 'bca.jpg' },
    sea2: { name: 'SeaBank', num: '08xxxx', img: 'bank.jpg' },
    bri: { name: 'BRI', num: '08xxxx', img: 'https://upload.wikimedia.org/wikipedia/commons/6/68/BANK_BRI_logo.svg' },

    // Pulsa
    pulsa: { name: 'Telkomsel', num: '08xxxx', img: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Telkomsel_2021_icon.svg' },
    indosat: { name: 'Indosat', num: '08xxxx', img: 'indosat.jpg' },
    tri: { name: 'Tri (3)', num: '08xxxx', img: 'tri.jpg' },
    smartfren: { name: 'Smartfren', num: '08xxxx', img: 'smr.jpg' }
};

// --- SOUND & UTILS ---
const audio = document.getElementById('clickSound');
const playTick = () => { audio.currentTime = 0; audio.play().catch(()=>{}); };

// --- TYPING NAME ---
const txtName = "WANZ TECNICAL";
let i = 0;
function typeWriter() {
    if(i < txtName.length) {
        document.getElementById('userName').innerHTML += txtName.charAt(i);
        i++; setTimeout(typeWriter, 80);
    }
}
setTimeout(typeWriter, 500);

// --- NOTIFICATION SYSTEM (REALTIME) ---
let notifCount = 0;
const notifBadge = document.getElementById('notifBadge');
const notifContainer = document.getElementById('notifList');

function addLog(actionName) {
    notifCount++;
    notifBadge.innerText = notifCount;
    notifBadge.classList.add('show');
    
    const time = new Date().toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'});
    
    if(notifContainer.querySelector('.empty-state')) {
        notifContainer.innerHTML = '';
    }

    const item = document.createElement('div');
    item.className = 'notif-item';
    item.innerHTML = `
        <div class="ni-icon"><i class="ri-file-list-3-line"></i></div>
        <div class="ni-text">
            <h5>Membuka Menu: ${actionName}</h5>
            <p>Tercatat pada ${time}</p>
        </div>
    `;
    notifContainer.prepend(item);
}

function toggleNotifPanel() {
    playTick();
    const p = document.getElementById('notifPanel');
    p.classList.toggle('active');
    if(p.classList.contains('active')) {
        notifCount = 0;
        notifBadge.classList.remove('show');
    }
}

// --- SHEET LOGIC ---
const sheet = document.getElementById('sheet');
const list = document.getElementById('sheetList');
const title = document.getElementById('sheetTitle');

function rowHtml(key) {
    const d = dataPay[key];
    const imgUrl = d.img ? d.img : 'https://placehold.co/100'; 
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
        </div>
    `;
}

// --- UPDATED openSheet FUNCTION WITH BOTTOM NAV CONTROL ---
window.openSheet = (mode) => {
    playTick();
    
    // Sembunyikan bottom navigation saat sheet dibuka
    const bottomNav = document.querySelector(".bottom-nav");
    if (bottomNav) {
        bottomNav.style.display = "none";
    }
    
    let html = '';
    let logName = '';

    if(mode === 'qris') {
        title.innerText = "SCAN QRIS";
        logName = "QRIS Payment";
        html = `
            <div class="qris-display">
                <img src="qr8.jpg" style="width:100%; max-width:220px; border-radius:10px;">
                <p style="margin-top:10px; font-size:12px; color:#555;">Support All E-Wallet & Bank</p>
            </div>`;
    } else if(mode === 'dana_only') {
        title.innerText = "E-WALLET";
        logName = "Menu E-Wallet";
        html += rowHtml('dana');
        html += rowHtml('shopee');
        html += rowHtml('gopay');
        html += rowHtml('ovo');
        html += rowHtml('linkaja');
    } else if(mode === 'bank') {
        title.innerText = "TRANSFER BANK";
        logName = "Menu Bank";
        html += rowHtml('sea');
        html += rowHtml('sea2');
        html += rowHtml('bri');
    } else if(mode === 'pulsa') {
        title.innerText = "TOP UP PULSA";
        logName = "Menu Pulsa";
        html += rowHtml('pulsa');
        html += rowHtml('indosat');
        html += rowHtml('tri');
        html += rowHtml('smartfren');
    } else {
        title.innerText = "SEMUA METODE";
        logName = "Semua Menu";
        Object.keys(dataPay).forEach(k => html += rowHtml(k));
    }
    
    addLog(logName);
    list.innerHTML = html;
    sheet.classList.add('active');
};

// --- UPDATED CLOSE SHEET WITH BOTTOM NAV CONTROL ---
document.getElementById('btnCloseSheet').onclick = () => {
    sheet.classList.remove('active');
    
    // Tampilkan kembali bottom navigation saat sheet ditutup
    const bottomNav = document.querySelector(".bottom-nav");
    if (bottomNav) {
        bottomNav.style.display = "flex";
    }
    
    playTick();
};

// --- COPY ---
window.copyIt = (id, label) => {
    playTick();
    const txt = document.getElementById(id).innerText;
    if(txt.includes('Hubungi')) return;
    navigator.clipboard.writeText(txt);
    showToast(label + ' berhasil disalin!');
};

// --- CHAT SYSTEM ---
const fab = document.getElementById('fabChat');
const win = document.getElementById('chatWin');
const closeC = document.getElementById('closeChat');
const bodyC = document.getElementById('chatBody');

fab.onclick = () => { playTick(); win.classList.add('active'); fab.style.transform = 'scale(0)'; };
closeC.onclick = () => { playTick(); win.classList.remove('active'); fab.style.transform = 'scale(1)'; };

window.sendChat = (msg) => {
    playTick();
    const u = document.createElement('div');
    u.className = 'bubble b-user'; u.innerText = msg;
    bodyC.appendChild(u);
    bodyC.scrollTop = bodyC.scrollHeight;
    
    setTimeout(() => {
        const b = document.createElement('div');
        b.className = 'bubble b-bot';
        if(msg === 'konfirmasi') b.innerHTML = "✅ Konfirmasi Pembayaran Untuk mempercepat proses, mohon kirimkan bukti transfer kepada admin.";
        else if(msg === 'admin') b.innerHTML = "📞 Hubungi Admin Untuk konfirmasi pembayaran atau informasi lebih lanjut, silakan hubungi admin melalui WhatsApp: 085216704274 Terima kasih.";
        else b.innerHTML = "⚠️ Ada Kendala? Kalau pembayaran bermasalah, tunggu sebentar ya. Masih error? Langsung chat admin biar dibantu.";
        bodyC.appendChild(b);
        bodyC.scrollTop = bodyC.scrollHeight;
        playTick();
    }, 800);
};

// --- RIPPLE FX ---
document.addEventListener('click', e => {
    const btn = e.target.closest('.ripple');
    if(btn) {
        const c = document.createElement('span');
        const d = Math.max(btn.clientWidth, btn.clientHeight);
        c.style.width = c.style.height = d + 'px';
        c.style.left = (e.clientX - btn.getBoundingClientRect().left - d/2) + 'px';
        c.style.top = (e.clientY - btn.getBoundingClientRect().top - d/2) + 'px';
        btn.appendChild(c);
        setTimeout(()=>c.remove(), 600);
    }
});

function showToast(msg){
    const t=document.createElement('div');
    t.className='toast-wanz';
    t.innerText=msg;
    document.body.appendChild(t);
    setTimeout(()=>t.remove(),2500);
}

window.addEventListener('load',()=>{
    setTimeout(()=>{
        const l=document.getElementById('loaderWanz');
        if(l) l.style.display='none';
    },1500);
});

let posterIndex = 0;

setInterval(() => {
    const posters = document.querySelectorAll('.poster-img');
    posters[posterIndex].classList.remove('active');
    posterIndex++;
    if (posterIndex >= posters.length) {
        posterIndex = 0;
    }
    posters[posterIndex].classList.add('active');
}, 5000);

const themeBtn = document.getElementById("themeBtn");

if(themeBtn){
    if(localStorage.getItem("theme") === "light"){
        document.body.classList.add("light-mode");
        themeBtn.querySelector("i").className = "ri-moon-line";
    }

    themeBtn.onclick = () => {
        document.body.classList.toggle("light-mode");
        const icon = themeBtn.querySelector("i");
        if(document.body.classList.contains("light-mode")){
            icon.className = "ri-moon-line";
            localStorage.setItem("theme","light");
        }else{
            icon.className = "ri-sun-line";
            localStorage.setItem("theme","dark");
        }
    };
}

// VISITOR COUNTER
let visitors = localStorage.getItem("wanzVisitors");
if (!visitors) {
    visitors = 1;
} else {
    visitors = parseInt(visitors) + 1;
}
localStorage.setItem("wanzVisitors", visitors);

const visitorCount = document.getElementById("visitorCount");
if (visitorCount) {
    visitorCount.innerText = visitors.toLocaleString("id-ID");
}

// BACKGROUND MUSIC
const musicBtn = document.getElementById("musicBtn");
const bgMusic = document.getElementById("bgMusic");

let musicOn = localStorage.getItem("wanzMusic") === "on";

function updateMusicButton(){
    const icon = musicBtn.querySelector("i");
    if(musicOn){
        icon.className = "ri-volume-up-line";
    }else{
        icon.className = "ri-volume-mute-line";
    }
}

musicBtn.onclick = () => {
    if(musicOn){
        bgMusic.pause();
        musicOn = false;
        localStorage.setItem("wanzMusic","off");
    }else{
        bgMusic.play().then(() => {
            musicOn = true;
            localStorage.setItem("wanzMusic","on");
            updateMusicButton();
        }).catch(() => {
            musicOn = false;
            updateMusicButton();
        });
    }
    updateMusicButton();
};

updateMusicButton();

// =========================
// PAGE NAVIGATION (UPDATED WITH SHOP)
// =========================

window.showPage = function(page, button){

    const home = document.querySelector(".content-area");
    const info = document.getElementById("infoPage");
    const links = document.getElementById("linksPage");
    const shop = document.getElementById("shopPage");

    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
    });

    if(button){
        button.classList.add("active");
    }

    home.style.display = "none";

    info.classList.remove("active");
    links.classList.remove("active");
    shop.classList.remove("active");


    if(page === "home"){

        home.style.display = "";

    }

    else if(page === "shop"){

        shop.classList.add("active");

        // Pastikan produk dirender
        renderProducts();

    }

    else if(page === "info"){

        info.classList.add("active");

    }

    else if(page === "links"){

        links.classList.add("active");

    }

};


/* =========================
    SHOP / PRODUCT SYSTEM
============================ */

/* 
    NOMOR WHATSAPP OWNER
    Format: 628xxxxxxxxxx
    Jangan pakai + dan jangan pakai 0 di depan.
*/

const OWNER_WHATSAPP = "6285216704274";


/* =========================
    DAFTAR PRODUK
============================ */

const products = [

    {
        id: 1,

        name: "Produk Premium A",

        price: 25000,

        image: "produk1.jpg",

        description:
            "Produk premium dengan proses cepat dan mudah.",

        detail:
            "• Proses cepat\n• Bisa langsung digunakan\n• Support admin",

        ready: true
    },


    {
        id: 2,

        name: "Produk Premium B",

        price: 50000,

        image: "produk2.jpg",

        description:
            "Produk premium lainnya dengan kualitas terbaik.",

        detail:
            "• Ready setiap hari\n• Proses manual\n• Bantuan admin tersedia",

        ready: true
    },


    {
        id: 3,

        name: "Produk Premium C",

        price: 75000,

        image: "produk3.jpg",

        description:
            "Produk dengan stok terbatas.",

        detail:
            "• Stok terbatas\n• Proses setelah pembayaran\n• Tidak bisa refund",

        ready: false
    }

];


/* =========================
   FORMAT RUPIAH
========================= */

function formatRupiah(number){

    return new Intl.NumberFormat("id-ID", {
        style:"currency",
        currency:"IDR",
        maximumFractionDigits:0
    }).format(number);

}


/* =========================
   RENDER PRODUK
========================= */

function renderProducts(){

    const container = document.getElementById("productList");

    if(!container) return;

    container.innerHTML = products.map(product => {

        const statusClass =
            product.ready ? "ready" : "sold";

        const statusText =
            product.ready ? "● READY" : "● HABIS";


        return `

        <div class="product-card">

            <div class="product-image-wrap">

                <img
                    src="${product.image}"
                    class="product-image"
                    alt="${product.name}"
                    onerror="this.src='https://placehold.co/800x500?text=Produk'"
                >

                <div class="product-status ${statusClass}">
                    ${statusText}
                </div>

            </div>


            <div class="product-content">

                <div class="product-name">
                    ${product.name}
                </div>

                <div class="product-price">
                    ${formatRupiah(product.price)}
                </div>

                <div class="product-description">
                    ${product.description}
                </div>

                <div class="product-detail">

                    <div class="product-detail-title">
                        DETAIL PRODUK
                    </div>

                    <div class="product-detail-text">
                        ${product.detail.replace(/\n/g,"<br>")}
                    </div>

                </div>


                <div class="product-actions">

                    <button
                        class="product-btn btn-question"
                        onclick="askProduct(${product.id})"
                    >
                        <i class="ri-question-line"></i>
                        Tanya
                    </button>


                    ${
                        product.ready

                        ?

                        `
                        <button
                            class="product-btn btn-buy"
                            onclick="buyProduct(${product.id})"
                        >
                            <i class="ri-shopping-cart-2-line"></i>
                            Beli Sekarang
                        </button>
                        `

                        :

                        `
                        <button
                            class="product-btn btn-disabled"
                            disabled
                        >
                            <i class="ri-close-circle-line"></i>
                            Stok Habis
                        </button>
                        `
                    }

                </div>

            </div>

        </div>

        `;

    }).join("");

}


/* =========================
   WHATSAPP
========================= */

function openWhatsApp(message){

    const url =
        "https://wa.me/" +
        OWNER_WHATSAPP +
        "?text=" +
        encodeURIComponent(message);

    window.open(url,"_blank");

}


/* =========================
   TANYA PRODUK
========================= */

window.askProduct = function(id){

    const product =
        products.find(p => p.id === id);

    if(!product) return;

    playTick();

    const message =
`Halo Admin WANZPAY 👋

Saya ingin bertanya mengenai produk:

📦 Produk:
${product.name}

💰 Harga:
${formatRupiah(product.price)}

Apakah produk tersebut masih tersedia?

Terima kasih 🙏`;

    openWhatsApp(message);

};


/* =========================
   BELI PRODUK
========================= */

window.buyProduct = function(id){

    const product =
        products.find(p => p.id === id);

    if(!product || !product.ready) return;

    playTick();

    const message =
`Halo Admin WANZPAY 👋

Saya ingin membeli produk:

📦 Produk:
${product.name}

💰 Harga:
${formatRupiah(product.price)}

Saya siap melakukan pembayaran.

Mohon info proses selanjutnya 🙏`;

    openWhatsApp(message);

};


/* =========================
   JALANKAN PRODUK
========================= */

document.addEventListener("DOMContentLoaded", () => {

    renderProducts();

});
