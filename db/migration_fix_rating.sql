-- ============================================
-- 修复不可思议指数: 从百分制(60-98)转换为5分制(1-5)
-- 请在 Supabase SQL Editor 中执行
-- ============================================

-- 将所有大于5的 impossible_index 值转换为5分制
-- 转换公式: 旧值 / 20 (例如 98 -> 4.9, 85 -> 4.25, 75 -> 3.75)
UPDATE dreams 
SET impossible_index = ROUND((impossible_index / 20.0)::numeric, 2)
WHERE impossible_index > 5;
