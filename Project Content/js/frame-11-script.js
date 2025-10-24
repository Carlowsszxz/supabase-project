// University of Makati Library - User Profile Page JavaScript

// Language translations
const translations = {
    en: {
        home: "Home",
        register: "Register",
        howToHelp: "How To / Help",
        settings: "Settings",
        profile: "Profile",
        map: "Map",
        report: "Report",
        logout: "Logout",
        dashboard: "Dashboard",
        welcomeBack: "Welcome Back",
        noiseLevel: "Noise Level",
        currentLevel: "Current Level",
        quiet: "Quiet",
        moderate: "Moderate",
        noisy: "Noisy",
        studentInfo: "Student Information",
        totalStudents: "Total Students",
        activeUsers: "Active Users",
        availableSeats: "Available Seats",
        occupiedSeats: "Occupied Seats",
        currentSession: "Current Session",
        seat: "Seat",
        duration: "Duration",
        studyStatus: "Study Status",
        active: "Active",
        studyTips: "Study Tips",
        studyGoals: "Study Goals",
        studyProgress: "Study Progress",
        selectSeat: "Select a Seat",
        close: "Close",
        notCheckedIn: "Not checked in",
        viewOnly: "View-only",
        readyToStudy: "Ready to study? Find a seat and get started!",
        todaysTarget: "Today's Target",
        thisWeek: "This Week",
        thisMonth: "This Month",
        librarySystem: "University of Makati Library",
        noiseComfort: "Noise Comfort Index"
    },
    fil: {
        home: "Tahanan",
        register: "Magparehistro",
        howToHelp: "Paano / Tulong",
        settings: "Mga Setting",
        profile: "Profile",
        map: "Mapa",
        report: "Mag-report",
        logout: "Mag-logout",
        dashboard: "Dashboard",
        welcomeBack: "Maligayang Pagbabalik",
        noiseLevel: "Antas ng Ingay",
        currentLevel: "Kasalukuyang Antas",
        quiet: "Tahimik",
        moderate: "Katamtaman",
        noisy: "Maingay",
        studentInfo: "Impormasyon ng Mag-aaral",
        totalStudents: "Kabuuang Mag-aaral",
        activeUsers: "Aktibong Gumagamit",
        availableSeats: "Available na Upuan",
        occupiedSeats: "Okupadong Upuan",
        currentSession: "Kasalukuyang Session",
        seat: "Upuan",
        duration: "Tagal",
        studyStatus: "Status ng Pag-aaral",
        active: "Aktibo",
        studyTips: "Mga Tip sa Pag-aaral",
        studyGoals: "Mga Layunin sa Pag-aaral",
        studyProgress: "Pag-unlad sa Pag-aaral",
        selectSeat: "Piliin ang Upuan",
        close: "Isara",
        notCheckedIn: "Hindi pa nag-check in",
        viewOnly: "Tingnan lamang",
        readyToStudy: "Handa na bang mag-aral? Maghanap ng upuan at magsimula na!",
        todaysTarget: "Target ng Araw",
        thisWeek: "Sa Linggong Ito",
        thisMonth: "Sa Buwang Ito",
        completed: "Nakumpleto",
        streak: "Streak",
        days: "araw",
        hours: "oras",
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
        'dashboard-title': t.dashboard,
        'welcome-back': t.welcomeBack,
        'noise-level-title': t.noiseLevel,
        'current-level': t.currentLevel,
        'quiet-label': t.quiet,
        'moderate-label': t.moderate,
        'noisy-label': t.noisy,
        'student-info-title': t.studentInfo,
        'total-students': t.totalStudents,
        'active-users': t.activeUsers,
        'available-seats': t.availableSeats,
        'occupied-seats': t.occupiedSeats,
        'current-session-title': t.currentSession,
        'seat-label': t.seat,
        'duration-label': t.duration,
        'study-status-title': t.studyStatus,
        'active-label': t.active,
        'study-tips-title': t.studyTips,
        'study-goals-title': t.studyGoals,
        'study-progress-title': t.studyProgress,
        'select-seat-title': t.selectSeat,
        'close-btn': t.close,
        'ready-to-study': t.readyToStudy,
        'todays-target': t.todaysTarget,
        'this-week': t.thisWeek,
        'this-month': t.thisMonth,
        'completed-label': t.completed,
        'streak-label': t.streak,
        'days-label': t.days,
        'hours-label': t.hours,
        'profile-tooltip': t.profile,
        'map-tooltip': t.map,
        'report-tooltip': t.report,
        'logout-btn': t.logout,
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

    // Update dynamic text that might be set by JavaScript
    const dynamicElements = {
        'currentSession': t.notCheckedIn,
        'environmentStatus': t.viewOnly
    };

    Object.entries(dynamicElements).forEach(([id, text]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    });
}

// Load saved language and apply it
document.addEventListener('DOMContentLoaded', function () {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
        updateLanguage(savedLanguage);
    }
});

