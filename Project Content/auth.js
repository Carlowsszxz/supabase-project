// Secure Authentication Module for University of Makati Library
// This module handles authentication logic securely

class AuthManager {
  constructor() {
    this.loginAttempts = 0;
    this.maxAttempts = window.APP_CONFIG?.security?.maxLoginAttempts || 5;
    this.isInitialized = false;
  }

  // Initialize authentication system
  async initialize() {
    try {
      if (!window.supabaseDB || !window.supabaseAuth) {
        throw new Error('Supabase modules not loaded');
      }
      
      this.isInitialized = true;
      console.log('AuthManager initialized successfully');
      return true;
    } catch (error) {
      console.error('AuthManager initialization failed:', error);
      return false;
    }
  }

  // Validate email format and domain
  validateEmail(email) {
    if (!email || typeof email !== 'string') {
      return { valid: false, message: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, message: 'Please enter a valid email address' };
    }

    const adminDomain = window.APP_CONFIG?.security?.adminEmailDomain || '@umak.edu.ph';
    if (!email.toLowerCase().endsWith(adminDomain)) {
      return { valid: false, message: `Please use a University of Makati email address (${adminDomain})` };
    }

    return { valid: true };
  }

  // Validate password strength
  validatePassword(password) {
    if (!password || typeof password !== 'string') {
      return { valid: false, message: 'Password is required' };
    }

    const minLength = window.APP_CONFIG?.security?.passwordMinLength || 8;
    if (password.length < minLength) {
      return { valid: false, message: `Password must be at least ${minLength} characters long` };
    }

    return { valid: true };
  }

  // Check if user has exceeded login attempts
  checkLoginAttempts() {
    if (this.loginAttempts >= this.maxAttempts) {
      const lockoutTime = 15 * 60 * 1000; // 15 minutes
      const lastAttempt = localStorage.getItem('lastLoginAttempt');
      const now = Date.now();
      
      if (lastAttempt && (now - parseInt(lastAttempt)) < lockoutTime) {
        const remainingTime = Math.ceil((lockoutTime - (now - parseInt(lastAttempt))) / 60000);
        return { 
          allowed: false, 
          message: `Too many login attempts. Please wait ${remainingTime} minutes before trying again.` 
        };
      } else {
        // Reset attempts after lockout period
        this.loginAttempts = 0;
        localStorage.removeItem('lastLoginAttempt');
      }
    }
    
    return { allowed: true };
  }

  // Record failed login attempt
  recordFailedAttempt() {
    this.loginAttempts++;
    localStorage.setItem('lastLoginAttempt', Date.now().toString());
  }

  // Reset login attempts on successful login
  resetLoginAttempts() {
    this.loginAttempts = 0;
    localStorage.removeItem('lastLoginAttempt');
  }

  // Secure admin check (should be moved to server-side in production)
  async checkAdminStatus(userId) {
    try {
      if (!this.isInitialized) {
        throw new Error('AuthManager not initialized');
      }

      // In production, this should be a server-side API call
      const adminCheck = await window.supabaseDB.isAdmin(userId);
      return adminCheck;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return { data: false, error: error.message };
    }
  }

  // Main login function
  async login(email, password) {
    try {
      // Validate inputs
      const emailValidation = this.validateEmail(email);
      if (!emailValidation.valid) {
        throw new Error(emailValidation.message);
      }

      const passwordValidation = this.validatePassword(password);
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.message);
      }

      // Check login attempts
      const attemptCheck = this.checkLoginAttempts();
      if (!attemptCheck.allowed) {
        throw new Error(attemptCheck.message);
      }

      // Attempt login
      const result = await window.supabaseAuth.signIn(email, password);
      
      if (result.error) {
        this.recordFailedAttempt();
        throw result.error;
      }

      // Reset attempts on successful login
      this.resetLoginAttempts();
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Get user destination after login
  async getDestinationAfterLogin(user) {
    try {
      if (!user || !user.id) {
        return 'Frame_11.html'; // Default to user dashboard
      }

      // Check admin status in database
      const adminCheck = await this.checkAdminStatus(user.id);
      if (adminCheck && adminCheck.data) {
        console.log('User is admin (db), redirecting to admin dashboard');
        return 'Frame_6.html';
      }

      // Fallback checks: metadata and configured allowlist
      const email = (user.email || '').toLowerCase();
      const metaRole = (user.user_metadata && (user.user_metadata.role || user.user_metadata.user_role)) || '';
      const appRoles = (user.app_metadata && (user.app_metadata.roles || user.app_metadata.role)) || [];
      const roles = Array.isArray(appRoles) ? appRoles.map(String) : [String(appRoles)];
      const isAdminByMeta = ['admin', 'librarian'].some(r => r && (metaRole === r || roles.includes(r)));

      // Optional allowlist via config
      const allowlist = (window.APP_CONFIG && window.APP_CONFIG.security && window.APP_CONFIG.security.adminEmails) || [];
      const isAdminByAllowlist = Array.isArray(allowlist) && allowlist.map(String).some(e => e.toLowerCase() === email);

      if (isAdminByMeta || isAdminByAllowlist) {
        console.log('User is admin (metadata/config), redirecting to admin dashboard');
        return 'Frame_6.html';
      }

      return 'Frame_11.html';
    } catch (error) {
      console.error('Error determining destination:', error);
      return 'Frame_11.html'; // Default to user dashboard on error
    }
  }

  // Logout function
  async logout() {
    try {
      if (window.supabaseAuth) {
        await window.supabaseAuth.signOut();
      }
      this.resetLoginAttempts();
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }
}

// Create global instance
window.authManager = new AuthManager();
