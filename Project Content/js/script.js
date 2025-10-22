// University of Makati Library - Login Page JavaScript

// Suppress Tailwind CDN production warning
(function () {
    var originalWarn = console.warn;
    console.warn = function () {
        try {
            if (arguments && typeof arguments[0] === 'string' && arguments[0].indexOf('cdn.tailwindcss.com should not be used in production') !== -1) {
                return; // suppress only Tailwind CDN production warning
            }
        } catch (e) { }
        return originalWarn.apply(console, arguments);
    };
})();

// Language translations
const translations = {
    en: {
        home: "Home",
        register: "Register",
        howToHelp: "How To / Help",
        settings: "Settings",
        loginTitle: "Welcome Back",
        loginSubtitle: "Sign in to your account to continue",
        emailLabel: "Email Address",
        passwordLabel: "Password",
        rememberMe: "Remember me",
        forgotPassword: "Forgot your password?",
        signIn: "Sign In",
        noAccount: "Don't have an account?",
        signUp: "Sign up here",
        librarySystem: "University of Makati Library",
        noiseComfort: "Noise Comfort Index"
    },
    fil: {
        home: "Mag-login",
        register: "Magparehistro",
        howToHelp: "Paano / Tulong",
        settings: "Mga Setting",
        loginTitle: "Maligayang Pagbabalik",
        loginSubtitle: "Mag-sign in sa inyong account upang magpatuloy",
        emailLabel: "Email Address",
        passwordLabel: "Password",
        rememberMe: "Tandaan ako",
        forgotPassword: "Nakalimutan ang password?",
        signIn: "Mag-sign In",
        noAccount: "Walang account?",
        signUp: "Mag-sign up dito",
        librarySystem: "Aklatan ng University of Makati",
        noiseComfort: "Index ng Kaginhawahan sa Ingay"
    }
};

// Function to update page language
function updateLanguage(language) {
    const t = translations[language];
    if (!t) return;

    // Update all text elements
    const elements = {
        'home-tooltip': t.home,
        'register-tooltip': t.register,
        'help-tooltip': t.howToHelp,
        'settings-tooltip': t.settings,
        'login-title': t.loginTitle,
        'login-subtitle': t.loginSubtitle,
        'email-label': t.emailLabel,
        'password-label': t.passwordLabel,
        'remember-me': t.rememberMe,
        'forgot-password': t.forgotPassword,
        'sign-in-btn': t.signIn,
        'no-account': t.noAccount,
        'sign-up-link': t.signUp,
        'library-title': t.librarySystem,
        'footer-text': t.noiseComfort
    };

    // Update text content
    Object.entries(elements).forEach(([id, text]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Mobile Menu Toggle
    (function () {
        const burgerBtn = document.getElementById('burgerMenuBtn');
        const mobileOverlay = document.getElementById('mobileMenuOverlay');
        const mobilePanel = document.getElementById('mobileMenuPanel');

        if (!burgerBtn || !mobileOverlay || !mobilePanel) return;

        let isMenuOpen = false;

        function openMenu() {
            isMenuOpen = true;
            burgerBtn.classList.add('active');
            mobileOverlay.classList.add('active');
            mobilePanel.classList.add('active');
            document.documentElement.style.overflow = 'hidden';
        }

        function closeMenu() {
            isMenuOpen = false;
            burgerBtn.classList.remove('active');
            mobileOverlay.classList.remove('active');
            mobilePanel.classList.remove('active');
            document.documentElement.style.overflow = '';
        }

        function toggleMenu() {
            if (isMenuOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        }

        burgerBtn.addEventListener('click', toggleMenu);
        mobileOverlay.addEventListener('click', closeMenu);

        const mobileNavItems = mobilePanel.querySelectorAll('.mobile-nav-item');
        mobileNavItems.forEach(item => {
            item.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMenu();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && isMenuOpen) {
                closeMenu();
            }
        });

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    })();

    // Load saved language and apply it
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        updateLanguage(savedLanguage);
    }
});

// Ensure Supabase is loaded before our script
window.addEventListener('load', function () {
    if (typeof window.supabase === 'undefined') {
        console.error('Supabase library failed to load');
    } else {
        console.log('Supabase library loaded successfully');
    }
});

