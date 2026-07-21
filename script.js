/**
 * ============================================================================
 * WEDDING INVITATION INTERACTIVE ENGINE - TAUFIK & RAHMA EDITION
 * ============================================================================
 */

// ============================================================================
// 1. GLOBAL CONFIGURATION & STATE
// ============================================================================
const CONFIG = {
    // Format ISO: YYYY-MM-DDTHH:mm:ss+07:00 (WIB)
    weddingDate: "2026-12-13T09:00:00+07:00", 
    wishes: { perPage: 5, loadMoreCount: 5 },
    toast: { duration: 3500 },
    // Data Firebase Project "taufik---rahma"
    firebase: {
        apiKey: "AIzaSyDe3cTG3Dtu3-068pP_4bztkMiCkxD5xgw",
        authDomain: "taufik---rahma.firebaseapp.com",
        projectId: "taufik---rahma",
        storageBucket: "taufik---rahma.firebasestorage.app",
        messagingSenderId: "164240300823",
        appId: "1:164240300823:web:f7d6e7bf97b57259aa3552"
    }
};

const STATE = {
    isPlaying: false,
    allWishes: [],
    displayedWishesCount: CONFIG.wishes.perPage,
    isFirebaseActive: true
};

const DOM = {
    body: document.body,
    cover: document.getElementById('cover'),
    btnOpen: document.getElementById('btn-open'),
    bgMusic: document.getElementById('bg-music'),
    musicControl: document.getElementById('music-control'),
    lightbox: {
        overlay: document.getElementById('lightbox'),
        img: document.getElementById('lightbox-img')
    },
    rsvp: {
        form: document.getElementById('rsvpForm'),
        name: document.getElementById('guestName'),
        attendance: document.getElementById('attendance'), 
        wish: document.getElementById('guestWish'),
        submitBtn: document.querySelector('.submit-btn'),
        container: document.getElementById('wishes-container'),
        list: document.getElementById('wishes-list'),
        btnLoadMore: document.getElementById('btn-load-more')
    },
    toast: {
        container: document.getElementById('custom-toast'),
        message: document.getElementById('toast-message')
    },
    customSelect: {
        wrapper: document.getElementById('customSelect'),
        selected: document.querySelector('.select-selected'),
        text: document.getElementById('selected-text'),
        items: document.querySelector('.select-items')
    }
};

// ============================================================================
// 2. INITIALIZATION & MAGICAL REVEAL LOGIC
// ============================================================================
function initApp() {
    DOM.body.style.overflow = 'hidden'; 
    checkFirebaseStatus();
    initCustomSelect();
    setGuestNameFromURL(); 
    animateCoverOnLoad();
}

function setGuestNameFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const namaTamu = urlParams.get('to');
    
    if (namaTamu) {
        const elemenNamaTamu = document.getElementById('nama-tamu');
        if (elemenNamaTamu) {
            elemenNamaTamu.innerText = namaTamu.replace(/[-_]/g, ' ');
        }
    }
}

function animateCoverOnLoad() {
    const coverElements = document.querySelectorAll('#cover, #cover .animate-slide-up, #cover .animate-fade-in, #cover .animate-zoom');
    setTimeout(() => {
        coverElements.forEach(el => el.classList.add('is-visible'));
    }, 100);
}

DOM.btnOpen.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    DOM.btnOpen.classList.add('btn-unlocking');
    
    const coverArch = document.querySelector('.cover-glass-overlay');
    if(coverArch) coverArch.style.transform = 'scale(1.05)';
    
    setTimeout(() => {
        DOM.cover.classList.remove('is-visible', 'animate-zoom');
        DOM.cover.classList.add('opened-dramatic');
    }, 500); 
    
    setTimeout(() => {
        DOM.body.style.overflow = 'auto'; 
        initScrollAnimations();
        initCountUpNumbers();
    }, 1100); 
    
    setTimeout(() => {
        DOM.musicControl.style.display = 'block';
        playAudio();
    }, 400);
});

// ============================================================================
// 3. AUDIO & LIGHTBOX
// ============================================================================
function playAudio() {
    if(DOM.bgMusic) {
        DOM.bgMusic.play().then(() => {
            STATE.isPlaying = true;
            DOM.musicControl.classList.remove('paused');
            DOM.musicControl.classList.add('playing');
        }).catch(err => console.warn("Autoplay diblokir:", err));
    }
}

DOM.musicControl.addEventListener('click', () => {
    if (STATE.isPlaying) {
        DOM.bgMusic.pause();
        DOM.musicControl.classList.add('paused');
        DOM.musicControl.classList.remove('playing');
    } else {
        DOM.bgMusic.play();
        DOM.musicControl.classList.remove('paused');
        DOM.musicControl.classList.add('playing');
    }
    STATE.isPlaying = !STATE.isPlaying;
});

