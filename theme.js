(function() {
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
    try { saved = localStorage.getItem(storageKey); } catch (_) {}
    var theme = saved === 'light' || saved === 'dark' ? saved : getSystemTheme();
    applyTheme(theme);

    // Watch system changes if user hasn't explicitly set a preference
    if (!saved && window.matchMedia) {
      try {
        var mq = window.matchMedia('(prefers-color-scheme: dark)');
        mq.addEventListener('change', function(e) { applyTheme(e.matches ? 'dark' : 'light'); });
      } catch (_) {}
    }
  }

  function toggleTheme() {
    var current = root.getAttribute('data-theme') || getSystemTheme();
    var next = current === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(storageKey, next); } catch (_) {}
    applyTheme(next);
  }

  // Expose a minimal API
  window.UmakTheme = { toggle: toggleTheme, apply: applyTheme };

  // Robust global logout helper available on all pages
  window.logout = function logout() {
    try {
      var redirect = function(){ try { window.location.href = 'index.html?logout=1'; } catch(_) {} };
      if (window.supabaseAuth && typeof window.supabaseAuth.signOut === 'function') {
        try {
          Promise.resolve(window.supabaseAuth.signOut()).then(redirect).catch(redirect);
        } catch(_) { redirect(); }
      } else {
        redirect();
      }
    } catch(_) {
      try { window.location.href = 'index.html?logout=1'; } catch(_) {}
    }
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
})();


