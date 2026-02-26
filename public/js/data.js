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
        const [dreams, feed, notifications, profile, categories] = await Promise.all([
            api.getDreams(),
            api.getFeed(),
            api.getNotifications(),
            api.getProfile(),
            api.getCategories()
        ]);

        dreamData.dreams = dreams;
        dreamData.feed = feed;
        dreamData.notifications = notifications;
        dreamData.userProfile = profile;
        dreamData.categories = categories;

        return true;
    } catch (error) {
        console.error('Failed to load data from API:', error);
        return false;
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

