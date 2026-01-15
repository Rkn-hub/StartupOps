// StartupOps Configuration
// Updated with your Supabase project credentials

const CONFIG = {
    // Supabase Configuration
    SUPABASE: {
        URL: 'https://zfmwccsfbakvbyeycpys.supabase.co',
        ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmbXdjY3NmYmFrdmJ5ZXljcHlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0NTY4MTUsImV4cCI6MjA4MzAzMjgxNX0.sCS6nQGewpdaT3alQihBbj-wjoneJqvoezPC-6a_WJE',
    },
    
    // Google Analytics (optional)
    GOOGLE_ANALYTICS: {
        MEASUREMENT_ID: 'G-XXXXXXXXXX' // Replace with your GA4 measurement ID
    },
    
    // Email Configuration (for notifications)
    EMAIL: {
        ADMIN_EMAIL: 'startup.ops.co@gmail.com', // Your admin email
        FROM_NAME: 'StartupOps Website'
    },
    
    // Feature Flags
    FEATURES: {
        ANALYTICS_ENABLED: true,
        EMAIL_NOTIFICATIONS: true,
        FORM_VALIDATION: true,
        SAVE_CALCULATIONS: true
    }
};

// Export config for use in other scripts
window.STARTUPOPS_CONFIG = CONFIG;