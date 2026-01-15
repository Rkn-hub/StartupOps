# 🚀 Supabase Native Email Notifications

## Why Use Supabase Native?
✅ **No external dependencies** (no Zapier needed)  
✅ **More secure** (server-side processing)  
✅ **Faster** (direct integration)  
✅ **Free** (included in Supabase plan)  
✅ **More reliable** (no third-party failures)  

## Option 1: Supabase Edge Functions + Resend

### Step 1: Create Edge Function
```sql
-- Create the edge function
create or replace function send_contact_notification()
returns trigger as $$
begin
  -- Call edge function to send email
  perform
    net.http_post(
      url := 'https://zfmwccsfbakvbyeycpys.supabase.co/functions/v1/send-email',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.jwt_token') || '"}'::jsonb,
      body := json_build_object(
        'to', 'startup.ops.co@gmail.com',
        'subject', '🚀 New Contact - ' || new.name,
        'html', '<h2>New Contact Form Submission</h2>
                 <p><strong>Name:</strong> ' || new.name || '</p>
                 <p><strong>Email:</strong> ' || new.contact || '</p>
                 <p><strong>Stage:</strong> ' || new.stage || '</p>
                 <p><strong>Services:</strong> ' || new.services || '</p>
                 <p><strong>Message:</strong> ' || new.message || '</p>
                 <p><strong>Submitted:</strong> ' || new.created_at || '</p>'
      )::jsonb
    );
  
  return new;
end;
$$ language plpgsql;

-- Create trigger
create trigger contact_notification_trigger
  after insert on contact_submissions
  for each row execute function send_contact_notification();
```

### Step 2: Create Edge Function File
Create `supabase/functions/send-email/index.ts`:
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  const { to, subject, html } = await req.json()

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'StartupOps <noreply@yourdomain.com>',
      to: [to],
      subject: subject,
      html: html,
    }),
  })

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

## Option 2: Database Webhooks (Easiest)

### Step 1: Enable Webhooks in Supabase
1. Go to Supabase Dashboard → Database → Webhooks
2. Create new webhook:
   - **Table**: contact_submissions
   - **Events**: INSERT
   - **URL**: Your webhook endpoint

### Step 2: Use Supabase + Resend
```javascript
// In your contact form submission
const { data, error } = await supabase
  .from('contact_submissions')
  .insert([formData])

// Webhook automatically triggers email via Supabase
```

## Option 3: Real-time Subscriptions

```javascript
// Listen for new contacts in real-time
const subscription = supabase
  .channel('contact_submissions')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'contact_submissions' },
    (payload) => {
      // Send email notification
      sendEmailNotification(payload.new)
    }
  )
  .subscribe()
```

## 🎯 Recommended: Database Webhooks

**Pros:**
- ✅ No code changes needed
- ✅ Automatic email sending
- ✅ Built into Supabase
- ✅ More reliable than client-side

**Setup:**
1. Supabase Dashboard → Database → Webhooks
2. Point to email service (Resend/SendGrid)
3. Done!

## 💰 Cost Comparison

| Method | Cost | Reliability | Setup Time |
|--------|------|-------------|------------|
| **Supabase Webhooks** | Free | ⭐⭐⭐⭐⭐ | 5 min |
| Zapier | $20/month | ⭐⭐⭐⭐ | 5 min |
| EmailJS | Free | ⭐⭐⭐ | 10 min |

## 🚀 Want me to set up Supabase native notifications?

I can implement the webhook approach right now - it'll be:
- ✅ Completely free
- ✅ More reliable
- ✅ No external dependencies
- ✅ Automatic email sending

Would you like me to switch to the Supabase native approach?