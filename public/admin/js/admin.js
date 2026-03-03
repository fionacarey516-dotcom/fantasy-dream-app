// ========== ADMIN SPA ==========

// State
let adminToken = localStorage.getItem('admin_token');
let adminUser = null;
let currentView = 'dashboard';
let dreamsData = [];
let currentPage = 1;
let totalPages = 1;
let currentFilter = '';

const BASE_URL = '';  // same origin

// ========== AUTH ==========

async function handleLogin() {
    const name = document.getElementById('login-name').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    const btn = document.getElementById('login-btn');

    if (!name || !password) {
        showLoginError('请输入用户名和密码');
        return;
    }

    btn.textContent = '登录中...';
    btn.disabled = true;
    errorEl.classList.add('hidden');

    try {
        const res = await fetch(`${BASE_URL}/api/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, password })
        });
        const data = await res.json();

        if (!res.ok) {
            showLoginError(data.error || '登录失败');
            return;
        }

        adminToken = data.token;
        adminUser = data.user;
        localStorage.setItem('admin_token', adminToken);
        localStorage.setItem('admin_user', JSON.stringify(adminUser));

        enterApp();
    } catch (e) {
        showLoginError('网络错误，请稍后重试');
    } finally {
        btn.textContent = '登录';
        btn.disabled = false;
    }
}

function showLoginError(msg) {
    const el = document.getElementById('login-error');
    el.textContent = msg;
    el.classList.remove('hidden');
}

function handleLogout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    adminToken = null;
    adminUser = null;
    document.getElementById('main-app').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
}

function enterApp() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');

    // Set sidebar user info
    if (adminUser) {
        document.getElementById('sidebar-name').textContent = adminUser.name;
        document.getElementById('sidebar-avatar').textContent = adminUser.name.charAt(0).toUpperCase();
    }

    showView('dashboard');
    loadPendingCount();
}

// ========== API HELPERS ==========

async function adminFetch(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
        ...options.headers
    };

    // Remove Content-Type for FormData
    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    }

    const res = await fetch(BASE_URL + url, { ...options, headers });
    if (res.status === 401) {
        handleLogout();
        throw new Error('登录已过期');
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
}

// ========== NAVIGATION ==========

function showView(view) {
    currentView = view;
    currentPage = 1;
    currentFilter = '';

    // Update nav
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });

    const content = document.getElementById('main-content');
    content.innerHTML = '<div class="flex items-center justify-center h-64"><div class="spinner"></div></div>';

    switch (view) {
        case 'dashboard': renderDashboard(); break;
        case 'all-dreams': renderDreamList(''); break;
        case 'pending': renderDreamList('pending'); break;
        case 'add-dream': renderAddDream(); break;
        default: renderDashboard();
    }
}

// ========== DASHBOARD ==========

async function renderDashboard() {
    try {
        const stats = await adminFetch('/api/admin/stats');
        document.getElementById('main-content').innerHTML = `
        <div class="fade-in">
            <div class="mb-8">
                <h1 class="text-2xl font-bold text-white mb-1">概览</h1>
                <p class="text-slate-400 text-sm">梦嘢平台数据总览</p>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                <div class="stat-card">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
                            <span class="material-symbols-outlined text-primary text-lg">auto_awesome</span>
                        </div>
                        <span class="text-xs text-slate-400 font-medium">梦想总数</span>
                    </div>
                    <p class="text-3xl font-bold text-white">${stats.totalDreams || 0}</p>
                </div>
                <div class="stat-card">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-9 h-9 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                            <span class="material-symbols-outlined text-yellow-400 text-lg">pending</span>
                        </div>
                        <span class="text-xs text-slate-400 font-medium">待审核</span>
                    </div>
                    <p class="text-3xl font-bold text-white">${stats.pendingDreams || 0}</p>
                </div>
                <div class="stat-card">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-9 h-9 rounded-xl bg-green-500/20 flex items-center justify-center">
                            <span class="material-symbols-outlined text-green-400 text-lg">check_circle</span>
                        </div>
                        <span class="text-xs text-slate-400 font-medium">已发布</span>
                    </div>
                    <p class="text-3xl font-bold text-white">${stats.approvedDreams || 0}</p>
                </div>
                <div class="stat-card">
                    <div class="flex items-center gap-3 mb-3">
                        <div class="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <span class="material-symbols-outlined text-blue-400 text-lg">group</span>
                        </div>
                        <span class="text-xs text-slate-400 font-medium">用户总数</span>
                    </div>
                    <p class="text-3xl font-bold text-white">${stats.totalUsers || 0}</p>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="mb-6">
                <h2 class="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">快速操作</h2>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button onclick="showView('pending')" class="stat-card text-left hover:border-yellow-400/30 transition-colors group cursor-pointer">
                        <div class="flex items-center gap-3">
                            <span class="material-symbols-outlined text-yellow-400">pending_actions</span>
                            <div>
                                <p class="text-sm font-semibold text-white">审核梦想</p>
                                <p class="text-xs text-slate-400">${stats.pendingDreams || 0} 个待处理</p>
                            </div>
                        </div>
                    </button>
                    <button onclick="showView('add-dream')" class="stat-card text-left hover:border-primary/30 transition-colors group cursor-pointer">
                        <div class="flex items-center gap-3">
                            <span class="material-symbols-outlined text-primary">add_circle</span>
                            <div>
                                <p class="text-sm font-semibold text-white">录入梦想</p>
                                <p class="text-xs text-slate-400">直接创建已审核梦想</p>
                            </div>
                        </div>
                    </button>
                    <button onclick="showView('all-dreams')" class="stat-card text-left hover:border-blue-400/30 transition-colors group cursor-pointer">
                        <div class="flex items-center gap-3">
                            <span class="material-symbols-outlined text-blue-400">list</span>
                            <div>
                                <p class="text-sm font-semibold text-white">查看所有梦想</p>
                                <p class="text-xs text-slate-400">共 ${stats.totalDreams || 0} 个</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>`;
    } catch (e) {
        showError('加载统计数据失败：' + e.message);
    }
}

// ========== DREAM LIST ==========

async function renderDreamList(statusFilter) {
    currentFilter = statusFilter;
    try {
        const params = new URLSearchParams({ page: currentPage, limit: 15 });
        if (statusFilter) params.set('status', statusFilter);

        const result = await adminFetch(`/api/admin/dreams?${params}`);
        dreamsData = result.dreams || [];
        totalPages = Math.ceil((result.total || 0) / 15);

        const title = statusFilter === 'pending' ? '待审核梦想' : (statusFilter ? `${statusFilter} 梦想` : '所有梦想');

        // 待审核页使用卡片布局，其他页使用表格布局
        const isPendingView = statusFilter === 'pending';

        document.getElementById('main-content').innerHTML = `
        <div class="fade-in">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h1 class="text-2xl font-bold text-white mb-1">${title}</h1>
                    <p class="text-slate-400 text-sm">共 ${result.total || 0} 个梦想</p>
                </div>
                ${!statusFilter ? `
                <div class="flex gap-2">
                    <button onclick="filterDreams('')" class="filter-tab active" id="filter-all">全部</button>
                    <button onclick="filterDreams('pending')" class="filter-tab" id="filter-pending">待审核</button>
                    <button onclick="filterDreams('approved')" class="filter-tab" id="filter-approved">已通过</button>
                    <button onclick="filterDreams('rejected')" class="filter-tab" id="filter-rejected">已拒绝</button>
                </div>` : ''}
            </div>

            ${dreamsData.length === 0 ? `
            <div class="glass-panel rounded-2xl flex flex-col items-center justify-center py-16">
                <span class="material-symbols-outlined text-5xl text-slate-600 mb-3">inbox</span>
                <p class="text-slate-400">暂无梦想</p>
            </div>` : isPendingView ? `
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                ${dreamsData.map(d => renderPendingCard(d)).join('')}
            </div>` : `
            <div class="glass-panel rounded-2xl overflow-hidden mb-4">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>梦想</th>
                            <th>创作者</th>
                            <th>状态</th>
                            <th>数据</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${dreamsData.map(d => renderDreamRow(d)).join('')}
                    </tbody>
                </table>
            </div>`}

            <!-- Pagination -->
            ${totalPages > 1 ? renderPagination() : ''}
        </div>`;
    } catch (e) {
        showError('加载梦想列表失败：' + e.message);
    }
}

function renderPendingCard(d) {
    return `
    <div class="glass-panel rounded-2xl overflow-hidden border border-white/10 flex flex-col" style="border-color: rgba(200,146,210,0.2);">
        <!-- Cover Image -->
        <div class="relative h-52 w-full bg-gradient-to-br from-purple-900/60 to-indigo-900/60 flex items-center justify-center shrink-0 overflow-hidden">
            ${d.coverImage
            ? `<img src="${d.coverImage}" class="absolute inset-0 w-full h-full object-cover" alt="封面">`
            : `<div class="text-6xl select-none">${d.emoji || '✨'}</div>`
        }
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div class="absolute top-3 left-3">
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-500/90 text-white backdrop-blur-sm">
                    <span class="material-symbols-outlined text-[13px]">schedule</span>待审核
                </span>
            </div>
            <div class="absolute bottom-3 left-3 right-3">
                <p class="text-white font-bold text-lg leading-tight drop-shadow-lg line-clamp-2">${escHtml(d.title)}</p>
            </div>
        </div>
        <!-- Content -->
        <div class="p-4 flex flex-col gap-3 flex-1">
            <!-- Author -->
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    ${(d.author?.name || '?').charAt(0).toUpperCase()}
                </div>
                <span class="text-sm text-slate-300 font-medium">${escHtml(d.author?.name || '匿名')}</span>
                <span class="ml-auto text-xs text-slate-500 flex items-center gap-1">
                    <span class="material-symbols-outlined text-[13px] text-pink-400">favorite</span>${d.likes || 0}
                    <span class="material-symbols-outlined text-[13px] text-cyan-400 ml-1">bolt</span>${d.supporters || 0}
                </span>
            </div>
            <!-- Description -->
            <p class="text-sm text-slate-300 leading-relaxed line-clamp-3 flex-1">${escHtml(d.description || '暂无描述')}</p>
            <!-- Actions -->
            <div class="flex gap-2 pt-2 border-t border-white/10 mt-auto">
                <button onclick="approveDream(${d.id})" class="btn-success flex-1 justify-center py-2.5">
                    <span class="material-symbols-outlined text-sm">check</span>审核通过
                </button>
                <button onclick="openRejectModal(${d.id}, '${escHtml(d.title)}')" class="btn-danger flex-1 justify-center py-2.5">
                    <span class="material-symbols-outlined text-sm">close</span>拒绝
                </button>
            </div>
        </div>
    </div>`;
}

function filterDreams(status) {
    currentFilter = status;
    currentPage = 1;

    // Update active tab
    ['all', 'pending', 'approved', 'rejected'].forEach(s => {
        const el = document.getElementById(`filter-${s || 'all'}`);
        if (el) el.classList.toggle('active', (s === status) || (s === '' && status === ''));
    });

    renderDreamList(status);
}

function renderDreamRow(d) {
    const badgeClass = { pending: 'badge-pending', approved: 'badge-approved', rejected: 'badge-rejected' }[d.status] || 'badge-approved';
    const statusLabel = { pending: '📤 审核中', approved: '✅ 已发布', rejected: '❌ 已拒绝' }[d.status] || d.status;

    return `
    <tr>
        <td>
            <div class="flex items-center gap-3 max-w-xs">
                ${d.coverImage
            ? `<img src="${d.coverImage}" class="cover-thumb shrink-0" alt="封面">`
            : `<div class="cover-emoji shrink-0">${d.emoji || '✨'}</div>`
        }
                <div class="min-w-0">
                    <p class="font-semibold text-white text-sm truncate">${escHtml(d.title)}</p>
                    <p class="text-xs text-slate-400 truncate max-w-[180px]">${escHtml(d.description || '').slice(0, 60)}</p>
                </div>
            </div>
        </td>
        <td>
            <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    ${(d.author?.name || '?').charAt(0).toUpperCase()}
                </div>
                <span class="text-sm text-slate-300">${escHtml(d.author?.name || '匿名')}</span>
            </div>
        </td>
        <td>
            <span class="badge ${badgeClass}">${statusLabel}</span>
        </td>
        <td>
            <div class="flex flex-col gap-1 text-xs text-slate-400">
                <span>❤️ ${d.likes || 0} 赞</span>
                <span>⚡ ${d.supporters || 0} 支持</span>
            </div>
        </td>
        <td>
            <div class="flex items-center gap-2">
                ${d.status === 'pending' ? `
                    <button onclick="approveDream(${d.id})" class="btn-success btn-sm">
                        <span class="material-symbols-outlined text-sm">check</span>通过
                    </button>
                    <button onclick="openRejectModal(${d.id}, '${escHtml(d.title)}')" class="btn-danger btn-sm">
                        <span class="material-symbols-outlined text-sm">close</span>拒绝
                    </button>
                ` : `
                    <button onclick="openDetailModal(${d.id})" class="btn-ghost btn-sm">
                        <span class="material-symbols-outlined text-sm">visibility</span>查看
                    </button>
                `}
            </div>
        </td>
    </tr>`;
}

function renderPagination() {
    let html = `<div class="flex items-center justify-center gap-2">`;
    html += `<button onclick="goPage(${currentPage - 1})" class="page-btn" ${currentPage <= 1 ? 'disabled' : ''}>
        <span class="material-symbols-outlined text-sm">chevron_left</span>
    </button>`;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button onclick="goPage(${i})" class="page-btn ${i === currentPage ? 'active' : ''}">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<span class="text-slate-500">...</span>`;
        }
    }

    html += `<button onclick="goPage(${currentPage + 1})" class="page-btn" ${currentPage >= totalPages ? 'disabled' : ''}>
        <span class="material-symbols-outlined text-sm">chevron_right</span>
    </button>`;
    html += `</div>`;
    return html;
}

