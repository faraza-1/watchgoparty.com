// EmailJS: emails sent from noreply@watch4party.com. Add Public Key + Template ID from Dashboard.
window.EMAILJS_CONFIG = window.EMAILJS_CONFIG || {
    publicKey: 'rB9SSGJW34YB1z7eg',           // Account > API Keys
    serviceId: 'service_jr36clm',  // Gmail (noreply@watch4party.com)
    templateId: 'template_sbd06xb'          // Email Templates > Template ID
};

// Supabase: Project Settings > API > Project URL + Publishable key (browser-safe)
window.SUPABASE_CONFIG = window.SUPABASE_CONFIG || {
    url: 'https://mlsdiyiuztuqtpahszdo.supabase.co',
    anonKey: 'sb_publishable_gWaXGfBKKYjCAUjZbHZTHA_gG_sN__-'   // Project Settings > API > Publishable key (sb_publishable_...)
};

function getSupabaseClient() {
    const c = window.SUPABASE_CONFIG;
    if (!c || !c.url || !c.anonKey) return null;
    const createClient = window.createClient || (window.supabase && window.supabase.createClient);
    if (typeof createClient !== 'function') return null;
    return createClient(c.url, c.anonKey);
}

function hashPassword(password, email) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + '|' + email);
    return crypto.subtle.digest('SHA-256', data).then(buf =>
        Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
    );
}

// Temp mail block: disposable email domains (lowercase)
var TEMP_EMAIL_DOMAINS = new Set([
    '10minutemail.com', '10minutemail.net', 'tempmail.com', 'temp-mail.org', 'guerrillamail.com',
    'guerrillamail.info', 'guerrillamail.net', 'guerrillamail.org', 'guerrillamail.biz',
    'mailinator.com', 'mailinator.net', 'mailinator2.com', 'maildrop.cc', 'getnada.com',
    'throwaway.email', 'yopmail.com', 'fakeinbox.com', 'trashmail.com', 'dispostable.com',
    'mailnesia.com', 'sharklasers.com', 'grr.la', 'guerrillamailblock.com', 'spam4.me',
    'tempinbox.com', 'mohmal.com', 'emailondeck.com', 'tempail.com', 'mintemail.com',
    '33mail.com', 'inboxkitten.com', 'tmpeml.com', 'tempmailo.com', 'dropmail.me',
    'minuteinbox.com', 'mail.tm', 'ethereal.email', 'mailcatch.com', 'temp-mail.io',
    'disposablemail.com', 'getairmail.com', 'tempinbox.co', 'fakeinbox.info', 'anonymbox.com'
].map(function (d) { return d.toLowerCase(); }));

function isTempEmail(email) {
    if (!email || typeof email !== 'string') return false;
    var parts = email.trim().toLowerCase().split('@');
    if (parts.length !== 2 || !parts[1]) return false;
    var domain = parts[1];
    if (TEMP_EMAIL_DOMAINS.has(domain)) return true;
    if (domain.endsWith('.mailinator.com') || domain.endsWith('.mailinator.net')) return true;
    if (domain.startsWith('mail.') && domain.endsWith('.tm')) return true;
    return false;
}

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;
const icon = themeToggle ? themeToggle.querySelector('i') : null;

// Check local storage
const savedTheme = localStorage.getItem('theme') || 'dark';
htmlElement.setAttribute('data-theme', savedTheme);
updateIcon(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
    });
}

function updateIcon(theme) {
    if (!icon) return;
    if (theme === 'dark') {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

// Sticky Navbar Effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.style.padding = '0';
        navbar.style.backgroundColor = 'var(--bg-glass)';
    } else {
        navbar.style.padding = '10px 0';
        navbar.style.backgroundColor = 'transparent';
    }
});

// Hamburger Menu Toggle
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks = document.getElementById('navLinks');

if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a nav link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburgerBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}




// --- New Features Logic ---

// Modal Logic
const extensionModal = document.getElementById('extensionModal');

function showExtensionModal() {
    if (extensionModal) {
        extensionModal.style.display = 'flex';
        // Trigger reflow for transition
        extensionModal.offsetHeight;
        extensionModal.classList.add('active');
        extensionModal.style.opacity = '1';
    }
}

function closeModal() {
    if (extensionModal) {
        extensionModal.classList.remove('active');
        extensionModal.style.opacity = '0';
        setTimeout(() => {
            extensionModal.style.display = 'none';
        }, 300);
    }
}

