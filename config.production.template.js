// Production Configuration Template for University of Makati Library System
// Copy this file to config.js and fill in your actual values

window.APP_CONFIG = {
  // Supabase Configuration
  supabase: {
    url: 'YOUR_SUPABASE_URL_HERE', // Replace with your actual Supabase URL
    anonKey: 'YOUR_SUPABASE_ANON_KEY_HERE' // Replace with your actual Supabase anon key
  },
  
  // Application Settings
  app: {
    name: 'University of Makati Library',
    version: '1.0.0',
    environment: 'production', // Set to production
    debug: false // Disable debug in production
  },
  
  // Security Settings
  security: {
    adminEmailDomain: '@umak.edu.ph',
    maxLoginAttempts: 3, // Reduced for production
    sessionTimeout: 30 * 60 * 1000, // 30 minutes in milliseconds
    passwordMinLength: 8
  },
  
  // UI Settings
  ui: {
    loadingTimeout: 5000, // 5 seconds in production
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

// Production-specific overrides
window.APP_CONFIG.app.debug = false;
window.APP_CONFIG.ui.loadingTimeout = 5000;
window.APP_CONFIG.security.maxLoginAttempts = 3;