function goPage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderDreamList(currentFilter);
}

// ========== APPROVE / REJECT ==========

async function approveDream(id) {
    if (!confirm('确认审核通过这个梦想？将通知作者并公开发布。')) return;
    try {
        await adminFetch(`/api/admin/dreams/${id}/approve`, { method: 'PUT' });
        showToast('success', '✅ 审核通过，梦想已公开发布');
        loadPendingCount();
        renderDreamList(currentFilter);
    } catch (e) {
        showToast('error', '操作失败：' + e.message);
    }
}

function openRejectModal(id, title) {
    const overlay = document.getElementById('modal-overlay');
    document.getElementById('modal-content').innerHTML = `
    <div>
        <div class="flex items-center gap-3 mb-5">
            <div class="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <span class="material-symbols-outlined text-red-400">cancel</span>
            </div>
            <div>
                <h3 class="text-base font-bold text-white">拒绝审核</h3>
                <p class="text-xs text-slate-400 mt-0.5 truncate max-w-[260px]">梦想：${escHtml(title)}</p>
            </div>
        </div>
        <div class="mb-5">
            <label class="form-label">拒绝原因（可选，将发送给作者）</label>
            <textarea id="reject-reason" class="form-input h-24 resize-none" placeholder="内容不符合社区规范..."></textarea>
        </div>
        <p class="text-xs text-slate-400 mb-5">⚠️ 拒绝后将自动退还作者 20 积分。</p>
        <div class="flex gap-3">
            <button onclick="closeModal()" class="btn-ghost flex-1 justify-center">取消</button>
            <button onclick="rejectDream(${id})" class="btn-danger flex-1 justify-center">确认拒绝</button>
        </div>
    </div>`;
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
}

