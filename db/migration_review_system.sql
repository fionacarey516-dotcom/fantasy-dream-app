-- ============================================
-- Migration: Add Dream Review/Status System
-- ============================================
-- Run this in Supabase SQL Editor

-- 1. Add status column to dreams table
ALTER TABLE dreams 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'approved';

-- 2. Update existing records to be approved (already public)
UPDATE dreams SET status = 'approved' WHERE status IS NULL OR status = 'approved';

-- 3. Add index for status filtering
CREATE INDEX IF NOT EXISTS idx_dreams_status ON dreams(status);

-- 4. Add comment for documentation
COMMENT ON COLUMN dreams.status IS 'pending = awaiting admin review, approved = public, rejected = rejected by admin';
