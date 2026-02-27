const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const JWT_SECRET = process.env.JWT_SECRET || 'mengye-app-secret-key-2026';

// GET /api/notifications - 获取通知列表
router.get('/', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        let userId = null;
        if (token) {
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                userId = decoded.userId;
            } catch (e) {
                // Ignore invalid token here
            }
        }

        if (!userId) {
            return res.status(401).json({ error: '请先登录' });
        }

        const { data, error } = await supabase
            .from('notifications')
            .select(`
                *,
                actor:users!notifications_actor_id_fkey(id, name, avatar)
            `)
            .or(`user_id.eq.${userId},user_id.is.null`)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Ensure we only return notifications relevant to this user based on business rules:
        // 1. Actions on MY dreams
        // 2. Achievements on dreams I have supported
        // 3. System messages (user_id is null)

        // We need to fetch dreams I authored or supported to filter the list
        const { data: myDreams } = await supabase.from('dreams').select('id').eq('author_id', userId);
        const myDreamIds = myDreams ? myDreams.map(d => d.id) : [];

        const { data: supportedDreams } = await supabase.from('dream_sponsors').select('dream_id').eq('user_id', userId);
        const supportedDreamIds = supportedDreams ? supportedDreams.map(d => d.dream_id) : [];

        const filteredNotifications = data.filter(n => {
            // 3. 系统消息（无目标用户和目标梦想，或者特定指派给我的系统消息）
            if (!n.target_dream_id && !n.user_id) return true;
            if (!n.target_dream_id && n.user_id === userId) return true;

            // 1. 别人对我的梦做了什么 (赞, 评论, 赞助)
            if (myDreamIds.includes(n.target_dream_id) && ['like', 'comment', 'sponsor'].includes(n.type)) return true;

            // 2. 我赞助过的梦成功了
            if (supportedDreamIds.includes(n.target_dream_id) && n.type === 'achievement') return true;

            // 我的梦成功了也应该通知我
            if (myDreamIds.includes(n.target_dream_id) && n.type === 'achievement') return true;

            // Refund notification for me
            if (n.type === 'refund' && n.user_id === userId) return true;

            return false;
        });

        const notifications = filteredNotifications.map(n => ({
            id: n.id,
            type: n.type,
            user: n.actor ? {
                name: n.actor.name,
                avatar: n.actor.avatar
            } : null,
            targetDream: n.target_dream_id,
            content: n.content,
            timeAgo: n.time_ago,
            read: n.read,
            reward: n.reward
        }));

        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// PUT /api/notifications/read-all - 全部标为已读
router.put('/read-all', async (req, res) => {
    try {
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('read', false);

        if (error) throw error;

        res.json({ success: true });
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        res.status(500).json({ error: 'Failed to mark notifications as read' });
    }
});

module.exports = router;
