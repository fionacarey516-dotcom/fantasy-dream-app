const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const { JWT_SECRET } = require('./auth');

// 从token中获取用户ID的辅助函数
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
            authorId: d.author_id,
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
            impossibleIndex: parseFloat(d.impossible_index) || 0,
            ratingCount: d.rating_count || 0
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
        const userId = getUserId(req);

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

        // 检查当前用户是否已评分
        let userRating = null;
        if (userId) {
            const { data: ratingData } = await supabase
                .from('dream_ratings')
                .select('rating')
                .eq('dream_id', id)
                .eq('user_id', userId)
                .single();
            if (ratingData) userRating = ratingData.rating;
        }

        // 检查当前用户今日是否已赞助
        let sponsoredToday = false;
        if (userId) {
            const today = new Date().toISOString().split('T')[0];
            const { data: sponsorData } = await supabase
                .from('dream_sponsors')
                .select('id')
                .eq('dream_id', id)
                .eq('user_id', userId)
                .eq('sponsor_date', today)
                .single();
            if (sponsorData) sponsoredToday = true;
        }

        const dream = {
            id: data.id,
            title: data.title,
            description: data.description,
            authorId: data.author_id,
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
            impossibleIndex: parseFloat(data.impossible_index) || 0,
            ratingCount: data.rating_count || 0,
            userRating,
            sponsoredToday
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
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ error: '请先登录' });
        }

        const { title, description, emoji, goal, impossibleIndex, anonymous, coverImage } = req.body;

        const { data, error } = await supabase
            .from('dreams')
            .insert({
                title,
                description,
                author_id: anonymous ? null : userId,
                emoji: emoji || '✨',
                goal: goal || 1000,
                impossible_index: impossibleIndex || 0,
                rating_count: impossibleIndex ? 1 : 0,
                progress: 0,
                energy: 0,
                supporters: 0,
                likes: 0,
                comments_count: 0,
                is_completed: false,
                featured: false,
                cover_image: coverImage || null
            })
            .select()
            .single();

        if (error) throw error;

        // 如果有初始评分，记录到评分表
        if (impossibleIndex && impossibleIndex > 0) {
            await supabase.from('dream_ratings').insert({
                dream_id: data.id,
                user_id: userId,
                rating: impossibleIndex
            });
        }

        // 创建动态记录
        await supabase.from('feed_activities').insert({
            type: 'publish',
            user_id: anonymous ? null : userId,
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

// POST /api/dreams/:id/rate - 给梦想评分
router.post('/:id/rate', async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ error: '请先登录' });
        }

        const dreamId = parseInt(req.params.id);
        const { rating } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: '评分需要在1-5之间' });
        }

        // 检查是否已评分
        const { data: existingRating } = await supabase
            .from('dream_ratings')
            .select('id')
            .eq('dream_id', dreamId)
            .eq('user_id', userId)
            .single();

        if (existingRating) {
            return res.status(400).json({ error: '你已经对这个梦想评过分了' });
        }

        // 插入评分
        const { error: insertError } = await supabase
            .from('dream_ratings')
            .insert({
                dream_id: dreamId,
                user_id: userId,
                rating: Math.round(rating)
            });

        if (insertError) throw insertError;

        // 计算新的平均分和评分人数
        const { data: ratings, error: ratingError } = await supabase
            .from('dream_ratings')
            .select('rating')
            .eq('dream_id', dreamId);

        if (ratingError) throw ratingError;

        const ratingCount = ratings.length;
        const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratingCount;

        // 更新梦想的不可思议指数
        const { error: updateError } = await supabase
            .from('dreams')
            .update({
                impossible_index: Math.round(avgRating * 100) / 100,
                rating_count: ratingCount
            })
            .eq('id', dreamId);

        if (updateError) throw updateError;

        res.json({
            success: true,
            impossibleIndex: Math.round(avgRating * 100) / 100,
            ratingCount,
            userRating: Math.round(rating)
        });
    } catch (error) {
        console.error('Error rating dream:', error);
        res.status(500).json({ error: '评分失败' });
    }
});

