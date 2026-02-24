const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET /api/dreams - 获取所有梦想
router.get('/', async (req, res) => {
    try {
        const { featured, category } = req.query;

        let query = supabase
            .from('dreams')
            .select(`
                *,
                author:users!dreams_author_id_fkey(id, name, avatar, verified)
            `)
            .order('created_at', { ascending: false });

        if (featured === 'true') {
            query = query.eq('featured', true);
        }

        if (category) {
            query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Transform data to match frontend expected format
        const dreams = data.map(d => ({
            id: d.id,
            title: d.title,
            description: d.description,
            author: {
                name: d.author?.name || 'Anonymous',
                avatar: d.author?.avatar || null,
                verified: d.author?.verified || false
            },
            category: d.category,
            emoji: d.emoji,
            progress: d.progress,
            energy: d.energy,
            goal: d.goal,
            isCompleted: d.is_completed,
            supporters: d.supporters,
            likes: d.likes,
            comments: d.comments_count,
            coverImage: d.cover_image,
            featured: d.featured,
            impossibleIndex: d.impossible_index
        }));

        res.json(dreams);
    } catch (error) {
        console.error('Error fetching dreams:', error);
        res.status(500).json({ error: 'Failed to fetch dreams' });
    }
});

// GET /api/dreams/:id - 获取单个梦想
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('dreams')
            .select(`
                *,
                author:users!dreams_author_id_fkey(id, name, avatar, verified)
            `)
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Dream not found' });

        const dream = {
            id: data.id,
            title: data.title,
            description: data.description,
            author: {
                name: data.author?.name || 'Anonymous',
                avatar: data.author?.avatar || null,
                verified: data.author?.verified || false
            },
            category: data.category,
            emoji: data.emoji,
            progress: data.progress,
            energy: data.energy,
            goal: data.goal,
            isCompleted: data.is_completed,
            supporters: data.supporters,
            likes: data.likes,
            comments: data.comments_count,
            coverImage: data.cover_image,
            featured: data.featured,
            impossibleIndex: data.impossible_index
        };

        res.json(dream);
    } catch (error) {
        console.error('Error fetching dream:', error);
        res.status(500).json({ error: 'Failed to fetch dream' });
    }
});

// POST /api/dreams - 创建新梦想
router.post('/', async (req, res) => {
    try {
        const { title, description, category, emoji, goal, impossibleIndex, anonymous } = req.body;
        const authorId = 1; // 默认使用当前用户 (id=1)

        const { data, error } = await supabase
            .from('dreams')
            .insert({
                title,
                description,
                author_id: anonymous ? null : authorId,
                category,
                emoji: emoji || '✨',
                goal: goal || 1000,
                impossible_index: impossibleIndex || 50,
                progress: 0,
                energy: 0,
                supporters: 0,
                likes: 0,
                comments_count: 0,
                is_completed: false,
                featured: false
            })
            .select()
            .single();

        if (error) throw error;

        // Also create a feed activity for this publish action
        await supabase.from('feed_activities').insert({
            type: 'publish',
            user_id: anonymous ? null : authorId,
            target_dream_id: data.id,
            time_ago: '刚刚',
            action_color: 'blue'
        });

        res.status(201).json(data);
    } catch (error) {
        console.error('Error creating dream:', error);
        res.status(500).json({ error: 'Failed to create dream' });
    }
});

// POST /api/dreams/:id/sponsor - 赞助梦想
router.post('/:id/sponsor', async (req, res) => {
    try {
        const dreamId = parseInt(req.params.id);
        const userId = 1; // 默认当前用户

        // 获取用户能量
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('energy')
            .eq('id', userId)
            .single();

        if (userError) throw userError;

        if (user.energy < 10) {
            return res.status(400).json({ error: '能量不足，需要至少10能量才能赞助' });
        }

        // 扣减用户能量
        const { error: updateUserError } = await supabase
            .from('users')
            .update({ energy: user.energy - 10 })
            .eq('id', userId);

        if (updateUserError) throw updateUserError;

        // 获取梦想当前数据
        const { data: dream, error: dreamError } = await supabase
            .from('dreams')
            .select('energy, supporters')
            .eq('id', dreamId)
            .single();

        if (dreamError) throw dreamError;

        // 更新梦想能量和支持者数
        const { error: updateDreamError } = await supabase
            .from('dreams')
            .update({
                energy: dream.energy + 10,
                supporters: dream.supporters + 1
            })
            .eq('id', dreamId);

        if (updateDreamError) throw updateDreamError;

        // 创建动态记录
        await supabase.from('feed_activities').insert({
            type: 'sponsor',
            user_id: userId,
            target_dream_id: dreamId,
            time_ago: '刚刚',
            action_color: 'primary'
        });

        res.json({
            success: true,
            newEnergy: user.energy - 10,
            dreamEnergy: dream.energy + 10,
            dreamSupporters: dream.supporters + 1
        });
    } catch (error) {
        console.error('Error sponsoring dream:', error);
        res.status(500).json({ error: 'Failed to sponsor dream' });
    }
});

// GET /api/dreams/:dreamId/comments - 获取梦想评论
router.get('/:dreamId/comments', async (req, res) => {
    try {
        const { dreamId } = req.params;

        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('dream_id', dreamId)
            .order('created_at', { ascending: true });

        if (error) throw error;

        const comments = data.map(c => ({
            id: c.id,
            user: {
                name: c.user_name,
                avatar: c.user_avatar,
                initials: c.user_initials
            },
            text: c.text,
            timeAgo: c.time_ago
        }));

        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});

// POST /api/dreams/:dreamId/comments - 发表评论
router.post('/:dreamId/comments', async (req, res) => {
    try {
        const { dreamId } = req.params;
        const { text } = req.body;
        const userId = 1; // 默认当前用户

        // 获取用户信息
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('name, avatar')
            .eq('id', userId)
            .single();

        if (userError) throw userError;

        const { data, error } = await supabase
            .from('comments')
            .insert({
                dream_id: parseInt(dreamId),
                user_name: user.name,
                user_avatar: user.avatar,
                user_initials: user.name.charAt(0),
                text,
                time_ago: '刚刚'
            })
            .select()
            .single();

        if (error) throw error;

        // 更新梦想评论数
        const { data: dream } = await supabase
            .from('dreams')
            .select('comments_count')
            .eq('id', parseInt(dreamId))
            .single();

        if (dream) {
            await supabase
                .from('dreams')
                .update({ comments_count: dream.comments_count + 1 })
                .eq('id', parseInt(dreamId));
        }

        res.status(201).json({
            id: data.id,
            user: {
                name: data.user_name,
                avatar: data.user_avatar,
                initials: data.user_initials
            },
            text: data.text,
            timeAgo: data.time_ago
        });
    } catch (error) {
        console.error('Error posting comment:', error);
        res.status(500).json({ error: 'Failed to post comment' });
    }
});

module.exports = router;
