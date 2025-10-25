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
        <!-- Animated slash line -->
        <g class="eye-slash">
          <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="slash-line"/>
        </g>
      </svg>
    `;
  }

  togglePassword(input, button) {
    const isPassword = input.type === 'password';
    const eyeOpen = button.querySelector('.eye-open');
    const slashLine = button.querySelector('.slash-line');

    if (isPassword) {
      // Show password - draw slash across eye
      input.type = 'text';

      // Animate slash drawing from point A to point B
      slashLine.style.strokeDasharray = '22.627';
      slashLine.style.strokeDashoffset = '22.627';
      slashLine.style.transition = 'stroke-dashoffset 0.3s ease-in-out';

      // Start drawing the slash
      setTimeout(() => {
        slashLine.style.strokeDashoffset = '0';
      }, 10);

      button.setAttribute('title', 'Hide password');
      button.setAttribute('aria-label', 'Hide password');
    } else {
      // Hide password - erase slash from point B to point A
      input.type = 'password';

      // Animate slash erasing from point B to point A
      slashLine.style.strokeDasharray = '22.627';
      slashLine.style.strokeDashoffset = '0';
      slashLine.style.transition = 'stroke-dashoffset 0.3s ease-in-out';

      // Start erasing the slash
      setTimeout(() => {
        slashLine.style.strokeDashoffset = '22.627';
      }, 10);

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
