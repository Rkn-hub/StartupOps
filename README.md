# StartupOps Website

A modern, responsive website for StartupOps - India's first hybrid Startup Studio-as-a-Service.

## 🚀 Features

- **Responsive Design**: Mobile-first design with glassmorphism effects
- **Supabase Integration**: Backend database for contact forms, equity calculations, and analytics
- **Smart Chatbot**: AI-powered chatbot with lead capture and scoring
- **Equity Calculator**: Interactive calculator with accurate business logic
- **Email Notifications**: Zapier integration for instant notifications
- **Admin Dashboard**: Real-time analytics and lead management

## 📁 Project Structure

```
StartupOps/
├── index.html              # Home page
├── about.html              # About page
├── services.html           # Services page
├── portfolio.html          # Portfolio page
├── how-it-works.html       # Process page
├── contact.html            # Contact page
├── equity-calculator.html  # Equity calculator
├── chatbot.html           # Chatbot interface
├── chatbot-admin.html     # Admin dashboard
├── js/
│   ├── config.js          # Configuration
│   ├── supabase-client.js # Database integration
│   ├── equity-calculator-new.js
│   ├── smart-chatbot.js
│   └── email-notifications.js
├── database/
│   └── schema.sql         # Supabase database schema
└── wrangler.jsonc         # Cloudflare Pages config
```

## 🛠️ Setup

### 1. Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `database/schema.sql` in your Supabase SQL Editor
3. Update credentials in `js/supabase-client.js` and `js/config.js`

See `SUPABASE_SETUP_GUIDE.md` for detailed instructions.

### 2. Email Notifications (Optional)

1. Create a Zapier account
2. Set up a webhook trigger
3. Update webhook URL in `js/email-notifications.js`

See `ZAPIER_SETUP_QUICK_GUIDE.md` for detailed instructions.

## 🌐 Deployment

### Cloudflare Pages

This project is configured for Cloudflare Pages deployment:

1. Connect your GitHub repository to Cloudflare Pages
2. Build settings:
   - **Build command**: Leave empty (static site)
   - **Build output directory**: `/` (root)
   - **Deploy command**: `npx wrangler deploy`

The `wrangler.jsonc` file is already configured for deployment.

### Alternative: GitHub Pages

1. Go to repository Settings → Pages
2. Select "main" branch
3. Your site will be live at: `https://rkn-hub.github.io/StartupOps/`

## 📝 Configuration

### Contact Information
- Email: startup.ops.co@gmail.com
- Phone: +91 9315158312

### Supabase
- Project URL: `https://zfmwccsfbakvbyeycpys.supabase.co`
- Update credentials in `js/supabase-client.js`

## 🎨 Design

- **Colors**: Dark theme with teal accent (#64FFDA)
- **Fonts**: Poppins (headings), Inter (body)
- **Framework**: Tailwind CSS (CDN)
- **Icons**: Material Symbols

## 📊 Features Breakdown

### Pages
- ✅ Standardized hero sections across all pages
- ✅ Responsive navigation with mobile menu
- ✅ Glassmorphism effects and modern UI
- ✅ Fixed text contrast for accessibility
- ✅ No horizontal scroll issues

### Backend
- ✅ Contact form submissions → Supabase
- ✅ Equity calculations → Supabase
- ✅ Chatbot conversations → Supabase
- ✅ Page analytics tracking
- ✅ Lead scoring system

### Integrations
- ✅ Supabase (Database)
- ✅ Zapier (Email notifications)
- ✅ Tailwind CSS (Styling)
- ✅ Material Icons (Icons)

## 🔒 Security

- Row Level Security (RLS) enabled on all Supabase tables
- Anonymous users can only insert data
- Authenticated users required for reading/updating data
- API keys are public (anon key) - safe for client-side use

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

This is a private project for StartupOps. For any issues or suggestions, contact the development team.

## 📄 License

© 2024 StartupOps. All rights reserved.

---

**Built with ❤️ for India's next-generation founders**
