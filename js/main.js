// ========== PAGE RENDERERS ==========

// Home Page - Dream Hall
function renderHomePage() {
    const featuredDreams = getFeaturedDreams();
    const otherDreams = dreamData.dreams.filter(d => !d.featured).slice(0, 4);
    
    return `
        <!-- Featured Section -->
        <div class="w-full relative rounded-2xl overflow-hidden h-40 shadow-2xl group cursor-pointer border border-white/10 mb-6" onclick="navigateTo('detail', {dreamId: ${featuredDreams[0].id}})">
            <div class="absolute inset-0 bg-gradient-to-r from-pink-500/40 via-purple-500/40 to-blue-500/40 z-10 glitch-pixel-bg scanlines"></div>
            ${featuredDreams[0].coverImage ? `
                <div class="absolute inset-0 bg-cover bg-center scale-110 pixel-art-filter brightness-75 contrast-125 opacity-70 mix-blend-hard-light" style="background-image: url('${featuredDreams[0].coverImage}'); filter: hue-rotate(45deg) contrast(1.2);"></div>
            ` : ''}
            <div class="absolute inset-0 bg-black/20 z-10" style="background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, #000 3px);"></div>
            <div class="relative z-20 h-full flex flex-col justify-end p-5">
                <span class="inline-block px-2 py-0.5 rounded-none bg-black/60 backdrop-blur-sm text-[10px] font-bold text-cyan-300 mb-2 self-start border-l-4 border-cyan-500 uppercase tracking-widest" style="box-shadow: 2px 2px 0px #ff00c1;">WEEKLY GLITCH</span>
                <h2 class="text-xl font-bold text-white leading-tight mb-1" style="text-shadow: 3px 3px 0px #ff00c1, -2px -2px 0px #00fff0; font-family: monospace;">本周荒诞之星：<br/>${featuredDreams[0].title}</h2>
                <p class="text-sm text-white/90 font-medium flex items-center gap-1 font-mono">
                    <span class="material-symbols-outlined text-sm">groups_2</span>
                    已有 ${formatNumber(featuredDreams[0].supporters)} 人支持
                </p>
            </div>
        </div>
        
        <!-- Filter Buttons -->
        <div class="flex gap-3 overflow-x-auto no-scrollbar pb-4 mb-2">
            <button class="px-4 py-2 rounded-full bg-primary text-white text-sm font-bold whitespace-nowrap shadow-[4px 4px 0px_rgba(200,146,210,0.3)] border border-white/20" onclick="filterDreams('popular', this)">热门推荐</button>
            <button class="px-4 py-2 rounded-full bg-white/5 text-white/70 text-sm font-medium whitespace-nowrap border border-white/10 hover:bg-white/15" onclick="filterDreams('newest', this)">最新发布</button>
            <button class="px-4 py-2 rounded-full bg-white/5 text-white/70 text-sm font-medium whitespace-nowrap border border-white/10 hover:bg-white/15" onclick="filterDreams('upcoming', this)">即将实现</button>
            <button class="px-4 py-2 rounded-full bg-white/5 text-white/70 text-sm font-medium whitespace-nowrap border border-white/10 hover:bg-white/15" onclick="filterDreams('creative', this)">脑洞大开</button>
        </div>
        
        <!-- Dream Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${otherDreams.map(dream => renderDreamCard(dream)).join('')}
        </div>
    `;
}

// Render single dream card
function renderDreamCard(dream) {
    const gradientClasses = getGradientForDream(dream.id);
    
    return `
        <div class="dream-card glass-panel rounded-2xl overflow-hidden flex flex-col group hover:border-primary/50 transition-colors border-white/5" onclick="navigateTo('detail', {dreamId: ${dream.id}})">
            <div class="h-40 w-full relative overflow-hidden ${gradientClasses} flex items-center justify-center glitch-pixel-bg">
                ${dream.coverImage ? `
                    <img alt="${dream.title}" class="absolute inset-0 w-full h-full object-cover opacity-70" src="${dream.coverImage}">
                ` : `
                    <div class="text-[80px] drop-shadow-lg transform group-hover:scale-110 transition-transform duration-500 cursor-default emoji-glitch opacity-90 relative">
                        ${dream.emoji}
                    </div>
                `}
                <div class="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-2 py-1 rounded-none border border-primary/30 flex items-center gap-1">
                    <span class="text-primary material-symbols-outlined text-[14px]">star_half</span>
                    <span class="text-xs font-bold text-white">${dream.impossibleIndex / 20}</span>
                </div>
            </div>
            <div class="p-4 flex flex-col gap-3">
                <div>
                    <h3 class="text-lg font-bold text-white leading-snug">${dream.title}</h3>
                    <div class="flex items-center gap-2 mb-2">
                        ${dream.author.avatar ? `
                            <div class="w-6 h-6 rounded-full border border-white/20 overflow-hidden bg-slate-800">
                                <img alt="User Avatar" class="w-full h-full object-cover pixel-art-filter" src="${dream.author.avatar}">
                            </div>
                        ` : `<div class="w-6 h-6 rounded-full bg-gradient-to-tr from-pink-500 to-purple-400 flex items-center justify-center text-xs text-white">${dream.author.name.charAt(0)}</div>`}
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
        </div>
    `;
}