function redirectToDownload() {
    closeModal();
    const downloadSection = document.getElementById('download');
    if (downloadSection) {
        downloadSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Close modal when clicking outside
if (extensionModal) {
    extensionModal.addEventListener('click', (e) => {
        if (e.target === extensionModal) {
            closeModal();
        }
    });
}

// View All Rooms Logic
const viewAllBtn = document.getElementById('viewAllBtn');

if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
        const hiddenRooms = document.querySelectorAll('.hidden-room');
        hiddenRooms.forEach(room => {
            room.style.display = 'flex'; // Use flex to maintain card layout
            room.classList.remove('hidden-room');
        });
        viewAllBtn.style.display = 'none'; // Hide button after expanding
    });
}

// Live viewer counts: realistic, NY time–based + small random variation
function getNYHour() {
    const str = new Date().toLocaleString('en-US', { timeZone: 'America/New_York', hour: '2-digit', hour12: false });
    return parseInt(str, 10) || 0;
}
// Lower in morning, peaks midday, max evening–night, drops toward dawn (New York time)
function getNYViewerMultiplier(hour) {
    if (hour >= 22) return 1.15 + (hour - 22) * 0.03;  // 22=>1.15, 23=>1.18
    if (hour < 3) return 1.2 - hour * 0.02;             // 0=>1.2, 1=>1.18, 2=>1.16 (gece max)
    if (hour >= 3 && hour < 6) return 1.0 - (hour - 3) / 3 * 0.5;  // 3=>1.0, 6=>0.5 (drop toward dawn)
    if (hour >= 6 && hour < 9) return 0.5 + (hour - 6) * 0.08;    // sabah 0.5–0.74
    if (hour >= 9 && hour < 12) return 0.74 + (hour - 9) * 0.08; // noon 0.74–0.98
    if (hour >= 12 && hour < 17) return 0.92 + (hour - 12) * 0.016; // afternoon 0.92–1.0
    return 1.0 + (hour - 17) * 0.03;  // 17–22 evening 1.0–1.15
}
function formatViewerFull(n) {
    return Math.round(n).toLocaleString();
}
function formatViewerShort(n) {
    const r = Math.round(n);
    if (r >= 1000) {
        const k = r / 1000;
        if (k >= 2.5) return '+' + Math.round(k) + 'k';
        if (k >= 1.5) return '+' + (Math.round(k * 10) / 10) + 'k';
        return '+' + (k >= 1 ? '1k' : (Math.round(k * 10) / 10) + 'k');
    }
    return '+' + r;
}
function tickLiveViewerCounts() {
    const nyHour = getNYHour();
    const mult = getNYViewerMultiplier(nyHour);
    const cards = document.querySelectorAll('.room-card[data-base-viewers]');
    cards.forEach(card => {
        const base = parseInt(card.getAttribute('data-base-viewers'), 10) || 1000;
        const effectiveBase = Math.round(base * mult);
        let current = parseInt(card.getAttribute('data-current-viewers'), 10);
        if (isNaN(current)) current = effectiveBase;
        const spread = Math.max(1, Math.floor(effectiveBase * 0.025));
        const delta = Math.floor(Math.random() * (spread * 2 + 1)) - spread;
        current = current + delta;
        const min = Math.max(1, Math.floor(effectiveBase * 0.88));
        const max = Math.floor(effectiveBase * 1.12);
        current = Math.min(max, Math.max(min, current));
        card.setAttribute('data-current-viewers', current);
        const countEl = card.querySelector('.room-viewer-count');
        const shortEl = card.querySelector('.room-viewer-short');
        if (countEl) countEl.textContent = formatViewerFull(current);
        if (shortEl) shortEl.textContent = formatViewerShort(current);
    });
}
function startLiveViewerUpdates() {
    tickLiveViewerCounts();
    setInterval(tickLiveViewerCounts, 2500 + Math.random() * 1500);
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startLiveViewerUpdates);
} else {
    startLiveViewerUpdates();
}

