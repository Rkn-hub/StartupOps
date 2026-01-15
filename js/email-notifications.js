// Email Notifications for StartupOps
// This file handles sending email notifications when forms are submitted

// Configuration - Update these with your actual service details
const EMAIL_CONFIG = {
    // Option 1: Zapier Webhook (Recommended)
    ZAPIER_WEBHOOK_URL: 'https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_KEY/', // Replace with your Zapier webhook URL
    
    // Option 2: EmailJS (Free alternative)
    EMAILJS: {
        SERVICE_ID: 'YOUR_EMAILJS_SERVICE_ID',
        TEMPLATE_ID: 'YOUR_EMAILJS_TEMPLATE_ID',
        PUBLIC_KEY: 'YOUR_EMAILJS_PUBLIC_KEY'
    },
    
    // Email settings
    ADMIN_EMAIL: 'startup.ops.co@gmail.com',
    NOTIFICATION_ENABLED: true
};

// Send notification via Zapier webhook
async function sendZapierNotification(formData) {
    if (!EMAIL_CONFIG.ZAPIER_WEBHOOK_URL || EMAIL_CONFIG.ZAPIER_WEBHOOK_URL.includes('YOUR_WEBHOOK')) {
        console.log('Zapier webhook not configured');
        return { success: false, error: 'Webhook not configured' };
    }

    try {
        const response = await fetch(EMAIL_CONFIG.ZAPIER_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // Form data
                name: formData.name,
                email: formData.contact,
                subject: formData.services,
                message: formData.message || '',
                inquiry_type: formData.stage,
                
                // Metadata
                timestamp: new Date().toISOString(),
                source: 'StartupOps Contact Form',
                admin_email: EMAIL_CONFIG.ADMIN_EMAIL,
                
                // Email template data
                email_subject: '🚀 New Contact Form Submission - StartupOps',
                lead_score: calculateLeadScore(formData),
                formatted_timestamp: new Date().toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            })
        });

        if (response.ok) {
            return { success: true };
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        console.error('Zapier notification failed:', error);
        return { success: false, error: error.message };
    }
}

// Send notification via EmailJS
async function sendEmailJSNotification(formData) {
    if (!window.emailjs) {
        console.error('EmailJS not loaded');
        return { success: false, error: 'EmailJS not loaded' };
    }

    try {
        const templateParams = {
            to_email: EMAIL_CONFIG.ADMIN_EMAIL,
            from_name: formData.name,
            from_email: formData.contact,
            subject: formData.services,
            message: formData.message || 'No message provided',
            inquiry_type: formData.stage,
            submission_time: new Date().toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata'
            }),
            lead_score: calculateLeadScore(formData)
        };

        const response = await emailjs.send(
            EMAIL_CONFIG.EMAILJS.SERVICE_ID,
            EMAIL_CONFIG.EMAILJS.TEMPLATE_ID,
            templateParams,
            EMAIL_CONFIG.EMAILJS.PUBLIC_KEY
        );

        return { success: true, response };
    } catch (error) {
        console.error('EmailJS notification failed:', error);
        return { success: false, error: error.message };
    }
}

// Calculate lead score for prioritization
function calculateLeadScore(formData) {
    let score = 10; // Base score

    // Subject/inquiry type scoring
    const subjectScores = {
        'partnership': 30,
        'investment': 25,
        'development': 20,
        'consultation': 15,
        'general': 10
    };
    
    const subject = formData.services?.toLowerCase() || '';
    for (const [key, value] of Object.entries(subjectScores)) {
        if (subject.includes(key)) {
            score += value;
            break;
        }
    }

    // Message scoring (detailed message = higher intent)
    if (formData.message && formData.message.length > 100) {
        score += 15;
    } else if (formData.message && formData.message.length > 20) {
        score += 5;
    }

    // Email domain scoring (business emails = higher intent)
    if (formData.contact && !formData.contact.includes('@gmail.com') && !formData.contact.includes('@yahoo.com')) {
        score += 10;
    }

    return Math.min(score, 100); // Cap at 100
}

// Main notification function - tries multiple methods
async function sendContactNotification(formData) {
    if (!EMAIL_CONFIG.NOTIFICATION_ENABLED) {
        console.log('Email notifications disabled');
        return { success: true, message: 'Notifications disabled' };
    }

    const results = [];

    // Try Zapier first (most reliable)
    const zapierResult = await sendZapierNotification(formData);
    results.push({ method: 'Zapier', ...zapierResult });

    // If Zapier fails, try EmailJS as backup
    if (!zapierResult.success && window.emailjs) {
        const emailjsResult = await sendEmailJSNotification(formData);
        results.push({ method: 'EmailJS', ...emailjsResult });
    }

    // Return success if any method worked
    const successful = results.find(r => r.success);
    if (successful) {
        console.log(`Email notification sent via ${successful.method}`);
        return { success: true, method: successful.method };
    } else {
        console.error('All notification methods failed:', results);
        return { success: false, errors: results };
    }
}

// Equity calculator notification
async function sendEquityCalculationNotification(calculationData) {
    if (!EMAIL_CONFIG.NOTIFICATION_ENABLED) return;

    const notificationData = {
        name: 'Anonymous User',
        contact: 'equity-calculator@startupops.com',
        stage: calculationData.startup_stage,
        services: calculationData.selected_services.join(', '),
        message: `Equity Calculation: ${calculationData.equity_percent}% for ₹${calculationData.project_value.toLocaleString('en-IN')} project`,
        type: 'equity_calculation'
    };

    return await sendContactNotification(notificationData);
}

// Export functions for use in other scripts
window.StartupOpsNotifications = {
    sendContactNotification,
    sendEquityCalculationNotification,
    calculateLeadScore
};