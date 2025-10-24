(function () {
  var storageKey = 'umak-theme';
  var root = document.documentElement;

  function getSystemTheme() {
    try {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (_) {
      return 'light';
    }
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', theme === 'dark');
      toggle.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
    }
  }

  function initTheme() {
    var saved = undefined;
    try { saved = localStorage.getItem(storageKey); } catch (_) { }
    var theme = saved === 'light' || saved === 'dark' ? saved : getSystemTheme();
    applyTheme(theme);

    // Watch system changes if user hasn't explicitly set a preference
    if (!saved && window.matchMedia) {
      try {
        var mq = window.matchMedia('(prefers-color-scheme: dark)');
        mq.addEventListener('change', function (e) { applyTheme(e.matches ? 'dark' : 'light'); });
      } catch (_) { }
    }
  }

  function toggleTheme() {
    var current = root.getAttribute('data-theme') || getSystemTheme();
    var next = current === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(storageKey, next); } catch (_) { }
    applyTheme(next);
  }

  // Expose a minimal API
  window.UmakTheme = { toggle: toggleTheme, apply: applyTheme };

  // Robust global logout helper available on all pages
  window.logout = async function logout() {
    console.log('[Global Logout] Starting...');
    try {
      // Prevent multiple simultaneous logout attempts
      if (window._loggingOut) {
        console.log('[Global Logout] Already in progress, skipping...');
        return;
      }
      window._loggingOut = true;

      // Clear session storage
      try { sessionStorage.clear(); } catch (_) { }

      // Sign out from Supabase if available
      if (window.supabaseAuth && typeof window.supabaseAuth.signOut === 'function') {
        try {
          console.log('[Global Logout] Calling Supabase signOut...');
          await window.supabaseAuth.signOut();
          console.log('[Global Logout] Supabase signOut completed');
        } catch (err) {
          console.error('[Global Logout] Supabase signOut error:', err);
        }
      }

      // Redirect to login
      console.log('[Global Logout] Redirecting to login...');
      window.location.href = 'index.html?logout=1';
    } catch (err) {
      console.error('[Global Logout] Error:', err);
      window.location.href = 'index.html?logout=1';
    }
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
})();


