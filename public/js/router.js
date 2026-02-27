// Router Configuration
const routes = {
    home: { title: '梦嘢', template: 'home', showBack: false, showShare: false, requireAuth: false },
    feed: { title: '动态', template: 'feed', showBack: false, showShare: false, requireAuth: false },
    notifications: { title: '通知', template: 'notifications', showBack: false, showShare: false, requireAuth: true },
    profile: { title: '我的', template: 'profile', showBack: false, showShare: false, requireAuth: true },
    create: { title: '种下梦想', template: 'create', showBack: true, showShare: false, requireAuth: true },
    detail: { title: '梦想详情', template: 'detail', showBack: true, showShare: true, requireAuth: false },
    login: { title: '登录', template: 'login', showBack: false, showShare: false, requireAuth: false, hideNav: true },
    register: { title: '注册', template: 'register', showBack: false, showShare: false, requireAuth: false, hideNav: true }
};

// Current page state
let currentPage = 'home';
let currentDreamId = null;

// Check if user is logged in
function isLoggedIn() {
    return !!localStorage.getItem('auth_token');
}

// Navigation function
function navigateTo(page, params = {}) {
    const route = routes[page];
    if (!route) return;

    // Auth check
    if (route.requireAuth && !isLoggedIn()) {
        navigateTo('login');
        return;
    }

    // Update current page state
    currentPage = page;
    if (params.dreamId) {
        currentDreamId = params.dreamId;
    }

    // Update navigation UI
    updateNavigationUI(page);

    // Load page content
    loadPageContent(page, params);

    // Update URL hash (for browser back button support)
    if (params.dreamId) {
        window.location.hash = `${page}/${params.dreamId}`;
    } else {
        window.location.hash = page;
    }
}

// Update navigation UI
function updateNavigationUI(activePage) {
    const routeConfig = routes[activePage];
    if (!routeConfig) return;

    // Show/hide bottom navigation
    const bottomNav = document.getElementById('bottom-nav');
    if (bottomNav) {
        if (activePage === 'detail' || routeConfig.hideNav) {
            bottomNav.classList.add('hidden');
        } else {
            bottomNav.classList.remove('hidden');
        }
    }

    // Update bottom nav
    document.querySelectorAll('.nav-item').forEach(item => {
        const page = item.getAttribute('data-page');
        if (page === activePage || (activePage === 'create' && page === 'home')) {
            item.classList.add('active');
            const icon = item.querySelector('.material-symbols-outlined');
            const text = item.querySelector('span:last-child');
            if (icon) {
                icon.classList.remove('text-slate-400');
                icon.classList.add('text-primary');
            }
            if (text) {
                text.classList.remove('text-slate-400');
                text.classList.add('text-primary');
            }
        } else {
            item.classList.remove('active');
            const icon = item.querySelector('.material-symbols-outlined');
            const text = item.querySelector('span:last-child');
            if (icon) {
                icon.classList.remove('text-primary');
                icon.classList.add('text-slate-400');
            }
            if (text) {
                text.classList.remove('text-primary');
                text.classList.add('text-slate-400');
            }
        }
    });
}

// Go back function
function goBack() {
    if (currentPage === 'detail' || currentPage === 'create') {
        navigateTo('home');
    } else {
        navigateTo('home');
    }
}

// Load page content
function loadPageContent(page, params = {}) {
    const contentContainer = document.getElementById('page-content');
    contentContainer.innerHTML = '<div class="flex justify-center items-center py-12"><div class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>';

    setTimeout(() => {
        let html = '';
        switch (page) {
            case 'home':
                html = renderHomePage();
                break;
            case 'feed':
                html = renderFeedPage();
                break;
            case 'notifications':
                showNotificationsPage();
                return; // handles its own async rendering
            case 'profile':
                showProfilePage();
                return; // showProfilePage handles its own rendering
            case 'create':
                html = renderCreatePage();
                break;
            case 'detail':
                html = renderDetailPage(params.dreamId);
                break;
            case 'login':
                html = renderLoginPage();
                break;
            case 'register':
                html = renderRegisterPage();
                break;
            default:
                html = renderHomePage();
        }

        contentContainer.innerHTML = `<div class="fade-in">${html}</div>`;

        // Initialize page-specific behavior
        if (page === 'create') {
            initCreatePage();
        }
    }, 100);
}

// Initialize router on page load
function initializeRouter() {
    // Check URL hash
    const hash = window.location.hash.slice(1); // Remove #

    if (hash) {
        const parts = hash.split('/');
        const page = parts[0];
        const dreamId = parts[1] ? parseInt(parts[1]) : null;

        if (routes[page]) {
            navigateTo(page, dreamId ? { dreamId } : {});
            return;
        }
    }

    // Default: always go to home
    navigateTo('home');
}

// Handle browser back/forward
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    if (hash) {
        const parts = hash.split('/');
        const page = parts[0];
        const dreamId = parts[1] ? parseInt(parts[1]) : null;

        if (routes[page]) {
            currentPage = page;
            if (dreamId) currentDreamId = dreamId;
            updateNavigationUI(page);
            loadPageContent(page, dreamId ? { dreamId } : {});
        }
    }
});
