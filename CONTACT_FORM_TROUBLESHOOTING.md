# 🔧 Contact Form Troubleshooting Guide

## Issue: Form Not Submitting

If your contact form is not submitting, follow these steps to diagnose and fix the issue.

## Step 1: Check Browser Console

1. **Open your contact page** (`contact.html`)
2. **Open browser console** (Press F12 or Right-click → Inspect → Console tab)
3. **Try submitting the form**
4. **Look for error messages** in the console

### What to Look For:

#### ✅ Good Signs (Form Working):
```
🚀 Form submission started
📝 Form data: {name: "...", contact: "...", ...}
📤 Submitting to Supabase...
✅ Supabase client initialized successfully
📥 Supabase response: {success: true, ...}
✅ Form submitted successfully
```

#### ❌ Error Signs:

**Error 1: "StartupOpsDB not initialized"**
```
❌ StartupOpsDB not initialized
```
**Solution:** Refresh the page. Supabase library may not have loaded yet.

**Error 2: "Supabase client not initialized"**
```
❌ Supabase library not loaded
```
**Solution:** Check your internet connection. The Supabase CDN may be blocked.

**Error 3: Stage constraint violation**
```
❌ new row for relation "contact_submissions" violates check constraint "contact_submissions_stage_check"
```
**Solution:** Run the fix script (see Step 2 below)

**Error 4: "Failed to fetch"**
```
❌ Failed to fetch
```
**Solution:** Check your Supabase URL and Anon Key in `js/supabase-client.js`

## Step 2: Fix Database Constraint (If Needed)

If you see a "stage constraint" error, your database needs to be updated:

### Option A: Run Fix Script
1. **Go to Supabase Dashboard** → SQL Editor
2. **Copy and paste** contents of `database/fix-contact-form.sql`
3. **Click "Run"**
4. **Verify** you see: "✅ Fix successful!"

### Option B: Use Simplified Schema
If you haven't set up your database yet:
1. **Go to Supabase Dashboard** → SQL Editor
2. **Copy and paste** contents of `database/schema-simplified.sql`
3. **Click "Run"**
4. This creates all tables with correct constraints

## Step 3: Verify Supabase Configuration

Check that your Supabase credentials are correct:

### File: `js/supabase-client.js`

```javascript
const SUPABASE_URL = 'https://zfmwccsfbakvbyeycpys.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

**Verify:**
1. URL starts with `https://`
2. URL ends with `.supabase.co`
3. Anon Key is the long JWT token (starts with `eyJ`)
4. These match your Supabase project (Settings → API)

## Step 4: Check Table Exists

1. **Go to Supabase Dashboard** → Table Editor
2. **Look for** `contact_submissions` table
3. **If missing:** Run `database/schema-simplified.sql`

## Step 5: Check RLS Policies

1. **Go to Supabase Dashboard** → Authentication → Policies
2. **Find** `contact_submissions` table
3. **Verify policy exists:** "Anyone can submit contact forms"
4. **Policy should allow:** INSERT for all users

## Step 6: Test Form Manually

Try submitting with these test values:

- **Name:** Test User
- **Email:** test@example.com
- **Subject:** Testing form
- **Message:** This is a test message

**Expected Result:**
- Button shows "Sending..."
- Success modal appears
- Form resets
- Data appears in Supabase Table Editor

## Common Issues & Solutions

### Issue 1: Button Stays "Sending..." Forever

**Cause:** JavaScript error or network timeout

**Solution:**
1. Check browser console for errors
2. Check internet connection
3. Verify Supabase URL is correct
4. Try refreshing the page

### Issue 2: No Success Modal Appears

**Cause:** Form submitted but modal function failed

**Solution:**
1. Check if data appears in Supabase Table Editor
2. If data is there, form is working (modal is cosmetic)
3. Check browser console for JavaScript errors

### Issue 3: "Database connection not ready"

**Cause:** Supabase client not initialized

**Solution:**
1. Refresh the page
2. Check if Supabase CDN is loading (Network tab in DevTools)
3. Check for ad blockers or firewall blocking Supabase
4. Try different browser

### Issue 4: Form Submits But No Data in Database

**Cause:** RLS policy blocking inserts

**Solution:**
1. Go to Supabase → Authentication → Policies
2. Check `contact_submissions` table has INSERT policy
3. Run `database/schema-simplified.sql` to recreate policies

### Issue 5: CORS Error

**Cause:** Domain not allowed in Supabase

**Solution:**
1. Go to Supabase → Settings → API
2. Add your domain to allowed origins
3. For local testing, add `http://localhost:*`

## Debug Checklist

Use this checklist to systematically debug:

- [ ] Browser console shows no errors
- [ ] Supabase URL and Anon Key are correct
- [ ] `contact_submissions` table exists in Supabase
- [ ] Table has correct columns (name, contact, stage, services, message)
- [ ] Stage constraint includes 'General Inquiry'
- [ ] RLS policy allows INSERT for public users
- [ ] Internet connection is working
- [ ] No ad blockers or firewalls blocking Supabase
- [ ] Supabase CDN is loading (check Network tab)
- [ ] Form fields are filled correctly
- [ ] Button changes to "Sending..." when clicked

## Still Not Working?

### Get Detailed Logs:

1. **Open browser console** (F12)
2. **Submit the form**
3. **Copy all console output**
4. **Check for:**
   - Red error messages
   - Failed network requests
   - JavaScript errors

### Manual Test in Supabase:

Try inserting data directly in Supabase SQL Editor:

```sql
INSERT INTO contact_submissions (name, contact, stage, services, message)
VALUES ('Test User', 'test@example.com', 'General Inquiry', 'Test Subject', 'Test Message');
```

**If this works:** Problem is in frontend code
**If this fails:** Problem is in database schema

### Contact Support:

If nothing works, provide these details:
1. Browser console output (full log)
2. Supabase project region
3. Error messages from SQL Editor
4. Screenshot of Table Editor showing tables

## Quick Fixes Summary

| Problem | Quick Fix |
|---------|-----------|
| Stage constraint error | Run `database/fix-contact-form.sql` |
| Table doesn't exist | Run `database/schema-simplified.sql` |
| Supabase not initialized | Refresh page |
| Wrong credentials | Update `js/supabase-client.js` |
| No RLS policy | Run `database/schema-simplified.sql` |
| CORS error | Add domain in Supabase settings |

---

**Most Common Issue:** Database constraint doesn't include 'General Inquiry'
**Quick Fix:** Run `database/fix-contact-form.sql` in Supabase SQL Editor

**Need Help?** Check browser console first - it will tell you exactly what's wrong! 🔍
