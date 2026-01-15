# Supabase Integration for StartupOps

## 🎯 Project Overview
Integrating Supabase as the backend for StartupOps website to handle:
- Contact form submissions
- Equity calculator data storage
- Lead management and analytics
- Future user authentication and admin panel

## 📋 Phase 1: Initial Setup & Contact Forms

### 1. Supabase Project Setup
1. Go to [supabase.com](https://supabase.com)
2. Create new project: "startupops-website"
3. Choose region closest to your users (India: ap-south-1)
4. Note down your project credentials:
   - Project URL
   - Anon Public Key
   - Service Role Key (keep secret)

### 2. Database Schema

#### Table: `contact_submissions`
```sql
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  stage TEXT NOT NULL,
  services TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'new',
  notes TEXT
);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy for inserting (public can submit)
CREATE POLICY "Anyone can submit contact forms" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Policy for reading (only authenticated users)
CREATE POLICY "Only authenticated users can read submissions" ON contact_submissions
  FOR SELECT USING (auth.role() = 'authenticated');
```

#### Table: `equity_calculations`
```sql
CREATE TABLE equity_calculations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  selected_services JSONB NOT NULL,
  cash_contribution INTEGER NOT NULL,
  startup_stage TEXT NOT NULL,
  growth_score INTEGER NOT NULL,
  project_value INTEGER NOT NULL,
  discounted_price INTEGER NOT NULL,
  cash_paid INTEGER NOT NULL,
  equity_percent DECIMAL(4,2) NOT NULL,
  recommended_model TEXT NOT NULL,
  user_contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE equity_calculations ENABLE ROW LEVEL SECURITY;

-- Policy for inserting
CREATE POLICY "Anyone can save calculations" ON equity_calculations
  FOR INSERT WITH CHECK (true);
```

#### Table: `page_analytics`
```sql
CREATE TABLE page_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;

-- Policy for inserting
CREATE POLICY "Anyone can log page views" ON page_analytics
  FOR INSERT WITH CHECK (true);
```

### 3. Environment Configuration

Create `.env` file (add to .gitignore):
```env
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
```

### 4. JavaScript Integration

#### Supabase Client Setup
```javascript
// supabase-client.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)
```

## 📋 Phase 2: Implementation Files

### Contact Form Integration
- Update contact.html with Supabase form submission
- Add success/error handling
- Email notifications via Supabase Edge Functions

### Equity Calculator Integration  
- Save calculation results to database
- Optional: Allow users to save and retrieve calculations
- Analytics on popular service combinations

### Analytics Integration
- Page view tracking
- Form conversion tracking
- User journey analytics

## 📋 Phase 3: Advanced Features

### Admin Dashboard
- View and manage contact submissions
- Analytics dashboard
- Lead scoring and follow-up tracking

### Email Automation
- Welcome emails for new contacts
- Follow-up sequences
- Equity calculation reports

### User Features
- Save equity calculations
- Request quotes directly
- Project collaboration portal

## 🔧 Next Steps
1. Set up Supabase project
2. Create database tables
3. Implement contact form integration
4. Add equity calculator data storage
5. Set up basic analytics
6. Create admin dashboard

## 📚 Resources
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)