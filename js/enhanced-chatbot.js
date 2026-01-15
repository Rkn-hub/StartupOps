// Enhanced Free Chatbot System for StartupOps
// 100% Free - No API costs, much smarter than basic rule-based

class StartupOpsChatbot {
    constructor() {
        this.context = {
            userName: null,
            userStage: null,
            userInterests: [],
            conversationHistory: [],
            leadScore: 0,
            askedQuestions: new Set()
        };
        
        this.responses = this.initializeResponses();
        this.leadQualificationQuestions = this.initializeLeadQuestions();
    }

    initializeResponses() {
        return {
            // Greetings and introductions
            greetings: [
                "Hello! I'm the StartupOps Assistant 🚀 I'm here to help you build your startup dreams into reality. What brings you here today?",
                "Welcome to StartupOps! 👋 Whether you're a student founder or seasoned entrepreneur, I'm here to help. What can I tell you about our services?",
                "Hi there! 🌟 Ready to turn your startup idea into the next big thing? I'm here to guide you through our process. What would you like to know?"
            ],

            // Services and offerings
            services: {
                general: "🛠️ We offer comprehensive startup services:\n\n🎨 **Strategy & Branding** - Logo, brand identity, positioning\n💻 **Technology Development** - MVP, web/mobile apps, tech stack\n⚖️ **Legal & Compliance** - Company registration, contracts, IP\n📈 **Marketing & Growth** - Digital marketing, SEO, social media\n🎯 **Mentorship & Advisory** - 1-on-1 guidance, investor connections\n\nWhat area interests you most?",
                
                development: "💻 **Technology Development Services:**\n\n✅ MVP Development (₹2-8 lakhs)\n✅ Web Applications (₹1-5 lakhs)\n✅ Mobile Apps (₹3-10 lakhs)\n✅ E-commerce Platforms (₹2-6 lakhs)\n✅ SaaS Platforms (₹5-15 lakhs)\n\nOr choose our **equity model** (3-7% equity) - no upfront costs! What type of tech solution do you need?",
                
                marketing: "📈 **Marketing & Growth Services:**\n\n✅ Digital Marketing Strategy\n✅ SEO & Content Marketing\n✅ Social Media Management\n✅ Paid Advertising (Google, Facebook)\n✅ Email Marketing Automation\n✅ Analytics & Performance Tracking\n\nWe can help you reach your first 1000 customers! What's your target audience?",
                
                legal: "⚖️ **Legal & Compliance Support:**\n\n✅ Company Registration (Pvt Ltd, LLP)\n✅ Trademark & IP Protection\n✅ Founder Agreements\n✅ Employee Contracts\n✅ Terms of Service & Privacy Policy\n✅ Investment Documentation\n\nStarting at ₹15,000 or included in our equity partnerships. Need help with any specific legal aspect?"
            },

            // Pricing and equity model
            pricing: {
                general: "💰 **Our Pricing Philosophy:**\n\n🤝 **Equity Model (3-7%)** - We invest in YOU\n💸 **50% cheaper** than traditional agencies\n📈 **Aligned incentives** - Your success = Our success\n\n**Choose your path:**\n• Cash payments (traditional)\n• Equity partnership (innovative)\n• Hybrid model (best of both)\n\nWhich model interests you?",
                
                equity: "🚀 **Equity Partnership Model:**\n\n**How it works:**\n• We take 3-7% equity instead of cash\n• You get premium services at no upfront cost\n• We're invested in your long-term success\n• Perfect for bootstrapped founders\n\n**Ideal for:**\n• Student founders\n• Early-stage startups\n• Bootstrapped companies\n• High-growth potential ideas\n\nWant to calculate your equity percentage?",
                
                cash: "💵 **Cash Payment Options:**\n\n**Service Packages:**\n• **Starter Package**: ₹50,000 - ₹2 lakhs\n• **Growth Package**: ₹2 - ₹8 lakhs\n• **Scale Package**: ₹8 - ₹20 lakhs\n\n**Individual Services:**\n• Logo & Branding: ₹15,000 - ₹50,000\n• Website Development: ₹25,000 - ₹2 lakhs\n• Mobile App: ₹1 - ₹5 lakhs\n\nNeed a custom quote for your project?"
            },

            // Portfolio and success stories
            portfolio: "🏆 **Our Success Stories:**\n\n🐾 **Purrfect Care** - Pet care platform (₹50L+ revenue)\n💧 **RR Purification** - Water treatment MSME (200+ clients)\n📚 **Extoll.Co** - EdTech startup (10,000+ students)\n🏥 **HealthTech Startup** - Telemedicine platform\n🛒 **E-commerce Platform** - Fashion marketplace\n\n**Results we deliver:**\n• 90% client satisfaction rate\n• Average 300% ROI in first year\n• 15+ successful launches\n\nWant to see detailed case studies?",

            // Process and how it works
            process: "🚀 **How StartupOps Works:**\n\n**Step 1: Discovery Call** 📞\n• Understand your vision\n• Assess your needs\n• Discuss partnership options\n\n**Step 2: Strategy & Planning** 📋\n• Create detailed roadmap\n• Define milestones\n• Set up project timeline\n\n**Step 3: Execution** 🛠️\n• Build your MVP/product\n• Implement marketing strategy\n• Provide ongoing support\n\n**Step 4: Growth & Scale** 📈\n• Launch and iterate\n• Scale operations\n• Achieve market fit\n\nReady to start with a free consultation?",

            // Team and about
            team: "👥 **Meet the StartupOps Team:**\n\n👩‍💼 **Leadership Team**\n• Experienced startup founders\n• Ex-corporate executives\n• Industry veterans\n\n👨‍💻 **Technical Team**\n• Full-stack developers\n• UI/UX designers\n• DevOps engineers\n\n👩‍🎓 **Growth Team**\n• Digital marketers\n• Content creators\n• Business analysts\n\n**Combined Experience:** 50+ years in startups, 100+ projects delivered\n\nWant to meet the team on a call?",

            // Contact and next steps
            contact: "📞 **Ready to Build Together?**\n\n**Get in Touch:**\n📧 startup.ops.co@gmail.com\n📱 +91 93151 58312\n💬 WhatsApp: +91 93151 58312\n\n**Next Steps:**\n1️⃣ Book a free 30-min consultation\n2️⃣ Discuss your startup idea\n3️⃣ Get a custom proposal\n4️⃣ Start building!\n\n**Response Time:** Within 4 hours\n\nShall I help you schedule a call right now?"
        };
    }

