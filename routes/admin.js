const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const qiniu = require('qiniu');
const multer = require('multer');
const path = require('path');

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'admin_secret_fallback_change_this';

// Multer memory storage for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('只支持 JPG、PNG、WebP、GIF 格式的图片'));
        }
    }
});

// Admin auth middleware
function requireAdmin(req, res, next) {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ error: '请先登录' });
        const decoded = jwt.verify(token, ADMIN_JWT_SECRET);
        if (!decoded.isAdmin) return res.status(403).json({ error: '无权限' });
        req.adminId = decoded.userId;
        next();
    } catch {
        res.status(401).json({ error: 'Token 无效或已过期' });
    }
}

// POST /api/admin/login - 管理员登录
router.post('/login', async (req, res) => {
    try {
        const { name, password } = req.body;
        if (!name || !password) {
            return res.status(400).json({ error: '请输入用户名和密码' });
        }

        const { data: user, error } = await supabase
            .from('users')
            .select('id, name, password_hash, role, avatar')
            .eq('name', name)
            .single();

        if (error || !user) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ error: '无管理员权限' });
        }

        // Verify password
        const bcrypt = require('bcryptjs');
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }

        const token = jwt.sign(
            { userId: user.id, name: user.name, isAdmin: true },
            ADMIN_JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user.id, name: user.name, avatar: user.avatar } });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: '登录失败' });
    }
});

// GET /api/admin/dreams - 获取所有梦想（含状态）
router.get('/dreams', requireAdmin, async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        let query = supabase
            .from('dreams')
            .select(`
                *,
                author:users!dreams_author_id_fkey(id, name, avatar, verified)
            `, { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + parseInt(limit) - 1);

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error, count } = await query;
        if (error) throw error;

        const dreams = data.map(d => ({
            id: d.id,
            title: d.title,
            description: d.description,
            authorId: d.author_id,
            author: {
                name: d.author?.name || '匿名',
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
            ratingCount: d.rating_count || 0,
            status: d.status || 'approved',
            createdAt: d.created_at
        }));

        res.json({ dreams, total: count, page: parseInt(page), limit: parseInt(limit) });
    } catch (error) {
        console.error('Admin get dreams error:', error);
        res.status(500).json({ error: '获取梦想列表失败' });
    }
});

// PUT /api/admin/dreams/:id/approve - 审核通过
router.put('/dreams/:id/approve', requireAdmin, async (req, res) => {
    try {
        const dreamId = parseInt(req.params.id);

        // 获取梦想信息
        const { data: dream, error: dreamError } = await supabase
            .from('dreams')
            .select('*, author:users!dreams_author_id_fkey(id, name)')
            .eq('id', dreamId)
            .single();

        if (dreamError || !dream) {
            return res.status(404).json({ error: '梦想不存在' });
        }

        if (dream.status !== 'pending') {
            return res.status(400).json({ error: '只能审核待审核的梦想' });
        }

        // 更新状态为已通过
        const { error: updateError } = await supabase
            .from('dreams')
            .update({ status: 'approved' })
            .eq('id', dreamId);

        if (updateError) throw updateError;

        // 创建动态记录（梦想正式公开）
        await supabase.from('feed_activities').insert({
            type: 'publish',
            user_id: dream.author_id,
            target_dream_id: dreamId,
            time_ago: '刚刚',
            action_color: 'blue'
        });

        // 通知梦想作者
        if (dream.author_id) {
            await supabase.from('notifications').insert({
                type: 'system',
                user_id: dream.author_id,
                target_dream_id: dreamId,
                content: `🎉 你的梦想「${dream.title}」已通过审核，现在已公开发布！`,
                time_ago: '刚刚',
                read: false
            });
        }

        res.json({ success: true, message: '审核通过，梦想已公开' });
    } catch (error) {
        console.error('Admin approve dream error:', error);
        res.status(500).json({ error: '审核操作失败' });
    }
});

// PUT /api/admin/dreams/:id/reject - 审核拒绝
router.put('/dreams/:id/reject', requireAdmin, async (req, res) => {
    try {
        const dreamId = parseInt(req.params.id);
        const { reason } = req.body;

        const { data: dream, error: dreamError } = await supabase
            .from('dreams')
            .select('*, author:users!dreams_author_id_fkey(id, name)')
            .eq('id', dreamId)
            .single();

        if (dreamError || !dream) {
            return res.status(404).json({ error: '梦想不存在' });
        }

        // 更新状态为已拒绝
        const { error: updateError } = await supabase
            .from('dreams')
            .update({ status: 'rejected' })
            .eq('id', dreamId);

        if (updateError) throw updateError;

        // 退还 20 积分给作者
        if (dream.author_id) {
            const { data: authorUser } = await supabase
                .from('users')
                .select('energy')
                .eq('id', dream.author_id)
                .single();

            if (authorUser) {
                await supabase
                    .from('users')
                    .update({ energy: authorUser.energy + 20 })
                    .eq('id', dream.author_id);
            }

            // 通知作者
            const rejectMsg = reason
                ? `你的梦想「${dream.title}」未通过审核，原因：${reason}。已退还 20 积分。`
                : `你的梦想「${dream.title}」未通过审核，已退还 20 积分。`;

            await supabase.from('notifications').insert({
                type: 'system',
                user_id: dream.author_id,
                target_dream_id: dreamId,
                content: rejectMsg,
                time_ago: '刚刚',
                read: false
            });
        }

        res.json({ success: true, message: '已拒绝，积分已退还' });
    } catch (error) {
        console.error('Admin reject dream error:', error);
        res.status(500).json({ error: '审核操作失败' });
    }
});

