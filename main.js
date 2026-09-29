document.addEventListener("DOMContentLoaded", function () {
    checkLoginStatus();
    initGlobalSearch();
    initBrandLogos();
    initMobileMenu();
    initReaderSettings();
    showResumeToastIfAny();
    initMetrics(); // initialize persisted metrics (default 0)
    initAuthGuards();
    initFeaturedSection();
});

// Hàm kiểm tra trạng thái đăng nhập (sử dụng currentUser trong localStorage)
function checkLoginStatus() {
    const currentUser = localStorage.getItem("currentUser");
    const authArea = document.querySelector('.flex.items-center.gap-2.lg\\:gap-4');
    const loginBtn = document.getElementById("header-login-btn");

    if (!authArea) return;

    if (currentUser) {
        authArea.innerHTML = `
            <div class="relative flex items-center gap-3 bg-stone-100 p-1 pr-3 rounded-full border border-stone-200 group">
                <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    ${currentUser.charAt(0).toUpperCase()}
                </div>
                <div class="flex flex-col">
                    <span class="text-sm font-bold text-stone-800 leading-none">${currentUser}</span>
                    <button id="btn-logout" class="text-[10px] text-red-500 hover:underline text-left font-medium">Đăng xuất</button>
                </div>
            </div>
        `;
        if (loginBtn) loginBtn.classList.add('hidden');

        const logoutBtn = document.getElementById('btn-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (!confirm('Bạn có chắc chắn muốn đăng xuất và xóa dữ liệu phiên làm việc?')) return;
                logout();
            });
        }
    } else {
        authArea.innerHTML = `
            <a href="login.html" class="px-5 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-hover transition-all shadow-sm">Đăng nhập</a>
        `;
        if (loginBtn) loginBtn.classList.remove('hidden');
    }
}

// Bind unified logo elements to homepage navigation
function initBrandLogos() {
    try {
        const logos = document.querySelectorAll('.brand-logo');
        logos.forEach(logo => {
            logo.style.cursor = 'pointer';
            logo.addEventListener('click', (e) => {
                // let native anchors work; only redirect if element isn't an anchor or has no href
                if (logo.tagName.toLowerCase() === 'a' && logo.getAttribute('href')) return;
                window.location.href = 'index.html';
            });
        });
    } catch (e) { /* ignore */ }
}

