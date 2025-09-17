// Security utilities for UMak Library System
class SecurityManager {
  constructor() {
    this.maxLoginAttempts = 5;
    this.lockoutDuration = 15 * 60 * 1000; // 15 minutes
    this.loginAttempts = new Map();
    this.blockedIPs = new Set();
    this.initSecurityChecks();
  }

  initSecurityChecks() {
    // Check for suspicious patterns
    this.checkForXSS();
    this.checkForSQLInjection();
    this.validateEmailDomain();
    this.setupRateLimiting();
  }

  // Rate limiting for login attempts
  setupRateLimiting() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        const clientId = this.getClientId();
        if (this.isRateLimited(clientId)) {
          e.preventDefault();
          this.showSecurityAlert('Too many login attempts. Please try again later.');
          return false;
        }
        this.recordLoginAttempt(clientId);
      });
    }
  }

  getClientId() {
    // Create a unique identifier for the client
    let clientId = localStorage.getItem('client-id');
    if (!clientId) {
      clientId = 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('client-id', clientId);
    }
    return clientId;
  }

  isRateLimited(clientId) {
    const attempts = this.loginAttempts.get(clientId);
    if (!attempts) return false;

    const now = Date.now();
    const recentAttempts = attempts.filter(time => now - time < this.lockoutDuration);
    
    if (recentAttempts.length >= this.maxLoginAttempts) {
      this.loginAttempts.set(clientId, recentAttempts);
      return true;
    }
    
    this.loginAttempts.set(clientId, recentAttempts);
    return false;
  }

  recordLoginAttempt(clientId) {
    const attempts = this.loginAttempts.get(clientId) || [];
    attempts.push(Date.now());
    this.loginAttempts.set(clientId, attempts);
  }

  // XSS Protection
  checkForXSS() {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const value = e.target.value;
        if (this.containsXSS(value)) {
          e.target.value = this.sanitizeInput(value);
          this.showSecurityAlert('Potentially harmful content detected and removed.');
        }
      });
    });
  }

  containsXSS(input) {
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /<object[^>]*>.*?<\/object>/gi,
      /<embed[^>]*>/gi,
      /<link[^>]*>/gi,
      /<meta[^>]*>/gi,
      /<style[^>]*>.*?<\/style>/gi
    ];

    return xssPatterns.some(pattern => pattern.test(input));
  }

  sanitizeInput(input) {
    return input
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim();
  }

  // SQL Injection Protection
  checkForSQLInjection() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');
    inputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const value = e.target.value;
        if (this.containsSQLInjection(value)) {
          e.target.value = this.sanitizeSQLInput(value);
          this.showSecurityAlert('Potentially harmful SQL content detected and removed.');
        }
      });
    });
  }

  containsSQLInjection(input) {
    const sqlPatterns = [
      /('|(\\')|(;)|(\-\-)|(\|)|(\*)|(%)|(union)|(select)|(insert)|(update)|(delete)|(drop)|(create)|(alter)|(exec)|(execute))/gi
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
  }

  sanitizeSQLInput(input) {
    return input
      .replace(/[';*%]/g, '')
      .replace(/(union|select|insert|update|delete|drop|create|alter|exec|execute)/gi, '')
      .trim();
  }

  // Email domain validation
  validateEmailDomain() {
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
      input.addEventListener('blur', (e) => {
        const email = e.target.value;
        if (email && !this.isValidUMakEmail(email)) {
          e.target.value = '';
          this.showSecurityAlert('Only University of Makati email addresses (@umak.edu.ph) are allowed.');
        }
      });
    });
  }

  isValidUMakEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@umak\.edu\.ph$/;
    return emailRegex.test(email);
  }

  // Security alerts
  showSecurityAlert(message) {
    // Create a security alert modal
    const alertModal = document.createElement('div');
    alertModal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50';
    alertModal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md mx-4 shadow-lg">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-red-900">Security Alert</h3>
        </div>
        <p class="text-sm text-red-700 mb-4">${message}</p>
        <button onclick="this.parentElement.parentElement.remove()" class="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
          OK
        </button>
      </div>
    `;
    document.body.appendChild(alertModal);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (alertModal.parentElement) {
        alertModal.remove();
      }
    }, 5000);
  }

  // Session security
  setupSessionSecurity() {
    // Clear sensitive data on page unload
    window.addEventListener('beforeunload', () => {
      // Clear any sensitive data from memory
      this.clearSensitiveData();
    });

    // Monitor for suspicious activity
    this.monitorSuspiciousActivity();
  }

  clearSensitiveData() {
    // Clear any temporary sensitive data
    sessionStorage.clear();
    // Note: We keep localStorage for legitimate user preferences
  }

  monitorSuspiciousActivity() {
    // Monitor for rapid clicking (potential bot activity)
    let clickCount = 0;
    let lastClickTime = 0;
    
    document.addEventListener('click', (e) => {
      const now = Date.now();
      if (now - lastClickTime < 100) { // Less than 100ms between clicks
        clickCount++;
        if (clickCount > 10) {
          this.showSecurityAlert('Suspicious activity detected. Please slow down your interactions.');
          clickCount = 0;
        }
      } else {
        clickCount = 0;
      }
      lastClickTime = now;
    });

    // Monitor for rapid form submissions
    let formSubmitCount = 0;
    let lastFormSubmitTime = 0;
    
    document.addEventListener('submit', (e) => {
      const now = Date.now();
      if (now - lastFormSubmitTime < 1000) { // Less than 1 second between submissions
        formSubmitCount++;
        if (formSubmitCount > 3) {
          e.preventDefault();
          this.showSecurityAlert('Too many rapid form submissions detected. Please wait before trying again.');
          formSubmitCount = 0;
        }
      } else {
        formSubmitCount = 0;
      }
      lastFormSubmitTime = now;
    });
  }

  // Admin access protection
  protectAdminAccess() {
    // Monitor admin code attempts
    const adminCodeInput = document.getElementById('admin-code');
    if (adminCodeInput) {
      let adminAttempts = 0;
      adminCodeInput.addEventListener('input', (e) => {
        const value = e.target.value;
        if (value.length > 0 && value !== 'SEAT-ADMIN-2025') {
          adminAttempts++;
          if (adminAttempts > 3) {
            e.target.value = '';
            this.showSecurityAlert('Invalid admin code. Access denied.');
            adminAttempts = 0;
          }
        } else if (value === 'SEAT-ADMIN-2025') {
          adminAttempts = 0;
        }
      });
    }
  }

  // Initialize all security measures
  init() {
    this.setupSessionSecurity();
    this.protectAdminAccess();
    console.log('Security Manager initialized');
  }
}

// Initialize security when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.securityManager = new SecurityManager();
  window.securityManager.init();
});

// Additional security measures
(function() {
  // Disable right-click context menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  // Disable F12, Ctrl+Shift+I, Ctrl+U
  document.addEventListener('keydown', (e) => {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u')) {
      e.preventDefault();
    }
  });

  // Clear console on page load
  console.clear();
  console.log('%cStop!', 'color: red; font-size: 50px; font-weight: bold;');
  console.log('%cThis is a browser feature intended for developers. If someone told you to copy-paste something here, it is a scam.', 'color: red; font-size: 16px;');
})();
