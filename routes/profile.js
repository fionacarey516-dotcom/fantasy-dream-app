const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const { JWT_SECRET } = require('./auth');

// 从token中获取用户ID
function getUserId(req) {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) return null;
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded.userId;
    } catch {
        return null;
    }
}

// GET /api/profile - 获取用户 Profile
router.get('/', async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ error: '请先登录' });
        }

        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;

        // 获取用户的梦想统计
        const { data: dreams } = await supabase
            .from('dreams')
            .select('id')
            .eq('author_id', userId);

        // 获取赞助过的梦想数
        const { data: sponsored } = await supabase
            .from('dream_sponsors')
            .select('dream_id')
            .eq('user_id', userId);

        const uniqueSponsored = new Set(sponsored?.map(s => s.dream_id) || []);

        const profile = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            verified: user.verified,
            bio: user.bio,
            energy: user.energy,
            stats: {
                dreams: dreams?.length || 0,
                supported: uniqueSponsored.size,
                supportReceived: 0
            },
            followers: user.followers,
            following: user.following,
            lastLoginDate: user.last_login_date,
            todayClaimed: user.today_claimed
        };

        res.json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// POST /api/profile/daily-reward - 领取每日奖励
router.post('/daily-reward', async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ error: '请先登录' });
        }

        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('energy, today_claimed, last_login_date')
            .eq('id', userId)
            .single();

        if (fetchError) throw fetchError;

        const today = new Date().toISOString().split('T')[0];

        // 检查是否已经领取
        if (user.last_login_date === today && user.today_claimed) {
            return res.status(400).json({ error: '今日已领取，每日登录奖励只能领取一次' });
        }

        // 添加50能量
        const { error: updateError } = await supabase
            .from('users')
            .update({
                energy: user.energy + 50,
                today_claimed: true,
                last_login_date: today
            })
            .eq('id', userId);

        if (updateError) throw updateError;

        res.json({
            success: true,
            newEnergy: user.energy + 50,
            reward: 50
        });
    } catch (error) {
        console.error('Error claiming daily reward:', error);
        res.status(500).json({ error: 'Failed to claim daily reward' });
    }
});

// PUT /api/profile/bio - 修改个性签名
router.put('/bio', async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ error: '请先登录' });

        const { bio } = req.body;
        if (bio && bio.length > 50) {
            return res.status(400).json({ error: '签名不能超过50个字符' });
        }

        const { error } = await supabase
            .from('users')
            .update({ bio: bio || null })
            .eq('id', userId);

        if (error) throw error;

        res.json({ success: true, bio: bio || '' });
    } catch (error) {
        console.error('Error updating bio:', error);
        res.status(500).json({ error: '保存签名失败' });
    }
});

// GET /api/profile/my-dreams - 获取用户发布的梦想
router.get('/my-dreams', async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ error: '请先登录' });

        const { data, error } = await supabase
            .from('dreams')
            .select(`*, author:users!dreams_author_id_fkey(id, name, avatar, verified)`)
            .eq('author_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        const dreams = data.map(d => ({
            id: d.id, title: d.title, description: d.description, authorId: d.author_id,
            author: { name: d.author?.name || 'Anonymous', avatar: d.author?.avatar || null, verified: d.author?.verified || false },
            category: d.category, emoji: d.emoji, progress: d.progress, energy: d.energy, goal: d.goal,
            isCompleted: d.is_completed, supporters: d.supporters, likes: d.likes, comments: d.comments_count,
            coverImage: d.cover_image, featured: d.featured,
            impossibleIndex: parseFloat(d.impossible_index) || 0, ratingCount: d.rating_count || 0,
            status: d.status || 'approved'
        }));
        res.json(dreams);
    } catch (error) {
        console.error('Error fetching my dreams:', error);
        res.status(500).json({ error: 'Failed to fetch my dreams' });
    }
});

// GET /api/profile/supported-dreams - 获取用户支持过的梦想
router.get('/supported-dreams', async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ error: '请先登录' });

        // 获取用户赞助过的梦想ID
        const { data: sponsors, error: sponsorError } = await supabase
            .from('dream_sponsors')
            .select('dream_id')
            .eq('user_id', userId);

        if (sponsorError) throw sponsorError;

        const dreamIds = [...new Set(sponsors?.map(s => s.dream_id) || [])];
        if (dreamIds.length === 0) return res.json([]);

        const { data, error } = await supabase
            .from('dreams')
            .select(`*, author:users!dreams_author_id_fkey(id, name, avatar, verified)`)
            .in('id', dreamIds)
            .order('created_at', { ascending: false });

        if (error) throw error;

        const dreams = data.map(d => ({
            id: d.id, title: d.title, description: d.description, authorId: d.author_id,
            author: { name: d.author?.name || 'Anonymous', avatar: d.author?.avatar || null, verified: d.author?.verified || false },
            category: d.category, emoji: d.emoji, progress: d.progress, energy: d.energy, goal: d.goal,
            isCompleted: d.is_completed, supporters: d.supporters, likes: d.likes, comments: d.comments_count,
            coverImage: d.cover_image, featured: d.featured,
            impossibleIndex: parseFloat(d.impossible_index) || 0, ratingCount: d.rating_count || 0
        }));
        res.json(dreams);
    } catch (error) {
        console.error('Error fetching supported dreams:', error);
        res.status(500).json({ error: 'Failed to fetch supported dreams' });
    }
});

module.exports = router;
