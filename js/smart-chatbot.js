// Enhanced Smart Chatbot for StartupOps
// Features: Better keyword matching, Supabase integration, lead capture, self-learning

class SmartChatbot {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.conversationStart = new Date();
        this.messageCount = 0;
        this.leadScore = 0;
        this.userInfo = {};
        this.intentsDiscussed = new Set();
        this.conversationHistory = [];
        
        // Initialize responses with better keyword matching
        this.responses = this.initializeResponses();
        this.keywordMatcher = this.initializeKeywordMatcher();
        
        // Initialize Supabase client
        this.supabase = window.supabase;
    }

    generateSessionId() {
        return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    initializeResponses() {
        return {
            greetings: [
                "Hello! Welcome to StartupOps! 🚀 I'm here to help you turn your startup dreams into reality. What brings you here today?",
                "Hi there! 👋 Great to see you at StartupOps! Whether you're a student founder or seasoned entrepreneur, I'm here to help. What can I tell you about our services?",
                "Welcome to StartupOps! 🌟 Ready to build something amazing? I'm here to guide you through our equity-based partnership model and services. How can I help?"
            ],

            // Enhanced service responses with more details
            services: {
                general: `🛠️ **StartupOps Complete Services:**

🎨 **Strategy & Branding** (₹60,000 or 2-3% equity)
• Logo & brand identity design
• Brand strategy & positioning
• Marketing materials & guidelines

💻 **Technology Development** (₹80,000-₹3.5L or 3-7% equity)
• Website development (₹80,000)
• MVP development (₹2,00,000)
• Mobile apps (₹3,50,000)
• UI/UX design (₹70,000)

⚖️ **Legal & Compliance** (₹25,000 or 1-2% equity)
• Company registration & setup
• Founder agreements & contracts
• IP protection & trademarks

📈 **Marketing & Growth** (₹40,000 or 2-3% equity)
• Digital marketing strategy
• SEO & content marketing
• Social media management
• Performance tracking

🎯 **Mentorship & Advisory** (Included in partnerships)
• 1-on-1 founder mentorship
• Investor connections
• Strategic guidance

**Which area interests you most?**`,

                technology: `💻 **Technology Development Services:**

**🌐 Website Development** (₹80,000 or 3% equity)
• Responsive design for all devices
• SEO-optimized structure
• Content management system
• 3-month support included

**📱 Mobile App Development** (₹3,50,000 or 5-7% equity)
• Cross-platform (iOS + Android)
• Native performance
• App store deployment
• 6-month maintenance

**🚀 MVP Development** (₹2,00,000 or 4-6% equity)
• Rapid prototyping (4-8 weeks)
• Core feature development
• User testing & feedback
• Iteration support

**🎨 UI/UX Design** (₹70,000 or 2-3% equity)
• User research & personas
• Wireframes & prototypes
• Visual design system
• Usability testing

**💡 Which technology solution fits your startup needs?**`,

                marketing: `📈 **Marketing & Growth Services:**

**🎯 Digital Marketing Strategy** (₹40,000 or 2-3% equity)
• Market research & competitor analysis
• Customer persona development
• Multi-channel marketing plan
• KPI tracking & optimization

**🔍 SEO & Content Marketing**
• Keyword research & strategy
• Content calendar & creation
• On-page & technical SEO
• Link building campaigns

**📱 Social Media Management**
• Platform strategy (Instagram, LinkedIn, Twitter)
• Content creation & scheduling
• Community management
• Influencer partnerships

**💰 Paid Advertising**
• Google Ads & Facebook Ads setup
• Campaign optimization
• A/B testing & analytics
• ROI tracking & reporting

**📊 Analytics & Performance**
• Google Analytics setup
• Conversion tracking
• Monthly performance reports
• Growth recommendations

**Which marketing area would help your startup grow fastest?**`,

                legal: `⚖️ **Legal & Compliance Services:**

**🏢 Company Registration** (₹15,000 or 1% equity)
• Private Limited Company setup
• Director KYC & documentation
• PAN, TAN & GST registration
• Bank account opening support

**📋 Founder Agreements** (₹10,000 or 1% equity)
• Equity distribution agreements
• Vesting schedules
• IP assignment agreements
• Non-disclosure agreements

**🛡️ IP Protection** (₹25,000 or 1-2% equity)
• Trademark registration
• Copyright protection
• Patent filing support
• Domain name protection

**📄 Business Contracts** (₹15,000 or 1% equity)
• Terms of service & privacy policy
• Customer agreements
• Vendor contracts
• Employment agreements

**💼 Investment Documentation**
• Shareholder agreements
• Investment term sheets
• Due diligence support
• Compliance management

**What legal aspect of your startup needs immediate attention?**`
            },

            // Enhanced pricing with detailed breakdown
            pricing: {
                general: `💰 **StartupOps Pricing Models:**

🤝 **Equity Partnership (Recommended)**
• **3-7% equity** instead of cash payments
• **No upfront costs** - we invest in your success
• **Aligned incentives** - we grow when you grow
• **Perfect for:** Student founders, bootstrapped startups

💵 **Cash Payments**
• **30-50% cheaper** than traditional agencies
• **Flexible payment plans** available
• **Quick turnaround** times
• **Perfect for:** Funded startups, established businesses

🔄 **Hybrid Model**
• **Reduced cash + small equity stake**
• **Best of both worlds**
• **Customizable terms**
• **Perfect for:** Growing startups with some funding

**💡 Use our Equity Calculator to see exact percentages for your project!**

**Which pricing model interests you?**`,

                equity: `🚀 **Equity Partnership Details:**

**📊 How We Calculate Equity:**
• **Project Value:** Based on services selected
• **Startup Stage:** Student (3-4%), Bootstrapped (4-6%), Funded (5-7%)
• **Growth Potential:** Market size & scalability
• **Cash Contribution:** Any upfront payment reduces equity

**🎯 Equity Ranges by Service:**
• **Branding Package:** 2-3% equity
• **Website Development:** 3-4% equity  
• **MVP Development:** 4-6% equity
• **Full Startup Package:** 5-7% equity

**✅ What You Get:**
• Premium services at no upfront cost
• Ongoing mentorship & support
• Investor network access
• Long-term partnership

**📈 Success Stories:**
• Purrfect Care: 5% equity → ₹50L+ revenue
• RR Purification: 4% equity → 200+ clients
• Extoll.Co: 6% equity → 10,000+ users

**Ready to calculate your equity percentage?**`,

                cash: `💵 **Cash Payment Options:**

**🎯 Individual Services:**
• **Logo & Branding:** ₹15,000 - ₹60,000
• **Website Development:** ₹25,000 - ₹80,000
• **Mobile App:** ₹1,00,000 - ₹3,50,000
• **MVP Development:** ₹1,50,000 - ₹2,00,000
• **Legal Setup:** ₹15,000 - ₹25,000
• **Marketing Setup:** ₹20,000 - ₹40,000

**📦 Package Deals (Save 20-30%):**
• **Starter Package:** ₹75,000 (Branding + Website)
• **Growth Package:** ₹2,50,000 (MVP + Marketing + Legal)
• **Scale Package:** ₹5,00,000 (Full startup setup)

**💳 Payment Options:**
• **Upfront:** 10% additional discount
• **50-50 Split:** 50% start, 50% completion
• **Monthly Plans:** Available for packages above ₹1L

**🎁 Current Offers:**
• **Student Discount:** 25% off all services
• **Referral Bonus:** ₹10,000 credit for successful referrals

**Need a custom quote for your specific requirements?**`
            },

            // Portfolio with detailed case studies
            portfolio: `🏆 **StartupOps Success Portfolio:**

🐾 **Purrfect Care** - Pet Care Platform
• **Equity:** 5% for complete development
• **Services:** MVP, branding, marketing setup
• **Results:** ₹50L+ revenue, 5,000+ customers
• **Timeline:** 6 months from idea to launch

💧 **RR Purification** - Water Treatment MSME  
• **Equity:** 4% for business setup
• **Services:** Legal setup, website, marketing
• **Results:** 200+ B2B clients, ₹2Cr+ revenue
• **Timeline:** 4 months to market entry

📚 **Extoll.Co** - EdTech Startup
• **Equity:** 6% for full development
• **Services:** Platform development, branding, legal
• **Results:** 10,000+ students, Series A funding
• **Timeline:** 8 months to product-market fit

🏥 **HealthTech Startup** - Telemedicine
• **Cash:** ₹3,50,000 for MVP development
• **Services:** Mobile app, web platform, compliance
• **Results:** 1,000+ doctors, 50,000+ consultations
• **Timeline:** 5 months development

🛒 **Fashion E-commerce** - Marketplace
• **Hybrid:** ₹1,50,000 + 3% equity
• **Services:** Platform development, marketing
• **Results:** ₹25L+ GMV in first year
• **Timeline:** 6 months to launch

**📊 Overall Stats:**
• **15+ successful launches**
• **90% client satisfaction rate**
• **Average 300% ROI in first year**
• **₹50Cr+ combined client revenue**

**Want to see detailed case studies for your industry?**`,

            // Process with timeline
            process: `🚀 **StartupOps Process - Idea to Success:**

**📞 Phase 1: Discovery (Week 1)**
• **Free consultation call** (30 minutes)
• Understand your vision & goals
• Assess technical requirements
• Discuss partnership options
• **Deliverable:** Custom proposal & timeline

**📋 Phase 2: Planning (Week 2)**
• Detailed project roadmap
• Technical architecture design
• Brand strategy development
• Legal structure planning
• **Deliverable:** Complete project blueprint

**🛠️ Phase 3: Development (Weeks 3-12)**
• **Sprint-based development** (2-week sprints)
• Regular progress updates & demos
• Continuous feedback & iterations
• Quality assurance & testing
• **Deliverable:** MVP/Product ready for launch

**🚀 Phase 4: Launch (Weeks 13-16)**
• Market launch strategy
• Performance monitoring
• User feedback collection
• Initial marketing campaigns
• **Deliverable:** Live product with initial traction

**📈 Phase 5: Growth (Ongoing)**
• Performance optimization
• Feature enhancements
• Scaling support
• Investor introductions
• **Deliverable:** Sustainable growth & success

**⏱️ Typical Timelines:**
• **Website:** 2-4 weeks
• **Mobile App:** 8-12 weeks  
• **MVP:** 6-10 weeks
• **Full Startup Setup:** 12-16 weeks

**Ready to start with a free discovery call?**`,

            // Team with detailed profiles
            team: `👥 **Meet the StartupOps Dream Team:**

**🎯 Leadership Team**
• **10+ years** startup experience
• **Ex-founders** of successful startups
• **Industry veterans** from top companies
• **Investor network** of 50+ VCs & angels

**💻 Technology Team**
• **Senior developers** (5+ years experience)
• **Full-stack expertise** (React, Node.js, Python, Flutter)
• **Cloud architects** (AWS, Google Cloud)
• **DevOps engineers** for scalable infrastructure

**🎨 Design Team**
• **UI/UX specialists** with startup focus
• **Brand strategists** & visual designers
• **User research experts**
• **Portfolio:** 100+ successful designs

**📈 Growth Team**
• **Digital marketing experts**
• **SEO & content specialists**
• **Social media strategists**
• **Performance marketing pros**

**⚖️ Legal & Compliance**
• **Startup lawyers** with 15+ years experience
• **CA & financial advisors**
• **Compliance specialists**
• **IP protection experts**

**🎓 Mentorship Network**
• **50+ successful entrepreneurs**
• **Industry experts** across sectors
• **Investor connections**
• **International market access**

**📊 Combined Stats:**
• **50+ years** combined experience
• **100+ projects** delivered successfully
• **₹500Cr+** in client valuations created
• **15+ exits** and acquisitions

**Want to meet our team on a video call?**`,

            // Contact with multiple options
            contact: `📞 **Ready to Build Your Startup Together?**

**🚀 Immediate Next Steps:**

**1️⃣ Free Discovery Call (30 minutes)**
• Discuss your startup idea
• Get expert advice & feedback
• Understand our process
• Receive custom proposal
• **Book now:** [Calendar Link]

**2️⃣ Quick Contact Options:**
📧 **Email:** startup.ops.co@gmail.com
📱 **Phone:** +91 93151 58312
💬 **WhatsApp:** +91 93151 58312
🔗 **LinkedIn:** @StartupOpsIndia

**3️⃣ Calculate Your Equity:**
• Use our **Equity Calculator**
• Get instant estimates
• See different scenarios
• Download detailed report

**4️⃣ Explore Our Services:**
• Browse our **Portfolio**
• Read **Case Studies**
• Check **Service Packages**
• View **Pricing Options**

**⚡ Response Times:**
• **Email:** Within 4 hours
• **WhatsApp:** Within 1 hour
• **Calls:** Same day callback

**🎁 Special Offers:**
• **Free consultation** for all new clients
• **25% student discount** with valid ID
• **₹10,000 referral bonus** for successful referrals

**💡 What happens next?**
1. You contact us
2. We schedule a call within 24 hours
3. Free consultation & proposal
4. Start building your dream!

**Ready to take the first step?**`
        };
    }

    initializeKeywordMatcher() {
        return {
            // Enhanced keyword matching with variations, typos, and synonyms
            greetings: {
                keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'namaste', 'hola'],
                variations: ['helo', 'hii', 'heey', 'gud morning', 'gd morning'],
                intent: 'greeting'
            },
            
            services: {
                keywords: ['service', 'services', 'what do you do', 'offerings', 'help with', 'provide', 'do you offer'],
                variations: ['servic', 'servies', 'wat do u do', 'wat u do', 'offerings', 'help me with'],
                intent: 'services_general'
            },
            
            technology: {
                keywords: ['website', 'app', 'development', 'coding', 'programming', 'tech', 'mvp', 'mobile', 'web'],
                variations: ['websit', 'ap', 'developement', 'programing', 'mobil', 'webb'],
                intent: 'services_technology'
            },
            
            marketing: {
                keywords: ['marketing', 'seo', 'social media', 'advertising', 'promotion', 'digital marketing', 'growth'],
                variations: ['markting', 'se0', 'social mdia', 'advertisng', 'promtion', 'growtth'],
                intent: 'services_marketing'
            },
            
            legal: {
                keywords: ['legal', 'registration', 'compliance', 'trademark', 'contract', 'company registration'],
                variations: ['leagal', 'registrtion', 'complianc', 'tradmark', 'contrct'],
                intent: 'services_legal'
            },
            
            pricing: {
                keywords: ['price', 'cost', 'fee', 'charge', 'expensive', 'cheap', 'affordable', 'pricing', 'rates'],
                variations: ['pric', 'cos', 'fe', 'charg', 'expensiv', 'cheep', 'affordabl', 'pricng'],
                intent: 'pricing_general'
            },
            
            equity: {
                keywords: ['equity', 'partnership', 'stake', 'share', 'percentage', 'equity model', 'no money'],
                variations: ['equty', 'partership', 'stak', 'shar', 'percentag', 'no mony'],
                intent: 'pricing_equity'
            },
            
            cash: {
                keywords: ['cash', 'payment', 'pay', 'money', 'upfront', 'cash payment'],
                variations: ['cas', 'paymet', 'mony', 'upfrnt', 'cash paymet'],
                intent: 'pricing_cash'
            },
            
            portfolio: {
                keywords: ['portfolio', 'work', 'examples', 'case studies', 'clients', 'success', 'projects'],
                variations: ['portfoli', 'exampl', 'cas studies', 'clints', 'succes', 'projcts'],
                intent: 'portfolio'
            },
            
            process: {
                keywords: ['how it works', 'process', 'steps', 'methodology', 'approach', 'how do you work'],
                variations: ['hw it works', 'proces', 'step', 'methodolgy', 'aproach', 'hw do u work'],
                intent: 'process'
            },
            
            team: {
                keywords: ['team', 'who are you', 'founders', 'people', 'experience', 'about you'],
                variations: ['tem', 'who r u', 'foundr', 'peopl', 'experinc', 'abt u'],
                intent: 'team'
            },
            
            contact: {
                keywords: ['contact', 'call', 'meeting', 'discuss', 'talk', 'phone', 'email', 'reach out'],
                variations: ['contct', 'cal', 'meating', 'discus', 'tak', 'phon', 'emal', 'reach'],
                intent: 'contact'
            },
            
            calculator: {
                keywords: ['calculator', 'calculate', 'equity calculator', 'estimate', 'percentage calculator'],
                variations: ['calculatr', 'calculat', 'equty calculator', 'estimat', 'percentag calculator'],
                intent: 'equity_calculator'
            }
        };
    }

    // Enhanced message processing with better keyword matching
    async processMessage(userMessage) {
        this.messageCount++;
        const lowerMessage = userMessage.toLowerCase();
        
        // Extract user information for lead scoring
        this.extractUserInfo(lowerMessage);
        
        // Detect intent with enhanced matching
        const intent = this.detectIntent(lowerMessage);
        this.intentsDiscussed.add(intent);
        
        // Generate response
        const botResponse = this.generateResponse(intent, lowerMessage);
        
        // Save conversation to Supabase
        await this.saveConversation(userMessage, botResponse, intent);
        
        // Update analytics
        await this.updateAnalytics();
        
        return botResponse;
    }

    // Enhanced intent detection with fuzzy matching
    detectIntent(message) {
        let bestMatch = { intent: 'general', score: 0 };
        
        for (const [category, data] of Object.entries(this.keywordMatcher)) {
            let score = 0;
            
            // Check exact keyword matches
            for (const keyword of data.keywords) {
                if (message.includes(keyword)) {
                    score += 10;
                }
            }
            
            // Check variation matches (typos, abbreviations)
            for (const variation of data.variations) {
                if (message.includes(variation)) {
                    score += 8;
                }
            }
            
            // Fuzzy matching for similar words
            for (const keyword of data.keywords) {
                if (this.fuzzyMatch(message, keyword)) {
                    score += 5;
                }
            }
            
            if (score > bestMatch.score) {
                bestMatch = { intent: data.intent, score };
            }
        }
        
        return bestMatch.intent;
    }

    // Simple fuzzy matching for typos
    fuzzyMatch(text, keyword) {
        const words = text.split(' ');
        for (const word of words) {
            if (this.levenshteinDistance(word, keyword) <= 2 && keyword.length > 3) {
                return true;
            }
        }
        return false;
    }

    // Calculate edit distance for fuzzy matching
    levenshteinDistance(str1, str2) {
        const matrix = [];
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        return matrix[str2.length][str1.length];
    }

    // Extract user information for lead scoring
    extractUserInfo(message) {
        // Extract name
        const nameMatch = message.match(/(?:i'm|i am|my name is|call me) ([a-zA-Z]+)/);
        if (nameMatch) {
            this.userInfo.name = nameMatch[1];
            this.leadScore += 15;
        }
        
        // Extract startup stage
        const stageKeywords = {
            'student': 'student',
            'college': 'student',
            'university': 'student',
            'idea': 'idea_stage',
            'just started': 'idea_stage',
            'prototype': 'prototype',
            'mvp': 'mvp',
            'customers': 'early_customers',
            'users': 'early_customers',
            'revenue': 'revenue_stage',
            'funded': 'funded',
            'investment': 'funded',
            'scale': 'scaling',
            'grow': 'scaling'
        };
        
        for (const [keyword, stage] of Object.entries(stageKeywords)) {
            if (message.includes(keyword)) {
                this.userInfo.stage = stage;
                this.leadScore += 20;
                break;
            }
        }
        
        // Extract contact information
        const emailMatch = message.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
        if (emailMatch) {
            this.userInfo.email = emailMatch[1];
            this.leadScore += 25;
        }
        
        const phoneMatch = message.match(/(\+?91[-\s]?)?[6-9]\d{9}/);
        if (phoneMatch) {
            this.userInfo.phone = phoneMatch[0];
            this.leadScore += 25;
        }
        
        // Extract interests and budget indicators
        const budgetKeywords = ['budget', 'money', 'cost', 'afford', 'expensive', 'cheap'];
        const urgencyKeywords = ['urgent', 'asap', 'quickly', 'soon', 'immediately'];
        
        if (budgetKeywords.some(keyword => message.includes(keyword))) {
            this.leadScore += 10;
        }
        
        if (urgencyKeywords.some(keyword => message.includes(keyword))) {
            this.leadScore += 15;
        }
    }

    // Generate contextual responses
    generateResponse(intent, message) {
        const userName = this.userInfo.name ? `${this.userInfo.name}, ` : '';
        
        switch (intent) {
            case 'greeting':
                return this.getRandomResponse(this.responses.greetings);
                
            case 'services_general':
                return `${userName}${this.responses.services.general}`;
                
            case 'services_technology':
                return `${userName}${this.responses.services.technology}`;
                
            case 'services_marketing':
                return `${userName}${this.responses.services.marketing}`;
                
            case 'services_legal':
                return `${userName}${this.responses.services.legal}`;
                
            case 'pricing_general':
                return `${userName}${this.responses.pricing.general}`;
                
            case 'pricing_equity':
                return `${userName}${this.responses.pricing.equity}`;
                
            case 'pricing_cash':
                return `${userName}${this.responses.pricing.cash}`;
                
            case 'portfolio':
                return `${userName}${this.responses.portfolio}`;
                
            case 'process':
                return `${userName}${this.responses.process}`;
                
            case 'team':
                return `${userName}${this.responses.team}`;
                
            case 'contact':
                return `${userName}${this.responses.contact}`;
                
            case 'equity_calculator':
                return `${userName}Great! Our Equity Calculator helps you estimate the exact percentage based on your project. \n\n**Quick Calculator:** [Click here to open Equity Calculator](equity-calculator.html)\n\n**What it calculates:**\n• Exact equity percentage (3-7%)\n• Cash vs equity breakdown\n• Project value estimation\n• Service recommendations\n\nOr I can help you estimate right here! What services do you need for your startup?`;
                
            default:
                return this.generateContextualResponse(message);
        }
    }

    // Generate contextual responses for unmatched intents
    generateContextualResponse(message) {
        const responses = [
            "That's a great question! StartupOps specializes in helping founders like you turn ideas into successful businesses. What specific aspect of your startup journey can I help you with?",
            "I'd love to help you with that! We work with startups at all stages - from idea to scale. What's your biggest challenge right now?",
            "Interesting! At StartupOps, we've helped 15+ startups overcome similar challenges. Can you tell me more about your specific situation?",
            "Great point! We offer both cash and equity-based partnerships to make our services accessible to all founders. What would work better for your situation?",
            "I understand! Let me help you find the right information. Are you looking for details about our services, pricing, or process?"
        ];
        
        // Add contextual responses based on conversation history
        if (this.messageCount > 3 && this.leadScore > 30) {
            responses.push("You seem really interested in building something amazing! Would you like to schedule a free 30-minute consultation to discuss your startup idea in detail?");
        }
        
        return this.getRandomResponse(responses);
    }

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Save conversation to Supabase
    async saveConversation(userMessage, botResponse, intent) {
        if (!this.supabase) return;
        
        try {
            const { error } = await this.supabase
                .from('chatbot_conversations')
                .insert([{
                    session_id: this.sessionId,
                    user_message: userMessage,
                    bot_response: botResponse,
                    intent_detected: intent,
                    lead_score: this.leadScore,
                    user_info: this.userInfo,
                    is_qualified_lead: this.leadScore >= 50
                }]);
                
            if (error) {
                console.error('Error saving conversation:', error);
            }
        } catch (error) {
            console.error('Error saving conversation:', error);
        }
    }

    // Update analytics
    async updateAnalytics() {
        if (!this.supabase) return;
        
        try {
            const conversationDuration = Math.floor((new Date() - this.conversationStart) / 1000);
            
            const { error } = await this.supabase
                .from('chatbot_analytics')
                .upsert([{
                    session_id: this.sessionId,
                    total_messages: this.messageCount,
                    conversation_duration: conversationDuration,
                    intents_discussed: Array.from(this.intentsDiscussed),
                    lead_score: this.leadScore,
                    user_info: this.userInfo,
                    updated_at: new Date().toISOString()
                }]);
                
            if (error) {
                console.error('Error updating analytics:', error);
            }
        } catch (error) {
            console.error('Error updating analytics:', error);
        }
    }

    // Track conversion actions
    async trackConversion(action) {
        if (!this.supabase) return;
        
        try {
            const { error } = await this.supabase
                .from('chatbot_analytics')
                .update({ conversion_action: action })
                .eq('session_id', this.sessionId);
                
            if (error) {
                console.error('Error tracking conversion:', error);
            }
        } catch (error) {
            console.error('Error tracking conversion:', error);
        }
    }

    // Get lead qualification status
    isQualifiedLead() {
        return this.leadScore >= 50;
    }

    // Get conversation summary
    getConversationSummary() {
        return {
            sessionId: this.sessionId,
            messageCount: this.messageCount,
            leadScore: this.leadScore,
            userInfo: this.userInfo,
            intentsDiscussed: Array.from(this.intentsDiscussed),
            conversationDuration: Math.floor((new Date() - this.conversationStart) / 1000),
            isQualified: this.isQualifiedLead()
        };
    }
}

// Export for use in chatbot
window.SmartChatbot = SmartChatbot;