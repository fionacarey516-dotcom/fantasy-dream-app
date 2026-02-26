// ========== AUTH PAGES ==========
function renderLoginPage() {
    return `
        <div class="flex flex-col items-center justify-center min-h-[80vh] px-4">
            <div class="text-center mb-10">
                <div class="text-6xl mb-4">🌙</div>
                <h1 class="text-3xl font-extrabold text-white mb-2" style="text-shadow: 0 0 20px rgba(200,128,255,0.5);">梦嘢</h1>
                <p class="text-slate-400 text-sm">让梦想照进现实</p>
            </div>
            <div class="w-full max-w-sm space-y-4">
                <input id="login-name" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all" placeholder="用户名" type="text">
                <input id="login-password" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all" placeholder="密码" type="password">
                <button onclick="handleLogin()" class="w-full py-3.5 bg-gradient-to-r from-primary to-purple-800 rounded-xl text-white text-lg font-bold shadow-[0_0_20px_rgba(200,128,255,0.4)] btn-hover">登录</button>
                <p class="text-center text-slate-400 text-sm">还没有账号？<a onclick="navigateTo('register')" class="text-primary cursor-pointer hover:underline">立即注册</a></p>
            </div>
        </div>`;
}

function renderRegisterPage() {
    return `
        <div class="flex flex-col items-center justify-center min-h-[80vh] px-4">
            <div class="text-center mb-10">
                <div class="text-6xl mb-4">✨</div>
                <h1 class="text-3xl font-extrabold text-white mb-2">创建账号</h1>
                <p class="text-slate-400 text-sm">开始你的梦想之旅</p>
            </div>
            <div class="w-full max-w-sm space-y-4">
                <input id="reg-name" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all" placeholder="用户名（2-20字符）" type="text">
                <input id="reg-password" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all" placeholder="密码（至少6位）" type="password">
                <input id="reg-password2" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all" placeholder="确认密码" type="password">
                <button onclick="handleRegister()" class="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-primary rounded-xl text-white text-lg font-bold shadow-[0_0_20px_rgba(34,211,238,0.4)] btn-hover">注册</button>
                <p class="text-center text-slate-400 text-sm">已有账号？<a onclick="navigateTo('login')" class="text-primary cursor-pointer hover:underline">去登录</a></p>
            </div>
        </div>`;
}

async function handleLogin() {
    const name = document.getElementById('login-name')?.value?.trim();
    const password = document.getElementById('login-password')?.value;
    if (!name || !password) { showNotification('提示', '请输入用户名和密码', 'info'); return; }
    try {
        const result = await api.login(name, password);
        localStorage.setItem('auth_token', result.token);
        localStorage.setItem('current_user', JSON.stringify(result.user));
        await loadAllData();
        navigateTo('home');
        showNotification('登录成功', `欢迎回来，${result.user.name}！`, 'success');
    } catch (error) { showNotification('登录失败', error.message, 'error'); }
}

async function handleRegister() {
    const name = document.getElementById('reg-name')?.value?.trim();
    const password = document.getElementById('reg-password')?.value;
    const password2 = document.getElementById('reg-password2')?.value;
    if (!name || !password) { showNotification('提示', '请填写所有字段', 'info'); return; }
    if (password !== password2) { showNotification('提示', '两次密码不一致', 'info'); return; }
    try {
        const result = await api.register(name, password);
        localStorage.setItem('auth_token', result.token);
        localStorage.setItem('current_user', JSON.stringify(result.user));
        await loadAllData();
        navigateTo('home');
        showNotification('注册成功', `欢迎，${result.user.name}！赠送100能量`, 'success');
    } catch (error) { showNotification('注册失败', error.message, 'error'); }
}

function handleLogout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    navigateTo('home');
    showNotification('已退出', '期待你的再次归来', 'info');
}

function getCurrentUser() {
    try { return JSON.parse(localStorage.getItem('current_user')); } catch { return null; }
}

// ========== LOGIN PROMPT MODAL ==========
function requireLogin() {
    if (isLoggedIn()) return true;
    showLoginPromptModal();
    return false;
}

