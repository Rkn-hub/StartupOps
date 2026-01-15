// Supabase Client Configuration for StartupOps
// Updated with your actual Supabase project credentials

const SUPABASE_URL = 'https://zfmwccsfbakvbyeycpys.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmbXdjY3NmYmFrdmJ5ZXljcHlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0NTY4MTUsImV4cCI6MjA4MzAzMjgxNX0.sCS6nQGewpdaT3alQihBbj-wjoneJqvoezPC-6a_WJE';

// Initialize Supabase client (with error handling)
let supabase = null;

function initializeSupabase() {
    try {
        if (window.supabase && window.supabase.createClient) {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase client initialized successfully');
            return true;
        } else {
            console.error('❌ Supabase library not loaded');
            return false;
        }
    } catch (error) {
        console.error('❌ Error initializing Supabase:', error);
        return false;
    }
}

// Try to initialize immediately
initializeSupabase();

// Also try on DOMContentLoaded if not already initialized
document.addEventListener('DOMContentLoaded', function() {
    if (!supabase) {
        initializeSupabase();
    }
});

// Contact Form Submission
async function submitContactForm(formData) {
    try {
        // Check if Supabase is initialized
        if (!supabase) {
            const initialized = initializeSupabase();
            if (!initialized) {
                throw new Error('Supabase client not initialized. Please refresh the page and try again.');
            }
        }

        console.log('📤 Submitting contact form:', formData);

        const { data, error } = await supabase
            .from('contact_submissions')
            .insert([
                {
                    name: formData.name,
                    contact: formData.contact,
                    stage: formData.stage,
                    services: formData.services,
                    message: formData.message || null
                }
            ]);

        if (error) {
            console.error('❌ Supabase error:', error);
            throw error;
        }

        console.log('✅ Form submitted successfully:', data);
        return { success: true, data };
    } catch (error) {
        console.error('❌ Error submitting contact form:', error);
        return { success: false, error: error.message };
    }
}

// Equity Calculator Data Storage
async function saveEquityCalculation(calculationData) {
    try {
        const { data, error } = await supabase
            .from('equity_calculations')
            .insert([calculationData]);

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error saving equity calculation:', error);
        return { success: false, error: error.message };
    }
}

// Page Analytics Tracking
async function trackPageView(pageData) {
    try {
        const { data, error } = await supabase
            .from('page_analytics')
            .insert([
                {
                    page_path: pageData.path,
                    user_agent: navigator.userAgent,
                    referrer: document.referrer || null,
                    session_id: pageData.sessionId
                }
            ]);

        if (error) throw error;

        return { success: true, data };
    } catch (error) {
        console.error('Error tracking page view:', error);
        return { success: false, error: error.message };
    }
}

// Generate session ID for analytics
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Get or create session ID
function getSessionId() {
    let sessionId = sessionStorage.getItem('startupops_session_id');
    if (!sessionId) {
        sessionId = generateSessionId();
        sessionStorage.setItem('startupops_session_id', sessionId);
    }
    return sessionId;
}

// Auto-track page views on load (only if Supabase is initialized)
document.addEventListener('DOMContentLoaded', function() {
    if (supabase) {
        const sessionId = getSessionId();
        trackPageView({
            path: window.location.pathname,
            sessionId: sessionId
        }).catch(err => console.log('Analytics tracking failed (non-critical):', err));
    }
});

// Export functions for global use
window.StartupOpsDB = {
    submitContactForm,
    saveEquityCalculation,
    trackPageView,
    getSessionId
};