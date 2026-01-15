-- StartupOps Database Schema for Supabase
-- Run these commands in your Supabase SQL Editor

-- 1. Contact Submissions Table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  stage TEXT NOT NULL CHECK (stage IN ('student', 'bootstrapped', 'funded', 'msme')),
  services TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'closed')),
  notes TEXT,
  follow_up_date DATE,
  lead_score INTEGER DEFAULT 0,
  source TEXT DEFAULT 'website'
);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policies for contact_submissions
CREATE POLICY "Anyone can submit contact forms" ON contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only authenticated users can read submissions" ON contact_submissions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update submissions" ON contact_submissions
  FOR UPDATE USING (auth.role() = 'authenticated');

-- 2. Equity Calculations Table
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

-- Policies for equity_calculations
CREATE POLICY "Anyone can save calculations" ON equity_calculations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only authenticated users can read calculations" ON equity_calculations
  FOR SELECT USING (auth.role() = 'authenticated');

-- 3. Page Analytics Table
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

-- Policies for page_analytics
CREATE POLICY "Anyone can log page views" ON page_analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only authenticated users can read analytics" ON page_analytics
  FOR SELECT USING (auth.role() = 'authenticated');

-- 4. Service Pricing Table (for easy management)
CREATE TABLE IF NOT EXISTS service_pricing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_key TEXT UNIQUE NOT NULL,
  service_name TEXT NOT NULL,
  market_price INTEGER NOT NULL,
  description TEXT,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE service_pricing ENABLE ROW LEVEL SECURITY;

-- Policies for service_pricing
CREATE POLICY "Anyone can read active services" ON service_pricing
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only authenticated users can manage services" ON service_pricing
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default service pricing
INSERT INTO service_pricing (service_key, service_name, market_price, description, category) VALUES
('branding', 'Branding & Strategy', 60000, 'Complete brand identity and strategy development', 'strategy'),
('pitchdeck', 'Pitch Deck Design', 30000, 'Professional investor pitch deck creation', 'strategy'),
('website', 'Website Development', 80000, 'Professional website development', 'technology'),
('mvp', 'MVP Development', 200000, 'Minimum viable product development', 'technology'),
('mobileapp', 'Mobile App (Hybrid)', 350000, 'Cross-platform mobile application', 'technology'),
('uiux', 'UI/UX Design', 70000, 'User interface and experience design', 'design'),
('legal', 'Legal Documentation', 25000, 'Business registration and legal setup', 'legal'),
('marketing', 'Marketing Setup', 40000, 'Digital marketing strategy and setup', 'marketing')
ON CONFLICT (service_key) DO NOTHING;

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_equity_calculations_created_at ON equity_calculations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_equity_calculations_stage ON equity_calculations(startup_stage);
CREATE INDEX IF NOT EXISTS idx_page_analytics_created_at ON page_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_analytics_page_path ON page_analytics(page_path);

-- 6. Create views for analytics
CREATE OR REPLACE VIEW contact_submissions_summary AS
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_submissions,
  COUNT(CASE WHEN status = 'new' THEN 1 END) as new_submissions,
  COUNT(CASE WHEN status = 'qualified' THEN 1 END) as qualified_leads,
  COUNT(CASE WHEN status = 'converted' THEN 1 END) as conversions
FROM contact_submissions
GROUP BY DATE(created_at)
ORDER BY date DESC;

CREATE OR REPLACE VIEW popular_services AS
SELECT 
  service_key,
  service_name,
  COUNT(*) as calculation_count,
  AVG(equity_percent) as avg_equity_percent,
  AVG(project_value) as avg_project_value
FROM equity_calculations ec
JOIN service_pricing sp ON sp.service_key = ANY(
  SELECT jsonb_array_elements_text(ec.selected_services)
)
GROUP BY service_key, service_name
ORDER BY calculation_count DESC;

CREATE OR REPLACE VIEW daily_page_views AS
SELECT 
  DATE(created_at) as date,
  page_path,
  COUNT(*) as views,
  COUNT(DISTINCT session_id) as unique_sessions
FROM page_analytics
GROUP BY DATE(created_at), page_path
ORDER BY date DESC, views DESC;

-- Grant permissions for views
GRANT SELECT ON contact_submissions_summary TO authenticated;
GRANT SELECT ON popular_services TO authenticated;
GRANT SELECT ON daily_page_views TO authenticated;

-- 7. Functions for common operations
CREATE OR REPLACE FUNCTION get_lead_score(submission_id UUID)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
  submission_record contact_submissions%ROWTYPE;
BEGIN
  SELECT * INTO submission_record FROM contact_submissions WHERE id = submission_id;
  
  -- Base score
  score := 10;
  
  -- Stage scoring
  CASE submission_record.stage
    WHEN 'student' THEN score := score + 20;
    WHEN 'bootstrapped' THEN score := score + 30;
    WHEN 'funded' THEN score := score + 15;
    WHEN 'msme' THEN score := score + 25;
  END CASE;
  
  -- Services scoring (more services = higher intent)
  IF LENGTH(submission_record.services) > 50 THEN
    score := score + 20;
  ELSIF LENGTH(submission_record.services) > 20 THEN
    score := score + 10;
  END IF;
  
  -- Message scoring (detailed message = higher intent)
  IF LENGTH(COALESCE(submission_record.message, '')) > 100 THEN
    score := score + 15;
  ELSIF LENGTH(COALESCE(submission_record.message, '')) > 20 THEN
    score := score + 5;
  END IF;
  
  RETURN LEAST(score, 100); -- Cap at 100
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update lead scores for existing submissions
UPDATE contact_submissions 
SET lead_score = get_lead_score(id) 
WHERE lead_score = 0;

-- 8. Triggers for automatic updates
CREATE OR REPLACE FUNCTION update_lead_score_trigger()
RETURNS TRIGGER AS $$
BEGIN
  NEW.lead_score := get_lead_score(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contact_submission_lead_score
  BEFORE INSERT ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_lead_score_trigger();

-- 9. Real-time subscriptions (enable for admin dashboard)
-- Uncomment these if you want real-time updates in admin dashboard
-- ALTER PUBLICATION supabase_realtime ADD TABLE contact_submissions;
-- ALTER PUBLICATION supabase_realtime ADD TABLE equity_calculations;
-- ALTER PUBLICATION supabase_realtime ADD TABLE page_analytics;

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