function showLoginPromptModal() {
    // Remove existing modal if any
    const existing = document.getElementById('login-prompt-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'login-prompt-modal';
    modal.className = 'fixed inset-0 z-[200] flex items-center justify-center';
    modal.innerHTML = `
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="closeLoginPromptModal()"></div>
        <div class="relative z-10 w-full max-w-sm mx-4 animate-fade-in">
            <div class="bg-[#2d1b36] border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div class="text-center mb-6">
                    <div class="text-5xl mb-3">🌙</div>
                    <h3 class="text-xl font-bold text-white mb-2">需要登录</h3>
                    <p class="text-slate-400 text-sm">登录后即可参与评论、评分和赞助</p>
                </div>
                <div class="space-y-3">
                    <button onclick="closeLoginPromptModal(); navigateTo('login')" class="w-full py-3 bg-gradient-to-r from-primary to-purple-800 rounded-xl text-white font-bold shadow-[0_0_20px_rgba(200,128,255,0.4)] hover:brightness-110 transition-all">去登录</button>
                    <button onclick="closeLoginPromptModal(); navigateTo('register')" class="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-all">注册新账号</button>
                    <button onclick="closeLoginPromptModal()" class="w-full py-2 text-slate-500 text-sm hover:text-slate-300 transition-colors">继续浏览</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeLoginPromptModal() {
    const modal = document.getElementById('login-prompt-modal');
    if (modal) modal.remove();
}

// ========== CHANGE PASSWORD MODAL ==========
function showChangePasswordModal() {
    const existing = document.getElementById('change-password-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'change-password-modal';
    modal.className = 'fixed inset-0 z-[200] flex items-center justify-center';
    modal.innerHTML = `
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="closeChangePasswordModal()"></div>
        <div class="relative z-10 w-full max-w-sm mx-4 animate-fade-in">
            <div class="bg-[#2d1b36] border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div class="text-center mb-6">
                    <div class="text-4xl mb-3">🔐</div>
                    <h3 class="text-xl font-bold text-white mb-1">修改密码</h3>
                    <p class="text-slate-400 text-xs">请输入旧密码和新密码</p>
                </div>
                <div class="space-y-3">
                    <input id="cp-old-password" type="password" placeholder="旧密码" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all">
                    <input id="cp-new-password" type="password" placeholder="新密码（至少6位）" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all">
                    <input id="cp-confirm-password" type="password" placeholder="确认新密码" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all">
                    <button onclick="handleChangePassword()" class="w-full py-3 bg-gradient-to-r from-primary to-purple-800 rounded-xl text-white font-bold shadow-[0_0_20px_rgba(200,128,255,0.4)] hover:brightness-110 transition-all mt-2">确认修改</button>
                    <button onclick="closeChangePasswordModal()" class="w-full py-2 text-slate-500 text-sm hover:text-slate-300 transition-colors">取消</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeChangePasswordModal() {
    const modal = document.getElementById('change-password-modal');
    if (modal) modal.remove();
}

async function handleChangePassword() {
    const oldPwd = document.getElementById('cp-old-password')?.value;
    const newPwd = document.getElementById('cp-new-password')?.value;
    const confirmPwd = document.getElementById('cp-confirm-password')?.value;

    if (!oldPwd || !newPwd) {
        showNotification('提示', '请填写所有字段', 'info');
        return;
    }
    if (newPwd !== confirmPwd) {
        showNotification('提示', '两次新密码不一致', 'info');
        return;
    }
    if (newPwd.length < 6) {
        showNotification('提示', '新密码至少6个字符', 'info');
        return;
    }
    try {
        await api.changePassword(oldPwd, newPwd);
        closeChangePasswordModal();
        showNotification('修改成功', '密码已更新', 'success');
    } catch (e) {
        showNotification('修改失败', e.message, 'error');
    }
}

// ========== STAR RATING HELPER ==========
function renderStars(rating, maxStars = 5, size = 'text-lg', interactive = false, dreamId = null) {
    let html = '<div class="flex items-center gap-0.5">';
    for (let i = 1; i <= maxStars; i++) {
        const filled = i <= Math.round(rating);
        if (interactive) {
            html += `<button onclick="event.stopPropagation(); rateDreamStar(${dreamId}, ${i})" class="${filled ? 'text-yellow-400' : 'text-slate-600'} hover:text-yellow-400 hover:scale-110 transition-all"><span class="material-symbols-outlined ${size}" style="font-variation-settings: 'FILL' ${filled ? 1 : 0};">star</span></button>`;
        } else {
            html += `<span class="${filled ? 'text-yellow-400' : 'text-slate-600'}"><span class="material-symbols-outlined ${size}" style="font-variation-settings: 'FILL' ${filled ? 1 : 0};">star</span></span>`;
        }
    }
    html += '</div>';
    return html;
}

// ========== HOME PAGE ==========
function renderHomePage() {
    const featuredDreams = getFeaturedDreams();
    const otherDreams = dreamData.dreams.filter(d => !d.featured).slice(0, 4);
    if (!featuredDreams.length) {
        return `<div class="text-center py-12 text-slate-400">暂无梦想数据</div>`;
    }
    return `
        <div class="w-full relative rounded-2xl overflow-hidden h-40 shadow-2xl group cursor-pointer border border-white/10 mb-6" onclick="navigateTo('detail', {dreamId: ${featuredDreams[0].id}})">
            <div class="absolute inset-0 bg-gradient-to-r from-pink-500/40 via-purple-500/40 to-blue-500/40 z-10 glitch-pixel-bg scanlines"></div>
            ${featuredDreams[0].coverImage ? `<div class="absolute inset-0 bg-cover bg-center scale-110 brightness-75 contrast-125 opacity-70 mix-blend-hard-light" style="background-image: url('${featuredDreams[0].coverImage}'); filter: hue-rotate(45deg) contrast(1.2);"></div>` : ''}
            <div class="absolute inset-0 bg-black/20 z-10" style="background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, #000 3px);"></div>
            <div class="relative z-20 h-full flex flex-col justify-end p-5">
                <span class="inline-block px-2 py-0.5 rounded-none bg-black/60 backdrop-blur-sm text-[10px] font-bold text-cyan-300 mb-2 self-start border-l-4 border-cyan-500 uppercase tracking-widest" style="box-shadow: 2px 2px 0px #ff00c1;">WEEKLY GLITCH</span>
                <h2 class="text-xl font-bold text-white leading-tight mb-1" style="text-shadow: 3px 3px 0px #ff00c1, -2px -2px 0px #00fff0; font-family: monospace;">本周荒诞之星：<br/>${featuredDreams[0].title}</h2>
                <p class="text-sm text-white/90 font-medium flex items-center gap-1 font-mono"><span class="material-symbols-outlined text-sm">groups_2</span>已有 ${formatNumber(featuredDreams[0].supporters)} 人支持</p>
            </div>
        </div>
        <div class="flex gap-3 overflow-x-auto no-scrollbar pb-4 mb-2">
            <button class="px-4 py-2 rounded-full bg-primary text-white text-sm font-bold whitespace-nowrap border border-white/20" onclick="filterDreams('popular', this)">热门推荐</button>
            <button class="px-4 py-2 rounded-full bg-white/5 text-white/70 text-sm font-medium whitespace-nowrap border border-white/10 hover:bg-white/15" onclick="filterDreams('newest', this)">最新发布</button>
            <button class="px-4 py-2 rounded-full bg-white/5 text-white/70 text-sm font-medium whitespace-nowrap border border-white/10 hover:bg-white/15" onclick="filterDreams('upcoming', this)">即将实现</button>
            <button class="px-4 py-2 rounded-full bg-white/5 text-white/70 text-sm font-medium whitespace-nowrap border border-white/10 hover:bg-white/15" onclick="filterDreams('creative', this)">脑洞大开</button>
            <button class="px-4 py-2 rounded-full bg-white/5 text-white/70 text-sm font-medium whitespace-nowrap border border-white/10 hover:bg-white/15" onclick="filterDreams('completed', this)">造梦完成</button>
        </div>
        <div id="dream-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${otherDreams.map(dream => renderDreamCard(dream)).join('')}
        </div>`;
}

function renderDreamCard(dream) {
    const g = getGradientForDream(dream.id);
    const idx = dream.impossibleIndex || 0;
    return `
        <div class="dream-card glass-panel rounded-2xl overflow-hidden flex flex-col group hover:border-primary/50 transition-colors border-white/5" onclick="navigateTo('detail', {dreamId: ${dream.id}})">
            <div class="h-40 w-full relative overflow-hidden ${g} flex items-center justify-center glitch-pixel-bg">
                ${dream.coverImage ? `<img alt="${dream.title}" class="absolute inset-0 w-full h-full object-cover opacity-70" src="${dream.coverImage}">` : `<div class="text-[80px] drop-shadow-lg transform group-hover:scale-110 transition-transform duration-500 cursor-default emoji-glitch opacity-90 relative">${dream.emoji}</div>`}
                <div class="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded-none border border-primary/30 flex items-center gap-1">
                    <span class="text-yellow-400 material-symbols-outlined text-[14px]" style="font-variation-settings: 'FILL' 1;">star</span>
                    <span class="text-xs font-bold text-white">${parseFloat(idx.toFixed(2))}</span>
                </div>
            </div>
            <div class="p-4 flex flex-col gap-3">
                <div>
                    <h3 class="text-lg font-bold text-white leading-snug">${dream.title}</h3>
                    <div class="flex items-center gap-2 mb-2">
                        ${dream.author.avatar ? `<div class="w-6 h-6 rounded-full border border-white/20 overflow-hidden bg-slate-800"><img alt="Avatar" class="w-full h-full object-cover" src="${dream.author.avatar}"></div>` : `<div class="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-purple-400 flex items-center justify-center text-xs text-white">${dream.author.name.charAt(0)}</div>`}
                        <span class="text-xs text-white/60">${dream.author.name}</span>
                    </div>
                    <p class="text-sm text-white/80 line-clamp-2 leading-relaxed h-10">${dream.description}</p>
                </div>
                <div class="flex items-center justify-between text-xs text-white/50 border-t border-white/10 pt-3 mt-1">
                    <div class="flex gap-3">
                        <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px] text-pink-500">favorite</span> ${formatNumber(dream.likes)}</span>
                        <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px] text-cyan-300">visibility</span> ${formatNumber(dream.supporters)}</span>
                    </div>
                </div>
            </div>
        </div>`;
}

// ========== FILTER ==========
function filterDreams(filterType, btn) {
    const buttons = btn.parentElement.querySelectorAll('button');
    buttons.forEach(b => { b.classList.remove('bg-primary', 'text-white', 'font-bold'); b.classList.add('bg-white/5', 'text-white/70', 'font-medium'); });
    btn.classList.remove('bg-white/5', 'text-white/70', 'font-medium');
    btn.classList.add('bg-primary', 'text-white', 'font-bold');
    let filtered = [];
    const allDreams = dreamData.dreams.filter(d => !d.featured);
    switch (filterType) {
        case 'popular': filtered = allDreams.filter(d => !d.isCompleted && d.energy < d.goal).sort((a, b) => b.supporters - a.supporters); break;
        case 'newest': filtered = allDreams.filter(d => !d.isCompleted && d.energy < d.goal).sort((a, b) => b.id - a.id); break;
        case 'upcoming': filtered = allDreams.filter(d => !d.isCompleted && d.energy < d.goal && (d.goal > 0 ? (d.energy / d.goal) * 100 : 0) >= 90); break;
        case 'creative': filtered = allDreams.filter(d => !d.isCompleted && d.energy < d.goal && d.ratingCount >= 10 && d.impossibleIndex >= 3.5); break;
        case 'completed': filtered = allDreams.filter(d => d.isCompleted || d.energy >= d.goal).sort((a, b) => b.id - a.id); break;
        default: filtered = allDreams.filter(d => !d.isCompleted && d.energy < d.goal);
    }
    const grid = document.getElementById('dream-grid');
    if (grid) { grid.innerHTML = filtered.length > 0 ? filtered.map(d => renderDreamCard(d)).join('') : '<p class="text-slate-500 text-sm text-center py-8 col-span-2">暂无符合条件的梦想</p>'; }
}

// ========== NOTIFICATIONS PAGE ==========
function renderNotificationsPage() {
    const notifications = dreamData.notifications;
    const unreadCount = notifications.filter(n => !n.read).length;
    return `
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-white">通知</h2>
            ${unreadCount > 0 ? `<button class="text-sm text-primary hover:text-white transition-colors font-medium" onclick="markAllAsRead()">全部标为已读</button>` : ''}
        </div>
        ${notifications.length > 0 ? `<div class="space-y-3">${notifications.map(n => renderNotificationItem(n)).join('')}</div>` : `<div class="flex flex-col items-center justify-center py-16"><div class="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4"><span class="material-symbols-outlined text-4xl text-slate-500">notifications_none</span></div><p class="text-slate-400 text-sm mb-2">暂无通知</p></div>`}`;
}

function renderNotificationItem(notification) {
    let icon, actionText, iconBg;
    switch (notification.type) {
        case "like": icon = `<span class="material-symbols-outlined text-pink-500" style="font-variation-settings: 'FILL' 1;">favorite</span>`; iconBg = "bg-pink-500/20"; actionText = "赞了你的梦想"; break;
        case "comment": icon = `<span class="material-symbols-outlined text-blue-500" style="font-variation-settings: 'FILL' 1;">comment</span>`; iconBg = "bg-blue-500/20"; actionText = "评论了你的梦想"; break;
        case "sponsor": icon = `<span class="material-symbols-outlined text-green-500" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>`; iconBg = "bg-green-500/20"; actionText = "赞助了你的梦想"; break;
        case "achievement": icon = `<span class="material-symbols-outlined text-yellow-500" style="font-variation-settings: 'FILL' 1;">celebration</span>`; iconBg = "bg-yellow-500/20"; break;
        default: icon = `<span class="material-symbols-outlined text-slate-400">notifications</span>`; iconBg = "bg-slate-500/20";
    }
    const dream = notification.targetDream ? getDreamById(notification.targetDream) : null;
    return `
        <div class="relative flex gap-3 p-4 rounded-2xl ${notification.read ? 'bg-white/5' : 'bg-primary/10 border border-primary/20'} transition-all cursor-pointer">
            ${notification.user ? (notification.user.avatar ? `<img alt="${notification.user.name}" class="w-10 h-10 rounded-full object-cover shrink-0 border border-white/10" src="${notification.user.avatar}">` : `<div class="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-primary flex items-center justify-center text-xs font-bold text-white shrink-0">${notification.user.name.charAt(0)}</div>`) : `<div class="w-10 h-10 rounded-full ${iconBg} flex items-center justify-center shrink-0">${icon}</div>`}
            <div class="flex-1 min-w-0">
                ${notification.user ? `<div class="flex items-baseline gap-1 flex-wrap mb-1"><span class="text-sm font-semibold text-white">${notification.user.name}</span><span class="text-sm text-slate-400">${actionText}</span>${dream ? `<span class="text-sm font-medium text-primary">${dream.title}</span>` : ''}</div>` : `<div class="flex items-center gap-2 mb-1"><p class="text-sm text-slate-300 font-medium">${notification.content}</p>${notification.reward ? `<span class="inline-flex items-center gap-1 text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20"><span class="material-symbols-outlined text-[12px]">bolt</span>+${notification.reward}</span>` : ''}</div>`}
                <p class="text-xs text-slate-500 mt-2">${notification.timeAgo}</p>
            </div>
            ${!notification.read ? `<div class="absolute right-4 top-4 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(200,128,255,0.6)]"></div>` : ''}
        </div>`;
}

async function markAllAsRead() {
    try { await api.markAllNotificationsRead(); dreamData.notifications.forEach(n => n.read = true); loadPageContent('notifications'); } catch (e) { showNotification('操作失败', e.message, 'error'); }
}

// ========== FEED PAGE ==========
function renderFeedPage() {
    return `
        <div class="relative py-6 flex items-center justify-center mb-6">
            <div class="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-glass-border to-transparent"></div>
            <div class="relative z-10 bg-background-dark/80 px-4 py-1 rounded-full border border-glass-border backdrop-blur-md"><p class="text-xs font-medium text-primary tracking-wide">🌸 今日有 <span class="font-bold text-white">${dreamData.dreams.length}</span> 个梦想</p></div>
        </div>
        <div class="flex flex-col gap-6">${dreamData.feed.map((a, i) => renderFeedItem(a, i < dreamData.feed.length - 1)).join('')}</div>`;
}

function renderFeedItem(activity, showConnector) {
    const dream = getDreamById(activity.targetDream);
    if (!dream) return '';
    const labels = { sponsor: '赞助了', publish: '发布了', fork: '克隆了', like: '点赞了', comment: '评论了' };
    const colors = { sponsor: 'primary', publish: 'blue', fork: 'green', like: 'pink', comment: 'purple' };
    const c = colors[activity.type] || 'primary', l = labels[activity.type] || '发布了';
    return `
        <div class="relative group">
            ${showConnector ? `<div class="absolute left-[19px] top-12 bottom-[-24px] w-0.5 bg-gradient-to-b from-glass-border to-transparent"></div>` : ''}
            <div class="flex items-start gap-3">
                <div class="relative shrink-0">${activity.user.avatar ? `<img alt="${activity.user.name}" class="h-10 w-10 rounded-full border-2 border-primary/30 p-0.5 bg-background-dark object-cover" src="${activity.user.avatar}">` : `<div class="h-10 w-10 rounded-full border-2 border-slate-700 p-0.5 bg-gradient-to-tr from-pink-500 to-orange-400 text-white text-xs font-bold flex items-center justify-center">${activity.user.name.charAt(0)}</div>`}</div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-baseline flex-wrap gap-x-1 mb-3"><span class="font-bold text-white text-sm">${activity.user.name}</span><span class="text-xs text-${c}-400 font-medium px-1.5 py-0.5 bg-${c}-400/10 rounded-md border border-${c}-400/20">${l}</span><span class="font-bold text-white text-sm">${dream.title}</span><span class="text-xs text-slate-400 ml-auto">${activity.timeAgo}</span></div>
                    <div class="relative overflow-hidden rounded-2xl border border-glass-border bg-glass backdrop-blur-md p-4 hover:bg-glass-border transition-colors cursor-pointer" onclick="navigateTo('detail', {dreamId: ${dream.id}})">
                        <div class="flex gap-4 items-start">
                            ${dream.coverImage ? `<div class="h-16 w-16 shrink-0 rounded-xl overflow-hidden shadow-lg"><img alt="${dream.title}" class="h-full w-full object-cover" src="${dream.coverImage}"></div>` : `<div class="h-16 w-16 shrink-0 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg"><span class="text-3xl">${dream.emoji}</span></div>`}
                            <div class="flex-1 min-w-0"><h3 class="text-base font-bold text-white truncate mb-1">${dream.title}</h3><p class="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">${dream.description}</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}

// ========== PROFILE PAGE ==========
function renderProfilePage() {
    const profile = dreamData.userProfile;
    return `
        <div class="relative w-full">
            <div class="h-48 w-full bg-gradient-to-b from-[#4a2b6b] to-background-dark relative overflow-hidden"><div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div></div>
            <div class="px-6 -mt-12 flex flex-col items-center relative z-10">
                <div class="relative group">
                    <div class="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-75"></div>
                    <div class="relative w-24 h-24 rounded-full p-1 bg-background-dark">
                        ${profile.avatar ? `<img alt="Profile" class="w-full h-full object-cover rounded-full border-2 border-background-dark avatar-glow" src="${profile.avatar}">` : `<div class="w-full h-full rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-3xl font-bold text-white border-2 border-background-dark">${(profile.name || 'U').charAt(0)}</div>`}
                    </div>
                </div>
                <div class="mt-3 text-center">
                    <h1 class="text-2xl font-bold tracking-tight text-white flex items-center gap-2 justify-center">${profile.name}${profile.verified ? '<span class="material-symbols-outlined text-yellow-400 text-sm">verified</span>' : ''}</h1>
                    <p class="text-slate-400 text-sm font-medium mt-1">粉丝 ${profile.followers} <span class="mx-1 opacity-30">|</span> 关注 ${profile.following}</p>
                    <p class="text-slate-500 text-xs mt-2 max-w-[240px] leading-relaxed">${profile.bio || ''}</p>
                </div>
            </div>
        </div>
        <div class="px-4 mt-4">
            <div class="bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-xl border border-primary/30 p-3 backdrop-blur-sm">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-10 h-10 rounded-lg bg-primary/30 flex items-center justify-center"><span class="material-symbols-outlined text-xl text-primary">bolt</span></div>
                        <div><p class="text-[10px] text-slate-400 mb-0.5">我的能量</p><p class="text-xl font-bold text-white">${(profile.energy || 0).toLocaleString()}</p></div>
                    </div>
                    <button class="px-4 py-2 rounded-lg ${profile.todayClaimed ? 'bg-white/5 text-slate-500' : 'bg-white/10 text-white'} text-xs font-medium hover:bg-white/20 transition-colors" onclick="claimDailyReward()">${profile.todayClaimed ? '已领取' : '每日+50'}</button>
                </div>
            </div>
        </div>
        <div class="px-4 mt-6 space-y-3">
            <button onclick="showMyDreams()" class="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div class="flex items-center gap-3"><span class="material-symbols-outlined text-primary">auto_awesome</span><span class="text-white font-medium text-sm">发布的梦想</span></div>
                <span class="material-symbols-outlined text-slate-500 text-lg">chevron_right</span>
            </button>
            <button onclick="showSupportedDreams()" class="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div class="flex items-center gap-3"><span class="material-symbols-outlined text-pink-400" style="font-variation-settings: 'FILL' 1;">favorite</span><span class="text-white font-medium text-sm">支持的梦想</span></div>
                <span class="material-symbols-outlined text-slate-500 text-lg">chevron_right</span>
            </button>
            <div class="h-px bg-white/5 my-2"></div>
            <button onclick="showAccountSettings()" class="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div class="flex items-center gap-3"><span class="material-symbols-outlined text-slate-400">settings</span><span class="text-white font-medium text-sm">账号设置</span></div>
                <span class="material-symbols-outlined text-slate-500 text-lg">chevron_right</span>
            </button>
        </div>
        <div class="h-8"></div>`;
}

// Profile sub-pages
async function showMyDreams() {
    const content = document.getElementById('page-content');
    content.innerHTML = '<div class="flex justify-center items-center py-12"><div class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>';
    try {
        const dreams = await api.getMyDreams();
        content.innerHTML = `<div class="fade-in">
            <div class="flex items-center gap-3 mb-6"><button onclick="navigateTo('profile')" class="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors"><span class="material-symbols-outlined">arrow_back</span></button><h2 class="text-xl font-bold text-white">发布的梦想</h2></div>
            ${dreams.length > 0 ? `<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">${dreams.map(d => renderMyDreamCard(d)).join('')}</div>` : '<div class="text-center py-16"><div class="text-4xl mb-3">✨</div><p class="text-slate-400 text-sm">还没有发布梦想</p><button onclick="navigateTo(\'create\')" class="mt-4 px-6 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium hover:bg-primary/30 transition-colors">去创建</button></div>'}
        </div>`;
    } catch (e) { showNotification('加载失败', e.message, 'error'); navigateTo('profile'); }
}

function renderMyDreamCard(dream) {
    return `<div class="relative">${renderDreamCard(dream)}<button onclick="event.stopPropagation(); confirmDeleteDream(${dream.id}, '${dream.title.replace(/'/g, "\\'")}')" class="absolute top-3 left-3 w-8 h-8 rounded-full bg-red-500/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-500 transition-colors z-10" title="删除"><span class="material-symbols-outlined text-base">delete</span></button></div>`;
}

function confirmDeleteDream(dreamId, title) {
    const existing = document.getElementById('delete-confirm-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'delete-confirm-modal';
    modal.className = 'fixed inset-0 z-[200] flex items-center justify-center';
    modal.innerHTML = `
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="this.parentElement.remove()"></div>
        <div class="relative z-10 w-full max-w-sm mx-4 animate-fade-in">
            <div class="bg-[#2d1b36] border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div class="text-center mb-6">
                    <div class="text-4xl mb-3">⚠️</div>
                    <h3 class="text-xl font-bold text-white mb-2">确认删除</h3>
                    <p class="text-slate-400 text-sm">确定要删除「${title}」吗？<br><span class="text-yellow-400/80 text-xs">未完成的梦想将退还所有赞助者能量</span></p>
                </div>
                <div class="space-y-3">
                    <button onclick="handleDeleteDream(${dreamId})" class="w-full py-3 bg-red-500 rounded-xl text-white font-bold hover:bg-red-600 transition-all">确认删除</button>
                    <button onclick="this.closest('#delete-confirm-modal').remove()" class="w-full py-2 text-slate-500 text-sm hover:text-slate-300 transition-colors">取消</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

async function handleDeleteDream(dreamId) {
    const modal = document.getElementById('delete-confirm-modal');
    if (modal) modal.remove();
    try {
        await api.deleteDream(dreamId);
        showNotification('已删除', '梦想已删除，赞助能量已退还', 'success');
        showMyDreams(); // Reload the list
    } catch (e) { showNotification('删除失败', e.message, 'error'); }
}

async function showSupportedDreams() {
    const content = document.getElementById('page-content');
    content.innerHTML = '<div class="flex justify-center items-center py-12"><div class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>';
    try {
        const dreams = await api.getSupportedDreams();
        content.innerHTML = `<div class="fade-in">
            <div class="flex items-center gap-3 mb-6"><button onclick="navigateTo('profile')" class="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors"><span class="material-symbols-outlined">arrow_back</span></button><h2 class="text-xl font-bold text-white">支持的梦想</h2></div>
            ${dreams.length > 0 ? `<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">${dreams.map(d => renderDreamCard(d)).join('')}</div>` : '<div class="text-center py-16"><div class="text-4xl mb-3">❤️</div><p class="text-slate-400 text-sm">还没有支持过梦想</p><button onclick="navigateTo(\'home\')" class="mt-4 px-6 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium hover:bg-primary/30 transition-colors">去探索</button></div>'}
        </div>`;
    } catch (e) { showNotification('加载失败', e.message, 'error'); navigateTo('profile'); }
}

function showAccountSettings() {
    const content = document.getElementById('page-content');
    const userInfo = Array.isArray(window.currentUser) ? window.currentUser[0] : window.currentUser;
    const currentBio = userInfo && userInfo.bio ? userInfo.bio : '';
    content.innerHTML = `<div class="fade-in">
        <div class="flex items-center gap-3 mb-6"><button onclick="navigateTo('profile')" class="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors"><span class="material-symbols-outlined">arrow_back</span></button><h2 class="text-xl font-bold text-white">账号设置</h2></div>
        <div class="space-y-3">
            <button onclick="showChangeBioModal('${currentBio.replace(/'/g, "\\'")}')" class="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div class="flex items-center gap-3"><span class="material-symbols-outlined text-primary">edit_note</span><span class="text-white font-medium text-sm">修改签名</span></div>
                <span class="material-symbols-outlined text-slate-500 text-lg">chevron_right</span>
            </button>
            <button onclick="showChangePasswordModal()" class="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div class="flex items-center gap-3"><span class="material-symbols-outlined text-primary">lock_reset</span><span class="text-white font-medium text-sm">修改密码</span></div>
                <span class="material-symbols-outlined text-slate-500 text-lg">chevron_right</span>
            </button>
            <button onclick="handleLogout()" class="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-red-500/5 transition-colors">
                <div class="flex items-center gap-3"><span class="material-symbols-outlined text-red-400">logout</span><span class="text-red-400 font-medium text-sm">退出登录</span></div>
                <span class="material-symbols-outlined text-slate-500 text-lg">chevron_right</span>
            </button>
        </div>
    </div>`;
}

function showChangeBioModal(currentBio) {
    const existing = document.getElementById('change-bio-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'change-bio-modal';
    modal.className = 'fixed inset-0 z-[200] flex items-center justify-center';
    modal.innerHTML = `
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="this.parentElement.remove()"></div>
        <div class="relative z-10 w-full max-w-sm mx-4 animate-fade-in">
            <div class="bg-[#2d1b36] border border-white/10 rounded-3xl p-8 shadow-2xl relative">
                <button onclick="this.closest('#change-bio-modal').remove()" class="absolute top-4 right-4 text-white/50 hover:text-white transition-colors w-8 h-8 flex items-center justify-center bg-white/5 rounded-full"><span class="material-symbols-outlined text-sm">close</span></button>
                <div class="text-center mb-6">
                    <div class="w-16 h-16 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20"><span class="material-symbols-outlined text-3xl text-primary">edit_note</span></div>
                    <h3 class="text-xl font-bold text-white mb-1">修改签名</h3>
                    <p class="text-slate-400 text-sm">用一句话介绍自己（限50字以内）</p>
                </div>
                <form id="change-bio-form" class="space-y-4" onsubmit="handleChangeBio(event)">
                    <div>
                        <textarea id="newBio" class="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors h-24 resize-none" placeholder="输入新的签名" maxlength="50">${currentBio}</textarea>
                    </div>
                    <button type="submit" class="w-full py-3 bg-gradient-to-r from-primary to-purple-500 rounded-xl text-white font-bold text-sm shadow-[0_0_20px_rgba(200,128,255,0.3)] hover:shadow-[0_0_30px_rgba(200,128,255,0.5)] transition-all flex justify-center items-center h-[46px]">
                        <span id="change-bio-btn-text">保存修改</span>
                        <div id="change-bio-btn-spinner" class="hidden w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </button>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

async function handleChangeBio(e) {
    if (e) e.preventDefault();
    const newBio = document.getElementById('newBio').value.trim();
    if (newBio.length > 50) return showNotification('错误', '签名不能超过50个字符', 'error');

    const btnText = document.getElementById('change-bio-btn-text');
    const spinner = document.getElementById('change-bio-btn-spinner');
    if (btnText) btnText.classList.add('hidden');
    if (spinner) spinner.classList.remove('hidden');

    try {
        const response = await api.updateBio(newBio);
        if (response && response.success) {
            if (Array.isArray(window.currentUser)) {
                window.currentUser[0].bio = newBio;
            } else if (window.currentUser) {
                window.currentUser.bio = newBio;
            }
            showNotification('修改成功', '您的个性签名已更新', 'success');
            document.getElementById('change-bio-modal').remove();

            // Re-render profile page if it's currently showing
            const bioElement = document.querySelector('.profile-bio-text');
            if (bioElement) {
                bioElement.textContent = newBio || '这个梦想家还在寻找语言来描述自己...';
            } else if (document.getElementById('page-content').innerHTML.includes('我的梦想')) {
                // If we are in the profile page, just re-render to update the bio in the header
                document.getElementById('page-content').innerHTML = renderProfilePage();
            }
        }
    } catch (error) {
        if (btnText) btnText.classList.remove('hidden');
        if (spinner) spinner.classList.add('hidden');
        showNotification('修改失败', error.message || '网络错误', 'error');
    }
}

function renderProfileDreamCard(dream) {
    const g = getGradientForDream(dream.id);
    return `
        <div class="group relative aspect-square rounded-[20px] border border-white/10 overflow-hidden hover:border-primary/50 transition-colors cursor-pointer" onclick="navigateTo('detail', {dreamId: ${dream.id}})">
            <div class="absolute inset-0 ${g}"></div>
            <div class="absolute inset-0 p-4 flex flex-col justify-between">
                <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-2xl shadow-inner backdrop-blur-sm">${dream.emoji}</div>
                <div>
                    <h3 class="text-white font-bold text-base leading-tight mb-2 line-clamp-2">${dream.title}</h3>
                    <div class="mb-2">
                        <div class="flex items-center justify-between mb-1"><span class="text-xs text-slate-400">能量进度</span><span class="text-xs text-white font-medium">${dream.energy || 0}/${dream.goal || 1000}</span></div>
                        <div class="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden"><div class="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full transition-all" style="width: ${Math.min(100, ((dream.energy || 0) / (dream.goal || 1)) * 100)}%"></div></div>
                    </div>
                    <div class="flex items-center gap-1.5"><span class="material-symbols-outlined text-red-400 text-[14px]">favorite</span><span class="text-slate-400 text-xs font-medium">${formatNumber(dream.likes)} 助力</span></div>
                </div>
            </div>
        </div>`;
}

// ========== CREATE PAGE ==========
let createPageState = { rating: 0, goalValue: 1000, coverBase64: null };

function renderCreatePage() {
    createPageState = { rating: 0, goalValue: 1000, coverBase64: null };
    return `
        <div id="cover-upload-area" class="w-full aspect-[343/180] relative group cursor-pointer mb-6" onclick="document.getElementById('cover-file-input').click()">
            <input type="file" id="cover-file-input" accept="image/*" class="hidden" onchange="handleCoverUpload(event)">
            <div id="cover-preview-container" class="absolute inset-0 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                <div class="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><span class="material-symbols-outlined text-3xl">add_a_photo</span></div>
                <div class="text-center"><p class="text-sm font-bold text-white/90">上传封面</p><p class="text-xs text-slate-400 mt-1">点击选择本地照片</p></div>
            </div>
        </div>
        <div class="flex flex-col gap-2 mb-6">
            <input id="create-title" class="w-full bg-transparent border-0 border-b border-white/10 text-2xl font-bold placeholder:text-slate-500 focus:ring-0 focus:border-primary px-0 py-3 transition-colors text-white" placeholder="例如：造一台时光机..." type="text">
        </div>
        <div class="flex flex-col gap-2 relative mb-6">
            <textarea id="create-desc" class="glass-input w-full min-h-[140px] rounded-xl text-base placeholder:text-slate-500 focus:ring-0 p-4 text-slate-200 resize-none leading-relaxed" placeholder="描述这个不可思议的梦想..." maxlength="500" oninput="this.nextElementSibling.textContent=this.value.length+'/500'"></textarea>
            <div class="absolute bottom-3 right-3 text-xs text-slate-500 pointer-events-none">0/500</div>
        </div>
        <div class="glass-panel p-5 rounded-xl flex flex-col gap-3 mb-6">
            <div class="flex items-center justify-between">
                <h3 class="text-sm font-bold text-slate-200 flex items-center gap-2"><span class="material-symbols-outlined text-primary text-lg">rocket_launch</span>不可思议指数</h3>
                <span id="create-rating-label" class="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">点击评分</span>
            </div>
            <div class="flex items-center justify-between px-2 pt-1" id="create-stars">
                ${[1, 2, 3, 4, 5].map(i => `<button onclick="setCreateRating(${i})" class="text-slate-600 hover:text-yellow-400 hover:scale-110 transition-all" data-star="${i}"><span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 0;">star</span></button>`).join('')}
            </div>
        </div>
        <div class="glass-panel p-5 rounded-xl flex flex-col gap-4 mb-6">
            <div class="flex items-center justify-between">
                <h3 class="text-sm font-bold text-slate-200 flex items-center gap-2"><span class="material-symbols-outlined text-primary text-lg">bolt</span>设定目标</h3>
                <span id="goal-display" class="text-primary font-bold text-lg">1,000 <span class="text-xs font-normal text-slate-400">能量</span></span>
            </div>
            <div class="grid grid-cols-5 gap-2" id="goal-options">
                ${[1000, 2000, 3000, 4000, 5000].map(v => `<button onclick="selectGoal(${v})" class="goal-option py-2.5 rounded-xl text-sm font-bold transition-all ${v === 1000 ? 'bg-primary text-white shadow-[0_0_15px_rgba(200,128,255,0.4)]' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'}" data-goal="${v}">${(v / 1000)}k</button>`).join('')}
            </div>
        </div>
        <div class="flex items-center justify-between py-2 px-1 mb-6">
            <div class="flex flex-col"><span class="text-base font-medium text-white flex items-center gap-2"><span class="material-symbols-outlined text-slate-400">visibility_off</span>匿名发布</span><span class="text-xs text-slate-500">在这个梦想里，没有人知道你是谁</span></div>
            <label class="relative inline-flex items-center cursor-pointer"><input id="create-anonymous" class="sr-only peer" type="checkbox"><div class="w-12 h-7 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div></label>
        </div>
        <button onclick="publishDream()" class="w-full py-4 bg-gradient-to-r from-primary to-purple-800 rounded-full text-white text-lg font-bold shadow-[0_0_20px_rgba(200,128,255,0.4)] btn-hover">🚀 发布梦想</button>`;
}

function initCreatePage() { /* placeholder */ }

function setCreateRating(stars) {
    createPageState.rating = stars;
    const labels = ['', '异想天开', '天马行空', '脑洞大开', '超越物理', '宇宙级别'];
    document.getElementById('create-rating-label').textContent = `Lv.${stars} ${labels[stars]}`;
    document.querySelectorAll('#create-stars button').forEach((btn, i) => {
        const span = btn.querySelector('span');
        if (i < stars) { btn.classList.remove('text-slate-600'); btn.classList.add('text-yellow-400'); span.style.fontVariationSettings = "'FILL' 1"; }
        else { btn.classList.remove('text-yellow-400'); btn.classList.add('text-slate-600'); span.style.fontVariationSettings = "'FILL' 0"; }
    });
}

function selectGoal(val) {
    createPageState.goalValue = val;
    document.getElementById('goal-display').innerHTML = `${val.toLocaleString()} <span class="text-xs font-normal text-slate-400">能量</span>`;
    document.querySelectorAll('.goal-option').forEach(btn => {
        const g = parseInt(btn.dataset.goal);
        if (g === val) {
            btn.className = 'goal-option py-2.5 rounded-xl text-sm font-bold transition-all bg-primary text-white shadow-[0_0_15px_rgba(200,128,255,0.4)]';
        } else {
            btn.className = 'goal-option py-2.5 rounded-xl text-sm font-bold transition-all bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10';
        }
    });
}

function handleCoverUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showNotification('文件过大', '封面图片不能超过5MB', 'error'); return; }
    const reader = new FileReader();
    reader.onload = function (e) {
        createPageState.coverBase64 = e.target.result;
        const container = document.getElementById('cover-preview-container');
        container.innerHTML = `<img src="${e.target.result}" class="absolute inset-0 w-full h-full object-cover rounded-xl"><div class="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"><span class="material-symbols-outlined text-white text-3xl">edit</span></div>`;
    };
    reader.readAsDataURL(file);
}

// ========== DETAIL PAGE ==========
function renderDetailPage(dreamId) {
    const dream = getDreamById(dreamId);
    if (!dream) return '<div class="text-center py-12 text-slate-400">梦想不存在</div>';

    // Load fresh dream data from API
    api.getDream(dreamId).then(freshDream => {
        // Update local data
        const idx = dreamData.dreams.findIndex(d => d.id === dreamId);
        if (idx >= 0) dreamData.dreams[idx] = freshDream;
        // Update rating display
        const ratingEl = document.getElementById('detail-rating-section');
        if (ratingEl) {
            const hasRated = freshDream.userRating != null;
            ratingEl.innerHTML = renderDetailRatingSection(freshDream, hasRated);
        }
        // Update sponsor button
        const sponsorBtn = document.getElementById('sponsor-btn');
        if (sponsorBtn && freshDream.sponsoredToday) {
            sponsorBtn.disabled = true;
            sponsorBtn.classList.add('opacity-50');
            sponsorBtn.innerHTML = '<span class="material-symbols-outlined">check_circle</span>今日已赞助';
        }
    });

    loadDreamComments(dreamId).then(comments => {
        const el = document.getElementById('dream-comments-list');
        if (el) el.innerHTML = comments.length > 0 ? comments.map(c => renderComment(c)).join('') : '<p class="text-slate-500 text-sm text-center py-4">还没有评论，快来抢沙发！</p>';
    });

    const comments = getDreamComments(dreamId);
    const energyPct = dream.goal > 0 ? Math.min(100, Math.round((dream.energy / dream.goal) * 100)) : 0;
    const user = getCurrentUser();
    const isOwn = user && dream.authorId === user.id;

    return `
        <div class="relative w-full h-[320px] shrink-0">
            <div class="absolute top-0 left-0 right-0 z-50 p-4"><div class="flex items-center justify-between"><button class="flex items-center justify-center w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-white/20 transition-colors" onclick="goBack()"><span class="material-symbols-outlined">arrow_back</span></button><div class="flex gap-3"><button class="flex items-center justify-center w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-white/20 transition-colors" onclick="copyShareLink(${dreamId})"><span class="material-symbols-outlined">share</span></button></div></div></div>
            ${dream.coverImage ? `<div class="absolute inset-0 bg-cover bg-center" style="background-image: url('${dream.coverImage}');"><div class="absolute inset-0 bg-gradient-to-t from-[#1a0f23] via-transparent to-transparent opacity-90"></div><div class="absolute inset-0 bg-black/20"></div></div>` : `<div class="absolute inset-0 bg-gradient-to-br from-purple-900 to-indigo-900"><div class="absolute inset-0 bg-gradient-to-t from-[#1a0f23] via-transparent to-transparent opacity-90"></div></div>`}
            <div class="absolute bottom-0 left-0 w-full p-6 pb-12 flex flex-col items-center justify-end h-full text-center">
                <div class="text-[64px] mb-2 filter drop-shadow-lg">${dream.emoji}</div>
                <h1 class="text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">${dream.title}</h1>
            </div>
        </div>
        <div class="relative -mt-6 bg-background-dark/80 glass-panel rounded-t-[2.5rem] border-t border-white/10 px-5 pt-8 pb-32">
            <div class="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-white/20"></div>
            <div class="flex items-center justify-between mb-8">
                <div class="flex items-center gap-3">
                    ${dream.author.avatar ? `<div class="relative"><img alt="Profile" class="w-12 h-12 rounded-full border-2 border-primary object-cover" src="${dream.author.avatar}">${dream.author.verified ? `<div class="absolute -bottom-1 -right-1 bg-background-dark rounded-full p-0.5"><span class="material-symbols-outlined text-[16px] text-primary" style="font-variation-settings: 'FILL' 1;">verified</span></div>` : ''}</div>` : `<div class="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-purple-400 flex items-center justify-center text-xl font-bold border-2 border-primary">${dream.author.name.charAt(0)}</div>`}
                    <div class="flex flex-col"><span class="text-white font-bold text-base">${dream.author.name}</span><span class="text-white/40 text-xs">梦嘢</span></div>
                </div>
            </div>
            <div class="space-y-4 mb-8 text-slate-300 leading-relaxed font-light"><p>${dream.description}</p></div>
            <div id="detail-rating-section" class="mb-8">${renderDetailRatingSection(dream, false)}</div>
            <div class="mb-8">
                <div class="flex items-center justify-between mb-4"><h3 class="text-white font-semibold text-lg flex items-center gap-2"><span class="material-symbols-outlined text-red-400" style="font-variation-settings: 'FILL' 1;">favorite</span>幻想助力</h3><span class="text-white/60 text-sm">已获得 <span class="text-white font-bold">${formatNumber(dream.supporters)}</span> 次</span></div>
                <div class="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div class="flex items-center justify-between mb-3"><span class="text-xs text-slate-400">能量进度</span><span class="text-sm text-white font-bold">${dream.energy || 0} / ${dream.goal || 1000}</span></div>
                    <div class="h-2 w-full bg-white/10 rounded-full mb-2"><div class="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full transition-all" style="width:${energyPct}%"></div></div>
                    <span class="text-[10px] text-white/40">${energyPct}% 完成</span>
                </div>
            </div>
            <div class="mb-6">
                <button id="sponsor-btn" onclick="sponsorDream(${dream.id})" class="w-full h-14 bg-gradient-to-r from-purple-600 to-primary rounded-full shadow-[0_0_20px_rgba(200,128,255,0.4)] flex items-center justify-center gap-2 text-white font-bold text-lg hover:brightness-110 active:scale-95 transition-all btn-hover ${isOwn ? 'opacity-50 cursor-not-allowed' : ''}" ${isOwn ? 'disabled' : ''}>
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>${isOwn ? '不能赞助自己的梦想' : '赞助这个不可能'}<span class="text-sm font-normal text-white/80 ml-1">（10能量）</span>
                </button>
            </div>
            <div>
                <h3 class="text-white font-semibold text-lg mb-4">评论 (${dream.comments})</h3>
                <div id="dream-comments-list">${comments.length > 0 ? comments.map(c => renderComment(c)).join('') : '<p class="text-slate-500 text-sm text-center py-4">还没有评论，快来抢沙发！</p>'}</div>
            </div>
        </div>
        <div class="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#1a0f23] via-[#1a0f23]/95 to-transparent pt-4 pb-8 px-5 z-40 max-w-md mx-auto">
            <div class="flex gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-primary flex items-center justify-center text-xs font-bold text-white shrink-0">${(getCurrentUser()?.name || 'U').charAt(0)}</div>
                <div class="flex-1"><input id="comment-input" type="text" placeholder="写下你的评论..." class="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"></div>
                <button onclick="submitComment(${dreamId})" class="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white hover:bg-primary/80 transition-colors shrink-0"><span class="material-symbols-outlined text-lg">send</span></button>
            </div>
        </div>`;
}

function renderDetailRatingSection(dream, hasRated) {
    const idx = dream.impossibleIndex || 0;
    const count = dream.ratingCount || 0;
    return `
        <div class="p-5 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden group">
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>
            <div class="flex justify-between items-center mb-3 relative z-10">
                <div class="flex items-center gap-2"><span class="material-symbols-outlined text-primary">science</span><span class="text-white font-semibold tracking-wide text-sm">不可思议指数</span></div>
                <div class="flex items-center gap-2"><span class="text-yellow-400 font-bold text-lg">${parseFloat(idx.toFixed(2))}</span><span class="text-white/40 text-xs">/5</span><span class="text-slate-500 text-xs ml-1">(${count}人评价)</span></div>
            </div>
            <div class="flex items-center gap-3 mb-3 relative z-10">
                <div class="flex items-center gap-0.5">
                    ${[1, 2, 3, 4, 5].map(i => {
        const filled = i <= Math.round(hasRated ? idx : 0);
        if (!hasRated) {
            return `<button onclick="event.stopPropagation(); rateDreamStar(${dream.id}, ${i})" class="${filled ? 'text-yellow-400' : 'text-slate-600'} hover:text-yellow-400 hover:scale-110 transition-all"><span class="material-symbols-outlined text-2xl" style="font-variation-settings: 'FILL' ${filled ? 1 : 0};">star</span></button>`;
        } else {
            return `<span class="${filled ? 'text-yellow-400' : 'text-slate-600'}"><span class="material-symbols-outlined text-2xl" style="font-variation-settings: 'FILL' ${filled ? 1 : 0};">star</span></span>`;
        }
    }).join('')}
                </div>
            </div>
            <p class="text-center text-xs ${hasRated ? 'text-green-400' : 'text-slate-500'} relative z-10">${hasRated ? '✓ 你已评分' : '点击星星为这个梦想评分'}</p>
        </div>`;
}

async function rateDreamStar(dreamId, rating) {
    if (!requireLogin()) return;
    try {
        const result = await api.rateDream(dreamId, rating);
        const dream = getDreamById(dreamId);
        if (dream) { dream.impossibleIndex = result.impossibleIndex; dream.ratingCount = result.ratingCount; }
        const el = document.getElementById('detail-rating-section');
        if (el) el.innerHTML = renderDetailRatingSection({ ...dream, impossibleIndex: result.impossibleIndex, ratingCount: result.ratingCount }, true);
    } catch (e) { showNotification('评分失败', e.message, 'error'); }
}

function copyShareLink(dreamId) {
    const url = `${window.location.origin}/#detail/${dreamId}`;
    navigator.clipboard.writeText(url).then(() => {
        showNotification('已复制', '链接已复制到剪贴板', 'success');
    }).catch(() => {
        showNotification('复制失败', '请手动复制链接', 'error');
    });
}

function renderComment(comment) {
    return `<div class="flex gap-3 mb-4">${comment.user.avatar ? `<img alt="${comment.user.name}" class="shrink-0 w-8 h-8 rounded-full object-cover" src="${comment.user.avatar}">` : `<div class="shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-primary flex items-center justify-center text-[10px] font-bold text-white">${comment.user.initials}</div>`}<div><div class="flex items-center gap-2 mb-0.5"><span class="text-sm font-semibold text-white/90">${comment.user.name}</span><span class="text-[10px] text-white/30">${comment.timeAgo}</span></div><p class="text-sm text-slate-300">${comment.text}</p></div></div>`;
}

// ========== HELPERS ==========
function formatNumber(num) { if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'; if (num >= 1000) return (num / 1000).toFixed(1) + 'k'; return (num || 0).toString(); }
function getGradientForDream(id) {
    const g = ['bg-gradient-to-br from-blue-500/10 to-purple-500/10', 'bg-gradient-to-br from-green-500/10 to-teal-500/10', 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10', 'bg-gradient-to-br from-pink-500/10 to-rose-500/10', 'bg-gradient-to-tr from-indigo-300 to-cyan-400', 'bg-gradient-to-br from-orange-600 to-red-800', 'bg-gradient-to-br from-purple-900 to-indigo-900', 'bg-gradient-to-br from-blue-400 to-cyan-300'];
    return g[(id - 1) % g.length];
}

// ========== ENERGY SYSTEM ==========
async function sponsorDream(dreamId) {
    if (!requireLogin()) return;
    const profile = dreamData.userProfile;
    if (profile.energy < 10) { showNotification('能量不足', '您需要至少10能量才能赞助梦想', 'error'); return; }
    try {
        const result = await api.sponsorDream(dreamId);
        profile.energy = result.newEnergy;
        const dream = getDreamById(dreamId);
        if (dream) { dream.energy = result.dreamEnergy; dream.supporters = result.dreamSupporters; dream.progress = result.dreamProgress; }
        showNotification('赞助成功', '已为梦想赞助10能量！', 'success');
        loadPageContent(currentPage, { dreamId });
    } catch (e) { showNotification('赞助失败', e.message, 'error'); }
}

async function claimDailyReward() {
    try {
        const result = await api.claimDailyReward();
        dreamData.userProfile.energy = result.newEnergy;
        dreamData.userProfile.todayClaimed = true;
        showNotification('每日登录奖励', `恭喜获得${result.reward}能量！`, 'success');
        loadPageContent(currentPage);
    } catch (e) { if (e.message.includes('已领取')) showNotification('今日已领取', '每日登录奖励只能领取一次哦~', 'info'); else showNotification('领取失败', e.message, 'error'); }
}

// ========== COMMENT ==========
async function submitComment(dreamId) {
    if (!requireLogin()) return;
    const input = document.getElementById('comment-input');
    if (!input || !input.value.trim()) return;
    try {
        const comment = await api.postComment(dreamId, input.value.trim());
        if (!dreamData.comments[dreamId]) dreamData.comments[dreamId] = [];
        dreamData.comments[dreamId].push(comment);
        input.value = '';
        loadPageContent('detail', { dreamId });
    } catch (e) { showNotification('评论失败', e.message, 'error'); }
}

// ========== DREAM PUBLISHING ==========
async function publishDream() {
    const title = document.getElementById('create-title')?.value;
    const desc = document.getElementById('create-desc')?.value;
    const anonymous = document.getElementById('create-anonymous')?.checked;

    // 详细验证反馈
    const missing = [];
    if (!title || !title.trim()) missing.push('梦想标题');
    if (!desc || !desc.trim()) missing.push('梦想描述');
    if (!createPageState.rating || createPageState.rating === 0) missing.push('不可思议指数评分');

    if (missing.length > 0) {
        showNotification('请完善信息', `还需要填写：${missing.join('、')}`, 'info');
        return;
    }

    try {
        await api.createDream({
            title: title.trim(),
            description: desc?.trim() || '',
            goal: createPageState.goalValue,
            impossibleIndex: createPageState.rating || 0,
            anonymous: !!anonymous,
            coverImage: createPageState.coverBase64
        });
        showNotification('发布成功', '你的梦想已经种下！', 'success');
        dreamData.dreams = await api.getDreams();
        navigateTo('home');
    } catch (e) { showNotification('发布失败', e.message, 'error'); }
}

// ========== TOAST ==========
function showNotification(title, message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const colors = { success: 'border-green-500/50 bg-green-500/10', error: 'border-red-500/50 bg-red-500/10', info: 'border-primary/50 bg-primary/10' };
    const icons = { success: '<span class="material-symbols-outlined text-green-400">check_circle</span>', error: '<span class="material-symbols-outlined text-red-400">error</span>', info: '<span class="material-symbols-outlined text-primary">info</span>' };
    const toast = document.createElement('div');
    toast.className = `pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border ${colors[type] || colors.info} backdrop-blur-xl shadow-2xl animate-fade-in`;
    toast.innerHTML = `${icons[type] || icons.info}<div class="flex-1 min-w-0"><p class="text-sm font-bold text-white">${title}</p><p class="text-xs text-slate-300 mt-0.5">${message}</p></div><button onclick="this.parentElement.remove()" class="text-slate-500 hover:text-white"><span class="material-symbols-outlined text-sm">close</span></button>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', async function () {
    const content = document.getElementById('page-content');
    content.innerHTML = '<div class="flex flex-col justify-center items-center py-24"><div class="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div><p class="text-slate-400 text-sm">加载中...</p></div>';

    // Always load public data first so guests can browse
    await loadPublicData();

    if (isLoggedIn()) {
        const success = await loadAllData();
        if (!success) {
            // Token may be invalid
            localStorage.removeItem('auth_token');
            localStorage.removeItem('current_user');
        }
    }

    initializeRouter();

    // Daily reward for logged-in users
    if (isLoggedIn()) {
        const today = new Date().toISOString().split('T')[0];
        const lastClaimDate = localStorage.getItem('lastClaimDate');
        if (lastClaimDate !== today && !dreamData.userProfile.todayClaimed) {
            claimDailyReward();
        }
    }
});