// Noise monitoring system
(function () {
    var checkInBtn = document.getElementById('checkInBtn');
    var checkOutBtn = document.getElementById('checkOutBtn');
    var seatModal = document.getElementById('seatModal');
    var closeSeatModal = document.getElementById('closeSeatModal');
    var logoutBtn = document.getElementById('logoutBtn');
    var logoutBtnMobile = document.getElementById('logoutBtnMobile');

    function handleLogout() {
        try {
            if (window.supabaseAuth) {
                window.supabaseAuth.signOut().then(function () {
                    window.location.href = 'index.html';
                }).catch(function (err) {
                    console.error('Logout error:', err);
                    window.location.href = 'index.html';
                });
            } else {
                window.location.href = 'index.html';
            }
        } catch (_) { window.location.href = 'index.html'; }
    }
    if (logoutBtn) { logoutBtn.addEventListener('click', handleLogout); }
    if (logoutBtnMobile) { logoutBtnMobile.addEventListener('click', handleLogout); }

    // Disable reservation: hide modal trigger
    if (checkInBtn) { checkInBtn.classList.add('hidden'); }
    // Ensure modal remains closed
    if (seatModal) { seatModal.classList.add('hidden'); seatModal.classList.remove('flex'); }
    // Disable checkout
    if (checkOutBtn) { checkOutBtn.classList.add('hidden'); }

    function setText(id, text) {
        var el = document.getElementById(id);
        if (el) el.textContent = text != null && text !== '' ? String(text) : '';
    }
    function setValue(id, val) {
        var el = document.getElementById(id);
        if (el) el.value = val != null ? String(val) : '';
    }


    // Initialize Supabase
    var supabaseInitialized = false;
    try {
        if (initSupabase()) {
            supabaseInitialized = true;
            console.log('Supabase: Connected');
        } else {
            console.error('Supabase: Error');
        }
    } catch (err) {
        console.error('Supabase: Error', err);
    }

    function populateFromProfile(profile, user) {
        var fn = (profile && profile.firstName) || '';
        var ln = (profile && profile.lastName) || '';
        var display = (fn || ln) ? (fn + ' ' + ln).trim() : (user && user.email) || 'User';
        setText('displayName', display);
        var initials = (function () {
            var parts = display.trim().split(/\s+/).slice(0, 2);
            return parts.map(function (p) { return p[0] ? p[0].toUpperCase() : ''; }).join('');
        })();
        var avatarEl = document.getElementById('avatar');
        if (avatarEl && initials) avatarEl.textContent = initials;

        setText('studentId', ((profile && profile.studentId) ? String(profile.studentId).toUpperCase() : '—'));
        setText('program', profile && profile.program || '—');

        // Session data
        // View-only mode: always show not checked in and hide actions
        setText('currentSession', 'Not checked in');
        setText('currentSeat', '—');
        setText('sessionDuration', '—');
        setText('environmentStatus', 'View-only');
        if (checkOutBtn) checkOutBtn.classList.add('hidden');
        if (checkInBtn) checkInBtn.classList.add('hidden');

        // Environment preferences
        var noisePrefs = profile && profile.noisePreferences || {};
        setText('noiseAlerts', noisePrefs.alerts !== false ? 'On' : 'Off');
    }

    function formatDuration(startTime) {
        if (!startTime) return '—';
        var now = Date.now();
        var elapsed = now - startTime;
        var hours = Math.floor(elapsed / 3600000);
        var minutes = Math.floor((elapsed % 3600000) / 60000);
        return hours + 'h ' + minutes + 'm';
    }

    function loadAvailableSeats() {
        if (!db) return;
        db.ref('occupancy').once('value').then(function (snap) {
            var data = snap && snap.val ? (snap.val() || {}) : {};
            renderSeatViews(data);
        }).catch(function (_) { });
    }

    function subscribeSeatsRealtime() {
        if (!db) return;
        db.ref('occupancy').on('value', function (snap) {
            var data = snap && snap.val ? (snap.val() || {}) : {};
            renderSeatViews(data);
        });
    }

    function renderSeatViews(occData) {
        try {
            var available = [];
            Object.keys(occData || {}).forEach(function (tableId) {
                var seats = (occData[tableId] && occData[tableId].seats) || {};
                Object.keys(seats).forEach(function (seatNum) {
                    var isOccupied = !!seats[seatNum];
                    if (!isOccupied) {
                        available.push({ id: tableId + '-' + seatNum, tableId: tableId, seatNum: seatNum });
                    }
                });
            });
            available.sort(function (a, b) { return a.id.localeCompare(b.id); });

            var panel = document.getElementById('availableSeats');
            if (panel) {
                panel.innerHTML = '';
                if (available.length === 0) {
                    var empty = document.createElement('div');
                    empty.className = 'text-center text-slate-500 text-sm col-span-5';
                    empty.textContent = 'No available seats right now.';
                    panel.appendChild(empty);
                } else {
                    available.forEach(function (seat) {
                        var btn = document.createElement('button');
                        btn.className = 'px-3 py-2 rounded-lg bg-green-500 text-white text-sm hover:opacity-90 transition';
                        btn.textContent = seat.id.replace('table-', 'Table ').replace('-', ' • Seat ');
                        btn.addEventListener('click', function () { selectSeat(seat.id); });
                        panel.appendChild(btn);
                    });
                }
            }

            var grid = document.getElementById('seatGrid');
            if (grid) {
                grid.innerHTML = '';
                // Also show occupied seats in red for context
                var allSeats = [];
                Object.keys(occData || {}).forEach(function (tableId) {
                    var seats = (occData[tableId] && occData[tableId].seats) || {};
                    Object.keys(seats).forEach(function (seatNum) {
                        var occ = !!seats[seatNum];
                        allSeats.push({ id: tableId + '-' + seatNum, available: !occ });
                    });
                });
                if (allSeats.length === 0) {
                    var loading = document.createElement('div');
                    loading.className = 'text-center text-slate-500 text-sm col-span-5';
                    loading.textContent = 'No seats configured.';
                    grid.appendChild(loading);
                } else {
                    allSeats.sort(function (a, b) { return a.id.localeCompare(b.id); });
                    allSeats.forEach(function (seat) {
                        var btn = document.createElement('button');
                        btn.className = 'w-12 h-12 rounded-lg text-sm font-medium ' + (seat.available ? 'bg-green-500 text-white' : 'bg-red-500 text-white');
                        btn.textContent = seat.id.split('-').pop();
                        btn.disabled = !seat.available;
                        if (seat.available) btn.addEventListener('click', function () { selectSeat(seat.id); });
                        grid.appendChild(btn);
                    });
                }
            }
        } catch (_) { }
    }

    (function () {
        var el = document.getElementById('fade-content');
        if (!el) return;
        var duration = parseInt(el.getAttribute('data-duration') || '1000', 10);
        var easing = el.getAttribute('data-easing') || 'ease-out';
        var initial = parseFloat(el.getAttribute('data-initial-opacity') || '0');
        var blur = el.getAttribute('data-blur') === 'true';
        var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
        var threshold = parseFloat(el.getAttribute('data-threshold') || '0.1');

        el.style.setProperty('--fade-duration', duration + 'ms');
        el.style.setProperty('--fade-easing', easing);
        el.style.setProperty('--fade-initial-opacity', String(initial));
        if (blur) el.style.filter = 'blur(10px)';

        var io = new IntersectionObserver(function (entries) {
            var e = entries[0];
            if (e && e.isIntersecting) {
                io.unobserve(el);
                setTimeout(function () {
                    try { el.style.filter = 'none'; } catch (_) { }
                    el.classList.add('is-visible');
                }, Math.max(0, delay));
            }
        }, { threshold: isNaN(threshold) ? 0.1 : threshold });

        io.observe(el);
    })();

    function selectSeat(seatId) {
        // Check in to seat (basic optimistic flow)
        console.log('Checking in to seat:', seatId);
        if (!auth || !db || !auth.currentUser) { return; }
        var uid = auth.currentUser.uid;
        var parts = String(seatId).split('-');
        var tableId = parts.slice(0, 2).join('-');
        var seatNum = parts[2];
        var updates = {};
        updates['occupancy/' + tableId + '/seats/' + seatNum] = true;
        updates['users/' + uid + '/currentSession'] = { seatId: seatId, startTime: Date.now(), noiseLevel: 0 };
        db.ref().update(updates).then(function () {
            if (seatModal) { seatModal.classList.add('hidden'); seatModal.classList.remove('flex'); }
        }).catch(function (err) { console.error('Check-in failed', err); });
    }

    function checkOut() {
        // Check out from current seat
        if (!auth || !db || !auth.currentUser) { return; }
        var uid = auth.currentUser.uid;
        db.ref('users/' + uid + '/currentSession').once('value').then(function (snap) {
            var cur = snap && snap.val ? (snap.val() || null) : null;
            if (!cur || !cur.seatId) return;
            var parts = String(cur.seatId).split('-');
            var tableId = parts.slice(0, 2).join('-');
            var seatNum = parts[2];
            var updates = {};
            updates['occupancy/' + tableId + '/seats/' + seatNum] = false;
            updates['users/' + uid + '/currentSession'] = null;
            db.ref().update(updates).catch(function (err) { console.error('Check-out failed', err); });
        });
    }

    function showCompleteProfile(profile, user) {
        var missing = [];
        if (!profile || !profile.firstName) missing.push('firstName');
        if (!profile || !profile.lastName) missing.push('lastName');
        if (!profile || !profile.studentId) missing.push('studentId');
        if (!profile || !profile.program) missing.push('program');
        var wrapper = document.getElementById('complete-profile');
        if (!wrapper) return;
        if (missing.length > 0) {
            wrapper.classList.remove('hidden');
            setValue('pf-first', (profile && profile.firstName) || '');
            setValue('pf-last', (profile && profile.lastName) || '');
            setValue('pf-studentId', (profile && profile.studentId) || '');
            setValue('pf-program', (profile && profile.program) || '');
        } else {
            wrapper.classList.add('hidden');
        }
    }

    function wireProfileForm(uid) {
        var form = document.getElementById('profile-form');
        var cancel = document.getElementById('pf-cancel');
        var msg = document.getElementById('pf-msg');
        function showMsg(text) { if (!msg) return; msg.textContent = text || ''; if (text) msg.classList.remove('hidden'); else msg.classList.add('hidden'); }
        if (cancel) cancel.addEventListener('click', function () { var w = document.getElementById('complete-profile'); if (w) w.classList.add('hidden'); });
        if (!form) return;
        form.addEventListener('submit', function (e) {
            e.preventDefault(); showMsg('Saving...');
            // Use snake_case to match Supabase users schema
            var updates = {
                first_name: (document.getElementById('pf-first') || {}).value || '',
                last_name: (document.getElementById('pf-last') || {}).value || '',
                student_id: (document.getElementById('pf-studentId') || {}).value || '',
                program: (document.getElementById('pf-program') || {}).value || ''
            };
            if (!updates.student_id || !updates.program) { showMsg('Student ID and Program are required.'); return; }
            if (supabaseInitialized) {
                window.supabaseDB.updateUser(uid, updates).then(function (result) {
                    if (result.error) throw result.error;
                    showMsg('Saved.');
                    setTimeout(function () {
                        showMsg('');
                        var w = document.getElementById('complete-profile');
                        if (w) w.classList.add('hidden');
                    }, 1000);
                }).catch(function (err) {
                    showMsg(err && err.message ? err.message : 'Failed to save.');
                });
            } else {
                showMsg('Database not connected.');
            }
        });
    }

    // Auth gate and data load
    if (supabaseInitialized) {
        window.supabaseAuth.onAuthStateChange(function (event, session) {
            if (!session || !session.user) {
                window.location.href = 'index.html';
                return;
            }
            var user = session.user;
            var uid = user.id;
            wireProfileForm(uid);

            // Load user profile
            window.supabaseDB.getUser(uid).then(function (result) {
                var profile = {};
                if (result && result.data) {
                    profile = {
                        firstName: result.data.first_name || '',
                        lastName: result.data.last_name || '',
                        studentId: result.data.student_id || '',
                        program: result.data.program || ''
                    };
                }
                populateFromProfile(profile, user);
                showCompleteProfile(profile, user);
            }).catch(function (err) {
                console.error('Error loading profile:', err);
                populateFromProfile({}, user);
                showCompleteProfile({}, user);
            });
        });
    } else {
        // If Supabase not initialized, redirect to login
        window.location.href = 'index.html';
    }


    // Initialize the page

})();