window.openLightbox = function(src) {
    DOM.lightbox.img.src = src;
    DOM.lightbox.overlay.classList.add('active');
    DOM.body.style.overflow = 'hidden';
};

window.closeLightbox = function() {
    DOM.lightbox.overlay.classList.remove('active');
    DOM.body.style.overflow = 'auto';
};

// ============================================================================
// 4. CUSTOM SELECT DROPDOWN LOGIC (RSVP)
// ============================================================================
function initCustomSelect() {
    if (!DOM.customSelect.wrapper) return;

    DOM.customSelect.selected.addEventListener("click", function(e) {
        e.stopPropagation();
        this.classList.toggle("select-arrow-active");
        DOM.customSelect.items.classList.toggle("select-hide");
    });

    const options = DOM.customSelect.items.querySelectorAll("div");
    options.forEach(option => {
        option.addEventListener("click", function(e) {
            e.stopPropagation();
            DOM.customSelect.text.innerHTML = this.innerHTML;
            DOM.rsvp.attendance.value = this.getAttribute("data-value");
            
            DOM.customSelect.selected.classList.remove("select-arrow-active");
            DOM.customSelect.items.classList.add("select-hide");
            DOM.customSelect.selected.style.borderColor = 'var(--accent-color)';
        });
    });

    document.addEventListener("click", function(e) {
        if (!DOM.customSelect.wrapper.contains(e.target)) {
            DOM.customSelect.selected.classList.remove("select-arrow-active");
            DOM.customSelect.items.classList.add("select-hide");
        }
    });
}

// ============================================================================
// 5. ANIMATION SYSTEMS (SCROLL & COUNT)
// ============================================================================
function initScrollAnimations() {
    // 1. Observer Standar
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                entry.target.classList.remove('is-visible');
            }
        });
    }, { threshold: 0.15 });

    const targets = document.querySelectorAll('.animate-slide-up, .animate-fade-in, .animate-fade-left, .animate-fade-right, .animate-zoom');
    
    targets.forEach(t => {
        if (!DOM.cover.contains(t) && t !== DOM.cover) observer.observe(t);
    });

    // 2. Observer Cinematic Reveal (Muncul pas di-scroll)
    const cinematicObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.25 }); // Threshold lebih besar (25%) biar nunggu di-scroll dulu

    const cinematicTargets = document.querySelectorAll('.reveal-cinematic');
    cinematicTargets.forEach(t => cinematicObserver.observe(t));
}

function initCountUpNumbers() {
    const countElements = document.querySelectorAll('.count-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const target = +entry.target.getAttribute('data-target');
                let count = 0;
                const speed = target / 40;

                const update = () => {
                    if(count < target) {
                        count += speed;
                        entry.target.innerText = Math.ceil(count);
                        requestAnimationFrame(update);
                    } else {
                        entry.target.innerText = target;
                    }
                };
                update();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    countElements.forEach(el => observer.observe(el));
}

// ============================================================================
// 6. TOGGLE GIFT SECTION
// ============================================================================
window.toggleGiftSection = function() {
    const giftWrapper = document.getElementById('gift-wrapper');
    const btnGift = document.getElementById('btn-toggle-gift');
    
    if (giftWrapper.classList.contains('gift-hidden')) {
        giftWrapper.classList.remove('gift-hidden');
        giftWrapper.classList.add('gift-show');
        btnGift.innerHTML = 'Tutup Tanda Kasih ✕';
        btnGift.style.backgroundColor = 'var(--bg-dark)';
    } else {
        giftWrapper.classList.remove('gift-show');
        giftWrapper.classList.add('gift-hidden');
        btnGift.innerHTML = '🎁 Berikan Tanda Kasih';
        btnGift.style.backgroundColor = 'var(--accent-color)';
    }
};

// ============================================================================
// 7. NOTIFICATION & UTILS
// ============================================================================
const ToastManager = {
    timeoutId: null,
    show(msg, type = 'success') {
        const toast = DOM.toast.container;
        const icon = toast.querySelector('.toast-icon');
        DOM.toast.message.innerText = msg;
        
        if (type === 'success') {
            if(icon) icon.innerText = '✨';
            toast.classList.remove('error');
        } else {
            if(icon) icon.innerText = '⚠️';
            toast.classList.add('error');
        }
        
        toast.classList.add('show');
        
        if (this.timeoutId) clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => {
            toast.classList.remove('show');
        }, CONFIG.toast.duration);
    }
};

window.copyText = function(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const old = btn.innerText;
        btn.innerText = "Tersalin! ✔";
        ToastManager.show("Berhasil menyalin ke papan klip.");
        setTimeout(() => btn.innerText = old, 2000);
    });
};