// POST /api/dreams/:id/sponsor - 赞助梦想
router.post('/:id/sponsor', async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ error: '请先登录' });
        }

        const dreamId = parseInt(req.params.id);

        // 检查是否是自己的梦想
        const { data: dream, error: dreamError } = await supabase
            .from('dreams')
            .select('energy, supporters, author_id, goal')
            .eq('id', dreamId)
            .single();

        if (dreamError) throw dreamError;

        if (dream.author_id === userId) {
            return res.status(400).json({ error: '不能赞助自己的梦想哦' });
        }

        // 检查今日是否已赞助
        const today = new Date().toISOString().split('T')[0];
        const { data: existingSponsor } = await supabase
            .from('dream_sponsors')
            .select('id')
            .eq('dream_id', dreamId)
            .eq('user_id', userId)
            .eq('sponsor_date', today)
            .single();

        if (existingSponsor) {
            return res.status(400).json({ error: '今天已经赞助过这个梦想了，明天再来吧' });
        }

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

        // 更新梦想能量和支持者数
        const newEnergy = dream.energy + 10;
        const newProgress = Math.min(100, Math.round((newEnergy / dream.goal) * 100));
        const { error: updateDreamError } = await supabase
            .from('dreams')
            .update({
                energy: newEnergy,
                supporters: dream.supporters + 1,
                progress: newProgress
            })
            .eq('id', dreamId);

        if (updateDreamError) throw updateDreamError;

        // 记录赞助
        await supabase.from('dream_sponsors').insert({
            dream_id: dreamId,
            user_id: userId,
            sponsor_date: today
        });

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
            dreamEnergy: newEnergy,
            dreamSupporters: dream.supporters + 1,
            dreamProgress: newProgress
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
        const userId = getUserId(req);
        if (!userId) {
            return res.status(401).json({ error: '请先登录' });
        }

        const { dreamId } = req.params;
        const { text } = req.body;

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
        const { data: dreamData } = await supabase
            .from('dreams')
            .select('comments_count')
            .eq('id', parseInt(dreamId))
            .single();

        if (dreamData) {
            await supabase
                .from('dreams')
                .update({ comments_count: dreamData.comments_count + 1 })
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

// DELETE /api/dreams/:id - 删除梦想
router.delete('/:id', async (req, res) => {
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ error: '请先登录' });

        const dreamId = parseInt(req.params.id);

        // 获取梦想信息
        const { data: dream, error: dreamError } = await supabase
            .from('dreams')
            .select('*')
            .eq('id', dreamId)
            .single();

        if (dreamError || !dream) return res.status(404).json({ error: '梦想不存在' });
        if (dream.author_id !== userId) return res.status(403).json({ error: '只能删除自己的梦想' });

        // 如果未完成，退还能量给所有赞助者
        if (!dream.is_completed) {
            const { data: sponsors } = await supabase
                .from('dream_sponsors')
                .select('user_id, sponsor_date')
                .eq('dream_id', dreamId);

            if (sponsors && sponsors.length > 0) {
                // 按用户分组计算每人赞助次数（每次10能量）
                const refundMap = {};
                sponsors.forEach(s => {
                    refundMap[s.user_id] = (refundMap[s.user_id] || 0) + 10;
                });

                // 退还能量并发送通知
                for (const [sponsorUserId, refundAmount] of Object.entries(refundMap)) {
                    const uid = parseInt(sponsorUserId);

                    // 退还能量
                    const { data: user } = await supabase
                        .from('users')
                        .select('energy')
                        .eq('id', uid)
                        .single();

                    if (user) {
                        await supabase
                            .from('users')
                            .update({ energy: user.energy + refundAmount })
                            .eq('id', uid);
                    }

                    // 发送通知
                    await supabase.from('notifications').insert({
                        user_id: uid,
                        type: 'refund',
                        content: `梦想「${dream.title}」已被作者删除，您赞助的 ${refundAmount} 能量已退还`,
                        time_ago: '刚刚',
                        read: false
                    });
                }
            }
        }

        // 删除梦想（CASCADE 会自动删除关联的评分、赞助、评论）
        const { error: deleteError } = await supabase
            .from('dreams')
            .delete()
            .eq('id', dreamId);

        if (deleteError) throw deleteError;

        res.json({ success: true, message: '梦想已删除' });
    } catch (error) {
        console.error('Error deleting dream:', error);
        res.status(500).json({ error: '删除失败' });
    }
});

module.exports = router;
