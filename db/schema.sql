-- ============================================
-- 梦嘢 App - Supabase Database Schema V0.2
-- ============================================

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(20) DEFAULT 'user',
    password_hash VARCHAR(255),
    avatar TEXT,
    verified BOOLEAN DEFAULT FALSE,
    bio TEXT,
    energy INTEGER DEFAULT 0,
    followers INTEGER DEFAULT 0,
    following INTEGER DEFAULT 0,
    last_login_date DATE,
    today_claimed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    emoji VARCHAR(10)
);

-- 梦想表
CREATE TABLE IF NOT EXISTS dreams (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(50),
    emoji VARCHAR(10),
    progress INTEGER DEFAULT 0,
    energy INTEGER DEFAULT 0,
    goal INTEGER DEFAULT 1000,
    is_completed BOOLEAN DEFAULT FALSE,
    supporters INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    cover_image TEXT,
    featured BOOLEAN DEFAULT FALSE,
    impossible_index NUMERIC(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 梦想评分表
CREATE TABLE IF NOT EXISTS dream_ratings (
    id SERIAL PRIMARY KEY,
    dream_id INTEGER REFERENCES dreams(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(dream_id, user_id)
);

-- 梦想赞助记录表
CREATE TABLE IF NOT EXISTS dream_sponsors (
    id SERIAL PRIMARY KEY,
    dream_id INTEGER REFERENCES dreams(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    sponsor_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(dream_id, user_id, sponsor_date)
);

-- 动态活动表
CREATE TABLE IF NOT EXISTS feed_activities (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL,  -- 'sponsor', 'publish', 'fork'
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    target_dream_id INTEGER REFERENCES dreams(id) ON DELETE CASCADE,
    time_ago VARCHAR(50),
    action_color VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 通知表
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL,  -- 'like', 'comment', 'sponsor', 'achievement'
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    target_dream_id INTEGER REFERENCES dreams(id) ON DELETE CASCADE,
    content TEXT,
    time_ago VARCHAR(50),
    read BOOLEAN DEFAULT FALSE,
    reward INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 评论表
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    dream_id INTEGER REFERENCES dreams(id) ON DELETE CASCADE,
    user_name VARCHAR(100) NOT NULL,
    user_avatar TEXT,
    user_initials VARCHAR(5),
    text TEXT NOT NULL,
    time_ago VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引以提升查询性能
CREATE INDEX IF NOT EXISTS idx_dreams_author ON dreams(author_id);
CREATE INDEX IF NOT EXISTS idx_dreams_featured ON dreams(featured);
CREATE INDEX IF NOT EXISTS idx_dreams_category ON dreams(category);
CREATE INDEX IF NOT EXISTS idx_feed_activities_created ON feed_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_comments_dream ON comments(dream_id);
CREATE INDEX IF NOT EXISTS idx_dream_ratings_dream ON dream_ratings(dream_id);
CREATE INDEX IF NOT EXISTS idx_dream_ratings_user ON dream_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_dream_sponsors_dream ON dream_sponsors(dream_id);
CREATE INDEX IF NOT EXISTS idx_dream_sponsors_date ON dream_sponsors(sponsor_date);