// Notifications Page - Notification Center
function renderNotificationsPage() {
    const notifications = dreamData.notifications;
    const unreadCount = notifications.filter(n => !n.read).length;

    return `
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-white">通知</h2>
            ${unreadCount > 0 ? `
                <button class="text-sm text-primary hover:text-white transition-colors font-medium" onclick="markAllAsRead()">
                    全部标为已读
                </button>
            ` : ''}
        </div>

        ${notifications.length > 0 ? `
            <!-- Notification List -->
            <div class="space-y-3">
                ${notifications.map(notification => renderNotificationItem(notification)).join('')}
            </div>
        ` : `
            <!-- Empty State -->
            <div class="flex flex-col items-center justify-center py-16">
                <div class="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <span class="material-symbols-outlined text-4xl text-slate-500">notifications_none</span>
                </div>
                <p class="text-slate-400 text-sm mb-2">暂无通知</p>
                <p class="text-xs text-slate-600">当有新的互动时，这里会显示通知</p>
            </div>
        `}
    `;
}

// Render notification item
function renderNotificationItem(notification) {
    let icon, actionText, content, iconBg;

    switch(notification.type) {
        case "like":
            icon = `<span class="material-symbols-outlined text-pink-500" style="font-variation-settings: 'FILL' 1;">favorite</span>`;
            iconBg = "bg-pink-500/20";
            actionText = "赞了你的梦想";
            break;
        case "comment":
            icon = `<span class="material-symbols-outlined text-blue-500" style="font-variation-settings: 'FILL' 1;">comment</span>`;
            iconBg = "bg-blue-500/20";
            actionText = "评论了你的梦想";
            break;
        case "sponsor":
            icon = `<span class="material-symbols-outlined text-green-500" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>`;
            iconBg = "bg-green-500/20";
            actionText = "赞助了你的梦想";
            break;
        case "achievement":
            icon = `<span class="material-symbols-outlined text-yellow-500" style="font-variation-settings: 'FILL' 1;">celebration</span>`;
            iconBg = "bg-yellow-500/20";
            break;
        default:
            icon = `<span class="material-symbols-outlined text-slate-400">notifications</span>`;
            iconBg = "bg-slate-500/20";
    }

    const dream = notification.targetDream ? getDreamById(notification.targetDream) : null;

    return `
        <div class="relative flex gap-3 p-4 rounded-2xl ${notification.read ? 'bg-white/5' : 'bg-primary/10 border border-primary/20'} transition-all cursor-pointer hover:${notification.read ? 'bg-white/10' : 'bg-primary/15'}">
            ${notification.user ? (notification.user.avatar ? `
                <img alt="${notification.user.name}" class="w-10 h-10 rounded-full object-cover shrink-0 border border-white/10" src="${notification.user.avatar}">
            ` : `
                <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-primary flex items-center justify-center text-xs font-bold text-white shrink-0">
                    ${notification.user.name.charAt(0)}
                </div>
            `) : `
                <div class="w-10 h-10 rounded-full ${iconBg} flex items-center justify-center shrink-0">
                    ${icon}
                </div>
            `}
            <div class="flex-1 min-w-0">
                ${notification.user ? `
                    <div class="flex items-baseline gap-1 flex-wrap mb-1">
                        <span class="text-sm font-semibold text-white">${notification.user.name}</span>
                        <span class="text-sm text-slate-400">${actionText}</span>
                        ${dream ? `<span class="text-sm font-medium text-primary">${dream.title}</span>` : ''}
                    </div>
                ` : `
                    <div class="flex items-center gap-2 mb-1">
                        <p class="text-sm text-slate-300 font-medium">${notification.content}</p>
                        ${notification.reward ? `
                            <span class="inline-flex items-center gap-1 text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">
                                <span class="material-symbols-outlined text-[12px]">bolt</span>
                                +${notification.reward}
                            </span>
                        ` : ''}
                    </div>
                `}
                ${notification.commentText ? `
                    <p class="text-xs text-slate-500 mt-1 line-clamp-2">"${notification.commentText}"</p>
                ` : ''}
                ${notification.amount ? `
                    <p class="text-xs text-green-400 mt-1 font-medium">+${notification.amount} 能量</p>
                ` : ''}
                <p class="text-xs text-slate-500 mt-2">${notification.timeAgo}</p>
            </div>
            ${!notification.read ? `
                <div class="absolute right-4 top-4 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(200,128,255,0.6)]"></div>
            ` : ''}
        </div>
    `;
}

// Mark all notifications as read
function markAllAsRead() {
    dreamData.notifications.forEach(n => n.read = true);
    loadPageContent('notifications');
}

// Vortex Page - Fantasy Vortex
function renderVortexPage() {
    const screenHeight = window.innerHeight;
    const bubbleHeight = Math.min(65, Math.floor(screenHeight * 0.65)) + 'vh';
    
    return `
        <!-- Filter Tabs -->
        <div class="flex gap-3 overflow-x-auto no-scrollbar pb-4">
            <button class="px-5 py-2 rounded-full bg-primary text-black text-xs font-bold whitespace-nowrap shadow-[0_0_20px_rgba(200,128,255,0.4)]">全部</button>
            <button class="px-5 py-2 rounded-full bg-glass border border-glass-border text-xs font-medium whitespace-nowrap backdrop-blur-md">时空</button>
            <button class="px-5 py-2 rounded-full bg-glass border border-glass-border text-xs font-medium whitespace-nowrap backdrop-blur-md">克隆</button>
            <button class="px-5 py-2 rounded-full bg-glass border border-glass-border text-xs font-medium whitespace-nowrap backdrop-blur-md">预言</button>
        </div>
        
        <!-- Dream Bubbles Scroll -->
        <div class="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-6 h-[65vh] items-center" id="vortex-scroll">
            ${dreamData.dreams.slice(0, 3).map(dream => renderDreamBubble(dream)).join('')}
        </div>
        
        <!-- Daily Stats -->
        <div class="py-4 text-center">
            <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-lg">
                <span class="text-xs text-primary/80">🌸 今日诞生的第 <span class="text-white font-bold">127</span> 个梦境</span>
            </span>
        </div>
    `;
}

