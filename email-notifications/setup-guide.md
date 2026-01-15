# 📧 Email Notifications Setup for StartupOps

## 🎯 Goal
Get email notifications at **startup.ops.co@gmail.com** when:
- Someone submits the contact form
- Someone uses the equity calculator
- New leads are generated

## 🚀 **QUICK SETUP (5 minutes) - Zapier**

### Step 1: Create Zapier Webhook
1. Go to [zapier.com](https://zapier.com) → Create Zap
2. **Trigger**: Webhooks by Zapier → Catch Hook
3. **Copy webhook URL** (save this!)
4. **Action**: Gmail → Send Email
5. **To**: startup.ops.co@gmail.com
6. **Subject**: 🚀 New Contact - {{name}} ({{subject}})
7. **Body**: Use the template below

### Step 2: Update Website
1. Open `js/email-notifications.js`
2. Replace `ZAPIER_WEBHOOK_URL` with your webhook URL
3. Save and test!

### Email Template for Zapier:
```
New contact form submission:

👤 Name: {{name}}
📧 Email: {{email}}  
📋 Subject: {{subject}}
💬 Message: {{message}}

⏰ Time: {{formatted_timestamp}}
📊 Lead Score: {{lead_score}}/100

---
Reply directly to respond to the lead.
```

**✅ DONE! You'll now get instant email notifications.**

---

## 🔧 Alternative Setup Options

### **Option 1: Supabase Edge Functions (Advanced)**
**Pros**: Native integration, secure, scalable
**Cons**: Requires more setup

### **Option 2: EmailJS (Free)**
**Pros**: Completely free, client-side
**Cons**: Less secure, limited features

## 📝 **EmailJS Setup (Free Alternative)**

### Step 1: Create EmailJS Account
1. Go to [emailjs.com](https://emailjs.com)
2. Sign up and create service
3. Connect your Gmail account

### Step 2: Create Email Template
1. Create template with form fields
2. Set recipient to startup.ops.co@gmail.com

### Step 3: Update Website
```javascript
// Add EmailJS to contact.html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

// In form submission
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
    to_email: 'startup.ops.co@gmail.com',
    from_name: formData.name,
    from_email: formData.contact,
    message: formData.message,
    stage: formData.stage,
    services: formData.services
});
```

## 📊 **What You'll Get**

### Immediate Notifications:
- ✅ Email when contact form submitted
- ✅ Lead details in email
- ✅ Direct link to Supabase dashboard
- ✅ Mobile notifications (Gmail app)

### Optional Advanced Features:
- 📧 Auto-reply to leads
- 📊 Weekly summary emails
- 🔔 Slack/Discord notifications
- 📈 Lead scoring alerts

## 🎯 **Recommended: Use Zapier**

**Why Zapier?**
- ✅ 5-minute setup
- ✅ Most reliable
- ✅ Free tier (100 tasks/month)
- ✅ No coding required
- ✅ Professional email formatting

**Cost**: Free for 100 notifications/month (perfect for contact forms)

## 🆘 **Need Help?**

See `ZAPIER_SETUP_QUICK_GUIDE.md` for detailed step-by-step instructions.

Let me know which option you prefer and I'll help you set it up! 🚀