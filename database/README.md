# 📊 Database Documentation

This folder contains all database-related files for the StartupOps website.

## Files Overview

### 1. `schema-simplified.sql` ⭐ RECOMMENDED
**Use this for new setups!**

Creates a clean, minimal database with only the 5 tables you actually use:
- `contact_submissions` - Contact form data
- `equity_calculations` - Equity calculator results  
- `page_analytics` - Page view tracking
- `chatbot_conversations` - Chatbot messages (for future improvements)
- `chatbot_analytics` - Chatbot session analytics (for future improvements)

**Why use this?**
- ✅ Clean and simple
- ✅ Only what you need
- ✅ Easy to understand
- ✅ Ready for chatbot improvements
- ✅ No unused clutter

### 2. `cleanup-unused-tables.sql`
**Use this if you already ran the full schema**

Removes unused tables, views, functions, and triggers:
- Drops `service_pricing` table (not used)
- Drops 4 unused views
- Drops 2 unused functions
- Drops 1 unused trigger
- Removes `lead_score` column (unused)

**When to use:**
- You already have the full schema running
- You want to clean up your database
- You want to simplify your setup

### 3. `schema.sql` (Original)
**Legacy file - not recommended for new setups**

Creates the full database with extra tables and features:
- All 5 essential tables
- `service_pricing` table (not used in your code)
- 4 analytics views (not used)
- Lead scoring functions (not used)
- Triggers (not used)

**Why not use this?**
- ❌ Creates unused tables
- ❌ More complex than needed
- ❌ Harder to maintain
- ❌ Includes features you don't use

## Quick Start

### For New Projects:
```sql
-- Run this in Supabase SQL Editor
-- Copy and paste contents of schema-simplified.sql
```

### For Existing Projects:
```sql
-- Run this in Supabase SQL Editor
-- Copy and paste contents of cleanup-unused-tables.sql
```

## Database Structure

### Tables You're Using (5):

#### 1. contact_submissions
**Purpose:** Store contact form submissions

**Columns:**
- `id` - Unique identifier
- `name` - Contact name
- `contact` - Email address
- `stage` - Startup stage (student, bootstrapped, funded, msme, General Inquiry)
- `services` - Subject/services interested in
- `message` - Message content
- `status` - Lead status (new, contacted, qualified, converted, closed)
- `notes` - Admin notes
- `follow_up_date` - Follow-up date
- `source` - Source (default: website)
- `created_at` - Timestamp

**Used by:** `contact.html`

#### 2. equity_calculations
**Purpose:** Store equity calculator results

**Columns:**
- `id` - Unique identifier
- `selected_services` - Services selected (JSONB)
- `cash_contribution` - Cash percentage (0-100)
- `startup_stage` - Stage (student, bootstrapped, funded, msme)
- `growth_score` - Growth potential (1-5)
- `project_value` - Total project value
- `discounted_price` - Discounted price
- `cash_paid` - Cash amount paid
- `equity_percent` - Equity percentage (0-100)
- `recommended_model` - Recommended model
- `user_contact` - User email (optional)
- `ip_address` - IP address
- `user_agent` - Browser info
- `created_at` - Timestamp

**Used by:** `equity-calculator.html`

#### 3. page_analytics
**Purpose:** Track page views and user behavior

**Columns:**
- `id` - Unique identifier
- `page_path` - Page URL path
- `page_title` - Page title
- `user_agent` - Browser info
- `referrer` - Referrer URL
- `session_id` - Session identifier
- `ip_address` - IP address
- `country` - Country (optional)
- `device_type` - Device type (optional)
- `browser` - Browser name (optional)
- `created_at` - Timestamp

**Used by:** All pages (auto-tracking via `js/supabase-client.js`)

#### 4. chatbot_conversations
**Purpose:** Store chatbot messages for future improvements

**Columns:**
- `id` - Unique identifier
- `session_id` - Chat session ID
- `visitor_id` - Visitor identifier
- `user_message` - User's message
- `bot_response` - Bot's response
- `intent_detected` - Detected intent
- `lead_score` - Lead quality score
- `user_info` - User information (JSONB)
- `is_qualified_lead` - Qualified lead flag
- `created_at` - Timestamp

**Used by:** Future chatbot improvements

#### 5. chatbot_analytics
**Purpose:** Track chatbot session analytics

**Columns:**
- `id` - Unique identifier
- `session_id` - Chat session ID (unique)
- `total_messages` - Message count
- `conversation_duration` - Duration in seconds
- `intents_discussed` - Array of intents
- `lead_score` - Lead quality score
- `conversion_action` - Conversion type
- `user_info` - User information (JSONB)
- `created_at` - Created timestamp
- `updated_at` - Updated timestamp

**Used by:** Future chatbot analytics

## Security (Row Level Security)

All tables have RLS enabled with these policies:

### Public Users (Unauthenticated):
- ✅ Can INSERT data (submit forms, save calculations)
- ❌ Cannot READ data
- ❌ Cannot UPDATE data
- ❌ Cannot DELETE data

### Authenticated Users (Admin):
- ✅ Can READ all data
- ✅ Can UPDATE data
- ✅ Can DELETE data (if needed)

## Indexes

Performance indexes are created on:
- `created_at` columns (for sorting by date)
- `status` column (for filtering leads)
- `session_id` columns (for chatbot queries)
- `page_path` column (for analytics)

## Future Improvements

### Chatbot Tables Ready For:
1. **Conversation History** - Store all chat messages
2. **Intent Detection** - Track what users are asking about
3. **Lead Scoring** - Identify high-quality leads
4. **Learning System** - Improve responses over time
5. **Analytics Dashboard** - Visualize chatbot performance

### Potential Additions:
- User authentication tables (when needed)
- Admin user management (when needed)
- File uploads table (when needed)
- Notification preferences (when needed)

## Maintenance

### Regular Tasks:
1. **Monitor database size** in Supabase dashboard
2. **Review old data** and archive if needed
3. **Check query performance** in Supabase logs
4. **Update RLS policies** as requirements change

### Backup Strategy:
1. Supabase provides automatic backups
2. Export important data regularly via Table Editor
3. Keep SQL schema files in version control

## Support

For database-related questions:
- Check [Supabase Documentation](https://supabase.com/docs)
- Join [Supabase Discord](https://discord.supabase.com)
- Review SQL files in this folder

---

**Keep it simple! Only add tables when you actually need them. 🚀**
