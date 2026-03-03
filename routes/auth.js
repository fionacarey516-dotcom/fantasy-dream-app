const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'mengye-app-secret-key-2026';

// POST /api/auth/register - 用户注册
router.post('/register', async (req, res) => {
    try {
        const { name, password } = req.body;

        if (!name || !password) {
            return res.status(400).json({ error: '用户名和密码不能为空' });
        }

        if (name.length < 2 || name.length > 20) {
            return res.status(400).json({ error: '用户名长度需要2-20个字符' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: '密码长度至少6个字符' });
        }

        // 检查用户名是否已存在
        const { data: existing } = await supabase
            .from('users')
            .select('id')
            .eq('name', name)
            .single();

        if (existing) {
            return res.status(400).json({ error: '用户名已被注册' });
        }

        // 加密密码
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 创建用户
        const { data: user, error } = await supabase
            .from('users')
            .insert({
                name,
                password_hash: passwordHash,
                bio: '🌟 追逐梦想的人',
                energy: 100,
                verified: false
            })
            .select('id, name, avatar, verified, role')
            .single();

        if (error) throw error;

        // 生成 JWT
        const token = jwt.sign({ userId: user.id, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                avatar: user.avatar,
                verified: user.verified,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: '注册失败，请稍后再试' });
    }
});

// POST /api/auth/login - 用户登录
router.post('/login', async (req, res) => {
    try {
        const { name, password } = req.body;

        if (!name || !password) {
            return res.status(400).json({ error: '用户名和密码不能为空' });
        }

        // 查找用户 (不查 avatar 字段，避免超大头像导致查询失败)
        const { data: user, error } = await supabase
            .from('users')
            .select('id, name, verified, password_hash, role')
            .eq('name', name)
            .single();

        if (error || !user) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }

        // 验证密码
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }

        // 自动每日签到：若今天未领取，自动发放50积分
        let dailyReward = false;
        try {
            const { data: userEnergy } = await supabase
                .from('users')
                .select('energy, today_claimed, last_login_date')
                .eq('id', user.id)
                .single();

            const today = new Date().toISOString().split('T')[0];
            if (userEnergy && !(userEnergy.last_login_date === today && userEnergy.today_claimed)) {
                await supabase
                    .from('users')
                    .update({
                        energy: (userEnergy.energy || 0) + 50,
                        today_claimed: true,
                        last_login_date: today
                    })
                    .eq('id', user.id);
                dailyReward = true;
            }
        } catch (rewardErr) {
            // 签到失败不影响登录，静默处理
            console.error('Daily reward error:', rewardErr);
        }

        // 生成 JWT
        const token = jwt.sign({ userId: user.id, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '30d' });

        res.json({
            token,
            dailyReward,
            user: {
                id: user.id,
                name: user.name,
                verified: user.verified,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: '登录失败，请稍后再试' });
    }
});

// GET /api/auth/me - 获取当前用户信息
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: '未登录' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const { data: user, error } = await supabase
            .from('users')
            .select('id, name, avatar, verified, role')
            .eq('id', decoded.userId)
            .single();

        if (error || !user) {
            return res.status(401).json({ error: '用户不存在' });
        }

        res.json(user);
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token无效或已过期' });
        }
        console.error('Auth me error:', error);
        res.status(500).json({ error: '获取用户信息失败' });
    }
});

// PUT /api/auth/change-password - 修改密码
router.put('/change-password', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: '请先登录' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: '请输入旧密码和新密码' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: '新密码长度至少6个字符' });
        }

        // 获取用户当前密码哈希
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('id, password_hash')
            .eq('id', decoded.userId)
            .single();

        if (fetchError || !user) {
            return res.status(401).json({ error: '用户不存在' });
        }

        // 验证旧密码
        const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ error: '旧密码不正确' });
        }

        // 加密新密码
        const salt = await bcrypt.genSalt(10);
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        // 更新密码
        const { error: updateError } = await supabase
            .from('users')
            .update({ password_hash: newPasswordHash })
            .eq('id', decoded.userId);

        if (updateError) throw updateError;

        res.json({ success: true, message: '密码修改成功' });
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token无效或已过期' });
        }
        console.error('Change password error:', error);
        res.status(500).json({ error: '修改密码失败，请稍后再试' });
    }
});

module.exports = router;
module.exports.JWT_SECRET = JWT_SECRET;