// DarkVeil background (WebGL via OGL) adapted for plain JS
(function () {
    try {
        var canvas = document.getElementById('veil-canvas');
        var holder = document.getElementById('veil-bg');
        if (!canvas || !holder || !window.OGL) return;

        var hueShift = 0;
        var noiseIntensity = 0.02;
        var scanlineIntensity = 0.08;
        var speed = 0.5;
        var scanlineFrequency = 6.0;
        var warpAmount = 0.05;
        var resolutionScale = 1;

        var Renderer = OGL.Renderer, Program = OGL.Program, Mesh = OGL.Mesh, Triangle = OGL.Triangle, Vec2 = OGL.Vec2;

        var vertex = 'attribute vec2 position;\nvoid main(){gl_Position=vec4(position,0.0,1.0);}';
        var fragment = '#ifdef GL_ES\nprecision lowp float;\n#endif\nuniform vec2 uResolution;\nuniform float uTime;\nuniform float uHueShift;\nuniform float uNoise;\nuniform float uScan;\nuniform float uScanFreq;\nuniform float uWarp;\n#define iTime uTime\n#define iResolution uResolution\n\nvec4 buf[8];\nfloat rand(vec2 c){return fract(sin(dot(c,vec2(12.9898,78.233)))*43758.5453);}\n\nmat3 rgb2yiq=mat3(0.299,0.587,0.114,0.596,-0.274,-0.322,0.211,-0.523,0.312);\nmat3 yiq2rgb=mat3(1.0,0.956,0.621,1.0,-0.272,-0.647,1.0,-1.106,1.703);\n\nvec3 hueShiftRGB(vec3 col,float deg){\n    vec3 yiq=rgb2yiq*col;\n    float rad=radians(deg);\n    float cosh=cos(rad),sinh=sin(rad);\n    vec3 yiqShift=vec3(yiq.x,yiq.y*cosh-yiq.z*sinh,yiq.y*sinh+yiq.z*cosh);\n    return clamp(yiq2rgb*yiqShift,0.0,1.0);\n}\n\nvec4 sigmoid(vec4 x){return 1./(1.+exp(-x));}\n\nvec4 cppn_fn(vec2 coordinate,float in0,float in1,float in2){\n    buf[6]=vec4(coordinate.x,coordinate.y,0.3948333106474662+in0,0.36+in1);\n    buf[7]=vec4(0.14+in2,sqrt(coordinate.x*coordinate.x+coordinate.y*coordinate.y),0.,0.);\n    buf[0]=mat4(vec4(6.5404263,-3.6126034,0.7590882,-1.13613),vec4(2.4582713,3.1660357,1.2219609,0.06276096),vec4(-5.478085,-6.159632,1.8701609,-4.7742867),vec4(6.039214,-5.542865,-0.90925294,3.251348))*buf[6]+mat4(vec4(0.8473259,-5.722911,3.975766,1.6522468),vec4(-0.24321538,0.5839259,-1.7661959,-5.350116),vec4(0.,0.,0.,0.),vec4(0.,0.,0.,0.))*buf[7]+vec4(0.21808943,1.1243913,-1.7969975,5.0294676);\n    buf[1]=mat4(vec4(-3.3522482,-6.0612736,0.55641043,-4.4719114),vec4(0.8631464,1.7432913,5.643898,1.6106541),vec4(2.4941394,-3.5012043,1.7184316,6.357333),vec4(3.310376,8.209261,1.1355612,-1.165539))*buf[6]+mat4(vec4(5.24046,-13.034365,0.009859298,15.870829),vec4(2.987511,3.129433,-0.89023495,-1.6822904),vec4(0.,0.,0.,0.),vec4(0.,0.,0.,0.))*buf[7]+vec4(-5.9457836,-6.573602,-0.8812491,1.5436668);\n    buf[0]=sigmoid(buf[0]);buf[1]=sigmoid(buf[1]);\n    buf[2]=mat4(vec4(-15.219568,8.095543,-2.429353,-1.9381982),vec4(-5.951362,4.3115187,2.6393783,1.274315),vec4(-7.3145227,6.7297835,5.2473326,5.9411426),vec4(5.0796127,8.979051,-1.7278991,-1.158976))*buf[6]+mat4(vec4(-11.967154,-11.608155,6.1486754,11.237008),vec4(2.124141,-6.263192,-1.7050359,-0.7021966),vec4(0.,0.,0.,0.),vec4(0.,0.,0.,0.))*buf[7]+vec4(-4.17164,-3.2281182,-4.576417,-3.6401186);\n    buf[3]=mat4(vec4(3.1832156,-13.738922,1.879223,3.233465),vec4(0.64300746,12.768129,1.9141049,0.50990224),vec4(-0.049295485,4.4807224,1.4733979,1.801449),vec4(5.0039253,13.000481,3.3991797,-4.5561905))*buf[6]+mat4(vec4(-0.1285731,7.720628,-3.1425676,4.742367),vec4(0.6393625,3.714393,-0.8108378,-0.39174938),vec4(0.,0.,0.,0.),vec4(0.,0.,0.,0.))*buf[7]+vec4(-1.1811101,-21.621881,0.7851888,1.2329718);\n    buf[2]=sigmoid(buf[2]);buf[3]=sigmoid(buf[3]);\n    buf[4]=mat4(vec4(5.214916,-7.183024,2.7228765,2.6592617),vec4(-5.601878,-25.3591,4.067988,0.4602802),vec4(-10.57759,24.286327,21.102104,37.546658),vec4(4.3024497,-1.9625226,2.3458803,-1.372816))*buf[0]+mat4(vec4(-17.6526,-10.507558,2.2587414,12.462782),vec4(6.265566,-502.75443,-12.642513,0.9112289),vec4(-10.983244,20.741234,-9.701768,-0.7635988),vec4(5.383626,1.4819539,-4.1911616,-4.8444734))*buf[1]+mat4(vec4(12.785233,-16.345072,-0.39901125,1.7955981),vec4(-30.48365,-1.8345358,1.4542528,-1.1118771),vec4(19.872723,-7.337935,-42.941723,-98.52709),vec4(8.337645,-2.7312303,-2.2927687,-36.142323))*buf[2]+mat4(vec4(-16.298317,3.5471997,-0.44300047,-9.444417),vec4(57.5077,-35.609753,16.163465,-4.1534753),vec4(-0.07470326,-3.8656476,-7.0901804,3.1523974),vec4(-12.559385,-7.077619,1.490437,-0.8211543))*buf[3]+vec4(-7.67914,15.927437,1.3207729,-1.6686112);\n    buf[5]=mat4(vec4(-1.4109162,-0.372762,-3.770383,-21.367174),vec4(-6.2103205,-9.35908,0.92529047,8.82561),vec4(11.460242,-22.348068,13.625772,-18.693201),vec4(-0.3429052,-3.9905605,-2.4626114,-0.45033523))*buf[0]+mat4(vec4(7.3481627,-4.3661838,-6.3037653,-3.868115),vec4(1.5462853,6.5488915,1.9701879,-0.58291394),vec4(6.5858274,-2.2180402,3.7127688,-1.3730392),vec4(-5.7973905,10.134961,-2.3395722,-5.965605))*buf[1]+mat4(vec4(-2.5132585,-6.6685553,-1.4029363,-0.16285264),vec4(-0.37908727,0.53738135,4.389061,-1.3024765),vec4(-0.70647055,2.0111287,-5.1659346,-3.728635),vec4(-13.562562,10.487719,-0.9173751,-2.6487076))*buf[2]+mat4(vec4(-8.645013,6.5546675,-6.3944063,-5.5933375),vec4(-0.57783127,-1.077275,36.91025,5.736769),vec4(14.283112,3.7146652,7.1452246,-4.5958776),vec4(2.7192075,3.6021907,-4.366337,-2.3653464))*buf[3]+vec4(-5.9000807,-4.329569,1.2427121,8.59503);\n    buf[4]=sigmoid(buf[4]);buf[5]=sigmoid(buf[5]);\n    buf[6]=mat4(vec4(-1.61102,0.7970257,1.4675229,0.20917463),vec4(-28.793737,-7.1390953,1.5025433,4.656581),vec4(-10.94861,39.66238,0.74318546,-10.095605),vec4(-0.7229728,-1.5483948,0.7301322,2.1687684))*buf[0]+mat4(vec4(3.2547753,21.489103,-1.0194173,-3.3100595),vec4(-3.7316632,-3.3792162,-7.223193,-0.23685838),vec4(13.1804495,0.7916005,5.338587,5.687114),vec4(-4.167605,-17.798311,-6.815736,-1.6451967))*buf[1]+mat4(vec4(0.604885,-7.800309,-7.213122,-2.741014),vec4(-3.522382,-0.12359311,-0.5258442,0.43852118),vec4(9.6752825,-22.853785,2.062431,0.099892326),vec4(-4.3196306,-17.730087,2.5184598,5.30267))*buf[2]+mat4(vec4(-6.545563,-15.790176,-6.0438633,-5.415399),vec4(-43.591583,28.551912,-16.00161,18.84728),vec4(4.212382,8.394307,3.0958717,8.657522),vec4(-5.0237565,-4.450633,-4.4768,-5.5010443))*buf[3]+mat4(vec4(1.6985557,-67.05806,6.897715,1.9004834),vec4(1.8680354,2.3915145,2.5231109,4.081538),vec4(11.158006,1.7294737,2.0738268,7.386411),vec4(-4.256034,-306.24686,8.258898,-17.132736))*buf[4]+mat4(vec4(1.6889864,-4.5852966,3.8534803,-6.3482175),vec4(1.3543309,-1.2640043,9.932754,2.9079645),vec4(-5.2770967,0.07150358,-0.13962056,3.3269649),vec4(28.34703,-4.918278,6.1044083,4.085355))*buf[5]+vec4(6.6818056,12.522166,-3.7075126,-4.104386);\n    buf[7]=mat4(vec4(-8.265602,-4.7027016,5.098234,0.7509808),vec4(8.6507845,-17.15949,16.51939,-8.884479),vec4(-4.036479,-2.3946867,-2.6055532,-1.9866527),vec4(-2.2167742,-1.8135649,-5.9759874,4.8846445))*buf[0]+mat4(vec4(6.7790847,3.5076547,-2.8191125,-2.7028968),vec4(-5.743024,-0.27844876,1.4958696,-5.0517144),vec4(13.122226,15.735168,-2.9397483,-4.101023),vec4(-14.375265,-5.030483,-6.2599335,2.9848232))*buf[1]+mat4(vec4(4.0950394,-0.94011575,-5.674733,4.755022),vec4(4.3809423,4.8310084,1.7425908,-3.437416),vec4(2.117492,0.16342592,-104.56341,16.949184),vec4(-5.22543,-2.994248,3.8350096,-1.9364246))*buf[2]+mat4(vec4(-5.900337,1.7946124,-13.604192,-3.8060522),vec4(6.6583457,31.911177,25.164474,91.81147),vec4(11.840538,4.1503043,-0.7314397,6.768467),vec4(-6.3967767,4.034772,6.1714606,-0.32874924))*buf[3]+mat4(vec4(3.4992442,-196.91893,-8.923708,2.8142626),vec4(3.4806502,-3.1846354,5.1725626,5.1804223),vec4(-2.4009497,15.585794,1.2863957,2.0252278),vec4(-71.25271,-62.441242,-8.138444,0.50670296))*buf[4]+mat4(vec4(-12.291733,-11.176166,-7.3474145,4.390294),vec4(10.805477,5.6337385,-0.9385842,-4.7348723),vec4(-12.869276,-7.039391,5.3029537,7.5436664),vec4(1.4593618,8.91898,3.5101583,5.840625))*buf[5]+vec4(2.2415268,-6.705987,-0.98861027,-2.117676);\n    buf[6]=sigmoid(buf[6]);buf[7]=sigmoid(buf[7]);\n    buf[0]=mat4(vec4(1.6794263,1.3817469,2.9625452,0.),vec4(-1.8834411,-1.4806935,-3.5924516,0.),vec4(-1.3279216,-1.0918057,-2.3124623,0.),vec4(0.2662234,0.23235129,0.44178495,0.))*buf[0]+mat4(vec4(-0.6299101,-0.5945583,-0.9125601,0.),vec4(0.17828953,0.18300213,0.18182953,0.),vec4(-2.96544,-2.5819945,-4.9001055,0.),vec4(1.4195864,1.1868085,2.5176322,0.))*buf[1]+mat4(vec4(-1.2584374,-1.0552157,-2.1688404,0.),vec4(-0.7200217,-0.52666044,-1.438251,0.),vec4(0.15345335,0.15196142,0.272854,0.),vec4(0.945728,0.8861938,1.2766753,0.))*buf[2]+mat4(vec4(-2.4218085,-1.968602,-4.35166,0.),vec4(-22.683098,-18.0544,-41.954372,0.),vec4(0.63792,0.5470648,1.1078634,0.),vec4(-1.5489894,-1.3075932,-2.6444845,0.))*buf[3]+mat4(vec4(-0.49252132,-0.39877754,-0.91366625,0.),vec4(0.95609266,0.7923952,1.640221,0.),vec4(0.30616966,0.15693925,0.8639857,0.),vec4(1.1825981,0.94504964,2.176963,0.))*buf[4]+mat4(vec4(0.35446745,0.3293795,0.59547555,0.),vec4(-0.58784515,-0.48177817,-1.0614829,0.),vec4(2.5271258,1.9991658,4.6846647,0.),vec4(0.13042648,0.08864098,0.30187556,0.))*buf[5]+mat4(vec4(-1.7718065,-1.4033192,-3.3355875,0.),vec4(3.1664357,2.638297,5.378702,0.),vec4(-3.1724713,-2.6107926,-5.549295,0.),vec4(-2.851368,-2.249092,-5.3013067,0.))*buf[6]+mat4(vec4(1.5203838,1.2212278,2.8404984,0.),vec4(1.5210563,1.2651345,2.683903,0.),vec4(2.9789467,2.4364579,5.2347264,0.),vec4(2.2270417,1.8825914,3.8028636,0.))*buf[7]+vec4(-1.5468478,-3.6171484,0.24762098,0.);\n    buf[0]=sigmoid(buf[0]);\n    return vec4(buf[0].x,buf[0].y,buf[0].z,1.);\n}\n\nvoid mainImage(out vec4 fragColor,in vec2 fragCoord){\n    vec2 uv=fragCoord/uResolution.xy*2.-1.;\n    uv.y*=-1.;\n    uv+=uWarp*vec2(sin(uv.y*6.283+uTime*0.5),cos(uv.x*6.283+uTime*0.5))*0.05;\n    fragColor=cppn_fn(uv,0.1*sin(0.3*uTime),0.1*sin(0.69*uTime),0.1*sin(0.44*uTime));\n}\n\nvoid main(){\n    vec4 col;mainImage(col,gl_FragCoord.xy);\n    col.rgb=hueShiftRGB(col.rgb,uHueShift);\n    float scanline_val=sin(gl_FragCoord.y*uScanFreq)*0.5+0.5;\n    col.rgb*=1.-(scanline_val*scanline_val)*uScan;\n    col.rgb+=(rand(gl_FragCoord.xy+uTime)-0.5)*uNoise;\n    gl_FragColor=vec4(clamp(col.rgb,0.0,1.0),1.0);\n}';

        var renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), canvas: canvas });
        var gl = renderer.gl;
        var geometry = new Triangle(gl);
        var program = new Program(gl, {
            vertex: vertex,
            fragment: fragment,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new Vec2() },
                uHueShift: { value: hueShift },
                uNoise: { value: noiseIntensity },
                uScan: { value: scanlineIntensity },
                uScanFreq: { value: scanlineFrequency },
                uWarp: { value: warpAmount }
            }
        });
        var mesh = new Mesh(gl, { geometry: geometry, program: program });

        function resize() {
            var w = holder.clientWidth, h = holder.clientHeight;
            renderer.setSize(w * resolutionScale, h * resolutionScale);
            program.uniforms.uResolution.value.set(w, h);
        }
        window.addEventListener('resize', resize);
        resize();

        var start = performance.now();
        var rafId;
        function loop() {
            program.uniforms.uTime.value = ((performance.now() - start) / 1000) * speed;
            renderer.render({ scene: mesh });
            rafId = requestAnimationFrame(loop);
        }
        loop();

        window.addEventListener('beforeunload', function () { if (rafId) cancelAnimationFrame(rafId); });
    } catch (_) { }
})();

