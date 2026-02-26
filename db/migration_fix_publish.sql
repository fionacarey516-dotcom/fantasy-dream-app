-- ============================================
-- 修复梦想发布 + 添加删除所需的表结构
-- 请在 Supabase SQL Editor 中执行
-- ============================================

-- 1. 添加 rating_count 列（如果不存在）
ALTER TABLE dreams ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;

-- 2. 添加 cover_image 列（如果不存在）
ALTER TABLE dreams ADD COLUMN IF NOT EXISTS cover_image TEXT;

-- 3. 修正 impossible_index 列类型（支持1-5分制）
ALTER TABLE dreams ALTER COLUMN impossible_index TYPE NUMERIC(4,2);

-- 4. 创建评分表（如果不存在）
CREATE TABLE IF NOT EXISTS dream_ratings (
    id SERIAL PRIMARY KEY,
    dream_id INTEGER REFERENCES dreams(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(dream_id, user_id)
);

-- 5. 创建赞助记录表（如果不存在）
CREATE TABLE IF NOT EXISTS dream_sponsors (
    id SERIAL PRIMARY KEY,
    dream_id INTEGER REFERENCES dreams(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    sponsor_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(dream_id, user_id, sponsor_date)
);

-- 6. 刷新 PostgREST schema cache
NOTIFY pgrst, 'reload schema';
