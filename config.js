// Configuration file for the University of Makati Library System
// This file should be kept secure and not committed to version control in production

window.APP_CONFIG = {
  // Supabase Configuration
  supabase: {
    url: 'YOUR_SUPABASE_URL', // Replace with your actual Supabase URL
    anonKey: 'YOUR_SUPABASE_ANON_KEY' // Replace with your actual Supabase anon key
  },
  
  // Application Settings
  app: {
    name: 'University of Makati Library',
    version: '1.0.0',
    environment: 'production', // Set to production for deployment
    debug: false // Disabled for production
  },
  
  // Security Settings
  security: {
    // These should be handled server-side in production
    adminEmailDomain: '@umak.edu.ph',
    // Optional allowlist for explicit admin emails
    adminEmails: ['adminlibrarian@umak.edu.ph'],
    maxLoginAttempts: 5,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes in milliseconds
    passwordMinLength: 8
  },
  
  // UI Settings
  ui: {
    loadingTimeout: 10000, // 10 seconds
    redirectDelay: 1000, // 1 second
    messageDisplayTime: 5000 // 5 seconds
  },
  
  // API Endpoints (for future server-side implementation)
  api: {
    baseUrl: '/api', // Will be used when implementing server-side logic
    endpoints: {
      login: '/auth/login',
      register: '/auth/register',
      adminCheck: '/auth/admin-check',
      userProfile: '/user/profile'
    }
  }
};

// Environment-specific overrides
if (window.APP_CONFIG.app.environment === 'production') {
  window.APP_CONFIG.app.debug = false;
  window.APP_CONFIG.ui.loadingTimeout = 5000;
  window.APP_CONFIG.security.maxLoginAttempts = 3;
}
