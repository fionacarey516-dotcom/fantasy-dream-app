// Router Configuration
const routes = {
    home: { title: '梦想大厅', template: 'home', showBack: false, showShare: false },
    feed: { title: '动态', template: 'feed', showBack: false, showShare: false },
    notifications: { title: '通知', template: 'notifications', showBack: false, showShare: false },
    profile: { title: '我的', template: 'profile', showBack: false, showShare: false },
    create: { title: '种下梦想', template: 'create', showBack: true, showShare: false },
    detail: { title: '梦想详情', template: 'detail', showBack: true, showShare: true }
};

// Current page state
let currentPage = 'home';
let currentDreamId = null;

// Navigation function
function navigateTo(page, params = {}) {
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

    // Update page title
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        if (activePage === 'home') {
            pageTitle.innerHTML = '<span class="mr-2">⚡</span>幻想梦想';
        } else {
            pageTitle.textContent = routeConfig.title;
        }
    }

    // Show/hide back button
    const backButton = document.getElementById('back-button');
    if (backButton) {
        if (routeConfig.showBack) {
            backButton.classList.remove('hidden');
            backButton.classList.add('flex');
        } else {
            backButton.classList.add('hidden');
            backButton.classList.remove('flex');
        }
    }

    // Show/hide share button
    const shareButton = document.getElementById('share-button');
    if (shareButton) {
        if (routeConfig.showShare) {
            shareButton.classList.remove('hidden');
            shareButton.classList.add('flex');
        } else {
            shareButton.classList.add('hidden');
            shareButton.classList.remove('flex');
        }
    }

    // Show/hide bottom navigation (hide on detail page)
    const bottomNav = document.querySelector('nav');
    if (bottomNav) {
        if (activePage === 'detail') {
            bottomNav.classList.add('hidden');
        } else {
            bottomNav.classList.remove('hidden');
        }
    }

    // Update top tabs (if they exist)
    document.querySelectorAll('.page-tab').forEach(tab => {
        const page = tab.getAttribute('data-page');
        if (page === activePage || (activePage === 'create' && page === 'home')) {
            tab.classList.add('active');
            tab.classList.remove('bg-glass', 'text-slate-300', 'border-glass-border');
            tab.classList.add('bg-primary', 'text-white', 'border-primary/50');
        } else {
            tab.classList.remove('active', 'bg-primary', 'text-white', 'border-primary/50');
            tab.classList.add('bg-glass', 'text-slate-300', 'border-glass-border');
        }
    });

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
    // Navigate back to previous page
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
        switch(page) {
            case 'home':
                html = renderHomePage();
                break;
            case 'feed':
                html = renderFeedPage();
                break;
            case 'notifications':
                html = renderNotificationsPage();
                break;
            case 'profile':
                html = renderProfilePage();
                break;
            case 'create':
                html = renderCreatePage();
                break;
            case 'detail':
                html = renderDetailPage(params.dreamId);
                break;
            default:
                html = renderHomePage();
        }

        contentContainer.innerHTML = `<div class="fade-in">${html}</div>`;
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
    
    // Default to home page
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