// --- Auth Logic ---
function initAuth() {
    // Select forms safely
    const authForm = document.querySelector('.auth-card form');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    // Identify Page Type
    const isRegisterPage = !!(authForm && usernameInput && confirmPasswordInput);
    const isLoginPage = !!(authForm && emailInput && passwordInput && !usernameInput);

    // Handle Register
    if (isRegisterPage) {
        // Password strength indicator
        const strengthFill = document.getElementById('passwordStrengthFill');
        const strengthLabel = document.getElementById('passwordStrengthLabel');
        if (passwordInput && strengthFill && strengthLabel) {
            function updatePasswordStrength() {
                const p = passwordInput.value;
                let score = 0;
                if (p.length >= 8) score += 20;
                if (p.length >= 12) score += 15;
                if (p.length >= 16) score += 10;
                if (/[a-z]/.test(p)) score += 15;
                if (/[A-Z]/.test(p)) score += 15;
                if (/\d/.test(p)) score += 15;
                if (/[^a-zA-Z0-9]/.test(p)) score += 10;

                const level = score < 25 ? 'weak' : score < 50 ? 'fair' : score < 75 ? 'good' : 'strong';
                const labels = { weak: 'Weak', fair: 'Fair', good: 'Good', strong: 'Strong' };
                const width = Math.min(100, score);

                strengthFill.style.width = width + '%';
                strengthFill.className = 'password-strength-fill ' + (p.length ? level : '');
                strengthLabel.textContent = p.length ? labels[level] : '';
            }
            passwordInput.addEventListener('input', updatePasswordStrength);
            passwordInput.addEventListener('focus', updatePasswordStrength);
        }

        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = usernameInput.value;
            const email = emailInput.value;
            const password = passwordInput.value;
            const confirmPass = confirmPasswordInput.value;

            if (password.length < 8) {
                alert("Password must be at least 8 characters!");
                return;
            }
            if (password !== confirmPass) {
                alert("Passwords do not match!");
                return;
            }

            if (isTempEmail(email)) {
                alert("Temporary email addresses are not allowed. Please use a permanent email address.");
                return;
            }

            const verificationToken = Array.from(crypto.getRandomValues(new Uint8Array(24)))
                .map(b => b.toString(16).padStart(2, '0')).join('');

            const btn = authForm.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'Creating account...';
            btn.disabled = true;

            const baseUrl = (typeof window.WATCH4PARTY_BASE_URL !== 'undefined' && window.WATCH4PARTY_BASE_URL)
                ? window.WATCH4PARTY_BASE_URL.replace(/\/$/, '')
                : (window.location.origin + window.location.pathname.replace(/\/register\/?.*$/, '').replace(/\/$/, ''));
            const verifyUrl = baseUrl + '/verify-email/?token=' + encodeURIComponent(verificationToken);

            function redirectToCheckEmail() {
                window.location.href = 'check-email.html?email=' + encodeURIComponent(email);
            }

            const supabase = getSupabaseClient();
            if (supabase) {
                try {
                    var clientIp = '';
                    try {
                        var ipRes = await fetch('https://api.ipify.org?format=json', { method: 'GET' });
                        if (ipRes.ok) {
                            var ipJson = await ipRes.json();
                            if (ipJson && ipJson.ip) clientIp = String(ipJson.ip).trim();
                        }
                    } catch (_) {}
                    if (!clientIp) {
                        alert("Could not get your IP address. Please check your connection and try again.");
                        btn.textContent = originalText;
                        btn.disabled = false;
                        return;
                    }
                    const passwordHash = await hashPassword(password, email);
                    const { error } = await supabase.rpc('register_with_ip', {
                        p_email: email,
                        p_username: username,
                        p_password_hash: passwordHash,
                        p_verification_token: verificationToken,
                        p_ip: clientIp
                    });
                    if (error) {
                        if (error.code === '23505' || (error.message && error.message.indexOf('duplicate') !== -1)) {
                            alert("User with this email already exists!");
                        } else if (error.message && error.message.indexOf('ONE_IP_PER_ACCOUNT') !== -1) {
                            alert("An account has already been created from this connection. Only one account per IP address is allowed.");
                        } else {
                            alert("Registration failed. Please try again.");
                        }
                        btn.textContent = originalText;
                        btn.disabled = false;
                        return;
                    }
                } catch (err) {
                    console.warn('Supabase register failed', err);
                    if (err && err.message && err.message.indexOf('ONE_IP_PER_ACCOUNT') !== -1) {
                        alert("An account has already been created from this connection. Only one account per IP address is allowed.");
                    } else {
                        alert("Registration failed. Please try again.");
                    }
                    btn.textContent = originalText;
                    btn.disabled = false;
                    return;
                }
            } else {
                let users = [];
                try {
                    users = JSON.parse(localStorage.getItem('watch4party_users') || '[]');
                } catch (_) { users = []; }
                if (!Array.isArray(users)) users = [];
                if (users.find(u => u.email === email)) {
                    alert("User with this email already exists!");
                    btn.textContent = originalText;
                    btn.disabled = false;
                    return;
                }
                users.push({ username, email, password, verified: false, verificationToken });
                localStorage.setItem('watch4party_users', JSON.stringify(users));
            }

            btn.textContent = 'Sending verification email...';
            const config = window.EMAILJS_CONFIG || {};
            if (config.publicKey && config.serviceId && config.templateId && typeof window.emailjs !== 'undefined') {
                window.emailjs.init(config.publicKey);
                window.emailjs.send(config.serviceId, config.templateId, {
                    to_email: email,
                    username: username,
                    verify_link: verifyUrl,
                    company_name: 'Watch4Party'
                }).then(function () {
                    redirectToCheckEmail();
                }).catch(function (err) {
                    console.warn('EmailJS send failed', err);
                    alert('Could not send email. If using localhost, add http://localhost to "Allowed domains" in EmailJS Dashboard. Error: ' + (err.text || err.message || 'unknown'));
                    redirectToCheckEmail();
                });
            } else {
                setTimeout(redirectToCheckEmail, 600);
            }
        });
    }

    // Handle Login
    if (isLoginPage) {
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = emailInput.value;
            const password = passwordInput.value;

            const supabase = getSupabaseClient();
            let validUser = null;

            if (supabase) {
                try {
                    const passwordHash = await hashPassword(password, email);
                    const { data, error } = await supabase.rpc('get_user_for_login', {
                        p_email: email,
                        p_password_hash: passwordHash
                    });
                    if (!error && data && data.length > 0) {
                        const row = data[0];
                        validUser = {
                            id: row.id,
                            email: row.email,
                            username: row.username,
                            verified: row.verified,
                            verifiedDeviceToken: row.verified_device_token || null
                        };
                    }
                } catch (err) {
                    console.warn('Supabase login failed', err);
                }
            } else {
                let users = [];
                try {
                    users = JSON.parse(localStorage.getItem('watch4party_users') || '[]');
                } catch (_) { users = []; }
                if (!Array.isArray(users)) users = [];
                validUser = users.find(u => u.email === email && u.password === password) || null;
            }

            if (validUser) {
                if (validUser.verified === false) {
                    alert("Please verify your email first. Check your inbox for the verification link.");
                    return;
                }
                if (validUser.verifiedDeviceToken) {
                    var storedToken = localStorage.getItem('watch4party_device_token');
                    if (storedToken !== validUser.verifiedDeviceToken) {
                        alert("You can only sign in from the device where you clicked the verification link. Please open the link on that device and sign in there.");
                        return;
                    }
                }
                localStorage.setItem('watch4party_currentUser', JSON.stringify(validUser));
                const btn = authForm.querySelector('button');
                btn.textContent = 'Logging In...';
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 800);
            } else {
                alert("Invalid email or password!");
            }
        });
    }

    // Check Auth State (Global)
    checkAuthState();
}

