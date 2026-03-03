// ========== API Client ==========
// 封装所有与后端 API 的交互

const api = {
    baseUrl: '',  // 同域，无需前缀

    // 获取存储的token
    getToken() {
        return localStorage.getItem('auth_token');
    },

    // 通用请求方法
    async request(url, options = {}) {
        try {
            const token = this.getToken();
            const headers = {
                'Content-Type': 'application/json',
                ...options.headers
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(this.baseUrl + url, {
                headers,
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

    // ========== Auth ==========

    // 注册
    async register(name, password) {
        return this.request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, password })
        });
    },

    // 登录
    async login(name, password) {
        return this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ name, password })
        });
    },

    // 获取当前用户
    async getMe() {
        return this.request('/api/auth/me');
    },

    // 修改密码
    async changePassword(oldPassword, newPassword) {
        return this.request('/api/auth/change-password', {
            method: 'PUT',
            body: JSON.stringify({ oldPassword, newPassword })
        });
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

    // 评分梦想
    async rateDream(dreamId, rating) {
        return this.request(`/api/dreams/${dreamId}/rate`, {
            method: 'POST',
            body: JSON.stringify({ rating })
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

    // 点赞梦想
    async likeDream(dreamId) {
        return this.request(`/api/dreams/${dreamId}/like`, { method: 'POST' });
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

    // 修改个性签名
    async updateBio(bio) {
        return this.request('/api/profile/bio', {
            method: 'PUT',
            body: JSON.stringify({ bio })
        });
    },

    // 更换头像
    async updateAvatar(avatar) {
        return this.request('/api/profile/avatar', {
            method: 'POST',
            body: JSON.stringify({ avatar })
        });
    },

    // 获取用户发布的梦想
    async getMyDreams() {
        return this.request('/api/profile/my-dreams');
    },

    // 获取用户支持过的梦想
    async getSupportedDreams() {
        return this.request('/api/profile/supported-dreams');
    },

    // 删除梦想
    async deleteDream(id) {
        return this.request(`/api/dreams/${id}`, { method: 'DELETE' });
    },

    // ========== Categories ==========

    // 获取分类列表
    async getCategories() {
        return this.request('/api/categories');
    }
};