    initializeLeadQuestions() {
        return [
            {
                trigger: ['interested', 'want to know more', 'tell me more', 'sounds good'],
                question: "That's great! To better help you, what stage is your startup at?",
                options: ['Just an idea', 'Have a prototype', 'Early customers', 'Looking to scale'],
                followUp: 'stage'
            },
            {
                trigger: ['equity', 'partnership', 'no money', 'bootstrapped'],
                question: "Perfect! Our equity model is ideal for founders like you. What's your startup focused on?",
                options: ['Tech/SaaS', 'E-commerce', 'HealthTech', 'FinTech', 'EdTech', 'Other'],
                followUp: 'industry'
            },
            {
                trigger: ['calculate', 'equity calculator', 'percentage'],
                question: "Great! I can help you estimate the equity percentage. First, what's your approximate project value?",
                options: ['₹5-20 lakhs', '₹20-50 lakhs', '₹50L-1 crore', '₹1+ crore'],
                followUp: 'project_value'
            }
        ];
    }

    // Enhanced message processing with context awareness
    processMessage(message) {
        const lowerMessage = message.toLowerCase();
        this.context.conversationHistory.push({ type: 'user', message, timestamp: new Date() });
        
        // Extract user information
        this.extractUserInfo(lowerMessage);
        
        // Check for greetings first
        if (this.isGreeting(lowerMessage)) {
            return this.getRandomResponse(this.responses.greetings);
        }
        
        // Check for lead qualification opportunities
        const leadResponse = this.checkLeadQualification(lowerMessage);
        if (leadResponse) {
            return leadResponse;
        }
        
        // Process based on intent
        const intent = this.detectIntent(lowerMessage);
        const response = this.generateResponse(intent, lowerMessage);
        
        // Add follow-up questions for engagement
        const followUp = this.generateFollowUp(intent, lowerMessage);
        
        this.context.conversationHistory.push({ type: 'bot', message: response, timestamp: new Date() });
        
        return response + (followUp ? '\n\n' + followUp : '');
    }