async function rejectDream(id) {
    const reason = document.getElementById('reject-reason')?.value || '';
    try {
        await adminFetch(`/api/admin/dreams/${id}/reject`, {
            method: 'PUT',
            body: JSON.stringify({ reason })
        });
        closeModal();
        showToast('info', '已拒绝，积分已退还');
        loadPendingCount();
        renderDreamList(currentFilter);
    } catch (e) {
        showToast('error', '操作失败：' + e.message);
    }
}

function openDetailModal(id) {
    const dream = dreamsData.find(d => d.id === id);
    if (!dream) return;
    const overlay = document.getElementById('modal-overlay');
    document.getElementById('modal-content').innerHTML = `
    <div>
        <div class="flex items-start justify-between mb-4">
            <h3 class="text-base font-bold text-white">${escHtml(dream.title)}</h3>
            <button onclick="closeModal()" class="text-slate-400 hover:text-white">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
        ${dream.coverImage ? `<img src="${dream.coverImage}" class="w-full h-40 object-cover rounded-xl mb-4">` : ''}
        <div class="space-y-2 text-sm text-slate-300 mb-4">
            <p>${escHtml(dream.description || '暂无描述')}</p>
        </div>
        <div class="flex flex-wrap gap-2 text-xs">
            <span class="badge ${({ pending: 'badge-pending', approved: 'badge-approved', rejected: 'badge-rejected' }[dream.status])}">
                ${({ pending: '📤 审核中', approved: '✅ 已发布', rejected: '❌ 已拒绝' }[dream.status])}
            </span>
            <span class="badge" style="background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.5);border:1px solid rgba(255,255,255,0.1)">
                作者：${escHtml(dream.author?.name || '匿名')}
            </span>
            <span class="badge" style="background:rgba(255,255,255,0.05);color:rgba(255,255,255,0.5);border:1px solid rgba(255,255,255,0.1)">
                ❤️ ${dream.likes || 0} | ⚡ ${dream.supporters || 0}
            </span>
        </div>
    </div>`;
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
}