// Render dream bubble
function renderDreamBubble(dream) {
    return `
        <div class="dream-bubble cursor-pointer" onclick="navigateTo('detail', {dreamId: ${dream.id}})">
            ${dream.coverImage ? `
                <img alt="${dream.title}" class="absolute inset-0 w-full h-full object-cover" src="${dream.coverImage}">
            ` : `
                <div class="absolute inset-0 bg-gradient-to-br from-purple-900 to-indigo-900"></div>
            `}
            <div class="glass-overlay"></div>
            <div class="absolute inset-x-0 bottom-0 p-8">
                <div class="flex items-center gap-3 mb-6 opacity-80">
                    ${dream.author.avatar ? `
                        <img alt="Avatar" class="w-8 h-8 rounded-full border border-white/30" src="${dream.author.avatar}">
                    ` : `<div class="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-orange-400 flex items-center justify-center text-xs font-bold border border-white/30">${dream.author.name.charAt(0)}</div>`}
                    <div class="text-[10px]">
                        <p class="font-bold">${dream.author.name} <span class="text-primary mx-1">创造了</span> 梦想</p>
                        <p class="opacity-60">刚刚</p>
                    </div>
                </div>
                <h2 class="text-3xl font-bold mb-2">${dream.title}</h2>
                <p class="text-sm text-slate-300 leading-relaxed line-clamp-2 mb-6">${dream.description}</p>
                <div class="flex items-center justify-between">
                    <button class="bg-primary/20 hover:bg-primary/30 backdrop-blur-xl border border-primary/40 px-6 py-3 rounded-2xl flex items-center gap-2 transition-all btn-hover" onclick="event.stopPropagation(); navigateTo('detail', {dreamId: ${dream.id}})">
                        <span class="material-symbols-outlined text-primary">favorite</span>
                        <span class="text-xs font-bold text-primary">注入能量</span>
                    </button>
                    <div class="text-right">
                        <p class="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Project Status</p>
                        <p class="text-lg font-bold text-white">${dream.progress}%</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Initialize vortex scroll
function initializeVortexScroll() {
    const scrollContainer = document.getElementById('vortex-scroll');
    if (scrollContainer) {
        // Center the first bubble
        scrollContainer.scrollLeft = 0;
    }
}

// Feed Page - Activity Feed
function renderFeedPage() {
    return `
        <!-- Daily Stats Separator -->
        <div class="relative py-6 flex items-center justify-center mb-6">
            <div class="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-glass-border to-transparent"></div>
            <div class="relative z-10 bg-background-dark/80 px-4 py-1 rounded-full border border-glass-border backdrop-blur-md">
                <p class="text-xs font-medium text-primary tracking-wide">
                    🌸 今日有 <span class="font-bold text-white">127</span> 个新梦想诞生
                </p>
            </div>
        </div>
        
        <!-- Feed Items -->
        <div class="flex flex-col gap-6">
            ${dreamData.feed.map((activity, index) => renderFeedItem(activity, index < dreamData.feed.length - 1)).join('')}
        </div>
    `;
}

// Render feed item
function renderFeedItem(activity, showConnector) {
    const dream = getDreamById(activity.targetDream);
    if (!dream) return '';
    
    const actionLabels = {
        sponsor: '赞助了',
        publish: '发布了',
        fork: '克隆了'
    };
    
    const actionColors = {
        sponsor: 'primary',
        publish: 'blue',
        fork: 'green'
    };
    
    const color = actionColors[activity.type];
    const label = actionLabels[activity.type];
    
    return `
        <div class="relative group">
            ${showConnector ? `<div class="absolute left-[19px] top-12 bottom-[-24px] w-0.5 bg-gradient-to-b from-glass-border to-transparent"></div>` : ''}
            <div class="flex items-start gap-3">
                <!-- Avatar -->
                <div class="relative shrink-0">
                    ${activity.user.avatar ? `
                        <img alt="${activity.user.name}" class="h-10 w-10 rounded-full border-2 border-primary/30 p-0.5 bg-background-dark object-cover" src="${activity.user.avatar}">
                    ` : `
                        <div class="h-10 w-10 rounded-full border-2 border-slate-700 p-0.5 bg-background-dark flex items-center justify-center bg-gradient-to-tr from-pink-500 to-orange-400 text-white text-xs font-bold">${activity.user.name.charAt(0)}</div>
                    `}
                </div>
                
                <!-- Content -->
                <div class="flex-1 min-w-0">
                    <div class="flex items-baseline flex-wrap gap-x-1 mb-3">
                        <span class="font-bold text-white text-sm">${activity.user.name}</span>
                        <span class="text-xs text-${color}-400 font-medium px-1.5 py-0.5 bg-${color}-400/10 rounded-md border border-${color}-400/20">${label}</span>
                        <span class="font-bold text-white text-sm">${dream.title}</span>
                        <span class="text-xs text-slate-400 ml-auto">${activity.timeAgo}</span>
                    </div>
                    
                    <!-- Mini Dream Card -->
                    <div class="relative overflow-hidden rounded-2xl border border-glass-border bg-glass backdrop-blur-md p-4 hover:bg-glass-border transition-colors cursor-pointer" onclick="navigateTo('detail', {dreamId: ${dream.id}})">
                        <div class="flex gap-4 items-start">
                            ${dream.coverImage ? `
                                <div class="h-16 w-16 shrink-0 rounded-xl overflow-hidden shadow-lg">
                                    <img alt="${dream.title}" class="h-full w-full object-cover" src="${dream.coverImage}">
                                </div>
                            ` : `
                                <div class="h-16 w-16 shrink-0 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                                    <span class="text-3xl">${dream.emoji}</span>
                                </div>
                            `}
                            <div class="flex-1 min-w-0">
                                <h3 class="text-base font-bold text-white truncate mb-1">${dream.title}</h3>
                                <p class="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">${dream.description}</p>
                                <div class="flex items-center gap-3">
                                    <button class="flex items-center gap-1 text-xs font-bold text-primary hover:text-white transition-colors">
                                        <span class="material-symbols-outlined text-sm">favorite</span>
                                        支持
                                    </button>
                                    <div class="h-3 w-[1px] bg-glass-border"></div>
                                    <span class="text-[10px] text-slate-400 flex items-center gap-1">
                                        <span class="material-symbols-outlined text-[10px]">rocket_launch</span>
                                        ${dream.progress}% 进度
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Profile Page - User Profile
function renderProfilePage() {
    const profile = dreamData.userProfile;
    const userDreams = dreamData.dreams.slice(0, 5);
    
    return `
        <!-- Header -->
        <div class="relative w-full">
            <div class="h-48 w-full bg-gradient-to-b from-[#4a2b6b] to-background-dark relative overflow-hidden">
                <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
            </div>
            <div class="px-6 -mt-12 flex flex-col items-center relative z-10">
                <div class="relative group">
                    <div class="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                    <div class="relative w-24 h-24 rounded-full p-1 bg-background-dark">
                        <img alt="Profile" class="w-full h-full object-cover rounded-full border-2 border-background-dark avatar-glow" src="${profile.avatar}">
                    </div>
                </div>
                <div class="mt-3 text-center">
                    <h1 class="text-2xl font-bold tracking-tight text-white flex items-center gap-2 justify-center">
                        ${profile.name}
                        ${profile.verified ? '<span class="material-symbols-outlined text-yellow-400 text-sm">verified</span>' : ''}
                    </h1>
                    <p class="text-slate-400 text-sm font-medium mt-1">粉丝 ${profile.followers} <span class="mx-1 opacity-30">|</span> 关注 ${profile.following}</p>
                    <p class="text-slate-500 text-xs mt-2 max-w-[240px] leading-relaxed">${profile.bio}</p>
                </div>
            </div>
        </div>
        
        <!-- Energy Display -->
        <div class="px-4 mt-4">
            <div class="bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-xl border border-primary/30 p-3 backdrop-blur-sm">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <div class="w-10 h-10 rounded-lg bg-primary/30 flex items-center justify-center">
                            <span class="material-symbols-outlined text-xl text-primary">bolt</span>
                        </div>
                        <div>
                            <p class="text-[10px] text-slate-400 mb-0.5">我的能量</p>
                            <p class="text-xl font-bold text-white">${profile.energy.toLocaleString()}</p>
                        </div>
                    </div>
                    <button class="px-4 py-2 rounded-lg ${profile.todayClaimed ? 'bg-white/5 text-slate-500' : 'bg-white/10 text-white'} text-xs font-medium hover:bg-white/20 transition-colors" onclick="claimDailyReward()">
                        ${profile.todayClaimed ? '已领取' : '每日+50'}
                    </button>
                </div>
            </div>
        </div>
        
        <!-- Stats -->
        <div class="px-4 mt-6">
            <div class="flex flex-wrap gap-3">
                <div class="flex min-w-[100px] flex-1 flex-col gap-1 rounded-2xl bg-white/5 border border-white/5 p-3 items-center text-center backdrop-blur-sm">
                    <p class="text-white tracking-tight text-xl font-bold">${profile.stats.dreams}</p>
                    <p class="text-primary/80 text-xs font-medium">发布的梦想</p>
                </div>
                <div class="flex min-w-[100px] flex-1 flex-col gap-1 rounded-2xl bg-white/5 border border-white/5 p-3 items-center text-center backdrop-blur-sm">
                    <p class="text-white tracking-tight text-xl font-bold">${profile.stats.supported}</p>
                    <p class="text-primary/80 text-xs font-medium">支持的梦想</p>
                </div>
                <div class="flex min-w-[100px] flex-1 flex-col gap-1 rounded-2xl bg-white/5 border border-white/5 p-3 items-center text-center backdrop-blur-sm">
                    <p class="text-white tracking-tight text-xl font-bold">${formatNumber(profile.stats.supportReceived)}</p>
                    <p class="text-primary/80 text-xs font-medium">获得的助力</p>
                </div>
            </div>
        </div>
        
        <!-- Tabs -->
        <div class="mt-8 px-4 sticky top-0 bg-background-dark/95 backdrop-blur-md z-30 pt-2 pb-2 border-b border-white/5">
            <div class="flex w-full items-center justify-between">
                <button class="flex-1 pb-3 text-center border-b-2 border-primary text-white font-semibold text-sm relative">
                    📌 我的梦想
                </button>
                <button class="flex-1 pb-3 text-center border-b-2 border-transparent text-slate-500 font-medium text-sm hover:text-slate-300 transition-colors">
                    💜 支持过的梦想
                </button>
            </div>
        </div>
        
        <!-- Dream Grid -->
        <div class="p-4 grid grid-cols-2 gap-4">
            ${userDreams.map(dream => renderProfileDreamCard(dream)).join('')}
            <div class="group relative aspect-square rounded-[20px] bg-white/5 border border-dashed border-white/20 overflow-hidden hover:bg-white/10 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2" onclick="navigateTo('create')">
                <div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-primary">
                    <span class="material-symbols-outlined text-3xl">add</span>
                </div>
                <p class="text-slate-400 text-sm font-medium">创建新梦想</p>
            </div>
        </div>
    `;
}

// Render profile dream card
function renderProfileDreamCard(dream) {
    const gradientClasses = getGradientForDream(dream.id);
    
    return `
        <div class="group relative aspect-square rounded-[20px] border border-white/10 overflow-hidden hover:border-primary/50 transition-colors cursor-pointer" onclick="navigateTo('detail', {dreamId: ${dream.id}})">
            <div class="absolute inset-0 ${gradientClasses}"></div>
            <div class="absolute inset-0 p-4 flex flex-col justify-between">
                <div class="flex justify-between items-start">
                    <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-2xl shadow-inner backdrop-blur-sm">
                        ${dream.emoji}
                    </div>
                    <button class="text-white/60 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10">
                        <span class="material-symbols-outlined text-[20px]">more_horiz</span>
                    </button>
                </div>
                <div>
                    <h3 class="text-white font-bold text-base leading-tight mb-2 line-clamp-2">${dream.title}</h3>
                    <div class="mb-2">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-xs text-slate-400">能量进度</span>
                            <span class="text-xs text-white font-medium">${dream.energy || 0}/${dream.goal || dream.supporters}</span>
                        </div>
                        <div class="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden">
                            <div class="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full transition-all" style="width: ${Math.min(100, ((dream.energy || 0) / (dream.goal || dream.supporters || 1)) * 100)}%"></div>
                        </div>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-red-400 text-[14px]">favorite</span>
                        <span class="text-slate-400 text-xs font-medium">${formatNumber(dream.likes)} 助力</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Create Page - Plant a Dream
function renderCreatePage() {
    return `
        <!-- Cover Upload -->
        <div class="w-full aspect-[343/180] relative group cursor-pointer mb-6">
            <div class="absolute inset-0 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                <div class="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span class="material-symbols-outlined text-3xl">add_a_photo</span>
                </div>
                <div class="text-center">
                    <p class="text-sm font-bold text-white/90">上传封面</p>
                    <p class="text-xs text-slate-400 mt-1">建议尺寸 343x180</p>
                </div>
            </div>
        </div>
        
        <!-- Title Input -->
        <div class="flex flex-col gap-2 mb-6">
            <input class="w-full bg-transparent border-0 border-b border-white/10 text-2xl font-bold placeholder:text-slate-500 focus:ring-0 focus:border-primary px-0 py-3 transition-colors text-white" placeholder="例如：造一台时光机..." type="text">
        </div>
        
        <!-- Description Input -->
        <div class="flex flex-col gap-2 relative mb-6">
            <textarea class="glass-input w-full min-h-[140px] rounded-xl text-base placeholder:text-slate-500 focus:ring-0 p-4 text-slate-200 resize-none leading-relaxed" placeholder="描述这个不可思议的梦想... 它是什么样子的？你需要什么样的帮助？"></textarea>
            <div class="absolute bottom-3 right-3 text-xs text-slate-500 pointer-events-none">0/500</div>
        </div>
        
        <!-- Impossible Index -->
        <div class="glass-panel p-5 rounded-xl flex flex-col gap-3 mb-6">
            <div class="flex items-center justify-between">
                <h3 class="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-lg">rocket_launch</span>
                    不可思议指数
                </h3>
                <span class="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">Lv. 3 异想天开</span>
            </div>
            <div class="flex items-center justify-between px-2 pt-1">
                <button class="text-primary hover:scale-110 transition-transform"><span class="material-symbols-outlined text-3xl">star</span></button>
                <button class="text-primary hover:scale-110 transition-transform"><span class="material-symbols-outlined text-3xl">star</span></button>
                <button class="text-primary hover:scale-110 transition-transform"><span class="material-symbols-outlined text-3xl">star</span></button>
                <button class="text-slate-600 hover:text-primary hover:scale-110 transition-transform"><span class="material-symbols-outlined text-3xl">star</span></button>
                <button class="text-slate-600 hover:text-primary hover:scale-110 transition-transform"><span class="material-symbols-outlined text-3xl">star</span></button>
            </div>
        </div>
        
        <!-- Category Selection -->
        <div class="flex flex-col gap-3 mb-6">
            <h3 class="text-sm font-semibold text-slate-400 pl-1">选择分类</h3>
            <div class="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                ${dreamData.categories.map(cat => `
                    <button class="shrink-0 h-9 px-5 rounded-full bg-primary text-white text-sm font-bold shadow-[0_0_10px_rgba(200,128,255,0.4)] whitespace-nowrap border border-primary">
                        ${cat.emoji} ${cat.name}
                    </button>
                `).join('')}
            </div>
        </div>
        
        <!-- Goal Slider -->
        <div class="glass-panel p-5 rounded-xl flex flex-col gap-6 mb-6">
            <div class="flex items-center justify-between">
                <h3 class="text-sm font-bold text-slate-200">设定目标</h3>
                <div class="text-primary font-bold text-lg flex items-center gap-1">
                    <span class="material-symbols-outlined text-base">bolt</span>
                    1,000 <span class="text-xs font-normal text-slate-400 ml-1">能量</span>
                </div>
            </div>
            <div class="relative w-full h-6 flex items-center">
                <input class="w-full z-20 opacity-0 absolute inset-0 cursor-pointer" type="range" min="1000" max="3000" value="1000">
                <div class="w-full h-1.5 bg-slate-700/50 rounded-full relative overflow-hidden z-0">
                    <div class="absolute left-0 top-0 h-full bg-gradient-to-r from-primary/50 to-primary w-[0%] rounded-full"></div>
                </div>
                <div class="absolute left-[0%] -ml-3.5 w-7 h-7 bg-primary rounded-full border-2 border-white shadow-[0_0_15px_rgba(200,128,255,0.6)] z-10 pointer-events-none flex items-center justify-center">
                    <div class="w-2 h-2 bg-white rounded-full"></div>
                </div>
            </div>
            <p class="text-xs text-center text-slate-400">当集齐 <span class="text-white font-bold">1,000</span> 份情怀支持，系统将为你点亮星球</p>
        </div>
        
        <!-- Anonymous Switch -->
        <div class="flex items-center justify-between py-2 px-1 mb-6">
            <div class="flex flex-col">
                <span class="text-base font-medium text-white flex items-center gap-2">
                    <span class="material-symbols-outlined text-slate-400">visibility_off</span>
                    匿名发布
                </span>
                <span class="text-xs text-slate-500">在这个梦想里，没有人知道你是谁</span>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
                <input class="sr-only peer" type="checkbox">
                <div class="w-12 h-7 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
        </div>
        
        <!-- Publish Button -->
        <button class="w-full py-4 bg-gradient-to-r from-primary to-purple-800 rounded-full text-white text-lg font-bold shadow-[0_0_20px_rgba(200,128,255,0.4)] btn-hover">
            🚀 发布梦想
        </button>
    `;
}

// Detail Page - Dream Detail
function renderDetailPage(dreamId) {
    const dream = getDreamById(dreamId);
    if (!dream) {
        return '<div class="text-center py-12 text-slate-400">梦想不存在</div>';
    }

    const comments = getDreamComments(dreamId);

    return `
        <!-- Hero Section with Header -->
        <div class="relative w-full h-[320px] shrink-0">
            <!-- Header -->
            <div class="absolute top-0 left-0 right-0 z-50 p-4">
                <div class="flex items-center justify-between">
                    <button class="flex items-center justify-center w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-white/20 transition-colors" onclick="goBack()">
                        <span class="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div class="flex gap-3">
                        <button class="flex items-center justify-center w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-white/20 transition-colors">
                            <span class="material-symbols-outlined">share</span>
                        </button>
                    </div>
                </div>
            </div>

            ${dream.coverImage ? `
                <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('${dream.coverImage}');">
                    <div class="absolute inset-0 bg-gradient-to-t from-[#1a0f23] via-transparent to-transparent opacity-90"></div>
                    <div class="absolute inset-0 bg-black/20"></div>
                </div>
            ` : `
                <div class="absolute inset-0 bg-gradient-to-br from-purple-900 to-indigo-900">
                    <div class="absolute inset-0 bg-gradient-to-t from-[#1a0f23] via-transparent to-transparent opacity-90"></div>
                </div>
            `}
            <div class="absolute bottom-0 left-0 w-full p-6 pb-12 flex flex-col items-center justify-end h-full text-center">
                <div class="text-[64px] mb-2 filter drop-shadow-lg">${dream.emoji}</div>
                <h1 class="text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">${dream.title}</h1>
                <p class="text-white/70 text-sm mt-1 font-medium tracking-widest uppercase">${dream.category}</p>
            </div>
        </div>

        <!-- Content Sheet -->
        <div class="relative -mt-6 bg-background-dark/80 glass-panel rounded-t-[2.5rem] border-t border-white/10 px-5 pt-8 pb-32">
            <div class="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-white/20"></div>

            <!-- Author Card -->
            <div class="flex items-center justify-between mb-8">
                <div class="flex items-center gap-3">
                    ${dream.author.avatar ? `
                        <div class="relative">
                            <img alt="Profile" class="w-12 h-12 rounded-full border-2 border-primary object-cover" src="${dream.author.avatar}">
                            ${dream.author.verified ? `
                                <div class="absolute -bottom-1 -right-1 bg-background-dark rounded-full p-0.5">
                                    <span class="material-symbols-outlined text-[16px] text-primary" style="font-variation-settings: 'FILL' 1;">verified</span>
                                </div>
                            ` : ''}
                        </div>
                    ` : `
                        <div class="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 to-purple-400 flex items-center justify-center text-xl font-bold border-2 border-primary">${dream.author.name.charAt(0)}</div>
                    `}
                    <div class="flex flex-col">
                        <span class="text-white font-bold text-base">${dream.author.name}</span>
                        <span class="text-white/40 text-xs">2天前 · 杭州</span>
                    </div>
                </div>
                <button class="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 px-4 py-1.5 rounded-full text-sm font-semibold transition-all">
                    Follow
                </button>
            </div>

            <!-- Impossible Index -->
            <div class="mb-8 p-5 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden group">
                <div class="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>
                <div class="flex justify-between items-center mb-3 relative z-10">
                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary">science</span>
                        <span class="text-white font-semibold tracking-wide text-sm">Impossible Index</span>
                    </div>
                    <span class="text-primary font-bold text-lg">${dream.impossibleIndex}%</span>
                </div>
                <div class="h-2 w-full bg-black/40 rounded-full mb-3 overflow-hidden relative z-10">
                    <div class="h-full bg-gradient-to-r from-purple-600 to-primary w-[${dream.impossibleIndex}%] rounded-full shadow-[0_0_10px_rgba(200,128,255,0.5)] progress-animated"></div>
                </div>
                <p class="text-primary/80 text-xs flex items-center gap-1.5 relative z-10">
                    <span class="material-symbols-outlined text-[14px]">lock</span>
                    物理定律禁止，但在梦里我们可以...
                </p>
            </div>

            <!-- Description -->
            <div class="space-y-4 mb-10 text-slate-300 leading-relaxed font-light">
                <p>${dream.description}</p>
            </div>

            <!-- Stats & Supporters -->
            <div class="mb-8">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-white font-semibold text-lg flex items-center gap-2">
                        <span class="material-symbols-outlined text-red-400" style="font-variation-settings: 'FILL' 1;">favorite</span>
                        幻想助力
                    </h3>
                    <span class="text-white/60 text-sm">已获得 <span class="text-white font-bold">${formatNumber(dream.supporters)}</span> 次</span>
                </div>
                <div class="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div class="flex -space-x-3 rtl:space-x-reverse">
                        ${dream.author.avatar ? `
                            <img alt="Avatar 1" class="w-10 h-10 border-2 border-[#261933] rounded-full object-cover" src="${dream.author.avatar}">
                        ` : `<div class="w-10 h-10 border-2 border-[#261933] rounded-full bg-gradient-to-tr from-pink-500 to-purple-400 flex items-center justify-center text-xs text-white font-bold">A</div>`}
                        <div class="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-primary/40 border-2 border-[#261933] rounded-full backdrop-blur-sm">
                            +${dream.supporters - 1}
                        </div>
                    </div>
                    <div class="flex flex-col items-end">
                        <div class="w-24 h-1.5 bg-white/10 rounded-full mb-1">
                            <div class="w-[${dream.progress}%] h-full bg-red-400 rounded-full"></div>
                        </div>
                        <span class="text-[10px] text-white/40">距离下一阶段还差 ${100 - dream.progress}%</span>
                    </div>
                </div>
            </div>

            <!-- Sponsor Button Section -->
            <div class="mb-6">
                <button onclick="sponsorDream(${dream.id})" class="w-full h-14 bg-gradient-to-r from-purple-600 to-primary rounded-full shadow-[0_0_20px_rgba(200,128,255,0.4)] flex items-center justify-center gap-2 text-white font-bold text-lg hover:brightness-110 active:scale-95 transition-all btn-hover">
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
                    赞助这个不可能
                    <span class="text-sm font-normal text-white/80 ml-1">（10能量）</span>
                </button>
            </div>

            <!-- Comments Section -->
            <div>
                <h3 class="text-white font-semibold text-lg mb-4">评论 (${dream.comments})</h3>
                ${comments.length > 0 ? comments.map(comment => renderComment(comment)).join('') : '<p class="text-slate-500 text-sm text-center py-4">还没有评论，快来抢沙发！</p>'}
            </div>
        </div>

        <!-- Fixed Comment Input at Bottom -->
        <div class="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#1a0f23] via-[#1a0f23]/95 to-transparent pt-4 pb-8 px-5 z-40 max-w-md mx-auto">
            <div class="flex gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-primary flex items-center justify-center text-xs font-bold text-white shrink-0">
                    U
                </div>
                <div class="flex-1">
                    <input type="text" placeholder="写下你的评论..." class="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all">
                </div>
                <button class="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white hover:bg-primary/80 transition-colors shrink-0">
                    <span class="material-symbols-outlined text-lg">send</span>
                </button>
            </div>
        </div>
    `;
}

// Render comment
function renderComment(comment) {
    return `
        <div class="flex gap-3 mb-4">
            ${comment.user.avatar ? `
                <img alt="${comment.user.name}" class="shrink-0 w-8 h-8 rounded-full object-cover" src="${comment.user.avatar}">
            ` : `
                <div class="shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-primary flex items-center justify-center text-[10px] font-bold text-white">${comment.user.initials}</div>
            `}
            <div>
                <div class="flex items-center gap-2 mb-0.5">
                    <span class="text-sm font-semibold text-white/90">${comment.user.name}</span>
                    <span class="text-[10px] text-white/30">${comment.timeAgo}</span>
                </div>
                <p class="text-sm text-slate-300">${comment.text}</p>
            </div>
        </div>
    `;
}

// ========== HELPER FUNCTIONS ==========

// Filter dreams by category
function filterDreams(filterType, buttonElement) {
    // Update button styles
    const buttons = buttonElement.parentElement.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.classList.remove('bg-primary', 'text-white', 'font-bold', 'shadow-[4px_4px_0px_rgba(200,146,210,0.3)]');
        btn.classList.add('bg-white/5', 'text-white/70', 'font-medium');
    });

    // Set active button style
    buttonElement.classList.remove('bg-white/5', 'text-white/70', 'font-medium');
    buttonElement.classList.add('bg-primary', 'text-white', 'font-bold', 'shadow-[4px_4px_0px_rgba(200,146,210,0.3)]');

    // Filter dreams based on type
    let filteredDreams = [];
    const allDreams = dreamData.dreams.filter(d => !d.featured);

    switch(filterType) {
        case 'popular':
            // Sort by supporters count
            filteredDreams = [...allDreams].sort((a, b) => b.supporters - a.supporters);
            break;
        case 'newest':
            // Sort by ID (newest first)
            filteredDreams = [...allDreams].sort((a, b) => b.id - a.id);
            break;
        case 'upcoming':
            // Dreams with progress < 50%
            filteredDreams = allDreams.filter(d => d.progress < 50);
            break;
        case 'creative':
            // Dreams with high impossible index (> 70%)
            filteredDreams = allDreams.filter(d => d.impossibleIndex > 70);
            break;
        default:
            filteredDreams = allDreams;
    }

    // Update dream grid
    const dreamGrid = document.getElementById('dream-grid');
    if (dreamGrid) {
        dreamGrid.innerHTML = filteredDreams.map(dream => renderDreamCard(dream)).join('');
    }
}

