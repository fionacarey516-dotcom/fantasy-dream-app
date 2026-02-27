// Dream Data Store - 从 API 加载数据
const dreamData = {
    dreams: [],
    feed: [],
    notifications: [],
    comments: {},
    categories: [],
    userProfile: {
        name: '',
        avatar: '',
        verified: false,
        bio: '',
        energy: 0,
        stats: { dreams: 0, supported: 0, supportReceived: 0 },
        followers: 0,
        following: 0,
        lastLoginDate: null,
        todayClaimed: false
    }
};

// 加载公开数据（不需要登录）
async function loadPublicData() {
    try {
        const [dreams, feed, categories] = await Promise.all([
            api.getDreams(),
            api.getFeed(),
            api.getCategories()
        ]);

        dreamData.dreams = dreams;
        dreamData.feed = feed;
        dreamData.categories = categories;

        return true;
    } catch (error) {
        console.error('Failed to load public data:', error);
        return false;
    }
}

// 从 API 加载所有数据（需要登录）
async function loadAllData() {
    try {
        const [dreams, feed, categories] = await Promise.all([
            api.getDreams(),
            api.getFeed(),
            api.getCategories()
        ]);

        dreamData.dreams = dreams;
        dreamData.feed = feed;
        dreamData.categories = categories;

        // Load user-specific data separately so a single failure doesn't break everything
        try {
            const [notifications, profile] = await Promise.all([
                api.getNotifications(),
                api.getProfile()
            ]);
            dreamData.notifications = notifications;
            dreamData.userProfile = profile;
        } catch (userError) {
            // If this is an auth error (401), propagate it
            if (userError.message && (userError.message.includes('401') || userError.message.includes('登录') || userError.message.includes('Token'))) {
                return 'auth_error';
            }
            // Otherwise it's a network error, keep the token but skip user data
            console.warn('Failed to load user-specific data (network issue), keeping session:', userError.message);
        }

        return 'success';
    } catch (error) {
        console.error('Failed to load public data from API:', error);
        // Don't clear token for network errors
        return 'network_error';
    }
}

// Helper functions
function getDreamById(id) {
    return dreamData.dreams.find(d => d.id === id);
}

function getFeaturedDreams() {
    return dreamData.dreams.filter(d => d.featured);
}

function getDreamsByCategory(category) {
    if (!category) return dreamData.dreams;
    return dreamData.dreams.filter(d => d.category === category);
}

function getDreamComments(dreamId) {
    return dreamData.comments[dreamId] || [];
}

// 异步加载评论
async function loadDreamComments(dreamId) {
    try {
        const comments = await api.getComments(dreamId);
        dreamData.comments[dreamId] = comments;
        return comments;
    } catch (error) {
        console.error('Failed to load comments:', error);
        return [];
    }
}