// Close modal on backdrop click
document.getElementById('modal-overlay')?.addEventListener('click', function (e) {
    if (e.target === this) closeModal();
});

// ========== ADD DREAM ==========

let uploadedImageUrl = '';

function renderAddDream() {
    document.getElementById('main-content').innerHTML = `
    <div class="fade-in max-w-2xl">
        <div class="mb-8">
            <h1 class="text-2xl font-bold text-white mb-1">录入梦想</h1>
            <p class="text-slate-400 text-sm">管理员直接创建的梦想会立即公开，无需审核</p>
        </div>

        <div class="glass-panel rounded-2xl p-6 space-y-5">

            <!-- Image Upload -->
            <div>
                <label class="form-label">封面图片</label>
                <div class="upload-zone" id="upload-zone" onclick="document.getElementById('file-input').click()"
                    ondragover="handleDragOver(event)" ondrop="handleDrop(event)" ondragleave="handleDragLeave(event)">
                    <input type="file" id="file-input" accept="image/*" class="hidden" onchange="handleFileSelect(event)">
                    <div id="upload-placeholder">
                        <div class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                            <span class="material-symbols-outlined text-primary text-2xl">add_a_photo</span>
                        </div>
                        <p class="text-sm font-medium text-white/80">点击或拖拽上传图片</p>
                        <p class="text-xs text-slate-400 mt-1">支持 JPG、PNG、WebP · 最大 10MB</p>
                        <p class="text-xs text-slate-500 mt-1">图片将上传至 Cloudflare R2</p>
                    </div>
                    <div id="upload-preview" class="hidden">
                        <img id="preview-img" class="max-h-48 mx-auto rounded-xl object-cover" alt="预览">
                        <p id="upload-url" class="text-xs text-green-400 mt-3 break-all"></p>
                        <button onclick="clearImage(event)" class="mt-3 text-xs text-slate-400 hover:text-white">
                            点击重新上传
                        </button>
                    </div>
                    <div id="upload-loading" class="hidden">
                        <div class="spinner mx-auto mb-3"></div>
                        <p class="text-sm text-slate-400">上传中...</p>
                    </div>
                </div>
            </div>

            <!-- Title -->
            <div>
                <label class="form-label">梦想标题 <span class="text-red-400">*</span></label>
                <input id="dream-title" type="text" class="form-input" placeholder="例如：造一台时光机">
            </div>

            <!-- Description -->
            <div>
                <label class="form-label">梦想描述</label>
                <textarea id="dream-desc" class="form-input h-28 resize-none" placeholder="描述这个不可思议的梦想..."></textarea>
            </div>

            <!-- Row: Emoji + Category -->
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="form-label">Emoji</label>
                    <input id="dream-emoji" type="text" class="form-input" placeholder="✨" maxlength="2">
                </div>
                <div>
                    <label class="form-label">分类</label>
                    <input id="dream-category" type="text" class="form-input" placeholder="科技 / 艺术 / 探索...">
                </div>
            </div>

            <!-- Row: Goal + Impossible Index -->
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="form-label">能量目标</label>
                    <input id="dream-goal" type="number" class="form-input" placeholder="1000" value="1000" min="100">
                </div>
                <div>
                    <label class="form-label">不可思议指数 (1-5)</label>
                    <input id="dream-index" type="number" class="form-input" placeholder="3" min="1" max="5" step="0.1">
                </div>
            </div>

            <!-- Submit -->
            <div id="dream-form-error" class="hidden text-xs text-red-400"></div>
            <button onclick="submitDream()" id="submit-btn"
                class="btn-primary w-full justify-center py-3 text-sm">
                <span class="material-symbols-outlined text-lg">rocket_launch</span>
                发布梦想（立即公开）
            </button>
        </div>
    </div>`;
}

