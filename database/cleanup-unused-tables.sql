-- Database Cleanup Script for StartupOps
-- This script removes unused tables, views, functions, and triggers
-- Run this in your Supabase SQL Editor to clean up your database

-- ============================================
-- STEP 1: Drop unused views
-- ============================================

DROP VIEW IF EXISTS chatbot_summary;
DROP VIEW IF EXISTS daily_page_views;
DROP VIEW IF EXISTS popular_services;
DROP VIEW IF EXISTS contact_submissions_summary;

-- ============================================
-- STEP 2: Drop unused triggers
-- ============================================

DROP TRIGGER IF EXISTS contact_submission_lead_score ON contact_submissions;

-- ============================================
-- STEP 3: Drop unused functions
-- ============================================

DROP FUNCTION IF EXISTS update_lead_score_trigger();
DROP FUNCTION IF EXISTS get_lead_score(UUID);

-- ============================================
-- STEP 4: Drop unused table
-- ============================================

DROP TABLE IF EXISTS service_pricing;

-- ============================================
-- STEP 5: Clean up unused columns from contact_submissions
-- ============================================

-- Remove lead_score column since we removed the function that calculates it
ALTER TABLE contact_submissions DROP COLUMN IF EXISTS lead_score;

-- ============================================
-- VERIFICATION
-- ============================================

-- List all remaining tables (should show 5 tables)
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Expected output:
-- 1. chatbot_analytics
-- 2. chatbot_conversations
-- 3. contact_submissions
-- 4. equity_calculations
-- 5. page_analytics

-- ============================================
-- SUMMARY
-- ============================================

-- ✅ KEPT (5 tables):
--    - contact_submissions (contact form data)
--    - equity_calculations (equity calculator data)
--    - page_analytics (page view tracking)
--    - chatbot_conversations (chatbot messages for future improvements)
--    - chatbot_analytics (chatbot analytics for future improvements)
--
-- ❌ REMOVED:
--    - service_pricing table (not used)
--    - 4 unused views
--    - 2 unused functions
--    - 1 unused trigger
--    - lead_score column (unused)
--
-- 💾 Database is now cleaner and easier to manage!