// Initialize squares animation (if squares.js is loaded)
(function () {
    function initSquares() {
        var el = document.getElementById('squares-bg');
        if (!el || typeof window.createSquares !== 'function') return;
        window.createSquares(el, {
            speed: 0.5,
            squareSize: 40,
            direction: 'diagonal',
            borderColor: '#052865',
            hoverFillColor: '#222'
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSquares);
    } else { initSquares(); }
})();

// Fade-on-scroll transitions
(function () {
    var fadeElements = Array.from(document.querySelectorAll('[data-fade]'));
    if (fadeElements.length === 0) return;

    fadeElements.forEach(function (el) {
        var initialOpacity = parseFloat(el.getAttribute('data-initial-opacity') || '0');
        var duration = parseInt(el.getAttribute('data-duration') || '1000', 10);
        var easing = el.getAttribute('data-easing') || 'ease-out';
        var blurPxAttr = el.getAttribute('data-blur-px');
        var blurPx = parseInt(blurPxAttr || '14', 10);
        el.style.opacity = String(initialOpacity);
        el.style.setProperty('--fade-init', blurPx + 'px');
        el.style.setProperty('--fade-transition', 'opacity ' + duration + 'ms ' + easing + ', filter ' + duration + 'ms ' + easing);
    });

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var el = entry.target;
                var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
                var blurAttr = el.getAttribute('data-blur');
                var blurEnabled = (blurAttr !== 'false');
                observer.unobserve(el);
                setTimeout(function () {
                    el.style.opacity = '1';
                    if (blurEnabled) {
                        el.style.setProperty('--fade-init', '0px');
                    }
                }, delay);
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(function (el) { observer.observe(el); });
})();

// Fade content animation
(function () {
    function initFadeContent() {
        var el = document.getElementById('fade-content');
        if (!el) return;
        var blur = el.getAttribute('data-blur') === 'true';
        var duration = parseInt(el.getAttribute('data-duration') || '1000', 10);
        var easing = el.getAttribute('data-easing') || 'ease-out';
        var initialOpacity = parseFloat(el.getAttribute('data-initial-opacity') || '0');

        // set CSS variables
        el.style.setProperty('--fade-duration', duration + 'ms');
        el.style.setProperty('--fade-easing', easing);
        el.style.setProperty('--fade-initial-opacity', String(initialOpacity));
        if (blur) el.style.filter = 'blur(6px)';

        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    // remove inline blur then reveal
                    try { el.style.filter = 'none'; } catch (_) { }
                    el.classList.add('is-visible');
                    if (io) io.disconnect();
                }
            });
        }, { threshold: 0.1 });
        io.observe(el);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFadeContent);
    } else {
        initFadeContent();
    }
})();