// Image Upload Handlers
function handleDragOver(e) {
    e.preventDefault();
    document.getElementById('upload-zone').classList.add('dragover');
}

function handleDragLeave(e) {
    document.getElementById('upload-zone').classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    document.getElementById('upload-zone').classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) uploadFile(file);
}

async function uploadFile(file) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
        showToast('error', '只支持 JPG、PNG、WebP、GIF 格式');
        return;
    }
    if (file.size > 10 * 1024 * 1024) {
        showToast('error', '图片不能超过 10MB');
        return;
    }

    document.getElementById('upload-placeholder').classList.add('hidden');
    document.getElementById('upload-preview').classList.add('hidden');
    document.getElementById('upload-loading').classList.remove('hidden');

    try {
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch(`${BASE_URL}/api/admin/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${adminToken}` },
            body: formData
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || '上传失败');

        uploadedImageUrl = data.url;

        // Show preview
        document.getElementById('preview-img').src = data.url;
        document.getElementById('upload-url').textContent = '✅ ' + data.url;
        document.getElementById('upload-loading').classList.add('hidden');
        document.getElementById('upload-preview').classList.remove('hidden');
        showToast('success', '图片上传成功');
    } catch (e) {
        document.getElementById('upload-loading').classList.add('hidden');
        document.getElementById('upload-placeholder').classList.remove('hidden');
        showToast('error', e.message);
    }
}