// Run when DOM is ready (script is at end of body so DOM may already be loaded)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
} else {
    initAuth();
}

function checkAuthState() {
    let currentUser = null;
    try {
        currentUser = JSON.parse(localStorage.getItem('watch4party_currentUser'));
    } catch (_) {
        currentUser = null;
    }
    const authBtn = document.querySelector('.navbar .desktop-only .btn-primary');

    // Only run this on pages with the navbar login button (like index.html)
    if (currentUser && authBtn && authBtn.textContent.trim() === 'Login') {
        const parent = authBtn.parentElement;
        const dropdown = document.createElement('div');
        dropdown.className = 'profile-dropdown';
        dropdown.innerHTML = `
            <button type="button" class="btn profile-dropdown-trigger" aria-expanded="false" aria-haspopup="true">
                <span>${escapeHtml(currentUser.username)}</span>
                <i class="fa-solid fa-chevron-down"></i>
            </button>
            <div class="profile-dropdown-menu" role="menu">
                <nav class="profile-menu-nav">
                    <a href="profile/" class="profile-menu-item"><i class="fa-solid fa-user"></i> My Profile</a>
                    <a href="profile/#watchlist" class="profile-menu-item"><i class="fa-solid fa-bookmark"></i> Watchlist</a>
                    <a href="settings/" class="profile-menu-item"><i class="fa-solid fa-gear"></i> Settings</a>
                    <button type="button" class="profile-menu-item profile-menu-logout"><i class="fa-solid fa-right-from-bracket"></i> Log Out</button>
                </nav>
            </div>
        `;
        parent.replaceChild(dropdown, authBtn);

        const trigger = dropdown.querySelector('.profile-dropdown-trigger');
        const menu = dropdown.querySelector('.profile-dropdown-menu');
        const logoutBtn = dropdown.querySelector('.profile-menu-logout');

        menu.style.display = 'none';

        function setMenuOpen(open) {
            menu.style.display = open ? 'block' : 'none';
            dropdown.classList.toggle('open', open);
            trigger.setAttribute('aria-expanded', open);
        }

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            setMenuOpen(menu.style.display !== 'block');
        });

        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            setMenuOpen(false);
            if (confirm(`Log out as ${currentUser.username}?`)) {
                localStorage.removeItem('watch4party_currentUser');
                window.location.reload();
            }
        });

        dropdown.querySelectorAll('.profile-menu-item[href]').forEach((link) => {
            link.addEventListener('click', () => setMenuOpen(false));
        });

        document.addEventListener('click', () => setMenuOpen(false));
        menu.addEventListener('click', (e) => e.stopPropagation());
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