// Format number with K/M suffix
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

// Get gradient class for dream
function getGradientForDream(id) {
    const gradients = [
        'bg-gradient-to-br from-blue-500/10 to-purple-500/10',
        'bg-gradient-to-br from-green-500/10 to-teal-500/10',
        'bg-gradient-to-br from-yellow-500/10 to-orange-500/10',
        'bg-gradient-to-br from-pink-500/10 to-rose-500/10',
        'bg-gradient-to-tr from-indigo-300 to-cyan-400',
        'bg-gradient-to-br from-orange-600 to-red-800',
        'bg-gradient-to-br from-purple-900 to-indigo-900',
        'bg-gradient-to-br from-blue-400 to-cyan-300'
    ];
    return gradients[(id - 1) % gradients.length];
}

// ========== ENERGY SYSTEM FUNCTIONS ==========

// Sponsor a dream (deduct 10 energy)
function sponsorDream(dreamId) {
    const profile = dreamData.userProfile;
    
    // Check if user has enough energy
    if (profile.energy < 10) {
        showNotification('能量不足', '您需要至少10能量才能赞助梦想', 'error');
        return;
    }
    
    // Deduct 10 energy
    profile.energy -= 10;
    
    // Find and update the dream
    const dream = getDreamById(dreamId);
    if (dream) {
        dream.energy += 10;
        dream.supporters += 1;
        
        // Show success notification
        showNotification('赞助成功', `已为梦想"${dream.title}"赞助10能量！`, 'success');
        
        // Reload page to update UI
        loadPageContent(currentPage);
    }
}