// Global search - show suggestions dropdown on index
function initGlobalSearch() {
    const input = document.getElementById('global-search');
    if (!input) return;
    
    const suggestionsEl = document.getElementById('search-suggestions');
    if (!suggestionsEl) return;
    
    const listEl = document.getElementById('suggestion-list');
    if (!listEl) return;

    function getAllNovels() {
        const userNovels = JSON.parse(localStorage.getItem('userNovels') || '[]');
        const currentUser = localStorage.getItem('currentUser');
        const dynamicIds = new Set(['ngay-ay-anh-yeu-em', 'anh-bo-em-roi']);
        const publishedUserNovels = userNovels.filter(n => n.status === 'published' || n.status === 'Đang tiến hành' || n.status === 'Đã hoàn thành');
        const merged = [...publishedUserNovels, ...(Array.isArray(database) ? database : [])];
        const seen = new Set();
        return merged.map(n => {
            const copy = Object.assign({}, n);
            if (currentUser && dynamicIds.has(String(n.id))) copy.author = currentUser;
            return copy;
        }).filter(n => {
            const key = String(n.id);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    input.addEventListener('input', function (e) {
        const q = (e.target.value || '').toLowerCase().trim();
        if (!q) {
            suggestionsEl.classList.add('hidden');
            return;
        }
        const all = getAllNovels();
        const results = all.filter(n => (n.title || '').toLowerCase().includes(q)).slice(0, 8);
        if (results.length === 0) {
            suggestionsEl.classList.add('hidden');
            return;
        }
        listEl.innerHTML = results.map(n => `
            <a href="detail.html?id=${encodeURIComponent(n.id)}" class="flex gap-2 p-2 hover:bg-stone-100 text-xs">
                <div class="w-8 h-12 rounded bg-cover flex-shrink-0" style="background-image: url('${n.cover || 'https://via.placeholder.com/80'}');"></div>
                <div class="flex-1">
                    <div class="font-bold line-clamp-1">${escapeHtml(n.title)}</div>
                    <div class="text-stone-500 line-clamp-1">${escapeHtml(n.author || '')}</div>
                </div>
            </a>
        `).join('');
        suggestionsEl.classList.remove('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !suggestionsEl.contains(e.target)) {
            suggestionsEl.classList.add('hidden');
        }
    });
}

// Mobile menu: create a slide-out menu and toggle it from any #mobile-menu-toggle
function initMobileMenu() {
    // create menu container if not present
    if (document.getElementById('mobile-menu')) return; // already created

    const menu = document.createElement('div');
    menu.id = 'mobile-menu';
    menu.className = 'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-background-dark shadow-xl transform -translate-x-full transition-transform';
    menu.innerHTML = `
        <div class="p-4 border-b border-gray-200 dark:border-surface-highlight flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="size-8 bg-primary text-white rounded flex items-center justify-center"><span class="material-symbols-outlined">auto_stories</span></div>
                <div class="font-bold">OpenNovel</div>
            </div>
            <button id="mobile-menu-close" class="text-gray-700 dark:text-gray-200">✕</button>
        </div>
        <div class="p-4 flex flex-col gap-3">
            <a href="index.html" class="py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-surface-highlight">Trang chủ</a>
            <a href="dashboard.html" class="py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-surface-highlight">Write</a>
            <a href="profile.html" class="py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-surface-highlight">Library</a>
            <a href="login.html" class="py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-surface-highlight" id="mobile-login-link">Login</a>
        </div>
    `;
    document.body.appendChild(menu);

    // adjust mobile login link based on current user
    const mobileLoginLink = document.getElementById('mobile-login-link');
    const currentUser = localStorage.getItem('currentUser');
    if (mobileLoginLink) {
        if (currentUser) {
            mobileLoginLink.textContent = 'Logout';
            mobileLoginLink.href = '#';
            mobileLoginLink.addEventListener('click', function (e) { e.preventDefault(); logout(); closeMobileMenu(); });
        } else {
            mobileLoginLink.textContent = 'Login';
            mobileLoginLink.href = 'login.html';
        }
    }

    const toggles = document.querySelectorAll('#mobile-menu-toggle');
    toggles.forEach(t => t.addEventListener('click', openMobileMenu));
    document.getElementById('mobile-menu-close').addEventListener('click', closeMobileMenu);

    function openMobileMenu() {
        menu.classList.remove('-translate-x-full');
    }
    function closeMobileMenu() {
        menu.classList.add('-translate-x-full');
    }
}

// Reading history helpers: save and show resume
function saveReadingProgress(novelId, chapterId) {
    try {
        const novel = getNovelById(novelId);
        const chapter = novel ? (novel.chapters.find(c => String(c.id) === String(chapterId)) || null) : null;
        const data = { novelId: String(novelId), chapterId: String(chapterId), title: novel ? novel.title : '', chapterTitle: chapter ? chapter.title : '' , ts: Date.now() };
        localStorage.setItem('readingHistory', JSON.stringify(data));
    } catch (e) { console.error(e); }
}

function getReadingProgress() {
    try {
        return JSON.parse(localStorage.getItem('readingHistory') || 'null');
    } catch (e) { return null; }
}

function showResumeToastIfAny() {
    const progress = getReadingProgress();
    if (!progress) return;
    // create simple toast in bottom-right
    const existing = document.getElementById('resume-toast');
    if (existing) existing.remove();
    const t = document.createElement('div');
    t.id = 'resume-toast';
    t.className = 'fixed bottom-6 right-6 z-50 pointer-events-auto';
    t.innerHTML = `
        <div class="bg-white dark:bg-surface-dark border border-gray-200 dark:border-surface-highlight shadow-2xl rounded-2xl p-4 w-80">
            <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded bg-primary/10 text-primary flex items-center justify-center"> <span class="material-symbols-outlined">history</span> </div>
                <div class="flex-1">
                    <div class="font-bold text-sm">Bạn đang đọc dở</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">${escapeHtml(progress.title)} - ${escapeHtml(progress.chapterTitle)}</div>
                    <div class="mt-3 flex gap-2">
                        <a href="read.html?novel_id=${encodeURIComponent(progress.novelId)}&chapter_id=${encodeURIComponent(progress.chapterId)}" class="bg-primary text-white px-3 py-1 rounded text-xs">Đọc tiếp</a>
                        <button id="dismiss-resume" class="text-xs px-3 py-1 rounded border">Bỏ qua</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(t);
    document.getElementById('dismiss-resume').addEventListener('click', () => { t.remove(); });
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function (m) {
        return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[m];
    });
}

// Logout function: clear user-generated data only
function logout() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        // Xóa dữ liệu người dùng nhập vào
        localStorage.removeItem(`library_${currentUser}`);
        localStorage.removeItem(`profile_${currentUser}`);
        localStorage.removeItem('userNovels');
        localStorage.removeItem('readingHistory');
    }
    // Xóa session hiện tại
    localStorage.removeItem('currentUser');
    // Giữ lại readerSettings, metrics, v.v.
    window.location.href = 'index.html';
}

// Reader settings: save / apply
function applyReaderSettings() {
    try {
        const raw = localStorage.getItem('readerSettings');
        if (!raw) return;
        const s = JSON.parse(raw);
        const container = document.getElementById('chapter-content') || document.querySelector('.prose');
        if (container) {
            // font family
            if (s.font === 'serif') container.style.fontFamily = "'Noto Serif', serif";
            else if (s.font === 'mono') container.style.fontFamily = "'Roboto Mono', monospace";
            else container.style.fontFamily = "Inter, sans-serif";
            // font size
            if (s.fontSize) container.style.fontSize = (s.fontSize) + 'px';
            // line height
            if (s.lineHeight) container.style.lineHeight = s.lineHeight;
        }
        // theme
        if (s.theme === 'sepia') document.body.classList.add('sepia-mode');
        else document.body.classList.remove('sepia-mode');
        if (s.theme === 'dark') document.documentElement.classList.add('dark');
        if (s.theme === 'light') document.documentElement.classList.remove('dark');
    } catch (e) { console.error(e); }
}

function saveReaderSettings(obj) {
    const cur = JSON.parse(localStorage.getItem('readerSettings') || '{}');
    const next = Object.assign({}, cur, obj);
    localStorage.setItem('readerSettings', JSON.stringify(next));
    applyReaderSettings();
}

function initReaderSettings() {
    // if not on read page, it's harmless
    const fontSans = document.getElementById('font-sans');
    const fontSerif = document.getElementById('font-serif');
    const fontMono = document.getElementById('font-mono');
    const fontSizeRange = document.getElementById('font-size-range');
    const line14 = document.getElementById('line-14');
    const line18 = document.getElementById('line-18');
    const line20 = document.getElementById('line-20');
    const tLight = document.getElementById('theme-light');
    const tSepia = document.getElementById('theme-sepia');
    const tDark = document.getElementById('theme-dark');

    if (fontSans) fontSans.addEventListener('click', () => saveReaderSettings({ font: 'sans' }));
    if (fontSerif) fontSerif.addEventListener('click', () => saveReaderSettings({ font: 'serif' }));
    if (fontMono) fontMono.addEventListener('click', () => saveReaderSettings({ font: 'mono' }));
    if (fontSizeRange) fontSizeRange.addEventListener('input', (e) => saveReaderSettings({ fontSize: e.target.value }));
    if (line14) line14.addEventListener('click', () => saveReaderSettings({ lineHeight: 1.4 }));
    if (line18) line18.addEventListener('click', () => saveReaderSettings({ lineHeight: 1.8 }));
    if (line20) line20.addEventListener('click', () => saveReaderSettings({ lineHeight: 2.0 }));
    if (tLight) tLight.addEventListener('click', () => saveReaderSettings({ theme: 'light' }));
    if (tSepia) tSepia.addEventListener('click', () => saveReaderSettings({ theme: 'sepia' }));
    if (tDark) tDark.addEventListener('click', () => saveReaderSettings({ theme: 'dark' }));

    // apply immediately
    applyReaderSettings();
}

// Guard actions that require authentication (library, write, drafts, etc.)
function initAuthGuards() {
    const protectedLinks = [
        'profile.html',
        'dashboard.html',
        'write.html',
        'Published_Stories.html',
        'draft.html',
        'debate.html'
    ];

    // If the current page itself is protected and user is not logged in, bounce to login
    const path = window.location.pathname || '';
    const isProtectedPage = protectedLinks.some(p => path.endsWith(p));
    if (isProtectedPage && !localStorage.getItem('currentUser')) {
        alert('Vui lòng đăng nhập để truy cập trang này!');
        window.location.href = 'login.html';
        return;
    }

    function ensureLoggedIn(e) {
        const user = localStorage.getItem('currentUser');
        if (user) return true;
        e.preventDefault();
        alert('Vui lòng đăng nhập để sử dụng tính năng này!');
        window.location.href = 'login.html';
        return false;
    }

    // Delegate clicks for links and any element marked require-auth
    document.addEventListener('click', (e) => {
        const el = e.target.closest('[data-require-auth], [data-auth-target], a[href]');
        if (!el) return;
        const href = el.getAttribute('href');
        const needsAuth = el.hasAttribute('data-require-auth') || el.hasAttribute('data-auth-target') || (href && protectedLinks.includes(href));
        if (!needsAuth) return;
        const ok = ensureLoggedIn(e);
        if (!ok) return;
        // if it is a data-auth-target button, handle navigation
        if (el.hasAttribute('data-auth-target')) {
            const target = el.getAttribute('data-auth-target');
            if (target) {
                e.preventDefault();
                window.location.href = target;
            }
        }
    }, true);
}

// Login / Register
function performLogin() {
    const username = document.getElementById('login-username') ? document.getElementById('login-username').value.trim() : '';
    const password = document.getElementById('login-password') ? document.getElementById('login-password').value : '';
    if (!username || !password) return alert('Vui lòng nhập tên đăng nhập và mật khẩu');
    const res = (typeof loginUser === 'function') ? loginUser(username, password) : { ok: true };
    if (res && res.ok) {
        // Persist current user for other features (library, profile, nav)
        localStorage.setItem('currentUser', username);
        window.location.href = 'profile.html';
    } else {
        alert('Tên đăng nhập hoặc mật khẩu không đúng');
    }
}
function performRegister() {
    const username = document.getElementById('reg-username') ? document.getElementById('reg-username').value.trim() : '';
    const password = document.getElementById('reg-password') ? document.getElementById('reg-password').value : '';
    if (!username || !password) return alert('Vui lòng điền đủ thông tin');
    const res = (typeof registerUser === 'function') ? registerUser(username, password) : { ok: false };
    if (res.ok) {
        alert('Đăng ký thành công. Bạn đã được đăng nhập.');
        window.location.href = 'index.html';
    } else {
        alert(res.message || 'Đăng ký thất bại');
    }
}

// Metric helpers: persist / update UI
function getMetric(key) {
    return parseInt(localStorage.getItem('metric_' + key) || '0', 10);
}
function setMetric(key, value) {
    localStorage.setItem('metric_' + key, String(Number(value) || 0));
    updateMetricUI(key);
}
function incrementMetric(key, delta = 1) {
    setMetric(key, getMetric(key) + Number(delta));
}
function updateMetricUI(key) {
    const value = getMetric(key);
    document.querySelectorAll(`[data-metric="${key}"]`).forEach(el => {
        if (key === 'revenue') {
            el.innerHTML = `${value} <span class="text-base font-normal text-stone-500">VND</span>`;
        } else {
            el.textContent = value;
        }
    });
}
function initMetrics() {
    // initialize UI from localStorage (defaults to 0)
    ['views','followers','works','week-views','revenue','comments','story-views-1'].forEach(k => updateMetricUI(k));

    // Wire up follow button (increment followers once when user clicks)
    const followBtn = document.getElementById('follow-author-btn');
    if (followBtn) {
        const followed = localStorage.getItem('followed_author') === '1';
        if (followed) {
            followBtn.textContent = 'Đang theo dõi';
            followBtn.disabled = true;
            followBtn.classList.add('opacity-60','cursor-not-allowed');
        } else {
            followBtn.addEventListener('click', () => {
                incrementMetric('followers', 1);
                localStorage.setItem('followed_author','1');
                followBtn.textContent = 'Đang theo dõi';
                followBtn.disabled = true;
                followBtn.classList.add('opacity-60','cursor-not-allowed');
            });
        }
    }
}

// Expose metric API to pages for actions
window.getMetric = getMetric;
window.setMetric = setMetric;
window.incrementMetric = incrementMetric;

// Export helpers for pages
window.saveReadingProgress = saveReadingProgress;
window.getReadingProgress = getReadingProgress;
window.applyReaderSettings = applyReaderSettings;
window.saveReaderSettings = saveReaderSettings;

// Featured Section Logic
let isFeaturedExpanded = false;

function renderFeaturedSection() {
    const container = document.getElementById('featured-list-container');
    const viewAllBtn = document.getElementById('btn-view-all-featured');
    if (!container) return;

    // Database theo thứ tự:
    // 0: One Piece, 1: Conan, 2: Doraemon, 3: Marrigold, 4: Naruto
    // 5: Tearmoon, 6: Too Many Losing Heroines, 7: Stitches, 8: Sasaki and Pii-chan
    
    // Nếu chưa nhấn: lấy 5 truyện đầu. Nếu nhấn rồi: lấy 9 truyện (5 cũ + 4 mới)
    const dataToRender = isFeaturedExpanded ? database.slice(0, 9) : database.slice(0, 5);

    const rankStyles = [
        'text-2xl font-black text-amber-500 w-8 text-center italic',  // #1
        'text-2xl font-black text-stone-400 w-8 text-center italic',  // #2
        'text-2xl font-black text-orange-700 w-8 text-center italic', // #3
        'text-lg font-bold text-stone-600 w-8 text-center',           // #4+
    ];

    container.innerHTML = dataToRender.map((novel, index) => {
        const rankClass = index < 3 ? rankStyles[index] : rankStyles[3];
        const rankNumber = index + 1;
        return `
            <a href="detail.html?id=${novel.id}" class="flex items-center gap-4 group cursor-pointer hover:bg-surface-hover p-2.5 rounded-lg transition-colors border border-transparent hover:border-border-dark">
                <div class="${rankClass}">${rankNumber}</div>
                <div class="h-14 w-10 rounded shadow-md bg-cover bg-center shrink-0" style="background-image: url('${novel.cover}');"></div>
                <div class="flex flex-col">
                    <h4 class="text-foreground font-${index < 3 ? 'bold' : 'medium'} text-sm line-clamp-1 group-hover:text-primary font-serif">${novel.title}</h4>
                    <p class="text-muted text-xs ${index === 0 ? 'mt-0.5' : ''}">${novel.category} • ${Math.floor(Math.random() * 500 + 500)}K Views</p>
                </div>
            </a>
        `;
    }).join('');

    // Ẩn nút "Xem tất cả" nếu đã mở rộng hết 9 truyện
    if (viewAllBtn) {
        viewAllBtn.style.display = isFeaturedExpanded ? 'none' : 'block';
    }
}

function initFeaturedSection() {
    const btn = document.getElementById('btn-view-all-featured');
    if (btn) {
        btn.addEventListener('click', () => {
            isFeaturedExpanded = true;
            renderFeaturedSection(); // Vẽ lại để hiện 4 truyện còn lại
        });
    }

    // Chạy lần đầu khi load trang
    renderFeaturedSection();
}