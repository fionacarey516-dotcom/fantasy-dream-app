const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET /api/feed - 获取动态列表
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('feed_activities')
            .select(`
                *,
                user:users!feed_activities_user_id_fkey(id, name, avatar),
                dream:dreams!feed_activities_target_dream_id_fkey(id, title, description, emoji, progress, cover_image)
            `)
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) throw error;

        const feed = data.map(activity => ({
            id: activity.id,
            type: activity.type,
            user: {
                name: activity.user?.name || 'Anonymous',
                avatar: activity.user?.avatar || null
            },
            targetDream: activity.target_dream_id,
            timeAgo: activity.time_ago,
            actionColor: activity.action_color,
            // Include dream details for rendering feed cards
            dreamDetail: activity.dream ? {
                id: activity.dream.id,
                title: activity.dream.title,
                description: activity.dream.description,
                emoji: activity.dream.emoji,
                progress: activity.dream.progress,
                coverImage: activity.dream.cover_image
            } : null
        }));

        res.json(feed);
    } catch (error) {
        console.error('Error fetching feed:', error);
        res.status(500).json({ error: 'Failed to fetch feed' });
    }
});

module.exports = router;
