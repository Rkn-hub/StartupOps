-- ========================================
-- CHATBOT ANALYTICS TABLES FOR SUPABASE
-- ========================================
-- Copy and paste this into your Supabase SQL Editor

-- 10. Chatbot Conversations Table
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

-- Policies for chatbot_conversations
CREATE POLICY "Anyone can save chat messages" ON chatbot_conversations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only authenticated users can read conversations" ON chatbot_conversations
  FOR SELECT USING (auth.role() = 'authenticated');

-- 11. Chatbot Analytics Table
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

-- Policies for chatbot_analytics
CREATE POLICY "Anyone can update chat analytics" ON chatbot_analytics
  FOR ALL WITH CHECK (true);

CREATE POLICY "Only authenticated users can read chat analytics" ON chatbot_analytics
  FOR SELECT USING (auth.role() = 'authenticated');

-- Indexes for chatbot tables
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_session_id ON chatbot_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_created_at ON chatbot_conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_qualified ON chatbot_conversations(is_qualified_lead);
CREATE INDEX IF NOT EXISTS idx_chatbot_analytics_session_id ON chatbot_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_analytics_lead_score ON chatbot_analytics(lead_score DESC);

-- Chatbot analytics view
CREATE OR REPLACE VIEW chatbot_summary AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_conversations,
  AVG(total_messages) as avg_messages_per_conversation,
  AVG(conversation_duration) as avg_duration_seconds,
  COUNT(CASE WHEN lead_score >= 50 THEN 1 END) as qualified_leads,
  COUNT(CASE WHEN conversion_action IS NOT NULL THEN 1 END) as conversions
FROM chatbot_analytics
GROUP BY DATE(created_at)
ORDER BY date DESC;

GRANT SELECT ON chatbot_summary TO authenticated;

-- ========================================
-- INSTRUCTIONS:
-- 1. Go to your Supabase Dashboard
-- 2. Navigate to SQL Editor
-- 3. Copy and paste this entire script
-- 4. Click "Run" to execute
-- 5. Chatbot analytics will be enabled!
-- ========================================