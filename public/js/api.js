// ========== API Client ==========
// 封装所有与后端 API 的交互

const api = {
    baseUrl: '',  // 同域，无需前缀

    // 通用请求方法
    async request(url, options = {}) {
        try {
            const response = await fetch(this.baseUrl + url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error(`API Error [${url}]:`, error);
            throw error;
        }
    },

    // ========== Dreams ==========

    // 获取所有梦想
    async getDreams(params = {}) {
        let url = '/api/dreams';
        const queryParams = new URLSearchParams();
        if (params.featured) queryParams.set('featured', 'true');
        if (params.category) queryParams.set('category', params.category);
        const qs = queryParams.toString();
        if (qs) url += '?' + qs;
        return this.request(url);
    },

    // 获取单个梦想
    async getDream(id) {
        return this.request(`/api/dreams/${id}`);
    },

    // 创建新梦想
    async createDream(dreamData) {
        return this.request('/api/dreams', {
            method: 'POST',
            body: JSON.stringify(dreamData)
        });
    },

    // 赞助梦想
    async sponsorDream(dreamId) {
        return this.request(`/api/dreams/${dreamId}/sponsor`, {
            method: 'POST'
        });
    },

    // 获取梦想评论
    async getComments(dreamId) {
        return this.request(`/api/dreams/${dreamId}/comments`);
    },

    // 发表评论
    async postComment(dreamId, text) {
        return this.request(`/api/dreams/${dreamId}/comments`, {
            method: 'POST',
            body: JSON.stringify({ text })
        });
    },

    // ========== Feed ==========

    // 获取动态列表
    async getFeed() {
        return this.request('/api/feed');
    },

    // ========== Notifications ==========

    // 获取通知列表
    async getNotifications() {
        return this.request('/api/notifications');
    },

    // 全部标为已读
    async markAllNotificationsRead() {
        return this.request('/api/notifications/read-all', {
            method: 'PUT'
        });
    },

    // ========== Profile ==========

    // 获取用户 Profile
    async getProfile() {
        return this.request('/api/profile');
    },

    // 领取每日奖励
    async claimDailyReward() {
        return this.request('/api/profile/daily-reward', {
            method: 'POST'
        });
    },

    // ========== Categories ==========

    // 获取分类列表
    async getCategories() {
        return this.request('/api/categories');
    }
};
