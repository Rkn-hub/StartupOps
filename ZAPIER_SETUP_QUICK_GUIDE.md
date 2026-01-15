# 🚀 Quick Zapier Setup for Email Notifications

## ⚡ 5-Minute Setup

### Step 1: Create Zapier Account
1. Go to [zapier.com](https://zapier.com)
2. Sign up with your Google account (startup.ops.co@gmail.com)
3. Click "Create Zap"

### Step 2: Set Up Webhook Trigger
1. **Trigger App**: Search for "Webhooks by Zapier"
2. **Trigger Event**: Select "Catch Hook"
3. **Click Continue**
4. **Copy the webhook URL** (looks like: `https://hooks.zapier.com/hooks/catch/123456/abcdef/`)

### Step 3: Set Up Gmail Action
1. **Action App**: Search for "Gmail"
2. **Action Event**: Select "Send Email"
3. **Connect your Gmail account** (startup.ops.co@gmail.com)
4. **Configure email**:
   - **To**: startup.ops.co@gmail.com
   - **Subject**: 🚀 New Contact Form - {{name}} ({{subject}})
   - **Body**: 
   ```
   New contact form submission from StartupOps website:

   👤 Name: {{name}}
   📧 Email: {{email}}
   📋 Subject: {{subject}}
   💬 Message: {{message}}
   
   ⏰ Submitted: {{formatted_timestamp}}
   📊 Lead Score: {{lead_score}}/100
   
   ---
   Reply directly to this email to respond to the lead.
   
   View in Supabase Dashboard:
   https://supabase.com/dashboard/project/zfmwccsfbakvbyeycpys
   ```

### Step 4: Update Website Code
1. Open `js/email-notifications.js`
2. Replace this line:
   ```javascript
   ZAPIER_WEBHOOK_URL: 'https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_KEY/',
   ```
   With your actual webhook URL from Step 2

### Step 5: Test the Setup
1. **Test in Zapier**: Click "Test trigger" and submit a test form
2. **Test on website**: Fill out the contact form on your website
3. **Check email**: You should receive an email at startup.ops.co@gmail.com

## 🎯 What You'll Get

✅ **Instant email notifications** when someone contacts you  
✅ **Lead scoring** to prioritize responses  
✅ **All form data** organized in the email  
✅ **Direct reply capability** to respond quickly  
✅ **Mobile notifications** via Gmail app  

## 🔧 Advanced Options (Optional)

### Add Auto-Reply
1. Add another action in Zapier
2. **Action App**: Gmail
3. **Action Event**: Send Email
4. **To**: {{email}} (the person who submitted the form)
5. **Subject**: Thanks for contacting StartupOps!
6. **Body**: Auto-reply message

### Add Slack Notifications
1. Add another action
2. **Action App**: Slack
3. Send message to your team channel

## 💰 Cost
- **Free tier**: 100 tasks/month (plenty for contact forms)
- **Paid tier**: $19.99/month for unlimited tasks

## 🆘 Need Help?
If you run into any issues:
1. Check the webhook URL is correctly copied
2. Make sure Gmail account is connected
3. Test the Zap in Zapier dashboard
4. Check browser console for errors

The setup should take less than 5 minutes and you'll start receiving notifications immediately! 🎉