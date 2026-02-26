-- ============================================
-- 梦嘢 App - Database Migration
-- 添加 password_hash, role 列 + 管理员账户
-- 请在 Supabase SQL Editor 中执行此脚本
-- ============================================

-- 1. 添加 password_hash 列（如果不存在）
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- 2. 添加 role 列（如果不存在）
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- 3. 刷新 PostgREST schema cache（让新列立即可用）
NOTIFY pgrst, 'reload schema';

-- 4. 确保 name 列有 UNIQUE 约束
ALTER TABLE users ADD CONSTRAINT users_name_unique UNIQUE (name);

-- 5. 插入管理员账户（密码: admin123456）
INSERT INTO users (name, password_hash, role, bio, energy, verified)
VALUES ('admin', '$2b$10$rTIb47IRQaRp/IHi9uWBWuw9Kg8Uq.XG5n32pM.6lTC/P7R39iND.', 'admin', '🛡️ 系统管理员', 9999, TRUE)
ON CONFLICT (name) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role;
