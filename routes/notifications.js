const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET /api/notifications - 获取通知列表
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .select(`
                *,
                user:users!notifications_user_id_fkey(id, name, avatar),
                dream:dreams!notifications_target_dream_id_fkey(id, title)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        const notifications = data.map(n => ({
            id: n.id,
            type: n.type,
            user: n.user ? {
                name: n.user.name,
                avatar: n.user.avatar
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
