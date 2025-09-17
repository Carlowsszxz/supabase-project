// Password Toggle Functionality
// Provides aesthetic eye icon to show/hide password text

class PasswordToggle {
  constructor() {
    this.init();
  }

  init() {
    // Initialize all password toggles on page load
    this.initializeToggles();
    
    // Re-initialize when new content is added dynamically
    const observer = new MutationObserver(() => {
      this.initializeToggles();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  initializeToggles() {
    // Find all password inputs that don't already have a toggle
    const passwordInputs = document.querySelectorAll('input[type="password"]:not([data-toggle-initialized])');
    
    passwordInputs.forEach(input => {
      this.createToggle(input);
    });
  }

  createToggle(input) {
    // Mark as initialized to avoid duplicates
    input.setAttribute('data-toggle-initialized', 'true');
    
    // Create container wrapper
    const container = document.createElement('div');
    container.className = 'password-container';
    
    // Wrap the input
    input.parentNode.insertBefore(container, input);
    container.appendChild(input);
    
    // Add password-input class for styling
    input.classList.add('password-input');
    
    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = 'password-toggle';
    toggleButton.setAttribute('aria-label', 'Toggle password visibility');
    toggleButton.setAttribute('title', 'Show password');
    
    // Create eye icon SVG
    toggleButton.innerHTML = this.createEyeIcon();
    
    // Add event listener
    toggleButton.addEventListener('click', () => {
      this.togglePassword(input, toggleButton);
    });
    
    // Add to container
    container.appendChild(toggleButton);
  }

  createEyeIcon() {
    return `
      <svg class="eye-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <!-- Eye open icon -->
        <g class="eye-open">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
        </g>
        <!-- Eye closed icon -->
        <g class="eye-closed" style="display: none;">
          <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
        </g>
      </svg>
    `;
  }

  togglePassword(input, button) {
    const isPassword = input.type === 'password';
    const eyeOpen = button.querySelector('.eye-open');
    const eyeClosed = button.querySelector('.eye-closed');
    
    if (isPassword) {
      // Show password
      input.type = 'text';
      eyeOpen.style.display = 'none';
      eyeClosed.style.display = 'block';
      button.setAttribute('title', 'Hide password');
      button.setAttribute('aria-label', 'Hide password');
    } else {
      // Hide password
      input.type = 'password';
      eyeOpen.style.display = 'block';
      eyeClosed.style.display = 'none';
      button.setAttribute('title', 'Show password');
      button.setAttribute('aria-label', 'Show password');
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PasswordToggle();
});

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new PasswordToggle();
  });
} else {
  new PasswordToggle();
}