    extractUserInfo(message) {
        // Extract name
        const nameMatch = message.match(/(?:i'm|i am|my name is|call me) ([a-zA-Z]+)/);
        if (nameMatch) {
            this.context.userName = nameMatch[1];
            this.context.leadScore += 10;
        }
        
        // Extract startup stage
        const stageKeywords = {
            'student': 'student',
            'idea': 'idea_stage',
            'prototype': 'prototype',
            'mvp': 'mvp',
            'customers': 'early_customers',
            'revenue': 'revenue_stage',
            'scale': 'scaling'
        };
        
        for (const [keyword, stage] of Object.entries(stageKeywords)) {
            if (message.includes(keyword)) {
                this.context.userStage = stage;
                this.context.leadScore += 15;
                break;
            }
        }
        
        // Extract interests
        const interests = ['tech', 'marketing', 'legal', 'funding', 'equity', 'development'];
        interests.forEach(interest => {
            if (message.includes(interest) && !this.context.userInterests.includes(interest)) {
                this.context.userInterests.push(interest);
                this.context.leadScore += 5;
            }
        });
    }

    isGreeting(message) {
        const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
        return greetings.some(greeting => message.includes(greeting));
    }

    detectIntent(message) {
        const intents = {
            services: ['service', 'what do you do', 'offerings', 'help with', 'provide'],
            pricing: ['price', 'cost', 'fee', 'charge', 'expensive', 'cheap', 'affordable'],
            equity: ['equity', 'partnership', 'stake', 'share', 'percentage'],
            portfolio: ['portfolio', 'work', 'examples', 'case studies', 'clients', 'success'],
            process: ['how it works', 'process', 'steps', 'methodology', 'approach'],
            team: ['team', 'who are you', 'founders', 'people', 'experience'],
            contact: ['contact', 'call', 'meeting', 'discuss', 'talk', 'phone', 'email'],
            development: ['website', 'app', 'development', 'coding', 'programming', 'tech'],
            marketing: ['marketing', 'seo', 'social media', 'advertising', 'promotion'],
            legal: ['legal', 'registration', 'compliance', 'trademark', 'contract']
        };
        
        for (const [intent, keywords] of Object.entries(intents)) {
            if (keywords.some(keyword => message.includes(keyword))) {
                return intent;
            }
        }
        
        return 'general';
    }

    generateResponse(intent, message) {
        const userName = this.context.userName ? this.context.userName : '';
        const greeting = userName ? `${userName}, ` : '';
        
        switch (intent) {
            case 'services':
                if (message.includes('development') || message.includes('tech')) {
                    return `${greeting}${this.responses.services.development}`;
                } else if (message.includes('marketing')) {
                    return `${greeting}${this.responses.services.marketing}`;
                } else if (message.includes('legal')) {
                    return `${greeting}${this.responses.services.legal}`;
                } else {
                    return `${greeting}${this.responses.services.general}`;
                }
                
            case 'pricing':
                if (message.includes('equity') || message.includes('partnership')) {
                    return `${greeting}${this.responses.pricing.equity}`;
                } else if (message.includes('cash') || message.includes('payment')) {
                    return `${greeting}${this.responses.pricing.cash}`;
                } else {
                    return `${greeting}${this.responses.pricing.general}`;
                }
                
            case 'equity':
                return `${greeting}${this.responses.pricing.equity}`;
                
            case 'portfolio':
                return `${greeting}${this.responses.portfolio}`;
                
            case 'process':
                return `${greeting}${this.responses.process}`;
                
            case 'team':
                return `${greeting}${this.responses.team}`;
                
            case 'contact':
                return `${greeting}${this.responses.contact}`;
                
            case 'development':
                return `${greeting}${this.responses.services.development}`;
                
            case 'marketing':
                return `${greeting}${this.responses.services.marketing}`;
                
            case 'legal':
                return `${greeting}${this.responses.services.legal}`;
                
            default:
                return this.generateContextualResponse(message);
        }
    }

    generateContextualResponse(message) {
        const responses = [
            "That's a great question! StartupOps specializes in helping founders like you turn ideas into successful businesses. What specific aspect of your startup journey can I help you with?",
            "I'd love to help you with that! We work with startups at all stages - from idea to scale. What's your biggest challenge right now?",
            "Interesting! At StartupOps, we've helped 15+ startups overcome similar challenges. Can you tell me more about your specific situation?",
            "Great point! We offer both cash and equity-based partnerships to make our services accessible to all founders. What would work better for your situation?"
        ];
        
        return this.getRandomResponse(responses);
    }

    checkLeadQualification(message) {
        for (const question of this.leadQualificationQuestions) {
            if (question.trigger.some(trigger => message.includes(trigger))) {
                if (!this.context.askedQuestions.has(question.followUp)) {
                    this.context.askedQuestions.add(question.followUp);
                    this.context.leadScore += 20;
                    
                    let response = question.question;
                    if (question.options) {
                        response += '\n\n' + question.options.map((option, index) => `${index + 1}. ${option}`).join('\n');
                    }
                    return response;
                }
            }
        }
        return null;
    }

    generateFollowUp(intent, message) {
        const followUps = {
            services: "Which of these services aligns with your current needs?",
            pricing: "Would you like me to calculate a custom quote for your project?",
            portfolio: "Would you like to see case studies similar to your industry?",
            process: "Ready to start with a free consultation call?",
            team: "Would you like to schedule a call to meet our team?",
            contact: "Shall I help you book a 30-minute discovery call right now?"
        };
        
        // Don't repeat follow-ups
        if (this.context.conversationHistory.length > 2 && Math.random() > 0.7) {
            return followUps[intent] || null;
        }
        
        return null;
    }

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // Lead scoring and qualification
    getLeadScore() {
        return this.context.leadScore;
    }

    isQualifiedLead() {
        return this.context.leadScore >= 50;
    }

    getLeadSummary() {
        return {
            score: this.context.leadScore,
            userName: this.context.userName,
            userStage: this.context.userStage,
            interests: this.context.userInterests,
            conversationLength: this.context.conversationHistory.length,
            qualified: this.isQualifiedLead(),
            timestamp: new Date()
        };
    }
}

// Export for use in chatbot
window.StartupOpsChatbot = StartupOpsChatbot;