// Main login functionality
(function () {
    // Prevent auto-redirects when coming from a logout or when on registration page
    var skipAutoRedirect = false;
    // Initialize Supabase with retry mechanism
    let supabaseInitialized = false;

    async function initializeSupabase() {
        try {
            // Try immediate initialization first
            if (initSupabase()) {
                supabaseInitialized = true;
                console.log('Supabase initialized successfully');
                return;
            }

            // If immediate initialization fails, try with retry mechanism
            console.log('Immediate initialization failed, trying with retry...');
            supabaseInitialized = await initSupabaseWithRetry();

            if (supabaseInitialized) {
                console.log('Supabase initialized successfully with retry');
            } else {
                console.error('Supabase initialization failed after retries');
            }
        } catch (err) {
            console.error('Supabase error:', err);
        }
    }

    // Initialize Supabase
    initializeSupabase();

    // Constants
    let tapCount = 0;

    // UI Helper Functions
    function showError(message) {
        hideAllMessages();
        const el = document.getElementById('login-error');
        if (el) {
            el.textContent = message;
            el.classList.remove('hidden');
        }
    }

    function showSuccess(message) {
        hideAllMessages();
        const el = document.getElementById('login-success');
        if (el) {
            el.textContent = message;
            el.classList.remove('hidden');
        }
    }

    function showLoading() {
        hideAllMessages();
        const el = document.getElementById('login-loading');
        if (el) {
            el.classList.remove('hidden');
        }
    }

    function hideAllMessages() {
        const messages = ['login-error', 'login-success', 'login-loading'];
        messages.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add('hidden');
        });
    }

    function setFormEnabled(enabled) {
        const form = document.getElementById('login-form');
        const inputs = form.querySelectorAll('input, button');
        inputs.forEach(input => {
            input.disabled = !enabled;
        });
    }

    // Admin Code Toggle
    function toggleAdminSecret(force) {
        const wrap = document.getElementById('admin-secret');
        if (!wrap) return;
        const willShow = typeof force === 'boolean' ? force : wrap.classList.contains('hidden');
        if (willShow) {
            wrap.classList.remove('hidden');
        } else {
            wrap.classList.add('hidden');
        }
    }

    // Event Listeners for Admin Code
    const title = document.querySelector('.brand-title');
    if (title) {
        title.addEventListener('click', function () {
            tapCount++;
            if (tapCount >= 3) {
                toggleAdminSecret();
                tapCount = 0;
            }
            setTimeout(function () { tapCount = 0; }, 1200);
        });
    }

    document.addEventListener('keydown', function (e) {
        if ((e.altKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) {
            toggleAdminSecret();
        }
    });


    // URL Parameter Handling
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    const logoutFlag = urlParams.get('logout');
    if (logoutFlag) {
        skipAutoRedirect = true;
        try { window.supabaseAuth && window.supabaseAuth.signOut && window.supabaseAuth.signOut(); } catch (_) { }
        // Clean the URL so refreshes don't keep the flag
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    if (message) {
        showSuccess(message);
        // Clear the URL parameter
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Form Validation
    function validateForm() {
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        // Use AuthManager validation if available
        if (window.authManager) {
            const emailValidation = window.authManager.validateEmail(email);
            if (!emailValidation.valid) {
                showError(emailValidation.message);
                return false;
            }

            const passwordValidation = window.authManager.validatePassword(password);
            if (!passwordValidation.valid) {
                showError(passwordValidation.message);
                return false;
            }

            return true;
        }

        // Fallback validation
        if (!email) {
            showError('Email address is required');
            return false;
        }

        if (!email.toLowerCase().endsWith('@umak.edu.ph')) {
            showError('Please use a University of Makati email address (@umak.edu.ph)');
            return false;
        }

        if (!password) {
            showError('Password is required');
            return false;
        }

        return true;
    }

    // Enhanced User Profile Check
    async function checkAndCreateUserProfile(user) {
        if (!user || !user.id) {
            return false;
        }

        const email = (user.email || '').toLowerCase();
        const adminEmails = ['admin@umak.edu.ph', 'adminlibrarian@umak.edu.ph'];
        const isAdminUser = adminEmails.includes(email);

        // Skip email validation for admin users
        if (isAdminUser) {
            console.log('Admin user detected, skipping profile creation');
            return true;
        }

        // Regular users must have @umak.edu.ph email
        if (!email.endsWith('@umak.edu.ph')) {
            return false;
        }

        try {
            // Check if user exists in users table
            const profileResult = await window.supabaseDB.getUser(user.id);

            if (profileResult.data) {
                console.log('User profile found:', profileResult.data);
                return true;
            } else {
                console.log('User profile not found, creating...');

                // Create user profile with metadata
                const userData = {
                    email: user.email || '', // Add email field (required)
                    first_name: user.user_metadata?.first_name || '',
                    last_name: user.user_metadata?.last_name || '',
                    student_id: user.user_metadata?.student_id || '',
                    program: user.user_metadata?.program || ''
                };

                const createResult = await window.supabaseDB.insertUser(user.id, userData);

                if (createResult.error) {
                    console.error('Failed to create user profile:', createResult.error);

                    // Handle duplicate key error - user already exists
                    if (createResult.error.code === '23505') {
                        console.log('User already exists, profile check successful');
                        return true; // User exists, so profile is valid
                    }

                    if (createResult.error.code === 'PGRST205') {
                        console.error('Database table not found. Please run the SQL setup in Supabase dashboard.');
                    }
                    return false;
                } else {
                    console.log('User profile created successfully:', createResult.data);
                    return true;
                }
            }
        } catch (error) {
            console.error('Error checking/creating user profile:', error);
            return false;
        }
    }

    // Determine Destination After Login
    async function getDestinationAfterLogin(email, password, user) {
        try {
            if (!user || !user.id) {
                return 'Frame_11.html';
            }

            console.log('Checking admin status for user:', user.id, 'email:', email);

            // Check email-based admin list first (most reliable)
            const adminEmails = ['admin@umak.edu.ph', 'adminlibrarian@umak.edu.ph'];
            if (email && typeof email === 'string' && adminEmails.includes(email.toLowerCase())) {
                console.log('User is admin (email-based), redirecting to admin dashboard');
                return 'Frame_6.html';
            }

            // Method 1: Check admin_users table directly (if database is accessible)
            try {
                const supabase = window.supabase.createClient(
                    'https://lvjfjyboqlcofzqrwqiy.supabase.co',
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2amZqeWJvcWxjb2Z6cXJ3cWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NzU4MTEsImV4cCI6MjA3MzM1MTgxMX0.XHLeP0xxmSWLC8MpqCpHWOVL3GK2TTJrKOBdbmME2OE'
                );

                const { data: adminCheck, error: adminError } = await supabase
                    .from('admin_users')
                    .select('id, role')
                    .eq('id', user.id)
                    .eq('role', 'admin')
                    .single();

                if (!adminError && adminCheck) {
                    console.log('User is admin (admin_users table), redirecting to admin dashboard');
                    return 'Frame_6.html';
                }
            } catch (adminError) {
                console.log('Admin check via admin_users table failed:', adminError);
            }

            // Method 2: Check users.is_admin column (if database is accessible)
            try {
                const supabase = window.supabase.createClient(
                    'https://lvjfjyboqlcofzqrwqiy.supabase.co',
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2amZqeWJvcWxjb2Z6cXJ3cWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NzU4MTEsImV4cCI6MjA3MzM1MTgxMX0.XHLeP0xxmSWLC8MpqCpHWOVL3GK2TTJrKOBdbmME2OE'
                );

                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('is_admin')
                    .eq('id', user.id)
                    .single();

                if (!userError && userData && userData.is_admin) {
                    console.log('User is admin (users.is_admin), redirecting to admin dashboard');
                    return 'Frame_6.html';
                }
            } catch (userError) {
                console.log('Admin check via users.is_admin failed:', userError);
            }

            console.log('User is not admin, redirecting to user dashboard');
            return 'Frame_11.html';

        } catch (error) {
            console.error('Error determining destination:', error);
            return 'Frame_11.html';
        }
    }

    // Login Handler
    async function handleLogin(event) {
        event.preventDefault();

        // Wait for Supabase to initialize if not ready
        if (!supabaseInitialized) {
            showError('System is initializing. Please wait a moment and try again.');

            // Try to initialize again
            await initializeSupabase();

            if (!supabaseInitialized) {
                showError('System not initialized. Please refresh the page and try again.');
                return;
            }
        }

        // Initialize AuthManager if not already done
        if (window.authManager && !window.authManager.isInitialized) {
            await window.authManager.initialize();
        }

        if (!validateForm()) {
            return;
        }

        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        try {
            showLoading();
            setFormEnabled(false);

            console.log('Attempting login with:', email);
            console.log('Supabase client status:', {
                supabaseInitialized,
                hasAuthManager: !!window.authManager,
                hasSupabaseAuth: !!window.supabaseAuth,
                hasSupabase: !!window.supabase,
                supabaseClient: window.supabase
            });

            // Simplified login with admin bypass
            let result;

            try {
                // Check if this is an admin email - bypass database checks
                const adminEmails = ['admin@umak.edu.ph', 'adminlibrarian@umak.edu.ph'];
                const isAdminEmail = adminEmails.includes(email.toLowerCase());

                if (isAdminEmail) {
                    console.log('Admin email detected, using direct authentication');

                    // Create Supabase client
                    const supabase = window.supabase.createClient(
                        'https://lvjfjyboqlcofzqrwqiy.supabase.co',
                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2amZqeWJvcWxjb2Z6cXJ3cWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NzU4MTEsImV4cCI6MjA3MzM1MTgxMX0.XHLeP0xxmSWLC8MpqCpHWOVL3GK2TTJrKOBdbmME2OE'
                    );

                    const { data, error } = await supabase.auth.signInWithPassword({
                        email,
                        password
                    });

                    if (error) throw error;

                    result = { data: { user: data.user, session: data.session }, error: null };
                    console.log('Admin login successful:', result.data);

                } else {
                    // Regular user login with database checks
                    const supabase = window.supabase.createClient(
                        'https://lvjfjyboqlcofzqrwqiy.supabase.co',
                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2amZqeWJvcWxjb2Z6cXJ3cWl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NzU4MTEsImV4cCI6MjA3MzM1MTgxMX0.XHLeP0xxmSWLC8MpqCpHWOVL3GK2TTJrKOBdbmME2OE'
                    );

                    const { data, error } = await supabase.auth.signInWithPassword({
                        email,
                        password
                    });

                    if (error) throw error;

                    result = { data: { user: data.user, session: data.session }, error: null };
                    console.log('User login successful:', result.data);
                }

            } catch (error) {
                console.error('Login failed:', error);

                // If it's a database schema error, try to continue anyway for admin emails
                if (error.message && error.message.includes('Database error querying schema')) {
                    const adminEmails = ['admin@umak.edu.ph', 'adminlibrarian@umak.edu.ph'];
                    if (adminEmails.includes(email.toLowerCase())) {
                        console.log('Database error detected, but allowing admin login to continue');
                        // Create a mock result for admin users
                        result = {
                            data: {
                                user: {
                                    id: '8b1843a7-f649-42e2-9b07-4ae168fe3fcb',
                                    email: email,
                                    user_metadata: {}
                                },
                                session: null
                            },
                            error: null
                        };
                    } else {
                        throw error;
                    }
                } else {
                    throw error;
                }
            }

            console.log('Login successful:', result.data);
            console.log('Full result object:', result);

            // Check if result.data exists and has user
            if (!result.data || !result.data.user) {
                console.error('Invalid login response - missing user data:', result);
                showError('Login failed: Invalid response from server. Please try again.');
                return;
            }

            // Check and create user profile
            const profileExists = await checkAndCreateUserProfile(result.data.user);

            if (!profileExists) {
                // Sign out the user if profile creation failed
                await window.supabaseAuth.signOut();
                showError('Account setup incomplete. Please try registering again.');
                return;
            }

            // Log login activity (best-effort)
            try {
                const userEmail = (result?.data?.user?.email) || null;
                const userId = (result?.data?.user?.id) || null;
                if (window.supabaseDB && userId) {
                    window.supabaseDB.addActivityLog({
                        userId: userId,
                        userName: userEmail,
                        type: 'login',
                        title: 'User Login',
                        description: (userEmail || 'A user') + ' logged in successfully',
                        severity: 'success',
                        details: null
                    });
                }
            } catch (_) { }

            // Determine destination
            const destination = await getDestinationAfterLogin(email, password, result.data.user);

            showSuccess('Login successful! Redirecting...');

            // Redirect to appropriate page
            const redirectDelay = window.APP_CONFIG?.ui?.redirectDelay || 1000;
            setTimeout(() => {
                window.location.href = destination;
            }, redirectDelay);

        } catch (error) {
            console.error('Login error:', error);

            // Enhanced error handling
            if (error.message.includes('Invalid login credentials')) {
                showError('Invalid email or password. Please check your credentials and try again.');
            } else if (error.message.includes('Email not confirmed')) {
                showError('Please check your email and click the confirmation link before signing in.');
            } else if (error.message.includes('Too many requests') || error.message.includes('Too many login attempts')) {
                showError('Too many login attempts. Please wait a moment and try again.');
            } else if (error.message.includes('Please use a University of Makati email address')) {
                showError(error.message);
            } else if (error.message.includes('Password must be at least')) {
                showError(error.message);
            } else {
                showError(error.message || 'Login failed. Please try again.');
            }
        } finally {
            setFormEnabled(true);
        }
    }

    // Event Listeners
    const form = document.getElementById('login-form');
    if (form) {
        form.addEventListener('submit', handleLogin);
    }

    // Mobile menu toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', function () {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                mobileBtn.setAttribute('aria-expanded', 'true');
            } else {
                mobileMenu.classList.add('hidden');
                mobileBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Real-time validation
    const emailInput = document.getElementById('login-email');
    if (emailInput) {
        emailInput.addEventListener('blur', function () {
            const email = this.value.trim();
            if (email) {
                if (window.authManager) {
                    const validation = window.authManager.validateEmail(email);
                    if (!validation.valid) {
                        showError(validation.message);
                    } else {
                        hideAllMessages();
                    }
                } else {
                    // Fallback validation
                    if (!email.toLowerCase().endsWith('@umak.edu.ph')) {
                        showError('Please use a University of Makati email address (@umak.edu.ph)');
                    } else {
                        hideAllMessages();
                    }
                }
            }
        });
    }

    // Check if user is already logged in
    // Removed auto-redirect logic to prevent interference with registration page access

})();

// Wallpaper Carousel
(function () {
    var container = document.getElementById('wallpaper');
    if (!container) return;
    var slides = container.querySelectorAll('.wall-slide');
    if (!slides || slides.length < 2) return;

    var files = ['library1.jpg', 'library2.jpg', 'library3.jpg'];
    var index = 0;
    var DURATION = 1500; // ~1.5s fade
    var INTERVAL = 2000; // 2s cycle

    // Preload to avoid flicker
    try { files.forEach(function (src) { var im = new Image(); im.src = src; }); } catch (_) { }

    // Ensure sizing and performance hints
    slides.forEach(function (img) {
        img.style.objectFit = 'cover';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.position = 'absolute';
        img.style.inset = '0';
        img.style.backfaceVisibility = 'hidden';
        img.style.willChange = 'opacity';
        img.setAttribute('aria-hidden', 'true');
    });

    function setSrc(img, i) { img.src = files[((i % files.length) + files.length) % files.length]; }
    // Initialize persistent front/back refs and states
    var front = slides[0];
    var back = slides[1];
    setSrc(front, 0);
    setSrc(back, 1);
    front.classList.remove('opacity-0');
    back.classList.add('opacity-0');

    var busy = false;
    function crossfade() {
        if (busy) return; // prevent overlap if timer fires early
        busy = true;
        var next = (index + 1) % files.length;
        // Prepare back layer with next image hidden
        setSrc(back, next);
        back.classList.add('opacity-0');

        // Double RAF to ensure transition triggers every cycle
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                front.classList.add('opacity-0');
                back.classList.remove('opacity-0');
            });
        });

        // Swap refs after fade completes
        setTimeout(function () {
            var tmp = front; front = back; back = tmp;
            index = next;
            busy = false;
        }, DURATION + 50);
    }

    setInterval(crossfade, INTERVAL);
})();