// POST /api/admin/dreams - 管理员直接创建梦想（已审核通过）
router.post('/dreams', requireAdmin, async (req, res) => {
    try {
        const { title, description, emoji, goal, impossibleIndex, coverImage, category, authorId } = req.body;

        if (!title) {
            return res.status(400).json({ error: '梦想标题不能为空' });
        }

        const { data, error } = await supabase
            .from('dreams')
            .insert({
                title,
                description: description || '',
                author_id: authorId || null,
                emoji: emoji || '✨',
                category: category || null,
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
                cover_image: coverImage || null,
                status: 'approved'  // 管理员直接创建，无需审核
            })
            .select()
            .single();

        if (error) throw error;

        // 创建动态记录
        await supabase.from('feed_activities').insert({
            type: 'publish',
            user_id: authorId || null,
            target_dream_id: data.id,
            time_ago: '刚刚',
            action_color: 'blue'
        });

        res.status(201).json(data);
    } catch (error) {
        console.error('Admin create dream error:', error);
        res.status(500).json({ error: '创建梦想失败' });
    }
});

// POST /api/admin/upload - 上传图片到七牛云
router.post('/upload', requireAdmin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: '请选择要上传的图片' });
        }

        const QINIU_AK = process.env.QINIU_ACCESS_KEY;
        const QINIU_SK = process.env.QINIU_SECRET_KEY;
        const QINIU_BUCKET = process.env.QINIU_BUCKET_NAME;
        const QINIU_DOMAIN = process.env.QINIU_DOMAIN;

        if (!QINIU_AK || !QINIU_SK || !QINIU_BUCKET || !QINIU_DOMAIN) {
            return res.status(500).json({ error: '七牛云配置不完整，请检查 .env 文件' });
        }

        // 生成上传凭证
        const mac = new qiniu.auth.digest.Mac(QINIU_AK, QINIU_SK);
        const putPolicy = new qiniu.rs.PutPolicy({ scope: QINIU_BUCKET });
        const uploadToken = putPolicy.uploadToken(mac);

        // 生成唯一文件名
        const ext = path.extname(req.file.originalname) || '.jpg';
        const key = `dreams/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

        // 配置上传区域（根据你的七牛存储区域选择）
        // Zone_z0=华东, Zone_z1=华北, Zone_z2=华南, Zone_na0=北美
        const zone = process.env.QINIU_ZONE || 'z0';
        const zoneMap = {
            z0: qiniu.zone.Zone_z0,
            z1: qiniu.zone.Zone_z1,
            z2: qiniu.zone.Zone_z2,
            na0: qiniu.zone.Zone_na0
        };
        const config = new qiniu.conf.Config();
        config.zone = zoneMap[zone] || qiniu.zone.Zone_z0;

        const formUploader = new qiniu.form_up.FormUploader(config);
        const putExtra = new qiniu.form_up.PutExtra();

        // 上传 Buffer
        const result = await new Promise((resolve, reject) => {
            formUploader.put(uploadToken, key, req.file.buffer, putExtra, (err, body, info) => {
                if (err) return reject(err);
                if (info.statusCode !== 200) return reject(new Error(body.error || '上传失败'));
                resolve(body);
            });
        });

        // 拼接公开访问 URL（域名末尾不要带 /）
        const domain = QINIU_DOMAIN.replace(/\/$/, '');
        const publicUrl = `${domain}/${result.key}`;

        res.json({ success: true, url: publicUrl, filename: result.key });
    } catch (error) {
        console.error('Qiniu upload error:', error);
        res.status(500).json({ error: `图片上传失败：${error.message}` });
    }
});

// GET /api/admin/stats - 获取统计数据
router.get('/stats', requireAdmin, async (req, res) => {
    try {
        const [
            { count: totalDreams },
            { count: pendingDreams },
            { count: approvedDreams },
            { count: totalUsers }
        ] = await Promise.all([
            supabase.from('dreams').select('*', { count: 'exact', head: true }),
            supabase.from('dreams').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
            supabase.from('dreams').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
            supabase.from('users').select('*', { count: 'exact', head: true })
        ]);

        res.json({ totalDreams, pendingDreams, approvedDreams, totalUsers });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ error: '获取统计数据失败' });
    }
});

module.exports = router;
