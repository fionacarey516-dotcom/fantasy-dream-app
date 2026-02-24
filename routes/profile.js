const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET /api/profile - 获取用户 Profile
router.get('/', async (req, res) => {
    try {
        const userId = 1; // 默认当前用户

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

        const profile = {
            name: user.name,
            avatar: user.avatar,
            verified: user.verified,
            bio: user.bio,
            energy: user.energy,
            stats: {
                dreams: dreams?.length || 0,
                supported: 23,  // TODO: 统计真实数据
                supportReceived: 1200  // TODO: 统计真实数据
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
        const userId = 1;

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

module.exports = router;
