-- StartupOps Simplified Database Schema for Supabase
-- This is a clean, minimal schema with only the tables you actually use
-- Run these commands in your Supabase SQL Editor

-- ============================================
-- 1. Contact Submissions Table
-- ============================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  stage TEXT NOT NULL CHECK (stage IN ('student', 'bootstrapped', 'funded', 'msme', 'General Inquiry')),
  services TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'closed')),
  notes TEXT,
  follow_up_date DATE,
  source TEXT DEFAULT 'website'
);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can submit contact forms" ON contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only authenticated users can read submissions" ON contact_submissions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update submissions" ON contact_submissions
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);

-- ============================================
-- 2. Equity Calculations Table
-- ============================================
CREATE TABLE IF NOT EXISTS equity_calculations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  selected_services JSONB NOT NULL,
  cash_contribution INTEGER NOT NULL CHECK (cash_contribution >= 0 AND cash_contribution <= 100),
  startup_stage TEXT NOT NULL CHECK (startup_stage IN ('student', 'bootstrapped', 'funded', 'msme')),
  growth_score INTEGER NOT NULL CHECK (growth_score >= 1 AND growth_score <= 5),
  project_value INTEGER NOT NULL,
  discounted_price INTEGER NOT NULL,
  cash_paid INTEGER NOT NULL,
  equity_percent DECIMAL(4,2) NOT NULL CHECK (equity_percent >= 0 AND equity_percent <= 100),
  recommended_model TEXT NOT NULL,
  user_contact TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE equity_calculations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can save calculations" ON equity_calculations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only authenticated users can read calculations" ON equity_calculations
  FOR SELECT USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_equity_calculations_created_at ON equity_calculations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_equity_calculations_stage ON equity_calculations(startup_stage);

-- ============================================
-- 3. Page Analytics Table
-- ============================================
CREATE TABLE IF NOT EXISTS page_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  page_title TEXT,
  user_agent TEXT,
  referrer TEXT,
  session_id TEXT,
  ip_address INET,
  country TEXT,
  device_type TEXT,
  browser TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can log page views" ON page_analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only authenticated users can read analytics" ON page_analytics
  FOR SELECT USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_page_analytics_created_at ON page_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_analytics_page_path ON page_analytics(page_path);

-- ============================================
-- 4. Chatbot Conversations Table
-- ============================================
CREATE TABLE IF NOT EXISTS chatbot_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  visitor_id TEXT,
  user_message TEXT NOT NULL,
  bot_response TEXT NOT NULL,
  intent_detected TEXT,
  lead_score INTEGER DEFAULT 0,
  user_info JSONB DEFAULT '{}',
  is_qualified_lead BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can save chat messages" ON chatbot_conversations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only authenticated users can read conversations" ON chatbot_conversations
  FOR SELECT USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_session_id ON chatbot_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_created_at ON chatbot_conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_qualified ON chatbot_conversations(is_qualified_lead);

-- ============================================
-- 5. Chatbot Analytics Table
-- ============================================
CREATE TABLE IF NOT EXISTS chatbot_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  total_messages INTEGER DEFAULT 0,
  conversation_duration INTEGER DEFAULT 0, -- in seconds
  intents_discussed TEXT[] DEFAULT '{}',
  lead_score INTEGER DEFAULT 0,
  conversion_action TEXT, -- 'contact_form', 'equity_calculator', 'call_scheduled', etc.
  user_info JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE chatbot_analytics ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can update chat analytics" ON chatbot_analytics
  FOR ALL WITH CHECK (true);

CREATE POLICY "Only authenticated users can read chat analytics" ON chatbot_analytics
  FOR SELECT USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_chatbot_analytics_session_id ON chatbot_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_analytics_lead_score ON chatbot_analytics(lead_score DESC);

-- ============================================
-- SUMMARY
-- ============================================

-- ✅ 5 Essential Tables Created:
--    1. contact_submissions - Stores contact form submissions
--    2. equity_calculations - Stores equity calculator results
--    3. page_analytics - Tracks page views and user behavior
--    4. chatbot_conversations - Stores chatbot messages for future improvements
--    5. chatbot_analytics - Tracks chatbot session analytics
--
-- 🔒 All tables have Row Level Security enabled
-- 📊 All tables have proper indexes for performance
-- 🚀 Database is clean, minimal, and ready to use!
