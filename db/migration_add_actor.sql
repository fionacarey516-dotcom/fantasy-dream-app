-- 给 notifications 表添加 actor_id (操作者) 列
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS actor_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_actor ON notifications(actor_id);