function clearImage(e) {
    e.stopPropagation();
    uploadedImageUrl = '';
    document.getElementById('preview-img').src = '';
    document.getElementById('upload-url').textContent = '';
    document.getElementById('upload-preview').classList.add('hidden');
    document.getElementById('upload-placeholder').classList.remove('hidden');
    document.getElementById('file-input').value = '';
}

async function submitDream() {
    const title = document.getElementById('dream-title').value.trim();
    const description = document.getElementById('dream-desc').value.trim();
    const emoji = document.getElementById('dream-emoji').value.trim() || '✨';
    const category = document.getElementById('dream-category').value.trim();
    const goal = parseInt(document.getElementById('dream-goal').value) || 1000;
    const impossibleIndex = parseFloat(document.getElementById('dream-index').value) || 0;
    const errorEl = document.getElementById('dream-form-error');
    const btn = document.getElementById('submit-btn');

    errorEl.classList.add('hidden');

    if (!title) {
        errorEl.textContent = '请输入梦想标题';
        errorEl.classList.remove('hidden');
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px"></div> 发布中...';

    try {
        await adminFetch('/api/admin/dreams', {
            method: 'POST',
            body: JSON.stringify({ title, description, emoji, category, goal, impossibleIndex, coverImage: uploadedImageUrl })
        });

        showToast('success', '🚀 梦想已创建并公开发布！');
        uploadedImageUrl = '';
        renderAddDream(); // Reset form
    } catch (e) {
        errorEl.textContent = e.message;
        errorEl.classList.remove('hidden');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<span class="material-symbols-outlined text-lg">rocket_launch</span>发布梦想（立即公开）';
        }
    }
}

// ========== HELPERS ==========

async function loadPendingCount() {
    try {
        const stats = await adminFetch('/api/admin/stats');
        const badge = document.getElementById('pending-badge');
        if (badge) {
            const count = stats.pendingDreams || 0;
            if (count > 0) {
                badge.textContent = count;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }
    } catch (e) {
        // Silent fail
    }
}

function showError(msg) {
    document.getElementById('main-content').innerHTML = `
    <div class="flex flex-col items-center justify-center h-64">
        <span class="material-symbols-outlined text-5xl text-red-400 mb-3">error</span>
        <p class="text-red-400 text-sm">${escHtml(msg)}</p>
        <button onclick="showView(currentView)" class="btn-ghost mt-4">重试</button>
    </div>`;
}

function showToast(type, message) {
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.innerHTML = `
        <span class="material-symbols-outlined text-base">${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}</span>
        <span>${escHtml(message)}</span>`;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3500);
}

function escHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ========== LOGIN INPUT - ENTER KEY ==========
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !document.getElementById('login-screen').classList.contains('hidden')) {
        handleLogin();
    }
});

// ========== INITIALIZE ==========
window.addEventListener('load', () => {
    const savedUser = localStorage.getItem('admin_user');
    if (adminToken && savedUser) {
        try {
            adminUser = JSON.parse(savedUser);
            enterApp();
        } catch {
            handleLogout();
        }
    }
});
