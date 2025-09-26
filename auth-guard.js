// Authentication Guard Script
// This script checks if user is logged in and redirects to login if not

(function () {
    'use strict';

    // Configuration
    const LOGIN_PAGE = 'index.html';
    const CHECK_INTERVAL = 5000; // Check every 5 seconds
    const MAX_RETRIES = 3;
    const PUBLIC_PAGES = ['index.html', 'Frame_5.html', 'how-to.html', 'Frame_14.html', 'frames-index.html'];

    function isPublicPage() {
        try {
            var path = (window.location.pathname || '').split('/').pop() || 'index.html';
            return PUBLIC_PAGES.indexOf(path) !== -1;
        } catch (_) { return false; }
    }

    let retryCount = 0;
    let authCheckInterval = null;

    // Show loading message
    function showAuthLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'auth-loading';
        loadingDiv.className = 'fixed inset-0 bg-white z-50 flex items-center justify-center';
        loadingDiv.innerHTML = `
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p class="text-slate-600">Checking authentication...</p>
      </div>
    `;
        document.body.appendChild(loadingDiv);
    }

    // Hide loading message
    function hideAuthLoading() {
        const loadingDiv = document.getElementById('auth-loading');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }

    // Redirect to login page
    function redirectToLogin() {
        console.log('User not authenticated, redirecting to login...');
        window.location.href = LOGIN_PAGE;
    }

    // Check if user is authenticated
    async function checkAuthentication() {
        try {
            // Wait for Supabase to be available
            if (!window.supabaseAuth || !window.supabaseAuth.getCurrentUser) {
                console.log('Supabase auth not ready yet...');
                return false;
            }

            const { data: { user }, error } = await window.supabaseAuth.getCurrentUser();

            if (error) {
                console.error('Auth check error:', error);
                return false;
            }

            if (!user) {
                console.log('No authenticated user found');
                return false;
            }

            // Check if user has valid UMak email
            const email = (user.email || '').toLowerCase();
            if (!email.endsWith('@umak.edu.ph')) {
                console.log('Invalid email domain:', email);
                return false;
            }

            console.log('User authenticated:', email);
            return true;

        } catch (error) {
            console.error('Authentication check failed:', error);
            return false;
        }
    }

    // Main authentication guard
    async function authGuard() {
        showAuthLoading();

        try {
            const isAuthenticated = await checkAuthentication();

            if (isAuthenticated) {
                hideAuthLoading();
                console.log('Authentication successful');
                return true;
            } else {
                retryCount++;

                if (retryCount >= MAX_RETRIES) {
                    console.log('Max retries reached, redirecting to login');
                    redirectToLogin();
                    return false;
                } else {
                    console.log(`Authentication failed, retry ${retryCount}/${MAX_RETRIES}`);
                    // Wait a bit before retrying
                    setTimeout(() => {
                        authGuard();
                    }, 1000);
                    return false;
                }
            }
        } catch (error) {
            console.error('Auth guard error:', error);
            retryCount++;

            if (retryCount >= MAX_RETRIES) {
                redirectToLogin();
                return false;
            } else {
                setTimeout(() => {
                    authGuard();
                }, 1000);
                return false;
            }
        }
    }

    // Start periodic authentication checks
    function startPeriodicAuthCheck() {
        if (authCheckInterval) {
            clearInterval(authCheckInterval);
        }

        authCheckInterval = setInterval(async () => {
            const isAuthenticated = await checkAuthentication();
            if (!isAuthenticated) {
                console.log('Periodic auth check failed, redirecting to login');
                redirectToLogin();
            }
        }, CHECK_INTERVAL);
    }

    // Initialize authentication guard
    async function initAuthGuard() {
        // Skip auth guard on public pages (login, register, help)
        if (isPublicPage()) {
            return;
        }
        console.log('Initializing authentication guard...');

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                authGuard().then((success) => {
                    if (success) {
                        startPeriodicAuthCheck();
                    }
                });
            });
        } else {
            const success = await authGuard();
            if (success) {
                startPeriodicAuthCheck();
            }
        }
    }

    // Handle logout button clicks
    function setupLogoutHandler() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                try {
                    if (window.supabaseAuth && window.supabaseAuth.signOut) {
                        await window.supabaseAuth.signOut();
                    }
                    redirectToLogin();
                } catch (error) {
                    console.error('Logout error:', error);
                    redirectToLogin();
                }
            });
        }
    }

    // Handle page visibility changes (user switches tabs)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            // Page became visible, check authentication
            checkAuthentication().then((isAuthenticated) => {
                if (!isAuthenticated) {
                    redirectToLogin();
                }
            });
        }
    });

    // Handle beforeunload to clean up
    window.addEventListener('beforeunload', () => {
        if (authCheckInterval) {
            clearInterval(authCheckInterval);
        }
    });

    // Initialize when script loads
    initAuthGuard();

    // Setup logout handler when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupLogoutHandler);
    } else {
        setupLogoutHandler();
    }

    // Expose functions globally for debugging
    window.authGuard = {
        checkAuthentication,
        redirectToLogin,
        startPeriodicAuthCheck
    };

})();