// Fade-on-scroll transitions (copied from Frame 15)
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

// Mobile Menu Toggle
(function () {
    const burgerBtn = document.getElementById('burgerMenuBtn');
    const mobileOverlay = document.getElementById('mobileMenuOverlay');
    const mobilePanel = document.getElementById('mobileMenuPanel');
    const logoutBtnMobile = document.getElementById('logoutBtnMobile');

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
        item.addEventListener('click', function (e) {
            // Don't close immediately if it's the logout button
            if (item.id !== 'logoutBtnMobile') {
                closeMenu();
            }
        });
    });

    // Handle mobile logout button separately
    if (logoutBtnMobile) {
        logoutBtnMobile.addEventListener('click', function () {
            // Logout handler will be called from the existing logout code
            closeMenu();
        });
    }

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

// Noise Level Monitoring System with Real-time Database Polling
(function () {
    var noiseLevelFill = document.getElementById('noiseLevelFill');
    var noiseValue = document.getElementById('noiseValue');
    var noiseStatus = document.getElementById('noiseStatus');
    var noiseTableLabel = document.getElementById('noiseTableLabel');
    var noiseTimestamp = document.getElementById('noiseTimestamp');

    if (!noiseLevelFill || !noiseValue || !noiseStatus) return;

    // Get user's current table from profile data
    var currentTable = 'Table 1'; // Default label - showing Table 1 for testing
    var currentTableId = 'table-1';

    // Try to get actual seat info if user is checked in
    setTimeout(function () {
        var currentSeatEl = document.getElementById('currentSeat');
        if (currentSeatEl && currentSeatEl.textContent !== '—') {
            var seatText = currentSeatEl.textContent;
            // Extract table number if format is like "Table 1, Seat 3"
            var match = seatText.match(/Table (\d+)/i);
            if (match) {
                currentTable = 'Table ' + match[1];
                currentTableId = 'table-' + match[1];
            }
        }
        noiseTableLabel.textContent = currentTable;
    }, 500);

    // State variables
    var currentNoiseLevel = null; // Start with null to show "No data available"
    var lastUpdateTime = null;
    var hasData = false;

    // Initialize display with "No data available" state
    updateDisplay(null);

    // Update visual display
    function updateDisplay(level) {
        if (level === null || level === undefined) {
            // Show "No data available" state
            noiseValue.textContent = '--';
            noiseStatus.textContent = '⚪ Tap your RFID at a table';
            noiseStatus.className = 'text-sm font-medium text-slate-400';
            noiseLevelFill.style.height = '0%';
            noiseLevelFill.style.background = 'linear-gradient(to top, #9ca3af, #d1d5db)';
            noiseTimestamp.textContent = 'Tap RFID to start monitoring';
            hasData = false;
            return;
        }

        hasData = true;
        // Show decimal value (e.g., 12.37) instead of rounding
        var displayLevel = parseFloat(level).toFixed(1); // Shows one decimal place (e.g., 12.4)
        var percentage = Math.min(100, Math.max(0, ((level - 30) / (85 - 30)) * 100));

        // Update value display
        noiseValue.textContent = displayLevel;

        // Update bar height
        noiseLevelFill.style.height = percentage + '%';

        // Update colors and status based on level
        var status, statusColor, gradient;
        if (level < 50) {
            status = '🟢 Quiet';
            statusColor = 'text-green-600';
            gradient = 'linear-gradient(to top, #10b981, #34d399)';
        } else if (level < 70) {
            status = '🟡 Moderate';
            statusColor = 'text-yellow-600';
            gradient = 'linear-gradient(to top, #f59e0b, #fbbf24)';
        } else {
            status = '🔴 Noisy';
            statusColor = 'text-red-600';
            gradient = 'linear-gradient(to top, #ef4444, #f87171)';
        }

        noiseStatus.textContent = status;
        noiseStatus.className = 'text-sm font-medium ' + statusColor;
        noiseLevelFill.style.background = gradient;

        // Update timestamp
        lastUpdateTime = Date.now();
        updateTimestamp();
    }

    // Update timestamp display
    function updateTimestamp() {
        if (!lastUpdateTime || !hasData) {
            noiseTimestamp.textContent = 'Tap RFID to start monitoring';
            return;
        }

        var now = Date.now();
        var seconds = Math.floor((now - lastUpdateTime) / 1000);

        if (seconds < 5) {
            noiseTimestamp.textContent = 'Updated just now';
        } else if (seconds < 60) {
            noiseTimestamp.textContent = 'Updated ' + seconds + 's ago';
        } else {
            var minutes = Math.floor(seconds / 60);
            noiseTimestamp.textContent = 'Updated ' + minutes + 'm ago';
        }
    }

    // Get the table the current user last tapped
    async function getUserTable() {
        try {
            // Get current user
            const { data: { user }, error: userError } = await window.supabaseClient.auth.getUser();

            if (userError || !user) {
                console.log('[Noise Monitor] No user logged in');
                return null;
            }

            console.log('[Noise Monitor] Current user:', user.id);

            // Get user's UID from users table
            const { data: userData, error: uidError } = await window.supabaseClient
                .from('users')
                .select('uid')
                .eq('id', user.id)
                .single();

            if (uidError || !userData || !userData.uid) {
                console.log('[Noise Monitor] User has no UID assigned yet');
                return null;
            }

            const userUid = userData.uid;
            console.log('[Noise Monitor] User UID:', userUid);

            // Query recent_taps to find the latest table this user tapped
            const { data: tapData, error: tapError } = await window.supabaseClient
                .from('recent_taps')
                .select('table_name, created_at')
                .eq('uid', userUid)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (tapError || !tapData) {
                console.log('[Noise Monitor] No recent taps found for this user');
                return null;
            }

            console.log('[Noise Monitor] User last tapped:', tapData.table_name, 'at', tapData.created_at);
            return tapData.table_name;

        } catch (err) {
            console.error('[Noise Monitor] Error getting user table:', err);
            return null;
        }
    }

    // Fetch latest decibel value from latest_sound_per_table
    async function fetchLatestNoiseLevel() {
        try {
            console.log('[Noise Monitor] Fetching latest noise level...');

            // Check if Supabase is initialized
            if (!window.supabaseClient && typeof initSupabase === 'function') {
                console.log('[Noise Monitor] Supabase not found, attempting to initialize...');
                initSupabase();
            }

            if (!window.supabaseClient) {
                console.warn('[Noise Monitor] Supabase not initialized yet');
                updateDisplay(null);
                return;
            }

            // Get the table the user tapped
            const userTable = await getUserTable();

            if (!userTable) {
                console.log('[Noise Monitor] User has not tapped any table yet');
                updateDisplay(null);
                noiseTableLabel.textContent = 'No table selected';
                // Hide Leave Seat button when no table
                const leaveSeatBtn = document.getElementById('leaveSeatBtn');
                if (leaveSeatBtn) leaveSeatBtn.style.display = 'none';
                return;
            }

            console.log('[Noise Monitor] Querying latest_sound_per_table for', userTable);

            // Show Leave Seat button when table is detected
            const leaveSeatBtn = document.getElementById('leaveSeatBtn');
            if (leaveSeatBtn) leaveSeatBtn.style.display = 'flex';

            // Fetch from latest_sound_per_table for the user's table
            const { data, error } = await window.supabaseClient
                .from('latest_sound_per_table')
                .select('table_name, decibel, created_at')
                .eq('table_name', userTable)
                .single();

            if (error) {
                // If no data found (PGRST116), that's okay - show "No data available"
                if (error.code === 'PGRST116') {
                    console.log('[Noise Monitor] No noise data available for', userTable, 'yet');
                    updateDisplay(null);
                    noiseTableLabel.textContent = userTable.replace('_', ' ');
                    return;
                }
                console.error('[Noise Monitor] Query error:', error);
                throw error;
            }

            console.log('[Noise Monitor] Raw data received:', data);

            // Update display with fetched decibel value
            if (data && data.decibel !== null && data.decibel !== undefined) {
                currentNoiseLevel = parseFloat(data.decibel);
                console.log('[Noise Monitor] ✅ Successfully fetched:', currentNoiseLevel, 'dB from', data.table_name, 'at', data.created_at);

                updateDisplay(currentNoiseLevel);

                // Update the table label to show which table this reading is from
                if (data.table_name) {
                    noiseTableLabel.textContent = data.table_name.replace('_', ' ');
                }
            } else {
                console.log('[Noise Monitor] No decibel value in latest record');
                updateDisplay(null);
            }
        } catch (err) {
            console.error('[Noise Monitor] ❌ Error fetching noise level:', err);
            updateDisplay(null);
        }
    }

    // Set up polling interval (4 seconds - middle of 3-5 range)
    var pollingInterval = 4000; // 4 seconds
    var intervalId = null;

    function startPolling() {
        // Initial fetch
        fetchLatestNoiseLevel();

        // Set up interval
        intervalId = setInterval(fetchLatestNoiseLevel, pollingInterval);

        console.log('Noise level polling started - fetching every', pollingInterval / 1000, 'seconds');
    }

    // Update timestamp display every second
    setInterval(updateTimestamp, 1000);

    // Wait for Supabase to be initialized before starting polling
    setTimeout(function () {
        if (window.supabaseClient) {
            startPolling();
        } else {
            console.log('Waiting for Supabase initialization...');
            // Retry after a delay
            setTimeout(function () {
                if (window.supabaseClient) {
                    startPolling();
                } else {
                    console.error('Supabase not available - noise polling disabled');
                    updateDisplay(null);
                }
            }, 2000);
        }
    }, 500);

    // Clean up on page unload
    window.addEventListener('beforeunload', function () {
        if (intervalId) {
            clearInterval(intervalId);
        }
    });

    console.log('Noise Level Monitor initialized - polling from latest_sound_per_table');

    // Leave Seat Button Functionality
    const leaveSeatBtn = document.getElementById('leaveSeatBtn');

    if (leaveSeatBtn) {
        leaveSeatBtn.addEventListener('click', async function () {
            try {
                leaveSeatBtn.disabled = true;
                leaveSeatBtn.textContent = 'Leaving...';

                // Get current user
                const { data: { user }, error: userError } = await window.supabaseClient.auth.getUser();

                if (userError || !user) {
                    alert('Error: Could not get user information');
                    leaveSeatBtn.disabled = false;
                    leaveSeatBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg> Leave Seat';
                    return;
                }

                console.log('[Leave Seat] User:', user.id);

                // Get user's UID
                const { data: userData, error: uidError } = await window.supabaseClient
                    .from('users')
                    .select('uid')
                    .eq('id', user.id)
                    .single();

                if (uidError || !userData || !userData.uid) {
                    console.error('[Leave Seat] Could not get user UID:', uidError);
                    alert('Error leaving seat. Please try again.');
                    leaveSeatBtn.disabled = false;
                    leaveSeatBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg> Leave Seat';
                    return;
                }

                const userUid = userData.uid;
                console.log('[Leave Seat] User UID:', userUid);

                // Delete tap records for this user
                const { error: deleteError } = await window.supabaseClient
                    .from('actlog_iot')
                    .delete()
                    .eq('uid', userUid)
                    .eq('event', 'tap');

                if (deleteError) {
                    console.error('[Leave Seat] Error deleting tap records:', deleteError);
                } else {
                    console.log('[Leave Seat] ✅ Tap records deleted');
                }

                // Free up all seats occupied by this user
                const { data: updateData, error: updateError } = await window.supabaseClient
                    .from('occupancy')
                    .update({
                        is_occupied: false,
                        occupied_by: null,
                        occupied_at: null,
                        updated_at: new Date().toISOString()
                    })
                    .eq('occupied_by', user.id);

                if (updateError) {
                    console.error('[Leave Seat] Error freeing seat:', updateError);
                    alert('Error leaving seat. Please try again.');
                    leaveSeatBtn.disabled = false;
                    leaveSeatBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg> Leave Seat';
                    return;
                }

                console.log('[Leave Seat] ✅ Seat freed successfully');

                // Reset the display
                updateDisplay(null);
                noiseTableLabel.textContent = 'No table selected';
                leaveSeatBtn.style.display = 'none';
                leaveSeatBtn.disabled = false;
                leaveSeatBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg> Leave Seat';

                console.log('[Leave Seat] Display reset complete');

            } catch (err) {
                console.error('[Leave Seat] Error:', err);
                alert('Error leaving seat. Please try again.');
                leaveSeatBtn.disabled = false;
                leaveSeatBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg> Leave Seat';
            }
        });
    }
})();

// Initialize Lucide icons
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