// Claim daily login reward
function claimDailyReward() {
    const today = new Date().toISOString().split('T')[0];
    const lastClaimDate = localStorage.getItem('lastClaimDate');
    
    // Check if already claimed today
    if (lastClaimDate === today) {
        showNotification('今日已领取', '每日登录奖励只能领取一次哦~', 'info');
        return;
    }
    
    // Add 50 energy as daily reward
    const profile = dreamData.userProfile;
    profile.energy += 50;
    profile.todayClaimed = true;
    
    // Save last claim date
    localStorage.setItem('lastClaimDate', today);
    
    // Show success notification
    showNotification('每日登录奖励', '恭喜获得50能量！', 'success');
    
    // Reload page to update UI
    loadPageContent(currentPage);
}

// Convert dream energy to personal energy
function convertDreamEnergy() {
    const profile = dreamData.userProfile;
    
    // Find completed dreams with energy
    const completedDreams = dreamData.dreams.filter(dream => dream.isCompleted && dream.energy > 0);
    
    if (completedDreams.length === 0) {
        showNotification('无可转化能量', '您没有已完成且含有能量的梦想', 'info');
        return;
    }
    
    // Calculate total convertible energy (80% conversion rate)
    let totalConvertible = 0;
    completedDreams.forEach(dream => {
        totalConvertible += Math.floor(dream.energy * 0.8);
    });
    
    if (totalConvertible <= 0) {
        showNotification('无可转化能量', '梦想能量不足，无法转化', 'info');
        return;
    }
    
    // Convert energy
    profile.energy += totalConvertible;
    
    // Reset dream energy after conversion
    completedDreams.forEach(dream => {
        dream.energy = 0;
    });
    
    // Show success notification
    showNotification('能量转化成功', `成功将${completedDreams.length}个梦想的能量转化，获得${totalConvertible}能量！`, 'success');
    
    // Reload page to update UI
    loadPageContent(currentPage);
}

// ========== INITIALIZATION ==========

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeRouter();
    
    // Check daily login on app initialization
    const today = new Date().toISOString().split('T')[0];
    const lastClaimDate = localStorage.getItem('lastClaimDate');
    
    // Auto-claim daily reward if not claimed today
    if (lastClaimDate !== today && !dreamData.userProfile.todayClaimed) {
        claimDailyReward();
    }
});