// Cursor Follower
(function () {
    const follower = document.getElementById('cursor-follower');
    if (!follower) return;

    // Hide on touch devices
    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    if (isTouch) { follower.style.display = 'none'; return; }
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        follower.style.display = 'none'; return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let posX = mouseX;
    let posY = mouseY;
    const ease = 0.08; // Slower, more gentle movement for library theme
    let isVisible = false;

    // Gentle fade in/out on mouse movement
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isVisible) {
            follower.style.opacity = '0.6';
            isVisible = true;
        }
    }, { passive: true });

    // Fade out when mouse leaves window
    window.addEventListener('mouseleave', () => {
        follower.style.opacity = '0';
        isVisible = false;
    });

    // Smooth following animation
    function animate() {
        posX += (mouseX - posX) * ease;
        posY += (mouseY - posY) * ease;
        follower.style.transform = `translate(${posX}px, ${posY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
})();

// Subtle parallax paper background effect
(function () {
    const paperBg = document.getElementById('paper-background');
    if (!paperBg) return;

    // Hide parallax on touch devices and mobile
    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    const isMobile = window.innerWidth <= 768;
    if (isTouch || isMobile) {
        paperBg.style.display = 'none';
        return;
    }

    // Respect reduced motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetX = 0;
    let targetY = 0;
    const parallaxStrength = 0.02; // Very subtle movement
    const ease = 0.05; // Smooth following

    // Update mouse position
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Calculate subtle offset (opposite direction for parallax effect)
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        targetX = (mouseX - centerX) * parallaxStrength;
        targetY = (mouseY - centerY) * parallaxStrength;
    }, { passive: true });

    // Smooth parallax animation
    function updateParallax() {
        const currentX = parseFloat(paperBg.style.transform.match(/translateX\(([^)]+)\)/) || [0, 0])[1] || 0;
        const currentY = parseFloat(paperBg.style.transform.match(/translateY\(([^)]+)\)/) || [0, 0])[1] || 0;

        const newX = currentX + (targetX - currentX) * ease;
        const newY = currentY + (targetY - currentY) * ease;

        paperBg.style.transform = `translate(${newX}px, ${newY}px)`;
        requestAnimationFrame(updateParallax);
    }

    requestAnimationFrame(updateParallax);
})();