function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ============================================================================
// 8. DATABASE INTEGRATION (FIREBASE)
// ============================================================================
function checkFirebaseStatus() {
    if (CONFIG.firebase.apiKey && CONFIG.firebase.projectId) {
        initFirebase();
    } else {
        initLocalStorageFallback();
    }
}

function initFirebase() {
    firebase.initializeApp(CONFIG.firebase);
    const db = firebase.firestore();

    db.collection("rsvp_tamu").orderBy("waktu_submit", "desc").onSnapshot((snap) => {
        STATE.allWishes = [];
        snap.forEach(doc => STATE.allWishes.push(doc.data()));
        renderWishes();
    }, (error) => {
        console.error("Firebase Snapshot Error:", error);
    });

    DOM.rsvp.form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const attendanceVal = DOM.rsvp.attendance.value;
        if (!attendanceVal) {
            ToastManager.show("Silakan pilih Konfirmasi Kehadiran terlebih dahulu!", "error");
            DOM.customSelect.selected.style.borderColor = '#c62828';
            return;
        }

        const btn = DOM.rsvp.submitBtn;
        const oldText = btn.innerText;
        btn.innerText = "Mengirim...";
        btn.disabled = true;

        db.collection("rsvp_tamu").add({
            nama: DOM.rsvp.name.value,
            kehadiran: attendanceVal,
            ucapan: DOM.rsvp.wish.value,
            waktu_submit: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            ToastManager.show("Terima kasih! Doa & konfirmasi Anda telah tersimpan.");
            handleResetForm();
        }).catch(err => {
            console.error(err);
            ToastManager.show("Gagal mengirim pesan. Cek koneksi atau izin Firebase Anda.", "error");
        }).finally(() => {
            btn.innerText = oldText;
            btn.disabled = false;
        });
    });
}

function initLocalStorageFallback() {
    const saved = localStorage.getItem('weddingWishes');
    STATE.allWishes = saved ? JSON.parse(saved) : [];
    renderWishes();

    DOM.rsvp.form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const attendanceVal = DOM.rsvp.attendance.value;
        if (!attendanceVal) {
            ToastManager.show("Silakan pilih Konfirmasi Kehadiran!", "error");
            return;
        }

        const btn = DOM.rsvp.submitBtn;
        btn.innerText = "Menyimpan...";
        btn.disabled = true;

        setTimeout(() => {
            const newWish = {
                nama: DOM.rsvp.name.value,
                kehadiran: attendanceVal,
                ucapan: DOM.rsvp.wish.value,
                waktu_submit: new Date().toISOString()
            };
            STATE.allWishes.unshift(newWish);
            localStorage.setItem('weddingWishes', JSON.stringify(STATE.allWishes));
            
            renderWishes();
            ToastManager.show("Data tersimpan (Mode Offline).");
            handleResetForm();
            btn.innerText = "Kirim Pesan";
            btn.disabled = false;
        }, 800);
    });
}

// ============================================================================
// 9. RENDERING SYSTEM (GUESTBOOK)
// ============================================================================
function renderWishes() {
    if (!DOM.rsvp.list) return;
    
    DOM.rsvp.container.style.display = STATE.allWishes.length > 0 ? 'block' : 'none';
    DOM.rsvp.list.innerHTML = '';
    
    const toShow = STATE.allWishes.slice(0, STATE.displayedWishesCount);

    toShow.forEach(w => {
        const isHadir = w.kehadiran === 'Hadir';
        const badgeClass = isHadir ? 'badge-hadir' : 'badge-absen';
        const badgeText = isHadir ? '✓ Hadir' : '✕ Berhalangan';

        DOM.rsvp.list.innerHTML += `
            <div class="wish-item">
                <div class="wish-header">
                    <span class="wish-name">${sanitizeHTML(w.nama)}</span>
                    <span class="badge ${badgeClass}">${badgeText}</span>
                </div>
                <p class="wish-text">"${sanitizeHTML(w.ucapan)}"</p>
            </div>
        `;
    });

    DOM.rsvp.btnLoadMore.style.display = 
        STATE.allWishes.length > STATE.displayedWishesCount ? 'inline-block' : 'none';
}

function handleResetForm() {
    DOM.rsvp.form.reset();
    DOM.rsvp.attendance.value = "";
    DOM.customSelect.text.innerHTML = "Konfirmasi Kehadiran";
    DOM.customSelect.selected.style.borderColor = 'var(--accent-color)';
}

DOM.rsvp.btnLoadMore.addEventListener('click', () => {
    STATE.displayedWishesCount += CONFIG.wishes.loadMoreCount;
    renderWishes();
});

// START APPLICATION
document.addEventListener('DOMContentLoaded', initApp);
